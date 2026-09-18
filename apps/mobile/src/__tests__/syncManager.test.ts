import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('expo-sqlite', () => ({
  openDatabaseAsync: vi.fn(async () => ({
    execAsync: vi.fn(async () => {}),
    runAsync: vi.fn(async () => {}),
    getAllAsync: vi.fn(async () => []),
    getFirstAsync: vi.fn(async () => null),
  })),
}));

import { SyncManager } from '../sync/SyncManager';
import { SyncQueue } from '../storage/SyncQueue';
import { LocalTaskRepository } from '../storage/LocalTaskRepository';
import { LocalProjectRepository } from '../storage/LocalProjectRepository';
import { LocalFocusRepository } from '../storage/LocalFocusRepository';
import type { FelisApiClient } from '@felis/api-client';

describe('SyncManager & Offline State Machine', () => {
  let mockApiClient: FelisApiClient;
  let mockTaskRepo: LocalTaskRepository;
  let mockProjectRepo: LocalProjectRepository;
  let mockFocusRepo: LocalFocusRepository;

  beforeEach(() => {
    mockApiClient = {
      post: vi.fn(async () => ({ id: 'srv-1', title: 'Synced Task' })),
      put: vi.fn(async () => ({ id: 'srv-1', title: 'Updated Task' })),
      patch: vi.fn(async () => ({ id: 'srv-1', status: 'finished' })),
      delete: vi.fn(async () => {}),
    } as unknown as FelisApiClient;

    mockTaskRepo = {
      upsert: vi.fn(async () => {}),
      delete: vi.fn(async () => {}),
    } as unknown as LocalTaskRepository;

    mockProjectRepo = {
      upsert: vi.fn(async () => {}),
      delete: vi.fn(async () => {}),
    } as unknown as LocalProjectRepository;

    mockFocusRepo = {
      getById: vi.fn(async () => ({ id: 'f1', userId: 'u1', taskId: 't1', plannedMinutes: 25, startedAt: '2026-09-18T00:00:00Z', status: 'finished', pausedTotalSeconds: 0 })),
      upsert: vi.fn(async () => {}),
    } as unknown as LocalFocusRepository;
  });

  it('Processes CREATE_TASK, COMPLETE_TASK, and CREATE_PROJECT correctly', async () => {
    const syncManager = new SyncManager(
      mockApiClient,
      mockProjectRepo,
      mockTaskRepo,
      mockFocusRepo
    );

    const mutations = [
      { id: 'm1', type: 'CREATE_TASK', payload: { id: 't1', title: 'Local Task' } },
      { id: 'm2', type: 'COMPLETE_TASK', payload: { taskId: 't1' } },
      { id: 'm3', type: 'CREATE_PROJECT', payload: { id: 'p1', name: 'Project 1' } },
      { id: 'm4', type: 'START_FOCUS', payload: { id: 'f1', taskId: 't1', plannedMinutes: 25 } },
      { id: 'm5', type: 'END_FOCUS', payload: { id: 'f1', endedAt: '2026-09-18T01:00:00Z', actualMinutes: 25, status: 'finished' } },
    ];

    // Mock getRetryable to return our mutations
    (syncManager as any).queue.getRetryable = vi.fn(async () => mutations);
    (syncManager as any).queue.markSynced = vi.fn(async () => {});

    await syncManager.sync();

    expect(mockApiClient.post).toHaveBeenCalledWith('/tasks', { id: 't1', title: 'Local Task' }, 'm1');
    expect(mockApiClient.post).toHaveBeenCalledWith('/tasks/t1/complete', {}, 'm2');
    expect(mockApiClient.post).toHaveBeenCalledWith('/projects', { id: 'p1', name: 'Project 1' }, 'm3');
    expect(mockApiClient.post).toHaveBeenCalledWith('/focus-sessions', { id: 'f1', taskId: 't1', plannedMinutes: 25 }, 'm4');
    expect(mockApiClient.patch).toHaveBeenCalledWith('/focus-sessions/f1', { endedAt: '2026-09-18T01:00:00Z', actualMinutes: 25, status: 'finished' }, 'm5');
  });

  it('Marks failed with error when API call throws', async () => {
    (mockApiClient.post as any).mockRejectedValueOnce(new Error('Network offline'));

    const syncManager = new SyncManager(
      mockApiClient,
      mockProjectRepo,
      mockTaskRepo,
      mockFocusRepo
    );

    const mutations = [
      { id: 'm-fail', type: 'CREATE_TASK', payload: { id: 't-fail', title: 'Fail Task' } },
    ];

    (syncManager as any).queue.getRetryable = vi.fn(async () => mutations);
    (syncManager as any).queue.markFailed = vi.fn(async () => {});

    await syncManager.sync();

    expect((syncManager as any).queue.markFailed).toHaveBeenCalledWith('m-fail', 'Network offline');
  });
});
