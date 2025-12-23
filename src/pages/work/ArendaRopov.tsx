import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, DollarSign, Percent, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ArendaRopov = () => {
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
              Аренда <span className="text-gradient-gold">РОПов</span>
            </h1>
            
            <div className="space-y-8">
              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </span>
                  Продукт
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p className="text-lg font-semibold text-white">
                    Основной продукт — Аренда Руководителей Отделов Продаж.
                  </p>
                  <p>
                    Мы обучаем специалистов и сдаем в Аренду. Специалист работает в нашем штате, 
                    но выполняет обязанности РОПа у заказчика. Работает удаленно.
                  </p>
                </div>
              </CardGlassDark>

              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </span>
                  Оплата труда
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>За работу РОП получает зарплату состоящую из двух частей:</p>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">1.</span>
                      <div>
                        <Link to="/conditions/motivation" className="text-accent hover:underline font-semibold">Фиксированная премия</Link> — оклад за работу.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">2.</span>
                      <div>
                        <Link to="/conditions/motivation" className="text-accent hover:underline font-semibold">Переменная премия</Link> — оплата за результат по итогу месяца.
                      </div>
                    </li>
                  </ul>
                </div>
              </CardGlassDark>

              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Percent className="w-5 h-5 text-primary" />
                  </span>
                  Переменная часть
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>
                    Переменная часть на каждом проекте индивидуальна, как правило это процент с выручки отдела.
                  </p>
                  <p>
                    Размер также изменчив, зависит от сезонности, условий, продукта, региона.
                  </p>
                  <p>
                    Наша компания помогает РОПу в процессе работы и гарантирует качество выполненных работ, 
                    за это берет комиссию.
                  </p>
                  <p className="mt-4">
                    Более подробно о наших услугах можно прочитать на сайте{' '}
                    <a href="https://rentrop.top" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      rentrop.top
                    </a>
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

export default ArendaRopov;
