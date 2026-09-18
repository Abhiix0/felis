// Core enums
export type Priority = 'low' | 'medium' | 'high';
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type FocusSessionStatus = 'running' | 'active' | 'paused' | 'finished' | 'completed' | 'abandoned';
export type SyncStatus = 'synced' | 'pending' | 'failed' | 'conflict';
export type MemoryType = 'explicit' | 'inferred';
export type MemoryStatus = 'active' | 'deleted';
export type IconType = 'terminal' | 'database' | 'cloud' | 'file';

// User & Profile
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string; // ISO 8601
  updatedAt: string;
}

export interface Profile {
  userId: string;
  timezone: string;
  preferredFocusMinutes: number; // default: 25
  workStartHour: number;         // 0-23, default: 9
  workEndHour: number;           // 0-23, default: 18
}

// Project
export interface Project {
  id: string;
  userId?: string;
  name: string;
  goal?: string;
  description?: string;
  techStack?: string[];
  stack?: string[]; // compatibility with mobile client
  iconType: IconType;
  status?: ProjectStatus;
  syncStatus?: SyncStatus;
  createdAt?: string;
  updatedAt?: string;
}

// Subtask
export interface Subtask {
  id: string;
  taskId?: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  position?: number;
}

// TaskRecurrence
export interface TaskRecurrence {
  id: string;
  taskId: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number; // every N days/weeks/months
  endsAt?: string;
}

// Task
export interface Task {
  id: string;
  userId?: string;
  projectId?: string;   // nullable — standalone tasks allowed
  title: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  completed?: boolean;  // client compatibility
  scheduledTime?: string;
  dueDate?: string;     // ISO 8601 date YYYY-MM-DD or display label
  dueTime?: string;     // HH:MM (24h)
  estimateMinutes?: number;
  estimatedMinutes?: number; // client compatibility
  recurrenceId?: string;
  subtasks?: Subtask[];
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
  syncStatus?: SyncStatus;
  // Display helpers (client-only, derived from projectId lookup)
  projectName?: string;
}

// FocusSession
export interface FocusSession {
  id: string;
  userId: string;
  taskId: string;
  plannedMinutes: number;
  startedAt: string;    // ISO 8601
  endedAt?: string;
  actualMinutes?: number;
  status: FocusSessionStatus;
  pausedTotalSeconds: number;
  syncStatus?: SyncStatus;
}

// Recommendation
export interface RecommendationSignal {
  type: 'urgency' | 'priority' | 'project_importance' | 'blocking_impact'
       | 'time_fit' | 'recency_context' | 'preference_fit';
  value: number;     // contribution to total score
  reason: string;    // human-readable explanation (deterministic, grounded)
}

export interface Recommendation {
  id?: string;
  taskId: string;
  title?: string; // client compatibility
  projectId?: string; // client compatibility
  projectName?: string; // client compatibility
  dueDateLabel?: string; // client compatibility
  estimatedMinutes?: number; // client compatibility
  priority?: Priority; // client compatibility
  reasonBullets?: string[]; // client compatibility
  score?: number;
  signals?: RecommendationSignal[];
  createdAt?: string;
  stateSnapshotVersion?: string; // hash or timestamp of state used to compute
}

export interface RecommendationOutcome {
  recommendationId: string;
  event: 'shown' | 'accepted' | 'started' | 'dismissed' | 'completed' | 'corrected';
  recordedAt: string;
  correctedTaskId?: string; // if user chose a different task
}

// Memory
export interface Memory {
  id: string;
  userId: string;
  type: MemoryType;
  key: string;
  value: string;
  provenance: string;  // how this was created
  confidence: number;  // 0.0–1.0 (explicit=1.0, inferred starts lower)
  status: MemoryStatus;
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
}

// ActivityEvent
export type ActivityEventType =
  | 'task_created' | 'task_completed' | 'task_reopened' | 'task_started'
  | 'focus_started' | 'focus_finished'
  | 'recommendation_shown' | 'recommendation_accepted' | 'recommendation_dismissed'
  | 'project_created';

export interface ActivityEvent {
  id: string;
  userId: string;
  type: ActivityEventType;
  entityId: string;       // task ID, project ID, etc.
  entityType: 'task' | 'project' | 'focus_session' | 'recommendation';
  metadata?: Record<string, unknown>;
  occurredAt: string;
}

// SyncMutation
export interface SyncMutation {
  clientMutationId: string;  // UUID, client-generated
  type: string;              // 'CREATE_TASK' | 'COMPLETE_TASK' | etc.
  payload: unknown;
  createdAt: string;
  status: SyncStatus;
  retryCount: number;
  lastAttemptAt?: string;
  error?: string;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  category: 'critical_deadline' | 'planned_work' | 'daily_briefing'
           | 'daily_review' | 'agent_suggestion';
  title: string;
  body: string;
  entityId?: string;
  scheduledFor?: string;
  sentAt?: string;
  dedupeKey: string;
}

export interface NotificationPreferences {
  userId: string;
  criticalDeadlinesEnabled: boolean;
  plannedWorkEnabled: boolean;
  dailyBriefingEnabled: boolean;
  dailyBriefingTime: string;  // HH:MM
  dailyReviewEnabled: boolean;
  dailyReviewTime: string;
  quietHoursStart?: string;   // HH:MM
  quietHoursEnd?: string;
}

// AgentConversation
export interface AgentToolCall {
  id: string;
  messageId: string;
  toolName: string;
  arguments: Record<string, unknown>;
  result?: unknown;
  status: 'pending' | 'success' | 'failed';
  executedAt?: string;
}

export interface AgentMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: AgentToolCall[];
  createdAt: string;
}

export interface AgentConversation {
  id: string;
  userId: string;
  messages: AgentMessage[];
  context?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// DailyReview
export interface DailyReview {
  id: string;
  userId: string;
  date: string;           // YYYY-MM-DD
  tasksCompleted: number;
  tasksCarriedForward: number;
  plannedMinutes: number;
  actualMinutes: number;
  topCompletions: string[];  // task IDs
  tomorrowCandidates: string[]; // task IDs
  generatedAt: string;
}

// TechRadarItem
export interface TechRadarItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary?: string;
  topics: string[];
  relevanceScore?: number;
}
