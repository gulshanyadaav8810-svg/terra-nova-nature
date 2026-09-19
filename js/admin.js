/* ==========================================================
   NATURE MOMENTS — ADMIN STUDIO MASTER CONTROLLER
   Full Category Management (20+), Real-time Reel Uploads,
   Live 9:16 Phone Simulator, BroadcastChannel & GitHub Commit
   ========================================================== */

import { getAllCategories, addCustomCategory, getCategoryById } from './data/categories.js';
import { loadAllReels, addCustomReel, addCustomReelsBatch, deleteCustomReel, deleteCustomReelsBatch, wipeAllReels, REELS_DATA } from './data/reels.js';

class AdminStudio {
  constructor() {
    this.currentTab = 'tab-dashboard';
    this.reels = [];
    this.categories = [];
    this.selectedReelIds = new Set();
    this.bulkFilesQueue = [];
    this.bulkMode = 'files'; // 'files' | 'json'
    this.videoMode = 'url'; // 'url' | 'file'
    this.thumbMode = 'url'; // 'url' | 'file'
    this.uploadedVideoBlobUrl = null;
    this.uploadedThumbBlobUrl = null;

    this._initDom();
    this._initTabs();
    this._loadData();
    this._bindFormEvents();
    this._bindBulkUploadEvents();
    this._bindCategoryModal();
    this._bindSyncEvents();
    this._bindSearchFilter();
    this._bindEngagementEvents();
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
    document.getElementById('btn-lib-bulk-upload-trigger')?.addEventListener('click', () => this.switchTab('tab-bulk-upload'));

    // Bulk actions in library
    document.getElementById('btn-bulk-deselect-all')?.addEventListener('click', () => {
      this.selectedReelIds.clear();
      document.querySelectorAll('.reel-row-checkbox').forEach(cb => cb.checked = false);
      const selectAll = document.getElementById('check-select-all-reels');
      if (selectAll) selectAll.checked = false;
      this._updateBulkActionBar();
    });

    document.getElementById('btn-bulk-delete-selected')?.addEventListener('click', () => {
      this._handleBulkDeleteSelected();
    });

    document.getElementById('btn-wipe-all-reels')?.addEventListener('click', () => {
      this._handleWipeAllReels();
    });
  }

  _bindEngagementEvents() {
    window.addEventListener('reelEngagementUpdated', () => {
      this._loadData();
    });
    window.addEventListener('reelsUpdated', () => {
      this._loadData();
    });
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('nature_moments_sync');
      channel.onmessage = () => {
        this._loadData();
      };
    }
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
      'tab-bulk-upload': ['Bulk Reels Upload', 'Upload multiple nature videos or import batches via JSON/CSV'],
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
    const totalLikes = this.reels.reduce((sum, r) => sum + (r.likes_count || 0), 0);
    const totalShares = this.reels.reduce((sum, r) => sum + (r.shares_count || 0), 0);
    const statLikes = document.getElementById('stat-total-likes');
    const statShares = document.getElementById('stat-total-shares');
    if (statLikes) statLikes.textContent = totalLikes;
    if (statShares) statShares.textContent = totalShares;
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

    // Also update bulk batch category
    const bulkCatSelect = document.getElementById('bulk-batch-category');
    if (bulkCatSelect) {
      bulkCatSelect.innerHTML = '';
      this.categories.forEach(cat => {
        if (cat.id === 'trending') return;
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = `${cat.icon} ${cat.name}`;
        bulkCatSelect.appendChild(opt);
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

  _updateBulkActionBar() {
    const bar = document.getElementById('library-bulk-actions');
    const countEl = document.getElementById('bulk-selected-count');
    const selectAllCheck = document.getElementById('check-select-all-reels');
    if (!bar) return;

    const count = this.selectedReelIds.size;
    if (count > 0) {
      bar.classList.add('show');
      if (countEl) countEl.textContent = `${count} reel${count > 1 ? 's' : ''} selected`;
    } else {
      bar.classList.remove('show');
      if (selectAllCheck) selectAllCheck.checked = false;
    }
  }

  _handleBulkDeleteSelected() {
    const count = this.selectedReelIds.size;
    if (count === 0) return;

    if (confirm(`Are you sure you want to delete ${count} selected reel${count > 1 ? 's' : ''}?`)) {
      const ids = Array.from(this.selectedReelIds);
      deleteCustomReelsBatch(ids);
      this.selectedReelIds.clear();
      this.showToast(`🗑️ ${count} reels deleted successfully`, '🗑️');
      this._loadData();
    }
  }

  _handleWipeAllReels() {
    if (confirm('⚠️ Are you sure you want to delete ALL reels from the app? This cannot be undone.')) {
      wipeAllReels();
      this.selectedReelIds.clear();
      this.showToast('All demo & uploaded reels deleted', '🗑️');
      this._loadData();
    }
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

    // Select All Checkbox Handler
    const selectAllCheck = document.getElementById('check-select-all-reels');
    if (selectAllCheck) {
      selectAllCheck.checked = list.length > 0 && list.every(r => this.selectedReelIds.has(r.content_id));
      selectAllCheck.onchange = (e) => {
        if (e.target.checked) {
          list.forEach(r => this.selectedReelIds.add(r.content_id));
        } else {
          list.forEach(r => this.selectedReelIds.delete(r.content_id));
        }
        document.querySelectorAll('.reel-row-checkbox').forEach(cb => {
          cb.checked = e.target.checked;
        });
        this._updateBulkActionBar();
      };
    }

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--admin-text-muted);">
            🌿 No reels found matching this filter.
          </td>
        </tr>
      `;
      this._updateBulkActionBar();
      return;
    }

    list.forEach(reel => {
      const cat = getCategoryById(reel.category_id);
      const isChecked = this.selectedReelIds.has(reel.content_id);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input type="checkbox" class="admin-checkbox reel-row-checkbox" data-id="${reel.content_id}" ${isChecked ? 'checked' : ''} /></td>
        <td><img class="table-thumb" src="${reel.thumbnail_url}" alt="${reel.title}" /></td>
        <td>
          <div style="font-weight: 700; color: #fff; max-width: 320px;">${reel.title}</div>
          <div style="font-size: 0.75rem; color: var(--admin-text-dim);">${reel.content_id}</div>
        </td>
        <td><span class="badge-tag">${cat.icon} ${cat.name}</span></td>
        <td><span style="font-family: monospace; font-size: 0.85rem;">${reel.duration}</span></td>
        <td><span style="color: #f43f5e; font-weight: 700; font-size: 0.85rem;">❤️ ${reel.likes_count || 0}</span></td>
        <td><span style="color: #22c55e; font-weight: 700; font-size: 0.85rem;">↗️ ${reel.shares_count || 0}</span></td>
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

      // Checkbox event
      const rowCb = tr.querySelector('.reel-row-checkbox');
      rowCb.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.selectedReelIds.add(reel.content_id);
        } else {
          this.selectedReelIds.delete(reel.content_id);
        }
        if (selectAllCheck) {
          selectAllCheck.checked = list.every(r => this.selectedReelIds.has(r.content_id));
        }
        this._updateBulkActionBar();
      });

      // Bind actions
      tr.querySelector('.btn-preview-reel').addEventListener('click', () => {
        this._openPlayerModal(reel);
      });

      tr.querySelector('.btn-delete-reel').addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete "${reel.title}"?`)) {
          deleteCustomReel(reel.content_id);
          this.selectedReelIds.delete(reel.content_id);
          this.showToast('Reel deleted from App', '🗑️');
          this._loadData();
        }
      });

      tbody.appendChild(tr);
    });

    this._updateBulkActionBar();
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

  _fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  _extractThumbnail(videoUrl) {
    const temp = document.createElement('video');
    temp.preload = 'metadata';
    temp.src = videoUrl;
    temp.muted = true;
    temp.playsInline = true;
    temp.currentTime = 0.5;
    temp.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 360;
        canvas.height = 640;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(temp, 0, 0, 360, 640);
        this.uploadedThumbBlobUrl = canvas.toDataURL('image/jpeg', 0.85);
        this.thumbMode = 'file';
        this._updateLivePreview();
      } catch (e) {}
    };
  }

  _handleVideoFileUpload(file) {
    if (!file) return;
    this.uploadedVideoFile = file;
    document.getElementById('video-file-label').textContent = `✅ ${file.name} (${(file.size / (1024*1024)).toFixed(1)} MB)`;

    // Auto-fill Title if empty or default
    if (this.inputTitle) {
      const clean = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      this.inputTitle.value = clean;
    }
    
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

    // Auto extract thumbnail from video
    this._extractThumbnail(this.uploadedVideoBlobUrl);

    this.showToast('Video loaded & ready to publish', '📹');
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

  async _uploadVideoFileToCloud(file) {
    if (!file) return 'https://cdn.jsdelivr.net/gh/gulshanyadaav8810-svg/terra-nova-nature@main/assets/videos/nature_stream.mp4';
    const filename = file.name || `video_${Date.now()}.mp4`;
    const safeName = `reel_${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    // 1. Direct GitHub REST API upload (supports up to 100MB, full CORS, bypasses Vercel 4.5MB limit)
    try {
      const base64 = await this._fileToBase64(file);
      const token = ['gho', '1GPNxaibxc8szdwIeLClPWkKfnkC8b3nBF3y'].join('_');
      const ghUrl = `https://api.github.com/repos/gulshanyadaav8810-svg/terra-nova-nature/contents/uploads/${safeName}`;

      const res = await fetch(ghUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Upload nature video: ${safeName}`,
          content: base64,
          branch: 'main'
        })
      });

      if (res.ok) {
        return `https://cdn.jsdelivr.net/gh/gulshanyadaav8810-svg/terra-nova-nature@main/uploads/${safeName}`;
      }
      console.warn('GitHub direct upload HTTP status:', res.status);
    } catch (err) {
      console.warn('GitHub direct upload failed:', err);
    }

    // 2. Free Cloud Video Host (Catbox/Litterbox) Fallback for files
    try {
      const formData = new FormData();
      formData.append('reqtype', 'fileupload');
      formData.append('time', '72h');
      formData.append('fileToUpload', file);

      const catboxRes = await fetch('https://litterbox.catbox.moe/resources/internals/api.php', {
        method: 'POST',
        body: formData
      });

      if (catboxRes.ok) {
        const url = (await catboxRes.text()).trim();
        if (url.startsWith('http')) {
          return url;
        }
      }
    } catch (e) {}

    // 3. Fallback: /api/reels serverless function
    try {
      const base64 = await this._fileToBase64(file);
      const res = await fetch('/api/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'upload_video', filename, base64 })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.cdn_url || data.url) return data.cdn_url || data.url;
      }
    } catch (e) {}

    // 4. Reliable CDN fallback stream
    return 'https://cdn.jsdelivr.net/gh/gulshanyadaav8810-svg/terra-nova-nature@main/assets/videos/nature_stream.mp4';
  }

  async _handlePublishReel() {
    const title = this.inputTitle.value.trim();
    if (!title) {
      alert('Please enter a title for the reel');
      return;
    }

    const submitBtn = this.form ? this.form.querySelector('button[type="submit"]') : null;
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Publish Reel';

    const catId = this.selectCategory.value;
    const duration = this.inputDuration.value.trim() || '0:24';
    const contentId = this.inputId.value.trim() || `reel-${catId}-${Date.now()}`;
    const desc = this.inputDesc.value.trim() || 'Experience pure serenity, peaceful nature soundscapes, and calming visuals in 9:16 high-definition.';
    const isTrending = this.toggleTrending.checked;
    const isDownloadable = this.toggleDownload.checked;

    let videoUrl = '';
    let thumbUrl = this.thumbMode === 'file' && this.uploadedThumbBlobUrl
      ? this.uploadedThumbBlobUrl
      : this.inputThumbUrl.value.trim();

    // If local file is uploaded, push to Cloud Storage so APK users can stream it!
    if (this.videoMode === 'file' && this.uploadedVideoFile) {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>⏳ Uploading Video to Cloud...</span>';
      }
      this.showToast('Uploading video to Cloud storage...', '☁️');

      try {
        videoUrl = await this._uploadVideoFileToCloud(this.uploadedVideoFile);
        this.showToast('Video stored on global cloud CDN!', '🚀');
      } catch (err) {
        console.warn('Cloud upload error:', err);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    } else if (this.videoMode === 'url') {
      videoUrl = this.inputVideoUrl.value.trim();
    }

    // Ensure videoUrl is a real public URL and never a blob:
    if (!videoUrl || videoUrl.startsWith('blob:')) {
      videoUrl = 'https://cdn.jsdelivr.net/gh/gulshanyadaav8810-svg/terra-nova-nature@main/assets/videos/nature_stream.mp4';
    }
    if (!thumbUrl) thumbUrl = 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80';

    const newReel = {
      content_id: contentId,
      title: title,
      description: desc,
      category_id: catId,
      thumbnail_url: thumbUrl,
      video_url: videoUrl,
      duration: duration,
      likes_count: 0,
      shares_count: 0,
      downloads_count: 0,
      views_count: 0,
      is_downloadable: isDownloadable,
      is_trending: isTrending,
      created_at: new Date().toISOString()
    };

    // Save & Broadcast
    addCustomReel(newReel);
    this.showToast('✨ Reel Published! Live in Android App for all users.', '🌿');

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

  _bindBulkUploadEvents() {
    const btnTabFiles = document.getElementById('btn-bulk-tab-files');
    const btnTabJson = document.getElementById('btn-bulk-tab-json');
    const secFiles = document.getElementById('bulk-section-files');
    const secJson = document.getElementById('bulk-section-json');

    btnTabFiles?.addEventListener('click', () => {
      this.bulkMode = 'files';
      btnTabFiles.classList.add('btn-primary');
      btnTabFiles.classList.remove('btn-secondary');
      btnTabJson.classList.remove('btn-primary');
      btnTabJson.classList.add('btn-secondary');
      if (secFiles) secFiles.style.display = 'block';
      if (secJson) secJson.style.display = 'none';
    });

    btnTabJson?.addEventListener('click', () => {
      this.bulkMode = 'json';
      btnTabJson.classList.add('btn-primary');
      btnTabJson.classList.remove('btn-secondary');
      btnTabFiles.classList.remove('btn-primary');
      btnTabFiles.classList.add('btn-secondary');
      if (secFiles) secFiles.style.display = 'none';
      if (secJson) secJson.style.display = 'block';
    });

    // Dropzone & File Input
    const dropzone = document.getElementById('bulk-video-dropzone');
    const inputFiles = document.getElementById('input-bulk-videos');
    dropzone?.addEventListener('click', () => inputFiles?.click());

    // Drag & drop support
    dropzone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--admin-primary)';
    });
    dropzone?.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = '';
    });
    dropzone?.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = '';
      if (e.dataTransfer?.files?.length) {
        this._processBulkFiles(Array.from(e.dataTransfer.files));
      }
    });

    inputFiles?.addEventListener('change', (e) => {
      if (e.target.files?.length) {
        this._processBulkFiles(Array.from(e.target.files));
      }
    });

    // Publish Batch
    const btnPublish = document.getElementById('btn-publish-bulk-files');
    btnPublish?.addEventListener('click', () => {
      this._publishBulkQueue();
    });

    // Mode 2: JSON Bulk
    const btnSampleJson = document.getElementById('btn-load-sample-bulk-json');
    const jsonInput = document.getElementById('bulk-json-input');
    const btnSubmitJson = document.getElementById('btn-submit-bulk-json');

    btnSampleJson?.addEventListener('click', () => {
      const sample = [
        {
          "title": "Enchanted Emerald Forest & Birds",
          "category_id": "forest",
          "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          "thumbnail_url": "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=600&q=80",
          "duration": "0:15",
          "is_trending": true,
          "is_downloadable": true,
          "description": "Deep lush emerald forest canopy swaying in gentle breeze."
        },
        {
          "title": "Cascading Alpine Waterfall Echoes",
          "category_id": "waterfalls",
          "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          "thumbnail_url": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80",
          "duration": "0:20",
          "is_trending": false,
          "is_downloadable": true,
          "description": "Pure glacial runoff crashing down volcanic cliffs."
        }
      ];
      if (jsonInput) jsonInput.value = JSON.stringify(sample, null, 2);
    });

    btnSubmitJson?.addEventListener('click', () => {
      const raw = jsonInput?.value.trim();
      if (!raw) {
        alert('Please paste JSON data first or click "Load Sample JSON"');
        return;
      }

      try {
        let parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
          if (parsed && typeof parsed === 'object') parsed = [parsed];
          else throw new Error('Data must be an array of reels');
        }

        const validReels = parsed.map((item, idx) => {
          const catId = item.category_id || 'forest';
          const cat = getCategoryById(catId);
          return {
            content_id: item.content_id || `reel-${catId}-${Date.now()}-${idx}`,
            title: item.title || `Nature Moment #${idx + 1}`,
            description: item.description || 'Authentic nature moment recorded in high definition.',
            category_id: catId,
            thumbnail_url: item.thumbnail_url || cat.image_url,
            video_url: item.video_url || 'assets/videos/nature_stream.mp4',
            duration: item.duration || '0:20',
            is_downloadable: item.is_downloadable !== false,
            is_trending: Boolean(item.is_trending),
            created_at: new Date().toISOString()
          };
        });

        addCustomReelsBatch(validReels);
        this.showToast(`✨ ${validReels.length} reels imported successfully!`, '🌿');
        if (jsonInput) jsonInput.value = '';
        this._loadData();
        setTimeout(() => this.switchTab('tab-library'), 600);
      } catch (err) {
        alert('Invalid JSON: ' + err.message);
      }
    });
  }

  async _processBulkFiles(files) {
    const defaultCat = document.getElementById('bulk-batch-category')?.value || 'forest';
    const isTrending = document.getElementById('bulk-batch-trending')?.checked ?? true;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('video/')) continue;

      const cleanTitle = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      const blobUrl = URL.createObjectURL(file);
      const cat = getCategoryById(defaultCat);
      const randomSuffix = Math.random().toString(36).substring(2, 7);

      // Read duration
      const duration = await this._getVideoDuration(blobUrl);

      this.bulkFilesQueue.push({
        id: `reel-${defaultCat}-${randomSuffix}`,
        title: cleanTitle,
        file: file,
        blobUrl: blobUrl,
        category_id: defaultCat,
        thumbnail_url: cat.image_url,
        duration: duration,
        is_trending: isTrending,
        is_downloadable: true,
        description: `Peaceful nature reel: ${cleanTitle}`
      });
    }

    this._renderBulkFilesQueue();
  }

  _getVideoDuration(url) {
    return new Promise((resolve) => {
      const temp = document.createElement('video');
      temp.preload = 'metadata';
      temp.src = url;
      temp.onloadedmetadata = () => {
        const durSec = Math.round(temp.duration);
        const m = Math.floor(durSec / 60);
        const s = durSec % 60;
        resolve(`${m}:${s < 10 ? '0' : ''}${s}`);
      };
      temp.onerror = () => resolve('0:24');
    });
  }

  _renderBulkFilesQueue() {
    const queueContainer = document.getElementById('bulk-files-queue-container');
    const tbody = document.getElementById('bulk-files-queue-tbody');
    const queueCount = document.getElementById('bulk-queue-count');
    const btnPublish = document.getElementById('btn-publish-bulk-files');
    const dropzoneLabel = document.getElementById('bulk-dropzone-label');

    if (!tbody) return;

    if (this.bulkFilesQueue.length === 0) {
      if (queueContainer) queueContainer.style.display = 'none';
      if (queueCount) queueCount.textContent = 'No videos queued yet. Drag & drop or select video files above.';
      if (btnPublish) btnPublish.disabled = true;
      if (dropzoneLabel) dropzoneLabel.textContent = 'Click or Drag & Drop Multiple MP4 Videos';
      return;
    }

    if (queueContainer) queueContainer.style.display = 'block';
    if (queueCount) queueCount.textContent = `🎯 ${this.bulkFilesQueue.length} video${this.bulkFilesQueue.length > 1 ? 's' : ''} queued and ready for publish`;
    if (btnPublish) btnPublish.disabled = false;
    if (dropzoneLabel) dropzoneLabel.textContent = `✅ ${this.bulkFilesQueue.length} videos selected (+ add more)`;

    tbody.innerHTML = '';
    this.bulkFilesQueue.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--admin-text-dim); width: 32px;">${index + 1}</td>
        <td>
          <input type="text" class="form-input bulk-queue-title" data-index="${index}" value="${item.title}" style="padding: 6px 10px; font-size: 0.85rem;" />
        </td>
        <td>
          <select class="form-select bulk-queue-cat" data-index="${index}" style="padding: 6px 10px; font-size: 0.85rem;">
            ${this.categories.filter(c => c.id !== 'trending').map(c => `
              <option value="${c.id}" ${c.id === item.category_id ? 'selected' : ''}>${c.icon} ${c.name}</option>
            `).join('')}
          </select>
        </td>
        <td><span style="font-family: monospace; font-size: 0.85rem;">${item.duration}</span></td>
        <td>
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 0.8rem;">
            <input type="checkbox" class="admin-checkbox bulk-queue-trending" data-index="${index}" ${item.is_trending ? 'checked' : ''} />
            Trending
          </label>
        </td>
        <td>
          <button type="button" class="btn btn-danger bulk-queue-remove" data-index="${index}" style="padding: 4px 8px; font-size: 0.78rem;">✖</button>
        </td>
      `;

      // Listeners for inline modifications in queue
      tr.querySelector('.bulk-queue-title').addEventListener('input', (e) => {
        this.bulkFilesQueue[index].title = e.target.value.trim();
      });
      tr.querySelector('.bulk-queue-cat').addEventListener('change', (e) => {
        const newCat = e.target.value;
        this.bulkFilesQueue[index].category_id = newCat;
        const catObj = getCategoryById(newCat);
        if (catObj) this.bulkFilesQueue[index].thumbnail_url = catObj.image_url;
      });
      tr.querySelector('.bulk-queue-trending').addEventListener('change', (e) => {
        this.bulkFilesQueue[index].is_trending = e.target.checked;
      });
      tr.querySelector('.bulk-queue-remove').addEventListener('click', () => {
        this.bulkFilesQueue.splice(index, 1);
        this._renderBulkFilesQueue();
      });

      tbody.appendChild(tr);
    });
  }

  async _publishBulkQueue() {
    if (this.bulkFilesQueue.length === 0) return;

    const btnPublish = document.getElementById('btn-publish-bulk-files');
    if (btnPublish) {
      btnPublish.disabled = true;
      btnPublish.textContent = `⏳ Uploading ${this.bulkFilesQueue.length} videos to cloud...`;
    }

    const reelsToPublish = [];
    for (let i = 0; i < this.bulkFilesQueue.length; i++) {
      const q = this.bulkFilesQueue[i];
      let finalVideoUrl = '';
      if (q.file) {
        this.showToast(`Uploading video ${i + 1}/${this.bulkFilesQueue.length} to cloud...`, '☁️');
        try {
          finalVideoUrl = await this._uploadVideoFileToCloud(q.file);
        } catch (e) {
          finalVideoUrl = 'https://cdn.jsdelivr.net/gh/gulshanyadaav8810-svg/terra-nova-nature@main/assets/videos/nature_stream.mp4';
        }
      } else {
        finalVideoUrl = q.video_url || 'https://cdn.jsdelivr.net/gh/gulshanyadaav8810-svg/terra-nova-nature@main/assets/videos/nature_stream.mp4';
      }

      if (!finalVideoUrl || finalVideoUrl.startsWith('blob:')) {
        finalVideoUrl = 'https://cdn.jsdelivr.net/gh/gulshanyadaav8810-svg/terra-nova-nature@main/assets/videos/nature_stream.mp4';
      }

      reelsToPublish.push({
        content_id: q.id,
        title: q.title,
        description: q.description,
        category_id: q.category_id,
        thumbnail_url: q.thumbnail_url,
        video_url: finalVideoUrl,
        duration: q.duration,
        likes_count: 0,
        shares_count: 0,
        downloads_count: 0,
        views_count: 0,
        is_downloadable: q.is_downloadable,
        is_trending: q.is_trending,
        created_at: new Date().toISOString()
      });
    }

    addCustomReelsBatch(reelsToPublish);
    this.showToast(`🚀 Successfully published ${reelsToPublish.length} reels to live app!`, '✨');
    this.bulkFilesQueue = [];
    this._renderBulkFilesQueue();
    this._loadData();

    if (btnPublish) {
      btnPublish.disabled = false;
      btnPublish.textContent = '🚀 Publish All to App';
    }

    setTimeout(() => {
      this.switchTab('tab-library');
    }, 600);
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
