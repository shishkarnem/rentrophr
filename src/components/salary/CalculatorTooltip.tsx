import { useState, useEffect, useRef } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface CalculatorTooltipProps {
  content: string;
}

const CalculatorTooltip = ({ content }: CalculatorTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={tooltipRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="ml-1 text-accent/70 hover:text-accent transition-colors"
        type="button"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={
              isMobile 
                ? "fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-sm p-4 bg-primary border border-accent/30 rounded-xl shadow-2xl"
                : "absolute z-50 left-0 top-8 w-80 p-4 bg-primary border border-accent/30 rounded-xl shadow-2xl"
            }
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">{content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalculatorTooltip;
