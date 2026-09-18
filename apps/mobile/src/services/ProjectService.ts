import { LocalProjectRepository } from '../storage/LocalProjectRepository';
import type { Project } from '@felis/types';
import type { CreateProjectInput } from '@felis/validation';

export class ProjectService {
  constructor(private local: LocalProjectRepository) {}

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
    };
    await this.local.upsert(project);
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
      });
    }
  }

  async delete(id: string): Promise<void> {
    await this.local.delete(id);
  }
}
