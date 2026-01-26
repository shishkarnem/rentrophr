import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ProTalk API configuration
const PROTALK_URL = "https://eu1.api.pro-talk.ru/api/v1.0/ask";

const generateChatId = () => `ask${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

async function askProTalk(message: string, token: string, botId: number): Promise<string> {
  const response = await fetch(`${PROTALK_URL}/${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bot_id: botId,
      chat_id: generateChatId(),
      message
    })
  });

  if (!response.ok) {
    console.error('ProTalk API error:', response.status);
    throw new Error(`ProTalk API error: ${response.status}`);
  }

  const data = await response.json();
  return data.done || '';
}

// Page content database for search
const pageContent: Record<string, { title: string; path: string; category: string; content: string }> = {
  'home': {
    title: 'Главная',
    path: '/',
    category: 'Главная',
    content: 'RentROP HR портал вакансий. Удаленный отдел продаж. Работа менеджером по продажам. Зарплата от 100 000 рублей. Гибкий график работы.'
  },
  'arenda-ropov': {
    title: 'Аренда РОПов',
    path: '/work/arenda-ropov',
    category: 'Работа',
    content: 'Аренда руководителей отдела продаж. РОП на аутсорсинге. Удаленное управление продажами. Профессиональные менеджеры.'
  },
  'about': {
    title: 'О компании',
    path: '/work/about',
    category: 'Работа',
    content: 'О компании RentROP. История компании. Миссия и ценности. Команда профессионалов. Наши достижения.'
  },
  'community': {
    title: 'Сообщество',
    path: '/work/community',
    category: 'Работа',
    content: 'Сообщество RentROP. Корпоративная культура. Команда. Мероприятия. Обучение и развитие.'
  },
  'reports': {
    title: 'Отчеты',
    path: '/work/reports',
    category: 'Работа',
    content: 'Отчеты о работе. Ежедневные отчеты. Еженедельные отчеты. KPI показатели. Аналитика продаж.'
  },
  'dpr': {
    title: 'ДПР',
    path: '/work/dpr',
    category: 'Работа',
    content: 'Дисциплина и правила работы. Регламенты. Стандарты качества. Требования к сотрудникам.'
  },
  'employees': {
    title: 'Сотрудники',
    path: '/work/employees',
    category: 'Работа',
    content: 'Сотрудники компании. Менеджеры по продажам. Руководители. Команда поддержки.'
  },
  'motivation': {
    title: 'Мотивация',
    path: '/conditions/motivation',
    category: 'Условия',
    content: 'Система мотивации. Бонусы и премии. Фиксированная часть. Переменная часть. Партнерская программа. Доход от 100 000 рублей.'
  },
  'training': {
    title: 'Обучение',
    path: '/conditions/training',
    category: 'Условия',
    content: 'Программа обучения. Курсы продаж. Тренинги. Наставничество. Развитие навыков. Сертификация.'
  },
  'projects': {
    title: 'Проекты',
    path: '/conditions/projects',
    category: 'Условия',
    content: 'Проекты компании. Объекты продаж. Клиенты. Направления работы. B2B и B2C продажи.'
  },
  'registration': {
    title: 'Оформление',
    path: '/conditions/registration',
    category: 'Условия',
    content: 'Оформление на работу. Документы. Договор. Самозанятость. ИП. Юридические вопросы.'
  },
  'payments': {
    title: 'Выплаты',
    path: '/conditions/payments',
    category: 'Условия',
    content: 'Выплаты зарплаты. График выплат. Способы получения. Налоги. Бонусы.'
  },
  'fix': {
    title: 'Фикс',
    path: '/conditions/motivation/fix',
    category: 'Мотивация',
    content: 'Фиксированная премия. Оклад. Базовая ставка от 40% до 55% от тарифа. Форматы работы: онлайн, офлайн, комбинированный. Занятость 4 или 8 часов. Тарифы: входящий, холодный, с нуля. Регионы: международный, РФ, СНГ, Казахстан. НДС информация.'
  },
  'variable': {
    title: 'Переменка',
    path: '/conditions/motivation/variable',
    category: 'Мотивация',
    content: 'Переменная премия. Бонусы от продаж. Процент от выручки. Расчет премии. KPI показатели.'
  },
  'partner': {
    title: 'Партнер',
    path: '/conditions/motivation/partner',
    category: 'Мотивация',
    content: 'Партнерская программа. Реферальные бонусы. Привлечение клиентов. Комиссионные выплаты.'
  },
  'services': {
    title: 'Услуги',
    path: '/conditions/motivation/services',
    category: 'Мотивация',
    content: 'Дополнительные услуги. Сервисы для партнеров. Поддержка продаж.'
  },
  'subpartner': {
    title: 'Субпартнер',
    path: '/conditions/motivation/subpartner',
    category: 'Мотивация',
    content: 'Субпартнерская программа. Многоуровневый маркетинг. Привлечение партнеров.'
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, language = 'ru' } = await req.json();

    if (!query || query.trim().length < 2) {
      return new Response(
        JSON.stringify({ results: [], aiSummary: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lowerQuery = query.toLowerCase();
    
    // Search through all pages
    const searchResults = Object.entries(pageContent)
      .map(([key, page]) => {
        const titleMatch = page.title.toLowerCase().includes(lowerQuery);
        const contentMatch = page.content.toLowerCase().includes(lowerQuery);
        const categoryMatch = page.category.toLowerCase().includes(lowerQuery);
        
        let score = 0;
        if (titleMatch) score += 10;
        if (categoryMatch) score += 5;
        if (contentMatch) score += 3;
        
        const occurrences = (page.content.toLowerCase().match(new RegExp(lowerQuery, 'g')) || []).length;
        score += occurrences;
        
        return { ...page, key, score, matched: score > 0 };
      })
      .filter(page => page.matched)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Generate AI summary using ProTalk
    let aiSummary = null;
    
    if (searchResults.length > 0) {
      try {
        const PROTALK_BOT_TOKEN = Deno.env.get('PROTALK_BOT_TOKEN');
        const PROTALK_BOT_ID = Deno.env.get('PROTALK_BOT_ID');

        if (PROTALK_BOT_TOKEN && PROTALK_BOT_ID) {
          const contextText = searchResults
            .map(r => `${r.title}: ${r.content}`)
            .join('\n');

          const langNames: Record<string, string> = {
            'ru': 'русском',
            'en': 'английском',
            'kz': 'казахском'
          };

          const prompt = `Ты помощник по поиску на HR-портале RentROP. Отвечай кратко и по делу на ${langNames[language] || 'русском'} языке. Максимум 2 предложения.

Пользователь ищет: "${query}"

Найденная информация:
${contextText}

Дай краткий полезный ответ на запрос пользователя.`;

          aiSummary = await askProTalk(prompt, PROTALK_BOT_TOKEN, parseInt(PROTALK_BOT_ID));
        }
      } catch (aiError) {
        console.error('AI summary error:', aiError);
      }
    }

    return new Response(
      JSON.stringify({
        results: searchResults.map(r => ({
          title: r.title,
          path: r.path,
          category: r.category,
          snippet: r.content.slice(0, 100) + '...',
        })),
        aiSummary,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Search error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Search failed';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
