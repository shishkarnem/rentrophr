import { useState, useEffect } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    query_id?: string;
    auth_date?: number;
    hash?: string;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

interface TelegramProfile {
  id: string;
  telegram_id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  language_code: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

// Get the initData from Telegram WebApp
function getInitData(): string | null {
  const tg = window.Telegram?.WebApp;
  return tg?.initData || null;
}

// Get functions URL
function getFunctionsUrl(): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  return `${supabaseUrl}/functions/v1`;
}

// Call edge function with Telegram initData
async function callProfileFunction(action: string, updates?: Record<string, unknown>): Promise<TelegramProfile | null> {
  const initData = getInitData();
  if (!initData) {
    console.error('No Telegram init data available');
    return null;
  }

  try {
    const response = await fetch(`${getFunctionsUrl()}/telegram-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ action, updates }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Profile function error:', error);
      return null;
    }

    const data = await response.json();
    return data.profile;
  } catch (error) {
    console.error('Error calling profile function:', error);
    return null;
  }
}

export const useTelegramWebApp = () => {
  const [isTelegram, setIsTelegram] = useState(false);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [profile, setProfile] = useState<TelegramProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initTelegram = async () => {
      try {
        // Check if Telegram WebApp is available
        const tg = window.Telegram?.WebApp;
        
        if (tg && tg.initDataUnsafe?.user) {
          setIsTelegram(true);
          const user = tg.initDataUnsafe.user;
          setTelegramUser(user);
          
          // Tell Telegram that the app is ready
          tg.ready();
          tg.expand();
          
          // Save or update profile via edge function
          const profileData = await callProfileFunction('upsert');
          if (profileData) {
            setProfile(profileData);
          }
        } else {
          setIsTelegram(false);
        }
      } catch (error) {
        console.error('Error initializing Telegram WebApp:', error);
        setIsTelegram(false);
      } finally {
        setIsLoading(false);
      }
    };

    initTelegram();
  }, []);

  const updateProfile = async (updates: Partial<Omit<TelegramProfile, 'id' | 'telegram_id' | 'created_at' | 'updated_at'>>) => {
    if (!profile) return null;

    try {
      const updatedProfile = await callProfileFunction('update', updates);
      if (updatedProfile) {
        setProfile(updatedProfile);
        return updatedProfile;
      }
      return null;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return null;
    }
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    if (!profile) return null;

    const initData = getInitData();
    if (!initData) {
      console.error('No Telegram init data available');
      return null;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${getFunctionsUrl()}/telegram-storage`, {
        method: 'POST',
        headers: {
          'x-telegram-init-data': initData,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Upload error:', error);
        return null;
      }

      const data = await response.json();
      
      // Update local profile with new photo URL
      if (data.url) {
        setProfile(prev => prev ? { ...prev, photo_url: data.url } : null);
      }

      return data.url;
    } catch (error) {
      console.error('Error in uploadPhoto:', error);
      return null;
    }
  };

  const refetchProfile = async () => {
    if (!telegramUser) return;

    try {
      const profileData = await callProfileFunction('get');
      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error refetching profile:', error);
    }
  };

  return {
    isTelegram,
    telegramUser,
    profile,
    isLoading,
    updateProfile,
    uploadPhoto,
    refetchProfile,
    webApp: window.Telegram?.WebApp,
  };
};