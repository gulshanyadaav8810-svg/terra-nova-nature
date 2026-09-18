'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ARTICLES } from '@/lib/articles';
import { CATEGORIES } from '@/lib/categories';
import ArticleCard from '@/components/ArticleCard';
import { useLanguage } from '@/context/LanguageContext';
import { Search, ArrowLeft } from 'lucide-react';

export default function ArticlesArchivePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { t, getCategoryData } = useLanguage();

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((art) => {
      const matchCat =
        activeCategory === 'all' ||
        art.category === activeCategory ||
        art.categorySlug === activeCategory;

      const matchSearch =
        searchTerm.trim() === '' ||
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.author.name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchCat && matchSearch;
    });
  }, [activeCategory, searchTerm]);

  return (
    <main className="articles-archive-view">
      <div className="articles-archive-container">
        {/* Top Header & Breadcrumb */}
        <div className="articles-archive-header">
          <Link
            href="/"
            className="back-link-btn"
            style={{ display: 'inline-flex', marginBottom: '1.25rem' }}
          >
            <ArrowLeft size={16} />
            <span>{t('backToHome')}</span>
          </Link>

          <div className="section-badge-pill" style={{ marginBottom: '0.65rem' }}>
            <span>📖</span>
            <span>{t('expeditionArchiveBadge')}</span>
          </div>
          <h1 className="articles-archive-title">
            {t('allJournalsTitle')}
          </h1>
          <div className="section-title-underline" style={{ margin: '0.6rem 0 1rem 0' }} />
          <p className="section-subtitle">
            {t('archiveSubtitle')}
          </p>
        </div>

        {/* Filter Bar with Clear Category Label */}
        <div className="filter-category-header">
          <span className="filter-category-title">🏷️ {t('selectCategoryToFilter')}</span>
        </div>

        <div className="filter-bar-wrapper">
          {/* Category Filter Pills (Touch friendly scroll on mobile) */}
          <div className="filter-pills-group">
            <button
              type="button"
              className={`filter-btn-pill ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              {t('allCategories')} ({ARTICLES.length})
            </button>
            {CATEGORIES.map((cat) => {
              const catData = getCategoryData(cat);
              return (
                <button
                  key={cat.slug}
                  type="button"
                  className={`filter-btn-pill filter-pill-${cat.key} ${activeCategory === cat.key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  <span>{cat.icon}</span> {catData.name} ({cat.count})
                </button>
              );
            })}
          </div>

          {/* Search Input Box */}
          <div className="search-input-box">
            <Search size={17} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="search-input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, padding: '0 4px', cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Counter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t('showingJournals')} {filteredArticles.length} {t('ofJournals')} {ARTICLES.length} {t('journalsCount')}
            {activeCategory !== 'all' && (
              <span style={{ color: 'var(--brand-primary)', marginLeft: '0.4rem' }}>
                {t('inCategory')} {getCategoryData(CATEGORIES.find(c => c.key === activeCategory))?.name}
              </span>
            )}
          </span>
          {(activeCategory !== 'all' || searchTerm) && (
            <button
              type="button"
              onClick={() => { setActiveCategory('all'); setSearchTerm(''); }}
              style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--brand-primary)', cursor: 'pointer' }}
            >
              {t('resetFilters')}
            </button>
          )}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="articles-grid">
            {filteredArticles.map((art) => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
        ) : (
          <div className="empty-results-box">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              {t('noJournalsFound')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {t('noJournalsDesc')}
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => { setActiveCategory('all'); setSearchTerm(''); }}
            >
              {t('clearAllFilters')}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

