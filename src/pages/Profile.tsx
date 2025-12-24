import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Camera, Save, ArrowLeft, Edit2 } from 'lucide-react';
import { useTelegram } from '@/contexts/TelegramContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { isTelegram, profile, isLoading, updateProfile, uploadPhoto } = useTelegram();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    username: profile?.username || '',
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        username: profile.username || '',
      });
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!isTelegram) {
    return (
      <div 
        className="min-h-screen relative z-10"
        style={{
          background: 'linear-gradient(180deg, #17344F 0%, #265582 100%)'
        }}
      >
        {/* Header */}
        <div className="glass-dark border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-lg font-semibold text-white">{t('profile.title')}</h1>
          </div>
        </div>

        <main className="container mx-auto px-4 py-10 max-w-md">
          <section className="glass-dark rounded-2xl p-6">
            <h2 className="text-white font-semibold text-lg">{t('profile.openViaBot')}</h2>
            <p className="text-white/70 mt-2">
              {t('profile.autofillHint')}
            </p>
            <Button
              className="w-full mt-6 bg-accent hover:bg-accent/80 text-primary"
              asChild
            >
              <a
                href="https://t.me/RentROP_HR_bot/app"
                target="_blank"
                rel="noreferrer"
              >
                {t('profile.openButton')}
              </a>
            </Button>
          </section>
        </main>
      </div>
    );
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(t('profile.selectImage'));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('profile.fileTooLarge'));
      return;
    }

    setIsUploading(true);
    try {
      const photoUrl = await uploadPhoto(file);
      if (photoUrl) {
        toast.success(t('profile.photoUpdated'));
      } else {
        toast.error(t('profile.photoError'));
      }
    } catch (error) {
      toast.error(t('profile.photoError'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateProfile({
        first_name: formData.first_name || null,
        last_name: formData.last_name || null,
        username: formData.username || null,
      });

      if (result) {
        toast.success(t('profile.saved'));
        setIsEditing(false);
      } else {
        toast.error(t('profile.saveError'));
      }
    } catch (error) {
      toast.error(t('profile.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative z-10"
      style={{
        background: 'linear-gradient(180deg, #17344F 0%, #265582 100%)'
      }}
    >
      {/* Header */}
      <div className="glass-dark border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">{t('profile.title')}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div 
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-accent/30 bg-muted flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handlePhotoClick}
            >
              {isUploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
              ) : profile?.photo_url ? (
                <img 
                  src={profile.photo_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-muted-foreground" />
              )}
            </div>
            <button
              onClick={handlePhotoClick}
              className="absolute bottom-0 right-0 p-2 bg-accent rounded-full text-primary hover:bg-accent/80 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold text-white">
              {profile?.first_name} {profile?.last_name}
            </h2>
            {profile?.username && (
              <p className="text-muted-foreground">@{profile.username}</p>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="glass-dark rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{t('profile.personalData')}</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Edit2 className="w-4 h-4 text-accent" />
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="first_name" className="text-muted-foreground">{t('profile.firstName')}</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="mt-1 bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <Label htmlFor="last_name" className="text-muted-foreground">{t('profile.lastName')}</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="mt-1 bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <Label htmlFor="username" className="text-muted-foreground">{t('profile.username')}</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="mt-1 bg-white/5 border-white/10 text-white"
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-accent hover:bg-accent/80 text-primary"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {t('profile.save')}
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-muted-foreground">Telegram ID</span>
                <span className="text-white font-mono">{profile?.telegram_id}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-muted-foreground">{t('profile.firstName')}</span>
                <span className="text-white">{profile?.first_name || '—'}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-muted-foreground">{t('profile.lastName')}</span>
                <span className="text-white">{profile?.last_name || '—'}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-muted-foreground">{t('profile.username')}</span>
                <span className="text-white">{profile?.username ? `@${profile.username}` : '—'}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">{t('profile.language')}</span>
                <span className="text-white uppercase">{profile?.language_code || 'ru'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
