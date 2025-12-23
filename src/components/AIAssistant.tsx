import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Quick reply suggestions based on language
const getQuickReplies = (language: string) => {
  switch (language) {
    case 'en':
      return [
        'How to pass the interview?',
        'What is the salary?',
        'How does training work?',
        'Work schedule?'
      ];
    case 'kz':
      return [
        'Сұхбаттан қалай өтуге болады?',
        'Жалақы қандай?',
        'Оқыту қалай жүреді?',
        'Жұмыс кестесі?'
      ];
    default:
      return [
        'Как пройти собеседование?',
        'Какая зарплата?',
        'Как проходит обучение?',
        'График работы?'
      ];
  }
};

// Extract URLs from content
const extractUrls = (content: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;
  return content.match(urlRegex) || [];
};

// Parse message content with Markdown and render links as buttons
const MessageContent = ({ content, isAssistant }: { content: string; isAssistant: boolean }) => {
  if (!content) return null;

  const urls = extractUrls(content);
  const uniqueUrls = [...new Set(urls)];

  return (
    <div className="space-y-3">
      {/* Markdown rendered content */}
      <div className="prose prose-sm prose-invert max-w-none">
        <ReactMarkdown
          components={{
            // Custom heading styles
            h1: ({ children }) => (
              <h1 className="text-base font-bold text-white mt-3 mb-2 first:mt-0">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-sm font-bold text-white mt-2 mb-1.5 first:mt-0">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-sm font-semibold text-white/90 mt-2 mb-1 first:mt-0">{children}</h3>
            ),
            // Paragraph
            p: ({ children }) => (
              <p className="text-white/90 mb-2 last:mb-0 leading-relaxed">{children}</p>
            ),
            // Strong/bold text
            strong: ({ children }) => (
              <strong className="font-semibold text-white">{children}</strong>
            ),
            // Emphasis/italic
            em: ({ children }) => (
              <em className="italic text-white/80">{children}</em>
            ),
            // Lists
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-1 mb-2 ml-1">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-1 mb-2 ml-1">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="text-white/90">{children}</li>
            ),
            // Links - styled as clickable
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 underline underline-offset-2 transition-colors break-all"
              >
                {children}
              </a>
            ),
            // Code blocks
            code: ({ children, className }) => {
              const isInline = !className;
              return isInline ? (
                <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs text-accent font-mono">
                  {children}
                </code>
              ) : (
                <code className="block bg-white/10 p-2 rounded-lg text-xs text-white/90 font-mono overflow-x-auto my-2">
                  {children}
                </code>
              );
            },
            // Blockquote
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-accent/50 pl-3 my-2 text-white/70 italic">
                {children}
              </blockquote>
            ),
            // Horizontal rule
            hr: () => <hr className="border-white/20 my-3" />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      
      {/* URL buttons for quick access */}
      {isAssistant && uniqueUrls.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {uniqueUrls.slice(0, 4).map((url, i) => {
            // Extract domain for button label
            let label = '';
            try {
              const domain = new URL(url).hostname.replace('www.', '');
              label = domain.split('.')[0];
              // Capitalize first letter
              label = label.charAt(0).toUpperCase() + label.slice(1);
            } catch {
              label = 'Ссылка';
            }
            
            return (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, hsl(45, 74%, 65%) 0%, hsl(35, 62%, 55%) 100%)',
                  color: 'hsl(207, 52%, 20%)'
                }}
              >
                <ExternalLink className="w-3 h-3" />
                {label}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

const AIAssistant = () => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickReplies = getQuickReplies(language);

  // Set initial greeting based on language
  useEffect(() => {
    setMessages([{ role: 'assistant', content: t('ai.greeting') }]);
    setShowQuickReplies(true);
  }, [language, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowQuickReplies(false);

    let assistantContent = '';

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages.slice(1), userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          language: language
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader');

      // Add empty assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'assistant', content: assistantContent };
                return newMessages;
              });
            }
          } catch {
            // Incomplete JSON, put it back
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: t('ai.error') }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        style={{
          background: 'linear-gradient(135deg, hsl(207, 52%, 20%) 0%, hsl(207, 52%, 33%) 100%)',
          boxShadow: '0 8px 32px hsla(45, 74%, 65%, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
        }}
      >
        <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse" />
      </button>

      {/* Chat window */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, hsla(207, 52%, 20%, 0.95) 0%, hsla(207, 52%, 33%, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
        >
          {/* Header */}
          <div 
            className="p-4 flex items-center justify-between"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, hsl(45, 74%, 65%) 0%, hsl(35, 62%, 55%) 100%)' }}
              >
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">{t('ai.title')}</h3>
                <p className="text-white/50 text-xs">{t('ai.subtitle')}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-[350px] overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-accent/20' 
                      : ''
                  }`}
                  style={message.role === 'assistant' ? { 
                    background: 'linear-gradient(135deg, hsl(45, 74%, 65%) 0%, hsl(35, 62%, 55%) 100%)' 
                  } : {}}
                >
                  {message.role === 'user' 
                    ? <User className="w-4 h-4 text-accent" /> 
                    : <Bot className="w-4 h-4 text-primary" />
                  }
                </div>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-accent/20 text-white rounded-tr-sm'
                      : 'bg-white/10 text-white/90 rounded-tl-sm'
                  }`}
                  style={{
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {message.content ? (
                    <MessageContent 
                      content={message.content} 
                      isAssistant={message.role === 'assistant'} 
                    />
                  ) : (
                    isLoading && index === messages.length - 1 && (
                      <Loader2 className="w-4 h-4 animate-spin text-accent" />
                    )
                  )}
                </div>
              </div>
            ))}
            
            {/* Quick reply buttons */}
            {showQuickReplies && messages.length === 1 && !isLoading && (
              <div className="flex flex-wrap gap-2 pt-2">
                {quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium text-white/80 hover:text-white transition-all hover:scale-105"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div 
            className="p-4"
            style={{
              background: 'linear-gradient(0deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div 
              className="flex items-center gap-2 p-2 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)'
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('ai.placeholder')}
                className="flex-1 bg-transparent text-white placeholder:text-white/40 text-sm px-2 outline-none"
                disabled={isLoading}
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                size="sm"
                className="w-9 h-9 p-0 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, hsl(45, 74%, 65%) 0%, hsl(35, 62%, 55%) 100%)'
                }}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : (
                  <Send className="w-4 h-4 text-primary" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;
