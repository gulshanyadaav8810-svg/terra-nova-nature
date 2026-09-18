'use client';

import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import ArticleCard from '@/components/ArticleCard';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft } from 'lucide-react';

export default function CategoryClientView({ category, categoryArticles }) {
  const { t, getCategoryData } = useLanguage();
  const catData = getCategoryData(category);

  return (
    <main className="category-page-view">
      <div className="category-page-container">
        {/* Top Back Link */}
        <Link href="/" className="back-link-btn" style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
          <ArrowLeft size={16} />
          <span>{t('backToHome')}</span>
        </Link>

        {/* Category Hero Banner */}
        <div className={`category-hero-banner cat-banner-${category.key}`}>
          <img
            src={category.heroImage}
            alt={catData.name}
            className="category-hero-img"
          />
          <div className="category-hero-overlay" />

          <div className="category-hero-content">
            <span className={`category-hero-pill cat-pill-${category.key}`}>
              <span>{category.icon}</span> {t('officialBiomeCategory')}
            </span>
            <h1 className="category-hero-title">
              {catData.name}
            </h1>
            <p className="category-hero-desc">
              {catData.tagline}
            </p>
          </div>
        </div>

        {/* Other Categories Quick Bar */}
        <div className="other-categories-bar">
          <span className="other-cat-label">
            {t('switchHabitatCategory')}
          </span>
          <div className="other-cat-pills">
            {CATEGORIES.map((c) => {
              const otherData = getCategoryData(c);
              return (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className={`filter-btn-pill filter-pill-${c.key} ${c.slug === category.slug ? 'active' : ''}`}
                >
                  <span>{c.icon}</span> {otherData.shortName}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Section Heading */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="section-badge-pill" style={{ marginBottom: '0.5rem' }}>
            <span>📖</span>
            <span>{t('verifiedFieldDispatches')}</span>
          </div>
          <h2 className="category-section-title">
            {t('expeditionReportsIn')} {catData.name} ({categoryArticles.length})
          </h2>
          <div className="section-title-underline" style={{ margin: '0.5rem 0 1.5rem 0' }} />
        </div>

        {/* Articles Grid */}
        <div className="articles-grid">
          {categoryArticles.map((art) => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      </div>
    </main>
  );
}
