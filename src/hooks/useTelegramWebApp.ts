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
          
          // Save or update profile in database
          await saveOrUpdateProfile(user);
        } else if (DEV_MODE) {
          // Development mode: simulate Telegram user
          console.log('🔧 Dev mode: Simulating Telegram user');
          setIsTelegram(true);
          
          const mockUser: TelegramUser = {
            id: DEV_TELEGRAM_ID,
            first_name: 'Dev',
            last_name: 'User',
            username: 'dev_user',
            language_code: 'ru',
          };
          setTelegramUser(mockUser);
          
          // Try to load or create dev profile
          await saveOrUpdateProfile(mockUser);
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

  const saveOrUpdateProfile = async (user: TelegramUser) => {
    try {
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('telegram_profiles')
        .select('*')
        .eq('telegram_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching profile:', fetchError);
        return;
      }

      if (existingProfile) {
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
          .single();

        if (updateError) {
          console.error('Error updating profile:', updateError);
        } else {
          setProfile(updatedProfile);
        }
      } else {
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
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else {
          setProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('Error in saveOrUpdateProfile:', error);
    }
  };

  const updateProfile = async (updates: Partial<Omit<TelegramProfile, 'id' | 'telegram_id' | 'created_at' | 'updated_at'>>) => {
    if (!profile) return null;

    try {
      const { data, error } = await supabase
        .from('telegram_profiles')
        .update(updates)
        .eq('telegram_id', profile.telegram_id)
        .select()
        .single();

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
      .single();

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
