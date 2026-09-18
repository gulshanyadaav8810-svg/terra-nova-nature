import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLES, getArticleById } from '@/lib/articles';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import ShareBar from '@/components/ShareBar';
import ArticleCard from '@/components/ArticleCard';
import { ArrowLeft, Clock, MapPin, Calendar, Camera, CheckCircle2, Shield } from 'lucide-react';

export function generateStaticParams() {
  return ARTICLES.map((art) => ({
    id: art.id,
  }));
}

export default async function ArticleDetailPage({ params }) {
  const { id } = await params;
  const article = getArticleById(id);

  if (!article) {
    notFound();
  }

  // Related articles (same category, excluding current)
  const relatedArticles = ARTICLES.filter(
    (a) => a.id !== article.id && a.category === article.category
  ).slice(0, 3);

  const fullUrl = `https://terra-nova-nature-delta.vercel.app/article/${article.id}`;

  return (
    <>
      <ReadingProgressBar />

      <main className="article-reader-view">
        <article className="article-reader-container">
          {/* Reader Top Nav & Breadcrumbs */}
          <div className="reader-nav-bar">
            <Link href="/articles" className="back-link-btn" id="articleBackBtn">
              <ArrowLeft size={16} />
              <span>← All Journals</span>
            </Link>

            <nav className="breadcrumb-trail" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href={`/category/${article.categorySlug}`}>Category: {article.categoryPill}</Link>
              <span>/</span>
              <span className="breadcrumb-current-title">
                {article.title}
              </span>
            </nav>
          </div>

          {/* Category Badges & Meta */}
          <div className="reader-header-badges">
            <Link
              href={`/category/${article.categorySlug}`}
              className={`reader-category-pill cat-badge-${article.category}`}
              title={`View all articles in category ${article.categoryPill}`}
            >
              <span>{article.categoryPill}</span>
              <span style={{ fontSize: '0.725rem', opacity: 0.85, marginLeft: '0.25rem' }}>↗ Explore Category</span>
            </Link>
            <span className="reader-meta-item">
              <Clock size={14} /> {article.readTime}
            </span>
            <span className="reader-meta-item">
              <Calendar size={14} /> {article.date}
            </span>
          </div>

          {/* Headline */}
          <h1 className="reader-headline">{article.title}</h1>

          {/* Location Bar */}
          <div className="reader-location-tag">
            <MapPin size={16} style={{ flexShrink: 0 }} />
            <span>Field Coordinates: {article.location}</span>
          </div>

          {/* Excerpt Lead */}
          <p className="reader-excerpt-lead">{article.excerpt}</p>

          {/* Author Bar */}
          <div className="reader-author-bar">
            <div className="author-bar-left">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="author-bar-avatar"
              />
              <div>
                <div className="author-bar-name">{article.author.name}</div>
                <div className="author-bar-role">{article.author.role}</div>
              </div>
            </div>

            <div className="author-bar-badge">
              <Shield size={16} />
              <span>Verified Field Journal</span>
            </div>
          </div>

          {/* Featured Image */}
          <figure className="reader-featured-figure">
            <img
              src={article.image}
              alt={article.title}
              className="reader-featured-img"
            />
            <figcaption className="reader-figure-caption">
              Field photograph documented by {article.author.name} at {article.location}. Non-invasive telephoto observation.
            </figcaption>
          </figure>

          {/* Key Takeaways Box (Light Theme) */}
          {article.keyTakeaways && (
            <div className="key-takeaways-card">
              <div className="takeaways-title">
                <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
                <span>Expedition Field Summary & Key Findings</span>
              </div>
              <ul className="takeaways-list">
                {article.keyTakeaways.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Article Content */}
          <div
            className="reader-editorial-body"
            dangerouslySetInnerHTML={{ __html: article.fullContent }}
          />

          {/* Field Gear Specifications */}
          {article.gear && (
            <div className="reader-gear-box">
              <div className="reader-gear-header">
                <Camera size={18} />
                <span>Field Camera Settings & Optics</span>
              </div>
              <div className="reader-gear-grid">
                <div className="gear-param-card">
                  <span className="gear-param-label">Camera Body</span>
                  <span className="gear-param-val">{article.gear.body}</span>
                </div>
                <div className="gear-param-card">
                  <span className="gear-param-label">Lens & Optics</span>
                  <span className="gear-param-val">{article.gear.lens}</span>
                </div>
                <div className="gear-param-card">
                  <span className="gear-param-label">Exposure Triangle</span>
                  <span className="gear-param-val">{article.gear.exposure}</span>
                </div>
                <div className="gear-param-card">
                  <span className="gear-param-label">Support Rigging</span>
                  <span className="gear-param-val">{article.gear.rig}</span>
                </div>
              </div>
            </div>
          )}

          {/* Live Social Share Bar */}
          <ShareBar title={article.title} url={fullUrl} />

          {/* Related Field Journals */}
          {relatedArticles.length > 0 && (
            <div className="related-journals-section">
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="section-eyebrow">Continue Exploring</span>
                <h3 className="related-journals-heading">
                  More from this Habitat
                </h3>
              </div>
              <div className="articles-grid">
                {relatedArticles.map((rel) => (
                  <ArticleCard key={rel.id} article={rel} />
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </>
  );
}
