import { Lock, Briefcase, GraduationCap, MessageCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const TelegramAccessRestriction = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Briefcase, label: t('access.projects') || 'Проектах' },
    { icon: GraduationCap, label: t('access.training') || 'Этапах обучения' },
    { icon: MessageCircle, label: t('access.interview') || 'Прохождение интервью' },
    { icon: Zap, label: t('access.fullAccess') || 'Полный доступ к функционалу' },
  ];

  return (
    <div className="glass-dark rounded-2xl p-6">
      <div className="flex flex-col items-center text-center mb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4"
        >
          <Lock className="w-8 h-8 text-accent" />
        </motion.div>
        <h2 className="text-white font-semibold text-lg mb-2">
          {t('access.title') || 'Доступ ограничен'}
        </h2>
        <p className="text-white/70 text-sm">
          {t('access.description') || 'Для доступа к Проектам и Профилю нужно зайти через приложение телеграм.'}
        </p>
      </div>

      <p className="text-white/80 text-sm mb-4">
        {t('access.openMiniApp') || 'Откройте мини-приложение для входа в свой профиль. Вам доступны будут информационные данные о:'}
      </p>

      <div className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
            className="flex items-center gap-3 bg-white/5 rounded-lg p-3"
          >
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <feature.icon className="w-4 h-4 text-accent" />
            </div>
            <span className="text-white text-sm">{feature.label}</span>
          </motion.div>
        ))}
      </div>

      <Button
        className="w-full bg-accent hover:bg-accent/80 text-primary font-semibold"
        asChild
      >
        <a
          href="https://t.me/RentROP_HR_bot/app"
          target="_blank"
          rel="noreferrer"
        >
          {t('access.openButton') || 'Открыть через бота'}
        </a>
      </Button>
    </div>
  );
};

export default TelegramAccessRestriction;
