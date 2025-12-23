import { SOCIAL_LINKS } from '@/constants/vacancy';
import logo from '@/assets/RR-Logo.png';
import { useLanguage } from '@/contexts/LanguageContext';
const Footer = () => {
  const {
    t
  } = useLanguage();
  return <footer className="gradient-primary border-t border-white/5 py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
              <img src={logo} alt="RentROP" className="h-12 w-auto" />
              <span className="text-white font-bold text-2xl tracking-tight">
                ​RentROP <span className="text-gradient-gold">HR</span>
              </span>
            </div>
            <p className="text-white/60 text-sm max-w-xs">{t('footer.slogan')}</p>
          </div>
          
          <div className="flex gap-4">
            <a href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer" className="p-4 glass-dark rounded-2xl hover:scale-110 transition-all border border-white/10 group" aria-label="Telegram">
              <svg className="w-6 h-6 text-white/60 group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.538-.196 1.006.128.828.94z" />
              </svg>
            </a>
            <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="p-4 glass-dark rounded-2xl hover:scale-110 transition-all border border-white/10 group" aria-label="YouTube">
              <svg className="w-6 h-6 text-white/60 group-hover:text-red-500 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a href={SOCIAL_LINKS.vk} target="_blank" rel="noopener noreferrer" className="p-4 glass-dark rounded-2xl hover:scale-110 transition-all border border-white/10 group" aria-label="VK">
              <svg className="w-6 h-6 text-white/60 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.713-1.033-1.01-1.49-1.147-1.745-1.147-.356 0-.458.1-.458.592v1.563c0 .424-.135.68-1.253.68-1.846 0-3.896-1.12-5.339-3.202-2.17-3.04-2.763-5.324-2.763-5.792 0-.255.1-.49.593-.49h1.744c.44 0 .61.203.78.677.862 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.316c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.49.763-.49h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z" />
              </svg>
            </a>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/40 text-xs uppercase font-semibold tracking-widest">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>;
};
export default Footer;