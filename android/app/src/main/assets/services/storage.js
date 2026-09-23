/* ==========================================================
   NATURE MOMENTS — LOCAL STORAGE SERVICE
   Persistent local storage for likes, bookmarks, and settings
   Zero account requirement, 100% private & client-side
   ========================================================== */

const STORAGE_KEYS = {
  LIKES: 'nature_moments_likes',
  SAVED: 'nature_moments_saved',
  LANGUAGE: 'nature_moments_language',
  FEEDBACK: 'nature_moments_feedback'
};

class StorageService {
  constructor() {
    this.listeners = [];
  }

  // --- LIKES ---
  getLikes() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LIKES);
      return data ? new Set(JSON.parse(data)) : new Set();
    } catch (e) {
      console.warn('Error reading likes from storage', e);
      return new Set();
    }
  }

  isLiked(contentId) {
    return this.getLikes().has(contentId);
  }

  toggleLike(contentId) {
    const likes = this.getLikes();
    let isNowLiked = false;
    if (likes.has(contentId)) {
      likes.delete(contentId);
      isNowLiked = false;
    } else {
      likes.add(contentId);
      isNowLiked = true;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify([...likes]));
      this._emitChange('likes', { contentId, isLiked: isNowLiked });
    } catch (e) {
      console.error('Failed to write like to storage', e);
    }
    return isNowLiked;
  }

  // --- SAVED / BOOKMARKS ---
  getSaved() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED);
      return data ? new Set(JSON.parse(data)) : new Set();
    } catch (e) {
      console.warn('Error reading saved from storage', e);
      return new Set();
    }
  }

  isSaved(contentId) {
    return this.getSaved().has(contentId);
  }

  toggleSave(contentId) {
    const saved = this.getSaved();
    let isNowSaved = false;
    if (saved.has(contentId)) {
      saved.delete(contentId);
      isNowSaved = false;
    } else {
      saved.add(contentId);
      isNowSaved = true;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify([...saved]));
      this._emitChange('saved', { contentId, isSaved: isNowSaved });
    } catch (e) {
      console.error('Failed to write save to storage', e);
    }
    return isNowSaved;
  }

  // --- LANGUAGE PREFERENCE ---
  getLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
    } catch (e) {
      return 'en';
    }
  }

  setLanguage(langCode) {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, langCode);
      this._emitChange('language', { language: langCode });
    } catch (e) {
      console.error('Failed to write language to storage', e);
    }
  }

  // --- FEEDBACK STORAGE (Anonymous) ---
  saveFeedback(entry) {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.FEEDBACK) || '[]');
      existing.unshift({
        ...entry,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(existing));
    } catch (e) {
      console.error('Failed to write feedback', e);
    }
  }

  // --- EVENT SUBSCRIPTION ---
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  _emitChange(type, payload) {
    this.listeners.forEach(cb => {
      try {
        cb(type, payload);
      } catch (err) {
        console.error(err);
      }
    });
  }
}

export const storage = new StorageService();
