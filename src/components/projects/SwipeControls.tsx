import { motion } from 'framer-motion';
import { Star, Check, X, SkipForward } from 'lucide-react';
import { SwipeAction } from '@/hooks/useProjectSwipes';

interface SwipeControlsProps {
  onSwipe: (action: SwipeAction) => void;
  disabled?: boolean;
}

const SwipeControls = ({ onSwipe, disabled }: SwipeControlsProps) => {
  const buttons = [
    { action: 'pass' as SwipeAction, icon: X, color: 'bg-red-500/20 hover:bg-red-500/40 text-red-400', label: 'Не подходит' },
    { action: 'skip' as SwipeAction, icon: SkipForward, color: 'bg-white/10 hover:bg-white/20 text-white/60', label: 'Пропустить' },
    { action: 'like' as SwipeAction, icon: Star, color: 'bg-accent/20 hover:bg-accent/40 text-accent', label: 'В закладки' },
    { action: 'respond' as SwipeAction, icon: Check, color: 'bg-green-500/20 hover:bg-green-500/40 text-green-400', label: 'Откликнуться' },
  ];

  return (
    <div className="flex justify-center gap-4 mt-4">
      {buttons.map((btn) => (
        <motion.button
          key={btn.action}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSwipe(btn.action)}
          disabled={disabled}
          className={`w-14 h-14 rounded-full ${btn.color} flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          title={btn.label}
        >
          <btn.icon className="w-6 h-6" />
        </motion.button>
      ))}
    </div>
  );
};

export default SwipeControls;
