import { useState, useEffect, useCallback } from 'react';

export type SwipeAction = 'like' | 'respond' | 'skip' | 'pass';

export interface SwipeRecord {
  projectId: string;
  projectCode: string;
  description: string;
  action: SwipeAction;
  timestamp: number;
}

const STORAGE_KEY = 'project_swipes_history';

export const useProjectSwipes = () => {
  const [swipeHistory, setSwipeHistory] = useState<SwipeRecord[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSwipeHistory(JSON.parse(stored));
      } catch {
        setSwipeHistory([]);
      }
    }
  }, []);

  // Save to localStorage when history changes
  const saveHistory = useCallback((history: SwipeRecord[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    setSwipeHistory(history);
  }, []);

  const addSwipe = useCallback((record: Omit<SwipeRecord, 'timestamp'>) => {
    setSwipeHistory(prev => {
      // Remove existing swipe for same project if exists
      const filtered = prev.filter(s => s.projectId !== record.projectId);
      const newHistory = [...filtered, { ...record, timestamp: Date.now() }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const removeSwipe = useCallback((projectId: string) => {
    setSwipeHistory(prev => {
      const newHistory = prev.filter(s => s.projectId !== projectId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSwipeHistory([]);
  }, []);

  const getSwipesByAction = useCallback((action: SwipeAction) => {
    return swipeHistory.filter(s => s.action === action);
  }, [swipeHistory]);

  const hasSwipedProject = useCallback((projectId: string) => {
    return swipeHistory.some(s => s.projectId === projectId);
  }, [swipeHistory]);

  return {
    swipeHistory,
    addSwipe,
    removeSwipe,
    clearHistory,
    getSwipesByAction,
    hasSwipedProject,
  };
};
