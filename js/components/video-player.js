/* ==========================================================
   NATURE MOMENTS — DEDICATED VIDEO PLAYER COMPONENT
   Full feature video player with scrubber, time, fullscreen,
   mute, like, save, download with progress, and WhatsApp share
   ========================================================== */

import { storage } from '../services/storage.js';
import { downloader } from '../services/downloader.js';
import { shareService } from '../services/share.js';
import { i18n } from '../services/i18n.js';
import { offlineDb } from '../services/offline-db.js';
import { trackEngagement } from '../data/reels.js';

export class VideoPlayer {
  constructor(overlayElement, showToastCallback) {
    this.overlay = overlayElement;
    this.showToast = showToastCallback || console.log;
    this.currentReel = null;
    this.isOffline = false;
    this.offlineBlobUrl = null;

    this._initDOMElements();
    this._bindEvents();
  }

  _initDOMElements() {
    this.stage = this.overlay.querySelector('.player-stage');
    this.video = this.overlay.querySelector('.player-video');
    this.spinner = this.overlay.querySelector('.player-spinner');
    this.centerPlay = this.overlay.querySelector('.player-center-play');
    this.backBtn = this.overlay.querySelector('.player-back-btn');
    this.titleEl = this.overlay.querySelector('.player-title');
    this.catEl = this.overlay.querySelector('.player-category-tag');

    // Action buttons
    this.likeBtn = this.overlay.querySelector('#player-btn-like');
    this.saveBtn = this.overlay.querySelector('#player-btn-save');
    this.downloadBtn = this.overlay.querySelector('#player-btn-download');
    this.shareBtn = this.overlay.querySelector('#player-btn-share');
    this.muteBtn = this.overlay.querySelector('#player-btn-mute');
    this.fullscreenBtn = this.overlay.querySelector('#player-btn-fullscreen');

    // Scrubber & Time
    this.scrubberWrap = this.overlay.querySelector('.player-scrubber-wrap');
    this.scrubberProgress = this.overlay.querySelector('.player-scrubber-progress');
    this.currentTimeEl = this.overlay.querySelector('#player-current-time');
    this.durationTimeEl = this.overlay.querySelector('#player-duration-time');

    // Download modal overlay inside player
    this.dlProgressOverlay = this.overlay.querySelector('.download-progress-overlay');
    this.dlProgressBar = this.overlay.querySelector('.download-progress-bar');
    this.dlProgressPercent = this.overlay.querySelector('.download-progress-percent');
    this.dlCancelBtn = this.overlay.querySelector('.download-cancel-btn');
  }

  _bindEvents() {
    // Back button
    this.backBtn.addEventListener('click', () => this.close());

    // Tap on video to toggle play/pause
    this.video.addEventListener('click', () => this.togglePlay());
    this.centerPlay.addEventListener('click', () => this.togglePlay());

    // Video events
    this.video.addEventListener('waiting', () => this.spinner.classList.add('loading'));
    this.video.addEventListener('playing', () => {
      this.spinner.classList.remove('loading');
      this.centerPlay.classList.remove('show');
    });
    this.video.addEventListener('pause', () => {
      this.centerPlay.classList.add('show');
    });
    this.video.addEventListener('timeupdate', () => this._onTimeUpdate());
    this.video.addEventListener('loadedmetadata', () => {
      this.durationTimeEl.textContent = this._formatTime(this.video.duration);
    });
    this.video.addEventListener('error', (e) => {
      this.spinner.classList.remove('loading');
      console.warn('Video playback error', e);
      this.showToast('Unable to stream video. Using offline preview.', '⚠️');
    });

    // Scrubber scrub/drag
    let isDragging = false;
    const seekToPosition = (e) => {
      const rect = this.scrubberWrap.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      if (this.video.duration) {
        this.video.currentTime = pos * this.video.duration;
      }
    };

    this.scrubberWrap.addEventListener('mousedown', (e) => {
      isDragging = true;
      seekToPosition(e);
    });
    window.addEventListener('mousemove', (e) => {
      if (isDragging) seekToPosition(e);
    });
    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events for mobile
    this.scrubberWrap.addEventListener('touchstart', (e) => {
      isDragging = true;
      seekToPosition(e);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (isDragging) seekToPosition(e);
    }, { passive: true });
    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Like Action
    this.likeBtn.addEventListener('click', () => {
      if (!this.currentReel) return;
      const isLiked = storage.toggleLike(this.currentReel.content_id);
      trackEngagement(this.currentReel.content_id, isLiked ? 'like' : 'unlike');
      this._updateLikeState(isLiked);
      this.showToast(isLiked ? 'Added to Liked Reels ❤️' : 'Removed from Liked', '❤️');
    });

    // Save Action
    this.saveBtn.addEventListener('click', () => {
      if (!this.currentReel) return;
      const isSaved = storage.toggleSave(this.currentReel.content_id);
      this._updateSaveState(isSaved);
      this.showToast(isSaved ? 'Reel saved to bookmarks 🔖' : 'Removed from saved', '🔖');
    });

    // WhatsApp Share
    this.shareBtn.addEventListener('click', async () => {
      if (!this.currentReel) return;
      trackEngagement(this.currentReel.content_id, 'share');
      await shareService.shareReel(this.currentReel);
    });

    // Download Action
    this.downloadBtn.addEventListener('click', () => {
      if (!this.currentReel) return;
      trackEngagement(this.currentReel.content_id, 'download');
      this._startDownload();
    });

    // Download Cancel
    this.dlCancelBtn.addEventListener('click', () => {
      if (this.currentReel) {
        downloader.cancelDownload(this.currentReel.content_id);
        this.dlProgressOverlay.classList.remove('show');
        this.showToast('Download canceled', 'ℹ️');
      }
    });

    // Mute Action
    this.muteBtn.addEventListener('click', () => {
      this.video.muted = !this.video.muted;
      this._updateMuteState(this.video.muted);
    });

    // Fullscreen Action
    this.fullscreenBtn.addEventListener('click', () => {
      this._toggleFullscreen();
    });

    // Pause when app moves to background
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && !this.video.paused) {
        this.video.pause();
      }
    });

    // Keyboard controls (Space for play/pause, Esc for back)
    window.addEventListener('keydown', (e) => {
      if (!this.overlay.classList.contains('active')) return;
      if (e.key === 'Escape') {
        this.close();
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        this.togglePlay();
      }
    });
  }

  // Open with exact reel
  async open(reel, options = {}) {
    this.currentReel = reel;
    this.isOffline = !!options.isOffline;
    this.offlineBlobUrl = options.offlineBlobUrl || null;

    // Update labels
    this.titleEl.textContent = reel.title;
    const catKey = `category_${reel.category_id.replace(/-/g, '_')}`;
    this.catEl.textContent = i18n.t(catKey, reel.category_id);

    // Update states
    this._updateLikeState(storage.isLiked(reel.content_id));
    this._updateSaveState(storage.isSaved(reel.content_id));
    this._updateMuteState(this.video.muted);

    // Offline badge or online indicator
    if (this.isOffline) {
      this.catEl.textContent = `⚡ OFFLINE • ${i18n.t(catKey, reel.category_id)}`;
    }

    // Set Video Source
    this.spinner.classList.add('loading');
    let videoSourceUrl = reel.video_url;

    if (this.isOffline && this.offlineBlobUrl) {
      videoSourceUrl = this.offlineBlobUrl;
    } else {
      // Check if this reel is already cached in IndexedDB!
      try {
        const isLocallyCached = await offlineDb.isDownloaded(reel.content_id);
        if (isLocallyCached) {
          videoSourceUrl = await offlineDb.getPlaybackUrl(reel.content_id);
          this.catEl.textContent = `💾 CACHED • ${this.catEl.textContent}`;
        }
      } catch (e) {
        console.warn('Error checking offlineDb for reel', e);
      }
    }

    this.video.src = videoSourceUrl;
    this.video.load();

    // Show overlay
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Play video
    try {
      await this.video.play();
      this.centerPlay.classList.remove('show');
    } catch (err) {
      console.log('Autoplay deferred until user interaction:', err);
      this.centerPlay.classList.add('show');
      this.spinner.classList.remove('loading');
    }
  }

  close() {
    this.video.pause();
    this.video.removeAttribute('src');
    this.video.load();
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
    this.dlProgressOverlay.classList.remove('show');
    this.currentReel = null;
    this.isOffline = false;
  }

  togglePlay() {
    if (this.video.paused) {
      this.video.play().then(() => {
        this.centerPlay.classList.remove('show');
      }).catch(e => console.warn(e));
    } else {
      this.video.pause();
      this.centerPlay.classList.add('show');
    }
  }

  _onTimeUpdate() {
    if (!this.video.duration) return;
    const progress = (this.video.currentTime / this.video.duration) * 100;
    this.scrubberProgress.style.width = `${progress}%`;
    this.currentTimeEl.textContent = this._formatTime(this.video.currentTime);
  }

  _formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  _updateLikeState(isLiked) {
    if (isLiked) {
      this.likeBtn.classList.add('liked');
      this.likeBtn.querySelector('svg').setAttribute('fill', 'currentColor');
    } else {
      this.likeBtn.classList.remove('liked');
      this.likeBtn.querySelector('svg').setAttribute('fill', 'none');
    }
  }

  _updateSaveState(isSaved) {
    if (isSaved) {
      this.saveBtn.classList.add('saved');
      this.saveBtn.querySelector('svg').setAttribute('fill', 'currentColor');
    } else {
      this.saveBtn.classList.remove('saved');
      this.saveBtn.querySelector('svg').setAttribute('fill', 'none');
    }
  }

  _updateMuteState(isMuted) {
    const icon = this.muteBtn.querySelector('svg');
    if (isMuted) {
      icon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      `;
    } else {
      icon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      `;
    }
  }

  _toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (this.stage.requestFullscreen) {
        this.stage.requestFullscreen();
      } else if (this.stage.webkitRequestFullscreen) {
        this.stage.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  _startDownload() {
    const reel = this.currentReel;
    if (!reel) return;

    this.dlProgressOverlay.classList.add('show');
    this.dlProgressBar.style.width = '0%';
    this.dlProgressPercent.textContent = '0%';

    downloader.downloadReel(
      reel,
      (percent) => {
        this.dlProgressBar.style.width = `${percent}%`;
        this.dlProgressPercent.textContent = `${percent}%`;
      },
      () => {
        setTimeout(() => {
          this.dlProgressOverlay.classList.remove('show');
          this.showToast(i18n.t('download_complete'), '✅');
        }, 500);
      },
      (error) => {
        this.dlProgressOverlay.classList.remove('show');
        if (!error.isCanceled) {
          this.showToast(error.message || i18n.t('download_error'), '❌');
        }
      }
    );
  }
}
