import { describe, it, expect } from 'vitest';
import { computeNextAction } from '@felis/core';
import type { Task, Project } from '@felis/types';

describe('Recommendation Engine (Mobile Integration)', () => {
  const mockProjects: Project[] = [
    {
      id: 'proj-1',
      name: 'FELIS',
      iconType: 'terminal',
      status: 'active',
    },
  ];

  it('Empty tasks → null', () => {
    const result = computeNextAction([], mockProjects);
    expect(result).toBeNull();
  });

  it('One high priority task → returned', () => {
    const task: Task = {
      id: 't-1',
      title: 'High priority task',
      priority: 'high',
      status: 'pending',
      completed: false,
    };
    const result = computeNextAction([task], mockProjects);
    expect(result).not.toBeNull();
    expect(result?.taskId).toBe('t-1');
  });

  it('High priority beats low regardless of due date', () => {
    const lowDueToday: Task = {
      id: 't-low',
      title: 'Low task due today',
      priority: 'low',
      dueDate: new Date().toISOString(),
      status: 'pending',
    };
    const highNextWeek: Task = {
      id: 't-high',
      title: 'High task next week',
      priority: 'high',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      status: 'pending',
    };

    const result = computeNextAction([lowDueToday, highNextWeek], mockProjects);
    expect(result).not.toBeNull();
    expect(result?.taskId).toBe('t-high');
  });

  it('Overdue beats tomorrow beats next week', () => {
    const now = new Date('2026-09-18T10:00:00Z');
    const overdue: Task = {
      id: 't-overdue',
      title: 'Overdue task',
      priority: 'medium',
      dueDate: '2026-09-17',
      status: 'pending',
    };
    const tomorrow: Task = {
      id: 't-tomorrow',
      title: 'Tomorrow task',
      priority: 'medium',
      dueDate: '2026-09-19',
      status: 'pending',
    };
    const nextWeek: Task = {
      id: 't-nextweek',
      title: 'Next week task',
      priority: 'medium',
      dueDate: '2026-09-25',
      status: 'pending',
    };

    const result = computeNextAction(
      [nextWeek, tomorrow, overdue],
      mockProjects,
      { nowMs: now.getTime() }
    );
    expect(result).not.toBeNull();
    expect(result?.taskId).toBe('t-overdue');
  });

  it('Score is between 0 and 100', () => {
    const task: Task = {
      id: 't-score',
      title: 'Score test task',
      priority: 'high',
      dueDate: new Date().toISOString(),
      status: 'pending',
    };

    const result = computeNextAction([task], mockProjects);
    expect(result).not.toBeNull();
    expect(result?.score).toBeGreaterThanOrEqual(0);
    expect(result?.score).toBeLessThanOrEqual(100);
  });
});
