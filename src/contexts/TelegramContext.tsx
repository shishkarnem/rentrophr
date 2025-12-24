import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';
import { useLanguage, Language } from '@/contexts/LanguageContext';

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

interface TelegramContextType {
  isTelegram: boolean;
  telegramUser: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    photo_url?: string;
  } | null;
  profile: TelegramProfile | null;
  isLoading: boolean;
  updateProfile: (updates: Partial<Omit<TelegramProfile, 'id' | 'telegram_id' | 'created_at' | 'updated_at'>>) => Promise<TelegramProfile | null>;
  uploadPhoto: (file: File) => Promise<string | null>;
  refetchProfile: () => Promise<void>;
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export const TelegramProvider = ({ children }: { children: ReactNode }) => {
  const telegram = useTelegramWebApp();
  const { setLanguage } = useLanguage();

  // Auto-set language from Telegram when detected
  useEffect(() => {
    if (telegram.detectedLanguage) {
      console.log('[TelegramProvider] Auto-setting language:', telegram.detectedLanguage);
      setLanguage(telegram.detectedLanguage);
    }
  }, [telegram.detectedLanguage, setLanguage]);

  return (
    <TelegramContext.Provider value={telegram}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (context === undefined) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};
