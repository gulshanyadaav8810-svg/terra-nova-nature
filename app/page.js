'use client';

import Link from 'next/link';
import { ARTICLES, getTrendingArticles } from '@/lib/articles';
import { CATEGORIES } from '@/lib/categories';
import { COURSES } from '@/lib/courses';
import ArticleCard from '@/components/ArticleCard';
import ReviewsMarquee from '@/components/ReviewsMarquee';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, Camera } from 'lucide-react';

export default function HomePage() {
  const { t, getCategoryData, getCourseData, getArticleData } = useLanguage();
  const trendingArticles = getTrendingArticles();
  const latestArticles = ARTICLES.slice(0, 6);
  const featuredArticle = getArticleData(ARTICLES[0]);

  return (
    <main>
      {/* 1. HERO SECTION (Light Theme Luxury) */}
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-pill-badge">
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }}></span>
              <span>{t('heroBadge')}</span>
            </div>

            <h1 className="hero-title">
              {t('heroTitle1')} <span className="highlight-emerald">{t('heroTitleHighlight')}</span> {t('heroTitle2')}
            </h1>

            <p className="hero-description">
              {t('heroDesc')}
            </p>

            <div className="hero-cta-row">
              <Link href="/articles" className="btn-primary" id="heroBrowseJournalsBtn">
                <span>{t('heroBrowseJournals')}</span>
                <ArrowRight size={17} />
              </Link>
              <Link href="/courses" className="btn-secondary" id="heroAcademyBtn">
                <Camera size={17} />
                <span>{t('heroAcademy')}</span>
              </Link>
            </div>

            <div className="hero-stats-row">
              <div className="hero-stat-item">
                <span className="stat-number">{t('heroStatJournals')}</span>
                <span className="stat-label">{t('heroStatJournalsLabel')}</span>
              </div>
              <div className="hero-stat-item">
                <span className="stat-number">{t('heroStatBiomes')}</span>
                <span className="stat-label">{t('heroStatBiomesLabel')}</span>
              </div>
              <div className="hero-stat-item">
                <span className="stat-number">{t('heroStatEthical')}</span>
                <span className="stat-label">{t('heroStatEthicalLabel')}</span>
              </div>
            </div>
          </div>

          {/* Hero Right Media Preview */}
          <div className="hero-media-wrapper">
            <div className="hero-main-card">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="hero-main-img"
              />
              <div className="hero-card-overlay">
                <span className="hero-card-badge">{t('featuredExpedition')}</span>
                <h3 className="hero-card-title">{featuredArticle.title}</h3>
                <div className="hero-card-meta">
                  <span>{featuredArticle.location.split(',')[0]}</span>
                  <span>•</span>
                  <span>{featuredArticle.readTime}</span>
                </div>
                <Link
                  href="/article/art-1"
                  className="btn-primary"
                  style={{ alignSelf: 'flex-start', marginTop: '1rem', padding: '0.6rem 1.2rem', fontSize: '0.875rem' }}
                >
                  {t('readExpeditionJournal')}
                </Link>
              </div>
            </div>

            <div className="floating-expedition-tag">
              <div className="floating-dot" />
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>{t('liveStatus')}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{t('monsoonSeason')}</div>
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
              <div className="ribbon-label-text">{t('exploreByCategory')}</div>
              <div className="ribbon-label-sub">{t('fourGlobalBiomes')}</div>
            </div>
          </div>
          <div className="category-ribbon-pills">
            {CATEGORIES.map((cat) => {
              const catData = getCategoryData(cat);
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`category-ribbon-pill cat-ribbon-${cat.key}`}
                >
                  <span className="ribbon-cat-icon">{cat.icon}</span>
                  <span className="ribbon-cat-name">{catData.name.split('&')[0].trim()}</span>
                  <span className="ribbon-cat-badge">{cat.count} {t('journalsCount')}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. FOUR HABITAT CATEGORY CARDS */}
      <section className="section-container" style={{ paddingTop: '1rem' }}>
        <div className="section-header-centered">
          <div className="section-badge-pill">
            <span>🏷️</span>
            <span>{t('habitatCategoriesBadge')}</span>
          </div>
          <h2 className="section-main-title">{t('exploreByHabitatCategory')}</h2>
          <div className="section-title-underline" />
          <p className="section-subtitle">
            {t('exploreByHabitatCategoryDesc')}
          </p>
          <div style={{ marginTop: '0.75rem' }}>
            <span className="mobile-scroll-hint">{t('swipeHint')}</span>
          </div>
        </div>

        <div className="categories-grid">
          {CATEGORIES.map((cat, idx) => {
            const catData = getCategoryData(cat);
            return (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className={`category-card cat-theme-${cat.key}`}>
                <div className="category-card-thumb">
                  <img
                    src={cat.heroImage}
                    alt={catData.name}
                    className="category-card-img"
                    loading="lazy"
                  />
                  <div className={`category-icon-pill cat-pill-${cat.key}`}>
                    <span>{cat.icon}</span>
                    <span>{t('categoryIndex')} 0{idx + 1}</span>
                  </div>
                  <div className="category-count-badge">
                    {cat.count} {t('journalsCount')}
                  </div>
                </div>

                <div className="category-card-body">
                  <span className="category-body-tag">BIOME • {catData.shortName.toUpperCase()}</span>
                  <h3 className="category-title">{catData.name}</h3>
                  <p className="category-card-desc">{catData.description}</p>
                  <div className="category-card-footer">
                    <span>{t('browseCategory')} {catData.shortName} ({cat.count})</span>
                    <ArrowRight size={15} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. LATEST EXPEDITION JOURNALS GRID (Centered Header) */}
      <section className="section-container">
        <div className="section-header-centered">
          <div className="section-badge-pill">
            <span>📖</span>
            <span>{t('verifiedResearchBadge')}</span>
          </div>
          <h2 className="section-main-title">{t('latestFieldJournals')}</h2>
          <div className="section-title-underline" />
          <p className="section-subtitle">
            {t('latestFieldJournalsDesc')}
          </p>
          <div style={{ marginTop: '0.75rem' }}>
            <span className="mobile-scroll-hint">{t('swipeHintJournals')}</span>
          </div>
        </div>

        <div className="articles-grid">
          {latestArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/articles" className="btn-secondary">
            <span>{t('viewAllJournals')} ({ARTICLES.length})</span>
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
            <span>{t('academyBadge')}</span>
          </div>
          <h2 className="section-main-title">{t('masterclassesTitle')}</h2>
          <div className="section-title-underline" />
          <p className="section-subtitle">
            {t('masterclassesDesc')}
          </p>
          <div style={{ marginTop: '0.75rem' }}>
            <span className="mobile-scroll-hint">{t('swipeHintShort')}</span>
          </div>
        </div>

        <div className="courses-grid">
          {COURSES.slice(0, 2).map((course) => {
            const courseData = getCourseData(course);
            return (
              <div key={course.id} className="course-card">
                <div className="course-card-thumb">
                  <img
                    src={course.thumbnail}
                    alt={courseData.title}
                    className="course-img"
                    loading="lazy"
                  />
                  <span className="course-badge-level">{courseData.level}</span>
                </div>

                <div className="course-card-body">
                  <span className="course-instructor">{course.instructor}</span>
                  <h3 className="course-card-title">{courseData.title}</h3>
                  <p className="course-card-desc">{courseData.desc}</p>

                  <div className="course-syllabus-preview">
                    <div className="syllabus-heading">{t('curriculumModules')}</div>
                    <ul className="syllabus-items">
                      {courseData.syllabus.slice(0, 3).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="course-meta-footer">
                    <div className="course-duration-box">
                      <span>⏱ {courseData.duration}</span> • <span>{courseData.modulesCount}</span>
                    </div>
                    <Link href="/courses" className="btn-primary" style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}>
                      {t('viewSyllabus')}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/courses" className="btn-secondary">
            <span>{t('exploreAllMasterclasses')}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}

