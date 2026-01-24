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
    workFormat: `📋 Формат работы (Приложение №1)

• Онлайн — полностью удалённая работа без выездов к клиенту. Подходит для проектов, где все задачи решаются дистанционно.

• Комбинированный — включает выезды к клиенту. Тариф выше из-за командировочных расходов и личных встреч.

• Стартап — работа с новыми проектами компании. Требует больше времени на настройку процессов.

• Без ДПР — работа без ведения документооборота по проекту. Тариф ниже, т.к. меньше административной нагрузки.

💡 Пример: При онлайн-формате на 8 часов базовый тариф для международных проектов составляет 80 000₽.`,
    workHours: `⏰ Часы работы (Приложение №1)

• 4 часа — неполный рабочий день. Можно вести 1 или 2 проекта одновременно.

• 8 часов — полный рабочий день. Ведение одного проекта с полным погружением.

💡 Пример: При 4 часах и 2 проектах базовый тариф удваивается. Если тариф за 1 проект = 40 000₽, то за 2 = 80 000₽.

⚠️ Важно: При 4-часовом формате доступна опция выбора количества проектов.`,
    projectsCount: `🗂 Количество проектов (Приложение №1)

При неполном рабочем дне (4 часа) вы можете выбрать:

• 1 проект — фокус на одном клиенте с меньшей нагрузкой.

• 2 проекта — ведение двух клиентов параллельно, базовый тариф умножается на 2.

💡 Пример расчёта для 2 проектов:
— Тариф за проект: 40 000₽
— Итого базовый: 40 000 × 2 = 80 000₽
— Фикс (50%): 40 000₽
— Переменная рассчитывается по каждому проекту отдельно.`,
    region: `🌍 Регион проекта (Приложение №1)

• Международный — проекты вне СНГ (Европа, США, Азия и др.). Тариф выше из-за разницы в часовых поясах и языковых требований.

• РФ/СНГ — проекты в России и странах СНГ. Стандартный тариф.

💡 Пример разницы тарифов (8 часов, онлайн):
— Международный: 80 000₽
— РФ/СНГ: 70 000₽

⚠️ Для некоторых форматов тариф РФ/СНГ может совпадать с международным.`,
    projectDuration: `📅 Срок работы на проекте (Приложение №1)

Чем дольше вы работаете с клиентом, тем выше ваши проценты:

• До 1 месяца — начальный период, минимальные проценты (Фикс 50%, Переменная зависит от оборота).

• 2–6 месяцев — стандартный период, повышенные проценты.

• 7–12 месяцев — опытный РОП, ещё выше проценты.

• 12+ месяцев — максимальные проценты за лояльность.

💡 Пример: При обороте 100 000₽ и сроке 12+ месяцев переменная может достигать 7-10% вместо 5-6% на старте.`,
    monthlyRevenue: `💰 Месячный оборот клиента (Приложение №1)

Оборот влияет на процент переменной части:

• До 60 000₽ — начальный уровень, базовый процент переменной.

• 60 000–120 000₽ — средний уровень, повышенный процент.

• Свыше 120 000₽ — высокий оборот, максимальный процент переменной.

💡 Пример при сроке 2-6 месяцев:
— Оборот 50 000₽ → Переменная 5% = 2 500₽
— Оборот 100 000₽ → Переменная 6% = 6 000₽
— Оборот 200 000₽ → Переменная 7% = 14 000₽`,
    baseTariff: `📊 Базовый тариф (Приложение №1)

Базовый тариф — это основа для расчёта фиксированной части вашего дохода.

Зависит от:
• Формата работы (Онлайн/Комбинированный/Стартап/Без ДПР)
• Количества часов (4 или 8)
• Региона (Международный или РФ/СНГ)
• Количества проектов (при 4 часах)

💡 Пример: Онлайн, 8 часов, Международный = 80 000₽
При 2 проектах (4 часа каждый): 40 000 × 2 = 80 000₽

Базовый тариф умножается на процент фикса для получения вашего дохода.`,
    fixPart: `💵 Фиксированная часть (Приложение №1)

Формула: Базовый тариф × Процент фикса

Процент фикса зависит от срока работы на проекте:
• До 1 месяца: 50%
• 2–6 месяцев: повышенный %
• 7–12 месяцев: ещё выше
• 12+ месяцев: максимальный %

💡 Пример расчёта:
— Базовый тариф: 80 000₽
— Срок: 2-6 месяцев, Фикс: 60%
— Фиксированная часть: 80 000 × 0.6 = 48 000₽

⚠️ При расторжении до 1 месяца фикс снижается до 30%!`,
    variablePart: `📈 Переменная часть (Приложение №1)

Формула: Оборот клиента × Процент переменной

Процент зависит от:
• Срока работы на проекте
• Размера месячного оборота клиента

💡 Пример расчёта:
— Оборот клиента: 100 000₽
— Срок: 7-12 месяцев
— Процент переменной: 7%
— Переменная часть: 100 000 × 0.07 = 7 000₽

💰 Итого доход = Фикс + Переменная
Если Фикс = 48 000₽, то Итого = 48 000 + 7 000 = 55 000₽

⚠️ При расторжении до 1 месяца переменная = 0!`,
  },
  en: {
    workFormat: `📋 Work Format (Annex No. 1)

• Online — fully remote work without client visits. Suitable for projects where all tasks are solved remotely.

• Combined — includes on-site visits to the client. Higher tariff due to travel expenses and personal meetings.

• Startup — working with new company projects. Requires more time for process setup.

• Without DPR — work without project documentation management. Lower tariff due to less administrative load.

💡 Example: With online format for 8 hours, the base tariff for international projects is 80,000₽.`,
    workHours: `⏰ Work Hours (Annex No. 1)

• 4 hours — part-time. You can manage 1 or 2 projects simultaneously.

• 8 hours — full-time. Managing one project with full immersion.

💡 Example: With 4 hours and 2 projects, the base tariff doubles. If tariff per project = 40,000₽, then for 2 = 80,000₽.

⚠️ Important: With 4-hour format, the option to choose the number of projects is available.`,
    projectsCount: `🗂 Projects Count (Annex No. 1)

With part-time work (4 hours) you can choose:

• 1 project — focus on one client with less workload.

• 2 projects — managing two clients in parallel, base tariff is multiplied by 2.

💡 Calculation example for 2 projects:
— Tariff per project: 40,000₽
— Total base: 40,000 × 2 = 80,000₽
— Fix (50%): 40,000₽
— Variable is calculated for each project separately.`,
    region: `🌍 Project Region (Annex No. 1)

• International — projects outside CIS (Europe, USA, Asia, etc.). Higher tariff due to time zone differences and language requirements.

• RF/CIS — projects in Russia and CIS countries. Standard tariff.

💡 Tariff difference example (8 hours, online):
— International: 80,000₽
— RF/CIS: 70,000₽

⚠️ For some formats, RF/CIS tariff may match international.`,
    projectDuration: `📅 Project Duration (Annex No. 1)

The longer you work with a client, the higher your percentages:

• Up to 1 month — initial period, minimum percentages (Fix 50%, Variable depends on turnover).

• 2–6 months — standard period, increased percentages.

• 7–12 months — experienced ROP, even higher percentages.

• 12+ months — maximum percentages for loyalty.

💡 Example: With turnover of 100,000₽ and 12+ months tenure, variable can reach 7-10% instead of 5-6% at start.`,
    monthlyRevenue: `💰 Client Monthly Turnover (Annex No. 1)

Turnover affects the variable part percentage:

• Up to 60,000₽ — entry level, base variable percentage.

• 60,000–120,000₽ — medium level, increased percentage.

• Over 120,000₽ — high turnover, maximum variable percentage.

💡 Example for 2-6 months tenure:
— Turnover 50,000₽ → Variable 5% = 2,500₽
— Turnover 100,000₽ → Variable 6% = 6,000₽
— Turnover 200,000₽ → Variable 7% = 14,000₽`,
    baseTariff: `📊 Base Tariff (Annex No. 1)

Base tariff is the foundation for calculating the fixed part of your income.

Depends on:
• Work format (Online/Combined/Startup/Without DPR)
• Hours (4 or 8)
• Region (International or RF/CIS)
• Number of projects (for 4 hours)

💡 Example: Online, 8 hours, International = 80,000₽
With 2 projects (4 hours each): 40,000 × 2 = 80,000₽

Base tariff is multiplied by fix percentage to get your income.`,
    fixPart: `💵 Fixed Part (Annex No. 1)

Formula: Base Tariff × Fix Percentage

Fix percentage depends on project tenure:
• Up to 1 month: 50%
• 2–6 months: increased %
• 7–12 months: even higher
• 12+ months: maximum %

💡 Calculation example:
— Base tariff: 80,000₽
— Tenure: 2-6 months, Fix: 60%
— Fixed part: 80,000 × 0.6 = 48,000₽

⚠️ If terminated before 1 month, fix drops to 30%!`,
    variablePart: `📈 Variable Part (Annex No. 1)

Formula: Client Turnover × Variable Percentage

Percentage depends on:
• Project tenure
• Client monthly turnover amount

💡 Calculation example:
— Client turnover: 100,000₽
— Tenure: 7-12 months
— Variable percentage: 7%
— Variable part: 100,000 × 0.07 = 7,000₽

💰 Total income = Fix + Variable
If Fix = 48,000₽, then Total = 48,000 + 7,000 = 55,000₽

⚠️ If terminated before 1 month, variable = 0!`,
  },
  kz: {
    workFormat: `📋 Жұмыс форматы (№1 қосымша)

• Онлайн — клиентке шықпай толық қашықтан жұмыс. Барлық тапсырмалар қашықтан шешілетін жобаларға қолайлы.

• Аралас — клиентке шығуды қамтиды. Іссапар шығындары мен жеке кездесулерге байланысты тариф жоғары.

• Стартап — компанияның жаңа жобаларымен жұмыс. Процестерді баптауға көбірек уақыт қажет.

• ДПР-сіз — жоба құжаттамасын жүргізусіз жұмыс. Әкімшілік жүктеме аз болғандықтан тариф төмен.

💡 Мысал: Халықаралық жобалар үшін 8 сағаттық онлайн форматта базалық тариф 80 000₽.`,
    workHours: `⏰ Жұмыс сағаттары (№1 қосымша)

• 4 сағат — толық емес жұмыс күні. 1 немесе 2 жобаны бір мезгілде жүргізуге болады.

• 8 сағат — толық жұмыс күні. Бір жобаны толық қамтумен жүргізу.

💡 Мысал: 4 сағат және 2 жобада базалық тариф екі есе артады. Жоба тарифі = 40 000₽ болса, 2 үшін = 80 000₽.

⚠️ Маңызды: 4 сағаттық форматта жобалар санын таңдау мүмкіндігі бар.`,
    projectsCount: `🗂 Жобалар саны (№1 қосымша)

Толық емес жұмыс күнінде (4 сағат) таңдай аласыз:

• 1 жоба — жүктемесі аз бір клиентке назар аудару.

• 2 жоба — екі клиентті параллель жүргізу, базалық тариф 2-ге көбейтіледі.

💡 2 жоба үшін есептеу мысалы:
— Жоба тарифі: 40 000₽
— Жалпы базалық: 40 000 × 2 = 80 000₽
— Фикс (50%): 40 000₽
— Айнымалы әр жоба бойынша бөлек есептеледі.`,
    region: `🌍 Жоба аймағы (№1 қосымша)

• Халықаралық — ТМД-дан тыс жобалар (Еуропа, АҚШ, Азия және т.б.). Уақыт белдеуі айырмашылығы мен тіл талаптарына байланысты тариф жоғары.

• РФ/ТМД — Ресей және ТМД елдеріндегі жобалар. Стандартты тариф.

💡 Тариф айырмашылығы мысалы (8 сағат, онлайн):
— Халықаралық: 80 000₽
— РФ/ТМД: 70 000₽

⚠️ Кейбір форматтар үшін РФ/ТМД тарифі халықаралықпен сәйкес келуі мүмкін.`,
    projectDuration: `📅 Жобадағы жұмыс мерзімі (№1 қосымша)

Клиентпен неғұрлым ұзақ жұмыс істесеңіз, пайыздарыңыз соғұрлым жоғары:

• 1 айға дейін — бастапқы кезең, минималды пайыздар (Фикс 50%, Айнымалы айналымға байланысты).

• 2–6 ай — стандартты кезең, арттырылған пайыздар.

• 7–12 ай — тәжірибелі РОП, одан да жоғары пайыздар.

• 12+ ай — адалдық үшін максималды пайыздар.

💡 Мысал: 100 000₽ айналым және 12+ ай мерзімінде айнымалы бастапқы 5-6% орнына 7-10%-ға жетуі мүмкін.`,
    monthlyRevenue: `💰 Клиенттің айлық айналымы (№1 қосымша)

Айналым айнымалы бөлік пайызына әсер етеді:

• 60 000₽ дейін — бастапқы деңгей, базалық айнымалы пайызы.

• 60 000–120 000₽ — орта деңгей, арттырылған пайыз.

• 120 000₽ жоғары — жоғары айналым, максималды айнымалы пайызы.

💡 2-6 ай мерзіміне мысал:
— Айналым 50 000₽ → Айнымалы 5% = 2 500₽
— Айналым 100 000₽ → Айнымалы 6% = 6 000₽
— Айналым 200 000₽ → Айнымалы 7% = 14 000₽`,
    baseTariff: `📊 Базалық тариф (№1 қосымша)

Базалық тариф — табысыңыздың тұрақты бөлігін есептеу негізі.

Мынаған байланысты:
• Жұмыс форматы (Онлайн/Аралас/Стартап/ДПР-сіз)
• Сағаттар саны (4 немесе 8)
• Аймақ (Халықаралық немесе РФ/ТМД)
• Жобалар саны (4 сағатта)

💡 Мысал: Онлайн, 8 сағат, Халықаралық = 80 000₽
2 жобамен (әрқайсысы 4 сағат): 40 000 × 2 = 80 000₽

Табысыңызды алу үшін базалық тариф фикс пайызына көбейтіледі.`,
    fixPart: `💵 Тұрақты бөлік (№1 қосымша)

Формула: Базалық тариф × Фикс пайызы

Фикс пайызы жобадағы жұмыс мерзіміне байланысты:
• 1 айға дейін: 50%
• 2–6 ай: арттырылған %
• 7–12 ай: одан да жоғары
• 12+ ай: максималды %

💡 Есептеу мысалы:
— Базалық тариф: 80 000₽
— Мерзім: 2-6 ай, Фикс: 60%
— Тұрақты бөлік: 80 000 × 0.6 = 48 000₽

⚠️ 1 айға дейін бұзылса, фикс 30%-ға дейін төмендейді!`,
    variablePart: `📈 Айнымалы бөлік (№1 қосымша)

Формула: Клиент айналымы × Айнымалы пайызы

Пайыз мынаған байланысты:
• Жобадағы жұмыс мерзімі
• Клиенттің айлық айналым мөлшері

💡 Есептеу мысалы:
— Клиент айналымы: 100 000₽
— Мерзім: 7-12 ай
— Айнымалы пайызы: 7%
— Айнымалы бөлік: 100 000 × 0.07 = 7 000₽

💰 Жалпы табыс = Фикс + Айнымалы
Фикс = 48 000₽ болса, Жалпы = 48 000 + 7 000 = 55 000₽

⚠️ 1 айға дейін бұзылса, айнымалы = 0!`,
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