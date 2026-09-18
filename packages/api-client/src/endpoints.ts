import type { Project, Task, Recommendation, FocusSession, User, Profile } from '@felis/types';
import type {
  CreateProjectInput,
  UpdateProjectInput,
  CreateTaskInput,
  UpdateTaskInput,
} from '@felis/validation';
import { FelisApiClient } from './client';
import {
  mapProjectFromApi,
  mapProjectToApi,
  mapTaskFromApi,
  mapTaskToApi,
  mapRecommendationFromApi,
  mapFocusSessionFromApi,
  mapUserFromApi,
  mapProfileFromApi,
} from './mappers';

export class ProjectsApi {
  constructor(private client: FelisApiClient) {}

  async list(): Promise<Project[]> {
    const raw = await this.client.get<any[]>('/projects');
    return Array.isArray(raw) ? raw.map(mapProjectFromApi) : [];
  }

  async create(input: CreateProjectInput, mutationId?: string): Promise<Project> {
    const body = mapProjectToApi(input);
    const raw = await this.client.post<any>('/projects', body, mutationId);
    return mapProjectFromApi(raw);
  }

  async get(id: string): Promise<Project> {
    const raw = await this.client.get<any>(`/projects/${id}`);
    return mapProjectFromApi(raw);
  }

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const body = mapProjectToApi(input);
    const raw = await this.client.patch<any>(`/projects/${id}`, body);
    return mapProjectFromApi(raw);
  }

  async delete(id: string): Promise<void> {
    return this.client.delete<void>(`/projects/${id}`);
  }
}

export class TasksApi {
  constructor(private client: FelisApiClient) {}

  async list(projectId?: string, status?: string): Promise<Task[]> {
    const params = new URLSearchParams();
    if (projectId) params.set('projectId', projectId);
    if (status) params.set('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';
    const raw = await this.client.get<any[]>(`/tasks${query}`);
    return Array.isArray(raw) ? raw.map(mapTaskFromApi) : [];
  }

  async create(input: CreateTaskInput, mutationId?: string): Promise<Task> {
    const body = mapTaskToApi(input);
    const raw = await this.client.post<any>('/tasks', body, mutationId);
    return mapTaskFromApi(raw);
  }

  async get(id: string): Promise<Task> {
    const raw = await this.client.get<any>(`/tasks/${id}`);
    return mapTaskFromApi(raw);
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const body = mapTaskToApi(input);
    const raw = await this.client.patch<any>(`/tasks/${id}`, body);
    return mapTaskFromApi(raw);
  }

  async complete(id: string, mutationId?: string): Promise<Task> {
    const raw = await this.client.post<any>(`/tasks/${id}/complete`, {}, mutationId);
    return mapTaskFromApi(raw);
  }

  async delete(id: string): Promise<void> {
    return this.client.delete<void>(`/tasks/${id}`);
  }
}

export class RecommendationsApi {
  constructor(private client: FelisApiClient) {}

  async getNextAction(): Promise<Recommendation | null> {
    const raw = await this.client.get<any>('/recommendations/next-action');
    return mapRecommendationFromApi(raw);
  }

  async recordOutcome(
    recommendationId: string,
    event: 'shown' | 'accepted' | 'started' | 'dismissed' | 'completed' | 'corrected',
    correctedTaskId?: string
  ): Promise<void> {
    return this.client.post<void>(`/recommendations/${recommendationId}/outcome`, {
      event,
      corrected_task_id: correctedTaskId,
      recorded_at: new Date().toISOString(),
    });
  }
}

export class FocusApi {
  constructor(private client: FelisApiClient) {}

  async start(taskId: string, plannedMinutes: number, mutationId?: string): Promise<FocusSession> {
    const raw = await this.client.post<any>(
      '/focus-sessions',
      { taskId, plannedMinutes },
      mutationId
    );
    return mapFocusSessionFromApi(raw);
  }

  async end(
    id: string,
    endedAt: string,
    actualMinutes: number,
    status: 'finished' | 'abandoned'
  ): Promise<FocusSession> {
    const raw = await this.client.patch<any>(`/focus-sessions/${id}`, {
      endedAt,
      actualMinutes,
      status,
    });
    return mapFocusSessionFromApi(raw);
  }
}

export class UsersApi {
  constructor(private client: FelisApiClient) {}

  async getMe(): Promise<{ user: User; profile: Profile }> {
    const raw = await this.client.get<any>('/me');
    return {
      user: mapUserFromApi(raw),
      profile: mapProfileFromApi(raw.profile || {}),
    };
  }

  async updateMe(data: {
    displayName?: string;
    timezone?: string;
    preferredFocusMinutes?: number;
    workStartHour?: number;
    workEndHour?: number;
  }): Promise<{ user: User; profile: Profile }> {
    const raw = await this.client.patch<any>('/me', {
      display_name: data.displayName,
      timezone: data.timezone,
      preferred_focus_minutes: data.preferredFocusMinutes,
      work_start_hour: data.workStartHour,
      work_end_hour: data.workEndHour,
    });
    return {
      user: mapUserFromApi(raw),
      profile: mapProfileFromApi(raw.profile || {}),
    };
  }
}
