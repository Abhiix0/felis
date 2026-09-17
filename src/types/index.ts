export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  completed: boolean;
  completedAt?: string;
  scheduledTime?: string;
  dueDate: string;
  estimatedMinutes: number;
  priority: Priority;
  subtasks?: { id: string; title: string; completed: boolean }[];
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  iconType: 'terminal' | 'database' | 'cloud' | 'file';
  description: string;
  stack: string[];
  totalTasks: number;
  activeTasks: number;
  progressPercent: number;
}

export interface Recommendation {
  taskId: string;
  title: string;
  projectName: string;
  estimatedMinutes: number;
  dueDateLabel: string;
  priorityLabel: string;
  reasonBullets: string[];
}

export type MainTab = 'home' | 'projects' | 'radar' | 'profile';

export type ScreenRoute = 
  | 'shell_drawer'
  | 'home'
  | 'projects'
  | 'project_detail'
  | 'tasks'
  | 'add_task'
  | 'focus_session'
  | 'what_should_i_do'
  | 'empty_states'
  | 'state_gallery'
  | 'radar'
  | 'profile';

export type CatPose = 
  | 'idle'
  | 'recommendation'
  | 'empty'
  | 'loading'
  | 'focus'
  | 'completed'
  | 'error'
  | 'peek'
  | 'purr';
