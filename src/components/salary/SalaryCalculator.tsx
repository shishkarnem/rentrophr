import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, DollarSign, Briefcase, Clock, MapPin, TrendingUp, Info, Sparkles } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardGlassDark, CardGlassDarkHeader, CardGlassDarkTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import CalculatorTooltip from './CalculatorTooltip';
interface CurrencyRates {
  tenge_rate: number;
  usd_rate: number;
  eur_rate: number;
}
interface CalculatorParams {
  currency_rates?: CurrencyRates;
  [key: string]: unknown;
}
interface TariffData {
  international: number;
  rf_cis: number | null;
  management?: boolean;
}
interface FixPercentData {
  up_to_1_month: number;
  '2_to_6_months': number;
  '7_to_12_months': number;
  over_12_months: number;
}
interface VariablePercentData {
  up_to_1_month: {
    up_to_60k: number;
    '60_to_120k': number;
    '120k_plus': number;
  };
  '2_to_6_months': {
    up_to_60k: number;
    '60_to_120k': number;
    '120k_plus': number;
  };
  '7_to_12_months': {
    up_to_60k: number;
    '60_to_120k': number;
    '120k_plus': number;
  };
  over_12_months: {
    up_to_60k: number;
    '60_to_120k': number;
    '120k_plus': number;
  };
}
const tooltipTexts = {
  ru: {
    workFormat: 'Согласно Приложению №1: Онлайн — полностью удаленная работа. Комбинированный — с выездами. Стартап — работа с новыми проектами. Без ДПР — без документооборота по проекту.',
    workHours: 'Согласно Приложению №1: 4 часа — неполный рабочий день, 8 часов — полный рабочий день. При 4 часах можно вести 2 проекта одновременно.',
    projectsCount: 'Согласно Приложению №1: При неполном рабочем дне (4 часа) возможно ведение 1 или 2 проектов. При 2 проектах базовый тариф удваивается.',
    region: 'Согласно Приложению №1: Международный — проекты вне СНГ (тариф выше). РФ/СНГ — проекты в России и странах СНГ.',
    projectDuration: 'Согласно Приложению №1: Чем дольше вы работаете на проекте, тем выше ваш процент с фикса и переменной части.',
    monthlyRevenue: 'Согласно Приложению №1: Оборот клиента влияет на размер переменной части. Градации: до 60к, 60-120к, свыше 120к рублей.',
    baseTariff: 'Согласно Приложению №1: Базовый тариф зависит от формата работы, часов и региона. Это основа для расчета фиксированной части.',
    fixPart: 'Согласно Приложению №1: Фиксированная часть = Базовый тариф × Процент фикса. Процент зависит от срока работы на проекте.',
    variablePart: 'Согласно Приложению №1: Переменная часть = Оборот клиента × Процент переменной. Зависит от срока и оборота.',
  },
  en: {
    workFormat: 'Per Annex 1: Online — fully remote work. Combined — with on-site visits. Startup — new projects. Without DPR — no project documentation.',
    workHours: 'Per Annex 1: 4 hours — part-time, 8 hours — full-time. With 4 hours, you can manage 2 projects simultaneously.',
    projectsCount: 'Per Annex 1: With part-time (4 hours), you can manage 1 or 2 projects. With 2 projects, the base tariff doubles.',
    region: 'Per Annex 1: International — projects outside CIS (higher tariff). RF/CIS — projects in Russia and CIS countries.',
    projectDuration: 'Per Annex 1: The longer you work on a project, the higher your fix and variable percentages.',
    monthlyRevenue: 'Per Annex 1: Client turnover affects the variable part. Tiers: up to 60k, 60-120k, over 120k rubles.',
    baseTariff: 'Per Annex 1: Base tariff depends on work format, hours, and region. This is the basis for calculating the fixed part.',
    fixPart: 'Per Annex 1: Fixed part = Base tariff × Fix percentage. Percentage depends on project tenure.',
    variablePart: 'Per Annex 1: Variable part = Client turnover × Variable percentage. Depends on tenure and turnover.',
  },
  kz: {
    workFormat: 'Қосымша №1 бойынша: Онлайн — толық қашықтан жұмыс. Аралас — шығумен. Стартап — жаңа жобалар. ДПР-сіз — жоба құжаттамасынсыз.',
    workHours: 'Қосымша №1 бойынша: 4 сағат — толық емес жұмыс күні, 8 сағат — толық жұмыс күні. 4 сағатта 2 жобаны бір мезгілде жүргізуге болады.',
    projectsCount: 'Қосымша №1 бойынша: Толық емес жұмыс күнінде (4 сағат) 1 немесе 2 жобаны жүргізуге болады. 2 жобада базалық тариф екі есе артады.',
    region: 'Қосымша №1 бойынша: Халықаралық — ТМД-дан тыс жобалар (жоғары тариф). РФ/ТМД — Ресей және ТМД елдеріндегі жобалар.',
    projectDuration: 'Қосымша №1 бойынша: Жобада неғұрлым ұзақ жұмыс істесеңіз, фикс пен айнымалы пайызыңыз соғұрлым жоғары.',
    monthlyRevenue: 'Қосымша №1 бойынша: Клиент айналымы айнымалы бөлікке әсер етеді. Деңгейлер: 60к дейін, 60-120к, 120к рубльден жоғары.',
    baseTariff: 'Қосымша №1 бойынша: Базалық тариф жұмыс форматына, сағаттарға және аймаққа байланысты. Бұл тұрақты бөлікті есептеу негізі.',
    fixPart: 'Қосымша №1 бойынша: Тұрақты бөлік = Базалық тариф × Фикс пайызы. Пайыз жобадағы жұмыс мерзіміне байланысты.',
    variablePart: 'Қосымша №1 бойынша: Айнымалы бөлік = Клиент айналымы × Айнымалы пайыз. Мерзім мен айналымға байланысты.',
  }
};

const translations = {
  ru: {
    title: 'Калькулятор зарплаты',
    subtitle: 'Рассчитайте ваш потенциальный доход',
    workFormat: 'Формат работы',
    online: 'Онлайн',
    combined: 'Комбинированный',
    startup: 'Стартап',
    noDpr: 'Без ДПР',
    workHours: 'Часы работы',
    hours4: '4 часа',
    hours8: '8 часов',
    projectsCount: 'Количество проектов',
    project1: '1 проект',
    projects2: '2 проекта',
    region: 'Регион',
    international: 'Международный',
    rfCis: 'РФ/СНГ',
    projectDuration: 'Срок работы на проекте',
    upTo1Month: 'До 1 месяца',
    from2to6: 'От 2 до 6 мес.',
    from7to12: 'От 7 до 12 мес.',
    over12: '12 и более мес.',
    monthlyRevenue: 'Оборот в месяц (руб.)',
    fixPart: 'Фикс',
    variablePart: 'Переменная',
    totalIncome: 'Итого доход',
    perMonth: 'в месяц',
    fixPercent: 'Процент фикса',
    variablePercent: 'Процент переменной',
    baseTariff: 'Базовый тариф',
    rules: 'Правила расчета',
    rule1: '* Если работа на проекте прекращается по любой причине до 1 месяца включительно, % с фиксы уменьшается до 30%, с переменки опускается до 0.',
    rule2: '* В случае претензии к РОПу \\ его работе от Клиента по невыполненным задачам, не сдержанным обещаниям, по недостаточной компетенции, то штраф на 2 недели работы проект',
    rule3: '* Амнистия на двух недельный штраф если ЛТВ проекта достиг 6 месяцев и более. Либо Совокупно Оплат с Проекта более 450 000 руб.',
    rule4: '* Одновременно может быть наложен двух недельный штраф и уменьшение фиксы до 30% в случае грубого нарушения работы у клиента',
    loading: 'Загрузка параметров...',
    inOtherCurrencies: 'В других валютах',
    tenge: 'Тенге',
    usd: 'Доллары',
    eur: 'Евро'
  },
  en: {
    title: 'Salary Calculator',
    subtitle: 'Calculate your potential income',
    workFormat: 'Work Format',
    online: 'Online',
    combined: 'Combined',
    startup: 'Startup',
    noDpr: 'Without DPR',
    workHours: 'Work Hours',
    hours4: '4 hours',
    hours8: '8 hours',
    projectsCount: 'Projects Count',
    project1: '1 project',
    projects2: '2 projects',
    region: 'Region',
    international: 'International',
    rfCis: 'RF/CIS',
    projectDuration: 'Project Duration',
    upTo1Month: 'Up to 1 month',
    from2to6: '2 to 6 months',
    from7to12: '7 to 12 months',
    over12: '12+ months',
    monthlyRevenue: 'Monthly Revenue (rub.)',
    fixPart: 'Fixed',
    variablePart: 'Variable',
    totalIncome: 'Total Income',
    perMonth: 'per month',
    fixPercent: 'Fix percentage',
    variablePercent: 'Variable percentage',
    baseTariff: 'Base tariff',
    rules: 'Calculation Rules',
    rule1: '* If work on the project ends for any reason within 1 month, fix % decreases to 30%, variable drops to 0.',
    rule2: '* In case of client complaints about unfulfilled tasks or insufficient competence, a 2-week project penalty applies.',
    rule3: '* Amnesty on the two-week penalty if project LTV reaches 6+ months or total payments exceed 450,000 rubles.',
    rule4: '* Both the two-week penalty and fix reduction to 30% can be applied simultaneously for serious violations.',
    loading: 'Loading parameters...',
    inOtherCurrencies: 'In other currencies',
    tenge: 'Tenge',
    usd: 'Dollars',
    eur: 'Euro'
  },
  kz: {
    title: 'Жалақы калькуляторы',
    subtitle: 'Әлеуетті табысыңызды есептеңіз',
    workFormat: 'Жұмыс форматы',
    online: 'Онлайн',
    combined: 'Аралас',
    startup: 'Стартап',
    noDpr: 'ДПР-сіз',
    workHours: 'Жұмыс сағаттары',
    hours4: '4 сағат',
    hours8: '8 сағат',
    projectsCount: 'Жобалар саны',
    project1: '1 жоба',
    projects2: '2 жоба',
    region: 'Аймақ',
    international: 'Халықаралық',
    rfCis: 'РФ/ТМД',
    projectDuration: 'Жобадағы жұмыс мерзімі',
    upTo1Month: '1 айға дейін',
    from2to6: '2-ден 6 айға дейін',
    from7to12: '7-ден 12 айға дейін',
    over12: '12 ай және одан көп',
    monthlyRevenue: 'Айлық айналым (руб.)',
    fixPart: 'Фикс',
    variablePart: 'Айнымалы',
    totalIncome: 'Жалпы табыс',
    perMonth: 'айына',
    fixPercent: 'Фикс пайызы',
    variablePercent: 'Айнымалы пайызы',
    baseTariff: 'Базалық тариф',
    rules: 'Есептеу ережелері',
    rule1: '* Жобадағы жұмыс 1 айға дейін тоқтатылса, фикс % 30%-ға дейін төмендейді, айнымалы 0-ге түседі.',
    rule2: '* Клиенттің орындалмаған тапсырмалар немесе құзыреттіліктің жеткіліксіздігі туралы шағымы болса, 2 апталық айыппұл салынады.',
    rule3: '* Жоба ЛТВ 6+ ай болса немесе жалпы төлемдер 450 000 рубльден асса, 2 апталық айыппұлға рақымшылық.',
    rule4: '* Ауыр бұзушылықтар үшін 2 апталық айыппұл мен фиксты 30%-ға дейін азайту бір мезгілде қолданылуы мүмкін.',
    loading: 'Параметрлер жүктелуде...',
    inOtherCurrencies: 'Басқа валюталарда',
    tenge: 'Теңге',
    usd: 'Доллар',
    eur: 'Евро'
  }
};
const SalaryCalculator = () => {
  const {
    language
  } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.ru;
  const tt = tooltipTexts[language as keyof typeof tooltipTexts] || tooltipTexts.ru;
  const [isLoading, setIsLoading] = useState(true);
  const [params, setParams] = useState<Record<string, CalculatorParams>>({});

  // Calculator state
  const [workFormat, setWorkFormat] = useState<'online' | 'combined' | 'startup' | 'noDpr'>('online');
  const [workHours, setWorkHours] = useState<4 | 8>(8);
  const [projectsCount, setProjectsCount] = useState<1 | 2>(1);
  const [region, setRegion] = useState<'international' | 'rf_cis'>('international');
  const [projectDuration, setProjectDuration] = useState<'up_to_1_month' | '2_to_6_months' | '7_to_12_months' | 'over_12_months'>('up_to_1_month');
  const [monthlyRevenue, setMonthlyRevenue] = useState(100000);

  // Load parameters from database
  useEffect(() => {
    const loadParams = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('salary_calculator_params').select('*');
        if (error) throw error;
        const paramsMap: Record<string, CalculatorParams> = {};
        data?.forEach(item => {
          paramsMap[item.param_key] = item.param_value as CalculatorParams;
        });
        setParams(paramsMap);
      } catch (err) {
        console.error('Error loading calculator params:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadParams();
  }, []);

  // Get currency rates
  const currencyRates = useMemo<CurrencyRates>(() => {
    const rates = params.currency_rates as unknown as CurrencyRates | undefined;
    return {
      tenge_rate: rates?.tenge_rate || 7,
      usd_rate: rates?.usd_rate || 75,
      eur_rate: rates?.eur_rate || 85
    };
  }, [params]);

  // Calculate salary
  const calculation = useMemo(() => {
    if (isLoading || Object.keys(params).length === 0) {
      return null;
    }

    // Get tariff key based on selections
    let tariffKey = '';
    if (workFormat === 'online') {
      tariffKey = `tariff_online_${workHours}h`;
    } else if (workFormat === 'combined') {
      tariffKey = `tariff_combined_${workHours}h`;
    } else if (workFormat === 'startup') {
      tariffKey = `tariff_startup_${workHours}h`;
    } else {
      tariffKey = `tariff_no_dpr_${workHours}h`;
    }
    const tariffData = params[tariffKey] as unknown as TariffData;
    if (!tariffData) return null;

    // Get base tariff
    let baseTariff = region === 'international' ? tariffData.international : tariffData.rf_cis || tariffData.international;

    // Adjust for 2 projects if 4 hours
    if (projectsCount === 2 && workHours === 4) {
      baseTariff = baseTariff * 2;
    }

    // Get fix percentage
    let fixPercentKey = '';
    if (workFormat === 'noDpr' && projectsCount === 2) {
      fixPercentKey = 'fix_percent_4h_no_dpr_2proj';
    } else if (projectsCount === 2) {
      fixPercentKey = 'fix_percent_4h_2proj';
    } else {
      fixPercentKey = 'fix_percent_8h_1proj';
    }
    const fixPercentData = params[fixPercentKey] as unknown as FixPercentData;
    const fixPercent = fixPercentData?.[projectDuration] || 50;

    // Get variable percentage
    let variablePercentKey = '';
    if (workFormat === 'noDpr' && projectsCount === 2) {
      variablePercentKey = 'variable_by_age_4h_no_dpr_2proj';
    } else if (projectsCount === 2) {
      variablePercentKey = 'variable_by_age_4h_2proj';
    } else {
      variablePercentKey = 'variable_by_age_8h_1proj';
    }
    const variableByAge = params[variablePercentKey] as unknown as VariablePercentData;
    const variableForDuration = variableByAge?.[projectDuration];
    let variablePercent = 50;
    if (variableForDuration) {
      if (monthlyRevenue < 60000) {
        variablePercent = variableForDuration.up_to_60k;
      } else if (monthlyRevenue <= 120000) {
        variablePercent = variableForDuration['60_to_120k'];
      } else {
        variablePercent = variableForDuration['120k_plus'];
      }
    }

    // Calculate amounts
    const fixAmount = Math.round(baseTariff * (fixPercent / 100));
    const variableAmount = Math.round(monthlyRevenue * (variablePercent / 100));
    const totalIncome = fixAmount + variableAmount;

    // Calculate currency conversions
    const totalInTenge = Math.round(totalIncome * currencyRates.tenge_rate);
    const totalInUsd = Math.round(totalIncome / currencyRates.usd_rate);
    const totalInEur = Math.round(totalIncome / currencyRates.eur_rate);
    return {
      baseTariff,
      fixPercent,
      variablePercent,
      fixAmount,
      variableAmount,
      totalIncome,
      totalInTenge,
      totalInUsd,
      totalInEur
    };
  }, [isLoading, params, workFormat, workHours, projectsCount, region, projectDuration, monthlyRevenue, currencyRates]);
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount);
  };
  if (isLoading) {
    return <CardGlassDark className="p-8">
        <div className="flex items-center justify-center gap-3 text-white/60">
          <motion.div animate={{
          rotate: 360
        }} transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}>
            <Sparkles className="w-6 h-6" />
          </motion.div>
          {t.loading}
        </div>
      </CardGlassDark>;
  }
  return <motion.div initial={{
    opacity: 0,
    y: 30
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} transition={{
    duration: 0.5
  }}>
      <CardGlassDark className="p-6 md:p-8" hover>
        <CardGlassDarkHeader icon={Calculator} title={t.title} />
        <p className="text-white/60 mb-6">{t.subtitle}</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Controls */}
          <div className="space-y-5">
            {/* Work Format */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-accent" />
                {t.workFormat}
                <CalculatorTooltip content={tt.workFormat} />
              </label>
              <Select value={workFormat} onValueChange={v => setWorkFormat(v as typeof workFormat)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-primary border-white/10">
                  <SelectItem value="online" className="text-white hover:bg-white/10">{t.online}</SelectItem>
                  <SelectItem value="combined" className="text-white hover:bg-white/10">{t.combined}</SelectItem>
                  <SelectItem value="startup" className="text-white hover:bg-white/10">{t.startup}</SelectItem>
                  <SelectItem value="noDpr" className="text-white hover:bg-white/10">{t.noDpr}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Work Hours */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                {t.workHours}
                <CalculatorTooltip content={tt.workHours} />
              </label>
              <div className="flex gap-2">
                <motion.button whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }} onClick={() => {
                setWorkHours(4);
                setProjectsCount(2);
              }} className={`flex-1 py-3 rounded-xl transition-all ${workHours === 4 ? 'bg-accent text-primary font-semibold' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>
                  {t.hours4}
                </motion.button>
                <motion.button whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }} onClick={() => {
                setWorkHours(8);
                setProjectsCount(1);
              }} className={`flex-1 py-3 rounded-xl transition-all ${workHours === 8 ? 'bg-accent text-primary font-semibold' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>
                  {t.hours8}
                </motion.button>
              </div>
            </div>

            {/* Projects Count - only for 4h */}
            {workHours === 4 && <motion.div initial={{
            opacity: 0,
            height: 0
          }} animate={{
            opacity: 1,
            height: 'auto'
          }} exit={{
            opacity: 0,
            height: 0
          }}>
                <label className="text-white/70 text-sm mb-2 flex items-center gap-2">{t.projectsCount}<CalculatorTooltip content={tt.projectsCount} /></label>
                <div className="flex gap-2">
                  <motion.button whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }} onClick={() => setProjectsCount(1)} className={`flex-1 py-3 rounded-xl transition-all ${projectsCount === 1 ? 'bg-accent text-primary font-semibold' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>
                    {t.project1}
                  </motion.button>
                  <motion.button whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }} onClick={() => setProjectsCount(2)} className={`flex-1 py-3 rounded-xl transition-all ${projectsCount === 2 ? 'bg-accent text-primary font-semibold' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>
                    {t.projects2}
                  </motion.button>
                </div>
              </motion.div>}

            {/* Region */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                {t.region}
                <CalculatorTooltip content={tt.region} />
              </label>
              <div className="flex gap-2">
                <motion.button whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }} onClick={() => setRegion('international')} className={`flex-1 py-3 rounded-xl transition-all ${region === 'international' ? 'bg-accent text-primary font-semibold' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>
                  {t.international}
                </motion.button>
                <motion.button whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }} onClick={() => setRegion('rf_cis')} className={`flex-1 py-3 rounded-xl transition-all ${region === 'rf_cis' ? 'bg-accent text-primary font-semibold' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>
                  {t.rfCis}
                </motion.button>
              </div>
            </div>

            {/* Project Duration */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                {t.projectDuration}
                <CalculatorTooltip content={tt.projectDuration} />
              </label>
              <Select value={projectDuration} onValueChange={v => setProjectDuration(v as typeof projectDuration)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-primary border-white/10">
                  <SelectItem value="up_to_1_month" className="text-white hover:bg-white/10">{t.upTo1Month}</SelectItem>
                  <SelectItem value="2_to_6_months" className="text-white hover:bg-white/10">{t.from2to6}</SelectItem>
                  <SelectItem value="7_to_12_months" className="text-white hover:bg-white/10">{t.from7to12}</SelectItem>
                  <SelectItem value="over_12_months" className="text-white hover:bg-white/10">{t.over12}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Monthly Revenue Slider */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-accent" />
                  {t.monthlyRevenue}
                  <CalculatorTooltip content={tt.monthlyRevenue} />
                </span>
                <span className="text-accent font-semibold">{formatMoney(monthlyRevenue)} ₽</span>
              </label>
              <Slider value={[monthlyRevenue]} onValueChange={([value]) => setMonthlyRevenue(value)} min={0} max={500000} step={10000} className="mt-2" />
              <div className="flex justify-between text-xs text-white/40 mt-1">
                <span>0</span>
                <span>250 000</span>
                <span>500 000</span>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="space-y-4">
            {/* Results Display */}
            <AnimatePresence mode="wait">
              {calculation && <motion.div key={`${calculation.totalIncome}-${calculation.fixPercent}`} initial={{
              opacity: 0,
              scale: 0.95
            }} animate={{
              opacity: 1,
              scale: 1
            }} exit={{
              opacity: 0,
              scale: 0.95
            }} transition={{
              duration: 0.3
            }} className="space-y-4">
                  {/* Base Tariff */}
                  <div className="p-4 glass-dark rounded-xl">
                    <p className="text-white/50 text-sm flex items-center gap-1">{t.baseTariff}<CalculatorTooltip content={tt.baseTariff} /></p>
                    <p className="text-xl font-bold text-white">{formatMoney(calculation.baseTariff)} ₽</p>
                  </div>

                  {/* Fix Part */}
                  <motion.div className="p-4 glass-dark rounded-xl border border-accent/30" whileHover={{
                borderColor: 'rgba(255,215,0,0.6)'
              }}>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-white/50 text-sm flex items-center gap-1">{t.fixPart}<CalculatorTooltip content={tt.fixPart} /></p>
                      <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                        {calculation.fixPercent}%
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-accent">{formatMoney(calculation.fixAmount)} ₽</p>
                  </motion.div>

                  {/* Variable Part */}
                  <motion.div className="p-4 glass-dark rounded-xl border border-accent/30" whileHover={{
                borderColor: 'rgba(255,215,0,0.6)'
              }}>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-white/50 text-sm flex items-center gap-1">{t.variablePart}<CalculatorTooltip content={tt.variablePart} /></p>
                      <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                        {calculation.variablePercent}%
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-accent">{formatMoney(calculation.variableAmount)} ₽</p>
                  </motion.div>

                  {/* Total */}
                  <motion.div className="p-6 gradient-gold rounded-2xl text-center" animate={{
                boxShadow: ['0 0 0 0 rgba(255,215,0,0)', '0 0 30px 10px rgba(255,215,0,0.15)', '0 0 0 0 rgba(255,215,0,0)']
              }} transition={{
                duration: 2,
                repeat: Infinity
              }}>
                    <p className="text-primary/70 text-sm font-medium mb-1">{t.totalIncome}</p>
                    <motion.p className="text-3xl font-black text-primary" key={calculation.totalIncome} initial={{
                  scale: 1.1
                }} animate={{
                  scale: 1
                }}>
                      {formatMoney(calculation.totalIncome)} ₽
                    </motion.p>
                    <p className="text-primary/60 text-xs mt-1">{t.perMonth}</p>
                  </motion.div>

                  {/* Currency Conversion */}
                  
                </motion.div>}
            </AnimatePresence>
          </div>
        </div>

        {/* Rules Section */}
        <motion.div className="mt-8 p-4 glass-dark rounded-xl border border-white/10" initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }}>
          <CardGlassDarkTitle icon={Info} className="mb-3 text-base">
            {t.rules}
          </CardGlassDarkTitle>
          <div className="space-y-2 text-white/60 text-sm">
            <p>{t.rule1}</p>
            <p>{t.rule2}</p>
            <p>{t.rule3}</p>
            <p>{t.rule4}</p>
          </div>
        </motion.div>
      </CardGlassDark>
    </motion.div>;
};
export default SalaryCalculator;