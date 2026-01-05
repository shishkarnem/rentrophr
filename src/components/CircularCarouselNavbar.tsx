import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Menu, User, FolderKanban, MessageCircle, 
  Star, BookOpen, Send, Youtube, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { useTelegram } from '@/contexts/TelegramContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  externalUrl?: string;
}

const CircularCarouselNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useTelegram();
  const { t } = useLanguage();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  // VK icon component
  const VKIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.57 4 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.847 2.455 2.27 4.607 2.86 4.607.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.168-3.624 2.168-3.624.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/>
    </svg>
  );

  const navItems: NavItem[] = [
    { id: 'home', icon: <Home className="w-6 h-6" />, label: t('nav.home'), path: '/' },
    { id: 'menu', icon: <Menu className="w-6 h-6" />, label: t('nav.menu') || 'Меню', path: '/conditions' },
    { id: 'profile', icon: <User className="w-6 h-6" />, label: t('nav.profile'), path: '/profile' },
    { id: 'projects', icon: <FolderKanban className="w-6 h-6" />, label: t('nav.projects') || 'Проекты', path: '/projects' },
    { id: 'ai-chat', icon: <MessageCircle className="w-6 h-6" />, label: 'ИИ Чат', path: '/wiki?openChat=true' },
    { id: 'motivation', icon: <Star className="w-6 h-6" />, label: t('conditions.motivation'), path: '/conditions/motivation' },
    { id: 'wiki', icon: <BookOpen className="w-6 h-6" />, label: t('nav.wiki'), path: '/wiki' },
    { id: 'telegram', icon: <Send className="w-6 h-6" />, label: 'Telegram', externalUrl: 'https://t.me/rentrop_expert' },
    { id: 'youtube', icon: <Youtube className="w-6 h-6" />, label: 'YouTube', externalUrl: 'https://youtube.com/@rentrop' },
    { id: 'vk', icon: <VKIcon />, label: 'ВКонтакте', externalUrl: 'https://vk.com/rentrop' },
  ];

  const totalItems = navItems.length;
  
  // Calculate visible items (5 items visible on the arc)
  const visibleCount = 5;
  const angleStep = 180 / (visibleCount + 1); // Spread across the arc
  
  // Get items to display (infinite loop)
  const getVisibleItems = () => {
    const items = [];
    const halfVisible = Math.floor(visibleCount / 2);
    
    for (let i = -halfVisible; i <= halfVisible; i++) {
      let index = (currentIndex + i + totalItems) % totalItems;
      items.push({ ...navItems[index], offset: i });
    }
    return items;
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 50;
    
    if (info.offset.x > threshold) {
      handlePrev();
    } else if (info.offset.x < -threshold) {
      handleNext();
    }
  };

  const handleItemClick = (item: NavItem) => {
    if (item.externalUrl) {
      window.open(item.externalUrl, '_blank');
    } else if (item.path) {
      navigate(item.path);
    }
  };

  // Arc radius and position calculations
  const arcRadius = 300; // Large radius for the circle
  const arcCenterY = arcRadius + 40; // Center below the visible area

  const getItemPosition = (offset: number) => {
    // Angle from center (0 = top of arc, negative = left, positive = right)
    const angle = (offset * angleStep) * (Math.PI / 180);
    
    const x = Math.sin(angle) * arcRadius;
    const y = arcCenterY - Math.cos(angle) * arcRadius;
    
    // Scale based on position (center = largest)
    const scale = offset === 0 ? 1.7 : 1 - Math.abs(offset) * 0.15;
    const opacity = offset === 0 ? 1 : 0.6 - Math.abs(offset) * 0.1;
    
    return { x, y, scale, opacity };
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-32 overflow-hidden safe-area-bottom">
      {/* Arc background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main arc shape */}
        <svg 
          viewBox="0 0 400 160" 
          className="w-full h-full"
          preserveAspectRatio="xMidYMax slice"
        >
          <defs>
            {/* Dark blue gradient */}
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#265582" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#17344F" stopOpacity="0.98" />
            </linearGradient>
            
            {/* Gold gradient for border */}
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D99E41" />
              <stop offset="50%" stopColor="#F4EE8E" />
              <stop offset="100%" stopColor="#D99E41" />
            </linearGradient>
            
            {/* Glow filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main arc background */}
          <ellipse 
            cx="200" 
            cy="280" 
            rx="250" 
            ry="200" 
            fill="url(#arcGradient)"
          />
          
          {/* Gold border arc */}
          <ellipse 
            cx="200" 
            cy="280" 
            rx="250" 
            ry="200" 
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="2"
            filter="url(#glow)"
          />
          
          {/* Inner gold arc */}
          <ellipse 
            cx="200" 
            cy="290" 
            rx="220" 
            ry="175" 
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
        </svg>
      </div>

      {/* Carousel container */}
      <motion.div
        ref={containerRef}
        className="relative w-full h-full flex items-end justify-center pb-4"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
      >
        {/* Navigation arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-1/2 -translate-x-20 bottom-12 z-20 w-8 h-8 flex items-center justify-center text-gold/80 hover:text-gold transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={handleNext}
          className="absolute left-1/2 translate-x-12 bottom-12 z-20 w-8 h-8 flex items-center justify-center text-gold/80 hover:text-gold transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Items on the arc */}
        <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
          {getVisibleItems().map((item) => {
            const pos = getItemPosition(item.offset);
            const isActive = item.offset === 0;
            const isCurrentPath = item.path && location.pathname === item.path.split('?')[0];
            
            return (
              <motion.button
                key={`${item.id}-${item.offset}`}
                className={`absolute left-1/2 flex flex-col items-center justify-center transition-all duration-300 ${
                  isDragging ? 'pointer-events-none' : ''
                }`}
                style={{
                  x: pos.x - 28,
                  y: pos.y - 100,
                  scale: pos.scale,
                  opacity: pos.opacity,
                  zIndex: isActive ? 10 : 5 - Math.abs(item.offset),
                }}
                onClick={() => !isDragging && handleItemClick(item)}
                whileTap={{ scale: pos.scale * 0.9 }}
                initial={false}
                animate={{
                  x: pos.x - 28,
                  y: pos.y - 100,
                  scale: pos.scale,
                  opacity: pos.opacity,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {/* Icon container */}
                <div 
                  className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'w-14 h-14 bg-gradient-to-br from-[#1E4468] to-[#17344F] border-2 border-gold shadow-lg shadow-gold/30' 
                      : 'w-10 h-10 bg-gradient-to-br from-[#1E4468]/80 to-[#17344F]/80'
                  }`}
                  style={{
                    boxShadow: isActive 
                      ? '0 0 20px rgba(231, 199, 104, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)' 
                      : 'none',
                  }}
                >
                  <div className={`${isActive ? 'text-gold' : 'text-gold/70'} transition-colors`}>
                    {item.id === 'profile' && profile?.photo_url ? (
                      <img 
                        src={profile.photo_url} 
                        alt="Profile" 
                        className={`rounded-full object-cover ${isActive ? 'w-10 h-10' : 'w-6 h-6'}`}
                      />
                    ) : (
                      item.icon
                    )}
                  </div>
                  
                  {/* Active glow ring */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, transparent 60%, rgba(231, 199, 104, 0.2) 100%)',
                      }}
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                </div>
                
                {/* Label - only for active item */}
                {isActive && (
                  <motion.span
                    className="text-[11px] mt-1 text-gold font-medium whitespace-nowrap"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {item.label}
                  </motion.span>
                )}
                
                {/* Current route indicator */}
                {isCurrentPath && (
                  <motion.div
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-gold"
                    layoutId="routeIndicator"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </nav>
  );
};

export default CircularCarouselNavbar;
