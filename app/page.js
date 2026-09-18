import Link from 'next/link';
import { ARTICLES, getTrendingArticles } from '@/lib/articles';
import { CATEGORIES } from '@/lib/categories';
import { COURSES } from '@/lib/courses';
import ArticleCard from '@/components/ArticleCard';
import ReviewsMarquee from '@/components/ReviewsMarquee';
import { Compass, ArrowRight, Sparkles, Shield, Camera, Award, Trees, Feather, Droplets } from 'lucide-react';

export default function HomePage() {
  const trendingArticles = getTrendingArticles();
  const latestArticles = ARTICLES.slice(0, 6);

  return (
    <main>
      {/* 1. HERO SECTION (Light Theme Luxury) */}
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-pill-badge">
              <Sparkles size={14} />
              <span>2026 GLOBAL WILDLIFE EXPEDITIONS</span>
            </div>

            <h1 className="hero-title">
              Documenting Earth’s <span className="highlight-emerald">Wildest Frontiers</span> & Apex Predators
            </h1>

            <p className="hero-description">
              Immerse yourself in authentic field notes, ultra-telephoto tracking, ancient canopy biomes, and pristine marine reefs documented by accredited field naturalists.
            </p>

            <div className="hero-cta-row">
              <Link href="/articles" className="btn-primary" id="heroBrowseJournalsBtn">
                <span>Browse All Journals</span>
                <ArrowRight size={17} />
              </Link>
              <Link href="/courses" className="btn-secondary" id="heroAcademyBtn">
                <Camera size={17} />
                <span>Wilderness Academy</span>
              </Link>
            </div>

            <div className="hero-stats-row">
              <div className="hero-stat-item">
                <span className="stat-number">150+</span>
                <span className="stat-label">Field Journals</span>
              </div>
              <div className="hero-stat-item">
                <span className="stat-number">4</span>
                <span className="stat-label">Earth Biomes</span>
              </div>
              <div className="hero-stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Ethical Tracking</span>
              </div>
            </div>
          </div>

          {/* Hero Right Media Preview */}
          <div className="hero-media-wrapper">
            <div className="hero-main-card">
              <img
                src="https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80"
                alt="Bengal Tiger in Ranthambore"
                className="hero-main-img"
              />
              <div className="hero-card-overlay">
                <span className="hero-card-badge">🦁 FEATURED EXPEDITION</span>
                <h3 className="hero-card-title">Shadows of the Bengal Tiger: Stalking the Monsoon Forest</h3>
                <div className="hero-card-meta">
                  <span>Ranthambore, India</span>
                  <span>•</span>
                  <span>7 Min Read</span>
                </div>
                <Link
                  href="/article/art-1"
                  className="btn-primary"
                  style={{ alignSelf: 'flex-start', marginTop: '1rem', padding: '0.6rem 1.2rem', fontSize: '0.875rem' }}
                >
                  Read Expedition Journal
                </Link>
              </div>
            </div>

            <div className="floating-expedition-tag">
              <div className="floating-dot" />
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>Live Status</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Monsoon Tracking Season</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR HABITAT EXPLORER CARDS */}
      <section className="section-container" style={{ paddingTop: '1rem' }}>
        <div className="section-header-centered">
          <span className="section-eyebrow">Explore 4 Unique Biomes</span>
          <h2 className="section-main-title">Curated Wildlife Habitats</h2>
          <p className="section-subtitle">
            Dive into specialized ecosystems across the planet, from high-altitude granite peaks to 45-meter coral abysses.
          </p>
        </div>

        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="category-card">
              <div className="category-card-thumb">
                <img
                  src={cat.heroImage}
                  alt={cat.name}
                  className="category-card-img"
                  loading="lazy"
                />
                <div className="category-icon-pill">
                  <span>{cat.icon}</span>
                  <span>{cat.shortName}</span>
                </div>
              </div>

              <div className="category-card-body">
                <h3 className="category-title">{cat.name}</h3>
                <p className="category-card-desc">{cat.description}</p>
                <div className="category-card-footer">
                  <span>Explore Habitat</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. LATEST EXPEDITION JOURNALS GRID */}
      <section className="section-container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="section-eyebrow">Field Research & Tracking</span>
            <h2 className="section-main-title" style={{ marginBottom: '0.25rem' }}>Latest Expedition Journals</h2>
            <p className="section-subtitle">
              Eyewitness reports from the world’s most secluded wilderness reserves.
            </p>
          </div>
          <Link href="/articles" className="btn-secondary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}>
            <span>View All Journals ({ARTICLES.length})</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="articles-grid">
          {latestArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* 4. INFINITE NATURALIST TESTIMONIALS MARQUEE */}
      <ReviewsMarquee />

      {/* 5. WILDERNESS ACADEMY SPOTLIGHT */}
      <section className="section-container">
        <div className="section-header-centered">
          <span className="section-eyebrow">Professional Field Training</span>
          <h2 className="section-main-title">Wilderness Masterclasses</h2>
          <p className="section-subtitle">
            Learn master tracking, long telephoto stabilization, and canopy rigging directly from veteran naturalists.
          </p>
        </div>

        <div className="courses-grid">
          {COURSES.slice(0, 2).map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-card-thumb">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="course-img"
                  loading="lazy"
                />
                <span className="course-badge-level">{course.level}</span>
              </div>

              <div className="course-card-body">
                <span className="course-instructor">{course.instructor}</span>
                <h3 className="course-card-title">{course.title}</h3>
                <p className="course-card-desc">{course.desc}</p>

                <div className="course-syllabus-preview">
                  <div className="syllabus-heading">Curriculum Modules</div>
                  <ul className="syllabus-items">
                    {course.syllabus.slice(0, 3).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="course-meta-footer">
                  <div className="course-duration-box">
                    <span>⏱ {course.duration}</span> • <span>{course.modulesCount}</span>
                  </div>
                  <Link href="/courses" className="btn-primary" style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}>
                    View Syllabus
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/courses" className="btn-secondary">
            <span>Explore All 4 Masterclasses</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 6. ETHICAL CONSERVATION PLEDGE CALLOUT */}
      <section className="section-container" style={{ paddingBottom: '5rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
          border: '1px solid #a7f3d0',
          borderRadius: '24px',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          maxWidth: '960px',
          margin: '0 auto',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: '#059669',
            borderRadius: '50%',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 8px 16px rgba(5, 150, 105, 0.25)'
          }}>
            <Shield size={28} />
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#064e3b', marginBottom: '1rem' }}>
            Zero Disturbance. 100% Ethical Wildlife Observation.
          </h2>

          <p style={{ fontSize: '1.05rem', color: '#047857', maxWidth: '680px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
            Every photograph, audio spectrogram, and field log published on Terra Nova is captured without artificial baiting, drones flown over nesting birds, or intrusive perimeter harassment.
          </p>

          <Link href="/articles" className="btn-primary">
            <span>Join Our Expedition Network</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
