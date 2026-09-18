import { SyncQueue } from '../storage/SyncQueue';
import {
  FelisApiClient,
  FelisApiError,
  ProjectsApi,
  TasksApi,
  FocusApi,
} from '@felis/api-client';
import { LocalProjectRepository } from '../storage/LocalProjectRepository';
import { LocalTaskRepository } from '../storage/LocalTaskRepository';
import { LocalFocusRepository } from '../storage/LocalFocusRepository';

export class SyncManager {
  private queue: SyncQueue;
  private isRunning: boolean = false;
  private projectsApi: ProjectsApi;
  private tasksApi: TasksApi;
  private focusApi: FocusApi;

  constructor(
    private apiClient: FelisApiClient,
    private localProjects: LocalProjectRepository,
    private localTasks: LocalTaskRepository,
    private localFocus: LocalFocusRepository = new LocalFocusRepository()
  ) {
    this.queue = new SyncQueue();
    this.projectsApi = new ProjectsApi(apiClient);
    this.tasksApi = new TasksApi(apiClient);
    this.focusApi = new FocusApi(apiClient);
  }

  async sync(userId?: string): Promise<void> {
    if (this.isRunning) return;
    if (userId === undefined || userId === null || userId === 'local') {
      // Don't attempt cloud sync without a real authenticated session
      return;
    }

    this.isRunning = true;
    try {
      const pending = await this.queue.getRetryable(userId);
      for (const mutation of pending) {
        await this.processMutation(mutation);
      }
    } finally {
      this.isRunning = false;
    }
  }

  private async processMutation(mutation: any): Promise<void> {
    try {
      switch (mutation.type) {
        case 'CREATE_TASK': {
          const task = await this.tasksApi.create(mutation.payload, mutation.id);
          await this.localTasks.upsert({
            ...mutation.payload,
            ...(task || {}),
            syncStatus: 'synced',
          });
          await this.queue.markSynced(mutation.id);
          break;
        }
        case 'UPDATE_TASK': {
          const id = mutation.payload.id || mutation.payload.taskId;
          const task = await this.tasksApi.update(id, mutation.payload, mutation.id);
          if (task) {
            await this.localTasks.upsert({
              ...task,
              syncStatus: 'synced',
            });
          }
          await this.queue.markSynced(mutation.id);
          break;
        }
        case 'DELETE_TASK': {
          const id = mutation.payload.id || mutation.payload.taskId;
          await this.tasksApi.delete(id, mutation.id);
          await this.queue.markSynced(mutation.id);
          break;
        }
        case 'COMPLETE_TASK': {
          const id = mutation.payload.taskId || mutation.payload.id;
          await this.tasksApi.complete(id, mutation.id);
          await this.queue.markSynced(mutation.id);
          break;
        }
        case 'CREATE_PROJECT': {
          const project = await this.projectsApi.create(mutation.payload, mutation.id);
          await this.localProjects.upsert({
            ...mutation.payload,
            ...(project || {}),
            syncStatus: 'synced',
          });
          await this.queue.markSynced(mutation.id);
          break;
        }
        case 'UPDATE_PROJECT': {
          const id = mutation.payload.id;
          const project = await this.projectsApi.update(id, mutation.payload, mutation.id);
          if (project) {
            await this.localProjects.upsert({
              ...project,
              syncStatus: 'synced',
            });
          }
          await this.queue.markSynced(mutation.id);
          break;
        }
        case 'DELETE_PROJECT': {
          const id = mutation.payload.id;
          await this.projectsApi.delete(id, mutation.id);
          await this.queue.markSynced(mutation.id);
          break;
        }
        case 'START_FOCUS': {
          await this.focusApi.start(
            mutation.payload.taskId,
            mutation.payload.plannedMinutes,
            mutation.payload.id,
            mutation.id
          );
          const existing = await this.localFocus.getById(mutation.payload.id);
          if (existing) {
            await this.localFocus.upsert({
              ...existing,
              syncStatus: 'synced',
            });
          }
          await this.queue.markSynced(mutation.id);
          break;
        }
        case 'END_FOCUS': {
          await this.focusApi.end(
            mutation.payload.id,
            mutation.payload.endedAt,
            mutation.payload.actualMinutes,
            mutation.payload.status || 'finished',
            mutation.id
          );
          const existing = await this.localFocus.getById(mutation.payload.id);
          if (existing) {
            await this.localFocus.upsert({
              ...existing,
              syncStatus: 'synced',
            });
          }
          await this.queue.markSynced(mutation.id);
          break;
        }
        default:
          console.warn('[SyncManager] Unknown mutation type:', mutation.type);
      }
    } catch (err: any) {
      const message = err?.message || 'Sync error';
      let isTransient = true;
      if (err instanceof FelisApiError || typeof err?.statusCode === 'number') {
        const statusCode = err.statusCode;
        // Non-transient errors (4xx client errors that won't succeed on retry)
        if (
          statusCode === 400 ||
          statusCode === 401 ||
          statusCode === 403 ||
          statusCode === 404 ||
          statusCode === 422
        ) {
          isTransient = false;
        }
      }
      await this.queue.markFailed(mutation.id, message, isTransient);
    }
  }

  async getSyncStatus(userId?: string): Promise<'synced' | 'pending' | 'failed'> {
    if (!userId || userId === 'local') return 'synced';
    const failed = await this.queue.countFailed(userId);
    if (failed > 0) return 'failed';
    const pending = await this.queue.countPending(userId);
    if (pending > 0) return 'pending';
    return 'synced';
  }
}


