/* ==========================================================
   NATURE MOMENTS — PURE INSTAGRAM REELS CONTROLLER (60 FPS)
   Full-screen vertical swipe reels with lazy video decoder
   recycling, event delegation, and instant snap scrolling
   ========================================================== */

import { REELS_DATA, getReelsByCategory, trackEngagement } from '../data/reels.js';
import { CATEGORIES, getCategoryTheme } from '../data/categories.js';
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
    this.isMuted = false; // Audio & voice enabled by default for authentic reels sound

    this._initCategoryHeader();
    this._bindSoundButton();
    this._bindContainerDelegation();
    this._bindScrollSnapHandler();
    this.filterCategory('trending');

    // Unmute on first user touch ONLY IF user is in reels view
    const unmuteOnInteraction = () => {
      if (window.natureAppInstance && window.natureAppInstance.currentView === 'reels') {
        if (!this.isMuted && this.activeVideo) {
          this.activeVideo.muted = false;
          this.activeVideo.volume = 1.0;
        }
      }
      window.removeEventListener('pointerdown', unmuteOnInteraction);
      window.removeEventListener('touchstart', unmuteOnInteraction);
    };
    window.addEventListener('pointerdown', unmuteOnInteraction, { passive: true });
    window.addEventListener('touchstart', unmuteOnInteraction, { passive: true });

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
    const newReels = getReelsByCategory(this.activeCategory);
    const oldFingerprint = (this.filteredReels || []).map(r => `${r.content_id}:${r.thumbnail_url}:${r.video_url}:${r.title}:${r.category_id}`).join('|');
    const newFingerprint = (newReels || []).map(r => `${r.content_id}:${r.thumbnail_url}:${r.video_url}:${r.title}:${r.category_id}`).join('|');

    // If reel list and content didn't change and items are already rendered, do not wipe container or reset playback!
    if (oldFingerprint === newFingerprint && this.container.children.length > 0) {
      return;
    }

    this.filteredReels = newReels;
    this.render();
  }

  // Floating Category Scroller inside Reels View
  _initCategoryHeader() {
    const scroller = document.getElementById('reels-category-scroller');
    if (!scroller) return;

    scroller.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const theme = getCategoryTheme(cat.id);
      const pill = document.createElement('button');
      pill.className = `floating-cat-pill ${cat.id === this.activeCategory ? 'active' : ''}`;
      pill.setAttribute('data-id', cat.id);
      pill.setAttribute('id', `reels-cat-${cat.id}`);
      pill.style.backgroundImage = `url("${cat.image_url}")`;
      pill.style.setProperty('--cat-color', theme.color);
      pill.style.setProperty('--cat-border', theme.border);
      pill.style.setProperty('--cat-glow', theme.glow);
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

  // Bind Voice / Sound Equalizer Toggle directly to Video Native Audio

  toggleMute() {
    this.isMuted = !this.isMuted;
    this._applyMuteState();
  }

  _applyMuteState() {
    if (this.activeVideo) {
      this.activeVideo.muted = this.isMuted;
      this.activeVideo.volume = this.isMuted ? 0 : 1.0;
    }
    const allVideos = this.container.querySelectorAll('video');
    allVideos.forEach(v => {
      v.muted = this.isMuted;
      v.volume = this.isMuted ? 0 : 1.0;
    });

    const muteBtns = this.container.querySelectorAll('.feed-mute-btn');
    muteBtns.forEach(btn => {
      if (this.isMuted) {
        btn.classList.add('muted');
        btn.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        `;
      } else {
        btn.classList.remove('muted');
        btn.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        `;
      }
    });

    const labels = this.container.querySelectorAll('.mute-label-display');
    labels.forEach(l => {
      l.textContent = this.isMuted ? 'Muted' : 'Sound';
    });

    if (this.soundEq) {
      if (this.isMuted) this.soundEq.classList.remove('active');
      else this.soundEq.classList.add('active');
    }
    if (this.soundLabel) {
      this.soundLabel.textContent = this.isMuted ? 'Muted' : 'Audio On';
    }

    this.showToast(this.isMuted ? '🔇 Audio Muted' : '🔊 Sound Active', this.isMuted ? '🔇' : '🔊');
  }

  _bindSoundButton() {
    this.soundBtn = document.getElementById('reels-sound-toggle-btn');
    this.soundEq = document.getElementById('reels-sound-eq');
    this.soundLabel = document.getElementById('reels-sound-label');

    // Initial state: Audio On by default!
    if (this.soundEq) this.soundEq.classList.add('active');
    if (this.soundLabel) this.soundLabel.textContent = 'Audio On';

    if (this.soundBtn) {
      this.soundBtn.addEventListener('click', () => {
        this.isMuted = !this.isMuted;

        if (this.activeVideo) {
          this.activeVideo.muted = this.isMuted;
          this.activeVideo.volume = 1.0;
        }

        const allVideos = this.container.querySelectorAll('video');
        allVideos.forEach(v => {
          v.muted = this.isMuted;
          v.volume = 1.0;
        });

        if (!this.isMuted) {
          if (this.soundEq) this.soundEq.classList.add('active');
          if (this.soundLabel) this.soundLabel.textContent = 'Audio On';
          this.showToast('🔊 Video Sound & Voice Active', '🔊');
        } else {
          if (this.soundEq) this.soundEq.classList.remove('active');
          if (this.soundLabel) this.soundLabel.textContent = 'Muted';
          this.showToast('🔇 Audio Muted', '🔇');
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
        const result = trackEngagement(reel.content_id, isNowLiked ? 'like' : 'unlike');
        reel.likes_count = result ? result.likes_count : (reel.likes_count || 0);
        const likeCountLabel = item.querySelector('.like-count-display');
        if (isNowLiked) {
          likeBtn.classList.add('liked');
          likeBtn.querySelector('svg').setAttribute('fill', 'currentColor');
          if (likeCountLabel) likeCountLabel.textContent = reel.likes_count;
          this.showToast('Added to Liked Nature Reels ❤️', '❤️');
        } else {
          likeBtn.classList.remove('liked');
          likeBtn.querySelector('svg').setAttribute('fill', 'none');
          if (likeCountLabel) likeCountLabel.textContent = reel.likes_count;
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
        const result = trackEngagement(reel.content_id, 'share');
        reel.shares_count = result ? result.shares_count : ((reel.shares_count || 0) + 1);
        const shareCountLabel = item.querySelector('.share-count-display');
        if (shareCountLabel) shareCountLabel.textContent = reel.shares_count;
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

      // Audio Mute / Unmute Toggle button
      const muteBtn = e.target.closest('.feed-mute-btn');
      if (muteBtn) {
        e.stopPropagation();
        this.toggleMute();
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
        if (this._lastTapTime && (now - this._lastTapTime < 280)) {
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
        const vinyl = item.querySelector('.dock-vinyl-disc');
        if (video) {
          e.stopPropagation();
          clearTimeout(this._singleTapTimeout);
          this._singleTapTimeout = setTimeout(() => {
            if (video.paused) {
              item.classList.remove('is-paused');
              if (playPulse) playPulse.classList.remove('show');
              if (vinyl) vinyl.classList.remove('paused');
              video.playsInline = true;
              video.muted = this.isMuted;
              video.volume = this.isMuted ? 0 : 1.0;
              const p = video.play();
              if (p !== undefined) {
                p.catch(() => {
                  video.muted = true;
                  video.play().catch(() => {});
                });
              }
            } else {
              video.pause();
              item.classList.add('is-paused');
              if (playPulse) playPulse.classList.add('show');
              if (vinyl) vinyl.classList.add('paused');
            }
          }, 150);
        }
      }
    });
  }

  // Instagram / TikTok style heart burst animation on double tap
  _triggerHeartBurst(item, reel) {
    const isNowLiked = storage.toggleLike(reel.content_id);
    if (isNowLiked) {
      const result = trackEngagement(reel.content_id, 'like');
      reel.likes_count = result ? result.likes_count : ((reel.likes_count || 0) + 1);
      const likeCountLabel = item.querySelector('.like-count-display');
      if (likeCountLabel) likeCountLabel.textContent = reel.likes_count;
    }
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

    if (typeof this.onCategoryChange === 'function') {
      this.onCategoryChange(categoryId);
    }
  }

  // Scroll directly to a specific reel and start playing it seamlessly
  scrollToReel(contentId, categoryId = null) {
    if (!contentId) return;

    // 1. If category is specified and different, switch category
    if (categoryId && categoryId !== this.activeCategory) {
      this.activeCategory = categoryId;
      this.filteredReels = getReelsByCategory(categoryId);

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
    }

    // 2. If the reel is not found in the current category, search in 'trending' or 'all'
    let reelIndex = (this.filteredReels || []).findIndex(r => r.content_id === contentId);
    if (reelIndex === -1) {
      this.activeCategory = 'trending';
      this.filteredReels = getReelsByCategory('trending');
      reelIndex = (this.filteredReels || []).findIndex(r => r.content_id === contentId);
      if (reelIndex === -1) {
        this.activeCategory = 'all';
        this.filteredReels = getReelsByCategory('all');
        reelIndex = (this.filteredReels || []).findIndex(r => r.content_id === contentId);
      }
      this.render();
    }

    // 3. Ensure DOM has rendered up to target index so element exists
    if (reelIndex !== -1 && reelIndex >= this.renderedCount) {
      const targetRenderCount = Math.min(reelIndex + 4, this.filteredReels.length);
      for (let i = this.renderedCount; i < targetRenderCount; i++) {
        const item = this._createReelItem(this.filteredReels[i], i);
        this.container.appendChild(item);
        if (this.observer) {
          this.observer.observe(item);
        }
      }
      this.renderedCount = targetRenderCount;
    }

    // 4. Locate target DOM element and snap to it
    const targetItem = this.container.querySelector(`.feed-reel-item[data-id="${contentId}"]`);
    if (targetItem) {
      this.pauseAll();
      this.container.scrollTop = targetItem.offsetTop;
      this.activeItem = targetItem;

      // Slight delay to ensure layout settles before starting playback
      setTimeout(() => {
        this._playReelItem(targetItem);
      }, 60);
    } else {
      this.render();
      this.resumeActive();
    }
  }

  _bindScrollSnapHandler() {
    let scrollTimeout = null;
    const onScroll = () => {
      const isReelsTab = window.natureAppInstance && window.natureAppInstance.currentView === 'reels';
      const reelsView = document.getElementById('view-reels');
      const isReelsVisible = reelsView && (reelsView.style.display === 'block' || reelsView.offsetParent !== null);
      if (!isReelsTab || !isReelsVisible) return;

      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this._detectAndPlaySnappedReel();
      }, 60);
    };

    this.container.addEventListener('scroll', onScroll, { passive: true });
    this.container.addEventListener('scrollend', () => {
      this._detectAndPlaySnappedReel();
    }, { passive: true });
  }

  _detectAndPlaySnappedReel() {
    const isReelsTab = window.natureAppInstance && window.natureAppInstance.currentView === 'reels';
    const reelsView = document.getElementById('view-reels');
    const isReelsVisible = reelsView && (reelsView.style.display === 'block' || reelsView.offsetParent !== null);
    if (!isReelsTab || !isReelsVisible) return;

    const containerHeight = this.container.clientHeight || window.innerHeight;
    if (!containerHeight) return;

    // Instant O(1) index calculation without querying DOM offsets during scroll
    const targetIdx = Math.round(this.container.scrollTop / containerHeight);
    const items = this.container.children;
    if (!items || !items.length) return;

    const clampedIdx = Math.max(0, Math.min(items.length - 1, targetIdx));
    const closestItem = items[clampedIdx];

    if (closestItem && (this.activeItem !== closestItem || !this.activeVideo || this.activeVideo.paused)) {
      this._playReelItem(closestItem);
    }
  }

  _playReelItem(targetItem) {
    if (!targetItem) return;

    const isReelsTab = window.natureAppInstance && window.natureAppInstance.currentView === 'reels';
    const reelsView = document.getElementById('view-reels');
    const isReelsVisible = reelsView && (reelsView.style.display === 'block' || reelsView.offsetParent !== null);
    if (!isReelsTab || !isReelsVisible) {
      this.pauseAll();
      return;
    }

    const video = targetItem.querySelector('video');
    if (!video) return;

    // Pause all other items cleanly without destroying buffered video data
    const targetIdx = parseInt(targetItem.getAttribute('data-index') || '0', 10);
    const items = this.container.querySelectorAll('.feed-reel-item');
    items.forEach(item => {
      if (item !== targetItem) {
        item.classList.remove('active-playing');
        item.classList.remove('is-buffering');
        const otherVideo = item.querySelector('video');
        if (otherVideo) {
          otherVideo.pause();
          const otherIdx = parseInt(item.getAttribute('data-index') || '0', 10);
          if (Math.abs(otherIdx - targetIdx) > 2) {
            if (otherVideo.src && otherVideo.src !== '' && otherVideo.src !== window.location.href) {
              otherVideo.removeAttribute('src');
              otherVideo.load();
            }
          }
        }
        const otherVinyl = item.querySelector('.dock-vinyl-disc');
        if (otherVinyl) otherVinyl.classList.add('paused');
      }
    });

    this.activeItem = targetItem;
    this.activeVideo = video;
    targetItem.classList.add('active-playing');
    targetItem.classList.remove('is-paused');

    const vinyl = targetItem.querySelector('.dock-vinyl-disc');
    const playPulse = targetItem.querySelector('.feed-play-pulse');
    if (vinyl) vinyl.classList.remove('paused');
    if (playPulse) playPulse.classList.remove('show');

    // Ensure video has src
    const dataSrc = video.getAttribute('data-src') || video.src;
    if (dataSrc && (!video.src || video.src === '' || video.src === window.location.href)) {
      video.src = dataSrc;
    }

    video.preload = 'auto';
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x5-playsinline', '');
    video.muted = this.isMuted;
    video.volume = this.isMuted ? 0 : 1.0;

    // Instant seamless playback without spinning loaders
    if (!video._bufferEngineBound) {
      video._bufferEngineBound = true;
      video.addEventListener('playing', () => {
        targetItem.classList.remove('is-buffering');
      });
      video.addEventListener('canplay', () => {
        targetItem.classList.remove('is-buffering');
        if (this.activeItem === targetItem && video.paused && !targetItem.classList.contains('is-paused')) {
          video.play().catch(() => {});
        }
      });
      video.addEventListener('error', () => {
        targetItem.classList.remove('is-buffering');
        const cur = video.src || '';
        if (cur.includes('nature-moments-app.vercel.app') || cur.startsWith('/uploads/')) {
          const fn = cur.split('/uploads/')[1];
          video.src = `https://cdn.jsdelivr.net/gh/gulshanyadaav8810-svg/terra-nova-nature@main/uploads/${fn}`;
          video.load();
          video.play().catch(() => {});
        } else if (cur.includes('cdn.jsdelivr.net') && cur.includes('/uploads/')) {
          const fn = cur.split('/uploads/')[1];
          const rawFallback = `https://raw.githubusercontent.com/gulshanyadaav8810-svg/terra-nova-nature/main/uploads/${fn}`;
          if (video.src !== rawFallback) {
            console.log('[ReelsFeed] Switching to raw GitHub fallback:', rawFallback);
            video.src = rawFallback;
            video.load();
            video.play().catch(() => {});
          }
        }
      });
    }

    const p = video.play();
    if (p !== undefined) {
      p.catch((err) => {
        // Fallback to muted playback if user gesture required
        video.muted = true;
        video.play().catch(e => console.warn('Autoplay handled:', e));
      });
    }

    // Preload next and previous items so video is immediately ready on swipe
    const nextItem = targetItem.nextElementSibling;
    if (nextItem) {
      const nv = nextItem.querySelector('video');
      if (nv) {
        const nextSrc = nv.getAttribute('data-src');
        if (nextSrc && (!nv.src || nv.src === window.location.href)) nv.src = nextSrc;
        nv.preload = 'auto';
      }
    }
    const prevItem = targetItem.previousElementSibling;
    if (prevItem) {
      const pv = prevItem.querySelector('video');
      if (pv) {
        const prevSrc = pv.getAttribute('data-src');
        if (prevSrc && (!pv.src || pv.src === window.location.href)) pv.src = prevSrc;
        pv.preload = 'auto';
      }
    }

    // Batch append
    const currentIndex = parseInt(targetItem.getAttribute('data-index') || '0', 10);
    if (currentIndex >= this.renderedCount - 2) {
      this.appendBatch();
    }
  }

  _initObserver() {
    if (this.observer) this.observer.disconnect();

    const options = {
      root: this.container,
      threshold: [0.1, 0.5, 0.8]
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        if (!video) return;

        const isReelsTab = window.natureAppInstance && window.natureAppInstance.currentView === 'reels';
        const reelsView = document.getElementById('view-reels');
        const isReelsVisible = reelsView && (reelsView.style.display === 'block' || reelsView.offsetParent !== null);

        if (!isReelsTab || !isReelsVisible) {
          video.pause();
          return;
        }

        // When entry dominates viewport (> 50% visible)
        if (entry.intersectionRatio >= 0.5) {
          if (this.activeItem !== entry.target) {
            this._playReelItem(entry.target);
          } else if (video.paused && !entry.target.classList.contains('is-paused')) {
            video.play().catch(() => {
              video.muted = true;
              video.play().catch(() => {});
            });
          }
        } else if (entry.intersectionRatio < 0.2) {
          if (this.activeItem === entry.target) {
            // User scrolled away
            entry.target.classList.remove('active-playing');
            video.pause();
          }
        }
      });
    }, options);

    const items = this.container.querySelectorAll('.feed-reel-item');
    items.forEach(item => this.observer.observe(item));
  }

  pauseAll() {
    this.activeItem = null;
    this.activeVideo = null;
    const videos = this.container.querySelectorAll('video');
    videos.forEach(v => {
      try {
        v.pause();
      } catch(e) {}
    });
    const items = this.container.querySelectorAll('.feed-reel-item');
    items.forEach(item => {
      item.classList.remove('active-playing');
      item.classList.remove('is-buffering');
      item.classList.add('is-paused');
      const vinyl = item.querySelector('.dock-vinyl-disc');
      if (vinyl) vinyl.classList.add('paused');
    });
    try { soundEngine.stop(); } catch(e) {}
  }

  resumeActive() {
    const isReelsTab = window.natureAppInstance && window.natureAppInstance.currentView === 'reels';
    const reelsView = document.getElementById('view-reels');
    const isReelsVisible = reelsView && (reelsView.style.display === 'block' || reelsView.offsetParent !== null);

    if (!isReelsTab || !isReelsVisible) {
      this.pauseAll();
      return;
    }

    let item = this.activeItem;
    if (!item || !this.container.contains(item)) {
      const containerTop = this.container.scrollTop || 0;
      const items = Array.from(this.container.querySelectorAll('.feed-reel-item'));
      item = items.find(el => {
        const top = el.offsetTop - this.container.offsetTop;
        return Math.abs(top - containerTop) < 150;
      }) || items[0];
    }

    if (item) {
      this._playReelItem(item);
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

    const catObj = CATEGORIES.find(c => c.id === reel.category_id);
    const catIcon = catObj ? catObj.icon : '✨';

    item.innerHTML = `
      <!-- Fast 0ms Poster with CDN Fallback -->
      <img class="feed-reel-poster" src="${reel.thumbnail_url}" alt="${reel.title}" loading="${index < 2 ? 'eager' : 'lazy'}" onerror="if(this.src.includes('cdn.jsdelivr.net')){this.src=this.src.replace('cdn.jsdelivr.net/gh/','raw.githubusercontent.com/').replace('@main/','/main/');}else{this.onerror=null;this.src='https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80';}" />

      <!-- 9:16 Video Canvas (Preloaded for instant 0ms playback) -->
      <video class="feed-reel-video" loop playsinline webkit-playsinline x5-playsinline ${index < 3 ? `src="${reel.video_url}" preload="auto"` : 'preload="metadata"'} poster="${reel.thumbnail_url}" data-src="${reel.video_url}">
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

        <!-- Audio Mute / Unmute Toggle Button -->
        <div class="dock-action-item">
          <button class="dock-btn feed-mute-btn ${this.isMuted ? 'muted' : ''}" data-id="${reel.content_id}" title="Sound Mute/Unmute">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              ${this.isMuted 
                ? '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>'
                : '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>'}
            </svg>
          </button>
          <span class="dock-label mute-label-display">${this.isMuted ? 'Muted' : 'Sound'}</span>
        </div>

        <!-- Spinning Vinyl Disc -->
        <div class="dock-vinyl-disc" title="Original Status Audio">
          <img class="vinyl-center-img" src="${reel.thumbnail_url}" alt="WhatsApp Status Disc" />
        </div>

      </div>

      <!-- Bottom Content Info Dock -->
      <div class="feed-content-dock">
        <span class="feed-cat-badge">${catIcon} ${catLabel}</span>
        <h2 class="feed-title-text">${reel.title}</h2>
        <p class="feed-desc-text">${reel.description}</p>
        <div class="feed-sound-marquee">
          <div class="marquee-inner">
            <span><span class="music-note-glyph">🎵</span> Original Nature Soundscape — Peaceful ${catLabel} Ambient Atmosphere & Birdsong • </span>
            <span><span class="music-note-glyph">🎵</span> Original Nature Soundscape — Peaceful ${catLabel} Ambient Atmosphere & Birdsong • </span>
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

    // Immediate error fallback to raw.githubusercontent.com for 0ms newly uploaded videos!
    if (video) {
      video.addEventListener('error', () => {
        const cur = video.src || video.getAttribute('data-src') || '';
        if (cur.includes('cdn.jsdelivr.net')) {
          const fallback = cur.replace('cdn.jsdelivr.net/gh/', 'raw.githubusercontent.com/').replace('@main/', '/main/');
          console.log('[ReelsFeed] CDN error, switching instantly to GitHub Raw fallback:', fallback);
          video.src = fallback;
          video.setAttribute('data-src', fallback);
          video.load();
          if (item.classList.contains('active-playing')) {
            video.play().catch(() => {});
          }
        }
      });
    }

    // Update scrubber line efficiently
    if (video && progressBar) {
      video.addEventListener('timeupdate', () => {
        if (video.duration) {
          progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
        }
      });
      video.addEventListener('error', (e) => {
        console.warn('Feed video error:', e);
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
      const catObj = CATEGORIES.find(c => c.id === this.activeCategory);
      const catName = catObj ? catObj.name : this.activeCategory;
      this.container.innerHTML = `
        <div class="empty-state" style="height: 100%; justify-content: center; text-align: center; padding: 32px 20px; display: flex; flex-direction: column; align-items: center;">
          <img src="assets/logo.png" alt="Nature Status" style="width: 64px; height: 64px; margin-bottom: 16px; border-radius: 14px; opacity: 0.95;" />
          <h3 class="empty-state-title" style="color: #fff; font-size: 1.3rem; font-weight: 700; margin-bottom: 8px;">No Videos Available</h3>
          <p class="empty-state-subtitle" style="color: rgba(255,255,255,0.7); font-size: 0.9rem; max-width: 300px; margin: 0 auto 24px;">
            There are currently no videos in "${catName}". Explore other categories or check back soon.
          </p>
          <div style="display: flex; gap: 12px;">
            <button type="button" class="btn-feed-go-trending" style="padding: 12px 26px; background: rgba(10, 16, 30, 0.85); border: 1.5px solid rgba(56, 189, 248, 0.45); color: #38BDF8; border-radius: 9999px; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35), 0 0 10px rgba(56, 189, 248, 0.25);">
              🔥 Explore Trending
            </button>
            <button type="button" class="btn-feed-refresh" style="padding: 12px 24px; background: rgba(10, 16, 30, 0.85); border: 1.5px solid rgba(56, 189, 248, 0.45); color: #38BDF8; border-radius: 9999px; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35), 0 0 10px rgba(56, 189, 248, 0.25);">
              🔄 Refresh
            </button>
          </div>
        </div>
      `;
      const btnTrend = this.container.querySelector('.btn-feed-go-trending');
      if (btnTrend) {
        btnTrend.addEventListener('click', (e) => {
          e.preventDefault();
          this.filterCategory('trending');
        });
      }
      const btnRef = this.container.querySelector('.btn-feed-refresh');
      if (btnRef) {
        btnRef.addEventListener('click', (e) => {
          e.preventDefault();
          this.refresh();
        });
      }
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

    // NEVER autoplay on render if app is on Home tab!
    // Video will ONLY play when user explicitly navigates to Reels tab!
    setTimeout(() => {
      const isReelsTab = window.natureAppInstance && window.natureAppInstance.currentView === 'reels';
      const reelsView = document.getElementById('view-reels');
      if (isReelsTab && reelsView && reelsView.style.display === 'block') {
        this.resumeActive();
      } else {
        this.pauseAll();
      }
    }, 50);
  }

  _updateLanguageUI() {
    this._initCategoryHeader();
    this.render();
  }
}
