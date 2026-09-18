import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

export default function ArticleCard({ article }) {
  return (
    <article className={`article-card card-border-${article.category}`}>
      <Link href={`/article/${article.id}`} className="article-card-thumb-link">
        <img
          src={article.image}
          alt={article.title}
          className="article-card-img"
          loading="lazy"
        />
        <span className={`article-card-badge cat-badge-${article.category}`}>
          {article.categoryPill}
        </span>
      </Link>

      <div className="article-card-body">
        <div className="article-card-meta">
          <span className={`card-category-indicator cat-indicator-${article.category}`}>
            ● {article.category.toUpperCase()}
          </span>
          <span>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={13} /> {article.readTime}
          </span>
          <span>•</span>
          <span>{article.date}</span>
        </div>

        <Link href={`/article/${article.id}`}>
          <h3 className="article-card-title">{article.title}</h3>
        </Link>

        <p className="article-card-excerpt">{article.excerpt}</p>

        <div className="article-card-author-row">
          <div className="author-info-group">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="author-avatar-img"
            />
            <div>
              <span className="author-name-text">{article.author.name}</span>
              <span className="author-role-text">{article.location.split(',')[0]}</span>
            </div>
          </div>

          <Link href={`/article/${article.id}`} className="read-journal-link">
            <span>Read</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
