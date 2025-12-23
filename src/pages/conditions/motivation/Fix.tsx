import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, DollarSign, Clock, MapPin, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const Fix = () => {
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
              <span className="text-gradient-gold">Фикс</span>
            </h1>
            
            <CardGlassDark className="p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </span>
                  Фиксированная премия
                </h2>
                <p className="text-white/80 leading-relaxed">
                  Фиксированная премия начисляется ежемесячно. По сути, это является окладом за выход на работу. 
                  Факт выхода на работу подтверждается <Link to="/work/reports" className="text-accent hover:underline">отчетом за день</Link>.
                </p>
                <p className="text-white/80 leading-relaxed mt-4">
                  Размер премии зависит от времени работы на проекте: <span className="text-accent font-semibold">40-55% от тарифа</span>.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-accent" />
                  Форматы работы
                </h3>
                <div className="grid gap-3">
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">Онлайн</span>
                    <p className="text-white/60 text-sm">Полностью удаленно</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">Оффлайн</span>
                    <p className="text-white/60 text-sm">Обязательно присутствие на территории клиента</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">Комбинированный</span>
                    <p className="text-white/60 text-sm">Периодическое появление на территории клиента</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-accent" />
                  Занятость
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">4 часа</span>
                    <p className="text-white/60 text-sm">Неполная занятость (90% проектов). Можно брать 2 проекта в работу.</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">8 часов</span>
                    <p className="text-white/60 text-sm">Полная занятость (10% проектов)</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Типы тарифов</h3>
                <div className="grid gap-3">
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-accent">Вход</span>
                    <p className="text-white/60 text-sm">Только входящий трафик заявок</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-accent">Холод</span>
                    <p className="text-white/60 text-sm">Присутствует привлечение клиентов через прозвон баз</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-accent">С нуля</span>
                    <p className="text-white/60 text-sm">Первый месяц работы или нужно выстроить под ключ отдел продаж</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-accent" />
                  Регионы
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">Международ.</span>
                    <p className="text-white/60 text-sm">Страны мира</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">РФ</span>
                    <p className="text-white/60 text-sm">Российская Федерация</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">СНГ</span>
                    <p className="text-white/60 text-sm">Бывшие страны СНГ</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">КЗ</span>
                    <p className="text-white/60 text-sm">Казахстан</p>
                  </div>
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

export default Fix;
