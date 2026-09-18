import { LocalTaskRepository } from '../storage/LocalTaskRepository';
import { SyncQueue } from '../storage/SyncQueue';
import { v4 as uuidv4 } from 'uuid';
import type { Task, Project } from '@felis/types';
import type { CreateTaskInput, UpdateTaskInput } from '@felis/validation';

export class TaskService {
  constructor(
    private local: LocalTaskRepository,
    private queue: SyncQueue = new SyncQueue()
  ) {}

  async getAll(userId: string = 'local'): Promise<Task[]> {
    return this.local.getAll(userId);
  }

  async getByProject(projectId: string, userId: string = 'local'): Promise<Task[]> {
    return this.local.getByProject(projectId, userId);
  }

  async create(
    input: CreateTaskInput,
    projects: Project[] = [],
    userId: string = 'local'
  ): Promise<Task> {
    const project = input.projectId
      ? projects.find((p) => p.id === input.projectId)
      : undefined;
    const task: Task = {
      id: uuidv4(),
      userId,
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
      syncStatus: 'pending',
    };

    // 1. Optimistic write to local SQLite
    await this.local.upsert(task);

    // 2. Enqueue mutation
    try {
      await this.queue.enqueue(
        'CREATE_TASK',
        {
          id: task.id,
          projectId: task.projectId,
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate,
          dueTime: task.dueTime,
          estimateMinutes: task.estimateMinutes,
        },
        userId
      );
    } catch (err) {
      console.warn('[TaskService] Failed to enqueue CREATE_TASK:', err);
    }

    return task;
  }

  async complete(taskId: string, userId: string = 'local'): Promise<Task | null> {
    const target = await this.local.getById(taskId);
    if (!target) return null;
    const updated: Task = {
      ...target,
      completed: true,
      status: 'completed',
      completedAt: 'Just now',
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending',
    };

    await this.local.upsert(updated);

    try {
      await this.queue.enqueue('COMPLETE_TASK', { taskId }, userId);
    } catch (err) {
      console.warn('[TaskService] Failed to enqueue COMPLETE_TASK:', err);
    }

    return updated;
  }

  async toggle(taskId: string, userId: string = 'local'): Promise<Task | null> {
    const target = await this.local.getById(taskId);
    if (!target) return null;
    const isCompleted = !target.completed;
    const updated: Task = {
      ...target,
      completed: isCompleted,
      status: isCompleted ? 'completed' : 'pending',
      completedAt: isCompleted ? 'Just now' : undefined,
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending',
    };

    await this.local.upsert(updated);

    try {
      if (isCompleted) {
        await this.queue.enqueue('COMPLETE_TASK', { taskId }, userId);
      } else {
        await this.queue.enqueue(
          'UPDATE_TASK',
          { id: taskId, completed: false, status: 'pending' },
          userId
        );
      }
    } catch (err) {
      console.warn('[TaskService] Failed to enqueue toggle mutation:', err);
    }

    return updated;
  }

  async update(
    taskId: string,
    changes: UpdateTaskInput | Partial<Task>,
    userId: string = 'local'
  ): Promise<Task | null> {
    const target = await this.local.getById(taskId);
    if (!target) return null;
    const updated: Task = {
      ...target,
      ...changes,
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending',
    };
    await this.local.upsert(updated);

    try {
      await this.queue.enqueue(
        'UPDATE_TASK',
        { id: taskId, ...changes },
        userId
      );
    } catch (err) {
      console.warn('[TaskService] Failed to enqueue UPDATE_TASK:', err);
    }

    return updated;
  }

  async delete(taskId: string, userId: string = 'local'): Promise<void> {
    await this.local.delete(taskId);
    try {
      await this.queue.enqueue('DELETE_TASK', { id: taskId }, userId);
    } catch (err) {
      console.warn('[TaskService] Failed to enqueue DELETE_TASK:', err);
    }
  }
}

