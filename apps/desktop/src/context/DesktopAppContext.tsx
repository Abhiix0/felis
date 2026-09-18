import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Project {
  id: string;
  name: string;
  goal?: string;
  description?: string;
  tech_stack: string[];
  icon_type: string;
  status: string;
  stats?: {
    totalTasks: number;
    activeTasks: number;
    completedTasks: number;
    progressPercent: number;
  };
}

export interface Task {
  id: string;
  project_id?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  due_time?: string;
  estimate_minutes?: number;
  completed_at?: string;
  subtasks?: { id: string; title: string; completed: boolean }[];
}

export interface Recommendation {
  id?: string;
  task_id: string;
  title: string;
  project_id?: string;
  project_name?: string;
  score: number;
  signals: { type: string; value: number; reason: string }[];
  estimated_minutes: number;
  priority: string;
  due_date?: string;
}

interface DesktopAppContextType {
  token: string | null;
  user: { id: string; email: string; displayName: string } | null;
  projects: Project[];
  tasks: Task[];
  recommendation: Recommendation | null;
  activeFocusTaskId: string | null;
  isCommandKOpen: boolean;
  setIsCommandKOpen: (open: boolean) => void;
  startFocus: (taskId: string) => void;
  completeFocus: () => void;
  createTask: (title: string, projectId?: string, priority?: 'low' | 'medium' | 'high', due?: string, estimate?: number) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  createProject: (name: string, description?: string, techStack?: string[]) => Promise<void>;
  refreshAll: () => Promise<void>;
  loginAsDev: () => Promise<void>;
}

const DesktopAppContext = createContext<DesktopAppContextType | null>(null);

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

export const DesktopAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('felis:desktop:token'));
  const [user, setUser] = useState<{ id: string; email: string; displayName: string } | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [activeFocusTaskId, setActiveFocusTaskId] = useState<string | null>(null);
  const [isCommandKOpen, setIsCommandKOpen] = useState(false);

  const fetchWithAuth = async (path: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (res.status === 401) {
      setToken(null);
      localStorage.removeItem('felis:desktop:token');
    }
    return res;
  };

  const loginAsDev = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'developer@felis.app', display_name: 'Developer' }),
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.access_token);
        localStorage.setItem('felis:desktop:token', data.access_token);
        setUser({ id: data.user_id, email: 'developer@felis.app', displayName: 'Developer' });
      }
    } catch (e) {
      console.warn('Dev login fallback to offline state:', e);
    }
  };

  const refreshAll = async () => {
    if (!token) return;
    try {
      const [projRes, taskRes, recRes] = await Promise.all([
        fetchWithAuth('/projects'),
        fetchWithAuth('/tasks'),
        fetchWithAuth('/recommendations/next-action'),
      ]);

      if (projRes.ok) setProjects(await projRes.json());
      if (taskRes.ok) setTasks(await taskRes.json());
      if (recRes.ok) {
        const recData = await recRes.json();
        setRecommendation(recData);
      }
    } catch (e) {
      console.warn('API error during refresh:', e);
    }
  };

  useEffect(() => {
    if (token) {
      setUser({ id: 'dev-user', email: 'developer@felis.app', displayName: 'Developer' });
      refreshAll();
    } else {
      loginAsDev();
    }
  }, [token]);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandKOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const createTask = async (
    title: string,
    projectId?: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    due?: string,
    estimate?: number
  ) => {
    const payload = {
      project_id: projectId || null,
      title,
      priority,
      due_date: due,
      estimate_minutes: estimate || 30,
    };
    const res = await fetchWithAuth('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      await refreshAll();
    }
  };

  const completeTask = async (taskId: string) => {
    const res = await fetchWithAuth(`/tasks/${taskId}/complete`, { method: 'POST' });
    if (res.ok) {
      await refreshAll();
    }
  };

  const createProject = async (name: string, description?: string, techStack?: string[]) => {
    const res = await fetchWithAuth('/projects', {
      method: 'POST',
      body: JSON.stringify({ name, description, tech_stack: techStack || [] }),
    });
    if (res.ok) {
      await refreshAll();
    }
  };

  const startFocus = (taskId: string) => {
    setActiveFocusTaskId(taskId);
  };

  const completeFocus = () => {
    setActiveFocusTaskId(null);
    refreshAll();
  };

  return (
    <DesktopAppContext.Provider
      value={{
        token,
        user,
        projects,
        tasks,
        recommendation,
        activeFocusTaskId,
        isCommandKOpen,
        setIsCommandKOpen,
        startFocus,
        completeFocus,
        createTask,
        completeTask,
        createProject,
        refreshAll,
        loginAsDev,
      }}
    >
      {children}
    </DesktopAppContext.Provider>
  );
};

export const useDesktopApp = () => {
  const context = useContext(DesktopAppContext);
  if (!context) throw new Error('useDesktopApp must be used within a DesktopAppProvider');
  return context;
};
