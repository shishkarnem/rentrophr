import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';
import { animationVariants, AnimationVariant, useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: ReactNode;
  variant?: AnimationVariant;
  className?: string;
  delay?: number;
  threshold?: number;
  customVariants?: Variants;
}

export const AnimatedSection = ({ 
  children, 
  variant = 'fadeUp', 
  className = '',
  delay = 0,
  threshold = 0.2,
  customVariants
}: AnimatedSectionProps) => {
  const { ref, isInView } = useScrollAnimation(threshold);
  
  const selectedVariants = customVariants || animationVariants[variant];
  
  // Add delay to the variants
  const variantsWithDelay: Variants = {
    hidden: selectedVariants.hidden,
    visible: {
      ...(typeof selectedVariants.visible === 'object' ? selectedVariants.visible : {}),
      transition: {
        ...(typeof selectedVariants.visible === 'object' && 
            'transition' in selectedVariants.visible ? 
            selectedVariants.visible.transition : {}),
        delay
      }
    }
  };
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variantsWithDelay}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const wordVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20, 
    filter: 'blur(10px)',
    rotateX: 45
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    rotateX: 0,
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  }
};

export const AnimatedText = ({ text, className = '', delay = 0 }: AnimatedTextProps) => {
  const { ref, isInView } = useScrollAnimation(0.5);
  
  const words = text.split(' ');
  
  const containerVariants: Variants = {
    visible: { transition: { staggerChildren: 0.05, delayChildren: delay } },
    hidden: {}
  };
  
  return (
    <motion.span
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          variants={wordVariants}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

const createStaggerVariants = (staggerDelay: number): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1
    }
  }
});

export const StaggerContainer = ({ 
  children, 
  className = '',
  staggerDelay = 0.1
}: StaggerContainerProps) => {
  const { ref, isInView } = useScrollAnimation(0.1);
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={createStaggerVariants(staggerDelay)}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  variant?: AnimationVariant;
}

export const StaggerItem = ({ 
  children, 
  className = '',
  variant = 'fadeUp'
}: StaggerItemProps) => {
  return (
    <motion.div
      variants={animationVariants[variant]}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Parallax effect component
interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export const Parallax = ({ children, className = '', speed = 0.5 }: ParallaxProps) => {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      whileInView={{ y: speed * -50 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: false, amount: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// Magnetic hover effect
interface MagneticProps {
  children: ReactNode;
  className?: string;
}

export const Magnetic = ({ children, className = '' }: MagneticProps) => {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  );
};
