import { openDatabase } from './db';
import { v4 as uuidv4 } from 'uuid';

export interface MutationRecord {
  id: string;
  type: string;
  payload: any;
  createdAt: string;
  status: 'pending' | 'synced' | 'failed' | 'conflict';
  retryCount: number;
}

export class SyncQueue {
  async enqueue(type: string, payload: unknown): Promise<string> {
    const db = await openDatabase();
    const id = uuidv4();
    await db.runAsync(
      `INSERT INTO sync_mutations (id, type, payload, created_at, status, retry_count)
       VALUES (?, ?, ?, ?, 'pending', 0)`,
      [id, type, JSON.stringify(payload), new Date().toISOString()]
    );
    return id;
  }

  async getPending(): Promise<MutationRecord[]> {
    const db = await openDatabase();
    const rows = await db.getAllAsync<any>(
      `SELECT * FROM sync_mutations WHERE status = 'pending'
       ORDER BY created_at ASC LIMIT 50`
    );
    return rows.map((r) => ({
      id: r.id,
      type: r.type,
      payload: JSON.parse(r.payload),
      createdAt: r.created_at,
      status: r.status,
      retryCount: r.retry_count,
    }));
  }

  async markSynced(id: string): Promise<void> {
    const db = await openDatabase();
    await db.runAsync(
      `UPDATE sync_mutations SET status='synced' WHERE id=?`,
      [id]
    );
  }

  async markFailed(id: string, error: string): Promise<void> {
    const db = await openDatabase();
    await db.runAsync(
      `UPDATE sync_mutations SET status='failed', error=?,
       retry_count=retry_count+1, last_attempt_at=? WHERE id=?`,
      [error, new Date().toISOString(), id]
    );
  }

  async countPending(): Promise<number> {
    try {
      const db = await openDatabase();
      const row = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM sync_mutations WHERE status = 'pending'`
      );
      return row?.count ?? 0;
    } catch {
      return 0;
    }
  }

  async countFailed(): Promise<number> {
    try {
      const db = await openDatabase();
      const row = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM sync_mutations WHERE status = 'failed'`
      );
      return row?.count ?? 0;
    } catch {
      return 0;
    }
  }
}
