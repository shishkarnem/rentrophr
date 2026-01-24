import { useState, useRef, useEffect, useCallback, type MouseEvent as ReactMouseEvent } from 'react';
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

  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
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
        top: rect.bottom + 8 + window.scrollY,
        left: left
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updatePosition();
      }
    };

    if (isOpen) {
      // Use setTimeout to avoid immediate close on click
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
      document.addEventListener('keydown', handleEscape);
      window.addEventListener('scroll', handleScroll, true);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isOpen, updatePosition]);

  const handleToggle = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="ml-1 text-accent/70 hover:text-accent transition-colors focus:outline-none inline-flex items-center justify-center"
        type="button"
        aria-label="Показать подсказку"
        aria-expanded={isOpen}
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* click-catcher to close on outside click (also ensures we're above all blocks) */}
              <div
                className="fixed inset-0"
                style={{ zIndex: 99998 }}
                onClick={() => setIsOpen(false)}
              />

              <motion.div
                ref={tooltipRef}
                initial={{ opacity: 0, scale: 0.96, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -8 }}
                transition={{ duration: 0.18 }}
                className="fixed w-80 p-4 bg-primary/95 backdrop-blur-md border border-accent/40 rounded-2xl shadow-2xl"
                style={{
                  zIndex: 99999,
                  top: position.top,
                  left: position.left,
                  maxHeight: 'min(360px, 60vh)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors z-10"
                  type="button"
                  aria-label="Закрыть"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="max-h-72 overflow-y-auto pr-6">
                  <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">{content}</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default CalculatorTooltip;