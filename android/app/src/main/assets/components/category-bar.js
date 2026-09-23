/* ==========================================================
   NATURE MOMENTS — CATEGORY BAR COMPONENT
   Horizontal scrollable pill container with 20 categories
   ========================================================== */

import { CATEGORIES, getCategoryTheme } from '../data/categories.js';
import { i18n } from '../services/i18n.js';

export class CategoryBar {
  constructor(containerElement, onSelectCallback) {
    this.container = containerElement;
    this.onSelect = onSelectCallback;
    this.activeCategoryId = 'trending';
    this.render();

    window.addEventListener('languageChanged', () => {
      this.render();
    });
  }

  getActiveCategory() {
    return this.activeCategoryId;
  }

  selectCategory(categoryId, triggerCallback = true) {
    this.activeCategoryId = categoryId;
    
    // Update pills styling
    const pills = this.container.querySelectorAll('.category-pill');
    pills.forEach(pill => {
      const id = pill.getAttribute('data-id');
      if (id === categoryId) {
        pill.classList.add('active');
        pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        pill.classList.remove('active');
      }
    });

    if (triggerCallback && typeof this.onSelect === 'function') {
      this.onSelect(categoryId);
    }
  }

  render() {
    this.container.innerHTML = '';
    
    CATEGORIES.forEach(category => {
      const theme = getCategoryTheme(category.id);
      const pill = document.createElement('button');
      pill.className = `category-pill ${category.id === this.activeCategoryId ? 'active' : ''}`;
      pill.setAttribute('data-id', category.id);
      pill.setAttribute('type', 'button');
      pill.setAttribute('id', `cat-btn-${category.id}`);
      pill.style.backgroundImage = `url("${category.image_url}")`;
      pill.style.setProperty('--cat-color', theme.color);
      pill.style.setProperty('--cat-border', theme.border);
      pill.style.setProperty('--cat-glow', theme.glow);

      // Translated category name
      const i18nKey = `category_${category.id.replace(/-/g, '_')}`;
      const localizedName = i18n.t(i18nKey, category.name);

      pill.innerHTML = `
        <span class="category-icon-wrap">${category.icon}</span>
        <span class="category-name">${localizedName}</span>
        <span class="category-indicator-dot"></span>
      `;

      pill.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectCategory(category.id, true);
      });

      this.container.appendChild(pill);
    });
  }
}
