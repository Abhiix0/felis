import type {
  Project,
  Task,
  Subtask,
  Recommendation,
  FocusSession,
  User,
  Profile,
  RecommendationSignal,
} from '@felis/types';
import type {
  CreateProjectInput,
  UpdateProjectInput,
  CreateTaskInput,
  UpdateTaskInput,
} from '@felis/validation';

export function mapProjectFromApi(raw: any): Project {
  if (!raw) return raw;
  return {
    id: raw.id,
    userId: raw.user_id || raw.userId,
    name: raw.name,
    goal: raw.goal,
    description: raw.description,
    techStack: raw.tech_stack || raw.techStack || [],
    stack: raw.tech_stack || raw.techStack || [],
    iconType: raw.icon_type || raw.iconType || 'terminal',
    status: raw.status || 'active',
    createdAt: raw.created_at || raw.createdAt,
    updatedAt: raw.updated_at || raw.updatedAt,
    ...(raw.stats ? { stats: raw.stats } : {}),
  };
}

export function mapProjectToApi(input: CreateProjectInput | UpdateProjectInput | Partial<Project>): any {
  const result: any = {};
  if ('id' in input && input.id !== undefined) result.id = input.id;
  if ('name' in input && input.name !== undefined) result.name = input.name;
  if ('goal' in input && input.goal !== undefined) result.goal = input.goal;
  if ('description' in input && input.description !== undefined) result.description = input.description;
  if ('techStack' in input && input.techStack !== undefined) result.tech_stack = input.techStack;
  if ('tech_stack' in (input as any) && (input as any).tech_stack !== undefined) result.tech_stack = (input as any).tech_stack;
  if ('iconType' in input && input.iconType !== undefined) result.icon_type = input.iconType;
  if ('icon_type' in (input as any) && (input as any).icon_type !== undefined) result.icon_type = (input as any).icon_type;
  if ('status' in input && (input as any).status !== undefined) result.status = (input as any).status;
  return result;
}

export function mapSubtaskFromApi(raw: any): Subtask {
  return {
    id: raw.id,
    taskId: raw.task_id || raw.taskId,
    title: raw.title,
    completed: !!raw.completed,
    completedAt: raw.completed_at || raw.completedAt,
    position: raw.position ?? 0,
  };
}

export function mapTaskFromApi(raw: any): Task {
  if (!raw) return raw;
  return {
    id: raw.id,
    userId: raw.user_id || raw.userId,
    projectId: raw.project_id || raw.projectId,
    projectName: raw.project_name || raw.projectName,
    title: raw.title,
    description: raw.description,
    priority: raw.priority || 'medium',
    status: raw.status || (raw.completed ? 'completed' : 'pending'),
    completed: raw.status === 'completed' || raw.completed === true,
    dueDate: raw.due_date || raw.dueDate,
    dueTime: raw.due_time || raw.dueTime,
    estimateMinutes: raw.estimate_minutes ?? raw.estimated_minutes ?? raw.estimateMinutes ?? raw.estimatedMinutes,
    estimatedMinutes: raw.estimate_minutes ?? raw.estimated_minutes ?? raw.estimateMinutes ?? raw.estimatedMinutes,
    recurrenceId: raw.recurrence_id || raw.recurrenceId,
    subtasks: Array.isArray(raw.subtasks) ? raw.subtasks.map(mapSubtaskFromApi) : [],
    createdAt: raw.created_at || raw.createdAt,
    updatedAt: raw.updated_at || raw.updatedAt,
    completedAt: raw.completed_at || raw.completedAt,
  };
}

export function mapTaskToApi(input: CreateTaskInput | UpdateTaskInput | Partial<Task>): any {
  const result: any = {};
  if ('id' in input && input.id !== undefined) result.id = input.id;
  if ('projectId' in input && input.projectId !== undefined) result.project_id = input.projectId;
  if ('project_id' in (input as any) && (input as any).project_id !== undefined) result.project_id = (input as any).project_id;
  if ('title' in input && input.title !== undefined) result.title = input.title;
  if ('description' in input && input.description !== undefined) result.description = input.description;
  if ('priority' in input && input.priority !== undefined) result.priority = input.priority;
  if ('status' in input && input.status !== undefined) result.status = input.status;
  if ('completed' in input && input.completed !== undefined) {
    result.status = input.completed ? 'completed' : 'pending';
  }
  if ('dueDate' in input && input.dueDate !== undefined) result.due_date = input.dueDate;
  if ('due_date' in (input as any) && (input as any).due_date !== undefined) result.due_date = (input as any).due_date;
  if ('dueTime' in input && input.dueTime !== undefined) result.due_time = input.dueTime;
  if ('due_time' in (input as any) && (input as any).due_time !== undefined) result.due_time = (input as any).due_time;
  if ('estimateMinutes' in input && input.estimateMinutes !== undefined) result.estimate_minutes = input.estimateMinutes;
  if ('estimatedMinutes' in input && input.estimatedMinutes !== undefined) result.estimate_minutes = input.estimatedMinutes;
  if ('estimate_minutes' in (input as any) && (input as any).estimate_minutes !== undefined) result.estimate_minutes = (input as any).estimate_minutes;
  return result;
}

export function mapRecommendationFromApi(raw: any): Recommendation | null {
  if (!raw) return null;
  const taskId = raw.task_id || raw.taskId;
  if (!taskId) return null;

  const signals: RecommendationSignal[] = Array.isArray(raw.signals)
    ? raw.signals.map((s: any) => ({
        type: s.type,
        value: s.value,
        reason: s.reason,
      }))
    : [];

  const estMin = raw.estimated_minutes ?? raw.estimate_minutes ?? raw.estimatedMinutes ?? raw.estimateMinutes ?? 25;
  const priority = raw.priority || 'medium';
  const dueDate = raw.due_date || raw.dueDate;

  return {
    id: raw.id,
    taskId,
    title: raw.title || '',
    projectId: raw.project_id || raw.projectId,
    projectName: raw.project_name || raw.projectName,
    score: raw.score || 0,
    signals,
    estimatedMinutes: estMin,
    dueDateLabel: dueDate || 'Today',
    priority,
    reasonBullets: signals.map((s) => s.reason),
    createdAt: raw.created_at || raw.createdAt,
    stateSnapshotVersion: raw.state_snapshot_version || raw.stateSnapshotVersion || '',
  };
}

export function mapFocusSessionFromApi(raw: any): FocusSession {
  return {
    id: raw.id,
    userId: raw.user_id || raw.userId,
    taskId: raw.task_id || raw.taskId,
    plannedMinutes: raw.planned_minutes ?? raw.plannedMinutes ?? 25,
    startedAt: raw.started_at || raw.startedAt,
    endedAt: raw.ended_at || raw.endedAt,
    actualMinutes: raw.actual_minutes ?? raw.actualMinutes,
    status: raw.status || 'running',
    pausedTotalSeconds: raw.paused_total_seconds ?? raw.pausedTotalSeconds ?? 0,
  };
}

export function mapUserFromApi(raw: any): User {
  return {
    id: raw.id,
    email: raw.email,
    displayName: raw.display_name || raw.displayName || '',
    avatarUrl: raw.avatar_url || raw.avatarUrl,
    createdAt: raw.created_at || raw.createdAt,
    updatedAt: raw.updated_at || raw.updatedAt,
  };
}

export function mapProfileFromApi(raw: any): Profile {
  return {
    userId: raw.user_id || raw.userId,
    timezone: raw.timezone || 'UTC',
    preferredFocusMinutes: raw.preferred_focus_minutes ?? raw.preferredFocusMinutes ?? 25,
    workStartHour: raw.work_start_hour ?? raw.workStartHour ?? 9,
    workEndHour: raw.work_end_hour ?? raw.workEndHour ?? 18,
  };
}

export function toCamelCase<T = any>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map((v) => toCamelCase(v)) as any;
  }
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, g) => g.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

export function toSnakeCase<T = any>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map((v) => toSnakeCase(v)) as any;
  }
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/[A-Z]/g, (g) => `_${g.toLowerCase()}`);
      result[snakeKey] = toSnakeCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

export const mapTaskFromBackend = mapTaskFromApi;
export const mapTaskToBackend = mapTaskToApi;
export const mapProjectFromBackend = mapProjectFromApi;
export const mapProjectToBackend = mapProjectToApi;
export const mapFocusSessionFromBackend = mapFocusSessionFromApi;
export const mapRecommendationFromBackend = mapRecommendationFromApi;

