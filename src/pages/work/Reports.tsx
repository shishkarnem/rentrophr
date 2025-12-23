import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, FileText, Calendar, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Reports = () => {
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
              <span className="text-gradient-gold">{t('reports.title')}</span>
            </h1>
            
            <div className="space-y-8">
              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </span>
                  {t('reports.daily')}
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>{t('reports.dailyDesc')}</p>
                  <p className="font-semibold text-white">{t('reports.regularReport')}</p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex gap-3"><span className="text-accent font-bold">а)</span>{t('reports.dailyTasksA')}</li>
                    <li className="flex gap-3"><span className="text-accent font-bold">б)</span>{t('reports.dailyTasksB')}</li>
                  </ul>
                </div>
              </CardGlassDark>

              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </span>
                  {t('reports.weekly')}
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>{t('reports.weeklyDesc1')}</p>
                  <p>{t('reports.weeklyDesc2')}</p>
                  <p>{t('reports.weeklyDesc3')}</p>
                </div>
              </CardGlassDark>

              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </span>
                  {t('reports.transparency')}
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>{t('reports.transparencyDesc')}</p>
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

export default Reports;
