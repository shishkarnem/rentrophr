import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const COMPANY_KNOWLEDGE = `
Ты - AI-ассистент компании РентРОП. Отвечай на вопросы кандидатов о вакансии и компании.
Будь дружелюбным и профессиональным. Отвечай кратко и по делу.

ИНФОРМАЦИЯ О КОМПАНИИ И ВАКАНСИИ:

== О КОМПАНИИ ==
История компании начинается в феврале 2017 года, более 5 лет.
Начинали с построения удаленных отделов продаж под ключ.
В 2018 запустили академию ВАШ РОП — первая академия руководителей отделов продаж.
Первый проект по Аренде РОПа начался в апреле 2020.
За последние пару лет Аренда РОПов стала флагманом среди услуг.

== ПРОДУКТ ==
Основной продукт — Аренда Руководителей Отделов Продаж.
Мы обучаем специалистов и сдаем в Аренду. Специалист работает в штате РентРОП, но выполняет обязанности РОПа у заказчика. Работает удаленно.

== ВАКАНСИЯ ==
Позиция: Эксперт / Руководитель Отдела Продаж
Зарплата: от 150 000 до 450 000 ₽
Локация: Удаленно / РФ и СНГ
Тип занятости: Полная занятость

== ОБЯЗАННОСТИ ==
- Управление проектами по "Аренде РОПов"
- Формирование и контроль ДПР (Дорожной Карты Проекта)
- Прослушка звонков и проведение планерок с менеджерами
- Найм, адаптация и обучение персонала на проектах
- Работа с AmoCRM/Bitrix24 и контроль отчетности
- Взаимодействие с собственниками для масштабирования выручки

== ТРЕБОВАНИЯ ==
- Опыт работы РОПом или ведущим экспертом по продажам от 2 лет
- Понимание методологии построения ОП
- Навыки глубокой аналитики воронок продаж
- Лидерские качества и умение работать в режиме многозадачности
- Высокий уровень ответственности за KPI клиента

== МОТИВАЦИЯ ==
Зарплата состоит из двух частей:
1. Фиксированная премия — оклад за работу
2. Переменная премия — оплата за результат (процент с выручки отдела)

Дополнительно:
- Партнерка — бонусы за привлечение клиентов
- Услуги — заработок на консалтинге
- Суб.партнерка — бонусы за привлечение специалистов

== ОБУЧЕНИЕ ==
4 этапа обучения:
1. Условия работы
2. Обучающий портал
3. Отчетность
4. Робот HR

Обучение самостоятельное, состоит из текстовых и видео материалов с аттестацией.
По итогу обучения предоставляется доступ к полной Базе Знаний компании.

== ПРОЕКТЫ ==
Подбор проектов открытый через телеграм канал.
Проект ведет команда: РОП, ДПР (наставник), Менеджер проекта.
Если хотите уйти с проекта — предупредить за 14 дней.

== ОФОРМЛЕНИЕ ==
Договор для России или Казахстана.
Для самозанятых и ИП — налоговая нагрузка делится пополам с компанией.
Для физлиц по ТК — 26% Казахстан, 43% Россия.

== ВЫПЛАТЫ ==
30 числа — аванс 50%
15 числа — полный расчет за предыдущий месяц

== СТРУКТУРА КОМПАНИИ ==
- Отдел Обучения и Найма
- Юридический отдел
- Отдел продаж
- Партнерский отдел
- Проектный отдел
- Технический отдел
- Отдел маркетинга

== КОНТАКТЫ ==
Telegram: https://t.me/rentrop
YouTube: https://www.youtube.com/@arendaropa
ВКонтакте: https://vk.com/RentROP
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: COMPANY_KNOWLEDGE },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Слишком много запросов, попробуйте позже." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Требуется пополнение баланса." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Ошибка AI сервиса" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Неизвестная ошибка" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
