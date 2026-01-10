import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Sparkles, User, X, ChevronDown, ChevronUp, Loader2, Settings2, BarChart3, Download, Eye, EyeOff, ArrowUpDown, RefreshCw } from 'lucide-react';
import { useTelegram } from '@/contexts/TelegramContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCrmData, CrmData } from '@/hooks/useCrmData';
import { useSyncCrm } from '@/hooks/useSyncCrm';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import MobileNavbar from '@/components/MobileNavbar';
import MobileHeader from '@/components/MobileHeader';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';

// Allowed statuses for admin access
const ADMIN_STATUSES = ['ДПР', 'HR', 'Чат или канал', 'Менеджер'];

// All status options from database
const STATUS_OPTIONS = [
  'Все',
  'HR', 'ДПР', 'Дубль', 'Заблокировано', 'Запись Портфолио', 'Интервью',
  'Менеджер', 'На паузе', 'Не на связи', 'Ожидает проект', 'Отказ',
  'Подготовка документов', 'Работает', 'Тест Отчет', 'Тест Портал',
  'Тест Робот', 'Тест Условия', 'Уволен(а)', 'Хочет вернуться',
  'Чат или канал', 'Черный список'
];

// All available columns with labels
const ALL_COLUMNS: { key: keyof CrmData; label: string; defaultVisible: boolean }[] = [
  { key: 'telegram_name', label: 'Имя Telegram', defaultVisible: true },
  { key: 'full_info', label: 'ФИО', defaultVisible: false },
  { key: 'code', label: 'Код', defaultVisible: true },
  { key: 'status', label: 'Статус', defaultVisible: true },
  { key: 'hr', label: 'HR', defaultVisible: true },
  { key: 'city', label: 'Город', defaultVisible: true },
  { key: 'region', label: 'Регион', defaultVisible: false },
  { key: 'rop_name', label: 'РОП', defaultVisible: false },
  { key: 'rating', label: 'Рейтинг', defaultVisible: false },
  { key: 'result', label: 'Результат', defaultVisible: false },
  { key: 'phone', label: 'Телефон', defaultVisible: false },
  { key: 'birth_date', label: 'Дата рождения', defaultVisible: false },
  { key: 'contract_date', label: 'Дата договора', defaultVisible: false },
  { key: 'work_start_date', label: 'Старт работы', defaultVisible: false },
  { key: 'start_date', label: 'Дата добавления', defaultVisible: true },
  { key: 'interview_date', label: 'Дата интервью', defaultVisible: false },
  { key: 'dismissal_date', label: 'Увольнение', defaultVisible: false },
  { key: 'rejection_date', label: 'Дата отказа', defaultVisible: false },
  { key: 'feedback_date', label: 'Дата обратной связи', defaultVisible: false },
  { key: 'days_worked', label: 'Дней работы', defaultVisible: false },
  { key: 'tests_passed', label: 'Тесты', defaultVisible: false },
  { key: 'waiting_period', label: 'Ожидание', defaultVisible: false },
  { key: 'training_completed', label: 'Обучение', defaultVisible: false },
  { key: 'available_skills', label: 'Навыки', defaultVisible: false },
  { key: 'language_choice', label: 'Язык', defaultVisible: false },
  { key: 'interview', label: 'Интервью', defaultVisible: false },
  { key: 'telegram_id', label: 'Telegram ID', defaultVisible: false },
  { key: 'created_at', label: 'Создано', defaultVisible: false },
  { key: 'updated_at', label: 'Обновлено', defaultVisible: false },
];

// Page size options - including "all" option
const PAGE_SIZE_OPTIONS = [25, 50, 100, 250, 500, 1000, -1]; // -1 means all

const AdminCRM = () => {
  const navigate = useNavigate();
  const { isTelegram, profile } = useTelegram();
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;
  
  const telegramId = profile?.telegram_id ? Number(profile.telegram_id) : null;
  const { crmData: currentUserCrm, isLoading: isUserLoading } = useCrmData(telegramId);
  
  // Sync functionality
  const { isSyncing, syncNow, formatLastSyncTime, canSync } = useSyncCrm();
  
  // Handle manual sync with data reload
  const loadAllRecords = useCallback(async () => {
    try {
      setIsLoadingAll(true);
      
      const { count, error: countError } = await supabase
        .from('crm_data')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      console.log('[AdminCRM] Total records in DB:', count);
      
      const allData: CrmData[] = [];
      const batchSize = 1000;
      const totalBatches = Math.ceil((count || 0) / batchSize);
      
      for (let i = 0; i < totalBatches; i++) {
        const { data, error } = await supabase
          .from('crm_data')
          .select('*')
          .range(i * batchSize, (i + 1) * batchSize - 1)
          .order('start_date', { ascending: false, nullsFirst: false });

        if (error) throw error;
        if (data) allData.push(...(data as CrmData[]));
      }
      
      console.log('[AdminCRM] Loaded records:', allData.length);
      setAllRecords(allData);
      
      // Extract unique values for filters
      const hrs = [...new Set(allData.filter(r => r.hr).map(r => r.hr!) || [])].sort();
      const cities = [...new Set(allData.filter(r => r.city).map(r => r.city!) || [])].sort();
      const regions = [...new Set(allData.filter(r => r.region).map(r => r.region!) || [])].sort();
      const rops = [...new Set(allData.filter(r => r.rop_name).map(r => r.rop_name!) || [])].sort();
      const ratings = [...new Set(allData.filter(r => r.rating).map(r => r.rating!) || [])].sort();
      
      setUniqueHrs(hrs);
      setUniqueCities(cities);
      setUniqueRegions(regions);
      setUniqueRops(rops);
      setUniqueRatings(ratings);
    } catch (err) {
      console.error('Error loading CRM records:', err);
      toast.error(t('admin.loadError') || 'Ошибка загрузки данных');
    } finally {
      setIsLoadingAll(false);
    }
  }, [t]);
  
  const handleSync = async () => {
    const result = await syncNow(false);
    if (result.success) {
      toast.success(`${result.message} (обновлено: ${result.synced || 0})`);
      // Reload all records after sync
      await loadAllRecords();
    } else {
      toast.error(result.message);
    }
  };
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'data' | 'analytics'>('data');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('Все');
  const [hrFilter, setHrFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [ropFilter, setRopFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  
  // Column search states
  const [columnSearches, setColumnSearches] = useState<Record<string, string>>({});
  
  // Data state
  const [selectedProfile, setSelectedProfile] = useState<CrmData | null>(null);
  const [allRecords, setAllRecords] = useState<CrmData[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(true);
  
  // Column visibility - persist to localStorage
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof CrmData>>(() => {
    const saved = localStorage.getItem('admin-crm-visible-columns');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as string[];
        return new Set(parsed as (keyof CrmData)[]);
      } catch {
        // fallback to defaults
      }
    }
    return new Set(ALL_COLUMNS.filter(c => c.defaultVisible).map(c => c.key));
  });
  
  // Pagination - persist to localStorage
  const [pageSize, setPageSize] = useState(() => {
    const saved = localStorage.getItem('admin-crm-page-size');
    return saved ? Number(saved) : 25;
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  // Sorting - persist to localStorage, default by created_at descending (newest first)
  const [sortColumn, setSortColumn] = useState<keyof CrmData | null>(() => {
    const saved = localStorage.getItem('admin-crm-sort-column');
    return saved ? (saved as keyof CrmData) : 'created_at';
  });
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(() => {
    const saved = localStorage.getItem('admin-crm-sort-direction');
    return saved === 'asc' ? 'asc' : 'desc';
  });
  
  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem('admin-crm-visible-columns', JSON.stringify([...visibleColumns]));
  }, [visibleColumns]);
  
  useEffect(() => {
    localStorage.setItem('admin-crm-page-size', String(pageSize));
  }, [pageSize]);
  
  useEffect(() => {
    if (sortColumn) {
      localStorage.setItem('admin-crm-sort-column', sortColumn);
    }
    localStorage.setItem('admin-crm-sort-direction', sortDirection);
  }, [sortColumn, sortDirection]);

  // Check preview mode or admin access
  const isPreview = !isTelegram;
  const hasAdminAccess = isPreview || (currentUserCrm?.status && ADMIN_STATUSES.includes(currentUserCrm.status));

  // Unique values for filters
  const [uniqueHrs, setUniqueHrs] = useState<string[]>([]);
  const [uniqueCities, setUniqueCities] = useState<string[]>([]);
  const [uniqueRegions, setUniqueRegions] = useState<string[]>([]);
  const [uniqueRops, setUniqueRops] = useState<string[]>([]);
  const [uniqueRatings, setUniqueRatings] = useState<string[]>([]);

  // Load ALL CRM records on mount - no limit
  useEffect(() => {
    if (hasAdminAccess) {
      loadAllRecords();
    }
  }, [hasAdminAccess, loadAllRecords]);

  // Filter and sort records
  const filteredRecords = useMemo(() => {
    let filtered = [...allRecords];

    // Apply status filter
    if (statusFilter && statusFilter !== 'Все') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    
    // Apply HR filter
    if (hrFilter) {
      filtered = filtered.filter(r => r.hr === hrFilter);
    }
    
    // Apply city filter
    if (cityFilter) {
      filtered = filtered.filter(r => r.city === cityFilter);
    }
    
    // Apply region filter
    if (regionFilter) {
      filtered = filtered.filter(r => r.region === regionFilter);
    }
    
    // Apply ROP filter
    if (ropFilter) {
      filtered = filtered.filter(r => r.rop_name === ropFilter);
    }
    
    // Apply rating filter
    if (ratingFilter) {
      filtered = filtered.filter(r => r.rating === ratingFilter);
    }

    // Apply global search filter
    if (searchQuery && searchQuery.length >= 2) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(r => {
        return (
          r.telegram_name?.toLowerCase().includes(lowerQuery) ||
          r.full_info?.toLowerCase().includes(lowerQuery) ||
          r.code?.toLowerCase().includes(lowerQuery) ||
          r.telegram_id?.toString().includes(searchQuery) ||
          r.phone?.toLowerCase().includes(lowerQuery) ||
          r.city?.toLowerCase().includes(lowerQuery) ||
          r.region?.toLowerCase().includes(lowerQuery) ||
          r.rop_name?.toLowerCase().includes(lowerQuery) ||
          r.resume_text?.toLowerCase().includes(lowerQuery) ||
          r.checklist_answers?.toLowerCase().includes(lowerQuery)
        );
      });
    }
    
    // Apply column-specific searches
    Object.entries(columnSearches).forEach(([column, search]) => {
      if (search && search.length >= 1) {
        const lowerSearch = search.toLowerCase();
        filtered = filtered.filter(r => {
          const value = r[column as keyof CrmData];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(lowerSearch);
        });
      }
    });

    // Apply sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (aVal === null || aVal === undefined) return sortDirection === 'asc' ? 1 : -1;
        if (bVal === null || bVal === undefined) return sortDirection === 'asc' ? -1 : 1;
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
    }

    return filtered;
  }, [allRecords, statusFilter, hrFilter, cityFilter, regionFilter, ropFilter, ratingFilter, searchQuery, columnSearches, sortColumn, sortDirection]);

  // Paginated records - pageSize -1 means show all
  const paginatedRecords = useMemo(() => {
    if (pageSize === -1) return filteredRecords;
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  const totalPages = pageSize === -1 ? 1 : Math.ceil(filteredRecords.length / pageSize);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, hrFilter, cityFilter, regionFilter, ropFilter, ratingFilter, searchQuery, columnSearches, pageSize]);

  // AI Search function - prioritize resume_text and checklist_answers
  const handleAiSearch = async () => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      toast.error(t('admin.enterSearchQuery') || 'Введите запрос для AI поиска');
      return;
    }

    setIsAiSearching(true);
    setAiSummary(null);

    try {
      const { data, error } = await supabase.functions.invoke('crm-ai-search', {
        body: {
          query: searchQuery,
          filters: {
            status: statusFilter !== 'Все' ? statusFilter : undefined,
            hr: hrFilter || undefined,
            city: cityFilter || undefined,
            region: regionFilter || undefined,
          },
          language,
          priorityFields: ['resume_text', 'checklist_answers'],
        },
      });

      if (error) throw error;

      if (data?.results) {
        setAllRecords(data.results);
      }
      if (data?.aiSummary) {
        setAiSummary(data.aiSummary);
      }
    } catch (err) {
      console.error('AI search error:', err);
      toast.error(t('admin.aiSearchError') || 'Ошибка AI поиска');
    } finally {
      setIsAiSearching(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('Все');
    setHrFilter('');
    setCityFilter('');
    setRegionFilter('');
    setRopFilter('');
    setRatingFilter('');
    setColumnSearches({});
    setAiSummary(null);
    setSortColumn(null);
  };

  const toggleColumn = (column: keyof CrmData) => {
    const newVisible = new Set(visibleColumns);
    if (newVisible.has(column)) {
      newVisible.delete(column);
    } else {
      newVisible.add(column);
    }
    setVisibleColumns(newVisible);
  };

  const handleSort = (column: keyof CrmData) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Analytics data
  const analytics = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    const hrCounts: Record<string, number> = {};
    const regionCounts: Record<string, number> = {};
    let withResume = 0;
    let withChecklist = 0;
    let withPhone = 0;
    
    allRecords.forEach(r => {
      if (r.status) statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
      if (r.city) cityCounts[r.city] = (cityCounts[r.city] || 0) + 1;
      if (r.hr) hrCounts[r.hr] = (hrCounts[r.hr] || 0) + 1;
      if (r.region) regionCounts[r.region] = (regionCounts[r.region] || 0) + 1;
      if (r.resume_text) withResume++;
      if (r.checklist_answers) withChecklist++;
      if (r.phone) withPhone++;
    });

    return {
      total: allRecords.length,
      statusCounts,
      cityCounts,
      hrCounts,
      regionCounts,
      withResume,
      withChecklist,
      withPhone,
    };
  }, [allRecords]);

  // Redirect if no access
  if (!isPreview && isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #17344F 0%, #265582 100%)' }}>
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!hasAdminAccess && !isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #17344F 0%, #265582 100%)' }}>
        <div className="glass-dark rounded-2xl p-8 text-center max-w-md mx-4">
          <h2 className="text-xl font-bold text-white mb-4">{t('admin.accessDenied') || 'Доступ запрещён'}</h2>
          <p className="text-white/70 mb-6">{t('admin.noPermission') || 'У вас нет прав для просмотра этой страницы'}</p>
          <Button onClick={() => navigate('/profile')} className="bg-accent hover:bg-accent/80 text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('admin.backToProfile') || 'Назад в профиль'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative z-10"
      style={{
        background: 'linear-gradient(180deg, #17344F 0%, #265582 100%)'
      }}
    >
      {/* Header */}
      {showMobileNav ? (
        <MobileHeader />
      ) : (
        <div className="glass-dark border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-lg font-semibold text-white">{t('admin.title') || 'Админ-панель CRM'}</h1>
          </div>
        </div>
      )}

      <div className={`container mx-auto px-4 py-6 ${showMobileNav ? 'pt-20 pb-24' : ''}`}>
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'data' | 'analytics')} className="mb-6">
          <TabsList className="bg-white/10 border-white/10">
            <TabsTrigger value="data" className="data-[state=active]:bg-accent data-[state=active]:text-primary">
              <User className="w-4 h-4 mr-2" />
              {t('admin.dataTab') || 'Данные'}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-accent data-[state=active]:text-primary">
              <BarChart3 className="w-4 h-4 mr-2" />
              {t('admin.analyticsTab') || 'Аналитика'}
            </TabsTrigger>
          </TabsList>

          {/* Data Tab */}
          <TabsContent value="data" className="mt-4">
            {/* Search and Filters */}
            <div className="glass-dark rounded-2xl p-4 mb-6 space-y-4">
              {/* Search Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('admin.searchPlaceholder') || 'Поиск по имени, резюме, чек-листу...'}
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                    onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full"
                    >
                      <X className="w-4 h-4 text-white/50" />
                    </button>
                  )}
                </div>
                <Button
                  onClick={handleAiSearch}
                  disabled={isAiSearching}
                  className="bg-accent hover:bg-accent/80 text-primary shrink-0"
                >
                  {isAiSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {t('admin.aiSearch') || 'AI поиск'}
                    </>
                  )}
                </Button>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors px-3 py-1.5 bg-white/5 rounded-lg"
                >
                  <Filter className="w-4 h-4" />
                  {t('admin.filters') || 'Фильтры'}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                
                <button
                  onClick={() => setShowColumnSettings(!showColumnSettings)}
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors px-3 py-1.5 bg-white/5 rounded-lg"
                >
                  <Settings2 className="w-4 h-4" />
                  {t('admin.columns') || 'Колонки'}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showColumnSettings ? 'rotate-180' : ''}`} />
                </button>

                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors px-3 py-1.5 bg-white/5 rounded-lg"
                >
                  <X className="w-4 h-4" />
                  {t('admin.clearFilters') || 'Сбросить'}
                </button>
                
                <button
                  onClick={handleSync}
                  disabled={isSyncing || !canSync}
                  className={`flex items-center gap-2 text-sm transition-colors px-3 py-1.5 rounded-lg ${
                    isSyncing || !canSync 
                      ? 'text-white/30 bg-white/5 cursor-not-allowed' 
                      : 'text-accent bg-accent/10 hover:bg-accent/20'
                  }`}
                  title={canSync ? 'Синхронизировать с Google Sheets' : 'Подождите 5 минут'}
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Обновление...' : (formatLastSyncTime() || 'Обновить')}
                </button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-white/10">
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">{t('admin.statusFilter') || 'Статус'}</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-primary border-white/10 max-h-60">
                        {STATUS_OPTIONS.map(status => (
                          <SelectItem key={status} value={status} className="text-white hover:bg-white/10 text-sm">
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">{t('admin.hrFilter') || 'HR'}</label>
                    <Select value={hrFilter || 'all'} onValueChange={(v) => setHrFilter(v === 'all' ? '' : v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white h-9 text-sm">
                        <SelectValue placeholder="Все" />
                      </SelectTrigger>
                      <SelectContent className="bg-primary border-white/10 max-h-60">
                        <SelectItem value="all" className="text-white hover:bg-white/10 text-sm">Все</SelectItem>
                        {uniqueHrs.map(hr => (
                          <SelectItem key={hr} value={hr} className="text-white hover:bg-white/10 text-sm">
                            {hr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">{t('admin.cityFilter') || 'Город'}</label>
                    <Select value={cityFilter || 'all'} onValueChange={(v) => setCityFilter(v === 'all' ? '' : v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white h-9 text-sm">
                        <SelectValue placeholder="Все" />
                      </SelectTrigger>
                      <SelectContent className="bg-primary border-white/10 max-h-60">
                        <SelectItem value="all" className="text-white hover:bg-white/10 text-sm">Все</SelectItem>
                        {uniqueCities.map(city => (
                          <SelectItem key={city} value={city} className="text-white hover:bg-white/10 text-sm">
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">{t('admin.regionFilter') || 'Регион'}</label>
                    <Select value={regionFilter || 'all'} onValueChange={(v) => setRegionFilter(v === 'all' ? '' : v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white h-9 text-sm">
                        <SelectValue placeholder="Все" />
                      </SelectTrigger>
                      <SelectContent className="bg-primary border-white/10 max-h-60">
                        <SelectItem value="all" className="text-white hover:bg-white/10 text-sm">Все</SelectItem>
                        {uniqueRegions.map(region => (
                          <SelectItem key={region} value={region} className="text-white hover:bg-white/10 text-sm">
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">{t('admin.ropFilter') || 'РОП'}</label>
                    <Select value={ropFilter || 'all'} onValueChange={(v) => setRopFilter(v === 'all' ? '' : v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white h-9 text-sm">
                        <SelectValue placeholder="Все" />
                      </SelectTrigger>
                      <SelectContent className="bg-primary border-white/10 max-h-60">
                        <SelectItem value="all" className="text-white hover:bg-white/10 text-sm">Все</SelectItem>
                        {uniqueRops.map(rop => (
                          <SelectItem key={rop} value={rop} className="text-white hover:bg-white/10 text-sm">
                            {rop}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">{t('admin.ratingFilter') || 'Рейтинг'}</label>
                    <Select value={ratingFilter || 'all'} onValueChange={(v) => setRatingFilter(v === 'all' ? '' : v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white h-9 text-sm">
                        <SelectValue placeholder="Все" />
                      </SelectTrigger>
                      <SelectContent className="bg-primary border-white/10 max-h-60">
                        <SelectItem value="all" className="text-white hover:bg-white/10 text-sm">Все</SelectItem>
                        {uniqueRatings.map(rating => (
                          <SelectItem key={rating} value={rating} className="text-white hover:bg-white/10 text-sm">
                            {rating}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Column Settings Panel */}
              {showColumnSettings && (
                <div className="pt-2 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {ALL_COLUMNS.map(col => (
                      <label
                        key={col.key}
                        className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors px-3 py-1.5 bg-white/5 rounded-lg cursor-pointer"
                      >
                        <Checkbox
                          checked={visibleColumns.has(col.key)}
                          onCheckedChange={() => toggleColumn(col.key)}
                          className="border-white/30 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                        />
                        {col.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Summary */}
              {aiSummary && (
                <div className="p-4 bg-accent/10 rounded-xl border border-accent/30">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-accent mb-1">{t('admin.aiSummary') || 'AI результат'}</p>
                      <p className="text-white/90 text-sm">{aiSummary}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-sm">{t('admin.found') || 'Найдено'}: {filteredRecords.length}</span>
                <span className="text-white/50 text-sm">|</span>
                <span className="text-white/70 text-sm">{t('admin.pageSize') || 'На странице'}:</span>
                <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                  <SelectTrigger className="w-24 bg-white/5 border-white/10 text-white h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-primary border-white/10">
                    {PAGE_SIZE_OPTIONS.map(size => (
                      <SelectItem key={size} value={String(size)} className="text-white hover:bg-white/10 text-sm">
                        {size === -1 ? (t('admin.allRecords') || 'Все') : size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="text-white/70 hover:text-white"
                >
                  ←
                </Button>
                <span className="text-white/70 text-sm">
                  {currentPage} / {totalPages || 1}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="text-white/70 hover:text-white"
                >
                  →
                </Button>
              </div>
            </div>

            {/* Results Table */}
            {isLoadingAll ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : (
              <div className="glass-dark rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        {/* Profile button column - always first */}
                        <TableHead className="text-white/70 w-16 sticky left-0 bg-primary/90">{t('admin.colActions') || ''}</TableHead>
                        
                        {/* Dynamic columns */}
                        {ALL_COLUMNS.filter(c => visibleColumns.has(c.key)).map(col => (
                          <TableHead key={col.key} className="text-white/70">
                            <div className="space-y-1">
                              <button
                                onClick={() => handleSort(col.key)}
                                className="flex items-center gap-1 hover:text-white transition-colors"
                              >
                                {col.label}
                                {sortColumn === col.key ? (
                                  sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                ) : (
                                  <ArrowUpDown className="w-3 h-3 opacity-30" />
                                )}
                              </button>
                              <Input
                                value={columnSearches[col.key] || ''}
                                onChange={(e) => setColumnSearches(prev => ({ ...prev, [col.key]: e.target.value }))}
                                placeholder="..."
                                className="h-6 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/30"
                              />
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedRecords.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={visibleColumns.size + 1} className="text-center text-white/50 py-8">
                            {t('admin.noResults') || 'Нет результатов'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRecords.map((record) => (
                          <TableRow key={record.id} className="border-white/10 hover:bg-white/5">
                            {/* Profile button - always first */}
                            <TableCell className="sticky left-0 bg-primary/90">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedProfile(record)}
                                className="text-accent hover:text-accent/80 hover:bg-white/10 p-1"
                              >
                                <User className="w-4 h-4" />
                              </Button>
                            </TableCell>
                            
                            {/* Dynamic columns */}
                            {ALL_COLUMNS.filter(c => visibleColumns.has(c.key)).map(col => (
                              <TableCell key={col.key} className="text-white/80 text-sm">
                                {col.key === 'status' ? (
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                                    record.status === 'Работает' ? 'bg-green-500/20 text-green-400' :
                                    record.status === 'Ожидает проект' ? 'bg-yellow-500/20 text-yellow-400' :
                                    record.status === 'Уволен(а)' ? 'bg-red-500/20 text-red-400' :
                                    ADMIN_STATUSES.includes(record.status || '') ? 'bg-accent/20 text-accent' :
                                    'bg-white/10 text-white/70'
                                  }`}>
                                    {record[col.key] || '—'}
                                  </span>
                                ) : (
                                  <span className="truncate max-w-[150px] block">{String(record[col.key] ?? '—')}</span>
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-4 space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-dark rounded-xl p-4">
                <p className="text-white/50 text-sm">{t('admin.totalRecords') || 'Всего записей'}</p>
                <p className="text-2xl font-bold text-white">{analytics.total}</p>
              </div>
              <div className="glass-dark rounded-xl p-4">
                <p className="text-white/50 text-sm">{t('admin.withResume') || 'С резюме'}</p>
                <p className="text-2xl font-bold text-accent">{analytics.withResume}</p>
                <p className="text-xs text-white/40">{((analytics.withResume / analytics.total) * 100).toFixed(1)}%</p>
              </div>
              <div className="glass-dark rounded-xl p-4">
                <p className="text-white/50 text-sm">{t('admin.withChecklist') || 'С чек-листом'}</p>
                <p className="text-2xl font-bold text-accent">{analytics.withChecklist}</p>
                <p className="text-xs text-white/40">{((analytics.withChecklist / analytics.total) * 100).toFixed(1)}%</p>
              </div>
              <div className="glass-dark rounded-xl p-4">
                <p className="text-white/50 text-sm">{t('admin.withPhone') || 'С телефоном'}</p>
                <p className="text-2xl font-bold text-accent">{analytics.withPhone}</p>
                <p className="text-xs text-white/40">{((analytics.withPhone / analytics.total) * 100).toFixed(1)}%</p>
              </div>
            </div>

            {/* Status Distribution */}
            <div className="glass-dark rounded-xl p-4">
              <h3 className="text-white font-medium mb-4">{t('admin.statusDistribution') || 'Распределение по статусам'}</h3>
              <div className="space-y-2">
                {Object.entries(analytics.statusCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([status, count]) => (
                    <div key={status} className="flex items-center gap-3">
                      <div className="w-32 text-sm text-white/70 truncate">{status}</div>
                      <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${(count / analytics.total) * 100}%` }}
                        />
                      </div>
                      <div className="w-16 text-right text-sm text-white">{count}</div>
                    </div>
                  ))}
              </div>
            </div>

            {/* HR Distribution */}
            <div className="glass-dark rounded-xl p-4">
              <h3 className="text-white font-medium mb-4">{t('admin.hrDistribution') || 'Распределение по HR'}</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {Object.entries(analytics.hrCounts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 15)
                  .map(([hr, count]) => (
                    <div key={hr} className="flex items-center gap-3">
                      <div className="w-40 text-sm text-white/70 truncate">{hr}</div>
                      <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${(count / Math.max(...Object.values(analytics.hrCounts))) * 100}%` }}
                        />
                      </div>
                      <div className="w-12 text-right text-sm text-white">{count}</div>
                    </div>
                  ))}
              </div>
            </div>

            {/* City Distribution */}
            <div className="glass-dark rounded-xl p-4">
              <h3 className="text-white font-medium mb-4">{t('admin.cityDistribution') || 'Распределение по городам'}</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {Object.entries(analytics.cityCounts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 15)
                  .map(([city, count]) => (
                    <div key={city} className="flex items-center gap-3">
                      <div className="w-40 text-sm text-white/70 truncate">{city}</div>
                      <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(count / Math.max(...Object.values(analytics.cityCounts))) * 100}%` }}
                        />
                      </div>
                      <div className="w-12 text-right text-sm text-white">{count}</div>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Profile Dialog */}
      <ProfileDialog 
        profile={selectedProfile} 
        isOpen={!!selectedProfile} 
        onClose={() => setSelectedProfile(null)} 
      />

      {showMobileNav && <MobileNavbar />}
    </div>
  );
};

// Profile Dialog Component with Photos
const ProfileDialog = ({ 
  profile, 
  isOpen, 
  onClose 
}: { 
  profile: CrmData | null; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const { t } = useLanguage();
  
  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto glass-dark border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5 text-accent" />
            {profile.telegram_name || profile.full_info?.split(',')[0] || t('admin.unknownUser') || 'Пользователь'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Telegram Section */}
          <div className="space-y-3">
            <h4 className="text-accent font-medium text-sm">{t('admin.telegramInfo') || 'Telegram'}</h4>
            <div className="flex items-start gap-4">
              {/* Telegram photo from telegram_profiles table or photo_link */}
              {profile.photo_link && (
                <div className="shrink-0">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                    <img 
                      src={profile.photo_link} 
                      alt="Telegram Photo" 
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex-1 space-y-2">
                <div>
                  <p className="text-white/50 text-xs">Telegram ID</p>
                  <p className="text-white text-sm">{profile.telegram_id || '—'}</p>
                </div>
                
                {/* Telegram link - try to extract username from full_info or telegram_name */}
                {(() => {
                  // Extract username from full_info (format: "@username" or "(@username)")
                  const usernameMatch = profile.full_info?.match(/@(\w+)/) || 
                                        profile.full_info?.match(/\((@?\w+)\)/);
                  const username = usernameMatch ? usernameMatch[1].replace('@', '') : 
                                   (profile.telegram_name?.startsWith('@') ? profile.telegram_name.slice(1) : null);
                  
                  if (username) {
                    return (
                      <div>
                        <p className="text-white/50 text-xs">{t('admin.telegramProfile') || 'Профиль Telegram'}</p>
                        <a 
                          href={`https://t.me/${username}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent/80 text-sm inline-flex items-center gap-1"
                        >
                          @{username}
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    );
                  } else if (profile.telegram_id) {
                    return (
                      <div>
                        <p className="text-white/50 text-xs">{t('admin.telegramProfile') || 'Профиль Telegram'}</p>
                        <a 
                          href={`tg://user?id=${profile.telegram_id}`}
                          className="text-accent hover:text-accent/80 text-sm inline-flex items-center gap-1"
                        >
                          {t('admin.openTelegram') || 'Открыть в Telegram'}
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    );
                  }
                  return null;
                })()}
                
                {profile.telegram_name && (
                  <div>
                    <p className="text-white/50 text-xs">{t('admin.telegramName') || 'Имя в Telegram'}</p>
                    <p className="text-white text-sm">{profile.telegram_name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Resume photo */}
          {profile.resume_link && (profile.resume_link.includes('.jpg') || profile.resume_link.includes('.png') || profile.resume_link.includes('.jpeg') || profile.resume_link.includes('drive.google.com')) && (
            <div>
              <p className="text-white/50 text-xs mb-2">{t('profile.resumePhoto') || 'Фото резюме'}</p>
              <div className="w-40 aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5">
                <img 
                  src={profile.resume_link} 
                  alt="Resume" 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-3">
            <h4 className="text-accent font-medium text-sm">{t('profile.workData') || 'Рабочие данные'}</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoItem label={t('profile.code') || 'Код'} value={profile.code} />
              <InfoItem label={t('profile.fullInfo') || 'ФИО'} value={profile.full_info} />
              <InfoItem label={t('profile.status') || 'Статус'} value={profile.status} />
              <InfoItem label={t('profile.hr') || 'HR'} value={profile.hr} />
              <InfoItem label={t('profile.rating') || 'Рейтинг'} value={profile.rating} />
              <InfoItem label={t('profile.result') || 'Результат'} value={profile.result} />
              <InfoItem label={t('profile.contractDate') || 'Дата договора'} value={profile.contract_date} />
              <InfoItem label={t('profile.workStart') || 'Старт работы'} value={profile.work_start_date} />
              <InfoItem label={t('admin.startDate') || 'Дата добавления'} value={profile.start_date} />
              <InfoItem label={t('profile.dismissalDate') || 'Дата увольнения'} value={profile.dismissal_date} />
              <InfoItem label={t('profile.daysWorked') || 'Дней работы'} value={profile.days_worked?.toString()} />
              <InfoItem label={t('profile.testsPassed') || 'Тесты'} value={profile.tests_passed} />
            </div>
          </div>

          {/* Interview Info */}
          {(profile.rop_name || profile.city || profile.region || profile.checklist_answers) && (
            <div className="space-y-3">
              <h4 className="text-accent font-medium text-sm">{t('profile.interviewSection') || 'Интервью'}</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoItem label={t('profile.ropName') || 'РОП'} value={profile.rop_name} />
                <InfoItem label={t('profile.city') || 'Город'} value={profile.city} />
                <InfoItem label={t('profile.region') || 'Регион'} value={profile.region} />
              </div>
              {profile.checklist_answers && (
                <div className="mt-2">
                  <p className="text-white/50 text-xs mb-1">{t('profile.checklistAnswers') || 'Ответы на чек-лист'}</p>
                  <p className="text-white text-sm bg-white/5 rounded-lg p-3 whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {profile.checklist_answers}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-accent font-medium text-sm">{t('profile.resume') || 'Контакты'}</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoItem label={t('profile.phone') || 'Телефон'} value={profile.phone} />
              <InfoItem label={t('profile.birthDate') || 'Дата рождения'} value={profile.birth_date} />
            </div>
            {profile.resume_text && (
              <div className="mt-2">
                <p className="text-white/50 text-xs mb-1">{t('profile.resumeText') || 'Резюме'}</p>
                <p className="text-white text-sm bg-white/5 rounded-lg p-3 whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {profile.resume_text}
                </p>
              </div>
            )}
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="text-accent font-medium text-sm">{t('admin.links') || 'Ссылки'}</h4>
            <div className="flex flex-wrap gap-2">
              {profile.contract_link && (
                <a href={profile.contract_link} target="_blank" rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 bg-white/10 rounded-full text-accent hover:bg-white/20">
                  {t('profile.contractLink') || 'Договор'}
                </a>
              )}
              {profile.business_card_link && (
                <a href={profile.business_card_link} target="_blank" rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 bg-white/10 rounded-full text-accent hover:bg-white/20">
                  {t('profile.businessCard') || 'Визитка'}
                </a>
              )}
              {profile.resume_link && (
                <a href={profile.resume_link} target="_blank" rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 bg-white/10 rounded-full text-accent hover:bg-white/20">
                  {t('profile.resumeLink') || 'Резюме'}
                </a>
              )}
              {profile.photo_link && (
                <a href={profile.photo_link} target="_blank" rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 bg-white/10 rounded-full text-accent hover:bg-white/20">
                  {t('profile.photoLink') || 'Фото'}
                </a>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Info Item component
const InfoItem = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div>
    <p className="text-white/50 text-xs">{label}</p>
    <p className="text-white truncate">{value || '—'}</p>
  </div>
);

export default AdminCRM;
