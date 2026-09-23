/* ==========================================================
   NATURE MOMENTS — MODALS COMPONENT
   Language Selection, Feedback, Rate App & Privacy Policy
   ========================================================== */

import { LANGUAGES, i18n } from '../services/i18n.js';
import { storage } from '../services/storage.js';

export class ModalsManager {
  constructor(showToastCallback) {
    this.showToast = showToastCallback || console.log;
    this.selectedLangTemp = i18n.getLanguage();
    this._initModals();
  }

  _initModals() {
    this.langModal = document.getElementById('modal-language');
    this.feedbackModal = document.getElementById('modal-feedback');
    this.rateModal = document.getElementById('modal-rate');
    this.privacyModal = document.getElementById('modal-privacy');

    this._bindLanguageModal();
    this._bindFeedbackModal();
    this._bindRateModal();
    this._bindPrivacyModal();
  }

  // --- 1. LANGUAGE SELECTION MODAL ---
  _bindLanguageModal() {
    if (!this.langModal) return;

    const closeBtn = this.langModal.querySelector('#lang-btn-back');
    const doneBtn = this.langModal.querySelector('#lang-btn-done');
    const listContainer = this.langModal.querySelector('#lang-options-list');

    const renderList = () => {
      listContainer.innerHTML = '';
      const currentCode = this.selectedLangTemp;

      LANGUAGES.forEach(lang => {
        const card = document.createElement('div');
        const isSelected = lang.code === currentCode;
        card.className = `lang-card ${isSelected ? 'active' : ''}`;
        card.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          margin-bottom: 10px;
          border-radius: var(--radius-md);
          background: ${isSelected ? 'var(--color-dark-green)' : 'var(--color-white)'};
          color: ${isSelected ? '#FFFFFF' : 'var(--color-text-dark)'};
          border: 1.5px solid ${isSelected ? 'var(--color-dark-green)' : 'var(--color-light-gray)'};
          cursor: pointer;
          transition: all var(--trans-fast);
          box-shadow: var(--shadow-sm);
        `;

        card.innerHTML = `
          <div>
            <div style="font-size: 1.05rem; font-weight: 700;">${lang.nativeName}</div>
            <div style="font-size: 0.78rem; opacity: 0.75;">${lang.name}</div>
          </div>
          <div style="width: 24px; height: 24px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; background: ${isSelected ? 'var(--color-soft-yellow)' : 'transparent'}; color: var(--color-dark-green);">
            ${isSelected ? `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ` : ''}
          </div>
        `;

        card.addEventListener('click', () => {
          this.selectedLangTemp = lang.code;
          renderList();
        });

        listContainer.appendChild(card);
      });
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.langModal.classList.remove('open');
      });
    }

    if (doneBtn) {
      doneBtn.addEventListener('click', () => {
        i18n.setLanguage(this.selectedLangTemp);
        this.langModal.classList.remove('open');
        this.showToast('Language updated successfully!', '🌐');
      });
    }

    // Modal background click
    this.langModal.addEventListener('click', (e) => {
      if (e.target === this.langModal) this.langModal.classList.remove('open');
    });

    this._renderLangList = renderList;
  }

  openLanguage() {
    this.selectedLangTemp = i18n.getLanguage();
    if (this._renderLangList) this._renderLangList();
    this.langModal.classList.add('open');
  }

  // --- 2. FEEDBACK MODAL ---
  _bindFeedbackModal() {
    if (!this.feedbackModal) return;

    const closeBtn = this.feedbackModal.querySelector('#feedback-btn-close');
    const submitBtn = this.feedbackModal.querySelector('#feedback-btn-submit');
    const textarea = this.feedbackModal.querySelector('#feedback-textarea');
    const stars = this.feedbackModal.querySelectorAll('.feedback-star');

    let currentRating = 5;

    stars.forEach(star => {
      star.addEventListener('click', () => {
        currentRating = parseInt(star.getAttribute('data-value'), 10);
        stars.forEach(s => {
          const val = parseInt(s.getAttribute('data-value'), 10);
          if (val <= currentRating) {
            s.style.color = 'var(--color-gold)';
            s.style.fill = 'var(--color-gold)';
          } else {
            s.style.color = '#ccc';
            s.style.fill = 'none';
          }
        });
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.feedbackModal.classList.remove('open'));
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const text = textarea ? textarea.value.trim() : '';
        storage.saveFeedback({
          rating: currentRating,
          comment: text
        });

        if (textarea) textarea.value = '';
        this.feedbackModal.classList.remove('open');
        this.showToast(i18n.t('feedback_thanks'), '🌿');
      });
    }

    this.feedbackModal.addEventListener('click', (e) => {
      if (e.target === this.feedbackModal) this.feedbackModal.classList.remove('open');
    });
  }

  openFeedback() {
    this.feedbackModal.classList.add('open');
  }

  // --- 3. RATE APP MODAL ---
  _bindRateModal() {
    if (!this.rateModal) return;

    const closeBtn = this.rateModal.querySelector('#rate-btn-close');
    const playStoreBtn = this.rateModal.querySelector('#rate-btn-playstore');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.rateModal.classList.remove('open'));
    }

    if (playStoreBtn) {
      playStoreBtn.addEventListener('click', () => {
        // Direct Play Store URL or intent
        const playUrl = 'market://details?id=com.naturemoments.app';
        const webUrl = 'https://play.google.com/store/apps/details?id=com.naturemoments.app';
        try {
          window.open(playUrl, '_blank');
        } catch (e) {
          window.open(webUrl, '_blank');
        }
        this.rateModal.classList.remove('open');
        this.showToast('Thank you for rating Nature Moments!', '⭐');
      });
    }

    this.rateModal.addEventListener('click', (e) => {
      if (e.target === this.rateModal) this.rateModal.classList.remove('open');
    });
  }

  openRate() {
    this.rateModal.classList.add('open');
  }

  // --- 4. PRIVACY POLICY MODAL ---
  _bindPrivacyModal() {
    if (!this.privacyModal) return;

    const closeBtn = this.privacyModal.querySelector('#privacy-btn-close');
    const okBtn = this.privacyModal.querySelector('#privacy-btn-ok');

    if (closeBtn) closeBtn.addEventListener('click', () => this.privacyModal.classList.remove('open'));
    if (okBtn) okBtn.addEventListener('click', () => this.privacyModal.classList.remove('open'));

    this.privacyModal.addEventListener('click', (e) => {
      if (e.target === this.privacyModal) this.privacyModal.classList.remove('open');
    });
  }

  openPrivacy() {
    this.privacyModal.classList.add('open');
  }
}
