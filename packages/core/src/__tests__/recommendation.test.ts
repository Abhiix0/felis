import { describe, it, expect } from 'vitest';
import { computeNextAction } from '../recommendation/engine';
import type { Task, Project } from '@felis/types';

describe('Recommendation Engine (computeNextAction)', () => {
  const dummyProjects: Project[] = [
    {
      id: 'proj-1',
      name: 'Project Alpha',
      iconType: 'terminal',
      status: 'active',
    },
    {
      id: 'proj-2',
      name: 'Project Beta',
      iconType: 'cloud',
      status: 'paused',
    },
  ];

  it('returns null when task list is empty', () => {
    const result = computeNextAction([], dummyProjects);
    expect(result).toBeNull();
  });

  it('returns null when all tasks are completed', () => {
    const tasks: Task[] = [
      {
        id: 'task-1',
        title: 'Completed Task',
        completed: true,
        status: 'completed',
        priority: 'high',
      },
    ];
    const result = computeNextAction(tasks, dummyProjects);
    expect(result).toBeNull();
  });

  it('returns single task when only one incomplete task exists', () => {
    const tasks: Task[] = [
      {
        id: 'task-single',
        title: 'Only Task',
        completed: false,
        status: 'pending',
        priority: 'medium',
        dueDate: '2026-09-20',
      },
    ];
    const result = computeNextAction(tasks, dummyProjects);
    expect(result).not.toBeNull();
    expect(result?.taskId).toBe('task-single');
    expect(result?.title).toBe('Only Task');
  });

  it('favors high priority over low priority with same due date', () => {
    const nowMs = new Date('2026-09-18T12:00:00Z').getTime();
    const tasks: Task[] = [
      {
        id: 'low-task',
        title: 'Low Task',
        priority: 'low',
        dueDate: '2026-09-19',
        projectId: 'proj-1',
      },
      {
        id: 'high-task',
        title: 'High Task',
        priority: 'high',
        dueDate: '2026-09-19',
        projectId: 'proj-1',
      },
    ];
    const result = computeNextAction(tasks, dummyProjects, { nowMs });
    expect(result?.taskId).toBe('high-task');
  });

  it('favors overdue task over future due task', () => {
    const nowMs = new Date('2026-09-18T12:00:00Z').getTime();
    const tasks: Task[] = [
      {
        id: 'future-task',
        title: 'Future Task',
        priority: 'medium',
        dueDate: '2026-09-28',
        projectId: 'proj-1',
      },
      {
        id: 'overdue-task',
        title: 'Overdue Task',
        priority: 'medium',
        dueDate: '2026-09-15',
        projectId: 'proj-1',
      },
    ];
    const result = computeNextAction(tasks, dummyProjects, { nowMs });
    expect(result?.taskId).toBe('overdue-task');
  });

  it('maintains stable insertion order for equal scores', () => {
    const nowMs = new Date('2026-09-18T12:00:00Z').getTime();
    const tasks: Task[] = [
      {
        id: 'task-a',
        title: 'Task A',
        priority: 'medium',
        dueDate: '2026-09-19',
        projectId: 'proj-1',
        estimateMinutes: 25,
      },
      {
        id: 'task-b',
        title: 'Task B',
        priority: 'medium',
        dueDate: '2026-09-19',
        projectId: 'proj-1',
        estimateMinutes: 25,
      },
    ];
    const result = computeNextAction(tasks, dummyProjects, { nowMs });
    expect(result?.taskId).toBe('task-a');
  });

  it('computes grounded scores between 0 and 100', () => {
    const nowMs = new Date('2026-09-18T12:00:00Z').getTime();
    const tasks: Task[] = [
      {
        id: 'task-scoring',
        title: 'Critical Task',
        priority: 'high',
        dueDate: '2026-09-17', // overdue
        projectId: 'proj-1',
        estimateMinutes: 25,
      },
    ];
    const result = computeNextAction(tasks, dummyProjects, { nowMs });
    expect(result?.score).toBeGreaterThan(0);
    expect(result?.score).toBeLessThanOrEqual(100);
    expect(result?.signals?.length).toBeGreaterThan(0);
  });
});
