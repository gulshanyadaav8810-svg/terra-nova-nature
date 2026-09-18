import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories';
import { ARTICLES, getArticlesByCategory } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';
import { ArrowLeft } from 'lucide-react';

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
    <main className="category-page-view">
      <div className="category-page-container">
        {/* Top Back Link */}
        <Link href="/" className="back-link-btn" style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>

        {/* Category Hero Banner (Responsive) */}
        <div className="category-hero-banner">
          <img
            src={category.heroImage}
            alt={category.name}
            className="category-hero-img"
          />
          <div className="category-hero-overlay" />

          <div className="category-hero-content">
            <span className="category-hero-pill">
              <span>{category.icon}</span> {category.shortName} Habitat
            </span>
            <h1 className="category-hero-title">
              {category.name}
            </h1>
            <p className="category-hero-desc">
              {category.tagline}
            </p>
          </div>
        </div>

        {/* Other Categories Quick Bar */}
        <div className="other-categories-bar">
          <span className="other-cat-label">
            Explore Other Biomes:
          </span>
          <div className="other-cat-pills">
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
        </div>

        {/* Section Heading */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 className="category-section-title">
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
