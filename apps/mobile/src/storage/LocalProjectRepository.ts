import { openDatabase } from './db';
import type { Project } from '@felis/types';

export class LocalProjectRepository {
  async getAll(userId: string = 'local'): Promise<Project[]> {
    try {
      const db = await openDatabase();
      const rows = await db.getAllAsync<any>(
        'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      return rows.map(mapRowToProject);
    } catch (err) {
      console.warn('[LocalProjectRepository] SQLite error reading projects:', err);
      return [];
    }
  }

  async upsert(project: Project): Promise<void> {
    try {
      const db = await openDatabase();
      await db.runAsync(
        `INSERT INTO projects (id, user_id, name, goal, description, tech_stack,
          icon_type, status, created_at, updated_at, sync_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           name=excluded.name, goal=excluded.goal, description=excluded.description,
           tech_stack=excluded.tech_stack, status=excluded.status,
           updated_at=excluded.updated_at, sync_status=excluded.sync_status`,
        [
          project.id,
          project.userId || 'local',
          project.name,
          project.goal ?? null,
          project.description ?? null,
          JSON.stringify(project.techStack || project.stack || []),
          project.iconType || 'terminal',
          project.status || 'active',
          project.createdAt || new Date().toISOString(),
          project.updatedAt || new Date().toISOString(),
          project.syncStatus || 'pending',
        ]
      );
    } catch (err) {
      console.warn('[LocalProjectRepository] SQLite error upserting project:', err);
    }
  }

  async save(projects: Project[]): Promise<void> {
    for (const p of projects) {
      await this.upsert(p);
    }
  }

  async delete(projectId: string): Promise<void> {
    try {
      const db = await openDatabase();
      await db.runAsync('DELETE FROM projects WHERE id = ?', [projectId]);
    } catch (err) {
      console.warn('[LocalProjectRepository] SQLite error deleting project:', err);
    }
  }
}

function mapRowToProject(row: any): Project {
  const techStack = JSON.parse(row.tech_stack || '[]');
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    goal: row.goal ?? undefined,
    description: row.description ?? undefined,
    techStack,
    stack: techStack,
    iconType: row.icon_type,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    syncStatus: row.sync_status,
  };
}
