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

export const useProjectSwipes = () => {
  const [swipeHistory, setSwipeHistory] = useState<SwipeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useTelegram();

  const telegramId = profile?.telegram_id;

  // Load swipes from database
  useEffect(() => {
    const loadSwipes = async () => {
      if (!telegramId) {
        setIsLoading(false);
        return;
      }

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
  }, [telegramId]);

  const addSwipe = useCallback(async (projectId: string, projectCode: string, action: SwipeAction) => {
    if (!telegramId) {
      console.warn('No telegram ID, cannot save swipe');
      return;
    }

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
        const newRecord: SwipeRecord = {
          id: data.id,
          projectId: data.project_id,
          projectCode: data.project_code,
          action: data.action as SwipeAction,
          timestamp: data.created_at,
        };

        setSwipeHistory(prev => {
          const filtered = prev.filter(s => s.projectId !== projectId);
          return [newRecord, ...filtered];
        });
      }
    } catch (err) {
      console.error('Error saving swipe:', err);
    }
  }, [telegramId]);

  const removeSwipe = useCallback(async (projectId: string) => {
    if (!telegramId) return;

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
  }, [telegramId]);

  const clearHistory = useCallback(async () => {
    if (!telegramId) return;

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
  }, [telegramId]);

  const getSwipesByAction = useCallback((action: SwipeAction) => {
    return swipeHistory.filter(s => s.action === action);
  }, [swipeHistory]);

  const hasSwipedProject = useCallback((projectId: string) => {
    return swipeHistory.some(s => s.projectId === projectId);
  }, [swipeHistory]);

  return {
    swipeHistory,
    isLoading,
    addSwipe,
    removeSwipe,
    clearHistory,
    getSwipesByAction,
    hasSwipedProject,
  };
};
