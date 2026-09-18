'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORIES } from '@/lib/categories';
import { Compass, ChevronDown, Menu, X, Search, Sparkles, BookOpen, GraduationCap, Share2 } from 'lucide-react';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close drawer on path change
  useEffect(() => {
    setDrawerOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="site-header">
        <div className="nav-container">
          {/* Brand Logo */}
          <Link href="/" className="brand-logo" id="logoLink">
            <div className="logo-leaf-icon">
              <Compass size={22} strokeWidth={2.4} />
            </div>
            <div className="logo-text-group">
              <span className="brand-name">TERRA NOVA</span>
              <span className="brand-subtitle">Expedition & Wildlife</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav>
            <ul className="nav-menu">
              <li className="nav-link-item">
                <Link
                  href="/"
                  className={`nav-link ${pathname === '/' ? 'active' : ''}`}
                  id="navHome"
                >
                  Home
                </Link>
              </li>

              {/* Categories with Dropdown */}
              <li
                className={`nav-link-item category-dropdown-wrapper ${dropdownOpen ? 'open' : ''}`}
                ref={dropdownRef}
              >
                <button
                  type="button"
                  className="nav-link"
                  id="navCategoryBtn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                >
                  <span>Categories</span>
                  <ChevronDown size={16} className="dropdown-chevron" />
                </button>

                <div className="category-dropdown-menu">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="dropdown-cat-card"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <div className="cat-card-icon-box">{cat.icon}</div>
                      <div>
                        <span className="cat-card-title">{cat.name}</span>
                        <span className="cat-card-desc">{cat.description}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </li>

              <li className="nav-link-item">
                <Link
                  href="/articles"
                  className={`nav-link ${pathname.startsWith('/articles') || pathname.startsWith('/article/') ? 'active' : ''}`}
                  id="navArticles"
                >
                  Field Journals
                </Link>
              </li>

              <li className="nav-link-item">
                <Link
                  href="/courses"
                  className={`nav-link ${pathname === '/courses' ? 'active' : ''}`}
                  id="navCourses"
                >
                  Wilderness Academy
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right Action Buttons */}
          <div className="header-actions">
            <Link
              href="/articles"
              className="header-search-btn"
              title="Search Field Journals"
              id="headerSearchBtn"
            >
              <Search size={18} />
            </Link>

            <Link
              href="/article/art-1"
              className="cta-header-btn"
              id="ctaExpeditionBtn"
            >
              <span>Explore Featured</span>
              <Sparkles size={16} />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="mobile-menu-toggle"
              id="mobileMenuBtn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open Mobile Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div
        className={`mobile-drawer-backdrop ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      >
        <div
          className="mobile-drawer-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="drawer-top-row">
            <div className="brand-logo">
              <div className="logo-leaf-icon">
                <Compass size={20} />
              </div>
              <span className="brand-name">TERRA NOVA</span>
            </div>
            <button
              type="button"
              className="drawer-close-btn"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close Drawer"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="drawer-links-nav">
            <Link href="/" className="drawer-link">
              <span>Home</span>
            </Link>
            <Link href="/articles" className="drawer-link">
              <span>All Field Journals</span>
            </Link>
            <Link href="/courses" className="drawer-link">
              <span>Wilderness Academy</span>
            </Link>
          </nav>

          {/* Categories in Drawer */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brand-primary)', marginBottom: '0.75rem' }}>
              Explore 4 Habitats
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    background: 'var(--bg-surface-secondary)',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
            <Link
              href="/article/art-1"
              className="btn-primary"
              style={{ width: '100%', textAlign: 'center' }}
            >
              Read Bengal Tiger Journal
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
