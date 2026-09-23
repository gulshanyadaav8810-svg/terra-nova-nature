/* ==========================================================
   NATURE MOMENTS — OFFLINE INDEXEDDB REPOSITORY
   Stores real downloaded video blobs for authentic offline playback
   ========================================================== */

const DB_NAME = 'nature_moments_db';
const DB_VERSION = 1;
const STORE_NAME = 'downloads';

class OfflineDatabase {
  constructor() {
    this.db = null;
    this.initPromise = this._init();
    this.activeBlobUrls = new Map();
  }

  _init() {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        console.warn('IndexedDB not supported in this environment');
        return resolve(null);
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'content_id' });
          store.createIndex('downloaded_at', 'downloaded_at', { unique: false });
          store.createIndex('category_id', 'category_id', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  async _getStore(mode = 'readonly') {
    await this.initPromise;
    if (!this.db) throw new Error('IndexedDB not initialized');
    const transaction = this.db.transaction(STORE_NAME, mode);
    return transaction.objectStore(STORE_NAME);
  }

  // Format bytes helper (e.g. 1.1 MB)
  formatBytes(bytes) {
    if (!bytes || bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + units[i];
  }

  // Save downloaded media blob
  async saveDownloadedReel(reel, blob) {
    const store = await this._getStore('readwrite');
    const record = {
      content_id: reel.content_id,
      title: reel.title,
      description: reel.description || '',
      category_id: reel.category_id,
      thumbnail_url: reel.thumbnail_url,
      blob: blob,
      file_size: blob.size,
      formatted_size: this.formatBytes(blob.size),
      mime_type: blob.type || 'video/mp4',
      duration: reel.duration || '0:15',
      downloaded_at: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const request = store.put(record);
      request.onsuccess = () => resolve(record);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // Check if reel is in downloads
  async isDownloaded(contentId) {
    try {
      const reel = await this.getDownloadedReel(contentId);
      return !!reel;
    } catch (e) {
      return false;
    }
  }

  // Get single record
  async getDownloadedReel(contentId) {
    const store = await this._getStore('readonly');
    return new Promise((resolve, reject) => {
      const request = store.get(contentId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // Get all downloaded reels (newest first)
  async getAllDownloadedReels() {
    const store = await this._getStore('readonly');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const results = request.result || [];
        results.sort((a, b) => new Date(b.downloaded_at) - new Date(a.downloaded_at));
        resolve(results);
      };
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // Delete downloaded reel
  async deleteDownloadedReel(contentId) {
    // Revoke cached URL if open
    if (this.activeBlobUrls.has(contentId)) {
      URL.revokeObjectURL(this.activeBlobUrls.get(contentId));
      this.activeBlobUrls.delete(contentId);
    }

    const store = await this._getStore('readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(contentId);
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // Create an offline Object URL for playing the local blob!
  async getPlaybackUrl(contentId) {
    if (this.activeBlobUrls.has(contentId)) {
      return this.activeBlobUrls.get(contentId);
    }
    const record = await this.getDownloadedReel(contentId);
    if (!record || !record.blob) {
      throw new Error('Local video file not found');
    }
    const blobUrl = URL.createObjectURL(record.blob);
    this.activeBlobUrls.set(contentId, blobUrl);
    return blobUrl;
  }
}

export const offlineDb = new OfflineDatabase();
