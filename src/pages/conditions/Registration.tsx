import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, FileCheck, Download, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Registration = () => {
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
              <span className="text-gradient-gold">Оформление</span>
            </h1>
            
            <div className="space-y-8">
              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-primary" />
                  </span>
                  Условия договора
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>
                    Договор заключается на реквизиты России или Казахстана. 
                    Заключается как для самозанятых физ.лиц, так и для ИП.
                  </p>
                  <p>
                    Налоговая нагрузка в таком формате распределяется поровну, половину компенсирует компания.
                  </p>
                  <div className="p-4 glass-dark rounded-xl">
                    <p className="font-semibold text-white mb-2">
                      Также мы можем заключить договор с физ.лицом по ТК.
                    </p>
                    <p>Тогда налоговую нагрузку вы оплачиваете самостоятельно:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="flex gap-2">
                        <span className="text-accent">•</span>
                        26% — Казахстан
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent">•</span>
                        43% — Россия
                      </li>
                    </ul>
                  </div>
                </div>
              </CardGlassDark>

              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Download className="w-5 h-5 text-primary" />
                  </span>
                  Скачать договора
                </h2>
                <div className="space-y-4">
                  <div className="p-4 glass-dark rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="w-5 h-5 text-accent" />
                      <span className="font-semibold text-white">Казахстан</span>
                    </div>
                    <a 
                      href="https://docs.google.com/document/d/1xZ4DUBOOdOegt4UTHmMP1oe9ZsC23ZoRjrHTFqlPyLw/export?format=pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-accent hover:underline"
                    >
                      <Download className="w-4 h-4" />
                      Договор для ИП (Казахстан)
                    </a>
                  </div>

                  <div className="p-4 glass-dark rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="w-5 h-5 text-accent" />
                      <span className="font-semibold text-white">Россия</span>
                    </div>
                    <div className="space-y-2">
                      <a 
                        href="https://docs.google.com/document/d/10ipPClfoTGD30UdkrFvI4hnxSuWctTCB5w5sUvIe07w/export?format=pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-accent hover:underline"
                      >
                        <Download className="w-4 h-4" />
                        Договор для самозанятых
                      </a>
                      <a 
                        href="https://docs.google.com/document/d/1kxVKx4tsJiyqbdFnq_n3iGJcoxKvzMasSV6w5b4OIpo/export?format=pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-accent hover:underline"
                      >
                        <Download className="w-4 h-4" />
                        Договор для ИП
                      </a>
                    </div>
                  </div>
                </div>
              </CardGlassDark>

              <CardGlassDark className="p-8">
                <h2 className="text-xl font-bold mb-4 text-white">Порядок оформления:</h2>
                <ul className="space-y-3 text-white/70">
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">1.</span>
                    Ознакомиться с договором
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">2.</span>
                    Подписание договора происходит до момента выхода эксперта на проект
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">3.</span>
                    На этапе обучения необходимо ознакомиться с документом
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">4.</span>
                    Договор скачать, подписать и отправить сотруднику, который проводил собеседование
                  </li>
                </ul>
              </CardGlassDark>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Registration;
