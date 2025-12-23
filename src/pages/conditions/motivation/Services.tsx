import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, Settings, Users, Wallet, FileText, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
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
              <span className="text-gradient-gold">Услуги</span>
            </h1>
            
            <CardGlassDark className="p-8 space-y-8">
              <div className="p-6 gradient-gold rounded-2xl text-center">
                <p className="text-2xl font-black text-primary">ОФИЦИАЛЬНАЯ ПОДРАБОТКА!</p>
                <p className="text-primary/80 mt-2">Для всех сотрудников нашей компании мы добавляем дополнительную возможность заработать</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Settings className="w-5 h-5 text-primary" />
                  </span>
                  Какие услуги?
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {['Найм', 'Автоматизация', 'Скрипты', 'Бухгалтерия', 'Другие услуги, согласно опыту и навыкам'].map((service, i) => (
                    <div key={i} className="p-4 glass-dark rounded-xl">
                      <span className="font-semibold text-white">{i + 1}. {service}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Users className="w-5 h-5 text-accent" />
                  Кому?
                </h3>
                <div className="grid gap-3">
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">1. Новым клиентам</span>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">2. Действующим клиентам</span>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="font-semibold text-white">3. Помощь РОПам на проектах</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-accent" />
                  За чей счёт?
                </h3>
                <div className="grid gap-3">
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="text-white/80">1. Клиент оплатит по новому договору</span>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="text-white/80">2. Клиент доплатит по текущему договору</span>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <span className="text-white/80">3. РОП поделится своей зарплатой</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-accent" />
                  Как согласовывается цена?
                </h3>
                <div className="space-y-3">
                  <div className="p-4 glass-dark rounded-xl">
                    <p className="text-white/80">
                      1. Каждый сам себе поставит стоимость часа <span className="text-accent font-semibold">500-10000 руб</span> за ту или иную услугу. 
                      Но без фанатизма. Помните, что среди коллег есть конкуренты. Вы сами строите себе прайс.
                    </p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <p className="text-white/80">2. Совместно просчитаем смету и объем работ</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <p className="text-white/80">3. КП → Знакомство → Счет → Оплата → Акт</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Сколько платим?</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-4 glass-dark rounded-xl">
                    <p className="text-white/80">Если услуга LTV — по вашему текущему договору</p>
                  </div>
                  <div className="p-4 glass-dark rounded-xl">
                    <p className="text-white/80">Если услуга одноразовая — <span className="text-accent font-semibold">30%</span> от стоимости договора</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Star className="w-5 h-5 text-accent" />
                  З.Ы.
                </h3>
                <div className="p-4 glass-dark rounded-xl">
                  <p className="text-white/80">
                    Если ваша услуга будет получать положительные отзывы (5 успешных кейсов за 3 месяца), 
                    то мы ее добавим на все наши рекламные ресурсы, как основную.
                  </p>
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

export default Services;
