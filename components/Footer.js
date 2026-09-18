'use client';

import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import { useLanguage } from '@/context/LanguageContext';
import { Leaf, Instagram, Facebook, MessageCircle, Youtube, Twitter } from 'lucide-react';

export default function Footer() {
  const { t, getCategoryData } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Brand Col: Nature1 */}
        <div className="footer-brand-col">
          <Link href="/" className="brand-logo">
            <div className="logo-leaf-icon">
              <Leaf size={22} strokeWidth={2.5} />
            </div>
            <div className="logo-text-group">
              <span className="brand-name">
                Nature<span style={{ color: 'var(--brand-primary)' }}>1</span>
              </span>
              <span className="brand-subtitle">Wildlife & Expeditions</span>
            </div>
          </Link>

          <p className="footer-bio-text">
            {t('footerBio')}
          </p>

          <div className="footer-social-row">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="YouTube"
            >
              <Youtube size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
          </div>
        </div>

        {/* Categories Col */}
        <div>
          <h4 className="footer-col-title">{t('fourWildHabitats')}</h4>
          <ul className="footer-links-list">
            {CATEGORIES.map((cat) => {
              const catData = getCategoryData(cat);
              return (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="footer-link">
                    {catData.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="footer-col-title">{t('fieldExplorer')}</h4>
          <ul className="footer-links-list">
            <li>
              <Link href="/articles" className="footer-link">
                {t('allFieldJournals')}
              </Link>
            </li>
            <li>
              <Link href="/article/art-1" className="footer-link">
                Bengal Tiger Expedition
              </Link>
            </li>
            <li>
              <Link href="/courses" className="footer-link">
                {t('wildernessAcademy')}
              </Link>
            </li>
            <li>
              <Link href="/category/ocean-depths" className="footer-link">
                Coral Reef Exploration
              </Link>
            </li>
          </ul>
        </div>

        {/* Conservation Pledge */}
        <div>
          <h4 className="footer-col-title">{t('ethicalCharter')}</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
            {t('ethicalCharterDesc')}
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--brand-primary)', fontWeight: 700 }}>
            <span>{t('planetPartner')}</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <span>{t('copyrightText')}</span>
        <span>{t('copyrightSub')}</span>
      </div>
    </footer>
  );
}

