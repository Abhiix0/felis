import type { Task, Project } from '@felis/types';
import { SCORING_WEIGHTS } from './weights';

export interface ScoringContext {
  tasks: Task[];
  projects: Project[];
  nowMs: number;
  userPreferredMinutes?: number;
}

export function scoreUrgency(task: Task, ctx: ScoringContext): number {
  if (!task.dueDate) return SCORING_WEIGHTS.urgency * 0.3;
  const dueMs = new Date(task.dueDate).getTime();
  if (isNaN(dueMs)) return SCORING_WEIGHTS.urgency * 0.3;
  const daysUntilDue = (dueMs - ctx.nowMs) / (1000 * 60 * 60 * 24);
  if (daysUntilDue < 0) return SCORING_WEIGHTS.urgency; // overdue
  if (daysUntilDue < 1) return SCORING_WEIGHTS.urgency * 0.9; // today
  if (daysUntilDue < 2) return SCORING_WEIGHTS.urgency * 0.75; // tomorrow
  if (daysUntilDue < 4) return SCORING_WEIGHTS.urgency * 0.5;
  if (daysUntilDue < 7) return SCORING_WEIGHTS.urgency * 0.3;
  return SCORING_WEIGHTS.urgency * 0.1;
}

export function scorePriority(task: Task): number {
  switch (task.priority) {
    case 'high':
      return SCORING_WEIGHTS.priority * 1.5;
    case 'medium':
      return SCORING_WEIGHTS.priority * 0.6;
    case 'low':
      return SCORING_WEIGHTS.priority * 0.1;
    default:
      return SCORING_WEIGHTS.priority * 0.4;
  }
}

export function scoreProjectImportance(task: Task, ctx: ScoringContext): number {
  if (!task.projectId) return SCORING_WEIGHTS.projectImportance * 0.3;
  const project = ctx.projects.find((p) => p.id === task.projectId);
  if (!project) return SCORING_WEIGHTS.projectImportance * 0.2;
  if (project.status === 'active' || !project.status) return SCORING_WEIGHTS.projectImportance;
  if (project.status === 'paused') return SCORING_WEIGHTS.projectImportance * 0.3;
  return 0;
}

export function scoreBlockingImpact(_task: Task, _ctx: ScoringContext): number {
  return 0;
}

export function scoreTimeFit(task: Task, ctx: ScoringContext): number {
  const est = task.estimateMinutes ?? task.estimatedMinutes ?? 30;
  const preferred = ctx.userPreferredMinutes ?? 25;
  const diff = Math.abs(est - preferred);
  if (diff <= 5) return SCORING_WEIGHTS.timeFit;
  if (diff <= 15) return SCORING_WEIGHTS.timeFit * 0.7;
  if (diff <= 30) return SCORING_WEIGHTS.timeFit * 0.4;
  return SCORING_WEIGHTS.timeFit * 0.1;
}

export function scoreRecencyContext(task: Task, ctx: ScoringContext): number {
  if (!task.createdAt) return SCORING_WEIGHTS.recencyContext * 0.5;
  const createdMs = new Date(task.createdAt).getTime();
  if (isNaN(createdMs)) return SCORING_WEIGHTS.recencyContext * 0.5;
  const ageMs = ctx.nowMs - createdMs;
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  if (ageDays < 1) return SCORING_WEIGHTS.recencyContext;
  if (ageDays < 3) return SCORING_WEIGHTS.recencyContext * 0.6;
  if (ageDays < 7) return SCORING_WEIGHTS.recencyContext * 0.3;
  return SCORING_WEIGHTS.recencyContext * 0.1;
}

export function scorePreferenceFit(_task: Task, _ctx: ScoringContext): number {
  return 0;
}
