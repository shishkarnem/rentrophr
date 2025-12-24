import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

// Development mode - set to true to test profile without Telegram
const DEV_MODE = import.meta.env.DEV;
const DEV_TELEGRAM_ID = 123456789; // Mock Telegram ID for development

export const useTelegramWebApp = () => {
  const [isTelegram, setIsTelegram] = useState(false);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [profile, setProfile] = useState<TelegramProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveOrUpdateProfile = async (user: TelegramUser): Promise<TelegramProfile | null> => {
    try {
      console.log('[Telegram] Saving/updating profile for user:', user.id);
      
      // Check if profile exists using maybeSingle
      const { data: existingProfile, error: fetchError } = await supabase
        .from('telegram_profiles')
        .select('*')
        .eq('telegram_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('[Telegram] Error fetching profile:', fetchError);
        return null;
      }

      if (existingProfile) {
        console.log('[Telegram] Profile exists, updating...');
        // Update existing profile with new data from Telegram
        const { data: updatedProfile, error: updateError } = await supabase
          .from('telegram_profiles')
          .update({
            username: user.username || existingProfile.username,
            first_name: user.first_name || existingProfile.first_name,
            last_name: user.last_name || existingProfile.last_name,
            language_code: user.language_code || existingProfile.language_code,
            photo_url: user.photo_url || existingProfile.photo_url,
          })
          .eq('telegram_id', user.id)
          .select()
          .maybeSingle();

        if (updateError) {
          console.error('[Telegram] Error updating profile:', updateError);
          return null;
        }
        
        console.log('[Telegram] Profile updated:', updatedProfile);
        return updatedProfile;
      } else {
        console.log('[Telegram] Creating new profile...');
        // Create new profile
        const { data: newProfile, error: insertError } = await supabase
          .from('telegram_profiles')
          .insert({
            telegram_id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            language_code: user.language_code || 'ru',
            photo_url: user.photo_url,
          })
          .select()
          .maybeSingle();

        if (insertError) {
          console.error('[Telegram] Error creating profile:', insertError);
          return null;
        }
        
        console.log('[Telegram] Profile created:', newProfile);
        return newProfile;
      }
    } catch (error) {
      console.error('[Telegram] Error in saveOrUpdateProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    let canceled = false;
    let intervalId: number | undefined;

    const initTelegram = async (user: TelegramUser) => {
      if (canceled) return;
      
      console.log('[Telegram] Initializing with user:', user);
      setIsTelegram(true);
      setTelegramUser(user);
      
      // Wait for profile to be saved/updated before finishing loading
      const savedProfile = await saveOrUpdateProfile(user);
      
      if (canceled) return;
      
      if (savedProfile) {
        console.log('[Telegram] Setting profile:', savedProfile);
        setProfile(savedProfile);
      }
      
      setIsLoading(false);
      if (intervalId) window.clearInterval(intervalId);
    };

    const tryInit = () => {
      try {
        const tg = window.Telegram?.WebApp;

        // Telegram WebApp detected
        if (tg) {
          const user = tg.initDataUnsafe?.user;
          console.log('[Telegram] WebApp detected, user:', user);

          if (user) {
            tg.ready();
            tg.expand();
            void initTelegram(user);
            return true; // Found user, stop polling
          }

          // Telegram есть, но user пока нет — продолжаем попытки
          return false;
        }

        // Dev-mode fallback (only in dev builds)
        if (DEV_MODE) {
          console.log('[Telegram] DEV_MODE: using mock user');
          const mockUser: TelegramUser = {
            id: DEV_TELEGRAM_ID,
            first_name: 'Dev',
            last_name: 'User',
            username: 'dev_user',
            language_code: 'ru',
          };

          void initTelegram(mockUser);
          return true;
        }

        return false;
      } catch (error) {
        console.error('[Telegram] Error initializing WebApp:', error);
        return false;
      }
    };

    // Do an immediate attempt
    if (tryInit()) {
      return;
    }

    // Retry for a short time to avoid missing late Telegram injection
    let attempts = 0;
    const maxAttempts = 25; // ~5s @ 200ms

    intervalId = window.setInterval(() => {
      attempts += 1;
      
      if (tryInit()) {
        return;
      }
      
      if (attempts >= maxAttempts) {
        console.log('[Telegram] Max attempts reached, not a Telegram WebApp');
        if (!canceled) {
          setIsTelegram(false);
          setIsLoading(false);
        }
        window.clearInterval(intervalId);
      }
    }, 200);

    return () => {
      canceled = true;
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);


  const updateProfile = async (updates: Partial<Omit<TelegramProfile, 'id' | 'telegram_id' | 'created_at' | 'updated_at'>>) => {
    if (!profile) return null;

    try {
      const { data, error } = await supabase
        .from('telegram_profiles')
        .update(updates)
        .eq('telegram_id', profile.telegram_id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating profile:', error);
        return null;
      }

      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return null;
    }
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    if (!profile) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.telegram_id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Error uploading photo:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      // Update profile with new photo URL
      await updateProfile({ photo_url: publicUrl });

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadPhoto:', error);
      return null;
    }
  };

  const refetchProfile = async () => {
    if (!telegramUser) return;

    const { data, error } = await supabase
      .from('telegram_profiles')
      .select('*')
      .eq('telegram_id', telegramUser.id)
      .maybeSingle();

    if (!error && data) {
      setProfile(data);
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
