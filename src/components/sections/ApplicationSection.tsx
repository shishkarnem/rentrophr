import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CardGlassDark } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Send, User, Mail, Phone, Briefcase, MessageCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  telegram: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

const ApplicationSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    experience: '',
    telegram: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Введите ваше имя';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите телефон';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Заявка отправлена! 🎉",
      description: "Мы свяжемся с вами в ближайшее время.",
    });
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      experience: '',
      telegram: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section id="apply" className="py-24 hero-gradient">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Section header */}
          <div className="mb-12 text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
              Присоединяйтесь к нам
            </h2>
            <p className="text-white/60 text-lg">
              Заполните форму и мы свяжемся с вами в течение 24 часов
            </p>
          </div>

          <CardGlassDark className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Имя и фамилия *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Иван Иванов"
                  error={!!errors.name}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
                {errors.name && (
                  <p className="text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ivan@example.com"
                    error={!!errors.email}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Телефон *
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+7 (999) 123-45-67"
                    error={!!errors.phone}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-400">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Experience & Telegram */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Опыт в продажах
                  </label>
                  <Input
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="3 года"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Telegram
                  </label>
                  <Input
                    name="telegram"
                    value={formData.telegram}
                    onChange={handleChange}
                    placeholder="@username"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium">
                  Расскажите о себе
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Ваш опыт, достижения, почему хотите работать с нами..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="cta"
                size="xl"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Отправка...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Отправить заявку
                    <Send className="w-5 h-5" />
                  </span>
                )}
              </Button>

              <p className="text-center text-white/40 text-xs">
                Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
              </p>
            </form>
          </CardGlassDark>
        </div>
      </div>
    </section>
  );
};

export default ApplicationSection;
