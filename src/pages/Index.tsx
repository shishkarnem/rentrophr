import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import VacancySection from '@/components/sections/VacancySection';

const Index = () => {
  const handleNavigate = (section: string) => {
    console.log('Navigate to:', section);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={handleNavigate} />
      <main>
        <HeroSection />
        <VacancySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
