import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlass } from '@/components/ui/card';
import { ArrowLeft, DollarSign, Percent, Handshake, Settings, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const motivationItems = [
  { name: 'Фикс', description: 'Фиксированная часть зарплаты — оклад за работу', icon: DollarSign },
  { name: 'Переменка', description: 'Оплата за результат по итогу месяца, процент с выручки отдела', icon: Percent },
  { name: 'Партнерка', description: 'Партнерские бонусы за привлечение клиентов', icon: Handshake },
  { name: 'Услуги', description: 'Дополнительный заработок на консалтинговых услугах', icon: Settings },
  { name: 'Суб.партнерка', description: 'Бонусы за привлечение новых специалистов', icon: Users },
];

const Motivation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={() => {}} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/conditions" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Назад к разделу Условия
          </Link>
          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-8">
              <span className="text-gradient-gold">Мотивация</span>
            </h1>
            
            <CardGlass className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </span>
                Система оплаты труда
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {motivationItems.map((item, i) => (
                  <div key={i} className="p-4 glass rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <item.icon className="w-5 h-5 text-accent" />
                      <span className="font-semibold text-foreground">{item.name}</span>
                    </div>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 gradient-gold rounded-2xl text-center">
                <p className="text-sm font-semibold text-primary/70 mb-1">Общий доход</p>
                <p className="text-2xl font-black text-primary">от 150 000 до 450 000 ₽</p>
              </div>
            </CardGlass>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Motivation;
