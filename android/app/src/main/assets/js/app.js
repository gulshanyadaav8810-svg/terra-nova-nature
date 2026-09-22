/* ==========================================================
   NATURE MOMENTS — MASTER APPLICATION CONTROLLER
   Pure Instagram Reels format (9:16) with 100+ nature reels,
   Web Audio ambient sound engine, and seamless navigation
   ========================================================== */

import { i18n } from './services/i18n.js';
import { getReelsByCategory, getReelById } from './data/reels.js';
import { CATEGORIES, getCategoryById, getCategoryTheme } from './data/categories.js';
import { VideoPlayer } from './components/video-player.js';
import { ReelsFeed } from './components/reels-feed.js';
import { ReelsGrid } from './components/reels-grid.js';
import { SaveScreen } from './components/save-screen.js';
import { SideDrawer } from './components/side-drawer.js';
import { ModalsManager } from './components/modals.js';
import { soundEngine } from './services/sound-engine.js';

class NatureMomentsApp {
  constructor() {
    this.currentView = 'home'; // Default to Home view with top categories & trending cards
    this.currentCategory = 'trending';
    window.natureAppInstance = this;

    window.pauseAllMedia = () => {
      document.querySelectorAll('video').forEach(v => {
        try {
          v.pause();
          v.muted = true;
        } catch(e) {}
      });
      if (this.reelsFeed) {
        try { this.reelsFeed.pauseAll(); } catch(e) {}
      }
      if (this.player && this.player.video) {
        try {
          this.player.video.pause();
          this.player.video.muted = true;
        } catch(e) {}
      }
      try { soundEngine.stop(); } catch(e) {}
    };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        window.pauseAllMedia();
      }
    });
    window.addEventListener('pagehide', () => window.pauseAllMedia());
    window.addEventListener('blur', () => window.pauseAllMedia());

    this._initToast();
    this._initSplashScreen();
    this._initDomReferences();
    this._initComponents();
    this._initHomeCategories();
    this._bindNavigation();
    this._checkUrlParameters();

    // Ensure 100% strict silence on app boot
    window.pauseAllMedia();

  }

  _initToast() {
    this.toastContainer = document.getElementById('toast-container');
    this.toastTimer = null;
  }

  _initSplashScreen() {
    const splash = document.getElementById('app-splash-screen');
    if (!splash) return;

    const dismiss = () => {
      if (splash.classList.contains('splash-dismissed')) return;
      splash.classList.add('splash-dismissed');
      setTimeout(() => {
        splash.style.display = 'none';
      }, 500);
    };

    // Fast-tap skip
    splash.addEventListener('click', dismiss);

    // 2.6s cinematic intro duration matching user specification
    setTimeout(dismiss, 2600);
  }

  showToast(message, icon = '✨') {
    if (!this.toastContainer) return;
    
    this.toastContainer.innerHTML = '';
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span>${message}</span>
    `;

    this.toastContainer.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  _initDomReferences() {
    this.homeView = document.getElementById('view-home');
    this.reelsView = document.getElementById('view-reels');
    this.saveView = document.getElementById('view-save');

    this.navBtnBack = document.getElementById('nav-item-back');
    this.navBtnHome = document.getElementById('nav-item-home');
    this.navBtnReels = document.getElementById('nav-item-reels');
    this.navBtnSave = document.getElementById('nav-item-save');

    this.btnHamburger = document.getElementById('btn-hamburger');
    this.btnHomeHamburger = document.getElementById('btn-home-hamburger');
    this.btnHomeSound = document.getElementById('btn-home-sound');
  }

  _initComponents() {
    // 1. Modals (Language, Feedback, Rate, Privacy)
    this.modals = new ModalsManager((msg, icon) => this.showToast(msg, icon));

    // 2. Glassmorphism Side Drawer
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    this.sideDrawer = new SideDrawer(drawerBackdrop, {
      onOpenLanguage: () => this.modals.openLanguage(),
      onOpenFeedback: () => this.modals.openFeedback(),
      onOpenRate: () => this.modals.openRate(),
      onOpenPrivacy: () => this.modals.openPrivacy()
    });

    if (this.btnHamburger) {
      this.btnHamburger.addEventListener('click', () => this.sideDrawer.open());
    }
    if (this.btnHomeHamburger) {
      this.btnHomeHamburger.addEventListener('click', () => this.sideDrawer.open());
    }
    const btnReelsBack = document.getElementById('btn-reels-back');
    if (btnReelsBack) {
      btnReelsBack.addEventListener('click', () => {
        this.switchView('home');
      });
    }

    // 3. Dedicated Video Player Overlay (Plays full video with sound on card click)
    const playerOverlay = document.getElementById('video-player-overlay');
    this.player = new VideoPlayer(playerOverlay, (msg, icon) => this.showToast(msg, icon));

    // 4. Home View Reels Grid Component (Click card -> Opens directly in continuous 9:16 scrollable Reels Feed!)
    const homeGridContainer = document.getElementById('home-reels-grid-container');
    if (homeGridContainer) {
      this.homeGrid = new ReelsGrid(homeGridContainer, (reel) => {
        // When card is clicked on Home -> Open seamlessly in continuous 9:16 Reels Feed!
        this.openReelInFeed(reel);
      });
      this.homeGrid.setReels(getReelsByCategory('trending'), 'trending');
    }

    // 5. Full-Screen 9:16 Instagram Reels Feed (Reel Tab with snap scroll & play/pause)
    const reelsFeedContainer = document.getElementById('reels-feed-container');
    this.reelsFeed = new ReelsFeed(reelsFeedContainer, (msg, icon) => this.showToast(msg, icon));

    // Link category change to update Home grid as well
    this.reelsFeed.onCategoryChange = (categoryId) => {
      this.currentCategory = categoryId;
      if (this.homeGrid) {
        const reels = getReelsByCategory(categoryId);
        this.homeGrid.setReels(reels, categoryId);
      }
      // Update home chips highlight
      const chips = document.querySelectorAll('.home-cat-chip');
      chips.forEach(c => {
        if (c.getAttribute('data-id') === categoryId) {
          c.classList.add('active');
        } else {
          c.classList.remove('active');
        }
      });
    };

    // 6. Save Screen (Saved, Liked & Downloaded tabs)
    const saveScreenContainer = document.getElementById('save-screen-container');
    this.saveScreen = new SaveScreen(saveScreenContainer, (reel, opts) => {
      this.openReelInFeed(reel);
    }, (msg, icon) => this.showToast(msg, icon));

    // 7. Dynamic live sync listener from Admin Panel
    window.addEventListener('reelsUpdated', () => {
      this._initHomeCategories();
      if (this.homeGrid) {
        const reels = getReelsByCategory(this.currentCategory);
        this.homeGrid.setReels(reels, this.currentCategory);
      }
      if (this.reelsFeed) {
        this.reelsFeed.refresh();
      }
    });

    // Run initial localization
    i18n.updateDom();
  }

  _initHomeCategories() {
    const scroller = document.getElementById('home-category-scroller');
    if (!scroller) return;

    scroller.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const theme = getCategoryTheme(cat.id);
      const chip = document.createElement('button');
      chip.className = `home-cat-chip ${cat.id === this.currentCategory ? 'active' : ''}`;
      chip.setAttribute('data-id', cat.id);
      chip.setAttribute('id', `home-cat-${cat.id}`);
      chip.setAttribute('type', 'button');
      chip.setAttribute('aria-label', `Category ${cat.name}`);
      chip.style.backgroundImage = `url("${cat.image_url}")`;
      chip.style.setProperty('--cat-color', theme.color);
      chip.style.setProperty('--cat-border', theme.border);
      chip.style.setProperty('--cat-glow', theme.glow);
      chip.innerHTML = `
        <img src="${cat.image_url}" alt="${cat.name}" loading="lazy" />
        <span>${cat.name}</span>
      `;

      chip.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectCategory(cat.id);
      });

      scroller.appendChild(chip);
    });
  }

  selectCategory(categoryId) {
    this.currentCategory = categoryId;

    // Update active class on home chips
    const chips = document.querySelectorAll('.home-cat-chip');
    chips.forEach(c => {
      if (c.getAttribute('data-id') === categoryId) {
        c.classList.add('active');
        c.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        c.classList.remove('active');
      }
    });

    // Dynamically update section heading and icon
    const cat = getCategoryById(categoryId);
    const headingEl = document.getElementById('home-category-heading');
    const iconEl = document.getElementById('home-section-icon');
    if (headingEl && cat) {
      headingEl.textContent = `${cat.name} Status`;
    }
    if (iconEl && cat) {
      iconEl.textContent = cat.icon || '✨';
    }

    // Update Home grid
    if (this.homeGrid) {
      const reels = getReelsByCategory(categoryId);
      this.homeGrid.setReels(reels, categoryId);
    }

    // Sync reels feed category as well
    if (this.reelsFeed && this.reelsFeed.activeCategory !== categoryId) {
      this.reelsFeed.filterCategory(categoryId);
    }
  }

  _bindNavigation() {
    if (this.navBtnBack) {
      this.navBtnBack.addEventListener('click', () => {
        if (typeof window.handleAndroidBack === 'function') {
          window.handleAndroidBack();
        } else if (this.currentView === 'reels' || this.currentView === 'save') {
          this.switchView('home');
        } else if (this.sideDrawer && this.sideDrawer.isOpen) {
          this.sideDrawer.close();
        } else {
          this.switchView('home');
        }
      });
    }
    if (this.navBtnHome) {
      this.navBtnHome.addEventListener('click', () => this.switchView('home'));
    }
    if (this.navBtnReels) {
      this.navBtnReels.addEventListener('click', () => this.switchView('reels'));
    }
    if (this.navBtnSave) {
      this.navBtnSave.addEventListener('click', () => this.switchView('save'));
    }

    window.addEventListener('popstate', () => {
      if (this.player && this.player.overlay.classList.contains('active')) {
        this.player.close();
      } else if (this.sideDrawer && this.sideDrawer.isOpen) {
        this.sideDrawer.close();
      } else if (this.currentView === 'save') {
        this.switchView('home');
      }
    });

    // Comprehensive Android System Back Button handler (Instant direct exit, no annoying popup)
    window.handleAndroidBack = () => {
      // 0. If splash screen is still visible, dismiss it immediately
      const splash = document.getElementById('app-splash-screen');
      if (splash && !splash.classList.contains('splash-dismissed') && splash.style.display !== 'none') {
        splash.classList.add('splash-dismissed');
        setTimeout(() => { splash.style.display = 'none'; }, 500);
        return true;
      }

      // 1. If fullscreen video player overlay is active, close it
      if (this.player && this.player.overlay && (this.player.overlay.classList.contains('active') || this.player.overlay.style.display === 'flex')) {
        this.player.close();
        return true;
      }

      // 2. If side drawer is open, close it
      if (this.sideDrawer && this.sideDrawer.isOpen) {
        this.sideDrawer.close();
        return true;
      }

      // 3. If any modal is open (Rate, Language, Feedback, Privacy), close it
      const openModals = document.querySelectorAll('.modal-overlay.open, .modal-overlay[style*="display: flex"]');
      let modalClosed = false;
      openModals.forEach(m => {
        m.classList.remove('open');
        m.style.display = 'none';
        modalClosed = true;
      });
      if (modalClosed) {
        return true;
      }

      // 4. If user is in reels or save view, navigate back to home view smoothly
      if (this.currentView === 'save' || this.currentView === 'reels') {
        this.switchView('home');
        return true;
      }

      // 5. User is on Home screen: Exit app directly with zero annoying confirmation popup
      if (window.AndroidBridge && typeof window.AndroidBridge.exitApp === 'function') {
        window.AndroidBridge.exitApp();
        return true;
      }

      return false;
    };

    window.showExitConfirm = window.handleAndroidBack;
  }

  switchView(viewName, skipResume = false) {
    this.currentView = viewName;

    const bottomNav = document.getElementById('bottom-nav-bar');

    // Reset bottom nav active classes
    [this.navBtnBack, this.navBtnHome, this.navBtnReels, this.navBtnSave].forEach(btn => {
      if (btn) {
        btn.classList.remove('active');
        btn.classList.remove('highlight-back');
        btn.style.color = '';
      }
    });

    const floatingHeader = document.getElementById('reels-floating-header');

    if (viewName === 'home') {
      if (bottomNav) {
        bottomNav.classList.remove('bottom-nav-dark');
        bottomNav.classList.add('bottom-nav-light');
      }
      if (this.navBtnHome) {
        this.navBtnHome.classList.add('active');
      }
      if (this.homeView) this.homeView.style.display = 'block';
      if (this.reelsView) this.reelsView.style.display = 'none';
      if (this.saveView) this.saveView.style.display = 'none';
      if (floatingHeader) floatingHeader.style.display = 'none';
      if (this.reelsFeed) this.reelsFeed.pauseAll();
      if (this.player && this.player.video) this.player.video.pause();
      if (window.pauseAllMedia) window.pauseAllMedia();
    } else if (viewName === 'reels') {
      if (bottomNav) {
        bottomNav.classList.remove('bottom-nav-dark');
        bottomNav.classList.add('bottom-nav-light');
      }
      if (this.navBtnReels) {
        this.navBtnReels.classList.add('active');
      }
      if (this.navBtnBack) {
        this.navBtnBack.classList.add('highlight-back');
      }
      if (this.homeView) this.homeView.style.display = 'none';
      if (this.reelsView) this.reelsView.style.display = 'block';
      if (this.saveView) this.saveView.style.display = 'none';
      if (floatingHeader) floatingHeader.style.display = 'block';
      if (this.reelsFeed && !skipResume) {
        this.reelsFeed.resumeActive();
      }
    } else if (viewName === 'save') {
      if (bottomNav) {
        bottomNav.classList.remove('bottom-nav-dark');
        bottomNav.classList.add('bottom-nav-light');
      }
      if (this.navBtnSave) {
        this.navBtnSave.classList.add('active');
      }
      if (this.homeView) this.homeView.style.display = 'none';
      if (this.reelsView) this.reelsView.style.display = 'none';
      if (this.saveView) this.saveView.style.display = 'block';
      if (floatingHeader) floatingHeader.style.display = 'none';
      if (this.reelsFeed) this.reelsFeed.pauseAll();
      if (this.player && this.player.video) this.player.video.pause();
      if (window.pauseAllMedia) window.pauseAllMedia();
      this.saveScreen.render();
    }
  }

  // Opens reel directly in full-screen snap-scrolling Reels Feed so user can continuously scroll
  openReelInFeed(reel) {
    if (!reel || !reel.content_id) return;
    this.switchView('reels', true);
    if (this.reelsFeed) {
      this.reelsFeed.scrollToReel(reel.content_id, this.currentCategory);
    }
  }

  _checkUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    const reelId = params.get('reel');
    if (reelId) {
      const targetReel = getReelById(reelId);
      if (targetReel) {
        setTimeout(() => this.openReelInFeed(targetReel), 300);
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new NatureMomentsApp();
});
