import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Save, RotateCcw, Info, Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NotificationTemplate {
  id: string;
  template_key: string;
  template_text: string;
  description: string | null;
  updated_at: string;
}

const AVAILABLE_VARIABLES = [
  { key: '{{project_name}}', description: 'Название проекта' },
  { key: '{{project_code}}', description: 'Код проекта' },
  { key: '{{region}}', description: 'Регион проекта' },
  { key: '{{full_name}}', description: 'ФИО кандидата из CRM' },
  { key: '{{user_code}}', description: 'Код кандидата' },
  { key: '{{telegram_link}}', description: 'Ссылка на Telegram кандидата' },
  { key: '{{phone}}', description: 'Телефон кандидата' },
  { key: '{{phone_section}}', description: 'Телефон с переносом строки (если есть)' },
  { key: '{{project_link}}', description: 'Ссылка на страницу проекта' },
  { key: '{{profile_link}}', description: 'Ссылка на профиль кандидата' },
  { key: '{{manager_username}}', description: '@username менеджера проекта' },
  { key: '{{dpr_username}}', description: '@username ДПР' },
];

const NotificationTemplateEditor = () => {
  const [template, setTemplate] = useState<NotificationTemplate | null>(null);
  const [editedText, setEditedText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('notification_templates')
        .select('*')
        .eq('template_key', 'project_response')
        .single();

      if (error) throw error;
      
      setTemplate(data);
      setEditedText(data.template_text);
      setHasChanges(false);
    } catch (err) {
      console.error('Error loading template:', err);
      toast.error('Ошибка загрузки шаблона');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!template) return;
    
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('notification_templates')
        .update({ template_text: editedText })
        .eq('id', template.id);

      if (error) throw error;
      
      setTemplate({ ...template, template_text: editedText });
      setHasChanges(false);
      toast.success('Шаблон сохранён');
    } catch (err) {
      console.error('Error saving template:', err);
      toast.error('Ошибка сохранения шаблона');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (template) {
      setEditedText(template.template_text);
      setHasChanges(false);
    }
  };

  const handleTextChange = (value: string) => {
    setEditedText(value);
    setHasChanges(value !== template?.template_text);
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('template-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = editedText.substring(0, start) + variable + editedText.substring(end);
      handleTextChange(newText);
      // Set cursor position after inserted variable
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + variable.length;
        textarea.focus();
      }, 0);
    }
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
      <div className="glass-dark rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Шаблон уведомления об отклике</h3>
            <p className="text-sm text-white/50">{template?.description}</p>
          </div>
          <div className="flex gap-2">
            {hasChanges && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Отменить
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="bg-accent hover:bg-accent/80 text-primary"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Сохранить
            </Button>
          </div>
        </div>

        <Textarea
          id="template-textarea"
          value={editedText}
          onChange={(e) => handleTextChange(e.target.value)}
          className="min-h-[300px] bg-white/5 border-white/10 text-white font-mono text-sm"
          placeholder="Введите шаблон сообщения..."
        />

        {/* Variables Reference */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-accent" />
            <span className="text-sm text-white/70">Доступные переменные (нажмите для вставки):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <TooltipProvider>
              {AVAILABLE_VARIABLES.map((variable) => (
                <Tooltip key={variable.key}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => insertVariable(variable.key)}
                      className="px-2 py-1 text-xs font-mono bg-accent/10 text-accent rounded hover:bg-accent/20 transition-colors"
                    >
                      {variable.key}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{variable.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="glass-dark rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Предпросмотр</h3>
        <div className="bg-[#1a1a1a] rounded-xl p-4 font-sans text-sm text-white/90 whitespace-pre-wrap">
          {editedText
            .replace(/\{\{project_name\}\}/g, 'FIPS Multilinks')
            .replace(/\{\{project_code\}\}/g, '4288')
            .replace(/\{\{region\}\}/g, 'Nigeria, Ghana')
            .replace(/\{\{full_name\}\}/g, 'Иванов Иван Иванович')
            .replace(/\{\{user_code\}\}/g, '102')
            .replace(/\{\{telegram_link\}\}/g, 'https://t.me/example')
            .replace(/\{\{phone\}\}/g, '+7 999 123-45-67')
            .replace(/\{\{phone_section\}\}/g, '+7 999 123-45-67\n')
            .replace(/\{\{project_link\}\}/g, 'https://hr.rent-rop.com/projects/4288')
            .replace(/\{\{profile_link\}\}/g, 'https://hr.rent-rop.com/169262990')
            .replace(/\{\{manager_username\}\}/g, '@Olu_Lumotz')
            .replace(/\{\{dpr_username\}\}/g, '@tatyanamotorina')}
        </div>
      </div>
    </div>
  );
};

export default NotificationTemplateEditor;
