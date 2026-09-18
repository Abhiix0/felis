import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Task } from '@felis/types';

const TASKS_KEY = 'felis:v2:tasks';

export class LocalTaskRepository {
  async getAll(): Promise<Task[]> {
    try {
      const data = await AsyncStorage.getItem(TASKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.warn('[LocalTaskRepository] Error reading tasks', err);
      return [];
    }
  }

  async save(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.warn('[LocalTaskRepository] Error saving tasks', err);
    }
  }

  async upsert(task: Task): Promise<void> {
    const existing = await this.getAll();
    const index = existing.findIndex((t) => t.id === task.id);
    let updated: Task[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = { ...existing[index], ...task };
    } else {
      updated = [task, ...existing];
    }
    await this.save(updated);
  }

  async delete(taskId: string): Promise<void> {
    const existing = await this.getAll();
    await this.save(existing.filter((t) => t.id !== taskId));
  }
}
