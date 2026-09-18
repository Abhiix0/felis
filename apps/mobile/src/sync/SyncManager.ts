import { SyncQueue } from '../storage/SyncQueue';
import { FelisApiClient } from '@felis/api-client';
import { LocalProjectRepository } from '../storage/LocalProjectRepository';
import { LocalTaskRepository } from '../storage/LocalTaskRepository';

export class SyncManager {
  private queue: SyncQueue;
  private isRunning: boolean = false;

  constructor(
    private apiClient: FelisApiClient,
    private localProjects: LocalProjectRepository,
    private localTasks: LocalTaskRepository,
  ) {
    this.queue = new SyncQueue();
  }

  async sync(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    try {
      const pending = await this.queue.getPending();
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
        case 'COMPLETE_TASK': {
          await this.apiClient.post(
            `/tasks/${mutation.payload.taskId}/complete`,
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
