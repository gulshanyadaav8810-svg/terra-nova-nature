import Link from 'next/link';
import { ARTICLES, getTrendingArticles } from '@/lib/articles';
import { CATEGORIES } from '@/lib/categories';
import { COURSES } from '@/lib/courses';
import ArticleCard from '@/components/ArticleCard';
import ReviewsMarquee from '@/components/ReviewsMarquee';
import { ArrowRight, Camera } from 'lucide-react';

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
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }}></span>
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

      {/* 1.5 PROMINENT CATEGORY NAVIGATION RIBBON */}
      <div className="category-quick-ribbon-wrapper">
        <div className="category-quick-ribbon">
          <div className="category-ribbon-label">
            <span className="ribbon-label-icon">🏷️</span>
            <div>
              <div className="ribbon-label-text">Explore By Category</div>
              <div className="ribbon-label-sub">4 Global Wildlife Biomes</div>
            </div>
          </div>
          <div className="category-ribbon-pills">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`category-ribbon-pill cat-ribbon-${cat.key}`}
              >
                <span className="ribbon-cat-icon">{cat.icon}</span>
                <span className="ribbon-cat-name">{cat.name.split('&')[0].trim()}</span>
                <span className="ribbon-cat-badge">{cat.count} Journals</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 2. FOUR HABITAT CATEGORY CARDS */}
      <section className="section-container" style={{ paddingTop: '1rem' }}>
        <div className="section-header-centered">
          <div className="section-badge-pill">
            <span>🏷️</span>
            <span>HABITAT CATEGORIES</span>
          </div>
          <h2 className="section-main-title">Explore by Habitat Category</h2>
          <div className="section-title-underline" />
          <p className="section-subtitle">
            Select a specialized ecosystem category below to discover dedicated wildlife research journals, camera traps, and field notes.
          </p>
          <div style={{ marginTop: '0.75rem' }}>
            <span className="mobile-scroll-hint">Swipe ← → to view all 4 categories</span>
          </div>
        </div>

        <div className="categories-grid">
          {CATEGORIES.map((cat, idx) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className={`category-card cat-theme-${cat.key}`}>
              <div className="category-card-thumb">
                <img
                  src={cat.heroImage}
                  alt={cat.name}
                  className="category-card-img"
                  loading="lazy"
                />
                <div className={`category-icon-pill cat-pill-${cat.key}`}>
                  <span>{cat.icon}</span>
                  <span>CATEGORY 0{idx + 1}</span>
                </div>
                <div className="category-count-badge">
                  {cat.count} Journals
                </div>
              </div>

              <div className="category-card-body">
                <span className="category-body-tag">BIOME • {cat.shortName.toUpperCase()}</span>
                <h3 className="category-title">{cat.name}</h3>
                <p className="category-card-desc">{cat.description}</p>
                <div className="category-card-footer">
                  <span>Browse {cat.shortName} ({cat.count})</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. LATEST EXPEDITION JOURNALS GRID (Centered Header) */}
      <section className="section-container">
        <div className="section-header-centered">
          <div className="section-badge-pill">
            <span>📖</span>
            <span>VERIFIED FIELD RESEARCH</span>
          </div>
          <h2 className="section-main-title">Latest Field Journals</h2>
          <div className="section-title-underline" />
          <p className="section-subtitle">
            Recent eyewitness expeditions across wild apex predators, ancient forest canopies, marine reefs, and alpine peaks.
          </p>
          <div style={{ marginTop: '0.75rem' }}>
            <span className="mobile-scroll-hint">Swipe ← → to view all journals</span>
          </div>
        </div>

        <div className="articles-grid">
          {latestArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/articles" className="btn-secondary">
            <span>View All Field Journals ({ARTICLES.length})</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 4. INFINITE NATURALIST TESTIMONIALS MARQUEE */}
      <ReviewsMarquee />

      {/* 5. WILDERNESS ACADEMY SPOTLIGHT */}
      <section className="section-container" style={{ paddingBottom: '5rem' }}>
        <div className="section-header-centered">
          <div className="section-badge-pill">
            <span>🎓</span>
            <span>FIELD TRAINING ACADEMY</span>
          </div>
          <h2 className="section-main-title">Wilderness Masterclasses</h2>
          <div className="section-title-underline" />
          <p className="section-subtitle">
            Learn master tracking, long telephoto stabilization, and canopy rigging directly from veteran naturalists.
          </p>
          <div style={{ marginTop: '0.75rem' }}>
            <span className="mobile-scroll-hint">Swipe ← →</span>
          </div>
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
    </main>
  );
}
