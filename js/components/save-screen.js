/* ==========================================================
   NATURE MOMENTS — SAVE / LIBRARY SCREEN COMPONENT (TAB 3)
   Premium light glassmorphism matching Home aesthetics:
   Sticky top header, segmented triple pills with live counts,
   2-column video cards, readable empty states & recommendations.
   ========================================================== */

import { storage } from '../services/storage.js';
import { offlineDb } from '../services/offline-db.js';
import { REELS_DATA } from '../data/reels.js';
import { getCategoryById } from '../data/categories.js';

export class SaveScreen {
  constructor(containerElement, onOpenPlayerCallback, showToastCallback) {
    this.container = containerElement;
    this.onOpenPlayer = onOpenPlayerCallback;
    this.showToast = showToastCallback || console.log;
    this.activeTab = 'saved'; // 'saved', 'liked', or 'downloaded'

    // Sync when storage changes
    storage.subscribe(() => {
      this.render();
    });

    window.addEventListener('languageChanged', () => {
      this.render();
    });
  }

  setTab(tabName) {
    this.activeTab = tabName;
    this.render();
  }

  async render() {
    const savedCount = storage.getSaved().size;
    const likedCount = storage.getLikes().size;
    let downloadCount = 0;
    try {
      const downloads = await offlineDb.getAllDownloadedReels();
      downloadCount = downloads ? downloads.length : 0;
    } catch (e) {
      console.warn('Could not read offline reels count', e);
    }

    this.container.innerHTML = `
      <!-- Sticky Top Header matching Home design -->
      <header class="save-header-top">
        <div class="save-header-row">
          <!-- Circular Green Hamburger Menu -->
          <button id="btn-save-hamburger" class="home-hamburger-btn" aria-label="Open Navigation Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round">
              <line x1="4" y1="7" x2="20" y2="7"></line>
              <line x1="4" y1="12" x2="16" y2="12"></line>
              <line x1="4" y1="17" x2="18" y2="17"></line>
            </svg>
          </button>

          <!-- Cursive Nature Moments Title -->
          <h1 class="home-app-title">Saved Moments</h1>

          <!-- Spacer to balance header -->
          <div class="home-header-right"></div>
        </div>

        <!-- Segmented Triple Tabs with Live Badge Counts -->
        <div class="save-segmented-tabs">
          <button id="save-tab-saved" class="save-segment-btn ${this.activeTab === 'saved' ? 'active' : ''}" type="button">
            <span>🔖</span>
            <span>Saved</span>
            <span class="save-tab-count">${savedCount}</span>
          </button>
          <button id="save-tab-liked" class="save-segment-btn ${this.activeTab === 'liked' ? 'active' : ''}" type="button">
            <span>❤️</span>
            <span>Liked</span>
            <span class="save-tab-count">${likedCount}</span>
          </button>
          <button id="save-tab-downloaded" class="save-segment-btn ${this.activeTab === 'downloaded' ? 'active' : ''}" type="button">
            <span>⬇️</span>
            <span>Offline</span>
            <span class="save-tab-count">${downloadCount}</span>
          </button>
        </div>
      </header>

      <!-- Content Area for cards or empty state -->
      <div id="save-tab-content"></div>
    `;

    // Wire Hamburger Menu to Side Drawer
    const hamburgerBtn = this.container.querySelector('#btn-save-hamburger');
    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', () => {
        if (window.app && window.app.sideDrawer) {
          window.app.sideDrawer.open();
        }
      });
    }

    // Tab buttons event listeners
    this.container.querySelector('#save-tab-saved').addEventListener('click', () => {
      this.activeTab = 'saved';
      this.render();
    });

    this.container.querySelector('#save-tab-liked').addEventListener('click', () => {
      this.activeTab = 'liked';
      this.render();
    });

    this.container.querySelector('#save-tab-downloaded').addEventListener('click', () => {
      this.activeTab = 'downloaded';
      this.render();
    });

    await this.renderContent();
  }

  async renderContent() {
    const contentArea = this.container.querySelector('#save-tab-content');
    if (!contentArea) return;
    contentArea.innerHTML = '';

    if (this.activeTab === 'saved') {
      this.renderSavedTab(contentArea);
    } else if (this.activeTab === 'liked') {
      this.renderLikedTab(contentArea);
    } else {
      await this.renderDownloadedTab(contentArea);
    }
  }

  _renderRecommendations(contentArea) {
    const recReels = REELS_DATA.slice(0, 2);
    const recWrapper = document.createElement('div');
    recWrapper.className = 'empty-rec-section';
    recWrapper.innerHTML = `
      <div class="empty-rec-header">
        <span>✨</span>
        <span>Recommended for You</span>
      </div>
    `;

    const grid = document.createElement('div');
    grid.className = 'home-reels-grid';
    grid.style.padding = '0';

    recReels.forEach(reel => {
      const cat = getCategoryById(reel.category_id);
      const catIcon = cat ? cat.icon : '✨';
      const catName = cat ? cat.name : '';

      const card = document.createElement('div');
      card.className = 'home-reel-card';
      card.setAttribute('data-id', reel.content_id);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      card.innerHTML = `
        <img src="${reel.thumbnail_url}" alt="${reel.title}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80';" />
        <div class="home-card-cat-badge">
          <span>${catIcon}</span>
          <span>${catName}</span>
        </div>
        <div class="home-card-duration">
          <span>⏱️ ${reel.duration}</span>
        </div>
        <div class="home-play-circle" title="Play Video">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="7 4 19 12 7 20 7 4"></polygon>
          </svg>
        </div>
      `;

      card.addEventListener('click', () => {
        if (typeof this.onOpenPlayer === 'function') {
          this.onOpenPlayer(reel, { isOffline: false });
        }
      });

      grid.appendChild(card);
    });

    recWrapper.appendChild(grid);
    contentArea.appendChild(recWrapper);
  }

  // 1. SAVED (BOOKMARKS) TAB
  renderSavedTab(contentArea) {
    const savedIds = storage.getSaved();
    const savedReels = REELS_DATA.filter(r => savedIds.has(r.content_id));

    if (savedReels.length === 0) {
      contentArea.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3 class="empty-state-title">No saved reels yet</h3>
          <p class="empty-state-subtitle">Bookmark peaceful moments to build your personal collection.</p>
          <button class="empty-state-action-btn" type="button" onclick="window.app && window.app.switchView('home')">
            <img src="assets/logo.svg" alt="WhatsApp Status" style="width: 20px; height: 20px; vertical-align: middle; border-radius: 50%;" />
            <span>Explore Status Videos</span>
          </button>
        </div>
      `;
      this._renderRecommendations(contentArea);
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'home-reels-grid';

    savedReels.forEach(reel => {
      const cat = getCategoryById(reel.category_id);
      const catIcon = cat ? cat.icon : '✨';
      const catName = cat ? cat.name : '';

      const card = document.createElement('div');
      card.className = 'home-reel-card';
      card.setAttribute('data-id', reel.content_id);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      card.innerHTML = `
        <img src="${reel.thumbnail_url}" alt="${reel.title}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80';" />
        
        <div class="home-card-cat-badge">
          <span>${catIcon}</span>
          <span>${catName}</span>
        </div>

        <div class="home-card-duration">
          <span>⏱️ ${reel.duration}</span>
        </div>

        <!-- Unsave badge -->
        <button class="save-card-action-badge" title="Remove Bookmark" aria-label="Remove Bookmark">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#1B4D3E" stroke="#1B4D3E" stroke-width="1.5">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>

        <div class="home-play-circle" title="Play Video">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="7 4 19 12 7 20 7 4"></polygon>
          </svg>
        </div>
      `;

      // Unsave click
      const unsaveBtn = card.querySelector('.save-card-action-badge');
      unsaveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        storage.toggleSave(reel.content_id);
        this.showToast('Removed from saved bookmarks', 'ℹ️');
        this.render();
      });

      // Open in full player
      card.addEventListener('click', () => {
        if (typeof this.onOpenPlayer === 'function') {
          this.onOpenPlayer(reel, { isOffline: false });
        }
      });

      grid.appendChild(card);
    });

    contentArea.appendChild(grid);
  }

  // 2. LIKED (GENUINE USER LIKES) TAB
  renderLikedTab(contentArea) {
    const likedIds = storage.getLikes();
    const likedReels = REELS_DATA.filter(r => likedIds.has(r.content_id));

    if (likedReels.length === 0) {
      contentArea.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <h3 class="empty-state-title">No liked reels yet</h3>
          <p class="empty-state-subtitle">Tap the heart on any video you love to save it here.</p>
          <button class="empty-state-action-btn" type="button" onclick="window.app && window.app.switchView('home')">
            <img src="assets/logo.svg" alt="WhatsApp Status" style="width: 20px; height: 20px; vertical-align: middle; border-radius: 50%;" />
            <span>Discover Status Videos</span>
          </button>
        </div>
      `;
      this._renderRecommendations(contentArea);
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'home-reels-grid';

    likedReels.forEach(reel => {
      const cat = getCategoryById(reel.category_id);
      const catIcon = cat ? cat.icon : '✨';
      const catName = cat ? cat.name : '';

      const card = document.createElement('div');
      card.className = 'home-reel-card';
      card.setAttribute('data-id', reel.content_id);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      card.innerHTML = `
        <img src="${reel.thumbnail_url}" alt="${reel.title}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80';" />
        
        <div class="home-card-cat-badge">
          <span>${catIcon}</span>
          <span>${catName}</span>
        </div>

        <div class="home-card-duration">
          <span>⏱️ ${reel.duration}</span>
        </div>

        <!-- Unlike button badge -->
        <button class="save-card-action-badge" title="Unlike Reel" aria-label="Unlike Reel">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#E53935" stroke="#E53935" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <div class="home-play-circle" title="Play Video">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="7 4 19 12 7 20 7 4"></polygon>
          </svg>
        </div>
      `;

      // Unlike click
      const unlikeBtn = card.querySelector('.save-card-action-badge');
      unlikeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        storage.toggleLike(reel.content_id);
        this.showToast('Removed from Liked Reels', '🤍');
        this.render();
      });

      // Open in player
      card.addEventListener('click', () => {
        if (typeof this.onOpenPlayer === 'function') {
          this.onOpenPlayer(reel, { isOffline: false });
        }
      });

      grid.appendChild(card);
    });

    contentArea.appendChild(grid);
  }

  // 3. DOWNLOADED (OFFLINE MEDIA) TAB
  async renderDownloadedTab(contentArea) {
    let downloads = [];
    try {
      downloads = await offlineDb.getAllDownloadedReels();
    } catch (e) {
      console.warn('Error reading offline reels', e);
    }

    if (!downloads || downloads.length === 0) {
      contentArea.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
          <h3 class="empty-state-title">No offline downloads yet</h3>
          <p class="empty-state-subtitle">Download status reels to watch anytime, completely offline.</p>
          <button class="empty-state-action-btn" type="button" onclick="window.app && window.app.switchView('home')">
            <img src="assets/logo.svg" alt="WhatsApp Status" style="width: 20px; height: 20px; vertical-align: middle; border-radius: 50%;" />
            <span>Browse Status Videos</span>
          </button>
        </div>
      `;
      this._renderRecommendations(contentArea);
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'home-reels-grid';

    downloads.forEach(dlItem => {
      const card = document.createElement('div');
      card.className = 'home-reel-card';
      card.setAttribute('data-id', dlItem.content_id);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      card.innerHTML = `
        <img src="${dlItem.thumbnail_url}" alt="${dlItem.title}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80';" />
        
        <div class="home-card-cat-badge">
          <span>⚡</span>
          <span>OFFLINE</span>
        </div>

        <div class="home-card-duration">
          <span>📁 ${dlItem.formatted_size || 'HD'}</span>
        </div>

        <!-- Delete download badge -->
        <button class="save-card-action-badge" title="Delete from Offline Storage" aria-label="Delete File">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E53935" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>

        <div class="home-play-circle" title="Play Offline Video">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="7 4 19 12 7 20 7 4"></polygon>
          </svg>
        </div>
      `;

      // Delete downloaded video
      const deleteBtn = card.querySelector('.save-card-action-badge');
      deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await offlineDb.deleteDownloadedReel(dlItem.content_id);
        this.showToast('Downloaded video removed from device', '🗑️');
        this.render();
      });

      // Tap downloaded item -> open EXACT local blob URL!
      card.addEventListener('click', async () => {
        try {
          const blobUrl = await offlineDb.getPlaybackUrl(dlItem.content_id);
          if (typeof this.onOpenPlayer === 'function') {
            this.onOpenPlayer(dlItem, {
              isOffline: true,
              offlineBlobUrl: blobUrl
            });
          }
        } catch (err) {
          console.error(err);
          this.showToast('Could not load local video file', '❌');
        }
      });

      grid.appendChild(card);
    });

    contentArea.appendChild(grid);
  }
}
