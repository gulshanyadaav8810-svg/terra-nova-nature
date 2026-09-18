'use client';

import { REVIEWS } from '@/lib/reviews';
import { useLanguage } from '@/context/LanguageContext';
import { CheckCircle2 } from 'lucide-react';

export default function ReviewsMarquee() {
  const { t, getReviewData } = useLanguage();

  // Duplicate for seamless 360 loop
  const doubleReviews = [...REVIEWS, ...REVIEWS];

  return (
    <section className="reviews-section">
      <div className="section-header-centered" style={{ marginBottom: '2.5rem' }}>
        <div className="section-badge-pill">
          <span>💬</span>
          <span>{t('endorsementsBadge')}</span>
        </div>
        <h2 className="section-main-title">{t('voicesFromFrontiers')}</h2>
        <div className="section-title-underline" />
        <p className="section-subtitle">
          {t('voicesFromFrontiersDesc')}
        </p>
      </div>

      <div className="marquee-container">
        <div className="marquee-track">
          {doubleReviews.map((rev, idx) => {
            const revData = getReviewData(rev);
            return (
              <div key={`${rev.id}-${idx}`} className="review-card">
                <div className="review-top-row">
                  <span className="review-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={13} color="#059669" />
                    <span>{revData.tag}</span>
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{t('fieldVerified')}</span>
                </div>

                <p className="review-quote-text">“{revData.quote}”</p>

                <div className="review-author-group">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="review-avatar"
                    loading="lazy"
                  />
                  <div>
                    <div className="review-name">{rev.name}</div>
                    <div className="review-org">{revData.role} • {rev.org}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

