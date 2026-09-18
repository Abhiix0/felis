import { useEffect, useRef, useState, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { SyncManager } from './SyncManager';

export function useSyncManager(syncManager: SyncManager) {
  const [syncStatus, setSyncStatus] = useState<'synced' | 'pending' | 'failed'>('synced');
  const syncManagerRef = useRef(syncManager);
  syncManagerRef.current = syncManager;

  const triggerSync = useCallback(async () => {
    try {
      await syncManagerRef.current.sync();
    } catch (err) {
      console.warn('[useSyncManager] Sync run caught error:', err);
    } finally {
      const status = await syncManagerRef.current.getSyncStatus();
      setSyncStatus(status);
    }
  }, []);

  useEffect(() => {
    syncManagerRef.current.getSyncStatus().then(setSyncStatus);

    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        triggerSync();
      }
    });

    let removeOnlineListener: (() => void) | undefined;
    if (typeof window !== 'undefined' && window.addEventListener) {
      const handleOnline = () => {
        triggerSync();
      };
      window.addEventListener('online', handleOnline);
      removeOnlineListener = () => window.removeEventListener('online', handleOnline);
    }

    const interval = setInterval(() => {
      triggerSync();
    }, 15000);

    return () => {
      subscription.remove();
      if (removeOnlineListener) removeOnlineListener();
      clearInterval(interval);
    };
  }, [triggerSync]);

  return {
    syncStatus,
    triggerSync,
  };
}

