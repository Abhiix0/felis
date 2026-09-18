import type { Task } from '@felis/types';
import { getTodayISO } from './dateUtils';

const NOW_LABELS = ['today', 'due today', 'overdue'];

/**
 * Returns tasks that are "today" — matches dueDate label strings
 * or ISO date fields matching today.
 */
export function getTodayTasks(tasks: Task[]): Task[] {
  const todayISO = getTodayISO();
  return tasks.filter((t) => {
    if (!t.dueDate) return false;
    if (t.dueDate === todayISO) return true;
    const lower = t.dueDate.toLowerCase();
    return NOW_LABELS.some((label) => lower.includes(label));
  });
}

/**
 * Returns incomplete tasks due today or overdue.
 */
export function getActiveTodayTasks(tasks: Task[]): Task[] {
  return getTodayTasks(tasks).filter(
    (t) => !t.completed && t.status !== 'completed'
  );
}
