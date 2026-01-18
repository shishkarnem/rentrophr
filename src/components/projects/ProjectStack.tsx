import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, History, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SwipeCard from './SwipeCard';
import SwipeHints from './SwipeHints';
import SwipeControls from './SwipeControls';
import { Project } from '@/hooks/useProjects';
import { useProjectSwipes, SwipeAction } from '@/hooks/useProjectSwipes';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectStackProps {
  projects: Project[];
  isLoading: boolean;
}

const ProjectStack = ({ projects, isLoading }: ProjectStackProps) => {
  const { t } = useLanguage();
  const { addSwipe, hasSwipedProject, swipeHistory, clearHistory } = useProjectSwipes();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [exitDirection, setExitDirection] = useState<{ x: number; y: number } | null>(null);

  // Filter out already swiped projects
  const availableProjects = useMemo(() => {
    return projects.filter(p => !hasSwipedProject(p.id));
  }, [projects, hasSwipedProject]);

  // Reset index when projects change
  useEffect(() => {
    setCurrentIndex(0);
  }, [availableProjects.length]);

  // Check if hints were shown before
  useEffect(() => {
    const hintsShown = localStorage.getItem('project_swipe_hints_shown');
    if (!hintsShown && availableProjects.length > 0) {
      setShowHints(true);
      localStorage.setItem('project_swipe_hints_shown', 'true');
    }
  }, [availableProjects.length]);

  const currentProject = availableProjects[currentIndex];
  const nextProject = availableProjects[currentIndex + 1];

  const handleSwipe = (action: SwipeAction) => {
    if (!currentProject) return;

    // Set exit direction for animation
    const directions: Record<SwipeAction, { x: number; y: number }> = {
      like: { x: 0, y: -500 },
      respond: { x: 500, y: 0 },
      pass: { x: -500, y: 0 },
      skip: { x: 0, y: 500 },
    };
    setExitDirection(directions[action]);

    // Add to history
    addSwipe(currentProject.id, currentProject.project_code, action);

    // Move to next after animation
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setExitDirection(null);
    }, 200);
  };

  const handleReset = () => {
    clearHistory();
    setCurrentIndex(0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw className="w-8 h-8 text-accent" />
        </motion.div>
      </div>
    );
  }

  if (availableProjects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-[500px] text-center px-6"
      >
        <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-6">
          <History className="w-10 h-10 text-accent" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          {t('projects.noMore') || 'Проекты закончились'}
        </h3>
        <p className="text-white/60 mb-6">
          {swipeHistory.length > 0 
            ? (t('projects.viewHistory') || 'Посмотрите историю свайпов или сбросьте')
            : (t('projects.noProjects') || 'Нет доступных проектов')
          }
        </p>
        <div className="flex gap-3">
          {swipeHistory.length > 0 && (
            <>
              <Button variant="gold" asChild>
                <Link to="/projects/history">
                  <History className="w-4 h-4 mr-2" />
                  {t('projects.historyBtn') || 'История'}
                </Link>
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('projects.reset') || 'Сбросить'}
              </Button>
            </>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-white/60 text-sm">
          {currentIndex + 1} / {availableProjects.length}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHints(true)}
            className="text-white/60 hover:text-accent"
          >
            <HelpCircle className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-white/60 hover:text-accent"
          >
            <Link to="/projects/history">
              <History className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Card stack */}
      <div className="relative h-[500px] w-full max-w-md mx-auto">
        <AnimatePresence>
          {/* Background card (next one) */}
          {nextProject && (
            <motion.div
              key={nextProject.id + '-bg'}
              initial={{ scale: 0.95, opacity: 0.5 }}
              animate={{ scale: 0.95, opacity: 0.5 }}
              className="absolute inset-0"
            >
              <SwipeCard
                project={nextProject}
                onSwipe={() => {}}
                isTop={false}
              />
            </motion.div>
          )}

          {/* Current card */}
          {currentProject && (
            <motion.div
              key={currentProject.id}
              initial={{ scale: 1, x: 0, y: 0 }}
              animate={{ scale: 1, x: 0, y: 0 }}
              exit={exitDirection ? { 
                x: exitDirection.x, 
                y: exitDirection.y, 
                opacity: 0,
                transition: { duration: 0.2 }
              } : undefined}
              className="absolute inset-0"
            >
              <SwipeCard
                project={currentProject}
                onSwipe={handleSwipe}
                isTop={true}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hints overlay */}
        <SwipeHints show={showHints} onClose={() => setShowHints(false)} />
      </div>

      {/* Controls */}
      <SwipeControls onSwipe={handleSwipe} disabled={!currentProject} />
    </div>
  );
};

export default ProjectStack;
