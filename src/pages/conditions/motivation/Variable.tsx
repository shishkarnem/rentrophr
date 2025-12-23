import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, Percent, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import tariffTable from '@/assets/tariff-table.jpg';
import motivationTable from '@/assets/motivation-table.jpg';
import DownloadButton from '@/components/ui/DownloadButton';
import { useLanguage } from '@/contexts/LanguageContext';

const Variable = () => {
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
                <span className="text-gradient-gold">{t('variable.title')}</span>
              </h1>
              <DownloadButton filename="variable" title={`${t('variable.title')} - РентРОП`} />
            </div>
            
            <CardGlassDark className="p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Percent className="w-5 h-5 text-primary" />
                  </span>
                  {t('variable.variablePremium')}
                </h2>
                <p className="text-white/80 leading-relaxed">
                  {t('variable.variablePremiumDesc')}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  {t('variable.howCalculated')}
                </h3>
                <div className="space-y-4">
                  <div className="p-4 glass-dark rounded-xl">
                    <p className="text-white/80">{t('variable.calcDesc1')}</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <p className="text-white/80">{t('variable.calcDesc2')}</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <p className="text-white/80">{t('variable.calcDesc3')}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 gradient-gold rounded-2xl text-center">
                <p className="text-sm font-semibold text-primary/70 mb-1">{t('variable.premiumBased')}</p>
                <p className="text-xl font-black text-primary">{t('variable.basedOnRevenue')}</p>
              </div>

              {/* Tables */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">{t('variable.motivationCalc')}</h3>
                <div className="space-y-4">
                  <a href={motivationTable} target="_blank" rel="noopener noreferrer" className="block">
                    <img src={motivationTable} alt="Motivation table" className="w-full rounded-xl border border-white/10 hover:border-accent/50 transition-colors cursor-pointer" />
                  </a>
                  <a href={tariffTable} target="_blank" rel="noopener noreferrer" className="block">
                    <img src={tariffTable} alt="Tariff table" className="w-full rounded-xl border border-white/10 hover:border-accent/50 transition-colors cursor-pointer" />
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

export default Variable;
