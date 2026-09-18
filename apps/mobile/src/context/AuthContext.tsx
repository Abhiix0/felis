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
    let devUser: User = {
      id: `dev-user-${Date.now()}`,
      email,
      displayName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // Attempt backend auth token
      const res = await apiClient.post<{ access_token?: string; token?: string; user?: User }>(
        '/auth/token',
        { email, displayName }
      );
      if (res?.access_token || res?.token) {
        await storeToken(res.access_token || res.token || '');
      }
      if (res?.user) {
        devUser = res.user;
      }
    } catch (err) {
      console.log('[Auth] Backend auth unavailable, using offline dev user session:', err);
    }

    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(devUser));
      setUser(devUser);
    } catch (err) {
      console.warn('[Auth] Failed to save user session', err);
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
