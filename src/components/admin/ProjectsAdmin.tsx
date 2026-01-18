import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Search, ExternalLink, Users, Loader2, RefreshCw, ChevronRight, ThumbsUp, MessageCircle, X as XIcon, Eye } from 'lucide-react';
import { useSyncProjects } from '@/hooks/useSyncProjects';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

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
  swipe_counts?: {
    like: number;
    respond: number;
    pass: number;
    skip: number;
  };
}

interface SwipeCount {
  project_id: string;
  action: string;
  count: number;
}

const STATUS_OPTIONS = ['Все', 'Подбор РОПа', 'В работе', 'Закрыт', 'Пауза'];

const ProjectsAdmin = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Все');
  
  const { isSyncing, syncNow, formatLastSyncTime, canSync } = useSyncProjects();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      
      // Load projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects_data')
        .select('*')
        .order('updated_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Load swipe counts
      const { data: swipesData, error: swipesError } = await supabase
        .from('project_swipes')
        .select('project_id, action');

      if (swipesError) throw swipesError;

      // Calculate swipe counts per project
      const swipeCounts: Record<string, { like: number; respond: number; pass: number; skip: number }> = {};
      swipesData?.forEach((swipe) => {
        if (!swipeCounts[swipe.project_id]) {
          swipeCounts[swipe.project_id] = { like: 0, respond: 0, pass: 0, skip: 0 };
        }
        const action = swipe.action as 'like' | 'respond' | 'pass' | 'skip';
        if (action in swipeCounts[swipe.project_id]) {
          swipeCounts[swipe.project_id][action] += 1;
        }
      });

      // Merge counts with projects
      const projectsWithCounts: Project[] = (projectsData || []).map((project) => ({
        ...project,
        swipe_counts: swipeCounts[project.id] || { like: 0, respond: 0, pass: 0, skip: 0 },
      }));

      setProjects(projectsWithCounts);
    } catch (err) {
      console.error('Error loading projects:', err);
      toast.error('Ошибка загрузки проектов');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    const result = await syncNow(false);
    if (result.success) {
      toast.success(result.message);
      await loadProjects();
    } else {
      toast.error(result.message);
    }
  };

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    if (statusFilter && statusFilter !== 'Все') {
      filtered = filtered.filter(p => p.project_status === statusFilter);
    }

    if (searchQuery && searchQuery.length >= 2) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.project_code?.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery) ||
        p.region?.toLowerCase().includes(lowerQuery) ||
        p.project_manager?.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered;
  }, [projects, statusFilter, searchQuery]);

  const totalSwipes = useMemo(() => {
    return filteredProjects.reduce((acc, p) => ({
      like: acc.like + (p.swipe_counts?.like || 0),
      respond: acc.respond + (p.swipe_counts?.respond || 0),
      pass: acc.pass + (p.swipe_counts?.pass || 0),
      skip: acc.skip + (p.swipe_counts?.skip || 0),
    }), { like: 0, respond: 0, pass: 0, skip: 0 });
  }, [filteredProjects]);

  const getProjectTitle = (description: string | null) => {
    if (!description) return '—';
    const firstLine = description.split('\n')[0];
    return firstLine.replace(/^Проект:\s*/i, '').trim() || '—';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-dark rounded-xl p-4">
          <p className="text-white/50 text-xs">Всего проектов</p>
          <p className="text-2xl font-bold text-white">{filteredProjects.length}</p>
        </div>
        <div className="glass-dark rounded-xl p-4">
          <p className="text-white/50 text-xs flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" /> Понравилось
          </p>
          <p className="text-2xl font-bold text-green-400">{totalSwipes.like}</p>
        </div>
        <div className="glass-dark rounded-xl p-4">
          <p className="text-white/50 text-xs flex items-center gap-1">
            <MessageCircle className="w-3 h-3" /> Откликов
          </p>
          <p className="text-2xl font-bold text-accent">{totalSwipes.respond}</p>
        </div>
        <div className="glass-dark rounded-xl p-4">
          <p className="text-white/50 text-xs flex items-center gap-1">
            <XIcon className="w-3 h-3" /> Пропущено
          </p>
          <p className="text-2xl font-bold text-red-400">{totalSwipes.pass}</p>
        </div>
        <div className="glass-dark rounded-xl p-4">
          <p className="text-white/50 text-xs flex items-center gap-1">
            <Eye className="w-3 h-3" /> Скрыто
          </p>
          <p className="text-2xl font-bold text-white/50">{totalSwipes.skip}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-dark rounded-2xl p-4 space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по коду, названию, региону..."
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-primary border-white/10">
              {STATUS_OPTIONS.map(status => (
                <SelectItem key={status} value={status} className="text-white hover:bg-white/10">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleSync}
            disabled={isSyncing || !canSync}
            variant="outline"
            className={`bg-white/5 border-white/10 ${
              isSyncing || !canSync ? 'text-white/30' : 'text-accent'
            }`}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Обновление...' : (formatLastSyncTime() || 'Обновить')}
          </Button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="glass-dark rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/70">Код</TableHead>
                <TableHead className="text-white/70">Название</TableHead>
                <TableHead className="text-white/70">Регион</TableHead>
                <TableHead className="text-white/70">Статус</TableHead>
                <TableHead className="text-white/70 text-center">👍</TableHead>
                <TableHead className="text-white/70 text-center">💬</TableHead>
                <TableHead className="text-white/70 text-center">👎</TableHead>
                <TableHead className="text-white/70"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow
                  key={project.id}
                  className="border-white/10 hover:bg-white/5 cursor-pointer"
                  onClick={() => navigate(`/projects/${project.project_code}`)}
                >
                  <TableCell className="text-white font-medium">{project.project_code}</TableCell>
                  <TableCell className="text-white/80 max-w-[250px] truncate">
                    {getProjectTitle(project.description)}
                  </TableCell>
                  <TableCell className="text-white/60 max-w-[150px] truncate">
                    {project.region || '—'}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`
                        ${project.project_status === 'В работе' ? 'border-green-500/50 text-green-400' : ''}
                        ${project.project_status === 'Подбор РОПа' ? 'border-accent/50 text-accent' : ''}
                        ${project.project_status === 'Закрыт' ? 'border-white/30 text-white/50' : ''}
                        ${project.project_status === 'Пауза' ? 'border-yellow-500/50 text-yellow-400' : ''}
                      `}
                    >
                      {project.project_status || '—'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-green-400">{project.swipe_counts?.like || 0}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-accent font-medium">{project.swipe_counts?.respond || 0}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-red-400">{project.swipe_counts?.pass || 0}</span>
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  </TableCell>
                </TableRow>
              ))}
              {filteredProjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-white/50 py-8">
                    Проекты не найдены
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProjectsAdmin;
