import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Project } from '@felis/types';

const PROJECTS_KEY = 'felis:v2:projects';

export class LocalProjectRepository {
  async getAll(): Promise<Project[]> {
    try {
      const data = await AsyncStorage.getItem(PROJECTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.warn('[LocalProjectRepository] Error reading projects', err);
      return [];
    }
  }

  async save(projects: Project[]): Promise<void> {
    try {
      await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    } catch (err) {
      console.warn('[LocalProjectRepository] Error saving projects', err);
    }
  }

  async upsert(project: Project): Promise<void> {
    const existing = await this.getAll();
    const index = existing.findIndex((p) => p.id === project.id);
    let updated: Project[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = { ...existing[index], ...project };
    } else {
      updated = [project, ...existing];
    }
    await this.save(updated);
  }

  async delete(projectId: string): Promise<void> {
    const existing = await this.getAll();
    await this.save(existing.filter((p) => p.id !== projectId));
  }
}
