import { useState, Suspense, lazy } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, DollarSign, Clock, MapPin, Briefcase, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy load images
const TariffImage = lazy(() => import('@/assets/tariff-table.jpg').then(module => ({ default: () => (
  <img src={module.default} alt="Tariff table" className="w-full rounded-xl border border-white/10 hover:border-accent/50 transition-colors cursor-pointer" />
)})));

const MotivationImage = lazy(() => import('@/assets/motivation-table.jpg').then(module => ({ default: () => (
  <img src={module.default} alt="Motivation table" className="w-full rounded-xl border border-white/10 hover:border-accent/50 transition-colors cursor-pointer" />
)})));

// Section components for lazy loading
const FixedPremiumSection = ({ t }: { t: (key: string) => string }) => (
  <div>
    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
      <motion.span 
        className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
        whileHover={{ rotate: 10, scale: 1.1 }}
      >
        <DollarSign className="w-5 h-5 text-primary" />
      </motion.span>
      {t('fix.fixedPremium')}
    </h2>
    <p className="text-white/80 leading-relaxed">
      {t('fix.fixedPremiumDesc')} <Link to="/work/reports" className="text-accent hover:underline">{t('fix.reportForDay')}</Link>.
    </p>
    <p className="text-white/80 leading-relaxed mt-4">
      {t('fix.premiumSizeDesc')} <span className="text-accent font-semibold">40-55% {t('fix.fromTariff')}</span>.
    </p>
  </div>
);

const WorkFormatsSection = ({ t }: { t: (key: string) => string }) => {
  const formats = [
    { title: 'fix.online', desc: 'fix.onlineDesc' },
    { title: 'fix.offline', desc: 'fix.offlineDesc' },
    { title: 'fix.combined', desc: 'fix.combinedDesc' },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
        <Clock className="w-5 h-5 text-accent" />
        {t('fix.workFormats')}
      </h3>
      <div className="grid gap-3">
        {formats.map((item, i) => (
          <motion.div 
            key={i}
            className="p-4 glass-dark rounded-xl"
            whileHover={{ x: 5, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <span className="font-semibold text-white">{t(item.title)}</span>
            <p className="text-white/60 text-sm">{t(item.desc)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const EmploymentSection = ({ t }: { t: (key: string) => string }) => {
  const hours = [
    { title: 'fix.hours4', desc: 'fix.hours4Desc' },
    { title: 'fix.hours8', desc: 'fix.hours8Desc' },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
        <Briefcase className="w-5 h-5 text-accent" />
        {t('fix.employment')}
      </h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {hours.map((item, i) => (
          <motion.div 
            key={i}
            className="p-4 glass-dark rounded-xl"
            whileHover={{ y: -3, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <span className="font-semibold text-white">{t(item.title)}</span>
            <p className="text-white/60 text-sm">{t(item.desc)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const TariffTypesSection = ({ t }: { t: (key: string) => string }) => {
  const types = [
    { title: 'fix.entry', desc: 'fix.entryDesc' },
    { title: 'fix.cold', desc: 'fix.coldDesc' },
    { title: 'fix.fromScratch', desc: 'fix.fromScratchDesc' },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">{t('fix.tariffTypes')}</h3>
      <div className="grid gap-3">
        {types.map((item, i) => (
          <motion.div 
            key={i}
            className="p-4 glass-dark rounded-xl"
            whileHover={{ x: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <span className="font-semibold text-accent">{t(item.title)}</span>
            <p className="text-white/60 text-sm">{t(item.desc)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const RegionsSection = ({ t }: { t: (key: string) => string }) => {
  const regions = [
    { title: 'fix.international', desc: 'fix.internationalDesc' },
    { title: 'fix.rf', desc: 'fix.rfDesc' },
    { title: 'fix.cis', desc: 'fix.cisDesc' },
    { title: 'fix.kz', desc: 'fix.kzDesc' },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
        <MapPin className="w-5 h-5 text-accent" />
        {t('fix.regions')}
      </h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {regions.map((item, i) => (
          <motion.div 
            key={i}
            className="p-4 glass-dark rounded-xl"
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <span className="font-semibold text-white">{t(item.title)}</span>
            <p className="text-white/60 text-sm">{t(item.desc)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const VATSection = ({ t }: { t: (key: string) => string }) => (
  <motion.div 
    className="p-6 border-2 border-accent/50 rounded-2xl bg-accent/10"
    animate={{ 
      borderColor: ['rgba(255,107,107,0.5)', 'rgba(255,107,107,0.8)', 'rgba(255,107,107,0.5)']
    }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
      <AlertTriangle className="w-5 h-5 text-accent" />
      {t('fix.vatTitle')}
    </h3>
    <div className="space-y-4 text-white/80">
      <p className="font-semibold text-accent">{t('fix.vatInfo1')}</p>
      <p>{t('fix.vatInfo2')}</p>
      <p>{t('fix.vatInfo3')}</p>
      
      <div className="p-4 glass-dark rounded-xl">
        <p className="font-semibold text-white mb-2">{t('fix.vatExample')}</p>
        <ul className="space-y-2 text-sm">
          <li>• {t('fix.vatExampleItem1')}</li>
          <li>• {t('fix.vatExampleItem2')} <span className="text-accent font-semibold">126 000 руб</span></li>
          <li>• {t('fix.vatExampleItem3')}</li>
          <li>• {t('fix.vatExampleItem4')} <span className="text-accent font-semibold">120к</span></li>
          <li>• {t('fix.vatExampleItem5')}</li>
          <li>• {t('fix.vatExampleItem6')}</li>
        </ul>
      </div>
      
      <p className="text-sm italic">{t('fix.vatNote')}</p>
      <p className="text-sm text-accent">{t('fix.vatPs')}</p>
    </div>
  </motion.div>
);

const TariffGridSection = ({ t }: { t: (key: string) => string }) => (
  <div>
    <h3 className="text-xl font-bold text-white mb-4">{t('fix.tariffGrid')}</h3>
    <div className="space-y-4">
      <Suspense fallback={<div className="w-full h-48 bg-white/5 rounded-xl animate-pulse" />}>
        <motion.a 
          href="/assets/tariff-table.jpg" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block"
          whileHover={{ scale: 1.01 }}
        >
          <TariffImage />
        </motion.a>
      </Suspense>
      <Suspense fallback={<div className="w-full h-48 bg-white/5 rounded-xl animate-pulse" />}>
        <motion.a 
          href="/assets/motivation-table.jpg" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block"
          whileHover={{ scale: 1.01 }}
        >
          <MotivationImage />
        </motion.a>
      </Suspense>
    </div>
  </div>
);

const Fix = () => {
  const { t } = useLanguage();
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;
  const mobileOptimizedClass = showMobileNav ? 'mobile-optimized' : '';
  
  // Track which sections are visible
  const [visibleSections, setVisibleSections] = useState({
    formats: false,
    employment: false,
    tariffTypes: false,
    regions: false,
    vat: false,
    grid: false,
  });

  return (
    <div className={`min-h-screen hero-gradient ${mobileOptimizedClass}`}>
      <MobileLayout>
        <main className={showMobileNav ? "pt-32 pb-24" : "pt-24 pb-16"}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link to="/conditions/motivation" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" />
                {t('common.backToMotivation')}
              </Link>
            </motion.div>
            
            <div className="max-w-4xl mx-auto">
              <motion.h1 
                className="text-4xl sm:text-5xl font-black text-white mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-gradient-gold">{t('fix.title')}</span>
              </motion.h1>
              
              {/* Section 1: Fixed Premium */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <CardGlassDark className="p-8 mb-6">
                  <FixedPremiumSection t={t} />
                </CardGlassDark>
              </motion.div>

              {/* Section 2: Work Formats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.3 }}
                onViewportEnter={() => setVisibleSections(prev => ({ ...prev, formats: true }))}
              >
                <CardGlassDark className="p-8 mb-6">
                  {visibleSections.formats || !showMobileNav ? <WorkFormatsSection t={t} /> : <div className="h-40 animate-pulse bg-white/5 rounded-xl" />}
                </CardGlassDark>
              </motion.div>

              {/* Section 3: Employment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.3 }}
                onViewportEnter={() => setVisibleSections(prev => ({ ...prev, employment: true }))}
              >
                <CardGlassDark className="p-8 mb-6">
                  {visibleSections.employment || !showMobileNav ? <EmploymentSection t={t} /> : <div className="h-32 animate-pulse bg-white/5 rounded-xl" />}
                </CardGlassDark>
              </motion.div>

              {/* Section 4: Tariff Types */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.3 }}
                onViewportEnter={() => setVisibleSections(prev => ({ ...prev, tariffTypes: true }))}
              >
                <CardGlassDark className="p-8 mb-6">
                  {visibleSections.tariffTypes || !showMobileNav ? <TariffTypesSection t={t} /> : <div className="h-40 animate-pulse bg-white/5 rounded-xl" />}
                </CardGlassDark>
              </motion.div>

              {/* Section 5: Regions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.3 }}
                onViewportEnter={() => setVisibleSections(prev => ({ ...prev, regions: true }))}
              >
                <CardGlassDark className="p-8 mb-6">
                  {visibleSections.regions || !showMobileNav ? <RegionsSection t={t} /> : <div className="h-48 animate-pulse bg-white/5 rounded-xl" />}
                </CardGlassDark>
              </motion.div>

              {/* Section 6: VAT Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.3 }}
                onViewportEnter={() => setVisibleSections(prev => ({ ...prev, vat: true }))}
                className="mb-6"
              >
                {visibleSections.vat || !showMobileNav ? <VATSection t={t} /> : <div className="h-64 animate-pulse bg-white/5 rounded-xl" />}
              </motion.div>

              {/* Section 7: Tariff Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.3 }}
                onViewportEnter={() => setVisibleSections(prev => ({ ...prev, grid: true }))}
              >
                <CardGlassDark className="p-8">
                  {visibleSections.grid || !showMobileNav ? <TariffGridSection t={t} /> : <div className="h-96 animate-pulse bg-white/5 rounded-xl" />}
                </CardGlassDark>
              </motion.div>
            </div>
          </div>
        </main>
      </MobileLayout>
    </div>
  );
};

export default Fix;