/* ==========================================================
   NATURE MOMENTS — PURE INSTAGRAM REELS CONTROLLER (60 FPS)
   Full-screen vertical swipe reels with lazy video decoder
   recycling, event delegation, and instant snap scrolling
   ========================================================== */

import { REELS_DATA, getReelsByCategory, trackEngagement } from '../data/reels.js';
import { CATEGORIES } from '../data/categories.js';
import { storage } from '../services/storage.js';
import { shareService } from '../services/share.js';
import { downloader } from '../services/downloader.js';
import { soundEngine } from '../services/sound-engine.js';
import { i18n } from '../services/i18n.js';

export class ReelsFeed {
  constructor(containerElement, showToastCallback) {
    this.container = containerElement;
    this.showToast = showToastCallback || console.log;
    this.activeCategory = 'trending';
    this.filteredReels = [];
    this.renderedCount = 0;
    this.observer = null;
    this.activeItem = null;
    this.activeVideo = null;
    this.isMuted = true;

    this._initCategoryHeader();
    this._bindSoundButton();
    this._bindContainerDelegation();
    this.filterCategory('trending');

    window.addEventListener('languageChanged', () => {
      this._updateLanguageUI();
    });

    window.addEventListener('reelsUpdated', () => {
      this._initCategoryHeader();
      this.refresh();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAll();
      }
    });
  }

  refresh() {
    this.filteredReels = getReelsByCategory(this.activeCategory);
    this.render();
  }

  // Floating Category Scroller inside Reels View
  _initCategoryHeader() {
    const scroller = document.getElementById('reels-category-scroller');
    if (!scroller) return;

    scroller.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const pill = document.createElement('button');
      pill.className = `floating-cat-pill ${cat.id === this.activeCategory ? 'active' : ''}`;
      pill.setAttribute('data-id', cat.id);
      pill.setAttribute('id', `reels-cat-${cat.id}`);
      pill.innerHTML = `
        <span>${cat.icon}</span>
        <span class="cat-name">${cat.name}</span>
        <span class="cat-dot"></span>
      `;

      pill.addEventListener('click', (e) => {
        e.preventDefault();
        this.filterCategory(cat.id);
      });

      scroller.appendChild(pill);
    });
  }

  // Bind Voice / Sound Equalizer Toggle
  _bindSoundButton() {
    this.soundBtn = document.getElementById('reels-sound-toggle-btn');
    this.soundEq = document.getElementById('reels-sound-eq');
    this.soundLabel = document.getElementById('reels-sound-label');

    if (this.soundBtn) {
      this.soundBtn.addEventListener('click', () => {
        const isAudioActive = soundEngine.toggleSound(this.activeCategory);
        this.isMuted = !isAudioActive;

        if (this.activeVideo) {
          this.activeVideo.muted = this.isMuted;
        }

        if (isAudioActive) {
          if (this.soundEq) this.soundEq.classList.add('active');
          if (this.soundLabel) this.soundLabel.textContent = 'Audio On';
          this.showToast(`🔊 Nature Audio: ${this.activeCategory.toUpperCase()} Soundscape active`, '🌿');
        } else {
          if (this.soundEq) this.soundEq.classList.remove('active');
          if (this.soundLabel) this.soundLabel.textContent = 'Muted';
          this.showToast('🔇 Audio Muted', 'ℹ️');
        }
      });
    }
  }

  // High Performance Event Delegation on container (zero memory leaks)
  _bindContainerDelegation() {
    this.container.addEventListener('click', (e) => {
      const item = e.target.closest('.feed-reel-item');
      if (!item) return;

      const reelId = item.getAttribute('data-id');
      const reel = this.filteredReels.find(r => r.content_id === reelId);
      if (!reel) return;

      // Like button
      const likeBtn = e.target.closest('.feed-like-btn');
      if (likeBtn) {
        e.stopPropagation();
        const isNowLiked = storage.toggleLike(reel.content_id);
        trackEngagement(reel.content_id, isNowLiked ? 'like' : 'unlike');
        const likeCountLabel = item.querySelector('.like-count-display');
        if (isNowLiked) {
          likeBtn.classList.add('liked');
          likeBtn.querySelector('svg').setAttribute('fill', 'currentColor');
          if (likeCountLabel) likeCountLabel.textContent = (reel.likes_count || 0);
          this.showToast('Added to Liked Nature Reels ❤️', '❤️');
        } else {
          likeBtn.classList.remove('liked');
          likeBtn.querySelector('svg').setAttribute('fill', 'none');
          if (likeCountLabel) likeCountLabel.textContent = (reel.likes_count || 0);
          this.showToast('Removed from Liked', '🤍');
        }
        return;
      }

      // Save button
      const saveBtn = e.target.closest('.feed-save-btn');
      if (saveBtn) {
        e.stopPropagation();
        const isNowSaved = storage.toggleSave(reel.content_id);
        const saveLabel = item.querySelector('.save-action-label');
        if (isNowSaved) {
          saveBtn.classList.add('saved');
          saveBtn.querySelector('svg').setAttribute('fill', 'currentColor');
          if (saveLabel) {
            saveLabel.setAttribute('data-i18n', 'action_saved');
            saveLabel.textContent = i18n.t('action_saved');
          }
          this.showToast('Reel saved to bookmarks 🔖', '🔖');
        } else {
          saveBtn.classList.remove('saved');
          saveBtn.querySelector('svg').setAttribute('fill', 'none');
          if (saveLabel) {
            saveLabel.setAttribute('data-i18n', 'action_save');
            saveLabel.textContent = i18n.t('action_save');
          }
          this.showToast('Removed from saved', 'ℹ️');
        }
        return;
      }

      // Share button
      const shareBtn = e.target.closest('.feed-share-btn');
      if (shareBtn) {
        e.stopPropagation();
        trackEngagement(reel.content_id, 'share');
        const shareCountLabel = item.querySelector('.share-count-display');
        if (shareCountLabel) shareCountLabel.textContent = (reel.shares_count || 0);
        shareService.shareReel(reel);
        return;
      }

      // Download button
      const dlBtn = e.target.closest('.feed-download-btn');
      if (dlBtn) {
        e.stopPropagation();
        trackEngagement(reel.content_id, 'download');
        this.showToast(i18n.t('download_started'), '⬇️');
        downloader.downloadReel(
          reel,
          (pct) => {
            if (pct === 50) this.showToast(`Downloading Nature Reel 50%...`, '⏳');
          },
          () => {
            this.showToast(i18n.t('download_complete'), '✅');
          },
          (err) => {
            if (!err.isCanceled) this.showToast(err.message, '❌');
          }
        );
        return;
      }

      // Video surface tap: play / pause or double-tap to like
      if (
        !e.target.closest('.feed-actions-dock') &&
        !e.target.closest('.floating-cat-pill') &&
        !e.target.closest('#btn-hamburger') &&
        !e.target.closest('.header-sound-btn') &&
        !e.target.closest('.header-brand-pill') &&
        !e.target.closest('button') &&
        !e.target.closest('a')
      ) {
        const now = Date.now();
        if (this._lastTapTime && (now - this._lastTapTime < 320)) {
          // Double Tap -> Like with Heart Burst!
          e.stopPropagation();
          clearTimeout(this._singleTapTimeout);
          this._lastTapTime = 0;
          this._triggerHeartBurst(item, reel);
          return;
        }
        this._lastTapTime = now;

        const video = item.querySelector('video');
        const playPulse = item.querySelector('.feed-play-pulse');
        if (video) {
          e.stopPropagation();
          this._singleTapTimeout = setTimeout(() => {
            if (video.paused) {
              const dataSrc = video.getAttribute('data-src');
              if (dataSrc && (!video.src || video.src === window.location.href || video.src === '')) {
                video.src = dataSrc;
              }
              video.play().catch(() => {});
              item.classList.remove('is-paused');
              if (playPulse) playPulse.classList.remove('show');
              this.showToast('Playing Reel ▶️', '▶️');
            } else {
              video.pause();
              item.classList.add('is-paused');
              if (playPulse) playPulse.classList.add('show');
              this.showToast('Reel Paused ⏸️', '⏸️');
            }
          }, 240);
        }
      }
    });
  }

  // Instagram / TikTok style heart burst animation on double tap
  _triggerHeartBurst(item, reel) {
    storage.toggleLike(reel.content_id);
    const likeBtn = item.querySelector('.feed-like-btn');
    if (likeBtn) {
      likeBtn.classList.add('liked');
      likeBtn.querySelector('svg').setAttribute('fill', 'currentColor');
    }

    const heart = document.createElement('div');
    heart.className = 'double-tap-heart';
    heart.innerHTML = `
      <svg width="84" height="84" viewBox="0 0 24 24" fill="#FF2E63" stroke="#FFFFFF" stroke-width="1.2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    `;
    item.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 850);

    this.showToast('Liked Nature Reel ❤️', '❤️');
  }

  // Filter vertical feed by category
  filterCategory(categoryId) {
    this.activeCategory = categoryId;
    this.pauseAll();

    // Update floating pill styles
    const pills = document.querySelectorAll('.floating-cat-pill');
    pills.forEach(p => {
      if (p.getAttribute('data-id') === categoryId) {
        p.classList.add('active');
        p.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        p.classList.remove('active');
      }
    });

    this.filteredReels = getReelsByCategory(categoryId);
    this.render();

    // Scroll container back to first reel
    this.container.scrollTo({ top: 0, behavior: 'instant' });

    // Update sound engine mode if active
    if (!this.isMuted && soundEngine.isPlaying) {
      soundEngine.play(categoryId);
    }

    if (typeof this.onCategoryChange === 'function') {
      this.onCategoryChange(categoryId);
    }
  }

  _initObserver() {
    if (this.observer) this.observer.disconnect();

    const options = {
      root: this.container,
      threshold: 0.6
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        const vinyl = entry.target.querySelector('.dock-vinyl-disc');
        const playPulse = entry.target.querySelector('.feed-play-pulse');
        if (!video) return;

        if (entry.isIntersecting) {
          this.activeItem = entry.target;
          this.activeVideo = video;
          entry.target.classList.add('active-playing');

          // Ensure video has src loaded
          const dataSrc = video.getAttribute('data-src');
          if (dataSrc && (!video.src || video.src === window.location.href || video.src === '')) {
            video.src = dataSrc;
          }

          // Preload next adjacent video src for instant swipe
          const nextItem = entry.target.nextElementSibling;
          if (nextItem) {
            const nextVideo = nextItem.querySelector('video');
            if (nextVideo && (!nextVideo.src || nextVideo.src === window.location.href)) {
              const nextSrc = nextVideo.getAttribute('data-src');
              if (nextSrc) nextVideo.src = nextSrc;
            }
          }

          video.currentTime = 0;
          video.muted = this.isMuted;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(e => console.log('Autoplay handled:', e));
          }

          if (vinyl) vinyl.classList.remove('paused');
          if (playPulse) playPulse.classList.remove('show');
          entry.target.classList.remove('is-paused');

          // Update sound engine category
          const reelCat = entry.target.getAttribute('data-cat') || this.activeCategory;
          if (!this.isMuted) {
            soundEngine.play(reelCat);
          }

          // Batch append when reaching near end
          const currentIndex = parseInt(entry.target.getAttribute('data-index') || '0', 10);
          if (currentIndex >= this.renderedCount - 2) {
            this.appendBatch();
          }
        } else {
          entry.target.classList.remove('active-playing');
          video.pause();
          if (vinyl) vinyl.classList.add('paused');

          // Free hardware decoder on Android if far from active
          const activeIndex = this.activeItem ? parseInt(this.activeItem.getAttribute('data-index') || '0', 10) : -1;
          const thisIndex = parseInt(entry.target.getAttribute('data-index') || '0', 10);
          if (Math.abs(thisIndex - activeIndex) > 2) {
            video.removeAttribute('src');
            video.load();
          }
        }
      });
    }, options);

    const items = this.container.querySelectorAll('.feed-reel-item');
    items.forEach(item => this.observer.observe(item));
  }

  pauseAll() {
    const videos = this.container.querySelectorAll('video');
    videos.forEach(v => {
      v.pause();
      v.removeAttribute('src');
      v.load();
    });
    soundEngine.stop();
  }

  resumeActive() {
    if (this.activeItem) {
      const video = this.activeItem.querySelector('video');
      if (video) {
        const dataSrc = video.getAttribute('data-src');
        if (dataSrc && (!video.src || video.src === '')) {
          video.src = dataSrc;
        }
        video.play().catch(e => console.warn(e));
        if (!this.isMuted) soundEngine.play(this.activeCategory);
      }
    }
  }

  // Create individual 9:16 vertical reel DOM node
  _createReelItem(reel, index) {
    const item = document.createElement('div');
    item.className = 'feed-reel-item';
    item.setAttribute('data-id', reel.content_id);
    item.setAttribute('data-cat', reel.category_id);
    item.setAttribute('data-index', index);
    item.setAttribute('id', `feed-reel-${reel.content_id}`);

    const isLiked = storage.isLiked(reel.content_id);
    const isSaved = storage.isSaved(reel.content_id);
    const catKey = `category_${reel.category_id.replace(/-/g, '_')}`;
    const catLabel = i18n.t(catKey, reel.category_id);

    // Initial src: only the very first reel loads src immediately
    const initialSrc = index === 0 ? reel.video_url : '';

    item.innerHTML = `
      <!-- Fast 0ms Poster -->
      <img class="feed-reel-poster" src="${reel.thumbnail_url}" alt="${reel.title}" loading="${index < 2 ? 'eager' : 'lazy'}" />

      <!-- 9:16 Video Canvas -->
      <video class="feed-reel-video" loop playsinline preload="${index === 0 ? 'auto' : 'none'}" poster="${reel.thumbnail_url}" data-src="${reel.video_url}" ${initialSrc ? `src="${initialSrc}"` : ''}>
      </video>
      
      <div class="feed-reel-overlay"></div>

      <!-- Center Tap Play Pulse -->
      <div class="feed-play-pulse">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="6 3 20 12 6 21 6 3"></polygon>
        </svg>
      </div>

      <!-- Right-Side Instagram Action Dock -->
      <div class="feed-actions-dock">
        
        <!-- Heart Like -->
        <div class="dock-action-item">
          <button class="dock-btn feed-like-btn ${isLiked ? 'liked' : ''}" data-id="${reel.content_id}" title="Like">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <span class="dock-label like-count-display" style="font-weight: 700;">${reel.likes_count || 0}</span>
        </div>

        <!-- Save Bookmark -->
        <div class="dock-action-item">
          <button class="dock-btn feed-save-btn ${isSaved ? 'saved' : ''}" data-id="${reel.content_id}" title="Save">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
          <span class="dock-label save-action-label" data-i18n="${isSaved ? 'action_saved' : 'action_save'}">${isSaved ? i18n.t('action_saved') : i18n.t('action_save')}</span>
        </div>

        <!-- WhatsApp Share -->
        <div class="dock-action-item">
          <button class="dock-btn feed-share-btn" data-id="${reel.content_id}" title="Share via WhatsApp">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
          <span class="dock-label share-count-display" style="font-weight: 700;">${reel.shares_count || 0}</span>
        </div>

        <!-- Download -->
        <div class="dock-action-item">
          <button class="dock-btn feed-download-btn" data-id="${reel.content_id}" title="Download Reel">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          <span class="dock-label" data-i18n="action_download">${i18n.t('action_download')}</span>
        </div>

        <!-- Spinning Vinyl Disc -->
        <div class="dock-vinyl-disc" title="Original Nature Audio">
          <img class="vinyl-center-img" src="${reel.thumbnail_url}" alt="Nature Disc" />
        </div>

      </div>

      <!-- Bottom Content Info Dock -->
      <div class="feed-content-dock">
        <span class="feed-cat-badge">🌿 ${catLabel}</span>
        <h2 class="feed-title-text">${reel.title}</h2>
        <p class="feed-desc-text">${reel.description}</p>
        <div class="feed-sound-marquee">
          <div class="marquee-inner">
            <span>🎵 Original Nature Soundscape — Peaceful ${catLabel} Ambient Atmosphere & Birdsong • </span>
            <span>🎵 Original Nature Soundscape — Peaceful ${catLabel} Ambient Atmosphere & Birdsong • </span>
          </div>
        </div>
      </div>

      <!-- Video Scrubber Progress Line -->
      <div class="feed-scrubber-line">
        <div class="feed-scrubber-filled"></div>
      </div>
    `;

    const video = item.querySelector('video');
    const progressBar = item.querySelector('.feed-scrubber-filled');

    // Update scrubber line efficiently
    if (video && progressBar) {
      video.addEventListener('timeupdate', () => {
        if (video.duration) {
          progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
        }
      });
    }

    return item;
  }

  appendBatch() {
    if (this.renderedCount >= this.filteredReels.length) return;

    const nextBatchCount = Math.min(this.renderedCount + 5, this.filteredReels.length);
    for (let i = this.renderedCount; i < nextBatchCount; i++) {
      const item = this._createReelItem(this.filteredReels[i], i);
      this.container.appendChild(item);
      if (this.observer) {
        this.observer.observe(item);
      }
    }
    this.renderedCount = nextBatchCount;
  }

  render() {
    this.container.innerHTML = '';
    this.renderedCount = 0;

    if (!this.filteredReels || this.filteredReels.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state" style="height: 100%; justify-content: center; text-align: center; padding: 24px;">
          <div class="empty-state-icon" style="font-size: 3rem; margin-bottom: 12px;">🌿</div>
          <h3 class="empty-state-title" style="color: #fff; font-size: 1.3rem; font-weight: 700; margin-bottom: 8px;">No Nature Reels Yet</h3>
          <p class="empty-state-subtitle" style="color: rgba(255,255,255,0.7); font-size: 0.9rem; max-width: 300px; margin: 0 auto 20px;">
            Publish videos or use Bulk Upload in the Admin Studio to populate this feed.
          </p>
          <a href="admin.html" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3); color: #fff; text-decoration: none; border-radius: 9999px; font-weight: 700; font-size: 0.92rem;">
            <span>🛠️ Open Admin Studio</span>
          </a>
        </div>
      `;
      return;
    }

    // Initial batch: render only 5 items for instantaneous 60FPS launch
    const initialBatch = Math.min(5, this.filteredReels.length);
    for (let i = 0; i < initialBatch; i++) {
      const item = this._createReelItem(this.filteredReels[i], i);
      this.container.appendChild(item);
    }
    this.renderedCount = initialBatch;

    this._initObserver();

    // Auto-start the very first reel immediately
    setTimeout(() => {
      const firstItem = this.container.querySelector('.feed-reel-item');
      if (firstItem) {
        const firstVideo = firstItem.querySelector('video');
        if (firstVideo) {
          const dataSrc = firstVideo.getAttribute('data-src');
          if (dataSrc && !firstVideo.src) firstVideo.src = dataSrc;
          firstVideo.currentTime = 0;
          firstVideo.play().catch(e => console.log('Autoplay:', e));
          this.activeItem = firstItem;
          this.activeVideo = firstVideo;
          firstItem.classList.add('active-playing');
        }
      }
    }, 60);
  }

  _updateLanguageUI() {
    this._initCategoryHeader();
    this.render();
  }
}
