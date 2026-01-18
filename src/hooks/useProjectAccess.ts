import { useMemo } from 'react';
import { useTelegram } from '@/contexts/TelegramContext';
import { useCrmData } from '@/hooks/useCrmData';

export interface ProgressStage {
  key: string;
  label: string;
  labelKey: string;
  completed: boolean;
  path?: string;
}

export const useProjectAccess = () => {
  const { telegramUser } = useTelegram();
  const telegramId = telegramUser?.id ?? null;
  const { crmData, isLoading } = useCrmData(telegramId);

  const hasProjectAccess = useMemo(() => {
    if (!crmData?.available_skills) return false;
    const skills = crmData.available_skills.toLowerCase();
    return skills.includes('создание договора') || skills.includes('подбор проекта');
  }, [crmData?.available_skills]);

  const progressStages: ProgressStage[] = useMemo(() => {
    if (!crmData) return [];

    const isCompleted = (value: string | null) => {
      if (!value) return false;
      const v = value.toLowerCase().trim();
      return v === 'пройдено' || v === 'да' || v === '+' || v === 'выполнено' || v === 'completed' || v === 'done';
    };

    return [
      {
        key: 'interview',
        label: 'Интервью',
        labelKey: 'progress.interview',
        completed: isCompleted(crmData.interview),
        path: '/interview',
      },
      {
        key: 'test_conditions',
        label: 'Тест Условия',
        labelKey: 'progress.testConditions',
        completed: isCompleted(crmData.test_conditions),
        path: '/tests/conditions',
      },
      {
        key: 'test_portal',
        label: 'Тест Портал',
        labelKey: 'progress.testPortal',
        completed: isCompleted(crmData.test_portal),
        path: '/tests/portal',
      },
      {
        key: 'test_report',
        label: 'Тест Отчет',
        labelKey: 'progress.testReport',
        completed: isCompleted(crmData.test_report),
        path: '/tests/report',
      },
      {
        key: 'test_robot',
        label: 'Тест Робот',
        labelKey: 'progress.testRobot',
        completed: isCompleted(crmData.test_robot),
        path: '/tests/robot',
      },
      {
        key: 'contract_signing',
        label: 'Подписание договора',
        labelKey: 'progress.contractSigning',
        completed: isCompleted(crmData.contract_signing),
        path: '/contract',
      },
      {
        key: 'video_card',
        label: 'Видео-визитка',
        labelKey: 'progress.videoCard',
        completed: isCompleted(crmData.video_card),
        path: '/video-card',
      },
    ];
  }, [crmData]);

  const completedCount = progressStages.filter(s => s.completed).length;
  const totalCount = progressStages.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    hasProjectAccess,
    isLoading,
    progressStages,
    completedCount,
    totalCount,
    progressPercent,
    crmData,
  };
};
