import { openDatabase } from './db';
import type { Task, Subtask } from '@felis/types';

export class LocalTaskRepository {
  async getAll(userId: string = 'local'): Promise<Task[]> {
    try {
      const db = await openDatabase();
      const taskRows = await db.getAllAsync<any>(
        `SELECT t.*, p.name as project_name 
         FROM tasks t 
         LEFT JOIN projects p ON t.project_id = p.id 
         WHERE t.user_id = ? 
         ORDER BY t.created_at DESC`,
        [userId]
      );

      const subtaskRows = await db.getAllAsync<any>(
        `SELECT * FROM subtasks ORDER BY position ASC`
      );

      const subtasksByTask = new Map<string, Subtask[]>();
      for (const s of subtaskRows) {
        const list = subtasksByTask.get(s.task_id) || [];
        list.push({
          id: s.id,
          taskId: s.task_id,
          title: s.title,
          completed: Boolean(s.completed),
          completedAt: s.completed_at ?? undefined,
          position: s.position,
        });
        subtasksByTask.set(s.task_id, list);
      }

      return taskRows.map((r) => mapRowToTask(r, subtasksByTask.get(r.id) || []));
    } catch (err) {
      console.warn('[LocalTaskRepository] SQLite error reading tasks:', err);
      return [];
    }
  }

  async getByProject(projectId: string, userId: string = 'local'): Promise<Task[]> {
    const all = await this.getAll(userId);
    return all.filter((t) => t.projectId === projectId);
  }

  async upsert(task: Task): Promise<void> {
    try {
      const db = await openDatabase();
      const estimate = task.estimateMinutes ?? task.estimatedMinutes ?? null;
      await db.runAsync(
        `INSERT INTO tasks (
          id, user_id, project_id, title, description, priority,
          status, due_date, due_time, estimate_minutes,
          created_at, updated_at, completed_at, sync_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          project_id=excluded.project_id,
          title=excluded.title,
          description=excluded.description,
          priority=excluded.priority,
          status=excluded.status,
          due_date=excluded.due_date,
          due_time=excluded.due_time,
          estimate_minutes=excluded.estimate_minutes,
          updated_at=excluded.updated_at,
          completed_at=excluded.completed_at,
          sync_status=excluded.sync_status`,
        [
          task.id,
          task.userId || 'local',
          task.projectId ?? null,
          task.title,
          task.description ?? null,
          task.priority || 'medium',
          task.status || (task.completed ? 'completed' : 'pending'),
          task.dueDate ?? null,
          task.dueTime ?? null,
          estimate,
          task.createdAt || new Date().toISOString(),
          task.updatedAt || new Date().toISOString(),
          task.completedAt ?? null,
          task.syncStatus || 'pending',
        ]
      );

      // Upsert subtasks if present
      if (task.subtasks && task.subtasks.length > 0) {
        await db.runAsync('DELETE FROM subtasks WHERE task_id = ?', [task.id]);
        for (let i = 0; i < task.subtasks.length; i++) {
          const s = task.subtasks[i];
          await db.runAsync(
            `INSERT INTO subtasks (id, task_id, title, completed, completed_at, position)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              s.id || `sub-${task.id}-${i}`,
              task.id,
              s.title,
              s.completed ? 1 : 0,
              s.completedAt ?? null,
              s.position ?? i,
            ]
          );
        }
      }
    } catch (err) {
      console.warn('[LocalTaskRepository] SQLite error upserting task:', err);
    }
  }

  async getById(id: string): Promise<Task | null> {
    try {
      const db = await openDatabase();
      const taskRow = await db.getFirstAsync<any>(
        `SELECT t.*, p.name as project_name 
         FROM tasks t 
         LEFT JOIN projects p ON t.project_id = p.id 
         WHERE t.id = ?`,
        [id]
      );
      if (!taskRow) return null;

      const subtaskRows = await db.getAllAsync<any>(
        `SELECT * FROM subtasks WHERE task_id = ? ORDER BY position ASC`,
        [id]
      );
      const subtasks: Subtask[] = subtaskRows.map((s) => ({
        id: s.id,
        taskId: s.task_id,
        title: s.title,
        completed: Boolean(s.completed),
        completedAt: s.completed_at ?? undefined,
        position: s.position,
      }));

      return mapRowToTask(taskRow, subtasks);
    } catch (err) {
      console.warn('[LocalTaskRepository] SQLite error getting task by id:', err);
      return null;
    }
  }

  async save(tasks: Task[], userId?: string): Promise<void> {
    for (const t of tasks) {
      await this.upsert(userId ? { ...t, userId } : t);
    }
  }

  async delete(taskId: string): Promise<void> {
    try {
      const db = await openDatabase();
      await db.runAsync('DELETE FROM subtasks WHERE task_id = ?', [taskId]);
      await db.runAsync('DELETE FROM tasks WHERE id = ?', [taskId]);
    } catch (err) {
      console.warn('[LocalTaskRepository] SQLite error deleting task:', err);
    }
  }

  async clearForUser(userId: string): Promise<void> {
    try {
      const db = await openDatabase();
      const taskRows = await db.getAllAsync<{ id: string }>('SELECT id FROM tasks WHERE user_id = ?', [userId]);
      for (const t of taskRows) {
        await db.runAsync('DELETE FROM subtasks WHERE task_id = ?', [t.id]);
      }
      await db.runAsync('DELETE FROM tasks WHERE user_id = ?', [userId]);
    } catch (err) {
      console.warn('[LocalTaskRepository] SQLite error clearing user tasks:', err);
    }
  }
}

function mapRowToTask(row: any, subtasks: Subtask[]): Task {
  const isCompleted = row.status === 'completed';
  return {
    id: row.id,
    userId: row.user_id,
    projectId: row.project_id ?? undefined,
    projectName: row.project_name ?? undefined,
    title: row.title,
    description: row.description ?? undefined,
    priority: row.priority,
    status: row.status,
    completed: isCompleted,
    dueDate: row.due_date ?? undefined,
    dueTime: row.due_time ?? undefined,
    estimateMinutes: row.estimate_minutes ?? undefined,
    estimatedMinutes: row.estimate_minutes ?? undefined,
    completedAt: row.completed_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    syncStatus: row.sync_status,
    subtasks,
  };
}
