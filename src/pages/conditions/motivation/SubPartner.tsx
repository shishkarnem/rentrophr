import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, Users, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubPartner = () => {
  return (
    <div className="min-h-screen hero-gradient">
      <Header onNavigate={() => {}} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/conditions/motivation" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Назад к Мотивации
          </Link>
          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-8">
              <span className="text-gradient-gold">Суб.партнерка</span>
            </h1>
            
            <CardGlassDark className="p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </span>
                  Партнерство с АМО и Битрикс
                </h2>
                <p className="text-white/80 leading-relaxed">
                  РентРОП является партнером АМО и Битрикс. При продлении через нас и покупке лицензий, 
                  РОП дополнительно зарабатывает <span className="text-accent font-semibold">20% от разницы в сумме оплаты</span>.
                </p>
              </div>

              <div className="p-6 gradient-gold rounded-2xl text-center">
                <p className="text-sm font-semibold text-primary/70 mb-1">Дополнительный заработок</p>
                <p className="text-3xl font-black text-primary">20%</p>
                <p className="text-sm text-primary/70 mt-2">от разницы в сумме оплаты за лицензии</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Gift className="w-5 h-5 text-accent" />
                  Бонусы для клиента
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">Дополнительные лицензии</span>
                    <p className="text-white/60 text-sm">В подарок при покупке</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">Бонусные месяца</span>
                    <p className="text-white/60 text-sm">В подарок при продлении</p>
                  </div>
                </div>
              </div>

              <div className="p-4 glass-dark rounded-xl">
                <p className="text-white/80">
                  Кроме этих систем мы являемся партнерами еще у <span className="text-accent font-semibold">40 различных систем</span> автоматизации и маркетинга. 
                  Поэтому обращайтесь к своему ДПРу при подключении.
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

export default SubPartner;
