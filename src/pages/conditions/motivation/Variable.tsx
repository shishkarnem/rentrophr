import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, Percent, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import tariffTable from '@/assets/tariff-table.jpg';
import motivationTable from '@/assets/motivation-table.jpg';
import DownloadButton from '@/components/ui/DownloadButton';

const Variable = () => {
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
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl sm:text-5xl font-black text-white">
                <span className="text-gradient-gold">Переменка</span>
              </h1>
              <DownloadButton filename="variable" title="Переменка - РентРОП" />
            </div>
            
            <CardGlassDark className="p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Percent className="w-5 h-5 text-primary" />
                  </span>
                  Переменная премия
                </h2>
                <p className="text-white/80 leading-relaxed">
                  Переменная премия — это оплата Эксперту за результат. Результатом отдела продаж является выручка. 
                  Поэтому премия начисляется исходя из выручки отдела.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Как рассчитывается?
                </h3>
                <div className="space-y-4">
                  <div className="p-4 glass-dark rounded-xl">
                    <p className="text-white/80">
                      Премия, как правило, рассчитывается в первый месяц работы силами Эксперта.
                    </p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <p className="text-white/80">
                      Согласовывается с клиентом и составляется дополнительное приложение к договору.
                    </p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <p className="text-white/80">
                      Обычно берется исходя из планов на месяц, объема выручки, в виде процента или фиксированной выплаты.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 gradient-gold rounded-2xl text-center">
                <p className="text-sm font-semibold text-primary/70 mb-1">Премия начисляется</p>
                <p className="text-xl font-black text-primary">Исходя из размера выручки отдела</p>
              </div>

              {/* Таблицы */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Расчёт мотивации</h3>
                <div className="space-y-4">
                  <a href={motivationTable} target="_blank" rel="noopener noreferrer" className="block">
                    <img src={motivationTable} alt="Таблица мотивации" className="w-full rounded-xl border border-white/10 hover:border-accent/50 transition-colors cursor-pointer" />
                  </a>
                  <a href={tariffTable} target="_blank" rel="noopener noreferrer" className="block">
                    <img src={tariffTable} alt="Тарифная сетка" className="w-full rounded-xl border border-white/10 hover:border-accent/50 transition-colors cursor-pointer" />
                  </a>
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

export default Variable;
