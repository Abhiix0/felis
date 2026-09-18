import type { CreateProjectInput, UpdateProjectInput } from '@felis/validation';
import type { CreateTaskInput, UpdateTaskInput } from '@felis/validation';
import { FelisApiClient } from './client';

export class ProjectsApi {
  constructor(private client: FelisApiClient) {}
  list<T = any>() {
    return this.client.get<T[]>('/projects');
  }
  create<T = any>(input: CreateProjectInput) {
    return this.client.post<T>('/projects', input);
  }
  get<T = any>(id: string) {
    return this.client.get<T>(`/projects/${id}`);
  }
  update<T = any>(id: string, input: UpdateProjectInput) {
    return this.client.patch<T>(`/projects/${id}`, input);
  }
  delete(id: string) {
    return this.client.delete<void>(`/projects/${id}`);
  }
}

export class TasksApi {
  constructor(private client: FelisApiClient) {}
  list<T = any>(projectId?: string) {
    const query = projectId ? `?projectId=${projectId}` : '';
    return this.client.get<T[]>(`/tasks${query}`);
  }
  create<T = any>(input: CreateTaskInput, mutationId?: string) {
    return this.client.post<T>('/tasks', input, mutationId);
  }
  complete<T = any>(id: string, mutationId?: string) {
    return this.client.post<T>(`/tasks/${id}/complete`, {}, mutationId);
  }
  update<T = any>(id: string, input: UpdateTaskInput) {
    return this.client.patch<T>(`/tasks/${id}`, input);
  }
  delete(id: string) {
    return this.client.delete<void>(`/tasks/${id}`);
  }
}

export class RecommendationsApi {
  constructor(private client: FelisApiClient) {}
  getNextAction<T = any>() {
    return this.client.get<T>('/recommendations/next-action');
  }
  recordOutcome(id: string, event: string, correctedTaskId?: string) {
    return this.client.post<void>(`/recommendations/${id}/outcome`, {
      event,
      correctedTaskId,
      recordedAt: new Date().toISOString(),
    });
  }
}

export class FocusApi {
  constructor(private client: FelisApiClient) {}
  start<T = any>(taskId: string, plannedMinutes: number, mutationId?: string) {
    return this.client.post<T>(
      '/focus-sessions',
      { taskId, plannedMinutes },
      mutationId
    );
  }
  end<T = any>(
    id: string,
    endedAt: string,
    actualMinutes: number,
    status: 'finished' | 'abandoned'
  ) {
    return this.client.patch<T>(`/focus-sessions/${id}`, {
      endedAt,
      actualMinutes,
      status,
    });
  }
}
