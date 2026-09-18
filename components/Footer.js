import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import { Compass, Instagram, Facebook, MessageCircle, Youtube, Twitter, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Brand Col */}
        <div className="footer-brand-col">
          <Link href="/" className="brand-logo">
            <div className="logo-leaf-icon">
              <Compass size={22} />
            </div>
            <div className="logo-text-group">
              <span className="brand-name">TERRA NOVA</span>
              <span className="brand-subtitle">Expedition & Wildlife</span>
            </div>
          </Link>

          <p className="footer-bio-text">
            Documenting the world’s most pristine wild habitats, apex predators, ancient forest biomes, and fragile ocean reefs through non-invasive field journalism.
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
          <h4 className="footer-col-title">4 Wild Habitats</h4>
          <ul className="footer-links-list">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/category/${cat.slug}`} className="footer-link">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="footer-col-title">Field Explorer</h4>
          <ul className="footer-links-list">
            <li>
              <Link href="/articles" className="footer-link">
                All Field Journals
              </Link>
            </li>
            <li>
              <Link href="/article/art-1" className="footer-link">
                Bengal Tiger Expedition
              </Link>
            </li>
            <li>
              <Link href="/courses" className="footer-link">
                Wilderness Academy
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
          <h4 className="footer-col-title">Ethical Charter</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
            100% of our visual documentation adheres to strict non-harassment wildlife distances and IUCN red list protection standards.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--brand-primary)', fontWeight: 700 }}>
            <span>🌿 1% for the Planet Partner</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <span>© 2026 TERRA NOVA Expedition Media. All rights reserved.</span>
        <span>Dedicated to Wildlife Conservation & Earth Biomes</span>
      </div>
    </footer>
  );
}
