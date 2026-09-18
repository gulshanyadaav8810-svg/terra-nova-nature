import { REVIEWS } from '@/lib/reviews';
import { Star } from 'lucide-react';

export default function ReviewsMarquee() {
  // Duplicate for seamless 360 loop
  const doubleReviews = [...REVIEWS, ...REVIEWS];

  return (
    <section className="reviews-section">
      <div className="section-header-centered" style={{ marginBottom: '2.5rem' }}>
        <span className="section-eyebrow">Field Researcher Endorsements</span>
        <h2 className="section-main-title">Voices from the Frontiers</h2>
        <p className="section-subtitle">
          Read what conservationists, wildlife photographers, and marine biologists say about Terra Nova field reporting.
        </p>
      </div>

      <div className="marquee-container">
        <div className="marquee-track">
          {doubleReviews.map((rev, idx) => (
            <div key={`${rev.id}-${idx}`} className="review-card">
              <div className="review-top-row">
                <div className="review-stars">
                  {'★'.repeat(rev.rating)}
                </div>
                <span className="review-tag">{rev.tag}</span>
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
