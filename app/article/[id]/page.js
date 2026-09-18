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
              <span>← Back to All Field Journals</span>
            </Link>

            <nav className="breadcrumb-trail" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/articles">Journals</Link>
              <span>/</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700, maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {article.title}
              </span>
            </nav>
          </div>

          {/* Category Badges & Meta */}
          <div className="reader-header-badges">
            <span className="badge-pill">{article.categoryPill}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              <Clock size={14} /> {article.readTime}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              <Calendar size={14} /> {article.date}
            </span>
          </div>

          {/* Headline */}
          <h1 className="reader-headline">{article.title}</h1>

          {/* Location Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.925rem', color: '#047857', fontWeight: 700, marginBottom: '1.5rem' }}>
            <MapPin size={16} />
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

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--brand-primary)', fontWeight: 700 }}>
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
                <CheckCircle2 size={20} />
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
            <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ marginBottom: '2rem' }}>
                <span className="section-eyebrow">Continue Exploring</span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  More from this Habitat
                </h3>
              </div>
              <div className="articles-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
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
