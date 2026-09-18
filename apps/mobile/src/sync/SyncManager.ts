import { SyncQueue } from '../storage/SyncQueue';
import { FelisApiClient } from '@felis/api-client';
import { LocalProjectRepository } from '../storage/LocalProjectRepository';
import { LocalTaskRepository } from '../storage/LocalTaskRepository';
import { LocalFocusRepository } from '../storage/LocalFocusRepository';

export class SyncManager {
  private queue: SyncQueue;
  private isRunning: boolean = false;

  constructor(
    private apiClient: FelisApiClient,
    private localProjects: LocalProjectRepository,
    private localTasks: LocalTaskRepository,
    private localFocus: LocalFocusRepository = new LocalFocusRepository()
  ) {
    this.queue = new SyncQueue();
  }

  async sync(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    try {
      const pending = await this.queue.getRetryable();
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
          const task = await this.apiClient.post<any>('/tasks', mutation.payload, mutation.id);
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
          const task = await this.apiClient.put<any>(`/tasks/${id}`, mutation.payload, mutation.id);
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
          await this.apiClient.delete(`/tasks/${id}`, mutation.id);
          await this.queue.markSynced(mutation.id);
          break;
        }
        case 'COMPLETE_TASK': {
          const id = mutation.payload.taskId || mutation.payload.id;
          await this.apiClient.post(
            `/tasks/${id}/complete`,
            {},
            mutation.id
          );
          await this.queue.markSynced(mutation.id);
          break;
        }
        case 'CREATE_PROJECT': {
          const project = await this.apiClient.post<any>(
            '/projects',
            mutation.payload,
            mutation.id
          );
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
          const project = await this.apiClient.put<any>(
            `/projects/${id}`,
            mutation.payload,
            mutation.id
          );
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
          await this.apiClient.delete(`/projects/${id}`, mutation.id);
          await this.queue.markSynced(mutation.id);
          break;
        }
        case 'START_FOCUS': {
          await this.apiClient.post(
            '/focus-sessions',
            {
              id: mutation.payload.id,
              taskId: mutation.payload.taskId,
              plannedMinutes: mutation.payload.plannedMinutes,
            },
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
          await this.apiClient.patch(
            `/focus-sessions/${mutation.payload.id}`,
            {
              endedAt: mutation.payload.endedAt,
              actualMinutes: mutation.payload.actualMinutes,
              status: mutation.payload.status,
            },
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
      await this.queue.markFailed(mutation.id, message);
    }
  }

  async getSyncStatus(): Promise<'synced' | 'pending' | 'failed'> {
    const failed = await this.queue.countFailed();
    if (failed > 0) return 'failed';
    const pending = await this.queue.countPending();
    if (pending > 0) return 'pending';
    return 'synced';
  }
}

