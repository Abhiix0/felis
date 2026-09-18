import type { Task } from '@felis/types';

export interface ProjectStats {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  progressPercent: number;
}

export function getProjectStats(projectId: string, tasks: Task[]): ProjectStats {
  const projectTasks = tasks.filter((t) => t.projectId === projectId);
  const completedTasks = projectTasks.filter(
    (t) => t.completed || t.status === 'completed'
  ).length;
  const totalTasks = projectTasks.length;
  const activeTasks = totalTasks - completedTasks;
  const progressPercent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  return { totalTasks, activeTasks, completedTasks, progressPercent };
}
