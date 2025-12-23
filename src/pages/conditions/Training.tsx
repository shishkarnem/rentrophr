import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, GraduationCap, BookOpen, CheckCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Training = () => {
  const { t } = useLanguage();

  const trainingStages = [
    { num: 1, titleKey: 'training.stage1' },
    { num: 2, titleKey: 'training.stage2' },
    { num: 3, titleKey: 'training.stage3' },
    { num: 4, titleKey: 'training.stage4' },
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
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-8">
              <span className="text-gradient-gold">{t('training.title')}</span>
            </h1>
            
            <div className="space-y-8">
              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </span>
                  {t('training.stepByStep')}
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>{t('training.stepByStepDesc')}</p>
                </div>

                <h3 className="text-lg font-semibold text-white mt-8 mb-4">{t('training.stages')}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {trainingStages.map((stage) => (
                    <div key={stage.num} className="p-4 glass-dark rounded-xl text-center">
                      <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center mx-auto mb-2">
                        <span className="text-primary font-bold">{stage.num}</span>
                      </div>
                      <p className="text-sm text-white font-medium">{t(stage.titleKey)}</p>
                    </div>
                  ))}
                </div>
              </CardGlassDark>

              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Send className="w-5 h-5 text-primary" />
                  </span>
                  {t('training.group')}
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>
                    {t('training.groupDesc1')}{' '}
                    <a href="https://t.me/+VROkOiW7pJfh5YV5" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-semibold">
                      {t('training.groupName')}
                    </a>
                  </p>
                  <p>{t('training.groupDesc2')}</p>
                </div>
              </CardGlassDark>

              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </span>
                  {t('training.knowledgeBase')}
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>{t('training.knowledgeBaseDesc1')}</p>
                  <p>{t('training.knowledgeBaseDesc2')}</p>
                  <div className="flex items-start gap-3 p-4 glass-dark rounded-xl">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <p>{t('training.accessNote')}</p>
                  </div>
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

export default Training;
