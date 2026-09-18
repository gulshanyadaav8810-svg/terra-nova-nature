'use client';

import Link from 'next/link';
import { COURSES } from '@/lib/courses';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, CheckCircle2, MessageCircle } from 'lucide-react';

export default function CoursesPage() {
  const { t, getCourseData } = useLanguage();

  return (
    <main className="courses-page-view">
      <div className="courses-page-container">
        {/* Top Header & Breadcrumb */}
        <div className="courses-header-block">
          <Link href="/" className="back-link-btn" style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
            <ArrowLeft size={16} />
            <span>{t('backToHome')}</span>
          </Link>

          <span className="section-eyebrow">{t('academyBadge')}</span>
          <h1 className="courses-main-title">
            {t('masterclassesTitle')}
          </h1>
          <p className="section-subtitle">
            {t('masterclassesDesc')}
          </p>
        </div>

        {/* Courses Grid (Responsive via CSS) */}
        <div className="courses-grid">
          {COURSES.map((course) => {
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.35rem' }}>
                    <span className="course-instructor">{course.instructor}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-primary)', background: 'var(--brand-light)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {courseData.tag}
                    </span>
                  </div>

                  <h2 className="course-card-title">{courseData.title}</h2>
                  <p className="course-card-desc">{courseData.desc}</p>

                  {/* Syllabus Checklist */}
                  <div className="course-syllabus-preview">
                    <div className="syllabus-heading">{t('coreModules')} ({courseData.modulesCount})</div>
                    <ul className="syllabus-items">
                      {courseData.syllabus.map((item, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', paddingLeft: 0 }}>
                          <CheckCircle2 size={15} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer Action */}
                  <div className="course-meta-footer">
                    <div className="course-duration-box">
                      <span>⏱ {courseData.duration}</span> • <span>{t('fieldAccreditation')}</span>
                    </div>

                    <a
                      href={`https://api.whatsapp.com/send?phone=918810214878&text=${encodeURIComponent(`Hi Nature1 team, I would like to enroll / request syllabus details for masterclass: ${courseData.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary course-enroll-btn"
                    >
                      <MessageCircle size={16} />
                      <span>{t('inquireWhatsApp')}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

