import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalculatorTooltipProps {
  content: string;
}

const CalculatorTooltip = ({ content }: CalculatorTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-1 text-accent/70 hover:text-accent transition-colors"
        type="button"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute z-50 left-0 top-6 w-64 p-3 bg-primary border border-accent/30 rounded-xl shadow-xl"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-white/80 text-xs pr-4">{content}</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalculatorTooltip;
