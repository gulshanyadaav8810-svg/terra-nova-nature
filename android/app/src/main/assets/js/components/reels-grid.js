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
      const catIcon = cat ? cat.icon : '🌿';
      const catName = cat ? cat.name : '';

      const card = document.createElement('div');
      card.className = 'home-reel-card';
      card.setAttribute('data-id', reel.content_id);
      card.setAttribute('id', `home-card-${reel.content_id}`);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Play ${reel.title}`);

      card.innerHTML = `
        <img src="${reel.thumbnail_url}" alt="${reel.title}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80';" />
        
        <!-- Category Pill Badge -->
        <div class="home-card-cat-badge">
          <span>${catIcon}</span>
          <span>${catName}</span>
        </div>

        <!-- Duration Badge -->
        <div class="home-card-duration">
          <span>⏱️ ${reel.duration}</span>
        </div>

        <!-- Center Frosted Glass Play Button -->
        <div class="home-play-circle" title="Play Video">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="7 4 19 12 7 20 7 4"></polygon>
          </svg>
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
      <div class="empty-state-icon" style="font-size: 3rem; margin-bottom: 14px;">🌿</div>
      <h3 class="empty-state-title" style="color: #17483A; font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">No Reels Uploaded Yet</h3>
      <p class="empty-state-subtitle" style="color: #61756D; font-size: 0.9rem; max-width: 300px; margin: 0 auto 20px;">
        Upload single videos or use Bulk Upload from the Admin Studio to publish reels directly here.
      </p>
      <a href="admin.html" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: #17483C; color: #fff; text-decoration: none; border-radius: 9999px; font-weight: 700; font-size: 0.92rem; box-shadow: 0 4px 14px rgba(23,72,60,0.3);">
        <span>🛠️ Open Admin Studio</span>
      </a>
    `;
    this.container.appendChild(emptyWrapper);
  }
}
