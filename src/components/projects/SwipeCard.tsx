import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ExternalLink, User, Users, MapPin, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardGlassDark } from '@/components/ui/card';
import { Project } from '@/hooks/useProjects';
import { SwipeAction } from '@/hooks/useProjectSwipes';
import { useLanguage } from '@/contexts/LanguageContext';

interface SwipeCardProps {
  project: Project;
  onSwipe: (action: SwipeAction) => void;
  isTop: boolean;
}

const SwipeCard = ({ project, onSwipe, isTop }: SwipeCardProps) => {
  const { t } = useLanguage();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateZ = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacity = useTransform(
    x,
    [-200, -100, 0, 100, 200],
    [0.5, 1, 1, 1, 0.5]
  );

  // Overlay opacity based on swipe direction
  const likeOpacity = useTransform(y, [-150, -50, 0], [1, 0.5, 0]);
  const respondOpacity = useTransform(x, [0, 50, 150], [0, 0.5, 1]);
  const passOpacity = useTransform(x, [-150, -50, 0], [1, 0.5, 0]);
  const skipOpacity = useTransform(y, [0, 50, 150], [0, 0.5, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    const { offset } = info;

    // Determine swipe direction
    if (offset.y < -threshold && Math.abs(offset.y) > Math.abs(offset.x)) {
      onSwipe('like');
    } else if (offset.x > threshold && Math.abs(offset.x) > Math.abs(offset.y)) {
      onSwipe('respond');
    } else if (offset.x < -threshold && Math.abs(offset.x) > Math.abs(offset.y)) {
      onSwipe('pass');
    } else if (offset.y > threshold && Math.abs(offset.y) > Math.abs(offset.x)) {
      onSwipe('skip');
    }
  };

  // Parse description to extract key info
  const parseDescription = (desc: string | null) => {
    if (!desc) return { title: '', details: '' };
    const lines = desc.split('\n');
    const title = lines[0]?.replace('Проект:', '').trim() || '';
    const details = lines.slice(1).join('\n').trim();
    return { title, details };
  };

  const { title, details } = parseDescription(project.description);

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, y, rotateZ, opacity, zIndex: isTop ? 10 : 1 }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02 }}
    >
      <CardGlassDark className="h-full p-6 overflow-hidden relative">
        {/* Swipe indicators */}
        <motion.div
          className="absolute top-4 left-1/2 -translate-x-1/2 bg-accent/90 text-primary px-6 py-2 rounded-full font-bold text-lg z-20"
          style={{ opacity: likeOpacity }}
        >
          ⭐ {t('projects.swipe.like') || 'В закладки'}
        </motion.div>
        
        <motion.div
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-green-500/90 text-white px-6 py-2 rounded-full font-bold text-lg z-20"
          style={{ opacity: respondOpacity }}
        >
          ✅ {t('projects.swipe.respond') || 'Откликнуться'}
        </motion.div>
        
        <motion.div
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-red-500/90 text-white px-6 py-2 rounded-full font-bold text-lg z-20"
          style={{ opacity: passOpacity }}
        >
          ❌ {t('projects.swipe.pass') || 'Не подходит'}
        </motion.div>
        
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white/20 text-white px-6 py-2 rounded-full font-bold text-lg z-20"
          style={{ opacity: skipOpacity }}
        >
          ⏭️ {t('projects.swipe.skip') || 'Пропустить'}
        </motion.div>

        {/* Card content */}
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-accent/70 text-sm mb-1">
              <Briefcase className="w-4 h-4" />
              <span>#{project.project_code}</span>
              {project.project_status && (
                <span className="bg-accent/20 text-accent px-2 py-0.5 rounded-full text-xs">
                  {project.project_status}
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            {project.region && (
              <div className="flex items-center gap-1 text-white/60 text-sm mt-1">
                <MapPin className="w-3 h-3" />
                {project.region}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="flex-1 overflow-y-auto mb-4 pr-2 scrollbar-thin">
            <p className="text-white/80 text-sm whitespace-pre-line leading-relaxed">
              {details}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
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
                  onClick={(e) => e.stopPropagation()}
                >
                  <User className="w-4 h-4 mr-2" />
                  {t('projects.manager') || 'Менеджер'}
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
                  onClick={(e) => e.stopPropagation()}
                >
                  <Users className="w-4 h-4 mr-2" />
                  {t('projects.dpr') || 'ДПР'}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardGlassDark>
    </motion.div>
  );
};

export default SwipeCard;
