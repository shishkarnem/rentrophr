import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, UserCheck, MessageSquare, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const DPR = () => {
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
              <span className="text-gradient-gold">ДПР</span>
            </h1>
            <p className="text-xl text-white/70 mb-8">
              Директора по развитию
            </p>
            
            <div className="space-y-8">
              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-primary" />
                  </span>
                  Наставничество
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>
                    Кроме РОПов в штате есть наставники — Директора по развитию (ДПР), 
                    которые помогают вести проекты и обучают РОПов.
                  </p>
                </div>
              </CardGlassDark>

              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </span>
                  Поддержка
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>
                    ДПР всегда на связи с РОПом, помогут советом и укажут правильное направление.
                  </p>
                </div>
              </CardGlassDark>

              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </span>
                  Еженедельные планерки
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>
                    Совместно с ДПР еженедельно проводятся планерки с заказчиком 
                    по закрытию и назначению задач.
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

export default DPR;
