import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, DollarSign, Percent, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const ArendaRopov = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen hero-gradient">
      <Header onNavigate={() => {}} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/work" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            {t('work.backToWork')}
          </Link>
          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-8">
              <span className="text-gradient-gold">{t('arenda.title')}</span>
            </h1>
            
            <div className="space-y-8">
              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </span>
                  {t('arenda.product')}
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p className="text-lg font-semibold text-white">{t('arenda.productTitle')}</p>
                  <p>{t('arenda.productDesc')}</p>
                </div>
              </CardGlassDark>

              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </span>
                  {t('arenda.payment')}
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>{t('arenda.paymentDesc')}</p>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">1.</span>
                      <div>
                        <Link to="/conditions/motivation" className="text-accent hover:underline font-semibold">{t('arenda.fixedPremium')}</Link> {t('arenda.fixedPremiumDesc')}
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">2.</span>
                      <div>
                        <Link to="/conditions/motivation" className="text-accent hover:underline font-semibold">{t('arenda.variablePremium')}</Link> {t('arenda.variablePremiumDesc')}
                      </div>
                    </li>
                  </ul>
                </div>
              </CardGlassDark>

              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Percent className="w-5 h-5 text-primary" />
                  </span>
                  {t('arenda.variablePart')}
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>{t('arenda.variablePartDesc1')}</p>
                  <p>{t('arenda.variablePartDesc2')}</p>
                  <p>{t('arenda.variablePartDesc3')}</p>
                  <p className="mt-4">
                    {t('arenda.moreDetails')}{' '}
                    <a href="https://arenda-ropa.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      arenda-ropa.com
                    </a>
                  </p>
                </div>
              </CardGlassDark>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArendaRopov;
