import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Task, Recommendation, ScreenRoute, MainTab } from '../types';
import { INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_RECOMMENDATION } from '../services/mockData';

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
  recommendation: Recommendation;
  currentRoute: ScreenRoute;
  activeTab: MainTab;
  selectedProjectId: string;
  currentFocusTask: Task | null;
  focusSession: FocusSessionState | null;
  isRecommendationOpen: boolean;
  isShellDrawerOpen: boolean;
  activeStateVariant: 'loading' | 'error' | 'completed' | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  navigateTo: (route: ScreenRoute, params?: { projectId?: string; taskId?: string }) => void;
  setActiveTab: (tab: MainTab) => void;
  toggleTask: (taskId: string) => void;
  toggleSubtask: (subtaskId: string) => void;
  createTask: (title: string, projectName: string, priority: 'low' | 'medium' | 'high', due: string, estMin: number) => void;
  createProject: (name: string, description: string, stack: string[]) => void;
  openRecommendation: () => void;
  closeRecommendation: () => void;
  openShellDrawer: () => void;
  closeShellDrawer: () => void;
  startFocus: (taskId?: string) => void;
  pauseFocus: () => void;
  resumeFocus: () => void;
  finishFocus: () => void;
  resetFocus: () => void;
  setActiveStateVariant: (variant: 'loading' | 'error' | 'completed' | null) => void;
  resetToDefaultData: () => void;
  setEmptyProjects: () => void;
  setEmptyTasks: () => void;
  setAllTasksCompleted: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [recommendation] = useState<Recommendation>(INITIAL_RECOMMENDATION);
  const [currentRoute, setCurrentRoute] = useState<ScreenRoute>('home');
  const [activeTab, setActiveTabState] = useState<MainTab>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-spawn');
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(false);
  const [isShellDrawerOpen, setIsShellDrawerOpen] = useState(false);
  const [activeStateVariant, setActiveStateVariant] = useState<'loading' | 'error' | 'completed' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Focus timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (focusSession && focusSession.isRunning && !focusSession.isFinished) {
      interval = setInterval(() => {
        setFocusSession((prev) => {
          if (!prev || !prev.isRunning) return prev;
          if (prev.remainingSeconds <= 1) {
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

  const currentFocusTask = tasks.find((t) => t.id === (focusSession?.taskId || 'task-auth-tests')) || tasks[0];

  const navigateTo = (route: ScreenRoute, params?: { projectId?: string; taskId?: string }) => {
    if (params?.projectId) setSelectedProjectId(params.projectId);
    if (params?.taskId && route === 'focus_session') {
      startFocus(params.taskId);
    }
    setCurrentRoute(route);
    if (route === 'home') setActiveTabState('home');
    else if (route === 'projects' || route === 'project_detail') setActiveTabState('projects');
    else if (route === 'radar') setActiveTabState('radar');
    else if (route === 'profile') setActiveTabState('profile');

    // Close any overlays on route change
    setIsShellDrawerOpen(false);
    setIsRecommendationOpen(false);
  };

  const setActiveTab = (tab: MainTab) => {
    setActiveTabState(tab);
    if (tab === 'home') setCurrentRoute('home');
    else if (tab === 'projects') setCurrentRoute('projects');
    else if (tab === 'radar') setCurrentRoute('radar');
    else if (tab === 'profile') setCurrentRoute('profile');
    setIsShellDrawerOpen(false);
    setIsRecommendationOpen(false);
  };

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? 'Just now' : undefined,
          };
        }
        return t;
      })
    );
  };

  const toggleSubtask = (subtaskId: string) => {
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
    projectName: string,
    priority: 'low' | 'medium' | 'high',
    due: string,
    estMin: number
  ) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      projectId: 'proj-spawn',
      projectName: projectName || 'Spawn',
      completed: false,
      scheduledTime: '16:00',
      dueDate: due || 'Due Friday',
      estimatedMinutes: estMin || 30,
      priority,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const createProject = (name: string, description: string, stack: string[]) => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name,
      iconType: 'terminal',
      description,
      stack: stack.length ? stack : ['TypeScript', 'Node.js'],
      totalTasks: 0,
      activeTasks: 0,
      progressPercent: 0,
    };
    setProjects((prev) => [...prev, newProj]);
  };

  const openRecommendation = () => setIsRecommendationOpen(true);
  const closeRecommendation = () => setIsRecommendationOpen(false);
  const openShellDrawer = () => setIsShellDrawerOpen(true);
  const closeShellDrawer = () => setIsShellDrawerOpen(false);

  const startFocus = (taskId?: string) => {
    const target = tasks.find((t) => t.id === taskId) || tasks[0];
    setFocusSession({
      taskId: target.id,
      taskTitle: target.title,
      projectName: target.projectName,
      totalSeconds: (target.estimatedMinutes || 28) * 60,
      remainingSeconds: 27 * 60 + 42,
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
    setCurrentRoute('focus_session');
    setIsRecommendationOpen(false);
  };

  const pauseFocus = () => {
    setFocusSession((prev) => (prev ? { ...prev, isRunning: false } : null));
  };

  const resumeFocus = () => {
    setFocusSession((prev) => (prev ? { ...prev, isRunning: true } : null));
  };

  const finishFocus = () => {
    setFocusSession((prev) => (prev ? { ...prev, isRunning: false, isFinished: true } : null));
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

  const resetToDefaultData = () => {
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
  };

  const setEmptyProjects = () => {
    setProjects([]);
  };

  const setEmptyTasks = () => {
    setTasks([]);
  };

  const setAllTasksCompleted = () => {
    setTasks((prev) => prev.map((t) => ({ ...t, completed: true })));
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        tasks,
        recommendation,
        currentRoute,
        activeTab,
        selectedProjectId,
        currentFocusTask,
        focusSession,
        isRecommendationOpen,
        isShellDrawerOpen,
        activeStateVariant,
        searchQuery,
        setSearchQuery,
        navigateTo,
        setActiveTab,
        toggleTask,
        toggleSubtask,
        createTask,
        createProject,
        openRecommendation,
        closeRecommendation,
        openShellDrawer,
        closeShellDrawer,
        startFocus,
        pauseFocus,
        resumeFocus,
        finishFocus,
        resetFocus,
        setActiveStateVariant,
        resetToDefaultData,
        setEmptyProjects,
        setEmptyTasks,
        setAllTasksCompleted,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
