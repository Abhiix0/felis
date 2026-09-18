import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Project, Task, Recommendation } from '../types';
import { computeNextAction } from '../domain/recommendation';
import { loadState, saveState, clearState } from '../storage/persistence';
import { LoadingState, ErrorState } from '../components/ui';
import { triggerHaptic } from '../utils/haptics';
import { LocalProjectRepository } from '../storage/LocalProjectRepository';
import { LocalTaskRepository } from '../storage/LocalTaskRepository';
import { ProjectService } from '../services/ProjectService';
import { TaskService } from '../services/TaskService';
import { FocusService, FocusSessionState, computeActualMinutes } from '../services/FocusService';
import { useAuth } from './AuthContext';
import { apiClient } from '../api/felisClient';
import { SyncManager } from '../sync/SyncManager';
import { useSyncManager } from '../sync/useSyncManager';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-spawn',
    name: 'Spawn',
    iconType: 'terminal',
    description: 'Developer CLI',
    stack: ['Python', 'CLI', 'Backend'],
  },
  {
    id: 'proj-ucdp',
    name: 'UCDP',
    iconType: 'database',
    description: 'Data Pipeline',
    stack: ['Go', 'Postgres', 'Kafka'],
  },
  {
    id: 'proj-preflight',
    name: 'Preflight',
    iconType: 'cloud',
    description: 'Deployment checks',
    stack: ['TypeScript', 'Docker', 'AWS'],
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
    'Estimated 35 min',
  ],
};

export { FocusSessionState, computeActualMinutes };

interface AppContextType {
  projects: Project[];
  tasks: Task[];
  recommendation: Recommendation | null;
  isLoadingRecommendation: boolean;
  refreshRecommendation: () => Promise<void>;
  focusSession: FocusSessionState | null;
  isLoadingState: boolean;
  loadError: string | null;
  syncStatus: 'synced' | 'pending' | 'failed';
  triggerSync: () => Promise<void>;
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

  const [serverRecommendation, setServerRecommendation] = useState<Recommendation | null>(null);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);

  const localRecommendation = useMemo(() => computeNextAction(tasks), [tasks]);
  const recommendation = serverRecommendation ?? localRecommendation;

  const fetchRecommendation = useCallback(async () => {
    setIsLoadingRecommendation(true);
    try {
      const data = await apiClient.get<Recommendation>('/recommendations/next-action');
      if (data && data.taskId) {
        setServerRecommendation(data);
      } else {
        setServerRecommendation(null);
      }
    } catch {
      // Fall back to local recommendation silently
      setServerRecommendation(null);
    } finally {
      setIsLoadingRecommendation(false);
    }
  }, []);

  const localProjectRepo = useMemo(() => new LocalProjectRepository(), []);
  const localTaskRepo = useMemo(() => new LocalTaskRepository(), []);
  const projectService = useMemo(() => new ProjectService(localProjectRepo), [localProjectRepo]);
  const taskService = useMemo(() => new TaskService(localTaskRepo), [localTaskRepo]);
  const focusService = useMemo(() => new FocusService(), []);

  const syncManager = useMemo(
    () => new SyncManager(apiClient, localProjectRepo, localTaskRepo),
    [localProjectRepo, localTaskRepo]
  );
  const { syncStatus, triggerSync } = useSyncManager(syncManager);

  const performLoad = async () => {
    setIsLoadingState(true);
    setLoadError(null);
    try {
      let loadedProjects = await projectService.getAll();
      let loadedTasks = await taskService.getAll();

      // Seed fallback data if first launch or empty
      if (loadedProjects.length === 0 && loadedTasks.length === 0) {
        const stored = await loadState();
        if (stored?.projects?.length || stored?.tasks?.length) {
          loadedProjects = stored.projects || [];
          loadedTasks = stored.tasks || [];
        } else {
          loadedProjects = INITIAL_PROJECTS;
          loadedTasks = INITIAL_TASKS;
        }
        await localProjectRepo.save(loadedProjects);
        await localTaskRepo.save(loadedTasks);
      }

      setProjects(loadedProjects);
      setTasks(loadedTasks);
      fetchRecommendation();
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

  const [focusSession, setFocusSession] = useState<FocusSessionState | null>(null);

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
    taskService.toggle(taskId).then(() => {
      triggerSync();
      fetchRecommendation();
    }).catch((err) => {
      console.warn('[AppContext] Failed to toggle task in repo', err);
    });
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
    taskService.create(
      {
        title,
        projectId: project.id,
        priority,
        dueDate: due || 'Due Friday',
        estimateMinutes: estMin || 30,
      },
      projects
    ).then(() => {
      triggerSync();
      fetchRecommendation();
    }).catch((err) => {
      console.warn('[AppContext] Failed to persist task creation', err);
    });
  };

  const createProject = (name: string, description: string) => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name,
      iconType: 'terminal',
      description,
      stack: ['TypeScript', 'Node.js'],
    };
    setProjects((prev) => [...prev, newProj]);
    projectService.create({
      name,
      description,
      iconType: 'terminal',
      techStack: ['TypeScript', 'Node.js'],
    }).then(() => triggerSync()).catch((err) => {
      console.warn('[AppContext] Failed to persist project creation', err);
    });
  };

  const startFocus = (taskId?: string) => {
    const target = tasks.find((t) => t.id === taskId) || tasks[0];
    const estMin = target?.estimatedMinutes || target?.estimateMinutes || 28;
    setFocusSession({
      taskId: target.id,
      taskTitle: target.title,
      projectName: target.projectName || 'General',
      totalSeconds: estMin * 60,
      remainingSeconds: estMin * 60,
      isRunning: true,
      isFinished: false,
      subtasks: target.subtasks || [],
      estimatedMinutes: estMin,
      startedAt: Date.now(),
      pausedTotalSeconds: 0,
    });

    apiClient.post<{ id?: string }>('/focus-sessions', {
      taskId: target.id,
      plannedMinutes: estMin,
    }).then((res) => {
      if (res?.id) {
        setFocusSession((prev) => (prev ? { ...prev, id: res.id } : prev));
      }
    }).catch((err) => {
      console.log('[Focus] Backend focus session start recorded offline:', err);
    });
  };

  const pauseFocus = () => {
    setFocusSession((prev) =>
      prev ? { ...prev, isRunning: false, pauseStartedAt: Date.now() } : null
    );
  };

  const resumeFocus = () => {
    setFocusSession((prev) => {
      if (!prev) return null;
      const pauseDuration = prev.pauseStartedAt
        ? Math.floor((Date.now() - prev.pauseStartedAt) / 1000)
        : 0;
      return {
        ...prev,
        isRunning: true,
        pauseStartedAt: undefined,
        pausedTotalSeconds: prev.pausedTotalSeconds + pauseDuration,
      };
    });
  };

  const finishFocus = () => {
    triggerHaptic('success');
    setFocusSession((prev) => {
      if (!prev) return null;
      const actualMinutes = computeActualMinutes(prev);
      console.log(`[Focus] Finished session for ${prev.taskTitle}: ${actualMinutes} actual minutes`);

      const sessionId = prev.id || `session-${prev.startedAt}`;
      apiClient.patch(`/focus-sessions/${sessionId}`, {
        endedAt: new Date().toISOString(),
        actualMinutes,
        status: 'finished',
      }).catch((err) => {
        console.log('[Focus] Backend focus session end patch recorded offline:', err);
      });

      if (prev.taskId) {
        taskService.complete(prev.taskId).then(() => {
          triggerSync();
          fetchRecommendation();
        }).catch(() => {});

        if (recommendation?.taskId === prev.taskId) {
          apiClient.post(`/recommendations/${recommendation.id || recommendation.taskId}/outcome`, {
            eventType: 'completed',
          }).catch(() => {});
        }

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
            startedAt: Date.now(),
            pausedTotalSeconds: 0,
            pauseStartedAt: undefined,
          }
        : null
    );
  };

  const resetDemoData = () => {
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    localProjectRepo.save(INITIAL_PROJECTS).catch(() => {});
    localTaskRepo.save(INITIAL_TASKS).catch(() => {});
    clearState();
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        tasks,
        recommendation,
        isLoadingRecommendation,
        refreshRecommendation: fetchRecommendation,
        focusSession,
        isLoadingState,
        loadError,
        syncStatus,
        triggerSync,
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
