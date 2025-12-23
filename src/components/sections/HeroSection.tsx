import { RENTROP_VACANCY } from '@/constants/vacancy';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen hero-gradient overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-end/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gold-end/10 rounded-full blur-2xl animate-float" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-6 pt-32 pb-20 min-h-screen flex flex-col justify-center">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-dark px-4 py-2 rounded-full mb-8 opacity-0 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-white/80 font-medium">Активный набор</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight mb-6 opacity-0 animate-fade-in animate-delay-100">
            {RENTROP_VACANCY.title}
          </h1>

          {/* Salary highlight */}
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 opacity-0 animate-fade-in animate-delay-200">
            <span className="text-gradient-gold">{RENTROP_VACANCY.salary}</span>
          </div>

          {/* Description */}
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed opacity-0 animate-fade-in animate-delay-300">
            {RENTROP_VACANCY.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mb-12 opacity-0 animate-fade-in animate-delay-400">
            <div className="flex items-center gap-2 glass-dark px-4 py-2 rounded-xl">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-sm text-white/80">{RENTROP_VACANCY.location}</span>
            </div>
            <div className="flex items-center gap-2 glass-dark px-4 py-2 rounded-xl">
              <Briefcase className="w-4 h-4 text-accent" />
              <span className="text-sm text-white/80">{RENTROP_VACANCY.type}</span>
            </div>
            <div className="flex items-center gap-2 glass-dark px-4 py-2 rounded-xl">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-sm text-white/80">Карьерный рост</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in animate-delay-500">
            <Link to="/work">
              <Button 
                variant="cta" 
                size="xl"
                className="group"
              >
                Узнать о работе
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/conditions">
              <Button 
                variant="glassDark" 
                size="xl"
              >
                Условия работы
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in animate-delay-500">
          <span className="text-white/40 text-xs uppercase tracking-widest">Листайте вниз</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-accent rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
