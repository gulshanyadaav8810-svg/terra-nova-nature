'use client';

import Link from 'next/link';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import ShareBar from '@/components/ShareBar';
import ArticleCard from '@/components/ArticleCard';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, Clock, MapPin, Calendar, Camera, CheckCircle2, Shield } from 'lucide-react';

export default function ArticleClientView({ article, relatedArticles, fullUrl }) {
  const { t, getArticleData } = useLanguage();
  const art = getArticleData(article);

  return (
    <>
      <ReadingProgressBar />

      <main className="article-reader-view">
        <article className="article-reader-container">
          {/* Reader Top Nav & Breadcrumbs */}
          <div className="reader-nav-bar">
            <Link href="/articles" className="back-link-btn" id="articleBackBtn">
              <ArrowLeft size={16} />
              <span>{t('backToAllJournals')}</span>
            </Link>

            <nav className="breadcrumb-trail" aria-label="Breadcrumb">
              <Link href="/">{t('home')}</Link>
              <span>/</span>
              <Link href={`/category/${art.categorySlug}`}>{art.categoryPill}</Link>
              <span>/</span>
              <span className="breadcrumb-current-title">
                {art.title}
              </span>
            </nav>
          </div>

          {/* Category Badges & Meta */}
          <div className="reader-header-badges">
            <Link
              href={`/category/${art.categorySlug}`}
              className={`reader-category-pill cat-badge-${art.category}`}
              title={`View category ${art.categoryPill}`}
            >
              <span>{art.categoryPill}</span>
              <span style={{ fontSize: '0.725rem', opacity: 0.85, marginLeft: '0.25rem' }}>{t('exploreCategoryPrompt')}</span>
            </Link>
            <span className="reader-meta-item">
              <Clock size={14} /> {art.readTime}
            </span>
            <span className="reader-meta-item">
              <Calendar size={14} /> {art.date}
            </span>
          </div>

          {/* Headline */}
          <h1 className="reader-headline">{art.title}</h1>

          {/* Location Bar */}
          <div className="reader-location-tag">
            <MapPin size={16} style={{ flexShrink: 0 }} />
            <span>{t('fieldCoordinates')} {art.location}</span>
          </div>

          {/* Excerpt Lead */}
          <p className="reader-excerpt-lead">{art.excerpt}</p>

          {/* Author Bar */}
          <div className="reader-author-bar">
            <div className="author-bar-left">
              <img
                src={art.author.avatar}
                alt={art.author.name}
                className="author-bar-avatar"
              />
              <div>
                <div className="author-bar-name">{art.author.name}</div>
                <div className="author-bar-role">{art.author.role}</div>
              </div>
            </div>

            <div className="author-bar-badge">
              <Shield size={16} />
              <span>{t('verifiedJournal')}</span>
            </div>
          </div>

          {/* Featured Image */}
          <figure className="reader-featured-figure">
            <img
              src={art.image}
              alt={art.title}
              className="reader-featured-img"
            />
            <figcaption className="reader-figure-caption">
              {t('fieldPhotoBy')} {art.author.name} ({art.location}). {t('nonInvasiveObservation')}
            </figcaption>
          </figure>

          {/* Key Takeaways Box (Light Theme) */}
          {art.keyTakeaways && (
            <div className="key-takeaways-card">
              <div className="takeaways-title">
                <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
                <span>{t('keyTakeawaysTitle')}</span>
              </div>
              <ul className="takeaways-list">
                {art.keyTakeaways.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Article Content */}
          <div
            className="reader-editorial-body"
            dangerouslySetInnerHTML={{ __html: art.fullContent }}
          />

          {/* Field Gear Specifications */}
          {art.gear && (
            <div className="reader-gear-box">
              <div className="reader-gear-header">
                <Camera size={18} />
                <span>{t('cameraOpticsRig')}</span>
              </div>
              <div className="reader-gear-grid">
                <div className="gear-param-card">
                  <span className="gear-param-label">Camera Body</span>
                  <span className="gear-param-val">{art.gear.body}</span>
                </div>
                <div className="gear-param-card">
                  <span className="gear-param-label">Lens & Optics</span>
                  <span className="gear-param-val">{art.gear.lens}</span>
                </div>
                <div className="gear-param-card">
                  <span className="gear-param-label">Exposure Triangle</span>
                  <span className="gear-param-val">{art.gear.exposure}</span>
                </div>
                <div className="gear-param-card">
                  <span className="gear-param-label">Support Rigging</span>
                  <span className="gear-param-val">{art.gear.rig}</span>
                </div>
              </div>
            </div>
          )}

          {/* Live Social Share Bar */}
          <ShareBar title={art.title} url={fullUrl} />

          {/* Related Field Journals */}
          {relatedArticles.length > 0 && (
            <div className="related-journals-section">
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="section-eyebrow">{t('verifiedResearchBadge')}</span>
                <h3 className="related-journals-heading">
                  {t('relatedExpeditionsTitle')}
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
