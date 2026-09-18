import { v4 as uuidv4 } from 'uuid';
import type { Task, FocusSession } from '@felis/types';
import { LocalFocusRepository } from '../storage/LocalFocusRepository';
import { SyncQueue } from '../storage/SyncQueue';

export interface FocusSessionState {
  id: string;
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
  constructor(
    private local: LocalFocusRepository = new LocalFocusRepository(),
    private queue: SyncQueue = new SyncQueue()
  ) {}

  async startSession(task?: Task, userId: string = 'local'): Promise<FocusSessionState> {
    const estMin = task?.estimatedMinutes || task?.estimateMinutes || 28;
    const sessionId = uuidv4();
    const state: FocusSessionState = {
      id: sessionId,
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

    const session: FocusSession = {
      id: sessionId,
      userId,
      taskId: state.taskId,
      plannedMinutes: estMin,
      startedAt: new Date(state.startedAt).toISOString(),
      status: 'active',
      pausedTotalSeconds: 0,
      syncStatus: 'pending',
    };

    await this.local.upsert(session);

    try {
      await this.queue.enqueue(
        'START_FOCUS',
        {
          id: sessionId,
          taskId: session.taskId,
          plannedMinutes: estMin,
        },
        userId
      );
    } catch (err) {
      console.warn('[FocusService] Failed to enqueue START_FOCUS:', err);
    }

    return state;
  }

  async endSession(
    sessionId: string,
    actualMinutes: number,
    userId: string = 'local'
  ): Promise<void> {
    const existing = await this.local.getById(sessionId);
    const updated: FocusSession = {
      id: sessionId,
      userId,
      taskId: existing?.taskId || 'general-focus',
      plannedMinutes: existing?.plannedMinutes || 25,
      startedAt: existing?.startedAt || new Date().toISOString(),
      endedAt: new Date().toISOString(),
      actualMinutes,
      status: 'finished',
      pausedTotalSeconds: existing?.pausedTotalSeconds || 0,
      syncStatus: 'pending',
    };

    await this.local.upsert(updated);

    try {
      await this.queue.enqueue(
        'END_FOCUS',
        {
          id: sessionId,
          endedAt: updated.endedAt,
          actualMinutes,
          status: 'finished',
        },
        userId
      );
    } catch (err) {
      console.warn('[FocusService] Failed to enqueue END_FOCUS:', err);
    }
  }
}

