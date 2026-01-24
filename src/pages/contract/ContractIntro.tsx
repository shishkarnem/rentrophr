import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, ExternalLink, Bot } from 'lucide-react';
import { useTelegram } from '@/contexts/TelegramContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCrmData } from '@/hooks/useCrmData';
import { Button } from '@/components/ui/button';
import MobileNavbar from '@/components/MobileNavbar';
import MobileHeader from '@/components/MobileHeader';
import ContractFAQ from '@/components/ContractFAQ';
const translations = {
  ru: {
    title: 'Создание договора',
    intro: 'Для создания договора мне потребуется сегодняшняя дата',
    dateLabel: 'и Ваш КОД',
    codeLabel: 'который будет являться номером договора.',
    reviewText: 'Вы можете ознакомиться с условиями договора перед его созданием по ссылкам:',
    contract1: 'Договор для России и Мира для ИП',
    contract2: 'Договор для России для самозанятых',
    contract3: 'Договор для Казахстана и СНГ для ИП',
    contract4: 'Договор для Казахстана и СНГ для самозанятых',
    contract5: 'Договор для Всего Мира для ИП',
    warningText: 'Сразу предупрежу, мы не меняем условия договора индивидуально, для всех сотрудников у нас единый договор. Либо подходят условия, либо не подходят. Третьего выбора нет.',
    kzWarningTitle: '⚠️ Важно для Казахстана, СНГ и всего мира:',
    kzWarningText: 'Договор заключается только на юридическое лицо (ИП). Заключение договора на физическое лицо невозможно.',
    legalEntityNote: 'При создании договора на юридическое лицо, отличное от ИП (ООО, ТОО и др.), договор заключается индивидуально. Для этого необходимо отдельно связаться со своим HR.',
    chooseText: 'Если Вам подходят условия договора, то выберите какой договор из представленных мы сейчас создадим.',
    optionIP: 'Договор ИП РФ 🇷🇺',
    optionPhys: 'Договор Физ.лицо РФ 🇷🇺',
    optionKZ: 'Договор ИП KZ 🇰🇿',
    optionPhysKZ: 'Договор Самозанятый KZ 🇰🇿',
    optionWorld: 'Договор ИП Мир 🌍',
    requisitesTitle: 'Для договора нужно подготовить реквизиты:',
    requiredTitle: 'Обязательно нужно:',
    required: ['Код РОПа', 'Фамилия Имя Отчество', 'Фамилия и инициалы, например, Котова А.С.', 'Страна проживания', 'Адрес проживания и регистрации', 'Серия и номер паспорта', 'Кем выдан паспорт', 'Когда выдан паспорт', 'Номер расчетного счета Р/С - для получения зарплаты', 'Номер телефона'],
    additionalTitle: 'Дополнительные сведения:',
    additional: ['ИНН или БИН', 'ОГРН', 'КПП', 'Расчетный счет', 'Кор.счет', 'БИК', 'В банке', 'Email'],
    botText: 'Также вы можете заполнить через ИИ-робота телеграм',
    botCommand: 'отправив ему команду "Создание договора"',
    openBot: 'Открыть бота',
    gdprNotice: 'Отправляя свои реквизиты и контактные данные через данную форму, вы подтверждаете согласие на передачу ваших персональных данных иностранному сервису Google (Google LLC, США) в соответствии с ФЗ-152 «О персональных данных».'
  },
  en: {
    title: 'Contract Creation',
    intro: 'To create a contract, I need today\'s date',
    dateLabel: 'and your CODE',
    codeLabel: 'which will be the contract number.',
    reviewText: 'You can review the contract terms before creation via these links:',
    contract1: 'Contract for Russia and World for IP',
    contract2: 'Contract for Russia for self-employed',
    contract3: 'Contract for Kazakhstan and CIS for IP',
    contract4: 'Contract for Kazakhstan and CIS for self-employed',
    contract5: 'Contract for Worldwide for IP',
    warningText: 'I warn you right away, we do not change the terms of the contract individually; all employees have a single contract. Either the conditions suit you, or they don\'t. There is no third choice.',
    kzWarningTitle: '⚠️ Important for Kazakhstan, CIS and worldwide:',
    kzWarningText: 'Contracts are concluded only with legal entities (Individual Entrepreneurs). Contracts with individuals are not possible.',
    legalEntityNote: 'When creating a contract with a legal entity other than an Individual Entrepreneur (LLC, LLP, etc.), the contract is concluded individually. Please contact your HR separately for this.',
    chooseText: 'If the contract terms suit you, choose which contract we will create now.',
    optionIP: 'IP RF Contract 🇷🇺',
    optionPhys: 'Individual RF Contract 🇷🇺',
    optionKZ: 'IP KZ Contract 🇰🇿',
    optionPhysKZ: 'Self-Employed KZ Contract 🇰🇿',
    optionWorld: 'IP World Contract 🌍',
    requisitesTitle: 'You need to prepare the following details for the contract:',
    requiredTitle: 'Required:',
    required: ['ROP Code', 'Full Name', 'Surname and initials, e.g., Smith J.D.', 'Country of residence', 'Address of residence and registration', 'Passport series and number', 'Passport issued by', 'Passport issue date', 'Bank account number for salary', 'Phone number'],
    additionalTitle: 'Additional information:',
    additional: ['TIN or BIN', 'OGRN', 'KPP', 'Settlement account', 'Correspondent account', 'BIC', 'Bank name', 'Email'],
    botText: 'You can also fill it via the Telegram AI bot',
    botCommand: 'by sending the command "Contract creation"',
    openBot: 'Open Bot',
    gdprNotice: 'By submitting your details and contact information through this form, you confirm your consent to the transfer of your personal data to a foreign service Google (Google LLC, USA).'
  },
  kz: {
    title: 'Шарт жасау',
    intro: 'Шарт жасау үшін маған бүгінгі күн керек',
    dateLabel: 'және сіздің КОДЫҢЫЗ',
    codeLabel: 'ол шарт нөмірі болады.',
    reviewText: 'Шарт жасамас бұрын шарт талаптарымен танысуға болады:',
    contract1: 'Ресей және әлем үшін ЖК шарты',
    contract2: 'Ресей үшін өзін-өзі жұмыспен қамтыған шарты',
    contract3: 'Қазақстан және ТМД үшін ЖК шарты',
    contract4: 'Қазақстан және ТМД үшін өзін-өзі жұмыспен қамтыған шарты',
    contract5: 'Бүкіл әлем үшін ЖК шарты',
    warningText: 'Бірден ескертемін, біз шарт талаптарын жеке өзгертпейміз, барлық қызметкерлерге бірыңғай шарт қолданылады. Не шарттар сәйкес келеді, не сәйкес келмейді. Үшінші таңдау жоқ.',
    kzWarningTitle: '⚠️ Қазақстан, ТМД және бүкіл әлем үшін маңызды:',
    kzWarningText: 'Шарт тек заңды тұлғалармен (ЖК) жасалады. Жеке тұлғалармен шарт жасау мүмкін емес.',
    legalEntityNote: 'ЖК-дан басқа заңды тұлғамен (ЖШС, ЖАҚ және т.б.) шарт жасау кезінде шарт жеке түрде жасалады. Ол үшін HR-ға жеке хабарласу қажет.',
    chooseText: 'Егер шарт талаптары сізге сәйкес келсе, қай шартты жасайтынымызды таңдаңыз.',
    optionIP: 'ЖК РФ шарты 🇷🇺',
    optionPhys: 'Жеке тұлға РФ шарты 🇷🇺',
    optionKZ: 'ЖК KZ шарты 🇰🇿',
    optionPhysKZ: 'Өзін-өзі жұмыспен қамтыған KZ шарты 🇰🇿',
    optionWorld: 'ЖК Әлем шарты 🌍',
    requisitesTitle: 'Шарт үшін мына деректерді дайындау керек:',
    requiredTitle: 'Міндетті:',
    required: ['РОП коды', 'Аты-жөні', 'Тегі мен инициалдары, мысалы, Смит Д.Ж.', 'Тұратын елі', 'Тұрғылықты және тіркеу мекенжайы', 'Паспорт сериясы мен нөмірі', 'Паспортты кім берді', 'Паспорт берілген күні', 'Жалақы алу үшін есеп шот нөмірі', 'Телефон нөмірі'],
    additionalTitle: 'Қосымша мәліметтер:',
    additional: ['ЖСН немесе БСН', 'ОГРН', 'КПП', 'Есеп шоты', 'Корреспонденттік шот', 'БИК', 'Банк атауы', 'Email'],
    botText: 'Сондай-ақ Telegram ИИ-робот арқылы толтыруға болады',
    botCommand: '"Шарт жасау" командасын жіберу арқылы',
    openBot: 'Ботты ашу',
    gdprNotice: 'Осы форма арқылы деректеріңізді жіберу кезінде, сіз дербес деректеріңізді Google (Google LLC, АҚШ) шетелдік сервисіне беруге келісім бересіз.'
  }
};
const ContractIntro = () => {
  const navigate = useNavigate();
  const {
    isTelegram,
    profile
  } = useTelegram();
  const {
    language
  } = useLanguage();
  const isMobile = useIsMobile();
  const showMobileNav = isTelegram || isMobile;
  const telegramId = profile?.telegram_id ? Number(profile.telegram_id) : null;
  const {
    crmData
  } = useCrmData(telegramId);
  const t = translations[language];

  // Get current date in Russian format
  const now = new Date();
  const months: Record<Language, string[]> = {
    ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    kz: ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан']
  };
  const day = now.getDate().toString().padStart(2, '0');
  const month = months[language][now.getMonth()];
  const year = now.getFullYear();
  const formattedDate = language === 'ru' ? `${day} ${month} ${year} г.` : `${day} ${month} ${year}`;
  const userCode = crmData?.code || '—';
  const contractLinks = [{
    label: t.contract1,
    url: 'https://drive.google.com/file/d/1HVxHj1m2DSO-GER8SiZ10MjXoQqR0er3/export?format=pdf'
  }, {
    label: t.contract2,
    url: 'https://drive.google.com/file/d/1FDbZ5daP_esGZO5XNIHR6de08H6EnbLG/export?format=pdf'
  }, {
    label: t.contract3,
    url: 'https://drive.google.com/file/d/1alsd16UeR3uzKHs6wVYfJwboQ8wmzLRi/export?format=pdf'
  }, {
    label: t.contract4,
    url: 'https://drive.google.com/file/d/14spSzxh4fiRrCNoPwsO4_-rpmcnHUSQu/export?format=pdf'
  }, {
    label: t.contract5,
    url: 'https://drive.google.com/file/d/15z-5IIqbKd38kneIi3khDtLU3MVOpkF8/export?format=pdf'
  }];
  return <div className="min-h-screen relative z-10" style={{
    background: 'linear-gradient(180deg, #17344F 0%, #265582 100%)'
  }}>
      {/* Header */}
      {showMobileNav ? <MobileHeader /> : <div className="glass-dark border-b border-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-lg font-semibold text-white">{t.title}</h1>
          </div>
        </div>}

      <main className={`container mx-auto px-4 py-6 max-w-2xl ${showMobileNav ? 'pt-28 pb-32' : ''}`}>
        <div className="space-y-6">
          {/* Intro with date and code */}
          <div className="glass-dark rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-accent" />
              <h2 className="text-xl font-bold text-white">{t.title}</h2>
            </div>
            <p className="text-white/90 leading-relaxed">
              {t.intro} (<span className="text-accent font-semibold">{formattedDate}</span>) {t.dateLabel} (<span className="text-accent font-semibold">{userCode}</span>), {t.codeLabel}
            </p>
          </div>

          {/* Contract links */}
          <div className="glass-dark rounded-2xl p-6">
            <p className="text-white/90 mb-4">{t.reviewText}</p>
            <div className="space-y-3">
              {contractLinks.map((link, idx) => <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                  <span className="text-accent font-bold">{idx + 1}️⃣</span>
                  <span className="text-white flex-1">{link.label}</span>
                  <ExternalLink className="w-4 h-4 text-accent" />
                </a>)}
            </div>
          </div>

          {/* Warning */}
          <div className="glass-dark rounded-2xl p-6 border border-amber-500/30 bg-amber-500/5">
            <p className="text-white/90">{t.warningText}</p>
          </div>

          {/* KZ/CIS Warning */}
          <div className="glass-dark rounded-2xl p-6 border border-red-500/30 bg-red-500/5">
            <h4 className="text-white font-semibold mb-2">{t.kzWarningTitle}</h4>
            
            <p className="text-white/70 text-sm">{t.legalEntityNote}</p>
          </div>

          {/* GDPR Notice */}
          <div className="glass-dark rounded-2xl p-6 border border-blue-500/30 bg-blue-500/5">
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-lg">🔒</span>
              <p className="text-white/80 text-sm leading-relaxed">{t.gdprNotice}</p>
            </div>
          </div>

          {/* Choose contract type */}
          <div className="glass-dark rounded-2xl p-6">
            <p className="text-white/90 mb-4">{t.chooseText}</p>
            <div className="space-y-3">
              <Button onClick={() => navigate('/contract/ip-rf')} variant="gold" size="lg" className="w-full justify-start gap-3">
                <span className="text-lg">1️⃣</span>
                {t.optionIP}
              </Button>
              <Button onClick={() => navigate('/contract/phys-rf')} variant="gold" size="lg" className="w-full justify-start gap-3">
                <span className="text-lg">2️⃣</span>
                {t.optionPhys}
              </Button>
              <Button onClick={() => navigate('/contract/ip-kz')} variant="gold" size="lg" className="w-full justify-start gap-3">
                <span className="text-lg">3️⃣</span>
                {t.optionKZ}
              </Button>
              <Button onClick={() => navigate('/contract/phys-kz')} variant="gold" size="lg" className="w-full justify-start gap-3">
                <span className="text-lg">4️⃣</span>
                {t.optionPhysKZ}
              </Button>
              <Button onClick={() => navigate('/contract/ip-world')} variant="gold" size="lg" className="w-full justify-start gap-3">
                <span className="text-lg">5️⃣</span>
                {t.optionWorld}
              </Button>
            </div>
          </div>

          {/* Requisites */}
          <div className="glass-dark rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">{t.requisitesTitle}</h3>
            
            <div className="mb-4">
              <h4 className="text-accent font-semibold mb-2">{t.requiredTitle}</h4>
              <ul className="space-y-1">
                {t.required.map((item, idx) => <li key={idx} className="text-white/80 text-sm flex items-start gap-2">
                    <span className="text-accent">•</span>
                    {item}
                  </li>)}
              </ul>
            </div>
            
            <div>
              <h4 className="text-accent font-semibold mb-2">{t.additionalTitle}</h4>
              <ul className="space-y-1">
                {t.additional.map((item, idx) => <li key={idx} className="text-white/80 text-sm flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    {item}
                  </li>)}
              </ul>
            </div>
          </div>

          {/* Bot link */}
          <div className="glass-dark rounded-2xl p-6">
            <p className="text-white/90 mb-4">
              {t.botText} {t.botCommand}
            </p>
            <Button asChild variant="gold" size="lg" className="w-full gap-2">
              <a href="https://t.me/RentROP_HR_bot" target="_blank" rel="noopener noreferrer">
                <Bot className="w-5 h-5" />
                {t.openBot}
              </a>
            </Button>
          </div>

          {/* Contract FAQ */}
          <ContractFAQ />
        </div>
      </main>

      {showMobileNav && <MobileNavbar />}
    </div>;
};
export default ContractIntro;