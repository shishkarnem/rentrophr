import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SYNC_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes throttle
const LAST_SYNC_KEY = 'crm-last-sync-time';

interface SyncResult {
  success: boolean;
  message?: string;
  synced?: number;
  deleted?: number;
}

export const useSyncCrm = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(() => {
    const saved = localStorage.getItem(LAST_SYNC_KEY);
    return saved ? new Date(saved) : null;
  });

  // Check if enough time has passed since last sync
  const canSync = useCallback(() => {
    if (!lastSyncTime) return true;
    const elapsed = Date.now() - lastSyncTime.getTime();
    return elapsed >= SYNC_THROTTLE_MS;
  }, [lastSyncTime]);

  // Get time until next allowed sync
  const getTimeUntilNextSync = useCallback(() => {
    if (!lastSyncTime) return 0;
    const elapsed = Date.now() - lastSyncTime.getTime();
    const remaining = SYNC_THROTTLE_MS - elapsed;
    return Math.max(0, remaining);
  }, [lastSyncTime]);

  // Perform sync
  const syncNow = useCallback(async (force: boolean = false): Promise<SyncResult> => {
    if (!force && !canSync()) {
      const remainingSeconds = Math.ceil(getTimeUntilNextSync() / 1000);
      return {
        success: false,
        message: `Подождите ${Math.ceil(remainingSeconds / 60)} мин до следующей синхронизации`,
      };
    }

    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-crm-sheets');
      
      if (error) {
        console.error('[useSyncCrm] Sync error:', error);
        return {
          success: false,
          message: error.message || 'Ошибка синхронизации',
        };
      }

      // Update last sync time
      const now = new Date();
      localStorage.setItem(LAST_SYNC_KEY, now.toISOString());
      setLastSyncTime(now);

      console.log('[useSyncCrm] Sync completed:', data);
      return {
        success: true,
        message: 'Синхронизация завершена',
        synced: data?.synced || 0,
        deleted: data?.deleted || 0,
      };
    } catch (err) {
      console.error('[useSyncCrm] Sync exception:', err);
      return {
        success: false,
        message: 'Ошибка при синхронизации',
      };
    } finally {
      setIsSyncing(false);
    }
  }, [canSync, getTimeUntilNextSync]);

  // Auto-sync on app load (with throttle)
  const syncOnAppLoad = useCallback(async () => {
    if (canSync()) {
      console.log('[useSyncCrm] Auto-syncing on app load...');
      await syncNow(false);
    } else {
      console.log('[useSyncCrm] Skipping auto-sync, throttled');
    }
  }, [canSync, syncNow]);

  // Format last sync time for display
  const formatLastSyncTime = useCallback(() => {
    if (!lastSyncTime) return null;
    
    const now = new Date();
    const diffMs = now.getTime() - lastSyncTime.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    
    if (diffMinutes < 1) return 'только что';
    if (diffMinutes < 60) return `${diffMinutes} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    
    return lastSyncTime.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [lastSyncTime]);

  return {
    isSyncing,
    lastSyncTime,
    canSync: canSync(),
    syncNow,
    syncOnAppLoad,
    formatLastSyncTime,
    getTimeUntilNextSync,
  };
};
