import type { Task } from '../types';

/**
 * Returns tasks that are "today" — matches dueDate label strings
 * until real ISO date fields are implemented in Phase 5.
 * Returns all incomplete tasks + any completed today-labeled tasks.
 */
export function getTodayTasks(tasks: Task[]): Task[] {
  const NOW_LABELS = ['today', 'due today', 'overdue'];
  return tasks.filter((t) => {
    if (!t.dueDate) return false;
    const lower = t.dueDate.toLowerCase();
    return NOW_LABELS.some((label) => lower.includes(label));
  });
}

/**
 * Returns incomplete tasks due today or overdue. Used for task count display.
 */
export function getActiveTodayTasks(tasks: Task[]): Task[] {
  return getTodayTasks(tasks).filter((t) => !t.completed);
}
