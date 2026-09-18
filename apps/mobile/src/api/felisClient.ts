import {
  FelisApiClient,
  ProjectsApi,
  TasksApi,
  RecommendationsApi,
  FocusApi,
  UsersApi,
} from '@felis/api-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'felis:auth:token';

declare global {
  var __felisAccessToken: string | null | undefined;
}

export const apiClient = new FelisApiClient({
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000',
  getAccessToken: () => {
    return globalThis.__felisAccessToken || null;
  },
  onAuthError: () => {
    globalThis.__felisAccessToken = null;
    AsyncStorage.removeItem(TOKEN_KEY);
  },
});

export const projectsApi = new ProjectsApi(apiClient);
export const tasksApi = new TasksApi(apiClient);
export const recommendationsApi = new RecommendationsApi(apiClient);
export const focusApi = new FocusApi(apiClient);
export const usersApi = new UsersApi(apiClient);

export async function loadStoredToken(): Promise<string | null> {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) globalThis.__felisAccessToken = token;
    return token;
  } catch {
    return null;
  }
}

export async function storeToken(token: string): Promise<void> {
  globalThis.__felisAccessToken = token;
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.warn('[felisClient] Failed to persist token:', err);
  }
}

export async function clearStoredToken(): Promise<void> {
  globalThis.__felisAccessToken = null;
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.warn('[felisClient] Failed to clear token:', err);
  }
}
