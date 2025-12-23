import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useOptimizedAnimations } from '@/hooks/useOptimizedAnimations';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className = '' }: PageTransitionProps) => {
  const { pageVariants, shouldAnimate } = useOptimizedAnimations();
  
  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
