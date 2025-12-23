import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, Settings, Users, Wallet, FileText, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Services = () => {
  const { t } = useLanguage();

  const services = [
    t('services.hiring'),
    t('services.automation'),
    t('services.scripts'),
    t('services.accounting'),
    t('services.other')
  ];

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
              <span className="text-gradient-gold">{t('services.title')}</span>
            </h1>
            
            <CardGlassDark className="p-8 space-y-8">
              <div className="p-6 gradient-gold rounded-2xl text-center">
                <p className="text-2xl font-black text-primary">{t('services.officialSidejob')}</p>
                <p className="text-primary/80 mt-2">{t('services.officialSidejobDesc')}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Settings className="w-5 h-5 text-primary" />
                  </span>
                  {t('services.whatServices')}
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {services.map((service, i) => (
                    <div key={i} className="p-4 glass-dark rounded-xl">
                      <span className="font-semibold text-white">{i + 1}. {service}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Users className="w-5 h-5 text-accent" />
                  {t('services.toWhom')}
                </h3>
                <div className="grid gap-3">
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">1. {t('services.newClients')}</span>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">2. {t('services.existingClients')}</span>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">3. {t('services.helpRops')}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-accent" />
                  {t('services.atWhoseExpense')}
                </h3>
                <div className="grid gap-3">
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="text-white/80">1. {t('services.expense1')}</span>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="text-white/80">2. {t('services.expense2')}</span>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="text-white/80">3. {t('services.expense3')}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-accent" />
                  {t('services.howPriceAgreed')}
                </h3>
                <div className="space-y-3">
                  <div className="p-4 glass-dark rounded-xl">
                    <p className="text-white/80">
                      1. {t('services.priceDesc1')} <span className="text-accent font-semibold">{t('services.priceRange')}</span> {t('services.priceDesc1End')}
                    </p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <p className="text-white/80">2. {t('services.priceDesc2')}</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <p className="text-white/80">3. {t('services.priceDesc3')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">{t('services.howMuchPay')}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-4 glass-dark rounded-xl">
                    <p className="text-white/80">{t('services.payLtv')}</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <p className="text-white/80">{t('services.payOneTime')} <span className="text-accent font-semibold">{t('services.payOneTimePercent')}</span> {t('services.payOneTimeEnd')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Star className="w-5 h-5 text-accent" />
                  {t('services.ps')}
                </h3>
                <div className="p-4 glass-dark rounded-xl">
                  <p className="text-white/80">{t('services.psDesc')}</p>
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

export default Services;
