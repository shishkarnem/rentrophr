import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, FolderKanban, Users, Video, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Projects = () => {
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
              <span className="text-gradient-gold">{t('projects.title')}</span>
            </h1>
            
            <div className="space-y-8">
              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <FolderKanban className="w-5 h-5 text-primary" />
                  </span>
                  {t('projects.selection')}
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>
                    {t('projects.selectionDesc1')}{' '}
                    <a href="https://t.me/rentrop_project" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-semibold">
                      {t('projects.telegramChannel')}
                    </a>{' '}
                    {t('projects.selectionDesc2')}
                  </p>
                  <p>{t('projects.selectionDesc3')}</p>
                  <p>{t('projects.selectionDesc4')}</p>
                </div>
              </CardGlassDark>

              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </span>
                  {t('projects.team')}
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p className="font-semibold text-white">{t('projects.teamDesc')}</p>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">1.</span>
                      <div>
                        <strong className="text-white">{t('projects.rop')}</strong> {t('projects.ropDesc')}
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">2.</span>
                      <div>
                        <strong className="text-white">{t('projects.dpr')}</strong> {t('projects.dprDesc')}
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">3.</span>
                      <div>
                        <strong className="text-white">{t('projects.projectManager')}</strong> {t('projects.projectManagerDesc')}
                      </div>
                    </li>
                  </ul>
                </div>
              </CardGlassDark>

              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Video className="w-5 h-5 text-primary" />
                  </span>
                  {t('projects.videoCard')}
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>{t('projects.videoCardDesc')}</p>
                  <p className="font-semibold text-white">{t('projects.videoInstructions')}</p>
                  <ul className="space-y-2">
                    <li className="flex gap-3">
                      <span className="text-accent">•</span>
                      {t('projects.videoInstr1')}
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent">•</span>
                      {t('projects.videoInstr2')}
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent">•</span>
                      {t('projects.videoInstr3')}
                    </li>
                  </ul>
                </div>
              </CardGlassDark>

              <CardGlassDark className="p-8">
                <div className="flex items-start gap-4 p-4 glass-dark rounded-xl">
                  <Send className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div className="text-white/70">
                    <p className="font-semibold text-white mb-1">{t('projects.important')}</p>
                    <p>{t('projects.importantDesc')}</p>
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

export default Projects;
