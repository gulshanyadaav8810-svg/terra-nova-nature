/* ==========================================================
   NATURE MOMENTS — HIGH-PERFORMANCE HOME REELS GRID
   Instant 60/120 FPS category switching with virtual batch rendering,
   DocumentFragment DOM insertion, and single-delegate event handling.
   ========================================================== */

import { getCategoryById } from '../data/categories.js';

const BATCH_SIZE = 24;

export class ReelsGrid {
  constructor(containerElement, onReelClickCallback) {
    this.container = containerElement;
    this.onReelClick = onReelClickCallback;
    this.reels = [];
    this.reelsMap = new Map();
    this.activeCategory = 'trending';
    this.renderedCount = 0;
    this._sentinel = null;
    this._observer = null;

    // Single delegated event listener for maximum performance & zero memory overhead
    this.container.addEventListener('click', (e) => {
      const card = e.target.closest('.home-reel-card');
      if (!card) return;
      if (navigator.vibrate) {
        try { navigator.vibrate(10); } catch(err) {}
      }
      const id = card.getAttribute('data-id');
      const reel = this.reelsMap.get(id);
      if (reel && typeof this.onReelClick === 'function') {
        this.onReelClick(reel);
      }
    });

    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.home-reel-card');
        if (!card) return;
        e.preventDefault();
        const id = card.getAttribute('data-id');
        const reel = this.reelsMap.get(id);
        if (reel && typeof this.onReelClick === 'function') {
          this.onReelClick(reel);
        }
      }
    });

    window.addEventListener('languageChanged', () => {
      this.render();
    });

    this._initInfiniteScroll();
  }

  _initInfiniteScroll() {
    // Window scroll listener for seamless infinite expansion on Home view
    let scrollDebounce = false;
    window.addEventListener('scroll', () => {
      if (scrollDebounce) return;
      scrollDebounce = true;
      requestAnimationFrame(() => {
        scrollDebounce = false;
        if (!this.reels || this.renderedCount >= this.reels.length) return;
        const scrollBottom = window.innerHeight + window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        if (docHeight - scrollBottom < 600) {
          this._appendNextBatch();
        }
      });
    }, { passive: true });
  }

  setReels(reelsList, categoryId = 'trending') {
    this.reels = (reelsList || []).filter(r => r && r.is_hidden !== true && r.hidden !== true);
    this.activeCategory = categoryId;
    this.reelsMap = new Map();
    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];
      if (r && r.content_id) {
        this.reelsMap.set(r.content_id, r);
      }
    }
    this.render();
  }

  render() {
    this.container.innerHTML = '';
    this.renderedCount = 0;

    if (!this.reels || this.reels.length === 0) {
      this.renderEmptyState();
      return;
    }

    // Render initial fast batch (24 cards = instant 0ms paint)
    this._appendNextBatch();
  }

  _appendNextBatch() {
    if (!this.reels || this.renderedCount >= this.reels.length) return;

    const start = this.renderedCount;
    const end = Math.min(start + BATCH_SIZE, this.reels.length);
    const fragment = document.createDocumentFragment();

    for (let i = start; i < end; i++) {
      const reel = this.reels[i];
      if (!reel) continue;

      const cat = getCategoryById(reel.category_id);
      const catIcon = cat ? cat.icon : '✨';
      const catName = cat ? cat.name : '';

      const card = document.createElement('div');
      card.className = 'home-reel-card';
      card.setAttribute('data-id', reel.content_id);
      card.setAttribute('id', `home-card-${reel.content_id}`);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Play ${reel.title}`);

      card.innerHTML = `
        <img src="${reel.thumbnail_url}" alt="${reel.title}" loading="lazy" onerror="if(this.src.includes('cdn.jsdelivr.net')){this.src=this.src.replace('cdn.jsdelivr.net/gh/','raw.githubusercontent.com/').replace('@main/','/main/');}else{this.onerror=null;this.src='https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80';}" />
        
        <!-- Category Pill Badge -->
        <div class="home-card-cat-badge">
          <span>${catIcon}</span>
          <span>${catName}</span>
        </div>

        <!-- Center Frosted Glass Play Circle -->
        <div class="home-play-circle" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 2px;">
            <polygon points="6 3 20 12 6 21 6 3"></polygon>
          </svg>
        </div>

        <!-- Duration Badge -->
        <div class="home-card-duration">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 2px;">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>${reel.duration ? (reel.duration.includes(':') ? reel.duration : `0:${reel.duration}`) : (reel.duration_seconds ? `0:${reel.duration_seconds < 10 ? '0' : ''}${reel.duration_seconds}` : '0:15')}</span>
        </div>

        <!-- Card Meta (Title & Stats) -->
        <div class="home-card-meta">
          <h3 class="home-card-title">${reel.title}</h3>
          <div class="home-card-stats">
            <span class="home-card-stat">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              ${(reel.views_count || 0).toLocaleString()}
            </span>
            <span class="home-card-stat">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              ${(reel.likes_count || 0).toLocaleString()}
            </span>
          </div>
        </div>
      `;

      if (start === 0 && (i - start) < 10) {
        card.style.animationDelay = `${(i - start) * 22}ms`;
      } else {
        card.style.animation = 'none';
      }

      fragment.appendChild(card);
    }

    this.container.appendChild(fragment);
    this.renderedCount = end;
  }

  renderEmptyState() {
    const emptyWrapper = document.createElement('div');
    emptyWrapper.className = 'empty-state';
    emptyWrapper.style.gridColumn = '1 / -1';
    emptyWrapper.style.padding = '60px 16px';
    emptyWrapper.style.textAlign = 'center';
    emptyWrapper.innerHTML = `
      <div class="empty-state-icon" style="margin-bottom: 16px;">
        <img src="assets/logo.png" alt="Nature Status" style="width: 64px; height: 64px; border-radius: 14px; box-shadow: 0 4px 14px rgba(16,185,129,0.3); display: inline-block;" />
      </div>
      <h3 class="empty-state-title" style="color: #17483A; font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">No Videos Available</h3>
      <p class="empty-state-subtitle" style="color: #61756D; font-size: 0.9rem; max-width: 320px; margin: 0 auto 20px; line-height: 1.5;">
        New status videos will appear here soon. Explore trending status videos or check other categories!
      </p>
      <button type="button" id="btn-empty-explore" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: rgba(10, 16, 30, 0.85); color: #38BDF8; border: 1.5px solid rgba(56, 189, 248, 0.45); border-radius: 9999px; font-weight: 700; font-size: 0.95rem; cursor: pointer; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35), 0 0 12px rgba(56, 189, 248, 0.25);">
        <span>🔥 View Trending Status</span>
      </button>
    `;
    const exploreBtn = emptyWrapper.querySelector('#btn-empty-explore');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        if (window.natureAppInstance && typeof window.natureAppInstance.selectCategory === 'function') {
          window.natureAppInstance.selectCategory('trending');
        }
      });
    }
    this.container.appendChild(emptyWrapper);
  }
}
