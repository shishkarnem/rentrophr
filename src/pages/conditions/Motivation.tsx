import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, DollarSign, Percent, Handshake, Settings, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import tariffTable from '@/assets/tariff-table.jpg';
import motivationTable from '@/assets/motivation-table.jpg';
import DownloadButton from '@/components/ui/DownloadButton';
import { useLanguage } from '@/contexts/LanguageContext';

const Motivation = () => {
  const { t } = useLanguage();

  const motivationItems = [
    { nameKey: 'motivation.fix', descKey: 'motivation.fixDesc', icon: DollarSign, path: '/conditions/motivation/fix' },
    { nameKey: 'motivation.variable', descKey: 'motivation.variableDesc', icon: Percent, path: '/conditions/motivation/variable' },
    { nameKey: 'motivation.partner', descKey: 'motivation.partnerDesc', icon: Handshake, path: '/conditions/motivation/partner' },
    { nameKey: 'motivation.services', descKey: 'motivation.servicesDesc', icon: Settings, path: '/conditions/motivation/services' },
    { nameKey: 'motivation.subpartner', descKey: 'motivation.subpartnerDesc', icon: Users, path: '/conditions/motivation/subpartner' },
  ];

  return (
    <div className="min-h-screen hero-gradient">
      <Header onNavigate={() => {}} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/conditions" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            {t('conditions.backToConditions')}
          </Link>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl sm:text-5xl font-black text-white">
                <span className="text-gradient-gold">{t('motivation.title')}</span>
              </h1>
              <DownloadButton filename="motivation" title={`${t('motivation.title')} - РентРОП`} />
            </div>
            
            <CardGlassDark className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </span>
                {t('motivation.paymentSystem')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {motivationItems.map((item, i) => (
                  <Link 
                    key={i} 
                    to={item.path}
                    className="p-4 glass-dark rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-accent" />
                        <span className="font-semibold text-white">{t(item.nameKey)}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-accent transition-colors" />
                    </div>
                    <p className="text-white/60 text-sm">{t(item.descKey)}</p>
                  </Link>
                ))}
              </div>
              
              <div className="mt-8 p-6 gradient-gold rounded-2xl text-center">
                <p className="text-sm font-semibold text-primary/70 mb-1">{t('motivation.totalIncome')}</p>
                <p className="text-2xl font-black text-primary">{t('vacancy.salaryValue')}</p>
              </div>

              {/* Таблицы */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">{t('motivation.tariffCalc')}</h3>
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

export default Motivation;
