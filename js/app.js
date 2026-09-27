/* ==========================================================
   NATURE MOMENTS — MASTER APPLICATION CONTROLLER
   Pure Instagram Reels format (9:16) with 100+ nature reels,
   Web Audio ambient sound engine, and seamless navigation
   ========================================================== */

import { i18n } from './services/i18n.js';
import { getReelsByCategory, getReelById, syncRemoteReels } from './data/reels.js';
import { CATEGORIES, getAllCategories, getCategoryById, getCategoryTheme } from './data/categories.js';
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

    this._initToast();
    this._initSplashScreen();
    this._initDomReferences();
    this._initComponents();
    this._initHomeCategories();
    this._bindNavigation();
    this._initPwaAndInstall();
    this._checkUrlParameters();

    // Initialize Home view & enable banner ad display
    this.switchView('home');
    if (window.AndroidBridge && typeof window.AndroidBridge.setBannerVisibility === 'function') {
      window.AndroidBridge.setBannerVisibility(true);
    }

    // Ensure 100% strict silence on app boot
    window.pauseAllMedia();

    // Initial background sync and periodic sync every 30s
    try { syncRemoteReels().catch(() => {}); } catch(e) {}
    setInterval(() => {
      if (typeof document !== 'undefined' && !document.hidden) {
        try { syncRemoteReels().catch(() => {}); } catch(e) {}
      }
    }, 30000);
  }

  _initToast() {
    this.toastContainer = document.getElementById('toast-container');
    this.toastTimer = null;
  }

  _initSplashScreen() {
    const splash = document.getElementById('app-splash-screen');
    if (!splash) return;

    // Inside Android APK, the native SplashOverlay is already displayed seamlessly.
    // Immediately remove HTML splash to eliminate any double-splash or flicker!
    if (window.AndroidBridge) {
      splash.style.display = 'none';
      if (typeof splash.remove === 'function') splash.remove();
      return;
    }

    let dismissed = false;
    const dismissSplash = () => {
      if (dismissed) return;
      dismissed = true;
      splash.classList.add('splash-dismissed');
      setTimeout(() => {
        splash.style.display = 'none';
        if (typeof splash.remove === 'function') splash.remove();
      }, 700);
    };

    // Auto dismiss after 1.8s for web browser
    setTimeout(dismissSplash, 1800);

    // Also dismiss immediately if tapped
    splash.addEventListener('click', dismissSplash, { once: true });
    splash.addEventListener('touchstart', dismissSplash, { passive: true, once: true });
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
      onOpenPrivacy: () => {
        const url = 'https://nature-moments-app.vercel.app/privacy-policy';
        if (window.AndroidBridge && typeof window.AndroidBridge.openPrivacyPolicy === 'function') {
          window.AndroidBridge.openPrivacyPolicy();
        } else {
          try {
            window.open(url, '_blank', 'noopener,noreferrer');
          } catch (e) {
            window.location.href = url;
          }
        }
      }
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
      if (this._isInternalCategorySync) return;
      this.selectCategory(categoryId);
    };

    // 6. Save Screen (Saved, Liked & Downloaded tabs)
    const saveScreenContainer = document.getElementById('save-screen-container');
    this.saveScreen = new SaveScreen(saveScreenContainer, (reel, opts) => {
      this.openReelInFeed(reel);
    }, (msg, icon) => this.showToast(msg, icon));

    // 7. Dynamic live sync listener from Admin Panel
    window.addEventListener('reelsUpdated', () => {
      this._initHomeCategories();
      if (this.currentView === 'home' && this.homeGrid) {
        const reels = getReelsByCategory(this.currentCategory);
        this.homeGrid.setReels(reels, this.currentCategory);
        this._homeNeedsUpdate = false;
      } else {
        this._homeNeedsUpdate = true;
      }
      if (this.reelsFeed) {
        if (typeof this.reelsFeed.onRemoteUpdate === 'function') {
          this.reelsFeed.onRemoteUpdate();
        } else {
          this.reelsFeed.refresh();
        }
      }
    });

    // Run initial localization
    i18n.updateDom();
  }

  _initHomeCategories() {
    const scroller = document.getElementById('home-category-scroller');
    if (!scroller) return;

    scroller.innerHTML = '';
    const categoriesList = typeof getAllCategories === 'function' ? getAllCategories() : CATEGORIES;
    categoriesList.forEach(cat => {
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
        <span class="home-cat-icon">${cat.icon || '🌿'}</span>
        <img src="${cat.image_url}" alt="${cat.name}" loading="lazy" onerror="this.style.display='none'" />
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
    if (!categoryId) return;
    if (this.currentCategory === categoryId && this._hasRenderedGrid) return;
    this._hasRenderedGrid = true;
    this.currentCategory = categoryId;

    // 1. Instant Active Highlight on Home Chips (0ms immediate touch response)
    const chips = document.querySelectorAll('.home-cat-chip');
    chips.forEach(c => {
      if (c.getAttribute('data-id') === categoryId) {
        c.classList.add('active');
        const scroller = c.parentElement;
        if (scroller) {
          scroller.scrollLeft = c.offsetLeft - (scroller.clientWidth / 2) + (c.offsetWidth / 2);
        }
      } else {
        c.classList.remove('active');
      }
    });

    // 2. Dynamically update section heading and icon
    const cat = getCategoryById(categoryId);
    const headingEl = document.getElementById('home-category-heading');
    const iconEl = document.getElementById('home-section-icon');
    if (headingEl && cat) {
      headingEl.textContent = `${cat.name} Status`;
    }
    if (iconEl && cat) {
      iconEl.textContent = cat.icon || '✨';
    }

    // 3. Fast update Home grid ONLY if Home view is currently active!
    if (this.homeGrid) {
      if (this.currentView === 'home') {
        const reels = getReelsByCategory(categoryId);
        this.homeGrid.setReels(reels, categoryId);
        this._homeNeedsUpdate = false;
      } else {
        this._homeNeedsUpdate = true;
      }
    }

    // 4. Sync ReelsFeed category without recursive circular callback
    if (this.reelsFeed && this.reelsFeed.activeCategory !== categoryId) {
      this._isInternalCategorySync = true;
      this.reelsFeed.filterCategory(categoryId);
      this._isInternalCategorySync = false;
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

    // Control Native AdMob Banner Ad visibility
    if (window.AndroidBridge && typeof window.AndroidBridge.setBannerVisibility === 'function') {
      window.AndroidBridge.setBannerVisibility(viewName === 'home' || viewName === 'save');
    }

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
      if (this._homeNeedsUpdate && this.homeGrid) {
        this._homeNeedsUpdate = false;
        const reels = getReelsByCategory(this.currentCategory);
        this.homeGrid.setReels(reels, this.currentCategory);
      }
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
      if (this.reelsFeed && this.reelsFeed._needsRender) {
        this.reelsFeed._needsRender = false;
        this.reelsFeed.render();
      }
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

  _initPwaAndInstall() {
    // 1. Register Service Worker for PWA (Progressive Web App)
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then((reg) => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        }).catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
      });
    }

    // 2. Adjust Drawer "Download App" element
    const dlItem = document.getElementById('drawer-item-download-apk');
    if (!dlItem) return;

    const isInsideNativeApp = !!(window.AndroidBridge && typeof window.AndroidBridge === 'object');
    const isStandalonePWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

    if (isInsideNativeApp) {
      // Running inside Android APK: User already has native app!
      dlItem.removeAttribute('href');
      dlItem.removeAttribute('download');
      dlItem.style.cursor = 'pointer';
      dlItem.innerHTML = `
        <div class="drawer-icon-box" style="background: rgba(16, 185, 129, 0.15); color: #10B981;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div class="drawer-text-col">
          <span class="drawer-item-title" style="color: #10B981; font-weight: 700;">App is Up to Date</span>
          <span class="drawer-item-sub">Live auto-updating active • No download needed</span>
        </div>
        <div class="drawer-right-meta">
          <span class="drawer-badge" style="background: #10B981; color: #011811; font-weight: 700;">Active</span>
        </div>
      `;
      dlItem.addEventListener('click', (e) => {
        e.preventDefault();
        this.showToast('App is connected & auto-updates live! No APK download needed.', '✅');
      });
      return;
    }

    if (isStandalonePWA) {
      // Running as installed PWA from Home Screen
      dlItem.removeAttribute('href');
      dlItem.removeAttribute('download');
      dlItem.style.cursor = 'pointer';
      dlItem.innerHTML = `
        <div class="drawer-icon-box" style="background: rgba(16, 185, 129, 0.15); color: #10B981;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div class="drawer-text-col">
          <span class="drawer-item-title" style="color: #10B981; font-weight: 700;">Installed Web App</span>
          <span class="drawer-item-sub">Zero download auto-updating enabled</span>
        </div>
        <div class="drawer-right-meta">
          <span class="drawer-badge" style="background: #10B981; color: #011811; font-weight: 700;">PWA</span>
        </div>
      `;
      dlItem.addEventListener('click', (e) => {
        e.preventDefault();
        this.showToast('You are using the installed app! It updates automatically.', '✨');
      });
      return;
    }

    // Running in standard mobile/desktop web browser:
    // Offer 1-Tap "Add to Home Screen / Install App" so user never needs to download an APK file!
    let deferredPrompt = null;

    const setupInstallButton = (canPrompt) => {
      dlItem.removeAttribute('href');
      dlItem.removeAttribute('download');
      dlItem.style.cursor = 'pointer';
      dlItem.innerHTML = `
        <div class="drawer-icon-box" style="background: rgba(0,255,224,0.15); color: #00FFE0;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
        </div>
        <div class="drawer-text-col">
          <span class="drawer-item-title" style="color: #00FFE0; font-weight: 700;">Install App to Phone</span>
          <span class="drawer-item-sub">Add to Home Screen (No APK download needed)</span>
        </div>
        <div class="drawer-right-meta">
          <span class="drawer-badge" style="background: #00FFE0; color: #011811; font-weight: 700;">1-Tap</span>
        </div>
      `;
    };

    setupInstallButton(false);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setupInstallButton(true);

      // Show floating bottom banner on mobile web if not dismissed previously
      if (!sessionStorage.getItem('nature_pwa_banner_dismissed')) {
        this._showPwaInstallBanner(() => {
          if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choice) => {
              if (choice.outcome === 'accepted') {
                this.showToast('Adding Nature Moments to your Home Screen...', '📲');
              }
              deferredPrompt = null;
            });
          }
        });
      }
    });

    dlItem.addEventListener('click', async (e) => {
      e.preventDefault();
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          this.showToast('Nature Moments installed to Home Screen!', '📲');
        }
        deferredPrompt = null;
      } else {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOS) {
          alert('To install without downloading:\n1. Tap the Share button at the bottom of Safari.\n2. Tap "Add to Home Screen" 📲');
        } else {
          alert('To install without downloading APK:\n1. Tap the 3 dots menu (⋮) in your browser.\n2. Tap "Install App" or "Add to Home Screen" 📲\n\nThe app icon will appear on your phone automatically!');
        }
      }
    });
  }

  _showPwaInstallBanner(onInstall) {
    if (document.getElementById('pwa-install-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.style.cssText = `
      position: fixed;
      bottom: 74px;
      left: 14px;
      right: 14px;
      background: linear-gradient(135deg, rgba(8, 20, 28, 0.96), rgba(12, 34, 44, 0.98));
      border: 1px solid rgba(0, 255, 224, 0.35);
      border-radius: 16px;
      padding: 12px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      z-index: 9999;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 255, 224, 0.15);
      backdrop-filter: blur(12px);
    `;
    banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
        <img src="assets/icon-192.png" style="width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;" />
        <div style="min-width: 0;">
          <div style="font-size: 13px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Install Nature Moments</div>
          <div style="font-size: 11px; color: rgba(255, 255, 255, 0.7); line-height: 1.2;">Use as app without downloading APK</div>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
        <button id="pwa-install-action-btn" style="background: #00FFE0; color: #011811; border: none; border-radius: 20px; padding: 7px 14px; font-size: 12px; font-weight: 800; cursor: pointer;">Install</button>
        <button id="pwa-install-close-btn" style="background: transparent; color: rgba(255,255,255,0.6); border: none; font-size: 16px; padding: 4px 6px; cursor: pointer;">✕</button>
      </div>
    `;

    document.body.appendChild(banner);

    const actionBtn = banner.querySelector('#pwa-install-action-btn');
    const closeBtn = banner.querySelector('#pwa-install-close-btn');

    actionBtn.addEventListener('click', () => {
      banner.remove();
      if (onInstall) onInstall();
    });

    closeBtn.addEventListener('click', () => {
      sessionStorage.setItem('nature_pwa_banner_dismissed', '1');
      banner.remove();
    });
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
