'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSwitcher({ isMobile = false }) {
  const { lang, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = languages.find((l) => l.code === lang) || languages[0];

  // If in mobile drawer, render segmented button pills for instant tap
  if (isMobile) {
    return (
      <div className="mobile-lang-container">
        <div className="mobile-lang-header">
          <Globe size={15} color="var(--brand-primary)" />
          <span className="mobile-lang-title">Choose Language / भाषा चुनें</span>
        </div>
        <div className="mobile-lang-pills">
          {languages.map((l) => {
            const isActive = lang === l.code;
            return (
              <button
                key={l.code}
                type="button"
                className={`mobile-lang-pill ${isActive ? 'active' : ''}`}
                onClick={() => setLanguage(l.code)}
                id={`mobileLangBtn-${l.code}`}
              >
                <span className="mobile-lang-flag">{l.flag}</span>
                <span className="mobile-lang-name">{l.label}</span>
                {isActive && <Check size={14} className="mobile-lang-check" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop Dropdown
  return (
    <div className="lang-switcher-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className="lang-switcher-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Select Language"
        id="desktopLangSwitcherBtn"
      >
        <span className="lang-flag-current">{currentLangObj.flag}</span>
        <span className="lang-label-current">{currentLangObj.label}</span>
        <ChevronDown size={14} className={`lang-chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="lang-dropdown-menu">
          <div className="lang-dropdown-header">
            <span>Select Language / भाषा</span>
          </div>
          {languages.map((l) => {
            const isActive = lang === l.code;
            return (
              <button
                key={l.code}
                type="button"
                className={`lang-option-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setLanguage(l.code);
                  setIsOpen(false);
                }}
                id={`langOption-${l.code}`}
              >
                <div className="lang-option-left">
                  <span className="lang-option-flag">{l.flag}</span>
                  <div className="lang-option-text">
                    <span className="lang-option-name">{l.label}</span>
                    <span className="lang-option-sub">{l.scriptName}</span>
                  </div>
                </div>
                {isActive && <Check size={16} color="var(--brand-primary)" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
