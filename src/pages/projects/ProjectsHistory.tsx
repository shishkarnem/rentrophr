import { ArrowLeft, Star, Check, X, SkipForward, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MobileLayout from '@/components/layout/MobileLayout';
import PageTransition from '@/components/PageTransition';
import { CardGlassDark } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjectSwipes, SwipeAction, SwipeRecord } from '@/hooks/useProjectSwipes';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';

const actionConfig: Record<SwipeAction, { icon: typeof Star; color: string; label: string }> = {
  like: { icon: Star, color: 'text-accent', label: 'В закладках' },
  respond: { icon: Check, color: 'text-green-400', label: 'Отклики' },
  pass: { icon: X, color: 'text-red-400', label: 'Не подходит' },
  skip: { icon: SkipForward, color: 'text-white/60', label: 'Пропущено' },
};

const HistoryItem = ({ record, onRemove }: { record: SwipeRecord; onRemove: () => void }) => {
  const config = actionConfig[record.action];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout
    >
      <CardGlassDark className="p-4 mb-3" hover>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center ${config.color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-accent/70 text-xs">#{record.projectCode}</span>
            </div>
            <p className="text-white text-sm font-medium truncate">
              {record.description || 'Проект'}
            </p>
            <p className="text-white/40 text-xs mt-1">
              {new Date(record.timestamp).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-white/40 hover:text-red-400 -mr-2"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardGlassDark>
    </motion.div>
  );
};

const ProjectsHistory = () => {
  const { t } = useLanguage();
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;
  const { swipeHistory, getSwipesByAction, removeSwipe, clearHistory } = useProjectSwipes();

  const tabs: SwipeAction[] = ['like', 'respond', 'pass', 'skip'];

  return (
    <div className="min-h-screen hero-gradient">
      <MobileLayout>
        <PageTransition>
          <main className={showMobileNav ? "pt-32 pb-24" : "pt-24 pb-16"}>
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-between mb-8"
              >
                <Link to="/conditions/projects" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  {t('projects.backToProjects') || 'К проектам'}
                </Link>
                {swipeHistory.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('projects.clearAll') || 'Очистить'}
                  </Button>
                )}
              </motion.div>
              
              <div className="max-w-md mx-auto">
                <motion.h1 
                  className="text-3xl font-black text-white mb-6 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="text-gradient-gold">{t('projects.history') || 'История'}</span>
                </motion.h1>

                {swipeHistory.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <p className="text-white/60">
                      {t('projects.noHistory') || 'История пуста'}
                    </p>
                  </motion.div>
                ) : (
                  <Tabs defaultValue="like" className="w-full">
                    <TabsList className="w-full grid grid-cols-4 mb-6 bg-white/5">
                      {tabs.map((action) => {
                        const config = actionConfig[action];
                        const Icon = config.icon;
                        const count = getSwipesByAction(action).length;
                        return (
                          <TabsTrigger
                            key={action}
                            value={action}
                            className={`flex flex-col gap-1 py-3 data-[state=active]:${config.color}`}
                          >
                            <Icon className={`w-4 h-4 ${config.color}`} />
                            <span className="text-xs">{count}</span>
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>

                    {tabs.map((action) => (
                      <TabsContent key={action} value={action} className="mt-0">
                        {getSwipesByAction(action).length === 0 ? (
                          <p className="text-white/40 text-center py-8">
                            {t('projects.noItemsInCategory') || 'Пусто'}
                          </p>
                        ) : (
                          getSwipesByAction(action)
                            .sort((a, b) => b.timestamp - a.timestamp)
                            .map((record) => (
                              <HistoryItem
                                key={record.projectId}
                                record={record}
                                onRemove={() => removeSwipe(record.projectId)}
                              />
                            ))
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
              </div>
            </div>
          </main>
        </PageTransition>
      </MobileLayout>
    </div>
  );
};

export default ProjectsHistory;
