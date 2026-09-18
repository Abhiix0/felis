import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('expo-sqlite', () => ({
  openDatabaseAsync: vi.fn(async () => ({
    execAsync: vi.fn(async () => {}),
    runAsync: vi.fn(async () => {}),
    getAllAsync: vi.fn(async () => []),
    getFirstAsync: vi.fn(async () => null),
  })),
}));

vi.mock('@react-native-community/netinfo', () => ({
  default: {
    addEventListener: vi.fn((cb) => {
      return () => {};
    }),
    fetch: vi.fn(async () => ({ isConnected: true, isInternetReachable: true })),
  },
}));

import { SyncManager } from '../sync/SyncManager';
import { FelisApiClient, FelisApiError } from '@felis/api-client';
import { LocalTaskRepository } from '../storage/LocalTaskRepository';
import { LocalProjectRepository } from '../storage/LocalProjectRepository';
import { LocalFocusRepository } from '../storage/LocalFocusRepository';

describe('SyncManager Contract & Multi-User Isolation Tests', () => {
  let mockApiClient: FelisApiClient;
  let requestsMade: { method: string; path: string; body: any; mutationId?: string }[] = [];
  let mockTaskRepo: LocalTaskRepository;
  let mockProjectRepo: LocalProjectRepository;
  let mockFocusRepo: LocalFocusRepository;

  beforeEach(() => {
    requestsMade = [];

    mockApiClient = {
      request: vi.fn(async (method: string, path: string, options: any = {}) => {
        requestsMade.push({
          method,
          path,
          body: options.body,
          mutationId: options.clientMutationId,
        });
        if (path === '/tasks' && method === 'POST') {
          return { ...options.body, id: options.body.id || 'srv-t1' };
        }
        if (path === '/projects' && method === 'POST') {
          return { ...options.body, id: options.body.id || 'srv-p1' };
        }
        if (method === 'PATCH' || method === 'POST') {
          return { ...options.body };
        }
        return undefined;
      }),
      get: vi.fn(async (path: string) => mockApiClient.request('GET', path)),
      post: vi.fn(async (path: string, body?: any, mutationId?: string) =>
        mockApiClient.request('POST', path, { body, clientMutationId: mutationId })
      ),
      patch: vi.fn(async (path: string, body?: any, mutationId?: string) =>
        mockApiClient.request('PATCH', path, { body, clientMutationId: mutationId })
      ),
      delete: vi.fn(async (path: string, mutationId?: string) =>
        mockApiClient.request('DELETE', path, { clientMutationId: mutationId })
      ),
      put: vi.fn(async (path: string, body?: any, mutationId?: string) =>
        mockApiClient.request('PUT', path, { body, clientMutationId: mutationId })
      ),
    } as unknown as FelisApiClient;

    mockTaskRepo = {
      upsert: vi.fn(async () => {}),
      delete: vi.fn(async () => {}),
      getById: vi.fn(async () => null),
    } as unknown as LocalTaskRepository;

    mockProjectRepo = {
      upsert: vi.fn(async () => {}),
      delete: vi.fn(async () => {}),
      getById: vi.fn(async () => null),
    } as unknown as LocalProjectRepository;

    mockFocusRepo = {
      getById: vi.fn(async () => ({ id: 'f1', userId: 'u1', taskId: 't1', plannedMinutes: 25, startedAt: '2026-09-18T00:00:00Z', status: 'finished', pausedTotalSeconds: 0 })),
      upsert: vi.fn(async () => {}),
    } as unknown as LocalFocusRepository;
  });

  it('Serializes CREATE_TASK payload from camelCase to correct snake_case body and preserves UUID', async () => {
    const syncManager = new SyncManager(mockApiClient, mockProjectRepo, mockTaskRepo, mockFocusRepo);

    const taskMutation = {
      id: 'mut-1',
      userId: 'user-A',
      type: 'CREATE_TASK',
      payload: {
        id: '11111111-1111-4111-8111-111111111111',
        projectId: '22222222-2222-4222-8222-222222222222',
        title: 'Offline Task',
        description: 'Details',
        priority: 'high',
        dueDate: '2026-10-01',
        dueTime: '14:30',
        estimateMinutes: 45,
      },
    };

    (syncManager as any).queue.getRetryable = vi.fn(async () => [taskMutation]);
    (syncManager as any).queue.markSynced = vi.fn(async () => {});

    await syncManager.sync('user-A');

    expect(requestsMade).toHaveLength(1);
    const req = requestsMade[0];
    expect(req.method).toBe('POST');
    expect(req.path).toBe('/tasks');
    expect(req.mutationId).toBe('mut-1');
    expect(req.body).toEqual({
      id: '11111111-1111-4111-8111-111111111111',
      project_id: '22222222-2222-4222-8222-222222222222',
      title: 'Offline Task',
      description: 'Details',
      priority: 'high',
      due_date: '2026-10-01',
      due_time: '14:30',
      estimate_minutes: 45,
    });
    expect((syncManager as any).queue.markSynced).toHaveBeenCalledWith('mut-1');
  });

  it('Serializes CREATE_PROJECT payload with snake_case tech_stack and icon_type and preserves UUID', async () => {
    const syncManager = new SyncManager(mockApiClient, mockProjectRepo, mockTaskRepo, mockFocusRepo);

    const projectMutation = {
      id: 'mut-2',
      userId: 'user-A',
      type: 'CREATE_PROJECT',
      payload: {
        id: '33333333-3333-4333-8333-333333333333',
        name: 'FELIS App',
        goal: 'Ship Phase 0-8',
        description: 'Mobile & Desktop',
        techStack: ['TypeScript', 'FastAPI'],
        iconType: 'terminal',
      },
    };

    (syncManager as any).queue.getRetryable = vi.fn(async () => [projectMutation]);
    (syncManager as any).queue.markSynced = vi.fn(async () => {});

    await syncManager.sync('user-A');

    expect(requestsMade).toHaveLength(1);
    const req = requestsMade[0];
    expect(req.method).toBe('POST');
    expect(req.path).toBe('/projects');
    expect(req.mutationId).toBe('mut-2');
    expect(req.body).toEqual({
      id: '33333333-3333-4333-8333-333333333333',
      name: 'FELIS App',
      goal: 'Ship Phase 0-8',
      description: 'Mobile & Desktop',
      tech_stack: ['TypeScript', 'FastAPI'],
      icon_type: 'terminal',
    });
  });

  it('Uses PATCH (not PUT) for UPDATE_TASK and UPDATE_PROJECT', async () => {
    const syncManager = new SyncManager(mockApiClient, mockProjectRepo, mockTaskRepo, mockFocusRepo);

    const updateTaskMutation = {
      id: 'mut-3',
      userId: 'user-A',
      type: 'UPDATE_TASK',
      payload: {
        id: 't-1',
        title: 'Updated Task Title',
        estimateMinutes: 60,
      },
    };

    const updateProjMutation = {
      id: 'mut-4',
      userId: 'user-A',
      type: 'UPDATE_PROJECT',
      payload: {
        id: 'p-1',
        name: 'Updated Project Name',
      },
    };

    (syncManager as any).queue.getRetryable = vi.fn(async () => [updateTaskMutation, updateProjMutation]);
    (syncManager as any).queue.markSynced = vi.fn(async () => {});

    await syncManager.sync('user-A');

    expect(requestsMade).toHaveLength(2);
    expect(requestsMade[0].method).toBe('PATCH');
    expect(requestsMade[0].path).toBe('/tasks/t-1');
    expect(requestsMade[0].body).toEqual({
      id: 't-1',
      title: 'Updated Task Title',
      estimate_minutes: 60,
    });

    expect(requestsMade[1].method).toBe('PATCH');
    expect(requestsMade[1].path).toBe('/projects/p-1');
    expect(requestsMade[1].body).toEqual({
      id: 'p-1',
      name: 'Updated Project Name',
    });

    // Ensure NO PUT requests were made
    expect(requestsMade.some((r) => r.method === 'PUT')).toBe(false);
  });

  it('Executes DELETE_TASK and COMPLETE_TASK mutations correctly', async () => {
    const syncManager = new SyncManager(mockApiClient, mockProjectRepo, mockTaskRepo, mockFocusRepo);

    const deleteMutation = {
      id: 'mut-5',
      userId: 'user-A',
      type: 'DELETE_TASK',
      payload: { id: 't-del' },
    };

    const completeMutation = {
      id: 'mut-6',
      userId: 'user-A',
      type: 'COMPLETE_TASK',
      payload: { taskId: 't-comp' },
    };

    (syncManager as any).queue.getRetryable = vi.fn(async () => [deleteMutation, completeMutation]);
    (syncManager as any).queue.markSynced = vi.fn(async () => {});

    await syncManager.sync('user-A');

    expect(requestsMade[0].method).toBe('DELETE');
    expect(requestsMade[0].path).toBe('/tasks/t-del');
    expect(requestsMade[1].method).toBe('POST');
    expect(requestsMade[1].path).toBe('/tasks/t-comp/complete');
  });

  it('Isolates queues across users: sync(User B) only queries and processes User B mutations', async () => {
    const syncManager = new SyncManager(mockApiClient, mockProjectRepo, mockTaskRepo, mockFocusRepo);

    const mockGetRetryable = vi.fn(async (userId?: string) => {
      if (userId === 'user-B') {
        return [
          {
            id: 'mut-user-B',
            userId: 'user-B',
            type: 'CREATE_TASK',
            payload: { id: 't-user-B', title: 'Task for User B' },
          },
        ];
      }
      return [];
    });

    (syncManager as any).queue.getRetryable = mockGetRetryable;
    (syncManager as any).queue.markSynced = vi.fn(async () => {});

    await syncManager.sync('user-B');

    expect(mockGetRetryable).toHaveBeenCalledWith('user-B');
    expect(requestsMade).toHaveLength(1);
    expect(requestsMade[0].body.title).toBe('Task for User B');
    expect((syncManager as any).queue.markSynced).toHaveBeenCalledWith('mut-user-B');
  });

  it('Classifies transient vs permanent errors: 422 is non-transient, 500 is transient', async () => {
    const syncManager = new SyncManager(mockApiClient, mockProjectRepo, mockTaskRepo, mockFocusRepo);

    const permanentError = new FelisApiError(
      { code: 'VALIDATION_ERROR', message: 'Invalid data', requestId: 'r1' },
      422
    );
    const transientError = new FelisApiError(
      { code: 'INTERNAL_ERROR', message: 'Server error', requestId: 'r2' },
      500
    );

    const markFailedMock = vi.fn(async () => {});
    (syncManager as any).queue.markFailed = markFailedMock;

    // 1. Process mutation failing with 422
    (mockApiClient.request as any).mockRejectedValueOnce(permanentError);
    (syncManager as any).queue.getRetryable = vi.fn(async () => [
      { id: 'mut-perm', userId: 'user-A', type: 'CREATE_TASK', payload: { title: 'Bad' } },
    ]);
    await syncManager.sync('user-A');
    expect(markFailedMock).toHaveBeenCalledWith('mut-perm', 'Invalid data', false);

    // 2. Process mutation failing with 500
    (mockApiClient.request as any).mockRejectedValueOnce(transientError);
    (syncManager as any).queue.getRetryable = vi.fn(async () => [
      { id: 'mut-trans', userId: 'user-A', type: 'CREATE_TASK', payload: { title: 'Good' } },
    ]);
    await syncManager.sync('user-A');
    expect(markFailedMock).toHaveBeenCalledWith('mut-trans', 'Server error', true);
  });
});
