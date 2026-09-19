/* ==========================================================
   NATURE MOMENTS — ADMIN STUDIO MASTER CONTROLLER
   Full Category Management (20+), Real-time Reel Uploads,
   Live 9:16 Phone Simulator, BroadcastChannel & GitHub Commit
   ========================================================== */

import { getAllCategories, addCustomCategory, getCategoryById } from './data/categories.js';
import { loadAllReels, addCustomReel, deleteCustomReel, REELS_DATA } from './data/reels.js';

class AdminStudio {
  constructor() {
    this.currentTab = 'tab-dashboard';
    this.reels = [];
    this.categories = [];
    this.videoMode = 'url'; // 'url' | 'file'
    this.thumbMode = 'url'; // 'url' | 'file'
    this.uploadedVideoBlobUrl = null;
    this.uploadedThumbBlobUrl = null;

    this._initDom();
    this._initTabs();
    this._loadData();
    this._bindFormEvents();
    this._bindCategoryModal();
    this._bindSyncEvents();
    this._bindSearchFilter();
  }

  _initDom() {
    this.toastEl = document.getElementById('admin-toast');
    this.toastIcon = document.getElementById('toast-icon');
    this.toastMsg = document.getElementById('toast-message');

    // Stats
    this.statTotalReels = document.getElementById('stat-total-reels');
    this.statTotalCats = document.getElementById('stat-total-cats');

    // Forms & Inputs
    this.form = document.getElementById('reel-upload-form');
    this.inputTitle = document.getElementById('input-reel-title');
    this.selectCategory = document.getElementById('input-reel-category');
    this.inputVideoUrl = document.getElementById('input-video-url');
    this.inputVideoFile = document.getElementById('input-video-file');
    this.inputThumbUrl = document.getElementById('input-thumb-url');
    this.inputThumbFile = document.getElementById('input-thumb-file');
    this.inputDuration = document.getElementById('input-reel-duration');
    this.inputId = document.getElementById('input-reel-id');
    this.inputDesc = document.getElementById('input-reel-desc');
    this.toggleTrending = document.getElementById('toggle-reel-trending');
    this.toggleDownload = document.getElementById('toggle-reel-download');

    // Preview Mockup Elements
    this.previewVideo = document.getElementById('preview-video-element');
    this.previewPlayBtn = document.getElementById('preview-play-btn');
    this.previewTitle = document.getElementById('preview-title');
    this.previewDesc = document.getElementById('preview-desc');
    this.previewCatIcon = document.getElementById('preview-cat-icon');
    this.previewCatName = document.getElementById('preview-cat-name');

    // Video Player Modal
    this.modalPlayer = document.getElementById('modal-preview-video');
    this.modalVideoEl = document.getElementById('modal-player-video');
    this.modalCloseVideo = document.getElementById('modal-close-video-btn');

    // Category Modal
    this.modalCategory = document.getElementById('modal-add-category');
    this.formCategory = document.getElementById('form-add-category');
  }

  showToast(message, icon = '🌿') {
    if (!this.toastEl) return;
    this.toastIcon.textContent = icon;
    this.toastMsg.textContent = message;
    this.toastEl.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this.toastEl.classList.remove('show');
    }, 3200);
  }

  _initTabs() {
    const navButtons = document.querySelectorAll('.sidebar-nav .nav-link');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        this.switchTab(targetTab);
      });
    });

    // Top action buttons
    document.getElementById('btn-top-add-reel')?.addEventListener('click', () => this.switchTab('tab-upload'));
    document.getElementById('btn-top-sync-github')?.addEventListener('click', () => this.switchTab('tab-sync'));
    document.getElementById('btn-dash-view-all')?.addEventListener('click', () => this.switchTab('tab-library'));
    document.getElementById('btn-quick-upload-reel')?.addEventListener('click', () => this.switchTab('tab-upload'));
    document.getElementById('btn-lib-add-reel')?.addEventListener('click', () => this.switchTab('tab-upload'));
  }

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update nav buttons
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      if (panel.id === tabId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Update Topbar Headline
    const titles = {
      'tab-dashboard': ['Studio Dashboard', 'Real-time content management & live app synchronization'],
      'tab-upload': ['Upload Nature Reel', 'Publish authentic 9:16 vertical reels directly into the user app'],
      'tab-categories': ['Nature Categories (20+)', 'Manage and organize all nature themes, icons, and avatars'],
      'tab-library': ['Reels Library', 'Inspect, preview, edit, and curate active nature moments'],
      'tab-sync': ['GitHub & Cloud Sync', 'Deploy live updates to repository and GitHub Pages']
    };

    if (titles[tabId]) {
      document.getElementById('topbar-title').textContent = titles[tabId][0];
      document.getElementById('topbar-subtitle').textContent = titles[tabId][1];
    }

    if (tabId === 'tab-upload') {
      this._generateNewReelId();
      this._updateLivePreview();
    }
  }

  _generateNewReelId() {
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const cat = this.selectCategory ? this.selectCategory.value || 'nature' : 'nature';
    if (this.inputId) {
      this.inputId.value = `reel-${cat}-${randomSuffix}`;
    }
  }

  _loadData() {
    this.categories = getAllCategories();
    this.reels = loadAllReels();

    this._renderStats();
    this._renderCategorySelect();
    this._renderCategoriesGrid();
    this._renderDashboardRecent();
    this._renderLibraryTable();
    this._generateNewReelId();
    this._updateLivePreview();
  }

  _renderStats() {
    if (this.statTotalReels) this.statTotalReels.textContent = this.reels.length;
    if (this.statTotalCats) this.statTotalCats.textContent = this.categories.length;
  }

  _renderCategorySelect() {
    if (!this.selectCategory) return;
    this.selectCategory.innerHTML = '';
    
    this.categories.forEach(cat => {
      if (cat.id === 'trending') return; // Trending is computed
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = `${cat.icon} ${cat.name}`;
      this.selectCategory.appendChild(opt);
    });

    // Also update library filter
    const libFilter = document.getElementById('lib-category-filter');
    if (libFilter) {
      libFilter.innerHTML = '<option value="all">All Categories</option>';
      this.categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = `${cat.icon} ${cat.name}`;
        libFilter.appendChild(opt);
      });
    }
  }

  _renderCategoriesGrid() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    container.innerHTML = '';
    this.categories.forEach(cat => {
      const reelCount = this.reels.filter(r => cat.id === 'trending' ? r.is_trending : r.category_id === cat.id).length;

      const card = document.createElement('div');
      card.className = 'category-admin-card';
      card.innerHTML = `
        <img class="cat-card-cover" src="${cat.image_url}" alt="${cat.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=80';" />
        <div class="cat-card-body">
          <div class="cat-card-header">
            <div class="cat-card-name">
              <span>${cat.icon}</span>
              <span>${cat.name}</span>
            </div>
            <span class="cat-card-badge">${reelCount} Reels</span>
          </div>
          <div class="cat-card-desc">${cat.description || 'Peaceful nature soundscapes and visuals.'}</div>
          <div style="margin-top: 10px; font-size: 0.72rem; color: var(--admin-text-dim); font-family: monospace;">
            ID: #${cat.id}
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  _renderDashboardRecent() {
    const tbody = document.getElementById('dashboard-recent-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const recent = this.reels.slice(0, 6);

    recent.forEach(reel => {
      const cat = getCategoryById(reel.category_id);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img class="table-thumb" src="${reel.thumbnail_url}" alt="${reel.title}" /></td>
        <td>
          <div style="font-weight: 700; color: #fff;">${reel.title}</div>
          <div style="font-size: 0.75rem; color: var(--admin-text-dim);">${reel.content_id}</div>
        </td>
        <td><span class="badge-tag">${cat.icon} ${cat.name}</span></td>
        <td><span style="font-family: monospace; font-size: 0.85rem;">${reel.duration}</span></td>
        <td><span style="color: #4ade80; font-weight: 700; font-size: 0.8rem;">● Live</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  _renderLibraryTable(filterCategory = 'all', searchQuery = '') {
    const tbody = document.getElementById('library-reels-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    let list = [...this.reels];

    if (filterCategory !== 'all') {
      if (filterCategory === 'trending') {
        list = list.filter(r => r.is_trending);
      } else {
        list = list.filter(r => r.category_id === filterCategory);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r => r.title.toLowerCase().includes(q) || r.category_id.toLowerCase().includes(q));
    }

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 40px; color: var(--admin-text-muted);">
            🌿 No reels found matching this filter.
          </td>
        </tr>
      `;
      return;
    }

    list.forEach(reel => {
      const cat = getCategoryById(reel.category_id);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img class="table-thumb" src="${reel.thumbnail_url}" alt="${reel.title}" /></td>
        <td>
          <div style="font-weight: 700; color: #fff; max-width: 320px;">${reel.title}</div>
          <div style="font-size: 0.75rem; color: var(--admin-text-dim);">${reel.content_id}</div>
        </td>
        <td><span class="badge-tag">${cat.icon} ${cat.name}</span></td>
        <td><span style="font-family: monospace; font-size: 0.85rem;">${reel.duration}</span></td>
        <td>
          ${reel.is_trending ? '<span class="badge-tag badge-trending">🔥 Trending</span>' : '<span style="color: var(--admin-text-dim); font-size: 0.8rem;">Standard</span>'}
        </td>
        <td>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-preview-reel" data-url="${reel.video_url}" style="padding: 6px 10px; font-size: 0.8rem;" title="Preview Video">
              ▶️ Play
            </button>
            <button class="btn btn-danger btn-delete-reel" data-id="${reel.content_id}" style="padding: 6px 10px; font-size: 0.8rem;" title="Delete Reel">
              🗑️
            </button>
          </div>
        </td>
      `;

      // Bind actions
      tr.querySelector('.btn-preview-reel').addEventListener('click', () => {
        this._openPlayerModal(reel);
      });

      tr.querySelector('.btn-delete-reel').addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete "${reel.title}"?`)) {
          deleteCustomReel(reel.content_id);
          this.showToast('Reel deleted from App', '🗑️');
          this._loadData();
        }
      });

      tbody.appendChild(tr);
    });
  }

  _bindSearchFilter() {
    const searchInput = document.getElementById('lib-search-input');
    const catFilter = document.getElementById('lib-category-filter');

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this._renderLibraryTable(catFilter ? catFilter.value : 'all', searchInput.value);
      });
    }

    if (catFilter) {
      catFilter.addEventListener('change', () => {
        this._renderLibraryTable(catFilter.value, searchInput ? searchInput.value : '');
      });
    }
  }

  _bindFormEvents() {
    // Mode toggles
    const btnVidUrl = document.getElementById('btn-video-mode-url');
    const btnVidFile = document.getElementById('btn-video-mode-file');
    const boxVidUrl = document.getElementById('video-url-input-container');
    const boxVidFile = document.getElementById('video-file-input-container');

    btnVidUrl?.addEventListener('click', () => {
      this.videoMode = 'url';
      btnVidUrl.classList.add('btn-primary');
      btnVidUrl.classList.remove('btn-secondary');
      btnVidFile.classList.remove('btn-primary');
      btnVidFile.classList.add('btn-secondary');
      boxVidUrl.style.display = 'block';
      boxVidFile.style.display = 'none';
      this._updateLivePreview();
    });

    btnVidFile?.addEventListener('click', () => {
      this.videoMode = 'file';
      btnVidFile.classList.add('btn-primary');
      btnVidFile.classList.remove('btn-secondary');
      btnVidUrl.classList.remove('btn-primary');
      btnVidUrl.classList.add('btn-secondary');
      boxVidUrl.style.display = 'none';
      boxVidFile.style.display = 'block';
    });

    // Dropzone click & drag
    const vidDropzone = document.getElementById('video-file-dropzone');
    vidDropzone?.addEventListener('click', () => this.inputVideoFile.click());
    this.inputVideoFile?.addEventListener('change', (e) => this._handleVideoFileUpload(e.target.files[0]));

    // Thumbnail mode
    const btnThumbUrl = document.getElementById('btn-thumb-mode-url');
    const btnThumbFile = document.getElementById('btn-thumb-mode-file');
    const boxThumbUrl = document.getElementById('thumb-url-input-container');
    const boxThumbFile = document.getElementById('thumb-file-input-container');

    btnThumbUrl?.addEventListener('click', () => {
      this.thumbMode = 'url';
      btnThumbUrl.classList.add('btn-primary');
      btnThumbUrl.classList.remove('btn-secondary');
      btnThumbFile.classList.remove('btn-primary');
      btnThumbFile.classList.add('btn-secondary');
      boxThumbUrl.style.display = 'block';
      boxThumbFile.style.display = 'none';
      this._updateLivePreview();
    });

    btnThumbFile?.addEventListener('click', () => {
      this.thumbMode = 'file';
      btnThumbFile.classList.add('btn-primary');
      btnThumbFile.classList.remove('btn-secondary');
      btnThumbUrl.classList.remove('btn-primary');
      btnThumbUrl.classList.add('btn-secondary');
      boxThumbUrl.style.display = 'none';
      boxThumbFile.style.display = 'block';
    });

    const thumbDropzone = document.getElementById('thumb-file-dropzone');
    thumbDropzone?.addEventListener('click', () => this.inputThumbFile.click());
    this.inputThumbFile?.addEventListener('change', (e) => this._handleThumbFileUpload(e.target.files[0]));

    // Input live updates for Phone Simulator
    [this.inputTitle, this.selectCategory, this.inputVideoUrl, this.inputThumbUrl, this.inputDesc].forEach(el => {
      if (el) {
        el.addEventListener('input', () => this._updateLivePreview());
        el.addEventListener('change', () => this._updateLivePreview());
      }
    });

    // Phone preview play toggle
    this.previewPlayBtn?.addEventListener('click', () => {
      if (!this.previewVideo) return;
      if (this.previewVideo.paused) {
        this.previewVideo.play().then(() => {
          this.previewPlayBtn.style.opacity = '0';
        }).catch(() => {});
      } else {
        this.previewVideo.pause();
        this.previewPlayBtn.style.opacity = '1';
      }
    });

    // Form Submit
    this.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this._handlePublishReel();
    });
  }

  _handleVideoFileUpload(file) {
    if (!file) return;
    document.getElementById('video-file-label').textContent = `✅ ${file.name} (${(file.size / (1024*1024)).toFixed(1)} MB)`;
    
    // Create local object URL for preview & playback
    if (this.uploadedVideoBlobUrl) URL.revokeObjectURL(this.uploadedVideoBlobUrl);
    this.uploadedVideoBlobUrl = URL.createObjectURL(file);

    // Auto calculate duration
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = this.uploadedVideoBlobUrl;
    tempVideo.onloadedmetadata = () => {
      const durSec = Math.round(tempVideo.duration);
      const m = Math.floor(durSec / 60);
      const s = durSec % 60;
      const formatted = `${m}:${s < 10 ? '0' : ''}${s}`;
      if (this.inputDuration) this.inputDuration.value = formatted;
      this._updateLivePreview();
    };

    this.showToast('Video file loaded & duration analyzed', '📹');
    this._updateLivePreview();
  }

  _handleThumbFileUpload(file) {
    if (!file) return;
    document.getElementById('thumb-file-label').textContent = `✅ ${file.name}`;
    
    if (this.uploadedThumbBlobUrl) URL.revokeObjectURL(this.uploadedThumbBlobUrl);
    this.uploadedThumbBlobUrl = URL.createObjectURL(file);
    this._updateLivePreview();
  }

  _updateLivePreview() {
    const title = this.inputTitle?.value || 'Untamed Mountain Stream at Dawn';
    const catId = this.selectCategory?.value || 'forest';
    const cat = getCategoryById(catId);
    const desc = this.inputDesc?.value || 'Crisp morning mist drifting through ancient pines with the soothing sound of alpine crystal waters.';
    
    let videoSrc = this.videoMode === 'file' && this.uploadedVideoBlobUrl 
      ? this.uploadedVideoBlobUrl 
      : (this.inputVideoUrl?.value || 'assets/videos/nature_stream.mp4');

    let thumbSrc = this.thumbMode === 'file' && this.uploadedThumbBlobUrl
      ? this.uploadedThumbBlobUrl
      : (this.inputThumbUrl?.value || cat.image_url);

    if (this.previewTitle) this.previewTitle.textContent = title;
    if (this.previewDesc) this.previewDesc.textContent = desc;
    if (this.previewCatIcon) this.previewCatIcon.textContent = cat.icon;
    if (this.previewCatName) this.previewCatName.textContent = cat.name;

    if (this.previewVideo) {
      this.previewVideo.poster = thumbSrc;
      if (this.previewVideo.src !== videoSrc) {
        this.previewVideo.src = videoSrc;
      }
    }
  }

  _handlePublishReel() {
    const title = this.inputTitle.value.trim();
    if (!title) {
      alert('Please enter a title for the reel');
      return;
    }

    const catId = this.selectCategory.value;
    const duration = this.inputDuration.value.trim() || '0:24';
    const contentId = this.inputId.value.trim() || `reel-${catId}-${Date.now()}`;
    const desc = this.inputDesc.value.trim() || 'Experience pure serenity, peaceful nature soundscapes, and calming visuals in 9:16 high-definition.';
    const isTrending = this.toggleTrending.checked;
    const isDownloadable = this.toggleDownload.checked;

    let videoUrl = this.videoMode === 'file' && this.uploadedVideoBlobUrl
      ? this.uploadedVideoBlobUrl
      : this.inputVideoUrl.value.trim();

    let thumbUrl = this.thumbMode === 'file' && this.uploadedThumbBlobUrl
      ? this.uploadedThumbBlobUrl
      : this.inputThumbUrl.value.trim();

    if (!videoUrl) videoUrl = 'assets/videos/nature_stream.mp4';
    if (!thumbUrl) thumbUrl = 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80';

    const newReel = {
      content_id: contentId,
      title: title,
      description: desc,
      category_id: catId,
      thumbnail_url: thumbUrl,
      video_url: videoUrl,
      duration: duration,
      is_downloadable: isDownloadable,
      is_trending: isTrending,
      created_at: new Date().toISOString()
    };

    // Save & Broadcast
    addCustomReel(newReel);
    this.showToast('✨ Reel Published! User App Updated Immediately.', '🌿');

    // Reload data & switch to Library tab to show the new reel
    this._loadData();
    setTimeout(() => {
      this.switchTab('tab-library');
    }, 600);
  }

  _openPlayerModal(reel) {
    if (!this.modalPlayer || !this.modalVideoEl) return;
    this.modalVideoEl.src = reel.video_url;
    this.modalPlayer.classList.add('show');
    this.modalVideoEl.play().catch(() => {});

    this.modalCloseVideo.onclick = () => {
      this.modalVideoEl.pause();
      this.modalVideoEl.src = '';
      this.modalPlayer.classList.remove('show');
    };
  }

  _bindCategoryModal() {
    const btnOpen = document.getElementById('btn-open-add-category');
    const btnClose = document.getElementById('modal-close-cat-btn');

    btnOpen?.addEventListener('click', () => {
      this.modalCategory?.classList.add('show');
    });

    btnClose?.addEventListener('click', () => {
      this.modalCategory?.classList.remove('show');
    });

    this.formCategory?.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('cat-id-input').value.trim().toLowerCase().replace(/\s+/g, '-');
      const name = document.getElementById('cat-name-input').value.trim();
      const icon = document.getElementById('cat-icon-input').value.trim() || '🌿';
      const img = document.getElementById('cat-image-input').value.trim();
      const desc = document.getElementById('cat-desc-input').value.trim();

      if (!id || !name) return;

      const newCat = {
        id: id,
        name: name,
        icon: icon,
        image_url: img || 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=200&q=80',
        description: desc
      };

      addCustomCategory(newCat);
      this.modalCategory?.classList.remove('show');
      this.showToast(`Category "${name}" added successfully!`, '📂');
      this.formCategory.reset();
      this._loadData();
    });
  }

  _bindSyncEvents() {
    // GitHub token save
    const tokenInput = document.getElementById('input-github-token');
    const savedToken = localStorage.getItem('nature_gh_token') || '';
    if (tokenInput && savedToken) {
      tokenInput.value = savedToken;
    }

    document.getElementById('btn-save-gh-token')?.addEventListener('click', () => {
      const token = tokenInput?.value.trim();
      if (token) {
        localStorage.setItem('nature_gh_token', token);
        this.showToast('GitHub token saved in secure browser storage', '🔑');
      } else {
        localStorage.removeItem('nature_gh_token');
        this.showToast('GitHub token removed', 'ℹ️');
      }
    });

    // Commit to GitHub directly via REST API
    document.getElementById('btn-sync-commit-github')?.addEventListener('click', async () => {
      const token = localStorage.getItem('nature_gh_token') || tokenInput?.value.trim();
      if (!token) {
        alert('Please enter your GitHub Personal Access Token to commit directly, or download reels.json below and push via git.');
        return;
      }

      this.showToast('Connecting to GitHub API...', '☁️');

      try {
        const repo = 'gulshanyadaav8810-svg/terra-nova-nature';
        const path = 'data/reels.json';
        const url = `https://api.github.com/repos/${repo}/contents/${path}`;

        // 1. Get current file sha
        let sha = null;
        const getRes = await fetch(url, {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (getRes.ok) {
          const fileData = await getRes.json();
          sha = fileData.sha;
        }

        // 2. Put updated data
        const updatedJson = JSON.stringify(this.reels, null, 2);
        const encodedContent = btoa(unescape(encodeURIComponent(updatedJson)));

        const putRes = await fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `Admin Studio: Update reels data (${this.reels.length} reels)`,
            content: encodedContent,
            sha: sha || undefined,
            branch: 'main'
          })
        });

        if (putRes.ok) {
          this.showToast('✅ Successfully pushed updated reels to GitHub repository!', '🚀');
        } else {
          const err = await putRes.json();
          alert('GitHub API Error: ' + (err.message || 'Could not commit'));
        }
      } catch (e) {
        console.error('Commit error:', e);
        alert('Failed to connect to GitHub: ' + e.message);
      }
    });

    // Download reels.json
    document.getElementById('btn-download-reels-json')?.addEventListener('click', () => {
      this._downloadJson(this.reels, 'reels.json');
    });

    // Download categories.json
    document.getElementById('btn-download-categories-json')?.addEventListener('click', () => {
      this._downloadJson(this.categories, 'categories.json');
    });

    // Reset Data
    document.getElementById('btn-reset-data')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all custom reels and categories to the curated authentic dataset?')) {
        localStorage.removeItem('nature_custom_reels');
        localStorage.removeItem('nature_custom_categories');
        this.showToast('Reset data to clean curated dataset', '🔄');
        this._loadData();
      }
    });
  }

  _downloadJson(data, filename) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast(`Downloaded ${filename}`, '📥');
  }
}

// Instantiate on load
window.addEventListener('DOMContentLoaded', () => {
  window.adminStudio = new AdminStudio();
});
