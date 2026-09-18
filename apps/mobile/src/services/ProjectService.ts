import { LocalProjectRepository } from '../storage/LocalProjectRepository';
import { SyncQueue } from '../storage/SyncQueue';
import { v4 as uuidv4 } from 'uuid';
import type { Project } from '@felis/types';
import type { CreateProjectInput, UpdateProjectInput } from '@felis/validation';

export class ProjectService {
  constructor(
    private local: LocalProjectRepository,
    private queue: SyncQueue = new SyncQueue()
  ) {}

  async getAll(userId: string = 'local'): Promise<Project[]> {
    return this.local.getAll(userId);
  }

  async create(
    input: CreateProjectInput,
    userId: string = 'local'
  ): Promise<Project> {
    const project: Project = {
      id: uuidv4(),
      userId,
      name: input.name,
      goal: input.goal,
      description: input.description,
      techStack: input.techStack ?? [],
      stack: input.techStack ?? [],
      iconType: input.iconType ?? 'terminal',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending',
    };

    await this.local.upsert(project);

    try {
      await this.queue.enqueue(
        'CREATE_PROJECT',
        {
          id: project.id,
          name: project.name,
          goal: project.goal,
          description: project.description,
          techStack: project.techStack,
          iconType: project.iconType,
        },
        userId
      );
    } catch (err) {
      console.warn('[ProjectService] Failed to enqueue CREATE_PROJECT:', err);
    }

    return project;
  }

  async update(
    id: string,
    changes: UpdateProjectInput | Partial<Project>,
    userId: string = 'local'
  ): Promise<void> {
    const target = await this.local.getById(id);
    if (target) {
      const updated: Project = {
        ...target,
        ...changes,
        updatedAt: new Date().toISOString(),
        syncStatus: 'pending',
      };
      await this.local.upsert(updated);

      try {
        await this.queue.enqueue(
          'UPDATE_PROJECT',
          { id, ...changes },
          userId
        );
      } catch (err) {
        console.warn('[ProjectService] Failed to enqueue UPDATE_PROJECT:', err);
      }
    }
  }

  async delete(id: string, userId: string = 'local'): Promise<void> {
    await this.local.delete(id);
    try {
      await this.queue.enqueue('DELETE_PROJECT', { id }, userId);
    } catch (err) {
      console.warn('[ProjectService] Failed to enqueue DELETE_PROJECT:', err);
    }
  }
}

