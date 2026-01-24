import { useState, useEffect, useRef } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { createPortal } from 'react-dom';

interface CalculatorTooltipProps {
  content: string;
}

const CalculatorTooltip = ({ content }: CalculatorTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current && !isMobile) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX
      });
    }
  }, [isOpen, isMobile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
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

  const tooltipContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={!isMobile ? { position: 'absolute', top: buttonPosition.top, left: buttonPosition.left } : undefined}
          className={
            isMobile 
              ? "fixed z-[9999] inset-x-[5%] top-1/2 -translate-y-1/2 p-4 bg-primary border border-accent/30 rounded-xl shadow-2xl"
              : "z-[9999] w-80 p-4 bg-primary border border-accent/30 rounded-xl shadow-2xl"
          }
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 text-accent/70 hover:text-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">{content}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="ml-1 text-accent/70 hover:text-accent transition-colors"
        type="button"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      
      {typeof document !== 'undefined' && createPortal(tooltipContent, document.body)}
    </div>
  );
};

export default CalculatorTooltip;
