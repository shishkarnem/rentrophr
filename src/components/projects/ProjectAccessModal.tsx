import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Check, ChevronRight, GraduationCap, FileText, Video, Bot, ClipboardList, Handshake, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProgressStage } from '@/hooks/useProjectAccess';

interface ProjectAccessModalProps {
  open: boolean;
  onClose: () => void;
  progressStages: ProgressStage[];
  completedCount: number;
  totalCount: number;
  progressPercent: number;
}

const stageIcons: Record<string, typeof Check> = {
  interview: MessageSquare,
  test_conditions: ClipboardList,
  test_portal: GraduationCap,
  test_report: FileText,
  test_robot: Bot,
  contract_signing: Handshake,
  video_card: Video,
};

const ProjectAccessModal = ({
  open,
  onClose,
  progressStages,
  completedCount,
  totalCount,
  progressPercent,
}: ProjectAccessModalProps) => {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-primary/95 border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-accent" />
            </div>
            {t('projects.accessDenied') || 'Доступ ограничен'}
          </DialogTitle>
          <DialogDescription className="text-white/70 pt-2">
            {t('projects.completeStages') || 'Для подбора проектов необходимо пройти Интервью и Обучение.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                {t('projects.progress') || 'Прогресс'}
              </span>
              <span className="text-accent font-medium">
                {completedCount} / {totalCount}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {/* Stages list */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {progressStages.map((stage, index) => {
              const Icon = stageIcons[stage.key] || Check;
              return (
                <motion.div
                  key={stage.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {stage.path ? (
                    <Link to={stage.path} onClick={onClose}>
                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          stage.completed
                            ? 'bg-green-500/10 border border-green-500/20'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            stage.completed
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-white/10 text-white/60'
                          }`}
                        >
                          {stage.completed ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                        </div>
                        <span
                          className={`flex-1 text-sm ${
                            stage.completed ? 'text-green-400' : 'text-white'
                          }`}
                        >
                          {t(stage.labelKey) || stage.label}
                        </span>
                        {!stage.completed && (
                          <ChevronRight className="w-4 h-4 text-white/40" />
                        )}
                      </div>
                    </Link>
                  ) : (
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        stage.completed
                          ? 'bg-green-500/10 border border-green-500/20'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          stage.completed
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {stage.completed ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      <span
                        className={`flex-1 text-sm ${
                          stage.completed ? 'text-green-400' : 'text-white'
                        }`}
                      >
                        {t(stage.labelKey) || stage.label}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Action button */}
          <div className="pt-4 border-t border-white/10">
            <Button variant="gold" className="w-full" asChild>
              <Link to="/training" onClick={onClose}>
                <GraduationCap className="w-4 h-4 mr-2" />
                {t('projects.goToTraining') || 'Перейти к обучению'}
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectAccessModal;
