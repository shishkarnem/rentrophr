import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import VacancySection from '@/components/sections/VacancySection';
import AIChatSection from '@/components/sections/AIChatSection';
import ApplicationSection from '@/components/sections/ApplicationSection';

const Index = () => {
  const handleNavigate = (section: string) => {
    console.log('Navigate to:', section);
    // Could implement page navigation here
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={handleNavigate} />
      <main>
        <HeroSection />
        <VacancySection />
        <AIChatSection />
        <ApplicationSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
