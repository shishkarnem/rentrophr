import { CardGlassDark } from '@/components/ui/card';
import { Target, CheckCircle2, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const VacancySection = () => {
  const { t } = useLanguage();

  const responsibilities = [
    t('vacancy.resp1'),
    t('vacancy.resp2'),
    t('vacancy.resp3'),
    t('vacancy.resp4'),
    t('vacancy.resp5'),
    t('vacancy.resp6'),
  ];

  const requirements = [
    t('vacancy.req1'),
    t('vacancy.req2'),
    t('vacancy.req3'),
    t('vacancy.req4'),
    t('vacancy.req5'),
  ];

  const benefits = [
    t('vacancy.ben1'),
    t('vacancy.ben2'),
    t('vacancy.ben3'),
    t('vacancy.ben4'),
    t('vacancy.ben5'),
  ];

  return (
    <section id="vacancy" className="py-24 hero-gradient">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="mb-16 text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
              {t('vacancy.title')}
            </h2>
            <div className="h-1 w-24 gradient-gold mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content - left side */}
            <div className="lg:col-span-2 space-y-8">
              {/* Responsibilities */}
              <CardGlassDark className="p-10">
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </span>
                  {t('vacancy.yourTasks')}
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {responsibilities.map((item, i) => (
                    <li key={i} className="flex gap-4 text-white/70 text-sm leading-relaxed group">
                      <div className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardGlassDark>

              {/* Requirements */}
              <CardGlassDark className="p-10">
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </span>
                  {t('vacancy.whatWeExpect')}
                </h3>
                <ul className="space-y-4">
                  {requirements.map((item, i) => (
                    <li key={i} className="flex gap-4 text-white/70 text-sm leading-relaxed group">
                      <div className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardGlassDark>
            </div>

            {/* Sidebar - right side */}
            <div className="space-y-8">
              {/* Benefits card */}
              <CardGlassDark className="p-8 sticky top-28">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-cta flex items-center justify-center">
                    <Gift className="w-5 h-5 text-white" />
                  </span>
                  {t('vacancy.whatYouGet')}
                </h3>
                <ul className="space-y-4">
                  {benefits.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed group">
                      <span className="text-accent font-bold">✓</span>
                      <span className="text-white/70">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Salary highlight */}
                <div className="mt-8 p-6 gradient-gold rounded-2xl text-center">
                  <p className="text-sm font-semibold text-primary/70 mb-1">{t('vacancy.salary')}</p>
                  <p className="text-2xl font-black text-primary">{t('vacancy.salaryValue')}</p>
                </div>
              </CardGlassDark>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VacancySection;
