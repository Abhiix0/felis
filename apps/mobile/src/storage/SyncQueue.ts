import { openDatabase } from './db';
import { v4 as uuidv4 } from 'uuid';

export type MutationStatus = 'pending' | 'processing' | 'synced' | 'failed' | 'conflict';

export interface MutationRecord {
  id: string;
  userId: string;
  type: string;
  payload: any;
  createdAt: string;
  status: MutationStatus;
  retryCount: number;
  lastAttemptAt?: string;
  nextAttemptAt?: string;
  error?: string;
}

export const MAX_SYNC_RETRIES = 5;

export class SyncQueue {
  async enqueue(type: string, payload: unknown, userId: string = 'local'): Promise<string> {
    const db = await openDatabase();
    const id = uuidv4();
    await db.runAsync(
      `INSERT INTO sync_mutations (id, user_id, type, payload, created_at, status, retry_count)
       VALUES (?, ?, ?, ?, ?, 'pending', 0)`,
      [id, userId, type, JSON.stringify(payload), new Date().toISOString()]
    );
    return id;
  }

  async getPending(userId?: string): Promise<MutationRecord[]> {
    return this.getRetryable(userId);
  }

  async getRetryable(userId?: string): Promise<MutationRecord[]> {
    const db = await openDatabase();
    const nowIso = new Date().toISOString();
    let query = `
      SELECT * FROM sync_mutations 
      WHERE (
        status = 'pending' 
        OR (status = 'failed' AND retry_count < ? AND next_attempt_at IS NOT NULL AND next_attempt_at <= ?)
      )
    `;
    const params: any[] = [MAX_SYNC_RETRIES, nowIso];

    if (userId) {
      query += ` AND user_id = ?`;
      params.push(userId);
    }

    query += ` ORDER BY created_at ASC LIMIT 50`;

    const rows = await db.getAllAsync<any>(query, params);
    return rows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      type: r.type,
      payload: JSON.parse(r.payload),
      createdAt: r.created_at,
      status: r.status,
      retryCount: r.retry_count,
      lastAttemptAt: r.last_attempt_at ?? undefined,
      nextAttemptAt: r.next_attempt_at ?? undefined,
      error: r.error ?? undefined,
    }));
  }

  async markProcessing(id: string): Promise<void> {
    const db = await openDatabase();
    await db.runAsync(
      `UPDATE sync_mutations SET status='processing', last_attempt_at=? WHERE id=?`,
      [new Date().toISOString(), id]
    );
  }

  async markSynced(id: string): Promise<void> {
    const db = await openDatabase();
    await db.runAsync(
      `UPDATE sync_mutations SET status='synced', next_attempt_at=NULL, error=NULL WHERE id=?`,
      [id]
    );
  }

  async markFailed(id: string, error: string, isTransient: boolean = true): Promise<void> {
    const db = await openDatabase();
    const now = Date.now();
    const nowIso = new Date(now).toISOString();

    const row = await db.getFirstAsync<{ retry_count: number }>(
      `SELECT retry_count FROM sync_mutations WHERE id=?`,
      [id]
    );
    const nextRetry = (row?.retry_count ?? 0) + 1;

    if (!isTransient || nextRetry >= MAX_SYNC_RETRIES) {
      await db.runAsync(
        `UPDATE sync_mutations SET status='failed', error=?,
         retry_count=?, last_attempt_at=?, next_attempt_at=NULL WHERE id=?`,
        [error, nextRetry, nowIso, id]
      );
      return;
    }

    // Bounded exponential backoff: 1s, 2s, 4s, 8s, 16s... up to 60s
    const delayMs = Math.min(60000, 1000 * Math.pow(2, nextRetry - 1));
    const nextAttemptIso = new Date(now + delayMs).toISOString();

    await db.runAsync(
      `UPDATE sync_mutations SET status='failed', error=?,
       retry_count=?, last_attempt_at=?, next_attempt_at=? WHERE id=?`,
      [error, nextRetry, nowIso, nextAttemptIso, id]
    );
  }

  async markConflict(id: string, error: string): Promise<void> {
    const db = await openDatabase();
    await db.runAsync(
      `UPDATE sync_mutations SET status='conflict', error=?, next_attempt_at=NULL WHERE id=?`,
      [error, id]
    );
  }

  async countPending(userId?: string): Promise<number> {
    try {
      const db = await openDatabase();
      let query = `SELECT COUNT(*) as count FROM sync_mutations WHERE status = 'pending'`;
      const params: any[] = [];
      if (userId) {
        query += ` AND user_id = ?`;
        params.push(userId);
      }
      const row = await db.getFirstAsync<{ count: number }>(query, params);
      return row?.count ?? 0;
    } catch {
      return 0;
    }
  }

  async countFailed(userId?: string): Promise<number> {
    try {
      const db = await openDatabase();
      let query = `SELECT COUNT(*) as count FROM sync_mutations WHERE status = 'failed'`;
      const params: any[] = [];
      if (userId) {
        query += ` AND user_id = ?`;
        params.push(userId);
      }
      const row = await db.getFirstAsync<{ count: number }>(query, params);
      return row?.count ?? 0;
    } catch {
      return 0;
    }
  }
}
