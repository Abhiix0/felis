import { describe, it, expect, vi } from 'vitest';
import { FelisApiClient } from '../client';
import {
  ProjectsApi,
  TasksApi,
  RecommendationsApi,
  FocusApi,
  UsersApi,
} from '../endpoints';

describe('Typed Endpoints', () => {
  const mockClient = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  } as unknown as FelisApiClient;

  it('ProjectsApi calls correct endpoints', async () => {
    const api = new ProjectsApi(mockClient);
    (mockClient.get as any).mockResolvedValueOnce([{ id: 'p1', name: 'Proj 1' }]);
    const list = await api.list();
    expect(mockClient.get).toHaveBeenCalledWith('/projects');
    expect(list).toHaveLength(1);
  });

  it('TasksApi maps input and output', async () => {
    const api = new TasksApi(mockClient);
    (mockClient.post as any).mockResolvedValueOnce({
      id: 't1',
      title: 'Task 1',
      estimate_minutes: 30,
      due_date: '2026-10-01',
    });

    const task = await api.create({
      title: 'Task 1',
      priority: 'medium',
      estimateMinutes: 30,
      dueDate: '2026-10-01',
    });

    expect(mockClient.post).toHaveBeenCalledWith(
      '/tasks',
      expect.objectContaining({ estimate_minutes: 30, due_date: '2026-10-01' }),
      undefined
    );
    expect(task.id).toBe('t1');
    expect(task.estimateMinutes).toBe(30);
  });

  it('RecommendationsApi gets next action and records outcome', async () => {
    const api = new RecommendationsApi(mockClient);
    (mockClient.get as any).mockResolvedValueOnce({
      id: 'rec-1',
      task_id: 't1',
      score: 85,
      signals: [{ type: 'urgency', value: 30, reason: 'Due soon' }],
    });

    const rec = await api.getNextAction();
    expect(mockClient.get).toHaveBeenCalledWith('/recommendations/next-action');
    expect(rec?.taskId).toBe('t1');
    expect(rec?.score).toBe(85);

    (mockClient.post as any).mockResolvedValueOnce({ status: 'ok' });
    await api.recordOutcome('rec-1', 'completed');
    expect(mockClient.post).toHaveBeenCalledWith(
      '/recommendations/rec-1/outcome',
      expect.objectContaining({ event: 'completed' })
    );
  });

  it('FocusApi starts and ends session', async () => {
    const api = new FocusApi(mockClient);
    (mockClient.post as any).mockResolvedValueOnce({
      id: 'f1',
      task_id: 't1',
      planned_minutes: 25,
      status: 'running',
    });

    const session = await api.start('t1', 25);
    expect(mockClient.post).toHaveBeenCalledWith('/focus-sessions', { taskId: 't1', plannedMinutes: 25 }, undefined);
    expect(session.id).toBe('f1');
    expect(session.plannedMinutes).toBe(25);
  });
});
