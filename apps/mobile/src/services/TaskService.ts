import { LocalTaskRepository } from '../storage/LocalTaskRepository';
import type { Task, Project } from '@felis/types';
import type { CreateTaskInput, UpdateTaskInput } from '@felis/validation';

export class TaskService {
  constructor(private local: LocalTaskRepository) {}

  async getAll(): Promise<Task[]> {
    return this.local.getAll();
  }

  async getByProject(projectId: string): Promise<Task[]> {
    const all = await this.local.getAll();
    return all.filter((t) => t.projectId === projectId);
  }

  async create(input: CreateTaskInput, projects: Project[] = []): Promise<Task> {
    const project = input.projectId
      ? projects.find((p) => p.id === input.projectId)
      : undefined;
    const task: Task = {
      id: `local-task-${Date.now()}`,
      userId: 'local',
      projectId: project?.id || input.projectId,
      projectName: project?.name,
      title: input.title,
      description: input.description,
      priority: input.priority ?? 'medium',
      status: 'pending',
      completed: false,
      dueDate: input.dueDate,
      dueTime: input.dueTime,
      estimateMinutes: input.estimateMinutes,
      estimatedMinutes: input.estimateMinutes,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await this.local.upsert(task);
    return task;
  }

  async complete(taskId: string): Promise<Task | null> {
    const all = await this.local.getAll();
    const target = all.find((t) => t.id === taskId);
    if (!target) return null;
    const updated: Task = {
      ...target,
      completed: true,
      status: 'completed',
      completedAt: 'Just now',
      updatedAt: new Date().toISOString(),
    };
    await this.local.upsert(updated);
    return updated;
  }

  async toggle(taskId: string): Promise<Task | null> {
    const all = await this.local.getAll();
    const target = all.find((t) => t.id === taskId);
    if (!target) return null;
    const isCompleted = !target.completed;
    const updated: Task = {
      ...target,
      completed: isCompleted,
      status: isCompleted ? 'completed' : 'pending',
      completedAt: isCompleted ? 'Just now' : undefined,
      updatedAt: new Date().toISOString(),
    };
    await this.local.upsert(updated);
    return updated;
  }

  async update(
    taskId: string,
    changes: UpdateTaskInput | Partial<Task>
  ): Promise<Task | null> {
    const all = await this.local.getAll();
    const target = all.find((t) => t.id === taskId);
    if (!target) return null;
    const updated: Task = {
      ...target,
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    await this.local.upsert(updated);
    return updated;
  }

  async delete(taskId: string): Promise<void> {
    await this.local.delete(taskId);
  }
}
