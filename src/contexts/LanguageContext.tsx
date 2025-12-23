import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ru' | 'en' | 'kz';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Record<Language, Record<string, string>> = {
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.work': 'Работа',
    'nav.conditions': 'Условия',
    
    // Work pages
    'work.arendaRopov': 'Аренда РОПов',
    'work.about': 'О компании',
    'work.community': 'Сообщество',
    'work.reports': 'Отчеты',
    'work.dpr': 'ДПР',
    'work.employees': 'Сотрудники',
    
    // Conditions pages
    'conditions.motivation': 'Мотивация',
    'conditions.training': 'Обучение',
    'conditions.projects': 'Проекты',
    'conditions.registration': 'Оформление',
    'conditions.payments': 'Выплаты',
    
    // Hero section
    'hero.badge': 'Активный набор',
    'hero.scrollDown': 'Листайте вниз',
    'hero.learnWork': 'Узнать о работе',
    'hero.workConditions': 'Условия работы',
    'hero.careerGrowth': 'Карьерный рост',
    
    // Footer
    'footer.slogan': 'Системно строим отделы продаж с 2017 года.',
    'footer.copyright': '© 2026 РЕНТРОП. МЫ СТРОИМ ПРОДАЖИ — ВЫ СТРОИТЕ БУДУЩЕЕ.',
    
    // Common
    'common.back': 'Назад',
    'common.backToConditions': '← Назад к условиям',
    'common.backToMotivation': '← Назад к Мотивации',
    'common.download': 'Скачать страницу',
    
    // Motivation page
    'motivation.title': 'Мотивация',
    'motivation.description': 'Узнайте о системе мотивации и вознаграждений',
    'motivation.viewTariffs': 'Таблицы тарифов и мотивации',
    'motivation.tariffTable': 'Таблица тарифов',
    'motivation.motivationTable': 'Таблица мотивации',
    
    // Motivation sub-pages
    'motivation.fix': 'Фикс',
    'motivation.fixDesc': 'Фиксированная часть оплаты',
    'motivation.variable': 'Переменка',
    'motivation.variableDesc': 'Переменная часть оплаты',
    'motivation.partner': 'Партнерка',
    'motivation.partnerDesc': 'Партнерская программа',
    'motivation.services': 'Услуги',
    'motivation.servicesDesc': 'Дополнительные услуги',
    'motivation.subpartner': 'Субпартнер',
    'motivation.subpartnerDesc': 'Субпартнерская программа',
    
    // Fix page
    'fix.title': 'Фикс',
    'fix.description': 'Фиксированная часть оплаты зависит от вашего грейда и опыта работы',
    'fix.vatTitle': 'Важная информация: НДС с 01.01.2026',
    'fix.vatInfo1': 'С 01.01.2026 цена в РФ на все услуги +5% к счету',
    'fix.vatInfo2': 'Договора и счета нужно будет переделать на "в стоимость включено 5% НДС"',
    'fix.vatInfo3': 'Мотивация команды и исполнителя берёт расчёт из основной стоимости услуги и не учитывает НДС',
    'fix.vatExample': 'Пример',
    'fix.vatExampleText': '120 000 рублей стоит аренда РОПа, счёт выставляется на 120 000+5% = 126 000 руб (6 000 рублей это НДС который мы обязаны отдать государству)',
    'fix.vatCalc1': 'Исполнитель получает мотивацию за расчёта тарифа 120к',
    'fix.vatCalc2': 'ОП получает % с 120к',
    'fix.vatCalc3': 'ДПР, Аккаунт, Освоение всё идёт в расчёт от 120к',
    'fix.vatNote': 'И так с абсолютно любой услугой для РФ клиента.',
    'fix.vatPs': 'P.S. для клиентов, которые хотят оплатить на карту мы можем НДС не брать.',
    'fix.vatFuture': 'Также усилится история связанная с документооборотом. В течении нескольких дней будет проработана оптимизация этого процесса с бухгалтерией.',
    'fix.tariffTable': 'Таблица тарифов',
    
    // Variable page
    'variable.title': 'Переменка',
    'variable.description': 'Переменная часть оплаты зависит от результатов вашей работы',
    'variable.tariffTable': 'Таблица тарифов',
    'variable.motivationTable': 'Таблица мотивации',
    
    // Partner page
    'partner.title': 'Партнерка',
    'partner.description': 'Приводи друзей и получай бонусы от их заработка',
    'partner.programTitle': 'Реферальная программа',
    'partner.reward': 'Вознаграждение',
    'partner.rewardValue': 'от 5% до 30% в течение 3 месяцев',
    'partner.details': 'Подробности в Telegram',
    
    // Services page
    'services.title': 'Услуги',
    'services.description': 'Дополнительные услуги и возможности заработка',
    
    // SubPartner page
    'subpartner.title': 'Субпартнер',
    'subpartner.description': 'Программа субпартнерства для расширенного сотрудничества',
    
    // Payments page
    'payments.title': 'Выплаты',
    'payments.schedule': 'График выплат',
    'payments.advance': 'Аванс 50% — 30 числа',
    'payments.final': 'Полный расчёт — 15 числа следующего месяца',
    
    // Conditions index
    'conditions.title': 'Условия работы',
    'conditions.description': 'Всё, что нужно знать о работе с нами',
    'conditions.motivationDesc': 'Система мотивации и бонусов',
    'conditions.trainingDesc': 'Программы обучения и развития',
    'conditions.projectsDesc': 'Текущие проекты и задачи',
    'conditions.registrationDesc': 'Процесс оформления',
    'conditions.paymentsDesc': 'График и условия выплат',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.work': 'Work',
    'nav.conditions': 'Conditions',
    
    // Work pages
    'work.arendaRopov': 'ROP Rental',
    'work.about': 'About Company',
    'work.community': 'Community',
    'work.reports': 'Reports',
    'work.dpr': 'DPR',
    'work.employees': 'Employees',
    
    // Conditions pages
    'conditions.motivation': 'Motivation',
    'conditions.training': 'Training',
    'conditions.projects': 'Projects',
    'conditions.registration': 'Registration',
    'conditions.payments': 'Payments',
    
    // Hero section
    'hero.badge': 'Active Hiring',
    'hero.scrollDown': 'Scroll down',
    'hero.learnWork': 'Learn about work',
    'hero.workConditions': 'Work conditions',
    'hero.careerGrowth': 'Career growth',
    
    // Footer
    'footer.slogan': 'Systematically building sales departments since 2017.',
    'footer.copyright': '© 2026 RENTROP. WE BUILD SALES — YOU BUILD THE FUTURE.',
    
    // Common
    'common.back': 'Back',
    'common.backToConditions': '← Back to conditions',
    'common.backToMotivation': '← Back to Motivation',
    'common.download': 'Download page',
    
    // Motivation page
    'motivation.title': 'Motivation',
    'motivation.description': 'Learn about the motivation and reward system',
    'motivation.viewTariffs': 'Tariff and motivation tables',
    'motivation.tariffTable': 'Tariff table',
    'motivation.motivationTable': 'Motivation table',
    
    // Motivation sub-pages
    'motivation.fix': 'Fixed',
    'motivation.fixDesc': 'Fixed part of payment',
    'motivation.variable': 'Variable',
    'motivation.variableDesc': 'Variable part of payment',
    'motivation.partner': 'Partnership',
    'motivation.partnerDesc': 'Partnership program',
    'motivation.services': 'Services',
    'motivation.servicesDesc': 'Additional services',
    'motivation.subpartner': 'Sub-partner',
    'motivation.subpartnerDesc': 'Sub-partnership program',
    
    // Fix page
    'fix.title': 'Fixed',
    'fix.description': 'The fixed part of payment depends on your grade and work experience',
    'fix.vatTitle': 'Important Information: VAT from 01.01.2026',
    'fix.vatInfo1': 'From 01.01.2026 price in Russia for all services +5% to the invoice',
    'fix.vatInfo2': 'Contracts and invoices will need to be changed to "5% VAT included in the price"',
    'fix.vatInfo3': 'Team and contractor motivation is calculated from the base service cost and does not include VAT',
    'fix.vatExample': 'Example',
    'fix.vatExampleText': 'ROP rental costs 120,000 rubles, invoice is issued for 120,000+5% = 126,000 rubles (6,000 rubles is VAT that we must pay to the state)',
    'fix.vatCalc1': 'Contractor receives motivation from 120k tariff calculation',
    'fix.vatCalc2': 'Sales department receives % from 120k',
    'fix.vatCalc3': 'DPR, Account, Development - all calculated from 120k',
    'fix.vatNote': 'This applies to absolutely any service for Russian clients.',
    'fix.vatPs': 'P.S. for clients who want to pay by card, we may not charge VAT.',
    'fix.vatFuture': 'Document workflow will also be enhanced. Optimization of this process with accounting will be developed within a few days.',
    'fix.tariffTable': 'Tariff table',
    
    // Variable page
    'variable.title': 'Variable',
    'variable.description': 'The variable part of payment depends on your work results',
    'variable.tariffTable': 'Tariff table',
    'variable.motivationTable': 'Motivation table',
    
    // Partner page
    'partner.title': 'Partnership',
    'partner.description': 'Refer friends and get bonuses from their earnings',
    'partner.programTitle': 'Referral program',
    'partner.reward': 'Reward',
    'partner.rewardValue': 'from 5% to 30% for 3 months',
    'partner.details': 'Details in Telegram',
    
    // Services page
    'services.title': 'Services',
    'services.description': 'Additional services and earning opportunities',
    
    // SubPartner page
    'subpartner.title': 'Sub-partner',
    'subpartner.description': 'Sub-partnership program for extended cooperation',
    
    // Payments page
    'payments.title': 'Payments',
    'payments.schedule': 'Payment schedule',
    'payments.advance': '50% advance — on the 30th',
    'payments.final': 'Full settlement — on the 15th of the following month',
    
    // Conditions index
    'conditions.title': 'Work Conditions',
    'conditions.description': 'Everything you need to know about working with us',
    'conditions.motivationDesc': 'Motivation and bonus system',
    'conditions.trainingDesc': 'Training and development programs',
    'conditions.projectsDesc': 'Current projects and tasks',
    'conditions.registrationDesc': 'Registration process',
    'conditions.paymentsDesc': 'Payment schedule and conditions',
  },
  kz: {
    // Navigation
    'nav.home': 'Басты бет',
    'nav.work': 'Жұмыс',
    'nav.conditions': 'Шарттар',
    
    // Work pages
    'work.arendaRopov': 'РОП жалға алу',
    'work.about': 'Компания туралы',
    'work.community': 'Қауымдастық',
    'work.reports': 'Есептер',
    'work.dpr': 'ДПР',
    'work.employees': 'Қызметкерлер',
    
    // Conditions pages
    'conditions.motivation': 'Мотивация',
    'conditions.training': 'Оқыту',
    'conditions.projects': 'Жобалар',
    'conditions.registration': 'Рәсімдеу',
    'conditions.payments': 'Төлемдер',
    
    // Hero section
    'hero.badge': 'Белсенді жалдау',
    'hero.scrollDown': 'Төмен айналдырыңыз',
    'hero.learnWork': 'Жұмыс туралы білу',
    'hero.workConditions': 'Жұмыс шарттары',
    'hero.careerGrowth': 'Мансаптық өсу',
    
    // Footer
    'footer.slogan': '2017 жылдан бері сату бөлімдерін жүйелі құрамыз.',
    'footer.copyright': '© 2026 РЕНТРОП. БІЗ САТУДЫ ҚҰРАМЫЗ — СІЗ БОЛАШАҚТЫ ҚҰРАСЫЗ.',
    
    // Common
    'common.back': 'Артқа',
    'common.backToConditions': '← Шарттарға оралу',
    'common.backToMotivation': '← Мотивацияға оралу',
    'common.download': 'Бетті жүктеу',
    
    // Motivation page
    'motivation.title': 'Мотивация',
    'motivation.description': 'Мотивация және марапаттау жүйесі туралы біліңіз',
    'motivation.viewTariffs': 'Тариф және мотивация кестелері',
    'motivation.tariffTable': 'Тариф кестесі',
    'motivation.motivationTable': 'Мотивация кестесі',
    
    // Motivation sub-pages
    'motivation.fix': 'Фикс',
    'motivation.fixDesc': 'Төлемнің тұрақты бөлігі',
    'motivation.variable': 'Айнымалы',
    'motivation.variableDesc': 'Төлемнің айнымалы бөлігі',
    'motivation.partner': 'Серіктестік',
    'motivation.partnerDesc': 'Серіктестік бағдарламасы',
    'motivation.services': 'Қызметтер',
    'motivation.servicesDesc': 'Қосымша қызметтер',
    'motivation.subpartner': 'Субсеріктес',
    'motivation.subpartnerDesc': 'Субсеріктестік бағдарламасы',
    
    // Fix page
    'fix.title': 'Фикс',
    'fix.description': 'Төлемнің тұрақты бөлігі сіздің грейдіңіз бен жұмыс тәжірибеңізге байланысты',
    'fix.vatTitle': 'Маңызды ақпарат: ҚҚС 01.01.2026 жылдан бастап',
    'fix.vatInfo1': '01.01.2026 жылдан бастап Ресейдегі барлық қызметтерге +5% шотқа',
    'fix.vatInfo2': 'Келісімшарттар мен шоттарды "бағаға 5% ҚҚС кіреді" деп өзгерту керек',
    'fix.vatInfo3': 'Команда мен орындаушының мотивациясы негізгі қызмет құнынан есептеледі және ҚҚС-ны қамтымайды',
    'fix.vatExample': 'Мысал',
    'fix.vatExampleText': 'РОП жалға алу 120 000 рубль тұрады, шот 120 000+5% = 126 000 рубльге жазылады (6 000 рубль — мемлекетке беруге тиіс ҚҚС)',
    'fix.vatCalc1': 'Орындаушы 120к тариф есебінен мотивация алады',
    'fix.vatCalc2': 'Сату бөлімі 120к-дан % алады',
    'fix.vatCalc3': 'ДПР, Аккаунт, Игеру — барлығы 120к-дан есептеледі',
    'fix.vatNote': 'Бұл Ресей клиенттеріне арналған кез келген қызметке қолданылады.',
    'fix.vatPs': 'P.S. картамен төлегісі келетін клиенттер үшін ҚҚС алмауымыз мүмкін.',
    'fix.vatFuture': 'Құжат айналымы да күшейтіледі. Бухгалтериямен бірнеше күн ішінде осы процесті оңтайландыру әзірленеді.',
    'fix.tariffTable': 'Тариф кестесі',
    
    // Variable page
    'variable.title': 'Айнымалы',
    'variable.description': 'Төлемнің айнымалы бөлігі сіздің жұмыс нәтижелеріңізге байланысты',
    'variable.tariffTable': 'Тариф кестесі',
    'variable.motivationTable': 'Мотивация кестесі',
    
    // Partner page
    'partner.title': 'Серіктестік',
    'partner.description': 'Достарыңызды шақырыңыз және олардың табысынан бонус алыңыз',
    'partner.programTitle': 'Реферал бағдарламасы',
    'partner.reward': 'Марапат',
    'partner.rewardValue': '3 ай бойы 5%-дан 30%-ға дейін',
    'partner.details': 'Толығырақ Telegram-да',
    
    // Services page
    'services.title': 'Қызметтер',
    'services.description': 'Қосымша қызметтер және табыс мүмкіндіктері',
    
    // SubPartner page
    'subpartner.title': 'Субсеріктес',
    'subpartner.description': 'Кеңейтілген ынтымақтастық үшін субсеріктестік бағдарламасы',
    
    // Payments page
    'payments.title': 'Төлемдер',
    'payments.schedule': 'Төлем кестесі',
    'payments.advance': '50% аванс — 30 күні',
    'payments.final': 'Толық есеп айырысу — келесі айдың 15-і',
    
    // Conditions index
    'conditions.title': 'Жұмыс шарттары',
    'conditions.description': 'Бізбен жұмыс істеу туралы білуіңіз керек барлық нәрсе',
    'conditions.motivationDesc': 'Мотивация және бонус жүйесі',
    'conditions.trainingDesc': 'Оқыту және даму бағдарламалары',
    'conditions.projectsDesc': 'Ағымдағы жобалар мен тапсырмалар',
    'conditions.registrationDesc': 'Тіркеу процесі',
    'conditions.paymentsDesc': 'Төлем кестесі мен шарттары',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ru';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
