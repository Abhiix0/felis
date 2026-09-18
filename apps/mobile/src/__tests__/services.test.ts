import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('expo-sqlite', () => ({
  openDatabaseAsync: vi.fn(async () => ({
    execAsync: vi.fn(async () => {}),
    runAsync: vi.fn(async () => {}),
    getAllAsync: vi.fn(async () => []),
    getFirstAsync: vi.fn(async () => null),
  })),
}));

import { TaskService } from '../services/TaskService';
import { ProjectService } from '../services/ProjectService';
import { FocusService } from '../services/FocusService';
import { SyncQueue } from '../storage/SyncQueue';
import { LocalTaskRepository } from '../storage/LocalTaskRepository';
import { LocalProjectRepository } from '../storage/LocalProjectRepository';
import { LocalFocusRepository } from '../storage/LocalFocusRepository';
import type { Task, Project, FocusSession } from '@felis/types';

describe('Mobile Services (Single UUID & User Scoping)', () => {
  let mockTaskRepo: LocalTaskRepository;
  let mockProjectRepo: LocalProjectRepository;
  let mockFocusRepo: LocalFocusRepository;
  let mockQueue: SyncQueue;

  let taskStore: Task[] = [];
  let projectStore: Project[] = [];
  let focusStore: FocusSession[] = [];
  let queueStore: any[] = [];

  beforeEach(() => {
    taskStore = [];
    projectStore = [];
    focusStore = [];
    queueStore = [];

    mockTaskRepo = {
      getAll: vi.fn(async (userId: string = 'local') => taskStore.filter((t) => t.userId === userId)),
      getById: vi.fn(async (id: string) => taskStore.find((t) => t.id === id) || null),
      getByProject: vi.fn(async (pId: string, userId: string = 'local') =>
        taskStore.filter((t) => t.projectId === pId && t.userId === userId)
      ),
      upsert: vi.fn(async (t: Task) => {
        const idx = taskStore.findIndex((x) => x.id === t.id);
        if (idx >= 0) taskStore[idx] = t;
        else taskStore.push(t);
      }),
      delete: vi.fn(async (id: string) => {
        taskStore = taskStore.filter((x) => x.id !== id);
      }),
    } as unknown as LocalTaskRepository;

    mockProjectRepo = {
      getAll: vi.fn(async (userId: string = 'local') => projectStore.filter((p) => p.userId === userId)),
      getById: vi.fn(async (id: string) => projectStore.find((p) => p.id === id) || null),
      upsert: vi.fn(async (p: Project) => {
        const idx = projectStore.findIndex((x) => x.id === p.id);
        if (idx >= 0) projectStore[idx] = p;
        else projectStore.push(p);
      }),
      delete: vi.fn(async (id: string) => {
        projectStore = projectStore.filter((x) => x.id !== id);
      }),
    } as unknown as LocalProjectRepository;

    mockFocusRepo = {
      getAll: vi.fn(async (userId: string = 'local') => focusStore.filter((f) => f.userId === userId)),
      getById: vi.fn(async (id: string) => focusStore.find((f) => f.id === id) || null),
      upsert: vi.fn(async (f: FocusSession) => {
        const idx = focusStore.findIndex((x) => x.id === f.id);
        if (idx >= 0) focusStore[idx] = f;
        else focusStore.push(f);
      }),
    } as unknown as LocalFocusRepository;

    mockQueue = {
      enqueue: vi.fn(async (type: string, payload: any, userId: string = 'local') => {
        queueStore.push({ id: `mut-${Date.now()}`, type, payload, userId });
      }),
    } as unknown as SyncQueue;
  });

  it('TaskService creates task with valid UUID and queues CREATE_TASK mutation with user scoping', async () => {
    const service = new TaskService(mockTaskRepo, mockQueue);
    const task = await service.create(
      {
        title: 'New Service Task',
        priority: 'high',
        dueDate: '2026-10-01',
        estimateMinutes: 30,
      },
      [],
      'user-123'
    );

    expect(task.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    expect(task.userId).toBe('user-123');
    expect(mockTaskRepo.upsert).toHaveBeenCalledWith(task);
    expect(mockQueue.enqueue).toHaveBeenCalledWith(
      'CREATE_TASK',
      expect.objectContaining({ id: task.id, title: 'New Service Task' }),
      'user-123'
    );
  });

  it('ProjectService creates project with valid UUID and queues CREATE_PROJECT', async () => {
    const service = new ProjectService(mockProjectRepo, mockQueue);
    const proj = await service.create(
      {
        name: 'FELIS Mobile',
        description: 'React Native app',
        techStack: ['Expo', 'TypeScript'],
        iconType: 'terminal',
      },
      'user-123'
    );

    expect(proj.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    expect(proj.userId).toBe('user-123');
    expect(mockProjectRepo.upsert).toHaveBeenCalledWith(proj);
    expect(mockQueue.enqueue).toHaveBeenCalledWith(
      'CREATE_PROJECT',
      expect.objectContaining({ id: proj.id, name: 'FELIS Mobile' }),
      'user-123'
    );
  });

  it('FocusService starts session with valid UUID and ends session with queued mutation', async () => {
    const service = new FocusService(mockFocusRepo, mockQueue);
    const sessionState = await service.startSession(
      { id: 'task-1', title: 'Task 1', completed: false } as Task,
      'user-123'
    );

    expect(sessionState.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    expect(mockFocusRepo.upsert).toHaveBeenCalled();
    expect(mockQueue.enqueue).toHaveBeenCalledWith(
      'START_FOCUS',
      expect.objectContaining({ id: sessionState.id, taskId: 'task-1' }),
      'user-123'
    );

    await service.endSession(sessionState.id, 25, 'user-123');
    expect(mockQueue.enqueue).toHaveBeenCalledWith(
      'END_FOCUS',
      expect.objectContaining({ id: sessionState.id, actualMinutes: 25, status: 'finished' }),
      'user-123'
    );
  });
});
