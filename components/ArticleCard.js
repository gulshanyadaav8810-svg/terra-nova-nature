'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, Clock } from 'lucide-react';

export default function ArticleCard({ article }) {
  const { t, getArticleData } = useLanguage();
  const art = getArticleData(article);

  return (
    <article className={`article-card card-border-${art.category}`}>
      <Link href={`/article/${art.id}`} className="article-card-thumb-link">
        <img
          src={art.image}
          alt={art.title}
          className="article-card-img"
          loading="lazy"
        />
        <span className={`article-card-badge cat-badge-${art.category}`}>
          {art.categoryPill}
        </span>
      </Link>

      <div className="article-card-body">
        <div className="article-card-meta">
          <span className={`card-category-indicator cat-indicator-${art.category}`}>
            ● {art.category.toUpperCase()}
          </span>
          <span>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={13} /> {art.readTime}
          </span>
          <span>•</span>
          <span>{art.date}</span>
        </div>

        <Link href={`/article/${art.id}`}>
          <h3 className="article-card-title">{art.title}</h3>
        </Link>

        <p className="article-card-excerpt">{art.excerpt}</p>

        <div className="article-card-author-row">
          <div className="author-info-group">
            <img
              src={art.author.avatar}
              alt={art.author.name}
              className="author-avatar-img"
            />
            <div>
              <span className="author-name-text">{art.author.name}</span>
              <span className="author-role-text">{art.location.split(',')[0]}</span>
            </div>
          </div>

          <Link href={`/article/${art.id}`} className="read-journal-link">
            <span>{t('readBtn')}</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

