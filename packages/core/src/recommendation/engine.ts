import type { Task, Project, Recommendation, RecommendationSignal } from '@felis/types';
import {
  scoreUrgency,
  scorePriority,
  scoreProjectImportance,
  scoreTimeFit,
  scoreRecencyContext,
  ScoringContext,
} from './signals';

function buildUrgencyReason(task: Task, ctx: ScoringContext): string {
  if (!task.dueDate) return 'No due date set';
  const lower = task.dueDate.trim().toLowerCase();
  if (lower.startsWith('due ') || lower === 'today' || lower === 'overdue' || lower === 'due today') {
    return task.dueDate.trim().charAt(0).toUpperCase() + task.dueDate.trim().slice(1);
  }
  const dueMs = new Date(task.dueDate).getTime();
  if (isNaN(dueMs)) return task.dueDate;
  const daysUntilDue = (dueMs - ctx.nowMs) / (1000 * 60 * 60 * 24);
  if (daysUntilDue < 0) return 'Overdue';
  if (daysUntilDue < 1) return 'Due today';
  if (daysUntilDue < 2) return 'Due tomorrow';
  return `Due in ${Math.ceil(daysUntilDue)} days`;
}

function buildPriorityReason(task: Task): string {
  switch (task.priority) {
    case 'high':
      return 'High priority';
    case 'medium':
      return 'Medium priority';
    case 'low':
      return 'Low priority';
    default:
      return 'Priority not set';
  }
}

export function computeNextAction(
  tasks: Task[],
  projects: Project[] = [],
  ctx: Partial<ScoringContext> = {}
): Recommendation | null {
  const fullCtx: ScoringContext = {
    tasks,
    projects,
    nowMs: ctx.nowMs ?? Date.now(),
    userPreferredMinutes: ctx.userPreferredMinutes ?? 25,
  };

  const eligible = tasks.filter(
    (t) => !t.completed && t.status !== 'completed' && t.status !== 'cancelled'
  );

  if (eligible.length === 0) return null;

  const scored = eligible.map((task, index) => {
    const urgencyScore = Math.round(scoreUrgency(task, fullCtx));
    const priorityScore = Math.round(scorePriority(task));
    const projectScore = Math.round(scoreProjectImportance(task, fullCtx));
    const timeScore = Math.round(scoreTimeFit(task, fullCtx));
    const recencyScore = Math.round(scoreRecencyContext(task, fullCtx));
    const estMin = task.estimateMinutes ?? task.estimatedMinutes ?? 30;

    const signals: RecommendationSignal[] = [
      {
        type: 'urgency' as const,
        value: urgencyScore,
        reason: buildUrgencyReason(task, fullCtx),
      },
      {
        type: 'priority' as const,
        value: priorityScore,
        reason: buildPriorityReason(task),
      },
      {
        type: 'project_importance' as const,
        value: projectScore,
        reason: 'Active project',
      },
      {
        type: 'time_fit' as const,
        value: timeScore,
        reason: `Estimated ${estMin} min`,
      },
      {
        type: 'recency_context' as const,
        value: recencyScore,
        reason: 'Recently created or updated',
      },
    ].filter((s) => s.value > 0);

    const rawTotal = signals.reduce((sum, s) => sum + s.value, 0);
    const totalScore = Math.min(100, Math.max(0, rawTotal));
    return { task, signals, totalScore, index };
  });

  scored.sort((a, b) => {
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    return a.index - b.index;
  });

  const best = scored[0];
  const snapshotVersion = String(fullCtx.nowMs);
  const bestTask = best.task;
  const project = projects.find((p) => p.id === bestTask.projectId);
  const estMin = bestTask.estimateMinutes ?? bestTask.estimatedMinutes ?? 30;

  return {
    id: `rec-${Date.now()}`,
    taskId: bestTask.id,
    title: bestTask.title,
    projectId: bestTask.projectId || '',
    projectName: project?.name || bestTask.projectName || 'General',
    dueDateLabel: bestTask.dueDate || 'Today',
    estimatedMinutes: estMin,
    priority: bestTask.priority || 'medium',
    reasonBullets: best.signals.map((s) => s.reason),
    score: best.totalScore,
    signals: best.signals,
    createdAt: new Date(fullCtx.nowMs).toISOString(),
    stateSnapshotVersion: snapshotVersion,
  };
}
