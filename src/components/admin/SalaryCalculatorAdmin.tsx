import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Save, RefreshCw, DollarSign, Percent, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface CalculatorParam {
  id: string;
  param_key: string;
  param_value: Record<string, unknown>;
  description: string | null;
  category: string | null;
  updated_at: string;
}

interface TariffValue {
  international: number;
  rf_cis: number | null;
  management?: boolean;
}

interface PercentByDuration {
  up_to_1_month: number;
  '2_to_6_months': number;
  '7_to_12_months': number;
  over_12_months: number;
}

interface VariablePercent {
  up_to_60k: number;
  '60_to_120k': number;
  '120k_plus': number;
}

interface VariableByAge {
  up_to_1_month: VariablePercent;
  '2_to_6_months': VariablePercent;
  '7_to_12_months': VariablePercent;
  over_12_months: VariablePercent;
}


const DURATION_LABELS: Record<string, string> = {
  up_to_1_month: 'До 1 месяца',
  '2_to_6_months': '2-6 месяцев',
  '7_to_12_months': '7-12 месяцев',
  over_12_months: '12+ месяцев',
};

const REVENUE_LABELS: Record<string, string> = {
  up_to_60k: 'До 60 000 ₽',
  '60_to_120k': '60-120 000 ₽',
  '120k_plus': 'Более 120 000 ₽',
};

const TARIFF_LABELS: Record<string, { name: string; desc: string }> = {
  tariff_online_4h: { name: 'Онлайн 4ч', desc: 'Онлайн формат, 4 часа в день' },
  tariff_online_8h: { name: 'Онлайн 8ч', desc: 'Онлайн формат, 8 часов в день' },
  tariff_combined_4h: { name: 'Комбинированный 4ч', desc: 'Комбинированный формат, 4 часа' },
  tariff_combined_8h: { name: 'Комбинированный 8ч', desc: 'Комбинированный формат, 8 часов' },
  tariff_startup_4h: { name: 'Стартап 4ч', desc: 'Тариф Стартап, 4 часа' },
  tariff_startup_8h: { name: 'Стартап 8ч', desc: 'Тариф Стартап, 8 часов' },
  tariff_no_dpr_4h: { name: 'Без ДПР 4ч', desc: 'Без ДПР, 4 часа' },
  tariff_no_dpr_8h: { name: 'Без ДПР 8ч', desc: 'Без ДПР, 8 часов' },
};

const FIX_PERCENT_LABELS: Record<string, string> = {
  fix_percent_8h_1proj: 'Фикс % (8ч, 1 проект)',
  fix_percent_4h_2proj: 'Фикс % (4ч, 2 проекта)',
  fix_percent_4h_no_dpr_2proj: 'Фикс % (4ч без ДПР, 2 проекта)',
};

const VARIABLE_PERCENT_LABELS: Record<string, string> = {
  variable_by_age_8h_1proj: 'Переменная % (8ч, 1 проект)',
  variable_by_age_4h_2proj: 'Переменная % (4ч, 2 проекта)',
  variable_by_age_4h_no_dpr_2proj: 'Переменная % (4ч без ДПР, 2 проекта)',
};

const SalaryCalculatorAdmin = () => {
  const [params, setParams] = useState<CalculatorParam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [localChanges, setLocalChanges] = useState<Record<string, unknown>>({});

  const loadParams = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('salary_calculator_params')
        .select('*')
        .order('category', { ascending: true })
        .order('param_key', { ascending: true });
      
      if (error) throw error;
      setParams((data || []) as CalculatorParam[]);
      setLocalChanges({});
    } catch (err) {
      console.error('Error loading params:', err);
      toast.error('Ошибка загрузки параметров');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadParams();
  }, []);

  const getParamByKey = (key: string): CalculatorParam | undefined => {
    return params.find(p => p.param_key === key);
  };

  const getLocalValue = (paramKey: string, path: string[]): unknown => {
    const changeKey = `${paramKey}.${path.join('.')}`;
    if (localChanges[changeKey] !== undefined) {
      return localChanges[changeKey];
    }
    const param = getParamByKey(paramKey);
    if (!param) return null;
    
    let value: unknown = param.param_value;
    for (const key of path) {
      if (value && typeof value === 'object' && key in (value as Record<string, unknown>)) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return null;
      }
    }
    return value;
  };

  const handleLocalChange = (paramKey: string, path: string[], value: number) => {
    const changeKey = `${paramKey}.${path.join('.')}`;
    setLocalChanges(prev => ({ ...prev, [changeKey]: value }));
  };

  const saveParam = async (paramKey: string) => {
    const param = getParamByKey(paramKey);
    if (!param) return;

    setIsSaving(paramKey);
    try {
      // Build updated value from local changes
      const updatedValue = JSON.parse(JSON.stringify(param.param_value));
      
      Object.entries(localChanges).forEach(([changeKey, newValue]) => {
        if (changeKey.startsWith(`${paramKey}.`)) {
          const pathStr = changeKey.replace(`${paramKey}.`, '');
          const path = pathStr.split('.');
          
          let obj = updatedValue;
          for (let i = 0; i < path.length - 1; i++) {
            obj = obj[path[i]];
          }
          obj[path[path.length - 1]] = newValue;
        }
      });

      const { error } = await supabase
        .from('salary_calculator_params')
        .update({ param_value: updatedValue })
        .eq('id', param.id);
      
      if (error) throw error;
      
      toast.success('Сохранено');
      
      // Clear local changes for this param
      const newLocalChanges = { ...localChanges };
      Object.keys(newLocalChanges).forEach(key => {
        if (key.startsWith(`${paramKey}.`)) {
          delete newLocalChanges[key];
        }
      });
      setLocalChanges(newLocalChanges);
      
      loadParams();
    } catch (err) {
      console.error('Error saving param:', err);
      toast.error('Ошибка сохранения');
    } finally {
      setIsSaving(null);
    }
  };

  const hasChanges = (paramKey: string): boolean => {
    return Object.keys(localChanges).some(key => key.startsWith(`${paramKey}.`));
  };

  // Tariff input component
  const TariffInput = ({ paramKey }: { paramKey: string }) => {
    const info = TARIFF_LABELS[paramKey];
    const intValue = getLocalValue(paramKey, ['international']) as number;
    const rfValue = getLocalValue(paramKey, ['rf_cis']) as number | null;

    return (
      <div className="p-4 glass-dark rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-white">{info?.name || paramKey}</h4>
            <p className="text-white/50 text-sm">{info?.desc}</p>
          </div>
          {hasChanges(paramKey) && (
            <Button
              size="sm"
              onClick={() => saveParam(paramKey)}
              disabled={isSaving === paramKey}
              className="bg-accent hover:bg-accent/80 text-primary"
            >
              {isSaving === paramKey ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white/60 text-sm block mb-1">Международный</label>
            <div className="relative">
              <Input
                type="number"
                value={intValue || 0}
                onChange={(e) => handleLocalChange(paramKey, ['international'], Number(e.target.value))}
                className="bg-white/5 border-white/10 text-white pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">₽</span>
            </div>
          </div>
          <div>
            <label className="text-white/60 text-sm block mb-1">РФ/СНГ</label>
            <div className="relative">
              <Input
                type="number"
                value={rfValue ?? ''}
                placeholder="Не применяется"
                onChange={(e) => handleLocalChange(paramKey, ['rf_cis'], e.target.value ? Number(e.target.value) : null)}
                className="bg-white/5 border-white/10 text-white pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">₽</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fix percent input component
  const FixPercentInput = ({ paramKey }: { paramKey: string }) => {
    const label = FIX_PERCENT_LABELS[paramKey];

    return (
      <div className="p-4 glass-dark rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-white">{label || paramKey}</h4>
          {hasChanges(paramKey) && (
            <Button
              size="sm"
              onClick={() => saveParam(paramKey)}
              disabled={isSaving === paramKey}
              className="bg-accent hover:bg-accent/80 text-primary"
            >
              {isSaving === paramKey ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(DURATION_LABELS).map(([key, label]) => (
            <div key={key}>
              <label className="text-white/60 text-xs block mb-1">{label}</label>
              <div className="relative">
                <Input
                  type="number"
                  value={(getLocalValue(paramKey, [key]) as number) || 0}
                  onChange={(e) => handleLocalChange(paramKey, [key], Number(e.target.value))}
                  className="bg-white/5 border-white/10 text-white pr-6 text-sm"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 text-sm">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Variable percent input component
  const VariablePercentInput = ({ paramKey }: { paramKey: string }) => {
    const label = VARIABLE_PERCENT_LABELS[paramKey];

    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={paramKey} className="border-white/10">
          <AccordionTrigger className="text-white hover:text-accent">
            <div className="flex items-center justify-between w-full pr-4">
              <span>{label || paramKey}</span>
              {hasChanges(paramKey) && (
                <Button
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); saveParam(paramKey); }}
                  disabled={isSaving === paramKey}
                  className="bg-accent hover:bg-accent/80 text-primary ml-2"
                >
                  {isSaving === paramKey ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {Object.entries(DURATION_LABELS).map(([durationKey, durationLabel]) => (
                <div key={durationKey} className="p-3 bg-white/5 rounded-lg">
                  <p className="text-white/70 text-sm font-medium mb-2">{durationLabel}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(REVENUE_LABELS).map(([revKey, revLabel]) => (
                      <div key={revKey}>
                        <label className="text-white/50 text-xs block mb-1">{revLabel}</label>
                        <div className="relative">
                          <Input
                            type="number"
                            value={(getLocalValue(paramKey, [durationKey, revKey]) as number) || 0}
                            onChange={(e) => handleLocalChange(paramKey, [durationKey, revKey], Number(e.target.value))}
                            className="bg-white/10 border-white/10 text-white pr-6 text-sm h-8"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 text-xs">%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const tariffKeys = Object.keys(TARIFF_LABELS);
  const fixPercentKeys = Object.keys(FIX_PERCENT_LABELS);
  const variablePercentKeys = Object.keys(VARIABLE_PERCENT_LABELS);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Настройки калькулятора зарплаты</h2>
          <p className="text-white/50 text-sm mt-1">Редактируйте тарифы и проценты</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={loadParams}
          className="text-white/70 hover:text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Обновить
        </Button>
      </div>

      <Tabs defaultValue="tariffs" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 mb-6">
          <TabsTrigger value="tariffs" className="data-[state=active]:bg-accent data-[state=active]:text-primary">
            <DollarSign className="w-4 h-4 mr-2" />
            Тарифы
          </TabsTrigger>
          <TabsTrigger value="fix" className="data-[state=active]:bg-accent data-[state=active]:text-primary">
            <Percent className="w-4 h-4 mr-2" />
            Фикс %
          </TabsTrigger>
          <TabsTrigger value="variable" className="data-[state=active]:bg-accent data-[state=active]:text-primary">
            <TrendingUp className="w-4 h-4 mr-2" />
            Переменная %
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tariffs" className="space-y-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-accent" />
                Базовые тарифы
              </CardTitle>
              <CardDescription className="text-white/50">
                Установите базовые тарифы для разных форматов работы. Международный тариф применяется для зарубежных проектов, РФ/СНГ — для России и СНГ.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tariffKeys.map(key => (
                getParamByKey(key) && <TariffInput key={key} paramKey={key} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fix" className="space-y-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Percent className="w-5 h-5 text-accent" />
                Процент фиксированной части
              </CardTitle>
              <CardDescription className="text-white/50">
                Процент от тарифа, который выплачивается как фиксированная часть зарплаты. Зависит от срока работы на проекте.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fixPercentKeys.map(key => (
                getParamByKey(key) && <FixPercentInput key={key} paramKey={key} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variable" className="space-y-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Процент переменной части
              </CardTitle>
              <CardDescription className="text-white/50">
                Процент от оборота проекта. Зависит от срока работы и суммы оборота в месяц.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {variablePercentKeys.map(key => (
                getParamByKey(key) && <VariablePercentInput key={key} paramKey={key} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalaryCalculatorAdmin;
