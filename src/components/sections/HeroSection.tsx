import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { AnimatedSection, AnimatedText, Magnetic, StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section id="hero" className="relative min-h-screen hero-gradient overflow-hidden">
      {/* Decorative elements with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-end/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-gold-end/10 rounded-full blur-2xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-6 pt-32 pb-20 min-h-screen flex flex-col justify-center">
        <div className="max-w-4xl">
          {/* Badge */}
          <AnimatedSection variant="blurIn" delay={0}>
            <div className="inline-flex items-center gap-2 glass-dark px-4 py-2 rounded-full mb-8">
              <motion.span 
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm text-white/80 font-medium">{t('hero.badge')}</span>
            </div>
          </AnimatedSection>

          {/* Title */}
          <AnimatedSection variant="slideUp" delay={0.1} className="mb-6">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight">
              <AnimatedText text={t('hero.title')} delay={0.2} />
            </h1>
          </AnimatedSection>

          {/* Salary highlight */}
          <AnimatedSection variant="glitchIn" delay={0.3} className="mb-8">
            <motion.div 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <span className="text-gradient-gold">{t('hero.salary')}</span>
            </motion.div>
          </AnimatedSection>

          {/* Description */}
          <AnimatedSection variant="fadeUp" delay={0.4} className="mb-10">
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed">
              {t('hero.description')}
            </p>
          </AnimatedSection>

          {/* Meta info */}
          <StaggerContainer className="flex flex-wrap gap-4 mb-12" staggerDelay={0.1}>
            <StaggerItem variant="elasticIn">
              <Magnetic>
                <div className="flex items-center gap-2 glass-dark px-4 py-2 rounded-xl">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-sm text-white/80">{t('hero.location')}</span>
                </div>
              </Magnetic>
            </StaggerItem>
            <StaggerItem variant="elasticIn">
              <Magnetic>
                <div className="flex items-center gap-2 glass-dark px-4 py-2 rounded-xl">
                  <Briefcase className="w-4 h-4 text-accent" />
                  <span className="text-sm text-white/80">{t('hero.type')}</span>
                </div>
              </Magnetic>
            </StaggerItem>
            <StaggerItem variant="elasticIn">
              <Magnetic>
                <div className="flex items-center gap-2 glass-dark px-4 py-2 rounded-xl">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="text-sm text-white/80">{t('hero.careerGrowth')}</span>
                </div>
              </Magnetic>
            </StaggerItem>
          </StaggerContainer>

          {/* CTAs */}
          <AnimatedSection variant="scaleUp" delay={0.6}>
            <div className="flex flex-wrap gap-4">
              <Link to="/work">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Button 
                    variant="gold" 
                    size="xl"
                    className="group"
                  >
                    {t('hero.learnWork')}
                    <ArrowRight className="w-5 h-5 text-gold-foreground group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/conditions">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Button 
                    variant="gold" 
                    size="xl"
                  >
                    {t('hero.workConditions')}
                  </Button>
                </motion.div>
              </Link>
            </div>
          </AnimatedSection>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
