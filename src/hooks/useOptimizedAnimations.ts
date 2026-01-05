import { useReducedMotion } from 'framer-motion';
import { useIsMobile } from './use-mobile';

// Optimized animation settings for different devices
export const useOptimizedAnimations = () => {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  
  // Disable animations if user prefers reduced motion
  const shouldAnimate = !prefersReducedMotion;
  
  // Faster, simpler animations for mobile
  const duration = isMobile ? 0.3 : 0.5;
  const staggerDelay = isMobile ? 0.05 : 0.1;
  
  // Use simpler easing on mobile for better performance
  const ease = isMobile 
    ? [0.4, 0, 0.2, 1] as const // Simpler ease-out
    : [0.25, 0.46, 0.45, 0.94] as const; // Custom smooth ease
  
  // Simplified spring config for mobile
  const springConfig = isMobile 
    ? { type: 'spring' as const, stiffness: 300, damping: 30 }
    : { type: 'spring' as const, stiffness: 100, damping: 15 };

  // Page transition variants - simpler on mobile
  const pageVariants = {
    initial: shouldAnimate 
      ? { opacity: 0, y: isMobile ? 10 : 20 }
      : { opacity: 1, y: 0 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration, ease }
    },
    exit: shouldAnimate
      ? { opacity: 0, y: isMobile ? -5 : -10, transition: { duration: duration * 0.6, ease } }
      : { opacity: 1, y: 0 }
  };

  // Card variants - avoid CSS filter blur (Telegram WebView can render it permanently blurred)
  const cardVariants = {
    hidden: shouldAnimate
      ? { opacity: 0, y: isMobile ? 20 : 40 }
      : { opacity: 1, y: 0 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration, delay: i * staggerDelay, ease },
    }),
  };

  // Item variants for lists - avoid CSS filter blur
  const itemVariants = {
    hidden: shouldAnimate
      ? { opacity: 0, x: isMobile ? -10 : -30 }
      : { opacity: 1, x: 0 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration, ease },
    },
  };

  // Stagger container - faster stagger on mobile
  const containerVariants = {
    hidden: { opacity: shouldAnimate ? 0 : 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: staggerDelay, delayChildren: isMobile ? 0.1 : 0.2 }
    }
  };

  // Scale variants - no 3D transforms on mobile
  const scaleVariants = {
    hidden: shouldAnimate 
      ? { opacity: 0, scale: isMobile ? 0.95 : 0.9 }
      : { opacity: 1, scale: 1 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { duration, delay: i * staggerDelay, ...springConfig }
    })
  };

  // Hover effects - disabled on touch devices
  const hoverScale = isMobile ? {} : { scale: 1.02 };
  const hoverLift = isMobile ? {} : { scale: 1.03, y: -3 };
  const tapScale = { scale: 0.98 };

  // Icon rotation - simpler on mobile
  const iconHover = isMobile ? {} : { rotate: 5, scale: 1.1 };
  const iconSpin = isMobile 
    ? { transition: { duration: 0.3 } }
    : { rotate: 360, transition: { duration: 0.5 } };

  return {
    isMobile,
    shouldAnimate,
    duration,
    staggerDelay,
    ease,
    springConfig,
    pageVariants,
    cardVariants,
    itemVariants,
    containerVariants,
    scaleVariants,
    hoverScale,
    hoverLift,
    tapScale,
    iconHover,
    iconSpin,
  };
};

// Utility function to create optimized whileHover based on device
export const getHoverProps = (isMobile: boolean, props: object) => {
  return isMobile ? {} : { whileHover: props };
};

// Utility to conditionally apply animations
export const getAnimationProps = (shouldAnimate: boolean, props: object) => {
  return shouldAnimate ? props : {};
};
