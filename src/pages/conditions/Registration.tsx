import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, FileCheck, Download, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Registration = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen hero-gradient">
      <Header onNavigate={() => {}} />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/conditions" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            {t('conditions.backToConditions')}
          </Link>
          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-8">
              <span className="text-gradient-gold">{t('registration.title')}</span>
            </h1>
            
            <div className="space-y-8">
              <CardGlassDark className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-primary" />
                  </span>
                  {t('registration.contractTerms')}
                </h2>
                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>{t('registration.contractDesc1')}</p>
                  <p>{t('registration.contractDesc2')}</p>
                  <div className="p-4 glass-dark rounded-xl">
                    <p className="font-semibold text-white mb-2">{t('registration.tkContract')}</p>
                    <p>{t('registration.tkContractDesc')}</p>
                    <ul className="mt-2 space-y-1">
                      <li className="flex gap-2">
                        <span className="text-accent">•</span>
                        26% — {t('registration.kzTax')}
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent">•</span>
                        43% — {t('registration.rfTax')}
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
                  {t('registration.downloadContracts')}
                </h2>
                <div className="space-y-4">
                  <div className="p-4 glass-dark rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="w-5 h-5 text-accent" />
                      <span className="font-semibold text-white">{t('registration.kzTax')}</span>
                    </div>
                    <a 
                      href="https://docs.google.com/document/d/1xZ4DUBOOdOegt4UTHmMP1oe9ZsC23ZoRjrHTFqlPyLw/export?format=pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-accent hover:underline"
                    >
                      <Download className="w-4 h-4" />
                      {t('registration.contractKzIp')}
                    </a>
                  </div>

                  <div className="p-4 glass-dark rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="w-5 h-5 text-accent" />
                      <span className="font-semibold text-white">{t('registration.rfTax')}</span>
                    </div>
                    <div className="space-y-2">
                      <a 
                        href="https://docs.google.com/document/d/10ipPClfoTGD30UdkrFvI4hnxSuWctTCB5w5sUvIe07w/export?format=pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-accent hover:underline"
                      >
                        <Download className="w-4 h-4" />
                        {t('registration.contractRfSz')}
                      </a>
                      <a 
                        href="https://docs.google.com/document/d/1kxVKx4tsJiyqbdFnq_n3iGJcoxKvzMasSV6w5b4OIpo/export?format=pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-accent hover:underline"
                      >
                        <Download className="w-4 h-4" />
                        {t('registration.contractRfIp')}
                      </a>
                    </div>
                  </div>
                </div>
              </CardGlassDark>

              <CardGlassDark className="p-8">
                <h2 className="text-xl font-bold mb-4 text-white">{t('registration.procedure')}</h2>
                <ul className="space-y-3 text-white/70">
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">1.</span>
                    {t('registration.step1')}
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">2.</span>
                    {t('registration.step2')}
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">3.</span>
                    {t('registration.step3')}
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent font-bold">4.</span>
                    {t('registration.step4')}
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
