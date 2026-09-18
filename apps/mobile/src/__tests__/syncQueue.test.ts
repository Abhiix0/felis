import { describe, it, expect, beforeEach, vi } from 'vitest';

interface MutationRow {
  id: string;
  user_id: string;
  type: string;
  payload: string;
  created_at: string;
  status: string;
  retry_count: number;
  last_attempt_at: string | null;
  next_attempt_at: string | null;
  error: string | null;
}

let tableRows: MutationRow[] = [];

// In-memory SQLite executor matching the exact SQL statements in SyncQueue
vi.mock('../storage/db', () => ({
  openDatabase: async () => ({
    runAsync: async (sql: string, params: any[] = []) => {
      if (sql.includes('INSERT INTO sync_mutations')) {
        const [id, user_id, type, payload, created_at] = params;
        tableRows.push({
          id,
          user_id,
          type,
          payload,
          created_at,
          status: 'pending',
          retry_count: 0,
          last_attempt_at: null,
          next_attempt_at: null,
          error: null,
        });
      } else if (sql.includes('UPDATE sync_mutations SET status=')) {
        if (params.length === 4) {
          // Permanent failure or max retries: [error, nextRetry, nowIso, id]
          const [error, retry_count, last_attempt_at, id] = params;
          const target = tableRows.find((r) => r.id === id);
          if (target) {
            target.status = 'failed';
            target.error = error;
            target.retry_count = retry_count;
            target.last_attempt_at = last_attempt_at;
            target.next_attempt_at = null;
          }
        } else if (params.length === 5) {
          // Transient failure: [error, nextRetry, nowIso, nextAttemptIso, id]
          const [error, retry_count, last_attempt_at, next_attempt_at, id] = params;
          const target = tableRows.find((r) => r.id === id);
          if (target) {
            target.status = 'failed';
            target.error = error;
            target.retry_count = retry_count;
            target.last_attempt_at = last_attempt_at;
            target.next_attempt_at = next_attempt_at;
          }
        }
      } else if (sql.includes('UPDATE sync_mutations SET next_attempt_at')) {
        const [next_attempt_at, id] = params;
        const target = tableRows.find((r) => r.id === id);
        if (target) target.next_attempt_at = next_attempt_at;
      }
    },
    getAllAsync: async (sql: string, params: any[] = []) => {
      if (sql.includes('SELECT * FROM sync_mutations')) {
        const [maxRetries, nowIso, userId] = params;
        return tableRows.filter((r) => {
          // Exact SQL condition: status = 'pending' OR (status = 'failed' AND retry_count < ? AND next_attempt_at IS NOT NULL AND next_attempt_at <= ?)
          const isPending = r.status === 'pending';
          const isEligibleFailed =
            r.status === 'failed' &&
            r.retry_count < maxRetries &&
            r.next_attempt_at !== null &&
            r.next_attempt_at <= nowIso;

          const matchesStatus = isPending || isEligibleFailed;
          const matchesUser = userId ? r.user_id === userId : true;

          return matchesStatus && matchesUser;
        });
      }
      return [];
    },
    getFirstAsync: async (sql: string, params: any[] = []) => {
      if (sql.includes('SELECT retry_count FROM sync_mutations')) {
        const [id] = params;
        const target = tableRows.find((r) => r.id === id);
        return target ? { retry_count: target.retry_count } : null;
      }
      return null;
    },
  }),
}));

import { SyncQueue, MAX_SYNC_RETRIES } from '../storage/SyncQueue';

describe('SyncQueue State Machine & Retry Eligibility', () => {
  let queue: SyncQueue;

  beforeEach(() => {
    tableRows = [];
    queue = new SyncQueue();
  });

  it('Test 1: Permanent failure (isTransient = false) stores next_attempt_at = NULL and is NEVER retried by getRetryable()', async () => {
    const mutationId = await queue.enqueue(
      'CREATE_TASK',
      { title: 'Invalid Task' },
      'user-test-1'
    );

    // Initial check: pending mutation is immediately eligible
    let retryable = await queue.getRetryable('user-test-1');
    expect(retryable).toHaveLength(1);
    expect(retryable[0].id).toBe(mutationId);

    // Mark as permanent failure (422 / 400 validation error)
    await queue.markFailed(mutationId, 'Validation error (422)', false);

    // Verify row in SQLite: next_attempt_at is NULL, status is 'failed'
    const targetRow = tableRows.find((r) => r.id === mutationId);
    expect(targetRow?.status).toBe('failed');
    expect(targetRow?.next_attempt_at).toBeNull();
    expect(targetRow?.error).toBe('Validation error (422)');

    // getRetryable must NOT return permanent failures
    retryable = await queue.getRetryable('user-test-1');
    expect(retryable).toHaveLength(0);
  });

  it('Test 2: Transient failure (isTransient = true) schedules next_attempt_at; ineligible before due, eligible once due', async () => {
    const mutationId = await queue.enqueue(
      'CREATE_TASK',
      { title: 'Retryable Task' },
      'user-test-2'
    );

    // Mark as transient failure (network timeout / 500)
    await queue.markFailed(mutationId, 'Network error (500)', true);

    const targetRow = tableRows.find((r) => r.id === mutationId);
    expect(targetRow?.status).toBe('failed');
    expect(targetRow?.retry_count).toBe(1);
    expect(targetRow?.next_attempt_at).not.toBeNull();

    // 1. Immediately after failure, next_attempt_at is in the future (~1s ahead), so it is NOT yet eligible
    const beforeDue = await queue.getRetryable('user-test-2');
    expect(beforeDue).toHaveLength(0);

    // 2. Simulate time moving forward past next_attempt_at
    if (targetRow) {
      targetRow.next_attempt_at = new Date(Date.now() - 5000).toISOString();
    }

    const afterDue = await queue.getRetryable('user-test-2');
    expect(afterDue).toHaveLength(1);
    expect(afterDue[0].id).toBe(mutationId);
    expect(afterDue[0].status).toBe('failed');
  });

  it('Test 3: Repeated transient failures until MAX_SYNC_RETRIES sets next_attempt_at = NULL and stops retrying', async () => {
    const mutationId = await queue.enqueue(
      'CREATE_PROJECT',
      { name: 'Flaky Project' },
      'user-test-3'
    );

    // Fail repeatedly up to MAX_SYNC_RETRIES
    for (let i = 1; i <= MAX_SYNC_RETRIES; i++) {
      await queue.markFailed(mutationId, `Transient failure attempt #${i}`, true);
    }

    const targetRow = tableRows.find((r) => r.id === mutationId);
    expect(targetRow?.status).toBe('failed');
    expect(targetRow?.retry_count).toBe(MAX_SYNC_RETRIES);
    expect(targetRow?.next_attempt_at).toBeNull();

    // Even if next_attempt_at is set to past, retry_count >= MAX_SYNC_RETRIES prevents it
    if (targetRow) {
      targetRow.next_attempt_at = new Date(Date.now() - 5000).toISOString();
    }

    const retryable = await queue.getRetryable('user-test-3');
    expect(retryable).toHaveLength(0);
  });
});
