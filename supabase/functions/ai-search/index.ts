import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Page content database for search
const pageContent: Record<string, { title: string; path: string; category: string; content: string }> = {
  // Main pages
  'home': {
    title: 'Главная',
    path: '/',
    category: 'Главная',
    content: 'RentROP HR портал вакансий. Удаленный отдел продаж. Работа менеджером по продажам. Зарплата от 100 000 рублей. Гибкий график работы.'
  },
  
  // Work pages
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
  
  // Conditions pages
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
  
  // Motivation sub-pages
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
        
        // Calculate relevance score
        let score = 0;
        if (titleMatch) score += 10;
        if (categoryMatch) score += 5;
        if (contentMatch) score += 3;
        
        // Count keyword occurrences in content
        const occurrences = (page.content.toLowerCase().match(new RegExp(lowerQuery, 'g')) || []).length;
        score += occurrences;
        
        return { ...page, key, score, matched: score > 0 };
      })
      .filter(page => page.matched)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Generate AI summary using Lovable AI
    let aiSummary = null;
    
    if (searchResults.length > 0) {
      try {
        const contextText = searchResults
          .map(r => `${r.title}: ${r.content}`)
          .join('\n');

        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: `Ты помощник по поиску на HR-портале RentROP. Отвечай кратко и по делу на ${language === 'ru' ? 'русском' : language === 'en' ? 'английском' : 'казахском'} языке. Максимум 2 предложения.`
              },
              {
                role: 'user',
                content: `Пользователь ищет: "${query}"\n\nНайденная информация:\n${contextText}\n\nДай краткий полезный ответ на запрос пользователя.`
              }
            ],
            max_tokens: 150,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          aiSummary = data.choices?.[0]?.message?.content || null;
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
