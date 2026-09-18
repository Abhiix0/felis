import { openDatabase } from './db';
import type { FocusSession } from '@felis/types';

export class LocalFocusRepository {
  async getAll(userId: string = 'local'): Promise<FocusSession[]> {
    try {
      const db = await openDatabase();
      const rows = await db.getAllAsync<any>(
        'SELECT * FROM focus_sessions WHERE user_id = ? ORDER BY started_at DESC',
        [userId]
      );
      return rows.map(mapRowToFocusSession);
    } catch (err) {
      console.warn('[LocalFocusRepository] SQLite error reading focus sessions:', err);
      return [];
    }
  }

  async upsert(session: FocusSession): Promise<void> {
    try {
      const db = await openDatabase();
      await db.runAsync(
        `INSERT INTO focus_sessions (
          id, user_id, task_id, planned_minutes, started_at,
          ended_at, actual_minutes, status, paused_total_seconds, sync_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          ended_at=excluded.ended_at,
          actual_minutes=excluded.actual_minutes,
          status=excluded.status,
          paused_total_seconds=excluded.paused_total_seconds,
          sync_status=excluded.sync_status`,
        [
          session.id,
          session.userId || 'local',
          session.taskId,
          session.plannedMinutes,
          session.startedAt || new Date().toISOString(),
          session.endedAt ?? null,
          session.actualMinutes ?? null,
          session.status,
          session.pausedTotalSeconds ?? 0,
          session.syncStatus || 'pending',
        ]
      );
    } catch (err) {
      console.warn('[LocalFocusRepository] SQLite error upserting focus session:', err);
    }
  }

  async getById(id: string): Promise<FocusSession | null> {
    try {
      const db = await openDatabase();
      const row = await db.getFirstAsync<any>(
        'SELECT * FROM focus_sessions WHERE id = ?',
        [id]
      );
      return row ? mapRowToFocusSession(row) : null;
    } catch {
      return null;
    }
  }
}

function mapRowToFocusSession(row: any): FocusSession {
  return {
    id: row.id,
    userId: row.user_id,
    taskId: row.task_id,
    plannedMinutes: row.planned_minutes,
    startedAt: row.started_at,
    endedAt: row.ended_at ?? undefined,
    actualMinutes: row.actual_minutes ?? undefined,
    status: row.status,
    pausedTotalSeconds: row.paused_total_seconds ?? 0,
    syncStatus: row.sync_status,
  };
}
