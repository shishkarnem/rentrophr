import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, History, Rocket, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutCompany = () => {
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
              <span className="text-gradient-gold">{t('about.title')}</span>
            </h1>
            
            <CardGlassDark className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                  <History className="w-5 h-5 text-primary" />
                </span>
                {t('about.history')}
              </h2>
              <div className="space-y-6 text-white/70 leading-relaxed">
                <p>{t('about.historyText1')}</p>
                
                <div className="flex items-start gap-4 p-4 glass-dark rounded-xl">
                  <Rocket className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <p>{t('about.academyText')}</p>
                </div>

                <div className="flex items-start gap-4 p-4 glass-dark rounded-xl">
                  <Award className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <p>{t('about.firstProjectText')}</p>
                </div>

                <p>{t('about.flagshipText')}</p>

                <a 
                  href="https://drive.google.com/file/d/1mcyPf2E2O6p-We319szojHy8aAcYvjh-/view" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent hover:underline font-semibold"
                >
                  {t('about.viewCases')}
                </a>
              </div>
            </CardGlassDark>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutCompany;
