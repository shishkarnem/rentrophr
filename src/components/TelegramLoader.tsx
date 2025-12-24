import { Loader2 } from 'lucide-react';

const TelegramLoader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{
      background: 'linear-gradient(180deg, #17344F 0%, #265582 100%)'
    }}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <p className="text-white/70 text-sm">Загрузка...</p>
      </div>
    </div>
  );
};

export default TelegramLoader;
