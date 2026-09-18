export interface Project {
  id: string;
  name: string;
  iconType: 'terminal' | 'database' | 'cloud' | 'file';
  description: string;
  stack: string[];
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  completed: boolean;
  scheduledTime?: string;
  dueDate?: string;
  estimatedMinutes?: number;
  priority?: 'low' | 'medium' | 'high';
  completedAt?: string;
  subtasks?: { id: string; title: string; completed: boolean }[];
}

export interface Recommendation {
  taskId: string;
  title: string;
  projectId: string;
  projectName: string;
  dueDateLabel: string;
  estimatedMinutes: number;
  priority: 'low' | 'medium' | 'high';
  reasonBullets: string[];
}
