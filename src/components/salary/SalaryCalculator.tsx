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
    workFormat:
      'Приложение №1 (формат работы)\n\n' +
      '• Онлайн — полностью удалённо, коммуникация и задачи ведутся в цифровых каналах.\n' +
      '• Комбинированный — удалённо + возможны выезды/встречи по необходимости.\n' +
      '• Стартап — работа с новыми/запускаемыми проектами (обычно больше хаоса и задач).\n' +
      '• Без ДПР — без ведения документооборота/отчетности по проекту (упрощенный контур).\n\n' +
      'Пример: при одинаковых часах и регионе тариф «Комбинированный» может быть выше «Онлайн» из‑за дополнительных обязательств.',
    workHours:
      'Приложение №1 (часы)\n\n' +
      '• 4 часа — неполная занятость.\n' +
      '• 8 часов — полная занятость.\n\n' +
      'Важно: при 4 часах допускается вести 2 проекта (если выбран 2 проекта — базовый тариф для 4 часов удваивается).\n\n' +
      'Пример: базовый тариф 35 000 ₽ при 4ч/1 проект → при 4ч/2 проекта = 70 000 ₽ (×2).',
    projectsCount:
      'Приложение №1 (количество проектов)\n\n' +
      '• 1 проект — стандартная нагрузка.\n' +
      '• 2 проекта — допускается только при 4 часах и отражается увеличением базового тарифа.\n\n' +
      'Пример: 4 часа + 2 проекта → базовый тариф удваивается, а проценты фикса/переменной применяются уже к новой базе.',
    region:
      'Приложение №1 (регион проекта)\n\n' +
      '• Международный — проекты вне СНГ (как правило, выше требования/ставки).\n' +
      '• РФ/СНГ — проекты в России и странах СНГ.\n\n' +
      'Пример: база 40 000 ₽ (РФ/СНГ) vs 55 000 ₽ (Международный) при одинаковых формате/часах.',
    projectDuration:
      'Приложение №1 (срок работы на проекте)\n\n' +
      'Чем дольше вы ведете проект, тем выше процент фикса и/или переменной части (ступени по сроку).\n\n' +
      'Пример: база 60 000 ₽ и фикс 50% → фикс = 30 000 ₽. Если по сроку фикс вырос до 60% → фикс = 36 000 ₽.',
    monthlyRevenue:
      'Приложение №1 (оборот в месяц)\n\n' +
      'Оборот клиента влияет на процент переменной части: используются пороги (например: до 60k, 60–120k, 120k+).\n\n' +
      'Пример: оборот 100 000 ₽, переменная 10% → переменная = 10 000 ₽.\n' +
      'Если оборот 130 000 ₽ и переменная 12% → переменная = 15 600 ₽.',
    baseTariff:
      'Базовый тариф (Приложение №1)\n\n' +
      'Это база для расчёта фиксированной части. Зависит от формата работы, часов и региона.\n' +
      'Если выбрано 4 часа и 2 проекта — база удваивается.\n\n' +
      'Пример: база 50 000 ₽. Фикс 55% → 27 500 ₽. Переменная отдельно от оборота.',
    fixPart:
      'Фиксированная часть (Приложение №1)\n\n' +
      'Фикс = Базовый тариф × % фикса.\n' +
      'Процент зависит от срока работы на проекте (ступени).\n\n' +
      'Пример: база 70 000 ₽ × 50% = 35 000 ₽.',
    variablePart:
      'Переменная часть (Приложение №1)\n\n' +
      'Переменная = Оборот клиента × % переменной.\n' +
      'Процент зависит от срока на проекте и диапазона оборота.\n\n' +
      'Пример: оборот 120 000 ₽ × 8% = 9 600 ₽.\n' +
      'Итого доход = фикс + переменная.',
  },
  en: {
    workFormat:
      'Annex 1 (work format)\n\n' +
      '• Online — fully remote.\n' +
      '• Combined — remote + occasional on-site visits/meetings.\n' +
      '• Startup — new/launch-stage projects.\n' +
      '• Without DPR — without project paperwork/reporting.\n\n' +
      'Example: with the same hours/region, “Combined” may have a higher base tariff than “Online”.',
    workHours:
      'Annex 1 (hours)\n\n' +
      '• 4 hours — part-time.\n' +
      '• 8 hours — full-time.\n\n' +
      'Important: with 4 hours you may manage 2 projects; if you choose 2 projects, the base tariff for 4 hours doubles.\n\n' +
      'Example: base 35,000 ₽ at 4h/1 project → 70,000 ₽ at 4h/2 projects (×2).',
    projectsCount:
      'Annex 1 (projects count)\n\n' +
      '• 1 project — standard workload.\n' +
      '• 2 projects — allowed only at 4 hours and increases the base tariff.\n\n' +
      'Example: 4h + 2 projects → base tariff doubles, then fix/variable % apply to that new base.',
    region:
      'Annex 1 (region)\n\n' +
      '• International — projects outside CIS (often higher requirements/rates).\n' +
      '• RF/CIS — projects in Russia and CIS countries.\n\n' +
      'Example: base 40,000 ₽ (RF/CIS) vs 55,000 ₽ (International) at the same format/hours.',
    projectDuration:
      'Annex 1 (project tenure)\n\n' +
      'The longer you work on a project, the higher your fix/variable percentages (tiered by duration).\n\n' +
      'Example: base 60,000 ₽ and fix 50% → 30,000 ₽. If the fix tier becomes 60% → 36,000 ₽.',
    monthlyRevenue:
      'Annex 1 (monthly turnover)\n\n' +
      'Turnover affects the variable percentage via thresholds (e.g., up to 60k, 60–120k, 120k+).\n\n' +
      'Example: 100,000 ₽ turnover, 10% variable → 10,000 ₽.\n' +
      '130,000 ₽ turnover, 12% variable → 15,600 ₽.',
    baseTariff:
      'Base tariff (Annex 1)\n\n' +
      'This is the base for the fixed part. It depends on format, hours, and region.\n' +
      'If 4 hours + 2 projects is selected, the base doubles.\n\n' +
      'Example: base 50,000 ₽, fix 55% → 27,500 ₽.',
    fixPart:
      'Fixed part (Annex 1)\n\n' +
      'Fixed = Base tariff × Fix %.\n' +
      'Fix % depends on project tenure (tiered).\n\n' +
      'Example: 70,000 ₽ × 50% = 35,000 ₽.',
    variablePart:
      'Variable part (Annex 1)\n\n' +
      'Variable = Client turnover × Variable %.\n' +
      'Variable % depends on tenure and turnover tier.\n\n' +
      'Example: 120,000 ₽ × 8% = 9,600 ₽.\n' +
      'Total income = fixed + variable.',
  },
  kz: {
    workFormat:
      'Қосымша №1 (жұмыс форматы)\n\n' +
      '• Онлайн — толық қашықтан.\n' +
      '• Аралас — қашықтан + қажет болса шығу/кездесу.\n' +
      '• Стартап — жаңа/іске қосылатын жобалар.\n' +
      '• ДПР-сіз — жоба құжаттамасын/есепті жүргізбей.\n\n' +
      'Мысал: бірдей сағат/аймақта «Аралас» тарифі «Онлайннан» жоғары болуы мүмкін.',
    workHours:
      'Қосымша №1 (сағат)\n\n' +
      '• 4 сағат — толық емес жұмыс күні.\n' +
      '• 8 сағат — толық жұмыс күні.\n\n' +
      'Маңызды: 4 сағатта 2 жобаны жүргізуге болады; 2 жоба таңдалса, базалық тариф екі есе өседі.\n\n' +
      'Мысал: 4сағ/1 жоба 35 000 ₽ → 4сағ/2 жоба 70 000 ₽ (×2).',
    projectsCount:
      'Қосымша №1 (жобалар саны)\n\n' +
      '• 1 жоба — стандартты жүктеме.\n' +
      '• 2 жоба — тек 4 сағатта және базалық тарифті арттырады.\n\n' +
      'Мысал: 4 сағат + 2 жоба → базалық тариф ×2, содан кейін фикс/айнымалы пайызы қолданылады.',
    region:
      'Қосымша №1 (аймақ)\n\n' +
      '• Халықаралық — ТМД-дан тыс жобалар.\n' +
      '• РФ/ТМД — Ресей және ТМД елдеріндегі жобалар.\n\n' +
      'Мысал: база 40 000 ₽ (РФ/ТМД) vs 55 000 ₽ (Халықаралық).',
    projectDuration:
      'Қосымша №1 (жобадағы мерзім)\n\n' +
      'Жобада ұзақ жұмыс істеген сайын фикс/айнымалы пайыз жоғарылайды (сатылы түрде).\n\n' +
      'Мысал: база 60 000 ₽ және фикс 50% → 30 000 ₽. Фикс 60% болса → 36 000 ₽.',
    monthlyRevenue:
      'Қосымша №1 (айлық айналым)\n\n' +
      'Айналым айнымалы пайызға шектер арқылы әсер етеді (мысалы: 60k дейін, 60–120k, 120k+).\n\n' +
      'Мысал: айналым 100 000 ₽, 10% → 10 000 ₽.\n' +
      'Айналым 130 000 ₽, 12% → 15 600 ₽.',
    baseTariff:
      'Базалық тариф (Қосымша №1)\n\n' +
      'Бұл фикс бөлігін есептеудің негізі. Формат/сағат/аймаққа байланысты.\n' +
      '4 сағат + 2 жоба болса — база ×2.\n\n' +
      'Мысал: база 50 000 ₽, фикс 55% → 27 500 ₽.',
    fixPart:
      'Фикс бөлігі (Қосымша №1)\n\n' +
      'Фикс = Базалық тариф × Фикс %.\n\n' +
      'Мысал: 70 000 ₽ × 50% = 35 000 ₽.',
    variablePart:
      'Айнымалы бөлік (Қосымша №1)\n\n' +
      'Айнымалы = Клиент айналымы × Айнымалы %.\n\n' +
      'Мысал: 120 000 ₽ × 8% = 9 600 ₽.\n' +
      'Жалпы табыс = фикс + айнымалы.',
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