import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardGlass } from '@/components/ui/card';
import { RENTROP_VACANCY } from '@/constants/vacancy';
import { ChatMessage } from '@/types/vacancy';
import { Send, Bot, User, Sparkles } from 'lucide-react';

// Simple AI response function (no API needed)
const getAIResponse = (question: string): string => {
  const q = question.toLowerCase();
  
  if (q.includes('зарплат') || q.includes('оплат') || q.includes('деньг') || q.includes('доход')) {
    return `💰 Зарплата на позиции ${RENTROP_VACANCY.title}: ${RENTROP_VACANCY.salary}. Система мотивации прозрачная: фиксированная часть + переменная + партнерские бонусы!`;
  }
  
  if (q.includes('обязанност') || q.includes('делать') || q.includes('задач')) {
    return `📋 Основные задачи:\n${RENTROP_VACANCY.responsibilities.slice(0, 3).map(r => `• ${r}`).join('\n')}\n\nИ это ещё не всё! Хотите узнать больше?`;
  }
  
  if (q.includes('требован') || q.includes('нужн') || q.includes('опыт')) {
    return `✅ Ключевые требования:\n${RENTROP_VACANCY.requirements.slice(0, 3).map(r => `• ${r}`).join('\n')}\n\nГотовы попробовать свои силы?`;
  }
  
  if (q.includes('бонус') || q.includes('преимуществ') || q.includes('плюс')) {
    return `🎁 Что вы получите:\n${RENTROP_VACANCY.benefits.map(b => `• ${b}`).join('\n')}`;
  }
  
  if (q.includes('удален') || q.includes('офис') || q.includes('формат') || q.includes('где')) {
    return `🏠 Формат работы: ${RENTROP_VACANCY.location}. Полностью удаленная работа из любой точки РФ и СНГ!`;
  }
  
  if (q.includes('компани') || q.includes('рентроп') || q.includes('кто вы')) {
    return `🏢 ${RENTROP_VACANCY.description}`;
  }
  
  if (q.includes('привет') || q.includes('здравствуй') || q.includes('добр')) {
    return `Привет! 👋 Рад видеть вас! Я HR-ассистент РентРОП. Готов ответить на любые вопросы о вакансии ${RENTROP_VACANCY.title}. Что бы вы хотели узнать?`;
  }
  
  return `Отличный вопрос! 🤔 К сожалению, у меня нет точного ответа на это. Но я могу рассказать о зарплате, обязанностях, требованиях или преимуществах работы у нас. Или оставьте заявку — наши HR-специалисты ответят на все ваши вопросы!`;
};

const AIChatSection = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Привет! 👋 Я HR-ассистент РентРОП. Задайте любой вопрос о вакансии — я помогу!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const response = getAIResponse(userMessage);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsTyping(false);
  };

  const quickQuestions = [
    'Какая зарплата?',
    'Какие обязанности?',
    'Можно удаленно?'
  ];

  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Section header */}
          <div className="mb-12 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-gold mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">AI Powered</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-foreground uppercase tracking-tight">
              Есть вопросы?
            </h2>
            <p className="text-muted-foreground text-lg">
              Спросите нашего AI-ассистента о вакансии
            </p>
          </div>

          <CardGlass className="overflow-hidden">
            {/* Chat header */}
            <div className="p-4 gradient-primary flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <span className="font-semibold text-white">HR-Бот Ассистент</span>
              </div>
              <span className="text-xs uppercase tracking-widest text-white/50">Online</span>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="h-[350px] overflow-y-auto p-4 space-y-4 custom-scrollbar bg-background"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' ? 'gradient-gold' : 'gradient-primary'
                    }`}>
                      {msg.role === 'user' 
                        ? <User className="w-4 h-4 text-primary" />
                        : <Bot className="w-4 h-4 text-white" />
                      }
                    </div>
                    <div className={`p-4 rounded-2xl text-sm whitespace-pre-line ${
                      msg.role === 'user' 
                        ? 'gradient-gold text-primary rounded-br-md' 
                        : 'glass text-foreground rounded-bl-md'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-end gap-2">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="glass p-4 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick questions */}
            <div className="px-4 py-3 bg-muted/50 border-t border-border flex gap-2 overflow-x-auto">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-card border-t border-border flex gap-3">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Задайте вопрос..."
                className="flex-grow"
              />
              <Button 
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                variant="cta"
                size="icon"
                className="w-12 h-12"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </CardGlass>
        </div>
      </div>
    </section>
  );
};

export default AIChatSection;
