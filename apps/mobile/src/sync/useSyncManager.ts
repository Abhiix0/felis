import { useEffect, useRef, useState, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { SyncManager } from './SyncManager';

export function useSyncManager(syncManager: SyncManager, userId?: string) {
  const [syncStatus, setSyncStatus] = useState<'synced' | 'pending' | 'failed'>('synced');
  const syncManagerRef = useRef(syncManager);
  syncManagerRef.current = syncManager;
  const userIdRef = useRef(userId);
  userIdRef.current = userId;

  const triggerSync = useCallback(async () => {
    const currentUserId = userIdRef.current;
    if (!currentUserId || currentUserId === 'local') {
      setSyncStatus('synced');
      return;
    }
    try {
      await syncManagerRef.current.sync(currentUserId);
    } catch (err) {
      console.warn('[useSyncManager] Sync run caught error:', err);
    } finally {
      const status = await syncManagerRef.current.getSyncStatus(currentUserId);
      setSyncStatus(status);
    }
  }, []);

  useEffect(() => {
    if (userId && userId !== 'local') {
      syncManagerRef.current.getSyncStatus(userId).then(setSyncStatus);
    } else {
      setSyncStatus('synced');
    }

    const appStateSub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        triggerSync();
      }
    });

    const unsubscribeNetInfo = NetInfo?.addEventListener
      ? NetInfo.addEventListener((state: any) => {
          if (state?.isConnected && state?.isInternetReachable !== false) {
            triggerSync();
          }
        })
      : () => {};

    const interval = setInterval(() => {
      triggerSync();
    }, 30000);

    return () => {
      appStateSub.remove();
      if (typeof unsubscribeNetInfo === 'function') {
        unsubscribeNetInfo();
      }
      clearInterval(interval);
    };
  }, [triggerSync, userId]);

  return {
    syncStatus,
    triggerSync,
  };
}


