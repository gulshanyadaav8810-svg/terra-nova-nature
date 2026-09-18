'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export default function FloatingLanguageBtn() {
  const { lang, setLanguage } = useLanguage();

  return (
    <div className="floating-lang-pill" id="floatingLangPill">
      <div className="floating-lang-icon" title="Language / भाषा">
        <Globe size={15} />
      </div>
      <div className="floating-lang-buttons">
        <button
          type="button"
          className={`floating-lang-choice ${lang === 'en' ? 'active' : ''}`}
          onClick={() => setLanguage('en')}
          title="Switch to English"
        >
          EN
        </button>
        <button
          type="button"
          className={`floating-lang-choice ${lang === 'hi' ? 'active' : ''}`}
          onClick={() => setLanguage('hi')}
          title="हिन्दी में बदलें"
        >
          हिन्दी
        </button>
      </div>
    </div>

  );
}
