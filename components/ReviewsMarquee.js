import { REVIEWS } from '@/lib/reviews';
import { CheckCircle2 } from 'lucide-react';

export default function ReviewsMarquee() {
  // Duplicate for seamless 360 loop
  const doubleReviews = [...REVIEWS, ...REVIEWS];

  return (
    <section className="reviews-section">
      <div className="section-header-centered" style={{ marginBottom: '2.5rem' }}>
        <div className="section-badge-pill">
          <span>💬</span>
          <span>FIELD RESEARCHER ENDORSEMENTS</span>
        </div>
        <h2 className="section-main-title">Voices from the Frontiers</h2>
        <div className="section-title-underline" />
        <p className="section-subtitle">
          Read what conservationists, wildlife photographers, and marine biologists say about Nature1 field reporting.
        </p>
      </div>

      <div className="marquee-container">
        <div className="marquee-track">
          {doubleReviews.map((rev, idx) => (
            <div key={`${rev.id}-${idx}`} className="review-card">
              <div className="review-top-row">
                <span className="review-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={13} color="#059669" />
                  <span>{rev.tag}</span>
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Field Verified</span>
              </div>

              <p className="review-quote-text">“{rev.quote}”</p>

              <div className="review-author-group">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="review-avatar"
                  loading="lazy"
                />
                <div>
                  <div className="review-name">{rev.name}</div>
                  <div className="review-org">{rev.role} • {rev.org}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
