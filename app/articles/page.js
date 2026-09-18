'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ARTICLES } from '@/lib/articles';
import { CATEGORIES } from '@/lib/categories';
import ArticleCard from '@/components/ArticleCard';
import { Search, ArrowLeft, SlidersHorizontal, Sparkles } from 'lucide-react';

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
    <main style={{ minHeight: '100vh', padding: '3rem 1.5rem 6rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Top Header & Breadcrumb */}
        <div style={{ marginBottom: '2rem' }}>
          <Link
            href="/"
            className="back-link-btn"
            style={{ display: 'inline-flex', marginBottom: '1.25rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>

          <span className="section-eyebrow">Field Research Archive</span>
          <h1 className="section-main-title" style={{ fontSize: '2.75rem', marginBottom: '0.75rem' }}>
            All Wildlife & Nature Field Journals
          </h1>
          <p className="section-subtitle">
            Search across our global dispatch archive of verified wildlife encounters, canopy research, and marine ecology.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar-wrapper">
          {/* Category Filter Pills */}
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
            <Search size={17} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by animal, habitat, location..."
              className="search-input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Counter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Showing {filteredArticles.length} of {ARTICLES.length} Expedition Journals
          </span>
          {(activeCategory !== 'all' || searchTerm) && (
            <button
              type="button"
              onClick={() => { setActiveCategory('all'); setSearchTerm(''); }}
              style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-primary)' }}
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
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid var(--border-light)',
            padding: '4rem 2rem',
            textAlign: 'center',
            maxWidth: '560px',
            margin: '2rem auto'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              No Field Journals Found
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
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
