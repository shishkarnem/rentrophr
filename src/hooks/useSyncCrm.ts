import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SYNC_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes
const LAST_SYNC_KEY = 'crm-last-sync-time';
const CHUNK_SIZE = 1500;

interface SyncResult {
  success: boolean;
  message?: string;
  synced?: number;
  total?: number;
}

export const useSyncCrm = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(() => {
    const saved = localStorage.getItem(LAST_SYNC_KEY);
    return saved ? new Date(saved) : null;
  });

  const canSync = useCallback(() => {
    if (!lastSyncTime) return true;
    return Date.now() - lastSyncTime.getTime() >= SYNC_THROTTLE_MS;
  }, [lastSyncTime]);

  const getTimeUntilNextSync = useCallback(() => {
    if (!lastSyncTime) return 0;
    return Math.max(0, SYNC_THROTTLE_MS - (Date.now() - lastSyncTime.getTime()));
  }, [lastSyncTime]);

  // Chunked sync - calls function multiple times with offset/limit
  const syncNow = useCallback(async (force: boolean = false): Promise<SyncResult> => {
    if (!force && !canSync()) {
      const remainingMinutes = Math.ceil(getTimeUntilNextSync() / 60000);
      return { success: false, message: `Подождите ${remainingMinutes} мин` };
    }

    setIsSyncing(true);
    setProgress(0);
    
    let totalSynced = 0;
    let offset = 0;
    let totalRows = 0;
    
    try {
      // Process in chunks until done
      while (true) {
        console.log(`[useSyncCrm] Syncing chunk: offset=${offset}`);
        
        const { data, error } = await supabase.functions.invoke('sync-crm-sheets', {
          body: { offset, limit: CHUNK_SIZE }
        });
        
        if (error) {
          console.error('[useSyncCrm] Chunk error:', error);
          // If we already synced some, don't fail completely
          if (totalSynced > 0) break;
          return { success: false, message: error.message };
        }
        
        totalSynced += data?.chunk?.processed || 0;
        totalRows = data?.total || totalRows;
        
        // Update progress
        if (totalRows > 0) {
          setProgress(Math.min(100, Math.round((offset + CHUNK_SIZE) / totalRows * 100)));
        }
        
        // Check if more chunks needed
        if (!data?.hasMore) {
          console.log('[useSyncCrm] All chunks complete');
          break;
        }
        
        offset = data.nextOffset;
        
        // Small delay between chunks to avoid rate limiting
        await new Promise(r => setTimeout(r, 500));
      }

      // Update last sync time
      const now = new Date();
      localStorage.setItem(LAST_SYNC_KEY, now.toISOString());
      setLastSyncTime(now);
      setProgress(100);

      return {
        success: true,
        message: 'Синхронизация завершена',
        synced: totalSynced,
        total: totalRows
      };
    } catch (err) {
      console.error('[useSyncCrm] Exception:', err);
      return { success: false, message: 'Ошибка синхронизации' };
    } finally {
      setIsSyncing(false);
    }
  }, [canSync, getTimeUntilNextSync]);

  const syncOnAppLoad = useCallback(async () => {
    if (canSync()) {
      console.log('[useSyncCrm] Auto-syncing on app load...');
      await syncNow(false);
    }
  }, [canSync, syncNow]);

  const formatLastSyncTime = useCallback(() => {
    if (!lastSyncTime) return null;
    const diffMs = Date.now() - lastSyncTime.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    
    if (diffMinutes < 1) return 'только что';
    if (diffMinutes < 60) return `${diffMinutes} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    
    return lastSyncTime.toLocaleDateString('ru-RU', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  }, [lastSyncTime]);

  return {
    isSyncing,
    progress,
    lastSyncTime,
    canSync: canSync(),
    syncNow,
    syncOnAppLoad,
    formatLastSyncTime,
    getTimeUntilNextSync,
  };
};
