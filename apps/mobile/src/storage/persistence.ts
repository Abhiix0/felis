import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Project, Task } from '../types';

export const STORAGE_KEY = 'felis:v1:state';
export const CURRENT_SCHEMA_VERSION = 1;

export interface PersistedState {
  version: number;
  projects: Project[];
  tasks: Task[];
  updatedAt: string;
}

/**
 * Loads persisted tasks and projects from local device storage.
 * Returns null on first launch or if stored data is corrupted.
 */
export async function loadState(): Promise<{ projects: Project[]; tasks: Task[] } | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  const parsed = JSON.parse(raw) as Partial<PersistedState>;

  // Basic schema integrity check
  if (
    parsed &&
    typeof parsed === 'object' &&
    Array.isArray(parsed.projects) &&
    Array.isArray(parsed.tasks)
  ) {
    return {
      projects: parsed.projects,
      tasks: parsed.tasks,
    };
  }

  console.warn('[Storage] Corrupted state structure encountered. Falling back to default data.');
  return null;
}


/**
 * Saves tasks and projects into local device storage under a versioned key.
 * Safely catches write errors without crashing the app.
 */
export async function saveState(state: {
  projects: Project[];
  tasks: Task[];
}): Promise<boolean> {
  try {
    const payload: PersistedState = {
      version: CURRENT_SCHEMA_VERSION,
      projects: state.projects,
      tasks: state.tasks,
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.error('[Storage] Failed to save state to AsyncStorage:', error);
    return false;
  }
}

/**
 * Clears the persisted state from storage.
 */
export async function clearState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('[Storage] Failed to clear AsyncStorage:', error);
  }
}
