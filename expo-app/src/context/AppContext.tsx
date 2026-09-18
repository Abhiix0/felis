import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Project, Task, Recommendation } from '../types';
import { computeNextAction } from '../domain/recommendation';
import { loadState, saveState, clearState } from '../storage/persistence';
import { LoadingState, ErrorState } from '../components/ui';
import { triggerHaptic } from '../utils/haptics';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-spawn',
    name: 'Spawn',
    iconType: 'terminal',
    description: 'Developer CLI',
    stack: ['Python', 'CLI', 'Backend'],
    totalTasks: 5,
    activeTasks: 1,
    progressPercent: 80,
  },
  {
    id: 'proj-ucdp',
    name: 'UCDP',
    iconType: 'database',
    description: 'Data Pipeline',
    stack: ['Go', 'Postgres', 'Kafka'],
    totalTasks: 4,
    activeTasks: 3,
    progressPercent: 25,
  },
  {
    id: 'proj-preflight',
    name: 'Preflight',
    iconType: 'cloud',
    description: 'Deployment checks',
    stack: ['TypeScript', 'Docker', 'AWS'],
    totalTasks: 3,
    activeTasks: 1,
    progressPercent: 67,
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-auth-tests',
    title: 'Finish authentication tests',
    projectId: 'proj-spawn',
    projectName: 'Spawn',
    completed: false,
    scheduledTime: '16:00',
    dueDate: 'Due tomorrow',
    estimatedMinutes: 35,
    priority: 'high',
    subtasks: [
      { id: 'sub-1', title: 'Login tests', completed: false },
      { id: 'sub-2', title: 'Token validation', completed: false },
      { id: 'sub-3', title: 'Error cases', completed: false },
    ],
  },
  {
    id: 'task-db-migrations',
    title: 'Review database migrations',
    projectId: 'proj-ucdp',
    projectName: 'UCDP',
    completed: false,
    scheduledTime: '17:30',
    dueDate: 'Today',
    estimatedMinutes: 45,
    priority: 'medium',
  },
  {
    id: 'task-preflight-yaml',
    title: 'Update preflight config',
    projectId: 'proj-preflight',
    projectName: 'Preflight',
    completed: false,
    scheduledTime: '19:00',
    dueDate: 'Due Friday',
    estimatedMinutes: 20,
    priority: 'low',
  },
  {
    id: 'task-standup-notes',
    title: 'Write standup notes',
    projectId: 'proj-spawn',
    projectName: 'Spawn',
    completed: true,
    completedAt: '09:15',
    dueDate: 'Today',
    estimatedMinutes: 10,
    priority: 'low',
  },
];

export const INITIAL_RECOMMENDATION: Recommendation = {
  taskId: 'task-auth-tests',
  title: 'Finish authentication tests',
  projectId: 'proj-spawn',
  projectName: 'Spawn',
  dueDateLabel: 'Due tomorrow',
  estimatedMinutes: 35,
  priority: 'high',
  reasonBullets: [
    'Due tomorrow',
    'High priority',
    'Matches your ~30m focus window',
  ],
};

interface FocusSessionState {
  taskId: string;
  taskTitle: string;
  projectName: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isFinished: boolean;
  subtasks: { id: string; title: string; completed: boolean }[];
  estimatedMinutes: number;
  actualMinutes: number;
}

interface AppContextType {
  projects: Project[];
  tasks: Task[];
  recommendation: Recommendation | null;
  focusSession: FocusSessionState | null;
  isLoadingState: boolean;
  loadError: string | null;
  retryLoad: () => Promise<void>;
  toggleTask: (taskId: string) => void;
  toggleSubtask: (subtaskId: string) => void;
  createTask: (title: string, projectId: string, priority: 'low' | 'medium' | 'high', due: string, estMin: number) => void;
  createProject: (name: string, description: string) => void;
  startFocus: (taskId?: string) => void;
  pauseFocus: () => void;
  resumeFocus: () => void;
  finishFocus: () => void;
  resetFocus: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const recommendation = useMemo(() => computeNextAction(tasks), [tasks]);

  const performLoad = async () => {
    setIsLoadingState(true);
    setLoadError(null);
    try {
      const stored = await loadState();
      if (stored) {
        if (Array.isArray(stored.projects)) {
          setProjects(stored.projects);
        }
        if (Array.isArray(stored.tasks)) {
          setTasks(stored.tasks);
        }
      }
    } catch (err: any) {
      console.error('[AppContext] Failed to load persisted state:', err);
      setLoadError(err?.message || "Couldn't load your projects. Please try again.");
    } finally {
      setIsLoadingState(false);
      setIsHydrated(true);
    }
  };

  // Hydrate persisted state on mount
  useEffect(() => {
    performLoad();
  }, []);

  // Save changes on every task/project mutation once hydrated
  useEffect(() => {
    if (isHydrated && !isLoadingState && !loadError) {
      saveState({ projects, tasks });
    }
  }, [projects, tasks, isHydrated, isLoadingState, loadError]);

  const [focusSession, setFocusSession] = useState<FocusSessionState | null>({
    taskId: 'task-auth-tests',
    taskTitle: 'Finish authentication tests',
    projectName: 'Spawn',
    totalSeconds: 27 * 60 + 42,
    remainingSeconds: 27 * 60 + 42,
    isRunning: true,
    isFinished: false,
    subtasks: [
      { id: 'sub-1', title: 'Login tests', completed: false },
      { id: 'sub-2', title: 'Token validation', completed: false },
      { id: 'sub-3', title: 'Error cases', completed: false },
    ],
    estimatedMinutes: 35,
    actualMinutes: 41,
  });

  // Track background/foreground transitions to prevent timer drift on physical devices
  useEffect(() => {
    let backgroundedAt: number | null = null;

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        backgroundedAt = Date.now();
      } else if (nextAppState === 'active' && backgroundedAt !== null) {
        const elapsed = Math.floor((Date.now() - backgroundedAt) / 1000);
        backgroundedAt = null;

        if (elapsed > 0) {
          setFocusSession((prev) => {
            if (!prev || !prev.isRunning || prev.isFinished) return prev;
            const newRemaining = Math.max(0, prev.remainingSeconds - elapsed);
            if (newRemaining <= 0) {
              if (prev.taskId) {
                setTasks((currentTasks) =>
                  currentTasks.map((t) => {
                    if (t.id === prev.taskId && !t.completed) {
                      return { ...t, completed: true, completedAt: 'Just now' };
                    }
                    return t;
                  })
                );
              }
              triggerHaptic('success');
              return {
                ...prev,
                remainingSeconds: 0,
                isRunning: false,
                isFinished: true,
              };
            }
            return {
              ...prev,
              remainingSeconds: newRemaining,
            };
          });
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Functional Focus Timer
  useEffect(() => {
    let interval: any = null;
    if (focusSession && focusSession.isRunning && !focusSession.isFinished) {
      interval = setInterval(() => {
        setFocusSession((prev) => {
          if (!prev || !prev.isRunning) return prev;
          if (prev.remainingSeconds <= 1) {
            if (prev.taskId) {
              setTasks((currentTasks) =>
                currentTasks.map((t) => {
                  if (t.id === prev.taskId && !t.completed) {
                    return { ...t, completed: true, completedAt: 'Just now' };
                  }
                  return t;
                })
              );
            }
            triggerHaptic('success');
            return {
              ...prev,
              remainingSeconds: 0,
              isRunning: false,
              isFinished: true,
            };
          }
          return {
            ...prev,
            remainingSeconds: prev.remainingSeconds - 1,
          };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusSession?.isRunning, focusSession?.isFinished]);

  const toggleTask = (taskId: string) => {
    triggerHaptic('light');
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const next = !t.completed;
          return { ...t, completed: next, completedAt: next ? 'Just now' : undefined };
        }
        return t;
      })
    );
  };

  const toggleSubtask = (subtaskId: string) => {
    triggerHaptic('selection');
    setFocusSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        subtasks: prev.subtasks.map((s) =>
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        ),
      };
    });
  };

  const createTask = (
    title: string,
    projectId: string,
    priority: 'low' | 'medium' | 'high',
    due: string,
    estMin: number
  ) => {
    const project =
      projects.find((p) => p.id === projectId || p.name === projectId) || projects[0];
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      projectId: project.id,
      projectName: project.name,
      completed: false,
      dueDate: due || 'Due Friday',
      estimatedMinutes: estMin || 30,
      priority,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const createProject = (name: string, description: string) => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name,
      iconType: 'terminal',
      description,
      stack: ['TypeScript', 'Node.js'],
      totalTasks: 0,
      activeTasks: 0,
      progressPercent: 0,
    };
    setProjects((prev) => [...prev, newProj]);
  };

  const startFocus = (taskId?: string) => {
    const target = tasks.find((t) => t.id === taskId) || tasks[0];
    setFocusSession({
      taskId: target.id,
      taskTitle: target.title,
      projectName: target.projectName,
      totalSeconds: (target.estimatedMinutes || 28) * 60,
      remainingSeconds: (target.estimatedMinutes || 28) * 60,
      isRunning: true,
      isFinished: false,
      subtasks: target.subtasks || [
        { id: 'sub-1', title: 'Login tests', completed: false },
        { id: 'sub-2', title: 'Token validation', completed: false },
        { id: 'sub-3', title: 'Error cases', completed: false },
      ],
      estimatedMinutes: target.estimatedMinutes || 35,
      actualMinutes: 41,
    });
  };

  const pauseFocus = () => {
    setFocusSession((prev) => (prev ? { ...prev, isRunning: false } : null));
  };

  const resumeFocus = () => {
    setFocusSession((prev) => (prev ? { ...prev, isRunning: true } : null));
  };

  const finishFocus = () => {
    triggerHaptic('success');
    setFocusSession((prev) => {
      if (!prev) return null;
      if (prev.taskId) {
        setTasks((currentTasks) =>
          currentTasks.map((t) => {
            if (t.id === prev.taskId && !t.completed) {
              return { ...t, completed: true, completedAt: 'Just now' };
            }
            return t;
          })
        );
      }
      return { ...prev, isRunning: false, isFinished: true };
    });
  };

  const resetFocus = () => {
    setFocusSession((prev) =>
      prev
        ? {
            ...prev,
            remainingSeconds: prev.totalSeconds,
            isRunning: false,
            isFinished: false,
          }
        : null
    );
  };

  const resetDemoData = () => {
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    clearState();
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        tasks,
        recommendation,
        focusSession,
        isLoadingState,
        loadError,
        retryLoad: performLoad,
        toggleTask,
        toggleSubtask,
        createTask,
        createProject,
        startFocus,
        pauseFocus,
        resumeFocus,
        finishFocus,
        resetFocus,
        resetDemoData,
      }}
    >
      {isLoadingState ? (
        <LoadingState message="Loading your projects..." fullScreen />
      ) : loadError ? (
        <ErrorState
          title="Something went wrong."
          message={loadError}
          onRetry={performLoad}
          fullScreen
        />
      ) : (
        children
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
