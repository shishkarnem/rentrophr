import { useLanguage } from '@/contexts/LanguageContext';

const VideoSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 hero-gradient">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="mb-10 text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              {t('video.greeting')}
            </h2>
            <div className="h-1 w-24 gradient-gold mx-auto rounded-full" />
          </div>

          {/* Video embed */}
          <div 
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsla(207, 52%, 20%, 0.5) 0%, hsla(207, 52%, 33%, 0.5) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
            <div className="aspect-video">
              <iframe
                src="https://www.youtube.com/embed/HbNCWEUkqDY"
                title="РентРОП Приветствие"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-3xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
