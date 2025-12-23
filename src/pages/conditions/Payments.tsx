import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, Wallet, Calendar, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Payments = () => {
  const { t } = useLanguage();

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
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-8">
              <span className="text-gradient-gold">{t('payments.title')}</span>
            </h1>
            
            <CardGlassDark className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary" />
                </span>
                {t('payments.schedule')}
              </h2>
              <div className="space-y-6 text-white/70 leading-relaxed">
                <p>{t('payments.scheduleDesc')}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 glass-dark rounded-xl text-center">
                    <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{t('payments.day30')}</p>
                    <p className="text-sm">{t('payments.day30Desc')}</p>
                  </div>
                  
                  <div className="p-6 glass-dark rounded-xl text-center">
                    <div className="w-12 h-12 rounded-full gradient-cta flex items-center justify-center mx-auto mb-3">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{t('payments.day15')}</p>
                    <p className="text-sm">{t('payments.day15Desc')}</p>
                  </div>
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

export default Payments;
