import { LocalProjectRepository } from '../storage/LocalProjectRepository';
import { SyncQueue } from '../storage/SyncQueue';
import type { Project } from '@felis/types';
import type { CreateProjectInput } from '@felis/validation';

export class ProjectService {
  constructor(
    private local: LocalProjectRepository,
    private queue: SyncQueue = new SyncQueue()
  ) {}

  async getAll(): Promise<Project[]> {
    return this.local.getAll();
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const project: Project = {
      id: `local-proj-${Date.now()}`,
      userId: 'local',
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
      await this.queue.enqueue('CREATE_PROJECT', {
        id: project.id,
        name: project.name,
        goal: project.goal,
        description: project.description,
        techStack: project.techStack,
        iconType: project.iconType,
      });
    } catch (err) {
      console.warn('[ProjectService] Failed to enqueue CREATE_PROJECT:', err);
    }

    return project;
  }

  async update(id: string, changes: Partial<Project>): Promise<void> {
    const all = await this.local.getAll();
    const target = all.find((p) => p.id === id);
    if (target) {
      await this.local.upsert({
        ...target,
        ...changes,
        updatedAt: new Date().toISOString(),
        syncStatus: 'pending',
      });
    }
  }

  async delete(id: string): Promise<void> {
    await this.local.delete(id);
  }
}
