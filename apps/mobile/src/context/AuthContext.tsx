import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '@felis/types';

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
    async function loadStoredUser() {
      try {
        const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (err) {
        console.warn('[Auth] Failed to load stored user', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStoredUser();
  }, []);

  const signIn = async (email: string, displayName: string) => {
    const devUser: User = {
      id: `dev-user-${Date.now()}`,
      email,
      displayName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(devUser));
      setUser(devUser);
    } catch (err) {
      console.warn('[Auth] Failed to save user session', err);
    }
  };

  const signOut = async () => {
    try {
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
