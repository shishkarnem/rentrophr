import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SyncResult {
  success: boolean;
  message?: string;
  rowsProcessed?: number;
  error?: string;
}

const SYNC_THROTTLE_MS = 60 * 60 * 1000; // 60 minutes
const STORAGE_KEY = 'faq_last_sync_time';

export const useSyncFaq = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : null;
  });

  const canSync = useCallback(() => {
    if (!lastSyncTime) return true;
    const timeSinceLastSync = Date.now() - lastSyncTime;
    return timeSinceLastSync >= SYNC_THROTTLE_MS;
  }, [lastSyncTime]);

  const getTimeUntilNextSync = useCallback(() => {
    if (!lastSyncTime) return 0;
    const timeSinceLastSync = Date.now() - lastSyncTime;
    const remaining = SYNC_THROTTLE_MS - timeSinceLastSync;
    return Math.max(0, remaining);
  }, [lastSyncTime]);

  const syncNow = useCallback(async (force: boolean = false): Promise<SyncResult> => {
    if (!force && !canSync()) {
      const minutesRemaining = Math.ceil(getTimeUntilNextSync() / 60000);
      return {
        success: false,
        message: `Синхронизация FAQ возможна через ${minutesRemaining} мин.`
      };
    }

    if (isSyncing) {
      return {
        success: false,
        message: 'Синхронизация FAQ уже выполняется'
      };
    }

    setIsSyncing(true);

    try {
      console.log('Starting FAQ sync...');
      
      const { data, error } = await supabase.functions.invoke('sync-google-sheets');

      if (error) {
        console.error('FAQ sync error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      const result = data as SyncResult;
      
      if (result.success) {
        const now = Date.now();
        setLastSyncTime(now);
        localStorage.setItem(STORAGE_KEY, now.toString());
        console.log('FAQ sync completed:', result);
      }

      return result;
    } catch (error) {
      console.error('FAQ sync failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setIsSyncing(false);
    }
  }, [canSync, getTimeUntilNextSync, isSyncing]);

  const syncOnAppLoad = useCallback(async () => {
    if (canSync()) {
      console.log('FAQ auto-sync on app load...');
      return await syncNow();
    }
    return { success: true, message: 'Sync throttled' };
  }, [canSync, syncNow]);

  const formatLastSyncTime = useCallback(() => {
    if (!lastSyncTime) return 'Никогда';
    
    const now = Date.now();
    const diff = now - lastSyncTime;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes} мин. назад`;
    if (hours < 24) return `${hours} ч. назад`;
    
    return new Date(lastSyncTime).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [lastSyncTime]);

  return {
    isSyncing,
    lastSyncTime,
    canSync,
    syncNow,
    syncOnAppLoad,
    formatLastSyncTime,
    getTimeUntilNextSync
  };
};
