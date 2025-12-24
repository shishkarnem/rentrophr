import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { useTelegram } from '@/contexts/TelegramContext';

const ProfileIcon = () => {
  const { profile, isLoading } = useTelegram();

  // Always show the profile icon (Telegram or not). If still loading, show placeholder icon.
  if (isLoading) {
    return (
      <Link
        to="/profile"
        className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-accent/30 hover:border-accent transition-colors flex items-center justify-center bg-muted"
        aria-label="Профиль"
      >
        <User className="w-4 h-4 text-muted-foreground" />
      </Link>
    );
  }

  return (
    <Link
      to="/profile"
      className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-accent/30 hover:border-accent transition-colors flex items-center justify-center bg-muted"
    >
      {profile?.photo_url ? (
        <img 
          src={profile.photo_url} 
          alt="Profile" 
          className="w-full h-full object-cover"
        />
      ) : (
        <User className="w-4 h-4 text-muted-foreground" />
      )}
    </Link>
  );
};

export default ProfileIcon;
