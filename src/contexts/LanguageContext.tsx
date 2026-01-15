import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Language = 'ru' | 'en' | 'kz';

// Map Telegram language_code to app Language
export const mapTelegramLanguage = (telegramLang: string | null | undefined): Language => {
  if (!telegramLang) return 'ru';
  const code = telegramLang.toLowerCase();
  if (code === 'ru') return 'ru';
  if (code === 'en') return 'en';
  if (code === 'kk') return 'kz'; // Kazakh in Telegram is 'kk'
  return 'ru'; // Default to Russian for all other languages
};

interface Translation {
  key: string;
  text_ru: string;
  text_en: string;
  text_kz: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  setLanguageFromTelegram: (telegramLangCode: string | null | undefined) => void;
  t: (key: string) => string;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Record<Language, Record<string, string>> = {
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.work': 'Работа',
    'nav.conditions': 'Условия',
    'nav.wiki': 'Вики',
    'nav.menu': 'Меню',
    'nav.profile': 'Профиль',
    'nav.projects': 'Проекты',
    'nav.aiChat': 'ИИ Чат',
    
    // Work pages
    'work.title': 'Работа',
    'work.subtitle': 'Узнайте больше о работе в РентРОП',
    'work.arendaRopov': 'Аренда РОПов',
    'work.arendaRopovDesc': 'Основной продукт компании — аренда руководителей отделов продаж',
    'work.about': 'О компании',
    'work.aboutDesc': 'История компании с 2017 года и наши достижения',
    'work.community': 'Сообщество',
    'work.communityDesc': 'Первое сообщество про продажи для РОПов и предпринимателей',
    'work.reports': 'Отчеты',
    'work.reportsDesc': 'Система ежедневной и еженедельной отчетности',
    'work.dpr': 'ДПР',
    'work.dprDesc': 'Директора по развитию — наставники для РОПов',
    'work.employees': 'Сотрудники',
    'work.employeesDesc': 'Структура отделов компании',
    'work.backToWork': 'Назад к разделу Работа',
    
    // About Company
    'about.title': 'О компании',
    'about.history': 'История',
    'about.historyText1': 'История компании начинается в феврале 2017 года, более 5 лет. Начинали с построения удаленных отделов продаж под ключ, так как было очень мало специалистов по построению удаленки.',
    'about.academyText': 'В 2018 запустили академию ВАШ РОП — первая академия руководителей отделов продаж.',
    'about.firstProjectText': 'Первый проект по Аренде РОПа начался в апреле 2020, на старте пандемии. На проекте и сейчас работает арендованный РОП.',
    'about.flagshipText': 'За последние пару лет Аренда РОПов стала флагманом среди наших услуг и заслужила доверие сотен клиентов. Позволила кратно увеличиваться каждый год.',
    'about.viewCases': 'Посмотреть кейсы →',
    
    // Arenda Ropov
    'arenda.title': 'Аренда РОПов',
    'arenda.product': 'Продукт',
    'arenda.productTitle': 'Основной продукт — Аренда Руководителей Отделов Продаж.',
    'arenda.productDesc': 'Мы обучаем специалистов и сдаем в Аренду. Специалист работает в нашем штате, но выполняет обязанности РОПа у заказчика. Работает удаленно.',
    'arenda.payment': 'Оплата труда',
    'arenda.paymentDesc': 'За работу РОП получает зарплату состоящую из двух частей:',
    'arenda.fixedPremium': 'Фиксированная премия',
    'arenda.fixedPremiumDesc': '— оклад за работу.',
    'arenda.variablePremium': 'Переменная премия',
    'arenda.variablePremiumDesc': '— оплата за результат по итогу месяца.',
    'arenda.variablePart': 'Переменная часть',
    'arenda.variablePartDesc1': 'Переменная часть на каждом проекте индивидуальна, как правило это процент с выручки отдела.',
    'arenda.variablePartDesc2': 'Размер также изменчив, зависит от сезонности, условий, продукта, региона.',
    'arenda.variablePartDesc3': 'Наша компания помогает РОПу в процессе работы и гарантирует качество выполненных работ, за это берет комиссию.',
    'arenda.moreDetails': 'Более подробно о наших услугах можно прочитать на сайте',
    
    // Community
    'community.title': 'Сообщество',
    'community.heading': 'Первое сообщество про продажи',
    'community.desc': 'Для Руководителей отделов продаж и Предпринимателей от сервиса аренды руководителей РентРОП',
    
    // Reports
    'reports.title': 'Отчеты',
    'reports.daily': 'Ежедневная отчетность',
    'reports.dailyDesc': 'Каждый день РОП отчитывается о проделанной работе в чаты (отчетность закреплена в виде ссылки в соответствующем чате).',
    'reports.regularReport': 'Регулярный отчет в конце рабочего дня:',
    'reports.dailyTasksA': 'описываем задачи на день;',
    'reports.dailyTasksB': 'результаты работы дня — что получилось и почему не получилось. Важны именно результаты за прошедший день.',
    'reports.weekly': 'Еженедельные встречи',
    'reports.weeklyDesc1': 'Есть гугл-документ «проджект-менеджмент». На еженедельных встречах собственник видит демонстрацию экрана и заполнение задачи на будущую неделю и принимает задачи прошедшей недели.',
    'reports.weeklyDesc2': 'Принимает работу, вместе проставляйте галочки у выполненных задач.',
    'reports.weeklyDesc3': 'Если на неделе от собственника прилетают новые задачи — прописываем их в проджекте и на еженедельных встречах проговариваем, что фрейм сместился из-за этих срочных важных задач.',
    'reports.transparency': 'Прозрачность результатов',
    'reports.transparencyDesc': 'Система отчетности позволяет отслеживать прогресс и результаты в реальном времени, обеспечивая полную прозрачность работы для всех участников проекта.',
    
    // DPR
    'dpr.title': 'ДПР',
    'dpr.subtitle': 'Директора по развитию',
    'dpr.mentorship': 'Наставничество',
    'dpr.mentorshipDesc': 'Кроме РОПов в штате есть наставники — Директора по развитию (ДПР), которые помогают вести проекты и обучают РОПов.',
    'dpr.support': 'Поддержка',
    'dpr.supportDesc': 'ДПР всегда на связи с РОПом, помогут советом и укажут правильное направление.',
    'dpr.weeklyMeetings': 'Еженедельные планерки',
    'dpr.weeklyMeetingsDesc': 'Совместно с ДПР еженедельно проводятся планерки с заказчиком по закрытию и назначению задач.',
    
    // Employees
    'employees.title': 'Сотрудники',
    'employees.structure': 'Структура компании',
    'employees.trainingDept': 'Отдел Обучения и Найма',
    'employees.legalDept': 'Юридический отдел',
    'employees.salesDept': 'Отдел продаж',
    'employees.partnerDept': 'Партнерский отдел',
    'employees.projectDept': 'Проектный отдел',
    'employees.techDept': 'Технический отдел',
    'employees.marketingDept': 'Отдел маркетинга',
    
    // Conditions pages
    'conditions.title': 'Условия работы',
    'conditions.subtitle': 'Условия работы в компании РентРОП',
    'conditions.motivation': 'Мотивация',
    'conditions.motivationDesc': 'Система оплаты труда: фикс, переменка, партнерка',
    'conditions.training': 'Обучение',
    'conditions.trainingDesc': 'Поэтапное обучение с аттестацией и доступом к базе знаний',
    'conditions.projects': 'Проекты',
    'conditions.projectsDesc': 'Открытый подбор проектов через телеграм канал',
    'conditions.registration': 'Оформление',
    'conditions.registrationDesc': 'Договора для России и Казахстана, ИП и самозанятых',
    'conditions.payments': 'Выплаты',
    'conditions.paymentsDesc': 'Выплаты дважды в месяц на расчетный счет',
    'conditions.backToConditions': 'Назад к разделу Условия',
    
    // Hero section
    'hero.badge': 'Активный набор',
    'hero.scrollDown': 'Листайте вниз',
    'hero.learnWork': 'Узнать о работе',
    'hero.workConditions': 'Условия работы',
    'hero.careerGrowth': 'Карьерный рост',
    'hero.title': 'Эксперт / Руководитель Отдела Продаж',
    'hero.salary': 'от 150 000 до 450 000 ₽',
    'hero.description': 'РентРОП — инновационная компания, предоставляющая услуги \'РОП в аренду\'. Мы не просто строим отделы продаж, мы внедряем культуру результата и дисциплины в бизнесы наших клиентов.',
    'hero.location': 'Удаленно / По всему миру',
    'hero.type': 'Полная занятость',
    
    // Video section
    'video.greeting': 'Приветствие от команды',
    
    // Footer
    'footer.slogan': 'Системно строим отделы продаж с 2017 года.',
    'footer.copyright': '© 2026 РЕНТРОП. МЫ СТРОИМ ПРОДАЖИ — ВЫ СТРОИТЕ БУДУЩЕЕ.',
    
    // Common
    'common.back': 'Назад',
    'common.backToConditions': '← Назад к условиям',
    'common.backToMotivation': 'Назад к Мотивации',
    'common.download': 'Скачать страницу',
    
    // Motivation page
    'motivation.title': 'Мотивация',
    'motivation.paymentSystem': 'Система оплаты труда',
    'motivation.totalIncome': 'Общий доход',
    'motivation.tariffCalc': 'Тарифы и расчёт мотивации',
    'motivation.fix': 'Фикс',
    'motivation.fixDesc': 'Фиксированная часть зарплаты — оклад за работу',
    'motivation.variable': 'Переменка',
    'motivation.variableDesc': 'Оплата за результат по итогу месяца, процент с выручки отдела',
    'motivation.partner': 'Партнерка',
    'motivation.partnerDesc': 'Партнерские бонусы за привлечение клиентов',
    'motivation.services': 'Услуги',
    'motivation.servicesDesc': 'Дополнительный заработок на консалтинговых услугах',
    'motivation.subpartner': 'Суб.партнерка',
    'motivation.subpartnerDesc': 'Бонусы за привлечение новых специалистов',
    
    // Fix page
    'fix.title': 'Фикс',
    'fix.fixedPremium': 'Фиксированная премия',
    'fix.fixedPremiumDesc': 'Фиксированная премия начисляется ежемесячно. По сути, это является окладом за выход на работу. Факт выхода на работу подтверждается',
    'fix.reportForDay': 'отчетом за день',
    'fix.premiumSizeDesc': 'Размер премии зависит от времени работы на проекте:',
    'fix.fromTariff': 'от тарифа',
    'fix.workFormats': 'Форматы работы',
    'fix.online': 'Онлайн',
    'fix.onlineDesc': 'Полностью удаленно',
    'fix.offline': 'Оффлайн',
    'fix.offlineDesc': 'Обязательно присутствие на территории клиента',
    'fix.combined': 'Комбинированный',
    'fix.combinedDesc': 'Периодическое появление на территории клиента',
    'fix.employment': 'Занятость',
    'fix.hours4': '4 часа',
    'fix.hours4Desc': 'Неполная занятость (90% проектов). Можно брать 2 проекта в работу.',
    'fix.hours8': '8 часов',
    'fix.hours8Desc': 'Полная занятость (10% проектов)',
    'fix.tariffTypes': 'Типы тарифов',
    'fix.entry': 'Вход',
    'fix.entryDesc': 'Только входящий трафик заявок',
    'fix.cold': 'Холод',
    'fix.coldDesc': 'Присутствует привлечение клиентов через прозвон баз',
    'fix.fromScratch': 'С нуля',
    'fix.fromScratchDesc': 'Первый месяц работы или нужно выстроить под ключ отдел продаж',
    'fix.regions': 'Регионы',
    'fix.international': 'Международ.',
    'fix.internationalDesc': 'Страны мира',
    'fix.rf': 'РФ',
    'fix.rfDesc': 'Российская Федерация',
    'fix.cis': 'СНГ',
    'fix.cisDesc': 'Бывшие страны СНГ',
    'fix.kz': 'КЗ',
    'fix.kzDesc': 'Казахстан',
    'fix.vatTitle': 'Важно! С 01.01.2026',
    'fix.vatInfo1': 'Цена в РФ на все услуги +5% к счету',
    'fix.vatInfo2': 'Договора и счета нужно будет переделать на "в стоимость включено 5% НДС"',
    'fix.vatInfo3': 'Мотивация команды и исполнителя берёт расчёт из основной стоимости услуги и не учитывает НДС.',
    'fix.vatExample': 'Пример:',
    'fix.vatExampleItem1': '120 000 рублей стоит аренда РОПа',
    'fix.vatExampleItem2': 'Счёт выставляется на 120 000 + 5% =',
    'fix.vatExampleItem3': '6 000 рублей — это НДС, который мы обязаны отдать государству',
    'fix.vatExampleItem4': 'Исполнитель получает мотивацию от расчёта тарифа',
    'fix.vatExampleItem5': 'ОП получает % с 120к',
    'fix.vatExampleItem6': 'ДПР, Аккаунт, Освоение — всё идёт в расчёт от 120к',
    'fix.vatNote': 'И так с абсолютно любой услугой для РФ клиента.',
    'fix.vatPs': 'P.S. Для клиентов, которые хотят оплатить на карту, мы можем НДС не брать.',
    'fix.tariffGrid': 'Тарифная сетка',
    
    // Variable page
    'variable.title': 'Переменка',
    'variable.variablePremium': 'Переменная премия',
    'variable.variablePremiumDesc': 'Переменная премия — это оплата Эксперту за результат. Результатом отдела продаж является выручка. Поэтому премия начисляется исходя из выручки отдела.',
    'variable.howCalculated': 'Как рассчитывается?',
    'variable.calcDesc1': 'Премия, как правило, рассчитывается в первый месяц работы силами Эксперта.',
    'variable.calcDesc2': 'Согласовывается с клиентом и составляется дополнительное приложение к договору.',
    'variable.calcDesc3': 'Обычно берется исходя из планов на месяц, объема выручки, в виде процента или фиксированной выплаты.',
    'variable.premiumBased': 'Премия начисляется',
    'variable.basedOnRevenue': 'Исходя из размера выручки отдела',
    'variable.motivationCalc': 'Расчёт мотивации',
    
    // Partner page
    'partner.title': 'Партнерка',
    'partner.program': 'Партнерская программа',
    'partner.programDesc': 'Рекомендация услуг компании РентРОП сторонним лицам через реферальную программу.',
    'partner.rewardSize': 'Размер вознаграждения',
    'partner.rewardPercent': 'от 5% до 30%',
    'partner.rewardDuration': 'в течении 3 месяцев с каждого приведенного клиента',
    'partner.paymentDetails': 'Размеры выплат и условия подробнее в',
    'partner.telegramChannel': 'телеграм-канале',
    
    // Services page
    'services.title': 'Услуги',
    'services.officialSidejob': 'ОФИЦИАЛЬНАЯ ПОДРАБОТКА!',
    'services.officialSidejobDesc': 'Для всех сотрудников нашей компании мы добавляем дополнительную возможность заработать',
    'services.whatServices': 'Какие услуги?',
    'services.hiring': 'Найм',
    'services.automation': 'Автоматизация',
    'services.scripts': 'Скрипты',
    'services.accounting': 'Бухгалтерия',
    'services.other': 'Другие услуги, согласно опыту и навыкам',
    'services.toWhom': 'Кому?',
    'services.newClients': 'Новым клиентам',
    'services.existingClients': 'Действующим клиентам',
    'services.helpRops': 'Помощь РОПам на проектах',
    'services.atWhoseExpense': 'За чей счёт?',
    'services.expense1': 'Клиент оплатит по новому договору',
    'services.expense2': 'Клиент доплатит по текущему договору',
    'services.expense3': 'РОП поделится своей зарплатой',
    'services.howPriceAgreed': 'Как согласовывается цена?',
    'services.priceDesc1': 'Каждый сам себе поставит стоимость часа',
    'services.priceRange': '500-10000 руб',
    'services.priceDesc1End': 'за ту или иную услугу. Но без фанатизма. Помните, что среди коллег есть конкуренты. Вы сами строите себе прайс.',
    'services.priceDesc2': 'Совместно просчитаем смету и объем работ',
    'services.priceDesc3': 'КП → Знакомство → Счет → Оплата → Акт',
    'services.howMuchPay': 'Сколько платим?',
    'services.payLtv': 'Если услуга LTV — по вашему текущему договору',
    'services.payOneTime': 'Если услуга одноразовая —',
    'services.payOneTimePercent': '30%',
    'services.payOneTimeEnd': 'от стоимости договора',
    'services.ps': 'З.Ы.',
    'services.psDesc': 'Если ваша услуга будет получать положительные отзывы (5 успешных кейсов за 3 месяца), то мы ее добавим на все наши рекламные ресурсы, как основную.',
    
    // SubPartner page
    'subpartner.title': 'Суб.партнерка',
    'subpartner.amoPartnership': 'Партнерство с АМО и Битрикс',
    'subpartner.amoDesc': 'РентРОП является партнером АМО и Битрикс. При продлении через нас и покупке лицензий, РОП дополнительно зарабатывает',
    'subpartner.amoPercent': '20% от разницы в сумме оплаты',
    'subpartner.additionalEarnings': 'Дополнительный заработок',
    'subpartner.fromDifference': 'от разницы в сумме оплаты за лицензии',
    'subpartner.clientBonuses': 'Бонусы для клиента',
    'subpartner.additionalLicenses': 'Дополнительные лицензии',
    'subpartner.additionalLicensesDesc': 'В подарок при покупке',
    'subpartner.bonusMonths': 'Бонусные месяца',
    'subpartner.bonusMonthsDesc': 'В подарок при продлении',
    'subpartner.otherSystems': 'Кроме этих систем мы являемся партнерами еще у',
    'subpartner.systemsCount': '40 различных систем',
    'subpartner.systemsEnd': 'автоматизации и маркетинга. Поэтому обращайтесь к своему ДПРу при подключении.',
    
    // Training page
    'training.title': 'Обучение',
    'training.stepByStep': 'Поэтапное обучение',
    'training.stepByStepDesc': 'Обучение состоит из текстовых и видео материалов и аттестации в виде теста. После успешной сдачи теста мы пришлем следующий этап.',
    'training.stages': 'Всего 4 этапа обучения:',
    'training.stage1': 'Условия работы',
    'training.stage2': 'Обучающий портал',
    'training.stage3': 'Отчетность',
    'training.stage4': 'Робот HR',
    'training.group': 'Группа обучения',
    'training.groupDesc1': 'Результаты тестов фиксируются автоматически в группе',
    'training.groupName': 'Обучение [VP]',
    'training.groupDesc2': 'Желательно сразу в нее вступить. Также в ней можно оставлять вопросы и комментарии по обучению. Обязательно ответим.',
    'training.knowledgeBase': 'База знаний',
    'training.knowledgeBaseDesc1': 'Обучение самостоятельное. Довольно простое. Вам нужно изучить всего 5% базовой информации Базы Знаний компании.',
    'training.knowledgeBaseDesc2': 'База знаний активно пополняется более 6 лет нашими экспертами, новая информация появляется несколько раз в месяц.',
    'training.accessNote': 'Доступ ко всей Базе Знаний компании пришлем по итогу прохождения всего обучения.',
    
    // Projects page
    'projects.title': 'Страница в разработке',
    'projects.description': 'Проекты можно посмотреть в телеграм канале',
    'projects.viewInTelegram': 'Смотреть проекты',
    'projects.selection': 'Подбор проектов',
    'projects.selectionDesc1': 'Подбор проектов открытый. В',
    'projects.telegramChannel': 'телеграм канале',
    'projects.selectionDesc2': 'периодично отдел продаж выкладывает оплаченные проекты, где заказчики ожидают знакомства с РОПом.',
    'projects.selectionDesc3': 'Проекты размещены в виде поста с контактами ответственных, описанием, регионом, тарифом, что есть и что нужно сделать.',
    'projects.selectionDesc4': 'Откликаться можно в комментариях под постом.',
    'projects.team': 'Команда проекта',
    'projects.teamDesc': 'Проект ведет несколько специалистов:',
    'projects.rop': 'Сам РОП',
    'projects.ropDesc': '— его руками выполняется работа и управление.',
    'projects.dpr': 'ДПР',
    'projects.dprDesc': '— наставник, разрабатывающий стратегию развития и контролирующий выполнение задач в срок.',
    'projects.projectManager': 'Менеджер проекта',
    'projects.projectManagerDesc': '— контроль оплат и лояльности заказчиков.',
    'projects.videoCard': 'Видео-визитка',
    'projects.videoCardDesc': 'Откликаться на Проекты под постом нужно в формате ссылки на видео-визитку.',
    'projects.videoInstructions': 'Инструкция по записи Видео Визитки:',
    'projects.videoInstr1': 'Подготовка — выберите тихое место с хорошим освещением',
    'projects.videoInstr2': 'Расскажите о себе, опыте и почему хотите работать с проектом',
    'projects.videoInstr3': 'Оптимальная длительность — 1-2 минуты',
    'projects.important': 'Важно!',
    'projects.importantDesc': 'Если РОП понимает, что намерен уйти с проекта, должен доложить об этом ДПРу за 14 дней. За это время мы найдем подмену и урегулируем на проекте эту рокировку.',
    
    // Registration page
    'registration.title': 'Оформление',
    'registration.contractTerms': 'Условия договора',
    'registration.contractDesc1': 'Договор заключается на реквизиты России или Казахстана. Заключается как для самозанятых физ.лиц, так и для ИП.',
    'registration.contractDesc2': 'Налоговая нагрузка в таком формате распределяется поровну, половину компенсирует компания.',
    'registration.tkContract': 'Также мы можем заключить договор с физ.лицом по ТК.',
    'registration.tkContractDesc': 'Тогда налоговую нагрузку вы оплачиваете самостоятельно:',
    'registration.kzTax': 'Казахстан',
    'registration.rfTax': 'Россия',
    'registration.downloadContracts': 'Скачать договора',
    'registration.contractKzIp': 'Договор для ИП (Казахстан)',
    'registration.contractRfSz': 'Договор для самозанятых',
    'registration.contractRfIp': 'Договор для ИП',
    'registration.procedure': 'Порядок оформления:',
    'registration.step1': 'Ознакомиться с договором',
    'registration.step2': 'Подписание договора происходит до момента выхода эксперта на проект',
    'registration.step3': 'На этапе обучения необходимо ознакомиться с документом',
    'registration.step4': 'Договор скачать, подписать и отправить сотруднику, который проводил собеседование',
    
    // Payments page
    'payments.title': 'Выплаты',
    'payments.schedule': 'График выплат',
    'payments.scheduleDesc': 'Выплаты осуществляются дважды в месяц на ваш расчетный счет/карту по актам выполненных работ, после оплаты заказчиком:',
    'payments.day30': '30 числа',
    'payments.day30Desc': 'Аванс 50% от заработанных на данный момент средств',
    'payments.day15': '15 числа',
    'payments.day15Desc': 'Полный расчет за предыдущий месяц',
    
    // Vacancy section
    'vacancy.title': 'Детали позиции',
    'vacancy.yourTasks': 'Ваши задачи',
    'vacancy.whatWeExpect': 'Что мы ждем от вас',
    'vacancy.whatYouGet': 'Что вы получите',
    'vacancy.salary': 'Зарплата',
    'vacancy.resp1': 'Работа на проверенных проектах в качестве РОПа',
    'vacancy.resp2': 'Выполнение задач по Дорожной Карте Проекта',
    'vacancy.resp3': 'Прослушка звонков и проведение планерок с менеджерами',
    'vacancy.resp4': 'Найм, адаптация и обучение персонала на проектах',
    'vacancy.resp5': 'Работа с AmoCRM/Bitrix24 и контроль отчетности',
    'vacancy.resp6': 'Взаимодействие с собственниками для масштабирования выручки',
    'vacancy.req1': 'Опыт работы РОПом или ведущим экспертом по продажам от 2 лет',
    'vacancy.req2': 'Понимание методологии построения ОП',
    'vacancy.req3': 'Навыки глубокой аналитики воронок продаж',
    'vacancy.req4': 'Лидерские качества и умение работать в режиме многозадачности',
    'vacancy.req5': 'Высокий уровень ответственности за KPI клиента',
    'vacancy.ben1': 'Прозрачная система мотивации: фикс + переменная + партнерские бонусы',
    'vacancy.ben2': 'Полностью удаленный формат работы',
    'vacancy.ben3': 'Доступ к закрытому сообществу и базе знаний РентРОП',
    'vacancy.ben4': 'Обучение за счет компании и карьерный лифт до партнера',
    'vacancy.ben5': 'Работа с топовыми проектами и интересными нишами',
    'vacancy.salaryValue': 'от 150 000 до 450 000 ₽',
    
    // AI Assistant
    'ai.placeholder': 'Задайте вопрос о вакансии...',
    'ai.title': 'AI-Консультант',
    'ai.subtitle': 'РентРОП',
    'ai.greeting': 'Привет! Я AI-ассистент РентРОП. Задайте мне любой вопрос о вакансии, условиях работы или компании.',
    'ai.error': 'Извините, произошла ошибка. Попробуйте еще раз.',
    
    // Profile
    'profile.contractButton': 'Создание договора',
    'profile.videoCardButton': 'Создать Видео-визитку',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.work': 'Work',
    'nav.conditions': 'Conditions',
    'nav.wiki': 'Wiki',
    'nav.menu': 'Menu',
    'nav.profile': 'Profile',
    'nav.projects': 'Projects',
    'nav.aiChat': 'AI Chat',
    
    // Work pages
    'work.title': 'Work',
    'work.subtitle': 'Learn more about working at RentROP',
    'work.arendaRopov': 'ROP Rental',
    'work.arendaRopovDesc': 'Main product of the company — rental of sales department managers',
    'work.about': 'About Company',
    'work.aboutDesc': 'Company history since 2017 and our achievements',
    'work.community': 'Community',
    'work.communityDesc': 'First sales community for ROPs and entrepreneurs',
    'work.reports': 'Reports',
    'work.reportsDesc': 'Daily and weekly reporting system',
    'work.dpr': 'DPR',
    'work.dprDesc': 'Development Directors — mentors for ROPs',
    'work.employees': 'Employees',
    'work.employeesDesc': 'Company department structure',
    'work.backToWork': 'Back to Work section',
    
    // About Company
    'about.title': 'About Company',
    'about.history': 'History',
    'about.historyText1': 'The company history begins in February 2017, over 5 years ago. We started with building turnkey remote sales departments, as there were very few specialists in remote setup.',
    'about.academyText': 'In 2018 we launched the YOUR ROP academy — the first academy for sales department managers.',
    'about.firstProjectText': 'The first ROP Rental project started in April 2020, at the start of the pandemic. A rented ROP is still working on the project.',
    'about.flagshipText': 'Over the past couple of years, ROP Rental has become the flagship among our services and has earned the trust of hundreds of clients. It allowed us to multiply growth every year.',
    'about.viewCases': 'View cases →',
    
    // Arenda Ropov
    'arenda.title': 'ROP Rental',
    'arenda.product': 'Product',
    'arenda.productTitle': 'Main product — Rental of Sales Department Managers.',
    'arenda.productDesc': 'We train specialists and rent them out. The specialist works in our staff but performs ROP duties for the client. Works remotely.',
    'arenda.payment': 'Payment',
    'arenda.paymentDesc': 'For work, ROP receives a salary consisting of two parts:',
    'arenda.fixedPremium': 'Fixed bonus',
    'arenda.fixedPremiumDesc': '— salary for work.',
    'arenda.variablePremium': 'Variable bonus',
    'arenda.variablePremiumDesc': '— payment for results at the end of the month.',
    'arenda.variablePart': 'Variable Part',
    'arenda.variablePartDesc1': 'The variable part for each project is individual, usually a percentage of department revenue.',
    'arenda.variablePartDesc2': 'The size is also variable, depends on seasonality, conditions, product, region.',
    'arenda.variablePartDesc3': 'Our company helps the ROP in the work process and guarantees the quality of work performed, for which it takes a commission.',
    'arenda.moreDetails': 'More details about our services can be found on the website',
    
    // Community
    'community.title': 'Community',
    'community.heading': 'First sales community',
    'community.desc': 'For Sales Department Managers and Entrepreneurs from the RentROP manager rental service',
    
    // Reports
    'reports.title': 'Reports',
    'reports.daily': 'Daily Reporting',
    'reports.dailyDesc': 'Every day the ROP reports on work done in chats (reporting is pinned as a link in the corresponding chat).',
    'reports.regularReport': 'Regular report at the end of the working day:',
    'reports.dailyTasksA': 'describe tasks for the day;',
    'reports.dailyTasksB': 'work results — what worked and why it did not. The results for the past day are important.',
    'reports.weekly': 'Weekly Meetings',
    'reports.weeklyDesc1': 'There is a Google document "project management". At weekly meetings, the owner sees a screen demonstration and filling in tasks for the next week and accepts tasks from the past week.',
    'reports.weeklyDesc2': 'Accepts work, together check off completed tasks.',
    'reports.weeklyDesc3': 'If new tasks come from the owner during the week — we write them in the project and discuss at weekly meetings that the frame has shifted due to these urgent important tasks.',
    'reports.transparency': 'Results Transparency',
    'reports.transparencyDesc': 'The reporting system allows tracking progress and results in real time, ensuring complete transparency of work for all project participants.',
    
    // DPR
    'dpr.title': 'DPR',
    'dpr.subtitle': 'Development Directors',
    'dpr.mentorship': 'Mentorship',
    'dpr.mentorshipDesc': 'In addition to ROPs, there are mentors on staff — Development Directors (DPR), who help manage projects and train ROPs.',
    'dpr.support': 'Support',
    'dpr.supportDesc': 'DPR is always in touch with the ROP, will help with advice and point the right direction.',
    'dpr.weeklyMeetings': 'Weekly Planning Meetings',
    'dpr.weeklyMeetingsDesc': 'Together with DPR, weekly planning meetings are held with the client to close and assign tasks.',
    
    // Employees
    'employees.title': 'Employees',
    'employees.structure': 'Company Structure',
    'employees.trainingDept': 'Training and Hiring Department',
    'employees.legalDept': 'Legal Department',
    'employees.salesDept': 'Sales Department',
    'employees.partnerDept': 'Partner Department',
    'employees.projectDept': 'Project Department',
    'employees.techDept': 'Technical Department',
    'employees.marketingDept': 'Marketing Department',
    
    // Conditions pages
    'conditions.title': 'Work Conditions',
    'conditions.subtitle': 'Work conditions at RentROP company',
    'conditions.motivation': 'Motivation',
    'conditions.motivationDesc': 'Payment system: fixed, variable, partnership',
    'conditions.training': 'Training',
    'conditions.trainingDesc': 'Step-by-step training with certification and knowledge base access',
    'conditions.projects': 'Projects',
    'conditions.projectsDesc': 'Open project selection via Telegram channel',
    'conditions.registration': 'Registration',
    'conditions.registrationDesc': 'Contracts for Russia and Kazakhstan, sole proprietors and self-employed',
    'conditions.payments': 'Payments',
    'conditions.paymentsDesc': 'Payments twice a month to bank account',
    'conditions.backToConditions': 'Back to Conditions section',
    
    // Hero section
    'hero.badge': 'Active Hiring',
    'hero.scrollDown': 'Scroll down',
    'hero.learnWork': 'Learn about work',
    'hero.workConditions': 'Work conditions',
    'hero.careerGrowth': 'Career growth',
    'hero.title': 'Expert / Head of Sales Department',
    'hero.salary': 'from 150,000 to 450,000 ₽',
    'hero.description': 'RentROP is an innovative company providing \'ROP for rent\' services. We don\'t just build sales departments, we implement a culture of results and discipline in our clients\' businesses.',
    'hero.location': 'Remote / Worldwide',
    'hero.type': 'Full-time',
    
    // Video section
    'video.greeting': 'Greeting from the team',
    
    // Footer
    'footer.slogan': 'Systematically building sales departments since 2017.',
    'footer.copyright': '© 2026 RENTROP. WE BUILD SALES — YOU BUILD THE FUTURE.',
    
    // Common
    'common.back': 'Back',
    'common.backToConditions': '← Back to conditions',
    'common.backToMotivation': 'Back to Motivation',
    'common.download': 'Download page',
    
    // Motivation page
    'motivation.title': 'Motivation',
    'motivation.paymentSystem': 'Payment System',
    'motivation.totalIncome': 'Total Income',
    'motivation.tariffCalc': 'Tariffs and motivation calculation',
    'motivation.fix': 'Fixed',
    'motivation.fixDesc': 'Fixed part of salary — wage for work',
    'motivation.variable': 'Variable',
    'motivation.variableDesc': 'Payment for results at month end, percentage of department revenue',
    'motivation.partner': 'Partnership',
    'motivation.partnerDesc': 'Partner bonuses for attracting clients',
    'motivation.services': 'Services',
    'motivation.servicesDesc': 'Additional income from consulting services',
    'motivation.subpartner': 'Sub-partnership',
    'motivation.subpartnerDesc': 'Bonuses for attracting new specialists',
    
    // Fix page
    'fix.title': 'Fixed',
    'fix.fixedPremium': 'Fixed Bonus',
    'fix.fixedPremiumDesc': 'Fixed bonus is paid monthly. Essentially, this is a salary for coming to work. The fact of coming to work is confirmed by',
    'fix.reportForDay': 'daily report',
    'fix.premiumSizeDesc': 'Bonus size depends on project work time:',
    'fix.fromTariff': 'of tariff',
    'fix.workFormats': 'Work Formats',
    'fix.online': 'Online',
    'fix.onlineDesc': 'Fully remote',
    'fix.offline': 'Offline',
    'fix.offlineDesc': 'Presence at client location required',
    'fix.combined': 'Combined',
    'fix.combinedDesc': 'Periodic visits to client location',
    'fix.employment': 'Employment',
    'fix.hours4': '4 hours',
    'fix.hours4Desc': 'Part-time (90% of projects). Can take 2 projects.',
    'fix.hours8': '8 hours',
    'fix.hours8Desc': 'Full-time (10% of projects)',
    'fix.tariffTypes': 'Tariff Types',
    'fix.entry': 'Entry',
    'fix.entryDesc': 'Only incoming request traffic',
    'fix.cold': 'Cold',
    'fix.coldDesc': 'Client acquisition through database calling',
    'fix.fromScratch': 'From Scratch',
    'fix.fromScratchDesc': 'First month of work or need to build turnkey sales department',
    'fix.regions': 'Regions',
    'fix.international': 'International',
    'fix.internationalDesc': 'Countries of the world',
    'fix.rf': 'RF',
    'fix.rfDesc': 'Russian Federation',
    'fix.cis': 'CIS',
    'fix.cisDesc': 'Former CIS countries',
    'fix.kz': 'KZ',
    'fix.kzDesc': 'Kazakhstan',
    'fix.vatTitle': 'Important! From 01.01.2026',
    'fix.vatInfo1': 'Price in Russia for all services +5% to invoice',
    'fix.vatInfo2': 'Contracts and invoices will need to be changed to "5% VAT included in price"',
    'fix.vatInfo3': 'Team and contractor motivation is calculated from base service cost and does not include VAT.',
    'fix.vatExample': 'Example:',
    'fix.vatExampleItem1': 'ROP rental costs 120,000 rubles',
    'fix.vatExampleItem2': 'Invoice is issued for 120,000 + 5% =',
    'fix.vatExampleItem3': '6,000 rubles is VAT that we must pay to the state',
    'fix.vatExampleItem4': 'Contractor receives motivation from tariff calculation',
    'fix.vatExampleItem5': 'Sales dept receives % from 120k',
    'fix.vatExampleItem6': 'DPR, Account, Development — all calculated from 120k',
    'fix.vatNote': 'Same for absolutely any service for Russian clients.',
    'fix.vatPs': 'P.S. For clients who want to pay by card, we may not charge VAT.',
    'fix.tariffGrid': 'Tariff Grid',
    
    // Variable page
    'variable.title': 'Variable',
    'variable.variablePremium': 'Variable Bonus',
    'variable.variablePremiumDesc': 'Variable bonus is payment to the Expert for results. The result of the sales department is revenue. Therefore, the bonus is calculated based on department revenue.',
    'variable.howCalculated': 'How is it calculated?',
    'variable.calcDesc1': 'The bonus is usually calculated in the first month of work by the Expert.',
    'variable.calcDesc2': 'Agreed with the client and an additional appendix to the contract is drawn up.',
    'variable.calcDesc3': 'Usually taken based on monthly plans, revenue volume, as a percentage or fixed payment.',
    'variable.premiumBased': 'Bonus is calculated',
    'variable.basedOnRevenue': 'Based on department revenue',
    'variable.motivationCalc': 'Motivation Calculation',
    
    // Partner page
    'partner.title': 'Partnership',
    'partner.program': 'Partnership Program',
    'partner.programDesc': 'Recommending RentROP services to third parties through referral program.',
    'partner.rewardSize': 'Reward Amount',
    'partner.rewardPercent': 'from 5% to 30%',
    'partner.rewardDuration': 'for 3 months from each referred client',
    'partner.paymentDetails': 'Payment amounts and conditions in detail in',
    'partner.telegramChannel': 'Telegram channel',
    
    // Services page
    'services.title': 'Services',
    'services.officialSidejob': 'OFFICIAL SIDE JOB!',
    'services.officialSidejobDesc': 'For all employees of our company we add an additional opportunity to earn',
    'services.whatServices': 'What services?',
    'services.hiring': 'Hiring',
    'services.automation': 'Automation',
    'services.scripts': 'Scripts',
    'services.accounting': 'Accounting',
    'services.other': 'Other services according to experience and skills',
    'services.toWhom': 'To whom?',
    'services.newClients': 'New clients',
    'services.existingClients': 'Existing clients',
    'services.helpRops': 'Help to ROPs on projects',
    'services.atWhoseExpense': 'At whose expense?',
    'services.expense1': 'Client will pay under new contract',
    'services.expense2': 'Client will pay extra under current contract',
    'services.expense3': 'ROP will share their salary',
    'services.howPriceAgreed': 'How is price agreed?',
    'services.priceDesc1': 'Everyone sets their own hourly rate',
    'services.priceRange': '500-10000 RUB',
    'services.priceDesc1End': 'for this or that service. But without fanaticism. Remember that there are competitors among colleagues. You build your own price list.',
    'services.priceDesc2': 'Together we will calculate the estimate and scope of work',
    'services.priceDesc3': 'Proposal → Meeting → Invoice → Payment → Act',
    'services.howMuchPay': 'How much do we pay?',
    'services.payLtv': 'If service is LTV — according to your current contract',
    'services.payOneTime': 'If service is one-time —',
    'services.payOneTimePercent': '30%',
    'services.payOneTimeEnd': 'of contract value',
    'services.ps': 'P.S.',
    'services.psDesc': 'If your service receives positive reviews (5 successful cases in 3 months), we will add it to all our advertising resources as a main one.',
    
    // SubPartner page
    'subpartner.title': 'Sub-partnership',
    'subpartner.amoPartnership': 'Partnership with AMO and Bitrix',
    'subpartner.amoDesc': 'RentROP is a partner of AMO and Bitrix. When renewing through us and purchasing licenses, ROP additionally earns',
    'subpartner.amoPercent': '20% of the payment difference',
    'subpartner.additionalEarnings': 'Additional Earnings',
    'subpartner.fromDifference': 'of the payment difference for licenses',
    'subpartner.clientBonuses': 'Bonuses for Client',
    'subpartner.additionalLicenses': 'Additional Licenses',
    'subpartner.additionalLicensesDesc': 'As a gift with purchase',
    'subpartner.bonusMonths': 'Bonus Months',
    'subpartner.bonusMonthsDesc': 'As a gift with renewal',
    'subpartner.otherSystems': 'Besides these systems we are partners with',
    'subpartner.systemsCount': '40 different systems',
    'subpartner.systemsEnd': 'of automation and marketing. So contact your DPR when connecting.',
    
    // Training page
    'training.title': 'Training',
    'training.stepByStep': 'Step-by-step Training',
    'training.stepByStepDesc': 'Training consists of text and video materials and certification in the form of a test. After successfully passing the test, we will send the next stage.',
    'training.stages': '4 training stages in total:',
    'training.stage1': 'Work Conditions',
    'training.stage2': 'Training Portal',
    'training.stage3': 'Reporting',
    'training.stage4': 'HR Robot',
    'training.group': 'Training Group',
    'training.groupDesc1': 'Test results are automatically recorded in the group',
    'training.groupName': 'Training [VP]',
    'training.groupDesc2': 'It is advisable to join it right away. You can also leave questions and comments on training there. We will definitely answer.',
    'training.knowledgeBase': 'Knowledge Base',
    'training.knowledgeBaseDesc1': 'Training is self-paced. Quite simple. You need to study only 5% of the basic information of the company Knowledge Base.',
    'training.knowledgeBaseDesc2': 'The knowledge base has been actively updated for over 6 years by our experts, new information appears several times a month.',
    'training.accessNote': 'We will send access to the entire company Knowledge Base after completing all training.',
    
    // Projects page
    'projects.title': 'Page Under Development',
    'projects.description': 'Projects are available in the Telegram channel',
    'projects.viewInTelegram': 'View Projects',
    'projects.selection': 'Project Selection',
    'projects.selectionDesc1': 'Project selection is open. In the',
    'projects.telegramChannel': 'Telegram channel',
    'projects.selectionDesc2': 'the sales department periodically posts paid projects where clients are waiting to meet with ROP.',
    'projects.selectionDesc3': 'Projects are posted as a post with contacts of responsible persons, description, region, tariff, what is available and what needs to be done.',
    'projects.selectionDesc4': 'You can respond in the comments under the post.',
    'projects.team': 'Project Team',
    'projects.teamDesc': 'Several specialists lead the project:',
    'projects.rop': 'ROP himself',
    'projects.ropDesc': '— work and management is done by his hands.',
    'projects.dpr': 'DPR',
    'projects.dprDesc': '— mentor developing the development strategy and controlling task completion on time.',
    'projects.projectManager': 'Project Manager',
    'projects.projectManagerDesc': '— control of payments and client loyalty.',
    'projects.videoCard': 'Video Business Card',
    'projects.videoCardDesc': 'You need to respond to Projects under the post in the form of a link to a video business card.',
    'projects.videoInstructions': 'Instructions for recording Video Business Card:',
    'projects.videoInstr1': 'Preparation — choose a quiet place with good lighting',
    'projects.videoInstr2': 'Tell about yourself, experience and why you want to work with the project',
    'projects.videoInstr3': 'Optimal duration — 1-2 minutes',
    'projects.important': 'Important!',
    'projects.importantDesc': 'If ROP understands that they intend to leave the project, they must report this to DPR 14 days in advance. During this time we will find a replacement and settle this rotation on the project.',
    
    // Registration page
    'registration.title': 'Registration',
    'registration.contractTerms': 'Contract Terms',
    'registration.contractDesc1': 'The contract is concluded for Russian or Kazakh details. It is concluded for both self-employed individuals and sole proprietors.',
    'registration.contractDesc2': 'The tax burden in this format is distributed equally, half is compensated by the company.',
    'registration.tkContract': 'We can also conclude a contract with an individual under the Labor Code.',
    'registration.tkContractDesc': 'Then you pay the tax burden yourself:',
    'registration.kzTax': 'Kazakhstan',
    'registration.rfTax': 'Russia',
    'registration.downloadContracts': 'Download Contracts',
    'registration.contractKzIp': 'Contract for IP (Kazakhstan)',
    'registration.contractRfSz': 'Contract for self-employed',
    'registration.contractRfIp': 'Contract for IP',
    'registration.procedure': 'Registration procedure:',
    'registration.step1': 'Review the contract',
    'registration.step2': 'Contract signing takes place before the expert enters the project',
    'registration.step3': 'At the training stage, you need to review the document',
    'registration.step4': 'Download the contract, sign it and send it to the employee who conducted the interview',
    
    // Payments page
    'payments.title': 'Payments',
    'payments.schedule': 'Payment Schedule',
    'payments.scheduleDesc': 'Payments are made twice a month to your bank account/card according to acts of completed work, after client payment:',
    'payments.day30': '30th',
    'payments.day30Desc': 'Advance 50% of currently earned funds',
    'payments.day15': '15th',
    'payments.day15Desc': 'Full settlement for previous month',
    
    // Vacancy section
    'vacancy.title': 'Position Details',
    'vacancy.yourTasks': 'Your Tasks',
    'vacancy.whatWeExpect': 'What We Expect From You',
    'vacancy.whatYouGet': 'What You Get',
    'vacancy.salary': 'Salary',
    'vacancy.resp1': 'Working on verified projects as ROP',
    'vacancy.resp2': 'Completing tasks according to Project Roadmap',
    'vacancy.resp3': 'Listening to calls and conducting meetings with managers',
    'vacancy.resp4': 'Hiring, adaptation and training of personnel on projects',
    'vacancy.resp5': 'Working with AmoCRM/Bitrix24 and reporting control',
    'vacancy.resp6': 'Interaction with owners to scale revenue',
    'vacancy.req1': '2+ years experience as ROP or leading sales expert',
    'vacancy.req2': 'Understanding of sales department building methodology',
    'vacancy.req3': 'Deep sales funnel analytics skills',
    'vacancy.req4': 'Leadership qualities and ability to multitask',
    'vacancy.req5': 'High level of responsibility for client KPIs',
    'vacancy.ben1': 'Transparent motivation system: fixed + variable + partner bonuses',
    'vacancy.ben2': 'Fully remote work format',
    'vacancy.ben3': 'Access to closed community and RentROP knowledge base',
    'vacancy.ben4': 'Company-paid training and career path to partner',
    'vacancy.ben5': 'Working with top projects and interesting niches',
    'vacancy.salaryValue': 'from 150,000 to 450,000 ₽',
    
    // AI Assistant
    'ai.placeholder': 'Ask a question about the vacancy...',
    'ai.title': 'AI Consultant',
    'ai.subtitle': 'RentROP',
    'ai.greeting': 'Hello! I am the RentROP AI assistant. Ask me any question about the vacancy, working conditions, or the company.',
    'ai.error': 'Sorry, an error occurred. Please try again.',
    
    // Profile
    'profile.contractButton': 'Create Contract',
    'profile.videoCardButton': 'Create Video Business Card',
  },
  kz: {
    // Navigation
    'nav.home': 'Басты бет',
    'nav.work': 'Жұмыс',
    'nav.conditions': 'Шарттар',
    'nav.wiki': 'Вики',
    'nav.menu': 'Мәзір',
    'nav.profile': 'Профиль',
    'nav.projects': 'Жобалар',
    'nav.aiChat': 'AI Чат',
    
    // Work pages
    'work.title': 'Жұмыс',
    'work.subtitle': 'РентРОП-та жұмыс туралы көбірек біліңіз',
    'work.arendaRopov': 'РОП жалға алу',
    'work.arendaRopovDesc': 'Компанияның негізгі өнімі — сату бөлімінің басшыларын жалға алу',
    'work.about': 'Компания туралы',
    'work.aboutDesc': '2017 жылдан бастап компания тарихы және біздің жетістіктеріміз',
    'work.community': 'Қауымдастық',
    'work.communityDesc': 'РОПтар мен кәсіпкерлер үшін сату туралы бірінші қауымдастық',
    'work.reports': 'Есептер',
    'work.reportsDesc': 'Күнделікті және апталық есептілік жүйесі',
    'work.dpr': 'ДПР',
    'work.dprDesc': 'Даму директорлары — РОПтар үшін тәлімгерлер',
    'work.employees': 'Қызметкерлер',
    'work.employeesDesc': 'Компания бөлімдерінің құрылымы',
    'work.backToWork': 'Жұмыс бөліміне қайту',
    
    // About Company
    'about.title': 'Компания туралы',
    'about.history': 'Тарих',
    'about.historyText1': 'Компания тарихы 2017 жылдың ақпанынан басталады, 5 жылдан астам. Қашықтағы сату бөлімдерін түгелдей құрудан бастадық, өйткені қашықтықта құру бойынша мамандар өте аз еді.',
    'about.academyText': '2018 жылы СІЗДІҢ РОП академиясын іске қостық — сату бөлімі басшылары үшін бірінші академия.',
    'about.firstProjectText': 'РОП жалға алу бойынша алғашқы жоба 2020 жылдың сәуірінде, пандемия басталғанда басталды. Жобада қазір де жалға алынған РОП жұмыс істейді.',
    'about.flagshipText': 'Соңғы бірнеше жылда РОП жалға алу біздің қызметтер арасында жетекші болып, жүздеген клиенттердің сенімін жеңіп алды. Жыл сайын есе өсуге мүмкіндік берді.',
    'about.viewCases': 'Кейстерді қарау →',
    
    // Arenda Ropov
    'arenda.title': 'РОП жалға алу',
    'arenda.product': 'Өнім',
    'arenda.productTitle': 'Негізгі өнім — Сату Бөлімі Басшыларын Жалға Алу.',
    'arenda.productDesc': 'Біз мамандарды оқытамыз және жалға береміз. Маман біздің штатта жұмыс істейді, бірақ тапсырыс берушіде РОП міндеттерін орындайды. Қашықтан жұмыс істейді.',
    'arenda.payment': 'Еңбекақы',
    'arenda.paymentDesc': 'Жұмыс үшін РОП екі бөліктен тұратын жалақы алады:',
    'arenda.fixedPremium': 'Тұрақты сыйлықақы',
    'arenda.fixedPremiumDesc': '— жұмысқа шығу үшін жалақы.',
    'arenda.variablePremium': 'Айнымалы сыйлықақы',
    'arenda.variablePremiumDesc': '— ай соңындағы нәтижелер үшін төлем.',
    'arenda.variablePart': 'Айнымалы бөлік',
    'arenda.variablePartDesc1': 'Әр жобадағы айнымалы бөлік жеке, әдетте бұл бөлім табысынан пайыз.',
    'arenda.variablePartDesc2': 'Көлемі де өзгермелі, маусымдылыққа, шарттарға, өнімге, аймаққа байланысты.',
    'arenda.variablePartDesc3': 'Біздің компания жұмыс барысында РОПқа көмектеседі және орындалған жұмыстардың сапасына кепілдік береді, ол үшін комиссия алады.',
    'arenda.moreDetails': 'Біздің қызметтер туралы толығырақ сайтта оқуға болады',
    
    // Community
    'community.title': 'Қауымдастық',
    'community.heading': 'Сату туралы бірінші қауымдастық',
    'community.desc': 'РентРОП басшыларын жалға алу қызметінен Сату бөлімдерінің басшылары мен Кәсіпкерлер үшін',
    
    // Reports
    'reports.title': 'Есептер',
    'reports.daily': 'Күнделікті есептілік',
    'reports.dailyDesc': 'Күн сайын РОП чаттарда жасалған жұмыс туралы есеп береді (есептілік сәйкес чатта сілтеме түрінде бекітілген).',
    'reports.regularReport': 'Жұмыс күнінің соңында тұрақты есеп:',
    'reports.dailyTasksA': 'күнге арналған тапсырмаларды сипаттаймыз;',
    'reports.dailyTasksB': 'күннің жұмыс нәтижелері — не болды және неге болмады. Өткен күннің нәтижелері маңызды.',
    'reports.weekly': 'Апталық кездесулер',
    'reports.weeklyDesc1': '«Жоба менеджменті» деген гугл-құжат бар. Апталық кездесулерде меншік иесі экран демонстрациясын және келесі аптаға тапсырмаларды толтыруды көреді және өткен аптаның тапсырмаларын қабылдайды.',
    'reports.weeklyDesc2': 'Жұмысты қабылдайды, бірге орындалған тапсырмаларға құсбелгі қоясыздар.',
    'reports.weeklyDesc3': 'Егер апта ішінде меншік иесінен жаңа тапсырмалар келсе — оларды жобаға жазамыз және апталық кездесулерде осы шұғыл маңызды тапсырмаларға байланысты фрейм ауысқанын айтамыз.',
    'reports.transparency': 'Нәтижелердің ашықтығы',
    'reports.transparencyDesc': 'Есептілік жүйесі прогресті және нәтижелерді нақты уақытта бақылауға мүмкіндік береді, жобаның барлық қатысушылары үшін жұмыстың толық ашықтығын қамтамасыз етеді.',
    
    // DPR
    'dpr.title': 'ДПР',
    'dpr.subtitle': 'Даму директорлары',
    'dpr.mentorship': 'Тәлімгерлік',
    'dpr.mentorshipDesc': 'РОПтардан басқа штатта тәлімгерлер бар — Даму директорлары (ДПР), олар жобаларды жүргізуге көмектеседі және РОПтарды оқытады.',
    'dpr.support': 'Қолдау',
    'dpr.supportDesc': 'ДПР әрқашан РОПпен байланыста, кеңес береді және дұрыс бағытты көрсетеді.',
    'dpr.weeklyMeetings': 'Апталық жоспарлау кездесулері',
    'dpr.weeklyMeetingsDesc': 'ДПР-мен бірге апта сайын тапсырыс берушімен тапсырмаларды жабу және тағайындау бойынша жоспарлау кездесулері өткізіледі.',
    
    // Employees
    'employees.title': 'Қызметкерлер',
    'employees.structure': 'Компания құрылымы',
    'employees.trainingDept': 'Оқыту және жалдау бөлімі',
    'employees.legalDept': 'Заң бөлімі',
    'employees.salesDept': 'Сату бөлімі',
    'employees.partnerDept': 'Серіктестік бөлімі',
    'employees.projectDept': 'Жоба бөлімі',
    'employees.techDept': 'Техникалық бөлім',
    'employees.marketingDept': 'Маркетинг бөлімі',
    
    // Conditions pages
    'conditions.title': 'Жұмыс шарттары',
    'conditions.subtitle': 'РентРОП компаниясындағы жұмыс шарттары',
    'conditions.motivation': 'Мотивация',
    'conditions.motivationDesc': 'Төлем жүйесі: фикс, айнымалы, серіктестік',
    'conditions.training': 'Оқыту',
    'conditions.trainingDesc': 'Аттестациямен және білім базасына қол жеткізумен кезең-кезеңмен оқыту',
    'conditions.projects': 'Жобалар',
    'conditions.projectsDesc': 'Telegram арнасы арқылы ашық жоба таңдау',
    'conditions.registration': 'Рәсімдеу',
    'conditions.registrationDesc': 'Ресей мен Қазақстан үшін келісімшарттар, ЖК және өзін-өзі жұмыспен қамтитындар',
    'conditions.payments': 'Төлемдер',
    'conditions.paymentsDesc': 'Айына екі рет банк шотына төлемдер',
    'conditions.backToConditions': 'Шарттар бөліміне қайту',
    
    // Hero section
    'hero.badge': 'Белсенді жалдау',
    'hero.scrollDown': 'Төмен айналдырыңыз',
    'hero.learnWork': 'Жұмыс туралы білу',
    'hero.workConditions': 'Жұмыс шарттары',
    'hero.careerGrowth': 'Мансаптық өсу',
    'hero.title': 'Сарапшы / Сату бөлімінің басшысы',
    'hero.salary': '150 000-нан 450 000 ₽ дейін',
    'hero.description': 'РентРОП — \'жалға РОП\' қызметтерін ұсынатын инновациялық компания. Біз тек сату бөлімдерін құрып қоймаймыз, біз клиенттеріміздің бизнестеріне нәтиже мен тәртіп мәдениетін енгіземіз.',
    'hero.location': 'Қашықтан / Бүкіл әлем бойынша',
    'hero.type': 'Толық жұмыс күні',
    
    // Video section
    'video.greeting': 'Командадан сәлемдесу',
    
    // Footer
    'footer.slogan': '2017 жылдан бері сату бөлімдерін жүйелі құрамыз.',
    'footer.copyright': '© 2026 РЕНТРОП. БІЗ САТУДЫ ҚҰРАМЫЗ — СІЗ БОЛАШАҚТЫ ҚҰРАСЫЗ.',
    
    // Common
    'common.back': 'Артқа',
    'common.backToConditions': '← Шарттарға оралу',
    'common.backToMotivation': 'Мотивацияға оралу',
    'common.download': 'Бетті жүктеу',
    
    // Motivation page
    'motivation.title': 'Мотивация',
    'motivation.paymentSystem': 'Төлем жүйесі',
    'motivation.totalIncome': 'Жалпы табыс',
    'motivation.tariffCalc': 'Тарифтер және мотивацияны есептеу',
    'motivation.fix': 'Фикс',
    'motivation.fixDesc': 'Жалақының тұрақты бөлігі — жұмыс үшін жалақы',
    'motivation.variable': 'Айнымалы',
    'motivation.variableDesc': 'Ай соңындағы нәтижелер үшін төлем, бөлім табысының пайызы',
    'motivation.partner': 'Серіктестік',
    'motivation.partnerDesc': 'Клиенттерді тарту үшін серіктестік бонустары',
    'motivation.services': 'Қызметтер',
    'motivation.servicesDesc': 'Кеңес беру қызметтерінен қосымша табыс',
    'motivation.subpartner': 'Субсеріктестік',
    'motivation.subpartnerDesc': 'Жаңа мамандарды тарту үшін бонустар',
    
    // Fix page
    'fix.title': 'Фикс',
    'fix.fixedPremium': 'Тұрақты сыйлықақы',
    'fix.fixedPremiumDesc': 'Тұрақты сыйлықақы ай сайын төленеді. Негізінде бұл жұмысқа шығу үшін жалақы. Жұмысқа шығу фактісі расталады',
    'fix.reportForDay': 'күнделікті есеп',
    'fix.premiumSizeDesc': 'Сыйлықақы мөлшері жобадағы жұмыс уақытына байланысты:',
    'fix.fromTariff': 'тарифтен',
    'fix.workFormats': 'Жұмыс форматтары',
    'fix.online': 'Онлайн',
    'fix.onlineDesc': 'Толығымен қашықтан',
    'fix.offline': 'Оффлайн',
    'fix.offlineDesc': 'Клиент аумағында болу міндетті',
    'fix.combined': 'Аралас',
    'fix.combinedDesc': 'Клиент аумағына мерзімді келу',
    'fix.employment': 'Жұмыспен қамту',
    'fix.hours4': '4 сағат',
    'fix.hours4Desc': 'Толық емес жұмыспен қамту (жобалардың 90%). 2 жоба алуға болады.',
    'fix.hours8': '8 сағат',
    'fix.hours8Desc': 'Толық жұмыспен қамту (жобалардың 10%)',
    'fix.tariffTypes': 'Тариф түрлері',
    'fix.entry': 'Кіріс',
    'fix.entryDesc': 'Тек кіріс өтінім трафигі',
    'fix.cold': 'Суық',
    'fix.coldDesc': 'Базаларды қоңырау шалу арқылы клиенттерді тарту бар',
    'fix.fromScratch': 'Нөлден',
    'fix.fromScratchDesc': 'Жұмыстың бірінші айы немесе түгелдей сату бөлімін құру қажет',
    'fix.regions': 'Аймақтар',
    'fix.international': 'Халықаралық',
    'fix.internationalDesc': 'Әлем елдері',
    'fix.rf': 'РФ',
    'fix.rfDesc': 'Ресей Федерациясы',
    'fix.cis': 'ТМД',
    'fix.cisDesc': 'Бұрынғы ТМД елдері',
    'fix.kz': 'ҚЗ',
    'fix.kzDesc': 'Қазақстан',
    'fix.vatTitle': 'Маңызды! 01.01.2026 жылдан бастап',
    'fix.vatInfo1': 'Ресейдегі барлық қызметтерге баға шотқа +5%',
    'fix.vatInfo2': 'Келісімшарттар мен шоттарды «бағаға 5% ҚҚС кіреді» деп өзгерту керек',
    'fix.vatInfo3': 'Команда мен орындаушының мотивациясы негізгі қызмет құнынан есептеледі және ҚҚС-ны қамтымайды.',
    'fix.vatExample': 'Мысал:',
    'fix.vatExampleItem1': 'РОП жалға алу 120 000 рубль тұрады',
    'fix.vatExampleItem2': 'Шот 120 000 + 5% = үшін жазылады',
    'fix.vatExampleItem3': '6 000 рубль — мемлекетке төлеуге тиіс ҚҚС',
    'fix.vatExampleItem4': 'Орындаушы тариф есебінен мотивация алады',
    'fix.vatExampleItem5': 'Сату бөлімі 120к-дан % алады',
    'fix.vatExampleItem6': 'ДПР, Аккаунт, Игеру — барлығы 120к-дан есептеледі',
    'fix.vatNote': 'Ресей клиенттеріне арналған кез келген қызметке осылай.',
    'fix.vatPs': 'P.S. Картамен төлегісі келетін клиенттер үшін ҚҚС алмауымыз мүмкін.',
    'fix.tariffGrid': 'Тариф торы',
    
    // Variable page
    'variable.title': 'Айнымалы',
    'variable.variablePremium': 'Айнымалы сыйлықақы',
    'variable.variablePremiumDesc': 'Айнымалы сыйлықақы — Сарапшыға нәтижелер үшін төлем. Сату бөлімінің нәтижесі — табыс. Сондықтан сыйлықақы бөлім табысы негізінде есептеледі.',
    'variable.howCalculated': 'Қалай есептеледі?',
    'variable.calcDesc1': 'Сыйлықақы әдетте Сарапшы күшімен жұмыстың бірінші айында есептеледі.',
    'variable.calcDesc2': 'Клиентпен келісіледі және келісімшартқа қосымша қосымша жасалады.',
    'variable.calcDesc3': 'Әдетте айлық жоспарлар, табыс көлемі негізінде пайыз немесе тұрақты төлем түрінде алынады.',
    'variable.premiumBased': 'Сыйлықақы есептеледі',
    'variable.basedOnRevenue': 'Бөлім табысының мөлшері негізінде',
    'variable.motivationCalc': 'Мотивацияны есептеу',
    
    // Partner page
    'partner.title': 'Серіктестік',
    'partner.program': 'Серіктестік бағдарламасы',
    'partner.programDesc': 'Реферал бағдарламасы арқылы РентРОП қызметтерін үшінші тұлғаларға ұсыну.',
    'partner.rewardSize': 'Сыйақы мөлшері',
    'partner.rewardPercent': '5%-дан 30%-ға дейін',
    'partner.rewardDuration': 'әрбір тартылған клиенттен 3 ай бойы',
    'partner.paymentDetails': 'Төлем мөлшері мен шарттары толығырақ',
    'partner.telegramChannel': 'Telegram арнасында',
    
    // Services page
    'services.title': 'Қызметтер',
    'services.officialSidejob': 'РЕСМИ ҚОСЫМША ЖҰМЫС!',
    'services.officialSidejobDesc': 'Біздің компанияның барлық қызметкерлері үшін біз қосымша табыс табу мүмкіндігін қосамыз',
    'services.whatServices': 'Қандай қызметтер?',
    'services.hiring': 'Жалдау',
    'services.automation': 'Автоматтандыру',
    'services.scripts': 'Скрипттер',
    'services.accounting': 'Бухгалтерия',
    'services.other': 'Тәжірибе мен дағдыларға сәйкес басқа қызметтер',
    'services.toWhom': 'Кімге?',
    'services.newClients': 'Жаңа клиенттерге',
    'services.existingClients': 'Қазіргі клиенттерге',
    'services.helpRops': 'Жобалардағы РОПтарға көмек',
    'services.atWhoseExpense': 'Кімнің есебінен?',
    'services.expense1': 'Клиент жаңа келісімшарт бойынша төлейді',
    'services.expense2': 'Клиент ағымдағы келісімшарт бойынша қосымша төлейді',
    'services.expense3': 'РОП жалақысымен бөліседі',
    'services.howPriceAgreed': 'Баға қалай келісіледі?',
    'services.priceDesc1': 'Әркім өзіне сағаттық құнын қояды',
    'services.priceRange': '500-10000 рубль',
    'services.priceDesc1End': 'осы немесе басқа қызмет үшін. Бірақ фанатизмсіз. Әріптестер арасында бәсекелестер бар екенін есте сақтаңыз. Сіз өзіңізге прайс құрасыз.',
    'services.priceDesc2': 'Бірге смета мен жұмыс көлемін есептейміз',
    'services.priceDesc3': 'КП → Танысу → Шот → Төлем → Акт',
    'services.howMuchPay': 'Қанша төлейміз?',
    'services.payLtv': 'Егер қызмет LTV болса — сіздің ағымдағы келісімшартыңыз бойынша',
    'services.payOneTime': 'Егер қызмет бір реттік болса —',
    'services.payOneTimePercent': '30%',
    'services.payOneTimeEnd': 'келісімшарт құнынан',
    'services.ps': 'P.S.',
    'services.psDesc': 'Егер сіздің қызметіңіз оң пікірлер алса (3 айда 5 сәтті кейс), біз оны негізгі ретінде барлық жарнама ресурстарымызға қосамыз.',
    
    // SubPartner page
    'subpartner.title': 'Субсеріктестік',
    'subpartner.amoPartnership': 'АМО және Битрикспен серіктестік',
    'subpartner.amoDesc': 'РентРОП АМО мен Битрикстің серіктесі. Біз арқылы ұзарту және лицензиялар сатып алу кезінде РОП қосымша табыс табады',
    'subpartner.amoPercent': 'төлем айырмашылығының 20%',
    'subpartner.additionalEarnings': 'Қосымша табыс',
    'subpartner.fromDifference': 'лицензиялар үшін төлем айырмашылығынан',
    'subpartner.clientBonuses': 'Клиентке бонустар',
    'subpartner.additionalLicenses': 'Қосымша лицензиялар',
    'subpartner.additionalLicensesDesc': 'Сатып алу кезінде сыйлыққа',
    'subpartner.bonusMonths': 'Бонустық айлар',
    'subpartner.bonusMonthsDesc': 'Ұзарту кезінде сыйлыққа',
    'subpartner.otherSystems': 'Осы жүйелерден басқа біз әлі де серіктеспіз',
    'subpartner.systemsCount': '40 түрлі жүйе',
    'subpartner.systemsEnd': 'автоматтандыру мен маркетинг. Сондықтан қосылу кезінде ДПР-ға хабарласыңыз.',
    
    // Training page
    'training.title': 'Оқыту',
    'training.stepByStep': 'Кезең-кезеңмен оқыту',
    'training.stepByStepDesc': 'Оқыту мәтіндік және бейне материалдардан және тест түріндегі аттестациядан тұрады. Тестті сәтті тапсырғаннан кейін келесі кезеңді жібереміз.',
    'training.stages': 'Барлығы 4 оқыту кезеңі:',
    'training.stage1': 'Жұмыс шарттары',
    'training.stage2': 'Оқу порталы',
    'training.stage3': 'Есептілік',
    'training.stage4': 'HR робот',
    'training.group': 'Оқыту тобы',
    'training.groupDesc1': 'Тест нәтижелері топта автоматты түрде тіркеледі',
    'training.groupName': 'Оқыту [VP]',
    'training.groupDesc2': 'Оған бірден кіру керек. Сонымен қатар онда оқыту бойынша сұрақтар мен пікірлер қалдыруға болады. Міндетті түрде жауап береміз.',
    'training.knowledgeBase': 'Білім базасы',
    'training.knowledgeBaseDesc1': 'Оқыту өз бетінше. Өте қарапайым. Компанияның Білім базасының негізгі ақпаратының тек 5% оқу керек.',
    'training.knowledgeBaseDesc2': 'Білім базасы біздің сарапшылармен 6 жылдан астам белсенді толықтырылады, жаңа ақпарат айына бірнеше рет пайда болады.',
    'training.accessNote': 'Барлық оқытуды аяқтағаннан кейін компанияның бүкіл Білім базасына қол жеткізуді жібереміз.',
    
    // Projects page
    'projects.title': 'Бет әзірленуде',
    'projects.description': 'Жобаларды Telegram арнасында көруге болады',
    'projects.viewInTelegram': 'Жобаларды көру',
    'projects.selection': 'Жобаларды таңдау',
    'projects.selectionDesc1': 'Жобаларды таңдау ашық.',
    'projects.telegramChannel': 'Telegram арнасында',
    'projects.selectionDesc2': 'сату бөлімі мерзімді түрде төленген жобаларды жариялайды, онда тапсырыс берушілер РОПпен танысуды күтеді.',
    'projects.selectionDesc3': 'Жобалар жауаптылардың байланыстары, сипаттамасы, аймағы, тарифі, не бар және не істеу керек екені бар пост түрінде орналастырылған.',
    'projects.selectionDesc4': 'Пост астындағы пікірлерде жауап беруге болады.',
    'projects.team': 'Жоба командасы',
    'projects.teamDesc': 'Жобаны бірнеше маман жүргізеді:',
    'projects.rop': 'РОП өзі',
    'projects.ropDesc': '— оның қолымен жұмыс пен басқару орындалады.',
    'projects.dpr': 'ДПР',
    'projects.dprDesc': '— даму стратегиясын әзірлейтін және тапсырмалардың уақытында орындалуын бақылайтын тәлімгер.',
    'projects.projectManager': 'Жоба менеджері',
    'projects.projectManagerDesc': '— төлемдерді және тапсырыс берушілердің адалдығын бақылау.',
    'projects.videoCard': 'Бейне-визитка',
    'projects.videoCardDesc': 'Пост астындағы Жобаларға бейне-визиткаға сілтеме форматында жауап беру керек.',
    'projects.videoInstructions': 'Бейне Визитканы жазу нұсқаулығы:',
    'projects.videoInstr1': 'Дайындық — жақсы жарықтандырылған тыныш орын таңдаңыз',
    'projects.videoInstr2': 'Өзіңіз, тәжірибеңіз және неге жобамен жұмыс істегіңіз келетіні туралы айтыңыз',
    'projects.videoInstr3': 'Оңтайлы ұзақтығы — 1-2 минут',
    'projects.important': 'Маңызды!',
    'projects.importantDesc': 'Егер РОП жобадан кетуді ойласа, бұл туралы ДПР-ға 14 күн бұрын хабарлауы керек. Осы уақыт ішінде біз ауыстыру тауып, жобадағы осы ауысуды реттейміз.',
    
    // Registration page
    'registration.title': 'Рәсімдеу',
    'registration.contractTerms': 'Келісімшарт шарттары',
    'registration.contractDesc1': 'Келісімшарт Ресей немесе Қазақстан деректемелеріне жасалады. Өзін-өзі жұмыспен қамтитын жеке тұлғалар үшін де, ЖК үшін де жасалады.',
    'registration.contractDesc2': 'Осы форматтағы салық жүктемесі тең бөлінеді, жартысын компания өтейді.',
    'registration.tkContract': 'Біз сонымен қатар жеке тұлғамен Еңбек кодексі бойынша келісімшарт жасай аламыз.',
    'registration.tkContractDesc': 'Сонда салық жүктемесін өзіңіз төлейсіз:',
    'registration.kzTax': 'Қазақстан',
    'registration.rfTax': 'Ресей',
    'registration.downloadContracts': 'Келісімшарттарды жүктеу',
    'registration.contractKzIp': 'ЖК үшін келісімшарт (Қазақстан)',
    'registration.contractRfSz': 'Өзін-өзі жұмыспен қамтитындар үшін келісімшарт',
    'registration.contractRfIp': 'ЖК үшін келісімшарт',
    'registration.procedure': 'Рәсімдеу тәртібі:',
    'registration.step1': 'Келісімшартпен танысу',
    'registration.step2': 'Келісімшартқа қол қою сарапшы жобаға шықпас бұрын жүзеге асырылады',
    'registration.step3': 'Оқыту кезеңінде құжатпен танысу қажет',
    'registration.step4': 'Келісімшартты жүктеу, қол қою және сұхбат жүргізген қызметкерге жіберу',
    
    // Payments page
    'payments.title': 'Төлемдер',
    'payments.schedule': 'Төлем кестесі',
    'payments.scheduleDesc': 'Төлемдер тапсырыс беруші төлегеннен кейін орындалған жұмыстар актілері бойынша айына екі рет сіздің банк шотыңызға/картаңызға жүзеге асырылады:',
    'payments.day30': '30-шы күні',
    'payments.day30Desc': 'Қазіргі уақытта табылған қаражаттың 50% аванс',
    'payments.day15': '15-ші күні',
    'payments.day15Desc': 'Өткен ай үшін толық есеп айырысу',
    
    // Vacancy section
    'vacancy.title': 'Позиция мәліметтері',
    'vacancy.yourTasks': 'Сіздің тапсырмаларыңыз',
    'vacancy.whatWeExpect': 'Біз сізден не күтеміз',
    'vacancy.whatYouGet': 'Сіз не аласыз',
    'vacancy.salary': 'Жалақы',
    'vacancy.resp1': 'РОП ретінде тексерілген жобаларда жұмыс істеу',
    'vacancy.resp2': 'Жоба Жол картасы бойынша тапсырмаларды орындау',
    'vacancy.resp3': 'Қоңырауларды тыңдау және менеджерлермен жоспарлау кездесулерін өткізу',
    'vacancy.resp4': 'Жобаларда персоналды жалдау, бейімдеу және оқыту',
    'vacancy.resp5': 'AmoCRM/Bitrix24-пен жұмыс істеу және есептілікті бақылау',
    'vacancy.resp6': 'Табысты масштабтау үшін меншік иелерімен өзара әрекеттесу',
    'vacancy.req1': 'РОП немесе жетекші сату сарапшысы ретінде 2+ жыл тәжірибе',
    'vacancy.req2': 'Сату бөлімін құру әдістемесін түсіну',
    'vacancy.req3': 'Сату воронкаларын терең талдау дағдылары',
    'vacancy.req4': 'Көшбасшылық қасиеттер және көп тапсырмалылық режимінде жұмыс істеу қабілеті',
    'vacancy.req5': 'Клиент KPI үшін жоғары жауапкершілік деңгейі',
    'vacancy.ben1': 'Мөлдір мотивация жүйесі: фикс + айнымалы + серіктестік бонустар',
    'vacancy.ben2': 'Толығымен қашықтан жұмыс форматы',
    'vacancy.ben3': 'Жабық қауымдастыққа және РентРОП білім базасына қол жеткізу',
    'vacancy.ben4': 'Компания есебінен оқыту және серіктеске дейін мансаптық лифт',
    'vacancy.ben5': 'Үздік жобалармен және қызықты тауашалармен жұмыс істеу',
    'vacancy.salaryValue': '150 000-нан 450 000 ₽ дейін',
    
    // AI Assistant
    'ai.placeholder': 'Вакансия туралы сұрақ қойыңыз...',
    'ai.title': 'AI Кеңесші',
    'ai.subtitle': 'РентРОП',
    'ai.greeting': 'Сәлеметсіз бе! Мен РентРОП AI көмекшісімін. Вакансия, жұмыс шарттары немесе компания туралы кез келген сұрақ қойыңыз.',
    'ai.error': 'Кешіріңіз, қате орын алды. Қайталап көріңіз.',
    
    // Profile
    'profile.contractButton': 'Шарт құру',
    'profile.videoCardButton': 'Бейне-визитка жасау',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      return (saved as Language) || 'ru';
    }
    return 'ru';
  });

  const [dbTranslations, setDbTranslations] = useState<Record<string, Translation>>({});
  const [loading, setLoading] = useState(true);

  // Fetch translations from database
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const { data, error } = await supabase
          .from('translations')
          .select('key, text_ru, text_en, text_kz');

        if (error) {
          console.error('Error fetching translations:', error);
          setLoading(false);
          return;
        }

        if (data) {
          const translationsMap: Record<string, Translation> = {};
          data.forEach((item) => {
            translationsMap[item.key] = item;
          });
          setDbTranslations(translationsMap);
        }
      } catch (err) {
        console.error('Failed to fetch translations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('translations-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'translations'
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const newData = payload.new as Translation;
            setDbTranslations(prev => ({
              ...prev,
              [newData.key]: newData
            }));
          } else if (payload.eventType === 'DELETE') {
            const oldData = payload.old as { key: string };
            setDbTranslations(prev => {
              const updated = { ...prev };
              delete updated[oldData.key];
              return updated;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguageFromTelegram = useCallback((telegramLangCode: string | null | undefined) => {
    const mappedLang = mapTelegramLanguage(telegramLangCode);
    setLanguage(mappedLang);
  }, []);

  const t = (key: string): string => {
    // First try to get from database
    const dbTranslation = dbTranslations[key];
    
    if (dbTranslation) {
      switch (language) {
        case 'ru':
          return dbTranslation.text_ru || translations.ru[key] || key;
        case 'en':
          return dbTranslation.text_en || dbTranslation.text_ru || translations.en?.[key] || translations.ru[key] || key;
        case 'kz':
          return dbTranslation.text_kz || dbTranslation.text_ru || translations.kz?.[key] || translations.ru[key] || key;
        default:
          return dbTranslation.text_ru || translations.ru[key] || key;
      }
    }

    // Fallback to hardcoded translations
    return translations[language]?.[key] || translations.ru?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, setLanguageFromTelegram, t, loading }}>
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
