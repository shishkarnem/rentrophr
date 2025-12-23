import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, DollarSign, Percent, Handshake, Settings, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const motivationItems = [
  { name: 'Фикс', description: 'Фиксированная часть зарплаты — оклад за работу', icon: DollarSign, path: '/conditions/motivation/fix' },
  { name: 'Переменка', description: 'Оплата за результат по итогу месяца, процент с выручки отдела', icon: Percent, path: '/conditions/motivation/variable' },
  { name: 'Партнерка', description: 'Партнерские бонусы за привлечение клиентов', icon: Handshake, path: '/conditions/motivation/partner' },
  { name: 'Услуги', description: 'Дополнительный заработок на консалтинговых услугах', icon: Settings, path: '/conditions/motivation/services' },
  { name: 'Суб.партнерка', description: 'Бонусы за привлечение новых специалистов', icon: Users, path: '/conditions/motivation/subpartner' },
];

const Motivation = () => {
  return (
    <div className="min-h-screen hero-gradient">
      <Header onNavigate={() => {}} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/conditions" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Назад к разделу Условия
          </Link>
          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-8">
              <span className="text-gradient-gold">Мотивация</span>
            </h1>
            
            <CardGlassDark className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </span>
                Система оплаты труда
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {motivationItems.map((item, i) => (
                  <Link 
                    key={i} 
                    to={item.path}
                    className="p-4 glass-dark rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-accent" />
                        <span className="font-semibold text-white">{item.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-accent transition-colors" />
                    </div>
                    <p className="text-white/60 text-sm">{item.description}</p>
                  </Link>
                ))}
              </div>
              
              <div className="mt-8 p-6 gradient-gold rounded-2xl text-center">
                <p className="text-sm font-semibold text-primary/70 mb-1">Общий доход</p>
                <p className="text-2xl font-black text-primary">от 150 000 до 450 000 ₽</p>
              </div>
            </CardGlassDark>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Motivation;
