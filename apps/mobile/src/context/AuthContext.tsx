import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '@felis/types';
import { apiClient, loadStoredToken, storeToken, clearStoredToken } from '../api/felisClient';

const USER_STORAGE_KEY = 'felis:user';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        await loadStoredToken();
        const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (err) {
        console.warn('[Auth] Failed to restore session', err);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  const signIn = async (email: string, displayName: string) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post<{ access_token?: string; token?: string; user_id?: string; user?: User }>(
        '/auth/token',
        { email, displayName }
      );
      const token = res?.access_token || res?.token;
      if (!token) {
        throw new Error('No access token returned from server');
      }
      await storeToken(token);

      const authenticatedUser: User = res?.user || {
        id: res?.user_id || 'user-id',
        email,
        displayName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
    } catch (err) {
      console.warn('[Auth] Sign in failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await clearStoredToken();
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (err) {
      console.warn('[Auth] Failed to clear user session', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
