import { useInView, Variants } from 'framer-motion';
import { useRef } from 'react';

export type AnimationVariant = 
  | 'fadeUp' 
  | 'fadeDown' 
  | 'fadeLeft' 
  | 'fadeRight' 
  | 'blurIn' 
  | 'scaleUp' 
  | 'rotateIn' 
  | 'slideUp' 
  | 'morphIn'
  | 'glitchIn'
  | 'elasticIn';

export const animationVariants: Record<AnimationVariant, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  },
  fadeDown: {
    hidden: { opacity: 0, y: -60, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -80, filter: 'blur(8px)' },
    visible: { 
      opacity: 1, 
      x: 0, 
      filter: 'blur(0px)',
      transition: { 
        duration: 0.7, 
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  },
  fadeRight: {
    hidden: { opacity: 0, x: 80, filter: 'blur(8px)' },
    visible: { 
      opacity: 1, 
      x: 0, 
      filter: 'blur(0px)',
      transition: { 
        duration: 0.7, 
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  },
  blurIn: {
    hidden: { opacity: 0, filter: 'blur(20px)', scale: 0.9 },
    visible: { 
      opacity: 1, 
      filter: 'blur(0px)', 
      scale: 1,
      transition: { 
        duration: 1, 
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.7, rotateX: 15 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotateX: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.34, 1.56, 0.64, 1] as const
      }
    }
  },
  rotateIn: {
    hidden: { opacity: 0, rotate: -10, scale: 0.9, y: 40 },
    visible: { 
      opacity: 1, 
      rotate: 0, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.9, 
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  },
  slideUp: {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  },
  morphIn: {
    hidden: { 
      opacity: 0, 
      borderRadius: '50%', 
      scale: 0.5,
      filter: 'blur(10px)'
    },
    visible: { 
      opacity: 1, 
      borderRadius: '24px', 
      scale: 1,
      filter: 'blur(0px)',
      transition: { 
        duration: 1, 
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  },
  glitchIn: {
    hidden: { 
      opacity: 0, 
      x: -20,
      skewX: 10,
      filter: 'blur(4px)'
    },
    visible: { 
      opacity: 1, 
      x: 0,
      skewX: 0,
      filter: 'blur(0px)',
      transition: { 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  },
  elasticIn: {
    hidden: { opacity: 0, scale: 0.3, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

export const useScrollAnimation = (threshold = 0.2) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  
  return { ref, isInView };
};
