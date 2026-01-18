import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin, User, Users, ExternalLink, RefreshCw, Star, Check, X, SkipForward, Calendar, ChevronUp, ChevronRight, ChevronLeft, ChevronDown, Eye, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MobileLayout from '@/components/layout/MobileLayout';
import PageTransition from '@/components/PageTransition';
import { CardGlassDark } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTelegram } from '@/contexts/TelegramContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { SwipeAction } from '@/hooks/useProjectSwipes';

interface Project {
  id: string;
  project_code: string;
  region: string | null;
  description: string | null;
  project_manager: string | null;
  dpr: string | null;
  project_status: string | null;
  availability: string | null;
  manager_link: string | null;
  dpr_link: string | null;
  created_at: string;
  updated_at: string;
}

interface SwipeWithProfile {
  id: string;
  telegram_id: number;
  action: SwipeAction;
  created_at: string;
  updated_at: string;
  profile?: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    photo_url: string | null;
  };
  crm?: {
    photo_link: string | null;
    full_info: string | null;
    level: string | null;
    status: string | null;
    city: string | null;
    region: string | null;
  };
}

const actionConfig: Record<SwipeAction, { icon: typeof Star; directionIcon: typeof ChevronUp; color: string; bgColor: string; label: string }> = {
  like: { icon: Star, directionIcon: ChevronUp, color: 'text-accent', bgColor: 'bg-accent/20', label: 'В закладках' },
  respond: { icon: Check, directionIcon: ChevronRight, color: 'text-green-400', bgColor: 'bg-green-400/20', label: 'Откликнулись' },
  pass: { icon: X, directionIcon: ChevronLeft, color: 'text-red-400', bgColor: 'bg-red-400/20', label: 'Отказались' },
  skip: { icon: SkipForward, directionIcon: ChevronDown, color: 'text-white/60', bgColor: 'bg-white/10', label: 'Пропустили' },
};

const ProjectDetail = () => {
  const { projectCode } = useParams<{ projectCode: string }>();
  const { t, language } = useLanguage();
  const { isTelegram } = useTelegram();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;

  const [project, setProject] = useState<Project | null>(null);
  const [swipes, setSwipes] = useState<SwipeWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadProjectData = async () => {
    if (!projectCode) return;

    setIsRefreshing(true);
    try {
      // Load project by project_code
      const { data: projectData, error: projectError } = await supabase
        .from('projects_data')
        .select('*')
        .eq('project_code', projectCode)
        .maybeSingle();

      if (projectError) {
        console.error('Error loading project:', projectError);
        return;
      }

      setProject(projectData);

      if (projectData) {
        // Load swipes for this project
        const { data: swipesData, error: swipesError } = await supabase
          .from('project_swipes')
          .select('*')
          .eq('project_id', projectData.id)
          .order('created_at', { ascending: false });

        if (swipesError) {
          console.error('Error loading swipes:', swipesError);
          return;
        }

        // Load profiles and CRM data for each swipe
        const swipesWithProfiles: SwipeWithProfile[] = await Promise.all(
          (swipesData || []).map(async (swipe) => {
            // Get telegram profile
            const { data: profileData } = await supabase
              .from('telegram_profiles')
              .select('first_name, last_name, username, photo_url')
              .eq('telegram_id', swipe.telegram_id)
              .maybeSingle();

            // Get CRM data
            const { data: crmData } = await supabase
              .from('crm_data')
              .select('photo_link, full_info, level, status, city, region')
              .eq('telegram_id', swipe.telegram_id)
              .maybeSingle();

            return {
              id: swipe.id,
              telegram_id: swipe.telegram_id,
              action: swipe.action as SwipeAction,
              created_at: swipe.created_at,
              updated_at: swipe.updated_at,
              profile: profileData || undefined,
              crm: crmData || undefined,
            };
          })
        );

        setSwipes(swipesWithProfiles);
      }
    } catch (err) {
      console.error('Error loading project data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [projectCode]);

  const parseDescription = (desc: string | null) => {
    if (!desc) return { title: '', details: '' };
    const lines = desc.split('\n');
    const title = lines[0]?.replace('Проект:', '').trim() || '';
    const details = lines.slice(1).join('\n').trim();
    return { title, details };
  };

  const getSwipesByAction = (action: SwipeAction) => {
    return swipes.filter(s => s.action === action);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(language === 'ru' ? 'ru-RU' : language === 'kz' ? 'kk-KZ' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const { title, details } = project ? parseDescription(project.description) : { title: '', details: '' };
  const tabs: SwipeAction[] = ['respond', 'like', 'pass', 'skip'];

  if (isLoading) {
    return (
      <div className="min-h-screen hero-gradient">
        <MobileLayout>
          <PageTransition>
            <main className={showMobileNav ? "pt-32 pb-24" : "pt-24 pb-16"}>
              <div className="container mx-auto px-6">
                <div className="max-w-2xl mx-auto space-y-6">
                  <Skeleton className="h-8 w-48 bg-white/10" />
                  <Skeleton className="h-40 w-full bg-white/10 rounded-2xl" />
                  <Skeleton className="h-64 w-full bg-white/10 rounded-2xl" />
                </div>
              </div>
            </main>
          </PageTransition>
        </MobileLayout>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen hero-gradient">
        <MobileLayout>
          <PageTransition>
            <main className={showMobileNav ? "pt-32 pb-24" : "pt-24 pb-16"}>
              <div className="container mx-auto px-6 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md mx-auto"
                >
                  <Briefcase className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-white mb-2">Проект не найден</h1>
                  <p className="text-white/60 mb-6">Проект с кодом #{projectCode} не существует</p>
                  <Link to="/projects">
                    <Button variant="gold">К проектам</Button>
                  </Link>
                </motion.div>
              </div>
            </main>
          </PageTransition>
        </MobileLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient">
      <MobileLayout>
        <PageTransition>
          <main className={showMobileNav ? "pt-32 pb-24" : "pt-24 pb-16"}>
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between mb-6"
              >
                <Link to="/projects/history" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  История откликов
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadProjectData}
                  disabled={isRefreshing}
                  className="text-white/60 hover:text-white"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Обновить
                </Button>
              </motion.div>

              <div className="max-w-2xl mx-auto space-y-6">
                {/* Project Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CardGlassDark className="p-6">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
                        <Briefcase className="w-7 h-7 text-accent" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Hash className="w-4 h-4 text-accent/70" />
                          <span className="text-accent font-mono text-lg">{project.project_code}</span>
                        </div>
                        <h1 className="text-xl font-bold text-white">
                          {title || `Проект #${project.project_code}`}
                        </h1>
                        {project.region && (
                          <div className="flex items-center gap-1 text-white/60 text-sm mt-1">
                            <MapPin className="w-3 h-3" />
                            {project.region}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.project_status && (
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                          {project.project_status}
                        </span>
                      )}
                      {project.availability && (
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          project.availability === 'Ok' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {project.availability === 'Ok' ? 'Доступен' : project.availability}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {details && (
                      <div className="bg-white/5 rounded-lg p-4 mb-4">
                        <p className="text-white/80 text-sm whitespace-pre-line leading-relaxed">
                          {details}
                        </p>
                      </div>
                    )}

                    {/* Team */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {project.project_manager && (
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-white/40 text-xs mb-1">Менеджер</p>
                          <p className="text-white font-medium">{project.project_manager}</p>
                        </div>
                      )}
                      {project.dpr && (
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-white/40 text-xs mb-1">ДПР</p>
                          <p className="text-white font-medium">{project.dpr}</p>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    {(project.manager_link || project.dpr_link) && (
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
                              Менеджер
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
                              ДПР
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Timestamps */}
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4 text-white/40 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Создан: {formatDate(project.created_at)}
                      </div>
                    </div>
                  </CardGlassDark>
                </motion.div>

                {/* Swipes History */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <CardGlassDark className="p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-accent" />
                      История откликов
                      <span className="text-white/40 text-sm font-normal">({swipes.length})</span>
                    </h2>

                    {swipes.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-white/60">Пока никто не откликался на этот проект</p>
                      </div>
                    ) : (
                      <Tabs defaultValue="respond" className="w-full">
                        <TabsList className="w-full grid grid-cols-4 mb-4 bg-white/5">
                          {tabs.map((action) => {
                            const config = actionConfig[action];
                            const Icon = config.icon;
                            const DirectionIcon = config.directionIcon;
                            const count = getSwipesByAction(action).length;
                            return (
                              <TabsTrigger
                                key={action}
                                value={action}
                                className={`flex flex-col gap-1 py-2 data-[state=active]:${config.color}`}
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
                                <p className="text-white/40 text-center py-6">
                                  Нет откликов в этой категории
                                </p>
                              ) : (
                                <div className="space-y-3">
                                  {getSwipesByAction(action).map((swipe) => (
                                    <SwipeUserCard key={swipe.id} swipe={swipe} formatDate={formatDate} />
                                  ))}
                                </div>
                              )}
                            </TabsContent>
                          ))}
                        </AnimatePresence>
                      </Tabs>
                    )}
                  </CardGlassDark>
                </motion.div>
              </div>
            </div>
          </main>
        </PageTransition>
      </MobileLayout>
    </div>
  );
};

interface SwipeUserCardProps {
  swipe: SwipeWithProfile;
  formatDate: (date: string) => string;
}

const SwipeUserCard = ({ swipe, formatDate }: SwipeUserCardProps) => {
  const config = actionConfig[swipe.action];
  const Icon = config.icon;
  const DirectionIcon = config.directionIcon;

  const displayName = swipe.profile
    ? `${swipe.profile.first_name || ''} ${swipe.profile.last_name || ''}`.trim() || swipe.profile.username || `ID: ${swipe.telegram_id}`
    : `ID: ${swipe.telegram_id}`;

  const avatarUrl = swipe.crm?.photo_link || swipe.profile?.photo_url;
  const level = swipe.crm?.level;
  const status = swipe.crm?.status;
  const location = swipe.crm?.city || swipe.crm?.region;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      layout
    >
      <Link to={`/${swipe.telegram_id}`}>
        <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-4 cursor-pointer">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <Avatar className="w-12 h-12 ring-2 ring-white/10">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={displayName} />
              ) : null}
              <AvatarFallback className="bg-accent/20 text-accent">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{displayName}</p>
              <div className="flex items-center gap-2 text-white/60 text-xs mt-0.5">
                {level && <span className="px-1.5 py-0.5 rounded bg-accent/20 text-accent">{level}</span>}
                {status && <span>{status}</span>}
                {location && (
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" />
                    {location}
                  </span>
                )}
              </div>
            </div>

            {/* Action badge */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${config.bgColor}`}>
              <Icon className={`w-3 h-3 ${config.color}`} />
              <DirectionIcon className={`w-2.5 h-2.5 ${config.color}`} />
            </div>
          </div>

          {/* Timestamp */}
          <p className="text-white/40 text-xs mt-2 pl-15">
            {formatDate(swipe.created_at)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectDetail;
