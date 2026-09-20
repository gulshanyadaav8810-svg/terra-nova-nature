/* ==========================================================
   NATURE MOMENTS — HOME REELS GRID COMPONENT
   Matching user's reference design: 2-column vertical 9:15 cards,
   rounded corners, center translucent circular play button,
   category badge, duration tag, and click to play.
   ========================================================== */

import { i18n } from '../services/i18n.js';
import { getCategoryById } from '../data/categories.js';

export class ReelsGrid {
  constructor(containerElement, onReelClickCallback) {
    this.container = containerElement;
    this.onReelClick = onReelClickCallback;
    this.reels = [];
    this.activeCategory = 'trending';

    window.addEventListener('languageChanged', () => {
      this.render();
    });
  }

  setReels(reelsList, categoryId = 'trending') {
    this.reels = reelsList || [];
    this.activeCategory = categoryId;
    this.render();
  }

  render() {
    this.container.innerHTML = '';

    if (!this.reels || this.reels.length === 0) {
      this.renderEmptyState();
      return;
    }

    // Render 2-column cards matching reference screenshot
    this.reels.forEach(reel => {
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
              ${reel.views_count.toLocaleString()}
            </span>
            <span class="home-card-stat">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              ${reel.likes_count.toLocaleString()}
            </span>
          </div>
        </div>
      `;

      // Click card -> immediately opens player & plays video!
      card.addEventListener('click', () => {
        if (typeof this.onReelClick === 'function') {
          this.onReelClick(reel);
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (typeof this.onReelClick === 'function') {
            this.onReelClick(reel);
          }
        }
      });

      this.container.appendChild(card);
    });
  }

  renderEmptyState() {
    const emptyWrapper = document.createElement('div');
    emptyWrapper.className = 'empty-state';
    emptyWrapper.style.gridColumn = '1 / -1';
    emptyWrapper.style.padding = '60px 16px';
    emptyWrapper.style.textAlign = 'center';
    emptyWrapper.innerHTML = `
      <div class="empty-state-icon" style="margin-bottom: 16px;">
        <img src="assets/logo.svg" alt="WhatsApp Status" style="width: 64px; height: 64px; border-radius: 50%; box-shadow: 0 4px 14px rgba(37,211,102,0.3); display: inline-block;" />
      </div>
      <h3 class="empty-state-title" style="color: #17483A; font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">No Videos Available</h3>
      <p class="empty-state-subtitle" style="color: #61756D; font-size: 0.9rem; max-width: 320px; margin: 0 auto 20px; line-height: 1.5;">
        New status videos will appear here soon. Explore trending status videos or check other categories!
      </p>
      <button type="button" id="btn-empty-explore" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: #25D366; color: #fff; border: none; border-radius: 9999px; font-weight: 700; font-size: 0.95rem; cursor: pointer; box-shadow: 0 4px 14px rgba(37,211,102,0.4);">
        <span>🔥 View Trending Status</span>
      </button>
    `;
    const exploreBtn = emptyWrapper.querySelector('#btn-empty-explore');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        if (window.app && typeof window.app.onCategorySelect === 'function') {
          window.app.onCategorySelect('all');
        } else if (window.app && typeof window.app.switchView === 'function') {
          window.app.switchView('reels');
        }
      });
    }
    this.container.appendChild(emptyWrapper);
  }
}
