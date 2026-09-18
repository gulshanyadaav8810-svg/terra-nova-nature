'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ARTICLES } from '@/lib/articles';
import { CATEGORIES } from '@/lib/categories';
import ArticleCard from '@/components/ArticleCard';
import { Search, ArrowLeft } from 'lucide-react';

export default function ArticlesArchivePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
            <span>Back to Home</span>
          </Link>

          <span className="section-eyebrow">Field Research Archive</span>
          <h1 className="articles-archive-title">
            All Wildlife & Nature Field Journals
          </h1>
          <p className="section-subtitle">
            Search across our global dispatch archive of verified wildlife encounters, canopy research, and marine ecology.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar-wrapper">
          {/* Category Filter Pills (Touch friendly scroll on mobile) */}
          <div className="filter-pills-group">
            <button
              type="button"
              className={`filter-btn-pill ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Journals ({ARTICLES.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                className={`filter-btn-pill ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                <span>{cat.icon}</span> {cat.shortName}
              </button>
            ))}
          </div>

          {/* Search Input Box */}
          <div className="search-input-box">
            <Search size={17} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search animals, habitats, places..."
              className="search-input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, padding: '0 4px' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Counter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Showing {filteredArticles.length} of {ARTICLES.length} Expedition Journals
          </span>
          {(activeCategory !== 'all' || searchTerm) && (
            <button
              type="button"
              onClick={() => { setActiveCategory('all'); setSearchTerm(''); }}
              style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--brand-primary)' }}
            >
              Reset Filters
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
              No Field Journals Found
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              No expedition reports matched your query "{searchTerm}". Try clearing search or choosing another habitat.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => { setActiveCategory('all'); setSearchTerm(''); }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
