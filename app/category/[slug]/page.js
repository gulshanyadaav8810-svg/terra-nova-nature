import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories';
import { ARTICLES, getArticlesByCategory } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';
import { ArrowLeft, Compass, Trees, Shield } from 'lucide-react';

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryArticles = getArticlesByCategory(category.key);

  return (
    <main style={{ minHeight: '100vh', padding: '3rem 1.5rem 6rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Top Back Link */}
        <Link href="/" className="back-link-btn" style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>

        {/* Category Hero Banner */}
        <div style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          marginBottom: '3.5rem',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-light)',
          aspectRatio: '21/9',
          minHeight: '280px',
          display: 'flex',
          alignItems: 'flex-end'
        }}>
          <img
            src={category.heroImage}
            alt={category.name}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.35) 60%, transparent 100%)'
          }} />

          <div style={{ position: 'relative', zIndex: 2, padding: '2.5rem', color: '#ffffff', maxWidth: '800px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(8px)',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 800,
              marginBottom: '0.85rem'
            }}>
              <span>{category.icon}</span> {category.shortName} Habitat
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.85rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '0.65rem' }}>
              {category.name}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6 }}>
              {category.tagline}
            </p>
          </div>
        </div>

        {/* Other Categories Quick Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Explore Other Biomes:
          </span>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className={`filter-btn-pill ${c.slug === category.slug ? 'active' : ''}`}
            >
              <span>{c.icon}</span> {c.shortName}
            </Link>
          ))}
        </div>

        {/* Section Heading */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Expedition Reports in this Habitat ({categoryArticles.length})
          </h2>
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
