import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTelegram } from '@/contexts/TelegramContext';

export type SwipeAction = 'like' | 'respond' | 'skip' | 'pass';

export interface SwipeRecord {
  id: string;
  projectId: string;
  projectCode: string;
  action: SwipeAction;
  timestamp: string;
}

interface DbSwipeRecord {
  id: string;
  project_id: string;
  project_code: string;
  action: string;
  created_at: string;
  telegram_id: number;
}

const LOCAL_STORAGE_KEY = 'project_swipes_history';

export const useProjectSwipes = () => {
  const [swipeHistory, setSwipeHistory] = useState<SwipeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const { profile } = useTelegram();

  const telegramId = profile?.telegram_id;
  const useLocalStorage = !telegramId;

  // Load swipes from database or localStorage
  useEffect(() => {
    const loadSwipes = async () => {
      // If no telegram ID, use localStorage
      if (useLocalStorage) {
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            setSwipeHistory(parsed);
          }
        } catch (err) {
          console.error('Error loading swipes from localStorage:', err);
        }
        setIsLoading(false);
        return;
      }

      // Load from database for telegram users
      try {
        const { data, error } = await supabase
          .from('project_swipes')
          .select('*')
          .eq('telegram_id', telegramId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading swipes:', error);
          return;
        }

        const records: SwipeRecord[] = (data || []).map((item: DbSwipeRecord) => ({
          id: item.id,
          projectId: item.project_id,
          projectCode: item.project_code,
          action: item.action as SwipeAction,
          timestamp: item.created_at,
        }));

        setSwipeHistory(records);
      } catch (err) {
        console.error('Error loading swipes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSwipes();
  }, [telegramId, useLocalStorage]);

  // Helper to save to localStorage
  const saveToLocalStorage = useCallback((records: SwipeRecord[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  }, []);

  // Send notification to Telegram group for "respond" action
  const sendNotification = useCallback(async (projectId: string, projectCode: string) => {
    if (!telegramId) return;
    
    setIsSendingNotification(true);
    try {
      const response = await supabase.functions.invoke('notify-project-response', {
        body: { projectId, projectCode, telegramId },
      });
      
      if (response.error) {
        console.error('Error sending notification:', response.error);
      } else {
        console.log('Notification sent successfully');
      }
    } catch (err) {
      console.error('Error sending notification:', err);
    } finally {
      setIsSendingNotification(false);
    }
  }, [telegramId]);

  const addSwipe = useCallback(async (projectId: string, projectCode: string, action: SwipeAction) => {
    const newRecord: SwipeRecord = {
      id: `local_${Date.now()}`,
      projectId,
      projectCode,
      action,
      timestamp: new Date().toISOString(),
    };

    // If no telegram ID, use localStorage
    if (useLocalStorage) {
      setSwipeHistory(prev => {
        const filtered = prev.filter(s => s.projectId !== projectId);
        const updated = [newRecord, ...filtered];
        saveToLocalStorage(updated);
        return updated;
      });
      return;
    }

    // Save to database for telegram users
    try {
      const { data, error } = await supabase
        .from('project_swipes')
        .upsert(
          {
            telegram_id: telegramId,
            project_id: projectId,
            project_code: projectCode,
            action,
          },
          {
            onConflict: 'telegram_id,project_id',
          }
        )
        .select()
        .single();

      if (error) {
        console.error('Error saving swipe:', error);
        return;
      }

      if (data) {
        const dbRecord: SwipeRecord = {
          id: data.id,
          projectId: data.project_id,
          projectCode: data.project_code,
          action: data.action as SwipeAction,
          timestamp: data.created_at,
        };

        setSwipeHistory(prev => {
          const filtered = prev.filter(s => s.projectId !== projectId);
          return [dbRecord, ...filtered];
        });

        // Send notification for "respond" action
        if (action === 'respond') {
          sendNotification(projectId, projectCode);
        }
      }
    } catch (err) {
      console.error('Error saving swipe:', err);
    }
  }, [telegramId, useLocalStorage, saveToLocalStorage, sendNotification]);

  const removeSwipe = useCallback(async (projectId: string) => {
    // If no telegram ID, use localStorage
    if (useLocalStorage) {
      setSwipeHistory(prev => {
        const updated = prev.filter(s => s.projectId !== projectId);
        saveToLocalStorage(updated);
        return updated;
      });
      return;
    }

    // Remove from database for telegram users
    try {
      const { error } = await supabase
        .from('project_swipes')
        .delete()
        .eq('telegram_id', telegramId)
        .eq('project_id', projectId);

      if (error) {
        console.error('Error removing swipe:', error);
        return;
      }

      setSwipeHistory(prev => prev.filter(s => s.projectId !== projectId));
    } catch (err) {
      console.error('Error removing swipe:', err);
    }
  }, [telegramId, useLocalStorage, saveToLocalStorage]);

  const clearHistory = useCallback(async () => {
    // If no telegram ID, use localStorage
    if (useLocalStorage) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setSwipeHistory([]);
      return;
    }

    // Clear from database for telegram users
    try {
      const { error } = await supabase
        .from('project_swipes')
        .delete()
        .eq('telegram_id', telegramId);

      if (error) {
        console.error('Error clearing history:', error);
        return;
      }

      setSwipeHistory([]);
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  }, [telegramId, useLocalStorage]);

  const getSwipesByAction = useCallback((action: SwipeAction) => {
    return swipeHistory.filter(s => s.action === action);
  }, [swipeHistory]);

  const hasSwipedProject = useCallback((projectId: string) => {
    return swipeHistory.some(s => s.projectId === projectId);
  }, [swipeHistory]);

  return {
    swipeHistory,
    isLoading,
    isSendingNotification,
    addSwipe,
    removeSwipe,
    clearHistory,
    getSwipesByAction,
    hasSwipedProject,
  };
};
