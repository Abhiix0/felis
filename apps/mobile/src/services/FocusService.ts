import type { Task } from '@felis/types';

export interface FocusSessionState {
  id?: string;
  taskId: string;
  taskTitle: string;
  projectName: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isFinished: boolean;
  subtasks: { id: string; title: string; completed: boolean }[];
  estimatedMinutes: number;
  startedAt: number;
  pausedTotalSeconds: number;
  pauseStartedAt?: number;
}

export function computeActualMinutes(session: FocusSessionState): number {
  const elapsedMs = Date.now() - session.startedAt;
  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const currentPause = session.pauseStartedAt
    ? Math.floor((Date.now() - session.pauseStartedAt) / 1000)
    : 0;
  const activeSeconds = Math.max(0, elapsedSeconds - (session.pausedTotalSeconds + currentPause));
  return Math.max(1, Math.round(activeSeconds / 60));
}

export class FocusService {
  startSession(task?: Task): FocusSessionState {
    const estMin = task?.estimatedMinutes || task?.estimateMinutes || 28;
    return {
      taskId: task?.id || 'general-focus',
      taskTitle: task?.title || 'General Focus',
      projectName: task?.projectName || 'General',
      totalSeconds: estMin * 60,
      remainingSeconds: estMin * 60,
      isRunning: true,
      isFinished: false,
      subtasks: task?.subtasks || [],
      estimatedMinutes: estMin,
      startedAt: Date.now(),
      pausedTotalSeconds: 0,
    };
  }
}
