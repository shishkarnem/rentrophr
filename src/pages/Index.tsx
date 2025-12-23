import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import VideoSection from '@/components/sections/VideoSection';
import VacancySection from '@/components/sections/VacancySection';

const Index = () => {
  const handleNavigate = (section: string) => {
    console.log('Navigate to:', section);
  };

  return (
    <div className="min-h-screen hero-gradient">
      <Header onNavigate={handleNavigate} />
      <main>
        <HeroSection />
        <VideoSection />
        <VacancySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
