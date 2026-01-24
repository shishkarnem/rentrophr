import { useState, useRef, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface CalculatorTooltipProps {
  content: string;
}

const CalculatorTooltip = ({ content }: CalculatorTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const tooltipWidth = 320;
      const padding = 16;
      
      let left = rect.left;
      // Ensure tooltip doesn't go off-screen on the right
      if (left + tooltipWidth > window.innerWidth - padding) {
        left = window.innerWidth - tooltipWidth - padding;
      }
      // Ensure tooltip doesn't go off-screen on the left
      if (left < padding) {
        left = padding;
      }
      
      setPosition({
        top: rect.bottom + 8,
        left: left
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const tooltipContent = isOpen ? createPortal(
    <>
      <div 
        className="fixed inset-0" 
        style={{ zIndex: 9998 }}
        onClick={() => setIsOpen(false)}
      />
      <motion.div
        ref={tooltipRef}
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        transition={{ duration: 0.2 }}
        className="fixed w-80 p-4 bg-primary/95 backdrop-blur-md border border-accent/40 rounded-2xl shadow-2xl"
        style={{ 
          zIndex: 9999,
          top: position.top,
          left: position.left,
          maxHeight: 'calc(100vh - 100px)'
        }}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="max-h-64 overflow-y-auto pr-6 scrollbar-thin scrollbar-thumb-accent/30 scrollbar-track-transparent">
          <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">{content}</p>
        </div>
      </motion.div>
    </>,
    document.body
  ) : null;

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="ml-1 text-accent/70 hover:text-accent transition-colors focus:outline-none"
        type="button"
        aria-label="Показать подсказку"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      
      <AnimatePresence>
        {tooltipContent}
      </AnimatePresence>
    </div>
  );
};

export default CalculatorTooltip;
