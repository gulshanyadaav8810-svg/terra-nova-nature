/* ==========================================================
   NATURE MOMENTS — GLASSMORPHISM SIDE NAVIGATION DRAWER
   Smooth slide-out menu with 5 essential items:
   1. Language
   2. Feedback
   3. Rate App
   4. Share App
   5. Privacy Policy
   ========================================================== */

import { shareService } from '../services/share.js';
import { i18n, LANGUAGES } from '../services/i18n.js';

export class SideDrawer {
  constructor(backdropElement, callbacks = {}) {
    this.backdrop = backdropElement;
    this.callbacks = callbacks;
    this.isOpen = false;

    this._bindEvents();
    this.updateLabels();
    window.addEventListener('languageChanged', () => {
      this.updateLabels();
    });
  }

  _bindEvents() {
    // Backdrop click closes drawer
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) {
        this.close();
      }
    });

    // Close button
    const closeBtn = this.backdrop.querySelector('#drawer-btn-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Menu Item 1: Language
    const langBtn = this.backdrop.querySelector('#drawer-item-language');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        this.close();
        if (this.callbacks.onOpenLanguage) this.callbacks.onOpenLanguage();
      });
    }

    // Menu Item 2: Feedback
    const fbBtn = this.backdrop.querySelector('#drawer-item-feedback');
    if (fbBtn) {
      fbBtn.addEventListener('click', () => {
        this.close();
        if (this.callbacks.onOpenFeedback) this.callbacks.onOpenFeedback();
      });
    }

    // Menu Item 3: Rate App
    const rateBtn = this.backdrop.querySelector('#drawer-item-rate');
    if (rateBtn) {
      rateBtn.addEventListener('click', () => {
        this.close();
        if (this.callbacks.onOpenRate) this.callbacks.onOpenRate();
      });
    }

    // Menu Item 4: Share App
    const shareBtn = this.backdrop.querySelector('#drawer-item-share');
    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        this.close();
        await shareService.shareApp();
      });
    }

    // Menu Item 5: Privacy Policy
    const privacyBtn = this.backdrop.querySelector('#drawer-item-privacy');
    if (privacyBtn) {
      privacyBtn.addEventListener('click', () => {
        this.close();
        if (this.callbacks.onOpenPrivacy) this.callbacks.onOpenPrivacy();
      });
    }
  }

  open() {
    this.isOpen = true;
    this.backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    this.backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  updateLabels() {
    const langLabel = this.backdrop.querySelector('#drawer-label-language');
    const fbLabel = this.backdrop.querySelector('#drawer-label-feedback');
    const rateLabel = this.backdrop.querySelector('#drawer-label-rate');
    const shareLabel = this.backdrop.querySelector('#drawer-label-share');
    const privLabel = this.backdrop.querySelector('#drawer-label-privacy');
    const langBadge = this.backdrop.querySelector('#drawer-lang-code');

    if (langLabel) langLabel.textContent = i18n.t('drawer_language');
    if (fbLabel) fbLabel.textContent = i18n.t('drawer_feedback');
    if (rateLabel) rateLabel.textContent = i18n.t('drawer_rate');
    if (shareLabel) shareLabel.textContent = i18n.t('drawer_share');
    if (privLabel) privLabel.textContent = i18n.t('drawer_privacy');
    if (langBadge) {
      const code = i18n.getLanguage ? i18n.getLanguage() : 'en';
      const langObj = LANGUAGES.find(l => l.code === code);
      langBadge.textContent = langObj ? langObj.name : code.toUpperCase();
    }
  }
}
