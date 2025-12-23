import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, Users, GraduationCap, Scale, TrendingUp, Handshake, FolderKanban, Settings, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const departments = [
  { name: 'Отдел Обучения и Найма', icon: GraduationCap },
  { name: 'Юридический отдел', icon: Scale },
  { name: 'Отдел продаж', icon: TrendingUp },
  { name: 'Партнерский отдел', icon: Handshake },
  { name: 'Проектный отдел', icon: FolderKanban },
  { name: 'Технический отдел', icon: Settings },
  { name: 'Отдел маркетинга', icon: Megaphone },
];

const Employees = () => {
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
              <span className="text-gradient-gold">Сотрудники</span>
            </h1>
            
            <CardGlassDark className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </span>
                Структура компании
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {departments.map((dept, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 glass-dark rounded-xl">
                    <dept.icon className="w-6 h-6 text-accent flex-shrink-0" />
                    <span className="text-white font-medium">{dept.name}</span>
                  </div>
                ))}
              </div>
            </CardGlassDark>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Employees;
