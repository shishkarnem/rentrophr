import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Star, Check, X, SkipForward } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SwipeHintsProps {
  show: boolean;
  onClose: () => void;
}

const SwipeHints = ({ show, onClose }: SwipeHintsProps) => {
  const { t } = useLanguage();

  if (!show) return null;

  const hints = [
    { 
      direction: 'up', 
      icon: ChevronUp, 
      actionIcon: Star,
      label: t('projects.hint.up') || 'Вверх — в закладки',
      color: 'text-accent',
      position: 'top-4 left-1/2 -translate-x-1/2'
    },
    { 
      direction: 'right', 
      icon: ChevronRight, 
      actionIcon: Check,
      label: t('projects.hint.right') || 'Вправо — откликнуться',
      color: 'text-green-400',
      position: 'top-1/2 right-4 -translate-y-1/2'
    },
    { 
      direction: 'left', 
      icon: ChevronLeft, 
      actionIcon: X,
      label: t('projects.hint.left') || 'Влево — не подходит',
      color: 'text-red-400',
      position: 'top-1/2 left-4 -translate-y-1/2'
    },
    { 
      direction: 'down', 
      icon: ChevronDown, 
      actionIcon: SkipForward,
      label: t('projects.hint.down') || 'Вниз — пропустить',
      color: 'text-white/60',
      position: 'bottom-4 left-1/2 -translate-x-1/2'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative w-full h-full max-w-md mx-auto">
        {hints.map((hint, index) => (
          <motion.div
            key={hint.direction}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`absolute ${hint.position} flex flex-col items-center gap-1`}
          >
            <motion.div
              animate={{ 
                [hint.direction === 'up' || hint.direction === 'down' ? 'y' : 'x']: 
                  hint.direction === 'up' || hint.direction === 'left' ? [-5, 5, -5] : [5, -5, 5]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`flex items-center gap-2 ${hint.color}`}
            >
              <hint.icon className="w-8 h-8" />
              <hint.actionIcon className="w-5 h-5" />
            </motion.div>
            <span className={`text-xs ${hint.color} text-center whitespace-nowrap`}>
              {hint.label}
            </span>
          </motion.div>
        ))}

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center px-6"
          >
            <p className="text-white text-lg font-semibold mb-2">
              {t('projects.hint.title') || 'Свайпайте карточки'}
            </p>
            <p className="text-white/60 text-sm">
              {t('projects.hint.subtitle') || 'Нажмите чтобы закрыть подсказки'}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeHints;
