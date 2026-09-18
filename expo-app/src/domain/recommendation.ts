import type { Task, Recommendation } from '../types';

export function getDueDateScore(dueDate?: string): number {
  if (!dueDate) return 10;
  const lower = dueDate.trim().toLowerCase();
  if (lower.includes('overdue')) return 0;
  if (lower.includes('today')) return 1;
  if (lower.includes('tomorrow')) return 2;
  if (lower.includes('soon')) return 3;
  if (
    lower.includes('friday') ||
    lower.includes('monday') ||
    lower.includes('tuesday') ||
    lower.includes('wednesday') ||
    lower.includes('thursday') ||
    lower.includes('saturday') ||
    lower.includes('sunday')
  ) {
    return 4;
  }

  const parsed = Date.parse(dueDate);
  if (!isNaN(parsed)) {
    const diffMs = parsed - Date.now();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 1;
    if (diffDays === 1) return 2;
    return Math.min(10, Math.max(3, diffDays + 1));
  }

  return 5;
}

export function getPriorityScore(priority?: 'low' | 'medium' | 'high'): number {
  switch (priority) {
    case 'high':
      return 3;
    case 'medium':
      return 2;
    case 'low':
      return 1;
    default:
      return 2;
  }
}

/**
 * Pure, deterministic function that computes the next recommended action from a task list.
 *
 * Scoring rules:
 * 1. Excludes completed tasks.
 * 2. Priority: high > medium > low.
 * 3. Due date proximity: overdue > today > tomorrow > soon > days of week.
 * 4. Tiebreaker: shorter estimatedMinutes.
 * 5. Stable fallback: original array index.
 */
export function computeNextAction(tasks: Task[]): Recommendation | null {
  const incompleteTasks = tasks.filter((t) => !t.completed);
  if (incompleteTasks.length === 0) {
    return null;
  }

  const scored = incompleteTasks.map((task, index) => ({
    task,
    index,
    priorityScore: getPriorityScore(task.priority),
    dueDateScore: getDueDateScore(task.dueDate),
    estimatedMinutes: task.estimatedMinutes ?? 30,
  }));

  scored.sort((a, b) => {
    // 1. Priority (descending)
    if (b.priorityScore !== a.priorityScore) {
      return b.priorityScore - a.priorityScore;
    }
    // 2. Due date proximity (ascending - lower score means sooner)
    if (a.dueDateScore !== b.dueDateScore) {
      return a.dueDateScore - b.dueDateScore;
    }
    // 3. Shorter estimatedMinutes as tiebreaker
    if (a.estimatedMinutes !== b.estimatedMinutes) {
      return a.estimatedMinutes - b.estimatedMinutes;
    }
    // 4. Stable tiebreaker (insertion order)
    return a.index - b.index;
  });

  const best = scored[0].task;
  const reasonBullets: string[] = [];

  // Due date reason
  if (best.dueDate) {
    const lower = best.dueDate.trim().toLowerCase();
    if (lower.startsWith('due ') || lower === 'today' || lower === 'overdue') {
      reasonBullets.push(best.dueDate.trim().charAt(0).toUpperCase() + best.dueDate.trim().slice(1));
    } else {
      reasonBullets.push(`Due ${best.dueDate.trim()}`);
    }
  } else {
    reasonBullets.push('Next on schedule');
  }

  // Priority reason
  if (best.priority === 'high') {
    reasonBullets.push('High priority');
  } else if (best.priority === 'medium') {
    reasonBullets.push('Medium priority');
  } else {
    reasonBullets.push('Quick win');
  }

  // Estimated focus window reason
  const estMin = best.estimatedMinutes ?? 30;
  reasonBullets.push(`Matches your ~${estMin}m focus window`);

  return {
    taskId: best.id,
    title: best.title,
    projectId: best.projectId,
    projectName: best.projectName,
    dueDateLabel: best.dueDate || 'Today',
    estimatedMinutes: estMin,
    priority: best.priority || 'medium',
    reasonBullets,
  };
}
