import { useState, Suspense, lazy } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { CardGlassDark, CardGlassDarkHeader, CardGlassDarkTitle, CardGlassDarkContent } from '@/components/ui/card';
import { ArrowLeft, DollarSign, Clock, MapPin, Briefcase, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';
import tariffTableImg from '@/assets/tariff-table.jpg';
import motivationTableImg from '@/assets/motivation-table.jpg';
import SalaryCalculator from '@/components/salary/SalaryCalculator';

// Lazy load image components
const TariffImage = lazy(() => Promise.resolve({
  default: () => <img src={tariffTableImg} alt="Tariff table" className="w-full rounded-xl border border-white/10 hover:border-accent/50 transition-colors cursor-pointer" />
}));
const MotivationImage = lazy(() => Promise.resolve({
  default: () => <img src={motivationTableImg} alt="Motivation table" className="w-full rounded-xl border border-white/10 hover:border-accent/50 transition-colors cursor-pointer" />
}));

// Section components for lazy loading
const FixedPremiumSection = ({
  t
}: {
  t: (key: string) => string;
}) => <div>
    <CardGlassDarkHeader icon={DollarSign} title={t('fix.fixedPremium')} />
    <CardGlassDarkContent>
      <p>
        {t('fix.fixedPremiumDesc')} <Link to="/work/reports" className="text-accent hover:underline">{t('fix.reportForDay')}</Link>.
      </p>
      <p>
        {t('fix.premiumSizeDesc')} <span className="text-accent font-semibold">40-55% {t('fix.fromTariff')}</span>.
      </p>
    </CardGlassDarkContent>
  </div>;
const WorkFormatsSection = ({
  t
}: {
  t: (key: string) => string;
}) => {
  const formats = [{
    title: 'fix.online',
    desc: 'fix.onlineDesc'
  }, {
    title: 'fix.offline',
    desc: 'fix.offlineDesc'
  }, {
    title: 'fix.combined',
    desc: 'fix.combinedDesc'
  }];
  return <div>
      <CardGlassDarkTitle icon={Clock} className="mb-4">
        {t('fix.workFormats')}
      </CardGlassDarkTitle>
      <div className="grid gap-3">
        {formats.map((item, i) => <motion.div key={i} className="p-4 glass-dark rounded-xl" whileHover={{
        x: 5,
        scale: 1.01
      }} transition={{
        type: 'spring',
        stiffness: 400
      }}>
            <span className="font-semibold text-accent">{t(item.title)}</span>
            <p className="text-white/60 text-sm">{t(item.desc)}</p>
          </motion.div>)}
      </div>
    </div>;
};
const EmploymentSection = ({
  t
}: {
  t: (key: string) => string;
}) => {
  const hours = [{
    title: 'fix.hours4',
    desc: 'fix.hours4Desc'
  }, {
    title: 'fix.hours8',
    desc: 'fix.hours8Desc'
  }];
  return <div>
      <CardGlassDarkTitle icon={Briefcase} className="mb-4">
        {t('fix.employment')}
      </CardGlassDarkTitle>
      <div className="grid sm:grid-cols-2 gap-3">
        {hours.map((item, i) => <motion.div key={i} className="p-4 glass-dark rounded-xl" whileHover={{
        y: -3,
        scale: 1.02
      }} transition={{
        type: 'spring',
        stiffness: 400
      }}>
            <span className="font-semibold text-accent">{t(item.title)}</span>
            <p className="text-white/60 text-sm">{t(item.desc)}</p>
          </motion.div>)}
      </div>
    </div>;
};
const TariffTypesSection = ({
  t
}: {
  t: (key: string) => string;
}) => {
  const types = [{
    title: 'fix.entry',
    desc: 'fix.entryDesc'
  }, {
    title: 'fix.cold',
    desc: 'fix.coldDesc'
  }, {
    title: 'fix.fromScratch',
    desc: 'fix.fromScratchDesc'
  }];
  return <div>
      <h3 className="text-xl font-bold text-accent mb-4">{t('fix.tariffTypes')}</h3>
      <div className="grid gap-3">
        {types.map((item, i) => <motion.div key={i} className="p-4 glass-dark rounded-xl" whileHover={{
        x: 5
      }} transition={{
        type: 'spring',
        stiffness: 400
      }}>
            <span className="font-semibold text-accent">{t(item.title)}</span>
            <p className="text-white/60 text-sm">{t(item.desc)}</p>
          </motion.div>)}
      </div>
    </div>;
};
const RegionsSection = ({
  t
}: {
  t: (key: string) => string;
}) => {
  const regions = [{
    title: 'fix.international',
    desc: 'fix.internationalDesc'
  }, {
    title: 'fix.rf',
    desc: 'fix.rfDesc'
  }, {
    title: 'fix.cis',
    desc: 'fix.cisDesc'
  }, {
    title: 'fix.kz',
    desc: 'fix.kzDesc'
  }];
  return <div>
      <CardGlassDarkTitle icon={MapPin} className="mb-4">
        {t('fix.regions')}
      </CardGlassDarkTitle>
      <div className="grid sm:grid-cols-2 gap-3">
        {regions.map((item, i) => <motion.div key={i} className="p-4 glass-dark rounded-xl" whileHover={{
        y: -3
      }} transition={{
        type: 'spring',
        stiffness: 400
      }}>
            <span className="font-semibold text-accent">{t(item.title)}</span>
            <p className="text-white/60 text-sm">{t(item.desc)}</p>
          </motion.div>)}
      </div>
    </div>;
};
const VATSection = ({
  t
}: {
  t: (key: string) => string;
}) => {};
const TariffGridSection = () => <div>
    <div className="space-y-4">
      <Suspense fallback={<div className="w-full h-48 bg-white/5 rounded-xl animate-pulse" />}>
        <motion.a href={tariffTableImg} target="_blank" rel="noopener noreferrer" className="block" whileHover={{
        scale: 1.01
      }}>
          <TariffImage />
        </motion.a>
      </Suspense>
      <Suspense fallback={<div className="w-full h-48 bg-white/5 rounded-xl animate-pulse" />}>
        <motion.a href={motivationTableImg} target="_blank" rel="noopener noreferrer" className="block" whileHover={{
        scale: 1.01
      }}>
          <MotivationImage />
        </motion.a>
      </Suspense>
    </div>
  </div>;
const Fix = () => {
  const {
    t
  } = useLanguage();
  const {
    isTelegram
  } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;
  const mobileOptimizedClass = showMobileNav ? 'mobile-optimized' : '';
  const [visibleSections, setVisibleSections] = useState({
    formats: false,
    employment: false,
    tariffTypes: false,
    regions: false,
    vat: false,
    grid: false
  });
  return <div className={`min-h-screen hero-gradient ${mobileOptimizedClass}`}>
      <MobileLayout>
        <main className={showMobileNav ? "pt-32 pb-24" : "pt-24 pb-16"}>
          <div className="container mx-auto px-6">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.3
          }}>
              <Link to="/conditions/motivation" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" />
                {t('common.backToMotivation')}
              </Link>
            </motion.div>
            
            <div className="max-w-4xl mx-auto">
              <motion.h1 className="text-4xl sm:text-5xl font-black text-white mb-8" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.3
            }}>
                <span className="text-gradient-gold">{t('fix.title')}</span>
              </motion.h1>
              
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.3,
              delay: 0.1
            }}>
                <CardGlassDark className="p-8 mb-6" hover>
                  <FixedPremiumSection t={t} />
                </CardGlassDark>
              </motion.div>

              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true,
              margin: '-100px'
            }} transition={{
              duration: 0.3
            }} onViewportEnter={() => setVisibleSections(prev => ({
              ...prev,
              formats: true
            }))}>
                <CardGlassDark className="p-8 mb-6" hover>
                  {visibleSections.formats || !showMobileNav ? <WorkFormatsSection t={t} /> : <div className="h-40 animate-pulse bg-white/5 rounded-xl" />}
                </CardGlassDark>
              </motion.div>

              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true,
              margin: '-100px'
            }} transition={{
              duration: 0.3
            }} onViewportEnter={() => setVisibleSections(prev => ({
              ...prev,
              employment: true
            }))}>
                <CardGlassDark className="p-8 mb-6" hover>
                  {visibleSections.employment || !showMobileNav ? <EmploymentSection t={t} /> : <div className="h-32 animate-pulse bg-white/5 rounded-xl" />}
                </CardGlassDark>
              </motion.div>

              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true,
              margin: '-100px'
            }} transition={{
              duration: 0.3
            }} onViewportEnter={() => setVisibleSections(prev => ({
              ...prev,
              tariffTypes: true
            }))}>
                <CardGlassDark className="p-8 mb-6" hover>
                  {visibleSections.tariffTypes || !showMobileNav ? <TariffTypesSection t={t} /> : <div className="h-40 animate-pulse bg-white/5 rounded-xl" />}
                </CardGlassDark>
              </motion.div>

              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true,
              margin: '-100px'
            }} transition={{
              duration: 0.3
            }} onViewportEnter={() => setVisibleSections(prev => ({
              ...prev,
              regions: true
            }))}>
                <CardGlassDark className="p-8 mb-6" hover>
                  {visibleSections.regions || !showMobileNav ? <RegionsSection t={t} /> : <div className="h-48 animate-pulse bg-white/5 rounded-xl" />}
                </CardGlassDark>
              </motion.div>

              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true,
              margin: '-100px'
            }} transition={{
              duration: 0.3
            }} onViewportEnter={() => setVisibleSections(prev => ({
              ...prev,
              vat: true
            }))} className="mb-6">
                {visibleSections.vat || !showMobileNav ? <VATSection t={t} /> : <div className="h-64 animate-pulse bg-white/5 rounded-xl" />}
              </motion.div>

              {/* Salary Calculator */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true,
              margin: '-100px'
            }} transition={{
              duration: 0.3
            }} className="mb-6">
                <SalaryCalculator />
              </motion.div>

              {/* Tariff Grid */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true,
              margin: '-100px'
            }} transition={{
              duration: 0.3
            }} onViewportEnter={() => setVisibleSections(prev => ({
              ...prev,
              grid: true
            }))}>
                <CardGlassDark className="p-8" hover>
                  <h3 className="text-xl font-bold text-accent mb-4">{t('fix.tariffGrid')}</h3>
                  {visibleSections.grid || !showMobileNav ? <TariffGridSection /> : <div className="h-96 animate-pulse bg-white/5 rounded-xl" />}
                </CardGlassDark>
              </motion.div>
            </div>
          </div>
        </main>
      </MobileLayout>
    </div>;
};
export default Fix;