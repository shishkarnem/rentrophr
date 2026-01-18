import { useState } from 'react';
import { ArrowLeft, Star, Check, X, SkipForward, Trash2, RefreshCcw, ChevronUp, ChevronRight, ChevronLeft, ChevronDown, Briefcase, ExternalLink, User, Users, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MobileLayout from '@/components/layout/MobileLayout';
import PageTransition from '@/components/PageTransition';
import { CardGlassDark } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProjectSwipes, SwipeAction, SwipeRecord } from '@/hooks/useProjectSwipes';
import { useProjects, Project } from '@/hooks/useProjects';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';

const actionConfig: Record<SwipeAction, { icon: typeof Star; directionIcon: typeof ChevronUp; color: string; bgColor: string; labelKey: string }> = {
  like: { icon: Star, directionIcon: ChevronUp, color: 'text-accent', bgColor: 'bg-accent/20', labelKey: 'projects.action.like' },
  respond: { icon: Check, directionIcon: ChevronRight, color: 'text-green-400', bgColor: 'bg-green-400/20', labelKey: 'projects.action.respond' },
  pass: { icon: X, directionIcon: ChevronLeft, color: 'text-red-400', bgColor: 'bg-red-400/20', labelKey: 'projects.action.pass' },
  skip: { icon: SkipForward, directionIcon: ChevronDown, color: 'text-white/60', bgColor: 'bg-white/10', labelKey: 'projects.action.skip' },
};

interface ProjectDetailModalProps {
  record: SwipeRecord | null;
  project: Project | null;
  onClose: () => void;
  onChangeAction: (action: SwipeAction) => void;
}

const ProjectDetailModal = ({ record, project, onClose, onChangeAction }: ProjectDetailModalProps) => {
  const { t } = useLanguage();
  
  if (!record) return null;

  const config = actionConfig[record.action];
  const ActionIcon = config.icon;
  const DirectionIcon = config.directionIcon;

  // Parse description to extract key info
  const parseDescription = (desc: string | null) => {
    if (!desc) return { title: '', details: '' };
    const lines = desc.split('\n');
    const title = lines[0]?.replace('Проект:', '').trim() || '';
    const details = lines.slice(1).join('\n').trim();
    return { title, details };
  };

  const { title, details } = parseDescription(project?.description || null);

  const handleActionChange = (action: SwipeAction) => {
    onChangeAction(action);
  };

  return (
    <Dialog open={!!record} onOpenChange={onClose}>
      <DialogContent className="bg-primary/95 border-white/10 max-w-md max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Briefcase className="w-5 h-5 text-accent" />
            <span>#{record.projectCode}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
          {/* Current status badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor}`}>
            <ActionIcon className={`w-4 h-4 ${config.color}`} />
            <DirectionIcon className={`w-3 h-3 ${config.color}`} />
            <span className={`text-sm font-medium ${config.color}`}>
              {t(config.labelKey)}
            </span>
          </div>

          {/* Title and region */}
          <div>
            <h3 className="text-xl font-bold text-white">{title || `${t('projects.project')} #${record.projectCode}`}</h3>
            {project?.region && (
              <div className="flex items-center gap-1 text-white/60 text-sm mt-1">
                <MapPin className="w-3 h-3" />
                {project.region}
              </div>
            )}
          </div>

          {/* Description */}
          {details && (
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/80 text-sm whitespace-pre-line leading-relaxed">
                {details}
              </p>
            </div>
          )}

          {/* Manager and DPR buttons */}
          {(project?.manager_link || project?.dpr_link) && (
            <div className="flex gap-3">
              {project.manager_link && (
                <Button
                  variant="gold"
                  size="sm"
                  className="flex-1"
                  asChild
                >
                  <a
                    href={project.manager_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {t('projects.manager')}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              )}
              {project.dpr_link && (
                <Button
                  variant="gold"
                  size="sm"
                  className="flex-1"
                  asChild
                >
                  <a
                    href={project.dpr_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {t('projects.dpr')}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              )}
            </div>
          )}

          {/* Change decision section */}
          <div className="border-t border-white/10 pt-4">
            <p className="text-white/60 text-sm mb-3">{t('projects.changeDecision')}</p>
            <div className="grid grid-cols-4 gap-2">
              {(['like', 'respond', 'pass', 'skip'] as SwipeAction[]).map((action) => {
                const actionCfg = actionConfig[action];
                const Icon = actionCfg.icon;
                const isActive = record.action === action;
                return (
                  <Button
                    key={action}
                    variant="ghost"
                    size="sm"
                    className={`flex flex-col gap-1 h-auto py-3 ${isActive ? actionCfg.bgColor : 'bg-white/5'} ${isActive ? actionCfg.color : 'text-white/60'} hover:${actionCfg.bgColor}`}
                    onClick={() => handleActionChange(action)}
                    disabled={isActive}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px]">{t(actionCfg.labelKey)}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Timestamp */}
          <p className="text-white/40 text-xs">
            {new Date(record.timestamp).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface HistoryItemProps {
  record: SwipeRecord;
  projectTitle?: string;
  onRemove: () => void;
  onClick: () => void;
}

const HistoryItem = ({ record, projectTitle, onRemove, onClick }: HistoryItemProps) => {
  const { t } = useLanguage();
  const config = actionConfig[record.action];
  const Icon = config.icon;
  const DirectionIcon = config.directionIcon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout
    >
      <CardGlassDark 
        className="p-4 mb-3 cursor-pointer" 
        hover
        onClick={onClick}
      >
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center ${config.color} relative`}>
            <Icon className="w-5 h-5" />
            <DirectionIcon className="w-3 h-3 absolute -bottom-0.5 -right-0.5 bg-primary rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-accent/70 text-xs">#{record.projectCode}</span>
            </div>
            <p className="text-white text-sm font-medium truncate">
              {projectTitle || `${t('projects.project')} #${record.projectCode}`}
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
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
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
  const { swipeHistory, getSwipesByAction, removeSwipe, clearHistory, addSwipe } = useProjectSwipes();
  const { data: projects = [] } = useProjects();
  const [selectedRecord, setSelectedRecord] = useState<SwipeRecord | null>(null);

  const tabs: SwipeAction[] = ['like', 'respond', 'pass', 'skip'];

  // Helper to get project by ID
  const getProject = (projectId: string) => {
    return projects.find(p => p.id === projectId) || null;
  };

  const getProjectTitle = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project?.description) return null;
    return project.description.split('\n')[0]?.replace('Проект:', '').trim() || null;
  };

  const handleChangeAction = async (action: SwipeAction) => {
    if (!selectedRecord) return;
    await addSwipe(selectedRecord.projectId, selectedRecord.projectCode, action);
    // Update selected record with new action
    setSelectedRecord(prev => prev ? { ...prev, action, timestamp: new Date().toISOString() } : null);
  };

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
                <Link to="/projects" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  {t('projects.backToSwipe')}
                </Link>
                {swipeHistory.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('projects.clearAll')}
                  </Button>
                )}
              </motion.div>
              
              <div className="max-w-md mx-auto">
                <motion.h1 
                  className="text-3xl font-black text-white mb-6 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="text-gradient-gold">{t('projects.history')}</span>
                </motion.h1>

                {/* Restart swipes button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6"
                >
                  <Link to="/projects">
                    <Button
                      variant="gold"
                      className="w-full py-6 rounded-2xl"
                    >
                      <RefreshCcw className="w-5 h-5 mr-2" />
                      {t('projects.restartSwipes')}
                    </Button>
                  </Link>
                </motion.div>

                {swipeHistory.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <p className="text-white/60">
                      {t('projects.noHistory')}
                    </p>
                  </motion.div>
                ) : (
                  <Tabs defaultValue="like" className="w-full">
                    <TabsList className="w-full grid grid-cols-4 mb-6 bg-white/5">
                      {tabs.map((action) => {
                        const config = actionConfig[action];
                        const Icon = config.icon;
                        const DirectionIcon = config.directionIcon;
                        const count = getSwipesByAction(action).length;
                        return (
                          <TabsTrigger
                            key={action}
                            value={action}
                            className={`flex flex-col gap-1 py-3 data-[state=active]:${config.color}`}
                          >
                            <div className="flex items-center gap-0.5">
                              <Icon className={`w-4 h-4 ${config.color}`} />
                              <DirectionIcon className={`w-3 h-3 ${config.color} opacity-60`} />
                            </div>
                            <span className="text-xs">{count}</span>
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>

                    <AnimatePresence mode="wait">
                      {tabs.map((action) => (
                        <TabsContent key={action} value={action} className="mt-0">
                          {getSwipesByAction(action).length === 0 ? (
                            <p className="text-white/40 text-center py-8">
                              {t('projects.noItemsInCategory')}
                            </p>
                          ) : (
                            getSwipesByAction(action)
                              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                              .map((record) => (
                                <HistoryItem
                                  key={record.projectId}
                                  record={record}
                                  projectTitle={getProjectTitle(record.projectId) || undefined}
                                  onRemove={() => removeSwipe(record.projectId)}
                                  onClick={() => setSelectedRecord(record)}
                                />
                              ))
                          )}
                        </TabsContent>
                      ))}
                    </AnimatePresence>
                  </Tabs>
                )}
              </div>
            </div>
          </main>
        </PageTransition>
      </MobileLayout>

      {/* Project detail modal */}
      <ProjectDetailModal
        record={selectedRecord}
        project={selectedRecord ? getProject(selectedRecord.projectId) : null}
        onClose={() => setSelectedRecord(null)}
        onChangeAction={handleChangeAction}
      />
    </div>
  );
};

export default ProjectsHistory;
