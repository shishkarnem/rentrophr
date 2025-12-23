import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, History, Rocket, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutCompany = () => {
  return (
    <div className="min-h-screen hero-gradient">
      <Header onNavigate={() => {}} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/work" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Назад к разделу Работа
          </Link>
          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-8">
              О <span className="text-gradient-gold">компании</span>
            </h1>
            
            <CardGlassDark className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                  <History className="w-5 h-5 text-primary" />
                </span>
                История
              </h2>
              <div className="space-y-6 text-white/70 leading-relaxed">
                <p>
                  История компании начинается в феврале 2017 года, более 5 лет. 
                  Начинали с построения удаленных отделов продаж под ключ, 
                  так как было очень мало специалистов по построению удаленки.
                </p>
                
                <div className="flex items-start gap-4 p-4 glass-dark rounded-xl">
                  <Rocket className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <p>
                    В 2018 запустили академию <strong className="text-white">ВАШ РОП</strong> — 
                    первая академия руководителей отделов продаж.
                  </p>
                </div>

                <div className="flex items-start gap-4 p-4 glass-dark rounded-xl">
                  <Award className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <p>
                    Первый проект по Аренде РОПа начался в апреле 2020, на старте пандемии. 
                    На проекте и сейчас работает арендованный РОП.
                  </p>
                </div>

                <p>
                  За последние пару лет Аренда РОПов стала флагманом среди наших услуг 
                  и заслужила доверие сотен клиентов. Позволила кратно увеличиваться каждый год.
                </p>

                <a 
                  href="https://drive.google.com/file/d/1mcyPf2E2O6p-We319szojHy8aAcYvjh-/view" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent hover:underline font-semibold"
                >
                  Посмотреть кейсы →
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
