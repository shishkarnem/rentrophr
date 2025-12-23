import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, Handshake, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Partner = () => {
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
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-8">
              <span className="text-gradient-gold">{t('partner.title')}</span>
            </h1>
            
            <CardGlassDark className="p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Handshake className="w-5 h-5 text-primary" />
                  </span>
                  {t('partner.program')}
                </h2>
                <p className="text-white/80 leading-relaxed">
                  {t('partner.programDesc')}
                </p>
              </div>

              <div className="p-6 gradient-gold rounded-2xl text-center">
                <p className="text-sm font-semibold text-primary/70 mb-1">{t('partner.rewardSize')}</p>
                <p className="text-3xl font-black text-primary">{t('partner.rewardPercent')}</p>
                <p className="text-sm text-primary/70 mt-2">{t('partner.rewardDuration')}</p>
              </div>

              <div className="p-4 glass-dark rounded-xl">
                <p className="text-white/80">
                  {t('partner.paymentDetails')}{' '}
                  <a 
                    href="https://t.me/+4-EaFu0bCbw5YTY6" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:underline inline-flex items-center gap-1"
                  >
                    {t('partner.telegramChannel')}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </p>
              </div>
            </CardGlassDark>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Partner;
