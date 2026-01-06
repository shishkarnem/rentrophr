import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Sparkles, User, X, ChevronDown, Loader2 } from 'lucide-react';
import { useTelegram } from '@/contexts/TelegramContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCrmData, CrmData } from '@/hooks/useCrmData';
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

// Allowed statuses for admin access
const ADMIN_STATUSES = ['ДПР', 'HR', 'Чат или канал', 'Менеджер'];

// Status filter options
const STATUS_OPTIONS = [
  'Все',
  'ДПР',
  'HR',
  'Чат или канал',
  'Менеджер',
  'Сотрудник',
  'Кандидат',
  'Уволен',
];

const AdminCRM = () => {
  const navigate = useNavigate();
  const { isTelegram, profile } = useTelegram();
  const { t } = useLanguage();
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;
  
  const telegramId = profile?.telegram_id ? Number(profile.telegram_id) : null;
  const { crmData: currentUserCrm, isLoading: isUserLoading } = useCrmData(telegramId);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Все');
  const [isSearching, setIsSearching] = useState(false);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CrmData[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<CrmData | null>(null);
  const [allRecords, setAllRecords] = useState<CrmData[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(true);

  // Check preview mode or admin access
  const isPreview = !isTelegram;
  const hasAdminAccess = isPreview || (currentUserCrm?.status && ADMIN_STATUSES.includes(currentUserCrm.status));

  // Load all CRM records on mount
  useEffect(() => {
    const loadAllRecords = async () => {
      try {
        setIsLoadingAll(true);
        const { data, error } = await supabase
          .from('crm_data')
          .select('*')
          .limit(500);

        if (error) throw error;
        setAllRecords(data || []);
        setSearchResults(data || []);
      } catch (err) {
        console.error('Error loading CRM records:', err);
        toast.error(t('admin.loadError') || 'Ошибка загрузки данных');
      } finally {
        setIsLoadingAll(false);
      }
    };

    if (hasAdminAccess) {
      loadAllRecords();
    }
  }, [hasAdminAccess]);

  // Filter locally when status changes or search query changes
  useEffect(() => {
    if (isAiSearching) return;
    
    let filtered = [...allRecords];

    // Apply status filter
    if (statusFilter && statusFilter !== 'Все') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Apply search filter (local)
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
          r.rop_name?.toLowerCase().includes(lowerQuery)
        );
      });
    }

    setSearchResults(filtered);
  }, [searchQuery, statusFilter, allRecords, isAiSearching]);

  // AI Search function
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
          filters: statusFilter !== 'Все' ? { status: statusFilter } : undefined,
          language,
        },
      });

      if (error) throw error;

      if (data?.results) {
        setSearchResults(data.results);
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

  const clearSearch = () => {
    setSearchQuery('');
    setAiSummary(null);
    setSearchResults(allRecords);
  };

  const openProfile = (record: CrmData) => {
    setSelectedProfile(record);
  };

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
        {/* Search and Filters */}
        <div className="glass-dark rounded-2xl p-4 mb-6 space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('admin.searchPlaceholder') || 'Поиск по имени, коду, телефону...'}
                className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
                onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
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

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <Filter className="w-4 h-4" />
            {t('admin.filters') || 'Фильтры'}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Filters Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-white/10">
              <div>
                <label className="text-sm text-white/70 mb-1 block">{t('admin.statusFilter') || 'Статус'}</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
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

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-white/70 text-sm">
            {t('admin.found') || 'Найдено'}: {searchResults.length} {t('admin.records') || 'записей'}
          </p>
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
                    <TableHead className="text-white/70">{t('admin.colName') || 'Имя'}</TableHead>
                    <TableHead className="text-white/70">{t('admin.colCode') || 'Код'}</TableHead>
                    <TableHead className="text-white/70">{t('admin.colStatus') || 'Статус'}</TableHead>
                    <TableHead className="text-white/70">{t('admin.colHr') || 'HR'}</TableHead>
                    <TableHead className="text-white/70">{t('admin.colCity') || 'Город'}</TableHead>
                    <TableHead className="text-white/70 text-right">{t('admin.colActions') || 'Действия'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-white/50 py-8">
                        {t('admin.noResults') || 'Нет результатов'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    searchResults.map((record) => (
                      <TableRow key={record.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white font-medium">
                          {record.telegram_name || record.full_info?.split(',')[0] || '—'}
                        </TableCell>
                        <TableCell className="text-white/70">{record.code || '—'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            record.status === 'Сотрудник' ? 'bg-green-500/20 text-green-400' :
                            record.status === 'Кандидат' ? 'bg-yellow-500/20 text-yellow-400' :
                            record.status === 'Уволен' ? 'bg-red-500/20 text-red-400' :
                            ADMIN_STATUSES.includes(record.status || '') ? 'bg-accent/20 text-accent' :
                            'bg-white/10 text-white/70'
                          }`}>
                            {record.status || '—'}
                          </span>
                        </TableCell>
                        <TableCell className="text-white/70">{record.hr || '—'}</TableCell>
                        <TableCell className="text-white/70">{record.city || '—'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openProfile(record)}
                            className="text-accent hover:text-accent/80 hover:bg-white/10"
                          >
                            <User className="w-4 h-4 mr-1" />
                            {t('admin.profile') || 'Профиль'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
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

// Profile Dialog Component
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
          {/* Basic Info */}
          <div className="space-y-3">
            <h4 className="text-accent font-medium text-sm">{t('profile.workData') || 'Рабочие данные'}</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoItem label="Telegram ID" value={profile.telegram_id?.toString()} />
              <InfoItem label={t('profile.code') || 'Код'} value={profile.code} />
              <InfoItem label={t('profile.fullInfo') || 'ФИО'} value={profile.full_info} />
              <InfoItem label={t('profile.status') || 'Статус'} value={profile.status} />
              <InfoItem label={t('profile.hr') || 'HR'} value={profile.hr} />
              <InfoItem label={t('profile.rating') || 'Рейтинг'} value={profile.rating} />
              <InfoItem label={t('profile.result') || 'Результат'} value={profile.result} />
              <InfoItem label={t('profile.contractDate') || 'Дата договора'} value={profile.contract_date} />
              <InfoItem label={t('profile.workStart') || 'Старт работы'} value={profile.work_start_date} />
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
