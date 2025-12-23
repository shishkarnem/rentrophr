import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CardGlassDark } from '@/components/ui/card';
import { ArrowLeft, Users, GraduationCap, Scale, TrendingUp, Handshake, FolderKanban, Settings, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

const Employees = () => {
  const { t } = useLanguage();

  const departments = [
    { nameKey: 'employees.trainingDept', icon: GraduationCap },
    { nameKey: 'employees.legalDept', icon: Scale },
    { nameKey: 'employees.salesDept', icon: TrendingUp },
    { nameKey: 'employees.partnerDept', icon: Handshake },
    { nameKey: 'employees.projectDept', icon: FolderKanban },
    { nameKey: 'employees.techDept', icon: Settings },
    { nameKey: 'employees.marketingDept', icon: Megaphone },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      x: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
    }
  };

  return (
    <div className="min-h-screen hero-gradient">
      <Header onNavigate={() => {}} />
      <PageTransition>
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link to="/work" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" />
                {t('work.backToWork')}
              </Link>
            </motion.div>
            
            <div className="max-w-4xl mx-auto">
              <motion.h1 
                className="text-4xl sm:text-5xl font-black text-white mb-8"
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <span className="text-gradient-gold">{t('employees.title')}</span>
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <CardGlassDark className="p-8">
                  <motion.h2 
                    className="text-2xl font-bold text-white mb-6 flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <motion.span 
                      className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <Users className="w-5 h-5 text-primary" />
                    </motion.span>
                    {t('employees.structure')}
                  </motion.h2>
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {departments.map((dept, i) => (
                      <motion.div 
                        key={i} 
                        className="flex items-center gap-4 p-4 glass-dark rounded-xl"
                        variants={itemVariants}
                        whileHover={{ 
                          scale: 1.02, 
                          x: 5,
                          transition: { type: 'spring', stiffness: 400 }
                        }}
                      >
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <dept.icon className="w-6 h-6 text-accent flex-shrink-0" />
                        </motion.div>
                        <span className="text-white font-medium">{t(dept.nameKey)}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardGlassDark>
              </motion.div>
            </div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default Employees;
