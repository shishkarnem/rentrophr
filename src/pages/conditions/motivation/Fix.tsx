import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, DollarSign, Clock, MapPin, Briefcase, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import tariffTable from '@/assets/tariff-table.jpg';
import motivationTable from '@/assets/motivation-table.jpg';
import DownloadButton from '@/components/ui/DownloadButton';
import { useLanguage } from '@/contexts/LanguageContext';

const Fix = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen hero-gradient">
      <Header onNavigate={() => {}} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/conditions/motivation" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            {t('common.backToMotivation')}
          </Link>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl sm:text-5xl font-black text-white">
                <span className="text-gradient-gold">{t('fix.title')}</span>
              </h1>
              <DownloadButton filename="fix" title={`${t('fix.title')} - РентРОП`} />
            </div>
            
            <CardGlassDark className="p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </span>
                  {t('fix.fixedPremium')}
                </h2>
                <p className="text-white/80 leading-relaxed">
                  {t('fix.fixedPremiumDesc')} <Link to="/work/reports" className="text-accent hover:underline">{t('fix.reportForDay')}</Link>.
                </p>
                <p className="text-white/80 leading-relaxed mt-4">
                  {t('fix.premiumSizeDesc')} <span className="text-accent font-semibold">40-55% {t('fix.fromTariff')}</span>.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-accent" />
                  {t('fix.workFormats')}
                </h3>
                <div className="grid gap-3">
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">{t('fix.online')}</span>
                    <p className="text-white/60 text-sm">{t('fix.onlineDesc')}</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">{t('fix.offline')}</span>
                    <p className="text-white/60 text-sm">{t('fix.offlineDesc')}</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">{t('fix.combined')}</span>
                    <p className="text-white/60 text-sm">{t('fix.combinedDesc')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-accent" />
                  {t('fix.employment')}
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">{t('fix.hours4')}</span>
                    <p className="text-white/60 text-sm">{t('fix.hours4Desc')}</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">{t('fix.hours8')}</span>
                    <p className="text-white/60 text-sm">{t('fix.hours8Desc')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">{t('fix.tariffTypes')}</h3>
                <div className="grid gap-3">
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-accent">{t('fix.entry')}</span>
                    <p className="text-white/60 text-sm">{t('fix.entryDesc')}</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-accent">{t('fix.cold')}</span>
                    <p className="text-white/60 text-sm">{t('fix.coldDesc')}</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-accent">{t('fix.fromScratch')}</span>
                    <p className="text-white/60 text-sm">{t('fix.fromScratchDesc')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-accent" />
                  {t('fix.regions')}
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">{t('fix.international')}</span>
                    <p className="text-white/60 text-sm">{t('fix.internationalDesc')}</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">{t('fix.rf')}</span>
                    <p className="text-white/60 text-sm">{t('fix.rfDesc')}</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">{t('fix.cis')}</span>
                    <p className="text-white/60 text-sm">{t('fix.cisDesc')}</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">{t('fix.kz')}</span>
                    <p className="text-white/60 text-sm">{t('fix.kzDesc')}</p>
                  </div>
                </div>
              </div>

              {/* VAT Info */}
              <div className="p-6 border-2 border-accent/50 rounded-2xl bg-accent/10">
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
              </div>

              {/* Tariff tables */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">{t('fix.tariffGrid')}</h3>
                <div className="space-y-4">
                  <a href={tariffTable} target="_blank" rel="noopener noreferrer" className="block">
                    <img src={tariffTable} alt="Tariff table" className="w-full rounded-xl border border-white/10 hover:border-accent/50 transition-colors cursor-pointer" />
                  </a>
                  <a href={motivationTable} target="_blank" rel="noopener noreferrer" className="block">
                    <img src={motivationTable} alt="Motivation table" className="w-full rounded-xl border border-white/10 hover:border-accent/50 transition-colors cursor-pointer" />
                  </a>
                </div>
              </div>
            </CardGlassDark>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Fix;
