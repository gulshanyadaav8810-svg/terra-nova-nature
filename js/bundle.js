(() => {
  // js/services/storage.js
  var STORAGE_KEYS = {
    LIKES: "nature_moments_likes",
    SAVED: "nature_moments_saved",
    LANGUAGE: "nature_moments_language",
    FEEDBACK: "nature_moments_feedback"
  };
  var StorageService = class {
    constructor() {
      this.listeners = [];
    }
    // --- LIKES ---
    getLikes() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.LIKES);
        return data ? new Set(JSON.parse(data)) : /* @__PURE__ */ new Set();
      } catch (e) {
        console.warn("Error reading likes from storage", e);
        return /* @__PURE__ */ new Set();
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
        this._emitChange("likes", { contentId, isLiked: isNowLiked });
      } catch (e) {
        console.error("Failed to write like to storage", e);
      }
      return isNowLiked;
    }
    // --- SAVED / BOOKMARKS ---
    getSaved() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.SAVED);
        return data ? new Set(JSON.parse(data)) : /* @__PURE__ */ new Set();
      } catch (e) {
        console.warn("Error reading saved from storage", e);
        return /* @__PURE__ */ new Set();
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
        this._emitChange("saved", { contentId, isSaved: isNowSaved });
      } catch (e) {
        console.error("Failed to write save to storage", e);
      }
      return isNowSaved;
    }
    // --- LANGUAGE PREFERENCE ---
    getLanguage() {
      try {
        return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || "en";
      } catch (e) {
        return "en";
      }
    }
    setLanguage(langCode) {
      try {
        localStorage.setItem(STORAGE_KEYS.LANGUAGE, langCode);
        this._emitChange("language", { language: langCode });
      } catch (e) {
        console.error("Failed to write language to storage", e);
      }
    }
    // --- FEEDBACK STORAGE (Anonymous) ---
    saveFeedback(entry) {
      try {
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.FEEDBACK) || "[]");
        existing.unshift({
          ...entry,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
        localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(existing));
      } catch (e) {
        console.error("Failed to write feedback", e);
      }
    }
    // --- EVENT SUBSCRIPTION ---
    subscribe(callback) {
      this.listeners.push(callback);
      return () => {
        this.listeners = this.listeners.filter((cb) => cb !== callback);
      };
    }
    _emitChange(type, payload) {
      this.listeners.forEach((cb) => {
        try {
          cb(type, payload);
        } catch (err) {
          console.error(err);
        }
      });
    }
  };
  var storage = new StorageService();

  // js/services/i18n.js
  var LANGUAGES = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "\u0939\u093F\u0928\u094D\u0926\u0940" },
    { code: "gu", name: "Gujarati", nativeName: "\u0A97\u0AC1\u0A9C\u0AB0\u0ABE\u0AA4\u0AC0" },
    { code: "mr", name: "Marathi", nativeName: "\u092E\u0930\u093E\u0920\u0940" },
    { code: "ta", name: "Tamil", nativeName: "\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD" },
    { code: "te", name: "Telugu", nativeName: "\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41" },
    { code: "kn", name: "Kannada", nativeName: "\u0C95\u0CA8\u0CCD\u0CA8\u0CA1" }
  ];
  var TRANSLATIONS = {
    en: {
      app_title: "Nature Status",
      app_tagline: "WhatsApp Status & Short Reels",
      nav_home: "Home",
      nav_reels: "Reels",
      nav_save: "Save",
      tab_saved: "Saved",
      tab_liked: "Liked",
      tab_downloaded: "Downloaded",
      drawer_language: "Language",
      drawer_feedback: "Feedback",
      drawer_rate: "Rate App",
      drawer_share: "Share App",
      drawer_privacy: "Privacy Policy",
      category_trending: "Trending",
      category_nature: "Nature",
      category_forest: "Forest",
      category_mountain: "Mountain",
      category_rain: "Rain",
      category_river: "River",
      category_waterfall: "Waterfall",
      category_ocean: "Ocean",
      category_beach: "Beach",
      category_sunset: "Sunset",
      category_sunrise: "Sunrise",
      category_flowers: "Flowers",
      category_wildlife: "Wildlife",
      category_birds: "Birds",
      category_clouds: "Clouds",
      category_snow: "Snow",
      category_greenery: "Greenery",
      category_lake: "Lake",
      category_jungle: "Jungle",
      category_night_sky: "Night Sky",
      action_like: "Like",
      action_liked: "Liked",
      action_save: "Save",
      action_saved: "Saved",
      action_download: "Download",
      action_share: "Share",
      action_delete: "Delete",
      action_cancel: "Cancel",
      action_done: "Done",
      action_submit: "Submit",
      empty_category_title: "No reels available in this category yet.",
      empty_category_sub: "Check back soon as we add new nature moments daily.",
      empty_saved_title: "No saved reels yet.",
      empty_saved_sub: "Save your favorite nature moments to watch later.",
      empty_liked_title: "No liked reels yet.",
      empty_liked_sub: "Tap the heart icon on any nature reel to keep it here.",
      empty_downloads_title: "No downloads yet.",
      empty_downloads_sub: "Download your favorite reels to watch offline.",
      download_started: "Download started...",
      download_complete: "Reel successfully downloaded for offline viewing!",
      download_error: "Download failed. Please check connection.",
      offline_badge: "Offline Playback",
      select_language_title: "Select Language",
      feedback_title: "Send Feedback",
      feedback_placeholder: "Tell us how we can make Nature Status better for you...",
      feedback_rating_label: "Your rating",
      feedback_thanks: "Thank you for your valuable feedback!",
      privacy_title: "Privacy Policy",
      privacy_intro: "Nature Status is designed with 100% privacy at its core. No account or registration is required to use this application.",
      rate_title: "Rate Nature Status",
      rate_sub: "If you enjoy watching peaceful nature reels, please take a moment to rate our app!",
      rate_button: "Rate on Play Store"
    },
    hi: {
      app_title: "\u0928\u0947\u091A\u0930 \u0938\u094D\u091F\u0947\u091F\u0938",
      app_tagline: "\u0936\u093E\u0902\u0924 \u0914\u0930 \u0938\u0941\u0902\u0926\u0930 \u092A\u094D\u0930\u093E\u0915\u0943\u0924\u093F\u0915 \u0930\u0940\u0932\u094D\u0938",
      nav_home: "\u0939\u094B\u092E",
      nav_reels: "\u0930\u0940\u0932\u094D\u0938",
      nav_save: "\u0938\u0947\u0935",
      tab_saved: "\u0938\u0947\u0935 \u0915\u0940 \u0917\u0908",
      tab_liked: "\u092A\u0938\u0902\u0926 (Liked)",
      tab_downloaded: "\u0921\u093E\u0909\u0928\u0932\u094B\u0921",
      drawer_language: "\u092D\u093E\u0937\u093E (Language)",
      drawer_feedback: "\u092B\u0940\u0921\u092C\u0948\u0915 \u0926\u0947\u0902",
      drawer_rate: "\u0910\u092A \u0915\u094B \u0930\u0947\u091F \u0915\u0930\u0947\u0902",
      drawer_share: "\u0910\u092A \u0936\u0947\u092F\u0930 \u0915\u0930\u0947\u0902",
      drawer_privacy: "\u0917\u094B\u092A\u0928\u0940\u092F\u0924\u093E \u0928\u0940\u0924\u093F",
      category_trending: "\u091F\u094D\u0930\u0947\u0902\u0921\u093F\u0902\u0917",
      category_nature: "\u092A\u094D\u0930\u0915\u0943\u0924\u093F",
      category_forest: "\u091C\u0902\u0917\u0932",
      category_mountain: "\u092A\u0939\u093E\u0921\u093C",
      category_rain: "\u092C\u093E\u0930\u093F\u0936",
      category_river: "\u0928\u0926\u0940",
      category_waterfall: "\u091D\u0930\u0928\u093E",
      category_ocean: "\u0938\u092E\u0941\u0926\u094D\u0930",
      category_beach: "\u0938\u092E\u0941\u0926\u094D\u0930 \u0924\u091F",
      category_sunset: "\u0938\u0942\u0930\u094D\u092F\u093E\u0938\u094D\u0924",
      category_sunrise: "\u0938\u0942\u0930\u094D\u092F\u094B\u0926\u092F",
      category_flowers: "\u092B\u0942\u0932",
      category_wildlife: "\u0935\u0928\u094D\u092F\u091C\u0940\u0935",
      category_birds: "\u092A\u0915\u094D\u0937\u0940",
      category_clouds: "\u092C\u093E\u0926\u0932",
      category_snow: "\u092C\u0930\u094D\u092B\u092C\u093E\u0930\u0940",
      category_greenery: "\u0939\u0930\u093F\u092F\u093E\u0932\u0940",
      category_lake: "\u091D\u0940\u0932",
      category_jungle: "\u0938\u0918\u0928 \u0935\u0928",
      category_night_sky: "\u0924\u093E\u0930\u094B\u0902 \u092D\u0930\u093E \u0906\u0915\u093E\u0936",
      action_like: "\u092A\u0938\u0902\u0926",
      action_liked: "\u092A\u0938\u0902\u0926 \u0915\u093F\u092F\u093E",
      action_save: "\u0938\u0947\u0935 \u0915\u0930\u0947\u0902",
      action_saved: "\u0938\u0947\u0935 \u0915\u093F\u092F\u093E",
      action_download: "\u0921\u093E\u0909\u0928\u0932\u094B\u0921",
      action_share: "\u0936\u0947\u092F\u0930",
      action_delete: "\u0939\u091F\u093E\u090F\u0902",
      action_cancel: "\u0930\u0926\u094D\u0926 \u0915\u0930\u0947\u0902",
      action_done: "\u092A\u0942\u0930\u094D\u0923",
      action_submit: "\u091C\u092E\u093E \u0915\u0930\u0947\u0902",
      empty_category_title: "\u0907\u0938 \u0936\u094D\u0930\u0947\u0923\u0940 \u092E\u0947\u0902 \u0905\u092D\u0940 \u0915\u094B\u0908 \u0930\u0940\u0932 \u0909\u092A\u0932\u092C\u094D\u0927 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964",
      empty_category_sub: "\u091C\u0932\u094D\u0926 \u0939\u0940 \u0928\u090F \u092A\u094D\u0930\u093E\u0915\u0943\u0924\u093F\u0915 \u0915\u094D\u0937\u0923 \u091C\u094B\u0921\u093C\u0947 \u091C\u093E\u090F\u0902\u0917\u0947\u0964",
      empty_saved_title: "\u0905\u092D\u0940 \u0915\u094B\u0908 \u0938\u0947\u0935 \u0915\u0940 \u0917\u0908 \u0930\u0940\u0932 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964",
      empty_saved_sub: "\u092C\u093E\u0926 \u092E\u0947\u0902 \u0926\u0947\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0905\u092A\u0928\u0940 \u092A\u0938\u0902\u0926\u0940\u0926\u093E \u0930\u0940\u0932\u094D\u0938 \u0938\u0947\u0935 \u0915\u0930\u0947\u0902\u0964",
      empty_liked_title: "\u0915\u094B\u0908 \u0930\u0940\u0932\u094D\u0938 \u092A\u0938\u0902\u0926 \u0928\u0939\u0940\u0902 \u0915\u0940 \u0917\u0908\u0964",
      empty_liked_sub: "\u0905\u092A\u0928\u0940 \u092A\u0938\u0902\u0926\u0940\u0926\u093E \u0930\u0940\u0932\u094D\u0938 \u0915\u094B \u0926\u093F\u0932 (Heart) \u0906\u0907\u0915\u0928 \u0926\u092C\u093E\u0915\u0930 \u0932\u093E\u0907\u0915 \u0915\u0930\u0947\u0902\u0964",
      empty_downloads_title: "\u0905\u092D\u0940 \u0915\u094B\u0908 \u0921\u093E\u0909\u0928\u0932\u094B\u0921 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964",
      empty_downloads_sub: "\u0907\u0902\u091F\u0930\u0928\u0947\u091F \u0915\u0947 \u092C\u093F\u0928\u093E \u0926\u0947\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0930\u0940\u0932\u094D\u0938 \u0921\u093E\u0909\u0928\u0932\u094B\u0921 \u0915\u0930\u0947\u0902\u0964",
      download_started: "\u0921\u093E\u0909\u0928\u0932\u094B\u0921 \u0936\u0941\u0930\u0942 \u0939\u094B \u0930\u0939\u093E \u0939\u0948...",
      download_complete: "\u0930\u0940\u0932 \u0938\u092B\u0932\u0924\u093E\u092A\u0942\u0930\u094D\u0935\u0915 \u0921\u093E\u0909\u0928\u0932\u094B\u0921 \u0939\u094B \u0917\u0908!",
      download_error: "\u0921\u093E\u0909\u0928\u0932\u094B\u0921 \u0935\u093F\u092B\u0932 \u0930\u0939\u093E\u0964 \u0915\u0928\u0947\u0915\u094D\u0936\u0928 \u091C\u093E\u0902\u091A\u0947\u0902\u0964",
      offline_badge: "\u0911\u092B\u093C\u0932\u093E\u0907\u0928 \u092A\u094D\u0932\u0947\u092C\u0948\u0915",
      select_language_title: "\u092D\u093E\u0937\u093E \u091A\u0941\u0928\u0947\u0902",
      feedback_title: "\u092B\u0940\u0921\u092C\u0948\u0915 \u092D\u0947\u091C\u0947\u0902",
      feedback_placeholder: "\u0928\u0947\u091A\u0930 \u0938\u094D\u091F\u0947\u091F\u0938 \u0915\u094B \u0914\u0930 \u092C\u0947\u0939\u0924\u0930 \u092C\u0928\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0905\u092A\u0928\u0947 \u0938\u0941\u091D\u093E\u0935 \u0932\u093F\u0916\u0947\u0902...",
      feedback_rating_label: "\u0906\u092A\u0915\u0940 \u0930\u0947\u091F\u093F\u0902\u0917",
      feedback_thanks: "\u0906\u092A\u0915\u0947 \u0938\u0941\u091D\u093E\u0935 \u0915\u0947 \u0932\u093F\u090F \u092C\u0939\u0941\u0924 \u0927\u0928\u094D\u092F\u0935\u093E\u0926!",
      privacy_title: "\u0917\u094B\u092A\u0928\u0940\u092F\u0924\u093E \u0928\u0940\u0924\u093F",
      privacy_intro: "\u0928\u0947\u091A\u0930 \u0938\u094D\u091F\u0947\u091F\u0938 \u0906\u092A\u0915\u0940 \u092A\u0942\u0930\u094D\u0923 \u0917\u094B\u092A\u0928\u0940\u092F\u0924\u093E \u0915\u093E \u0938\u092E\u094D\u092E\u093E\u0928 \u0915\u0930\u0924\u093E \u0939\u0948\u0964 \u0910\u092A \u0915\u093E \u0909\u092A\u092F\u094B\u0917 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0915\u093F\u0938\u0940 \u0916\u093E\u0924\u0947 \u092F\u093E \u0932\u0949\u0917\u093F\u0928 \u0915\u0940 \u0906\u0935\u0936\u094D\u092F\u0915\u0924\u093E \u0928\u0939\u0940\u0902 \u0939\u0948\u0964",
      rate_title: "\u0928\u0947\u091A\u0930 \u0938\u094D\u091F\u0947\u091F\u0938 \u0915\u094B \u0930\u0947\u091F \u0915\u0930\u0947\u0902",
      rate_sub: "\u092F\u0926\u093F \u0906\u092A\u0915\u094B \u092A\u094D\u0930\u0915\u0943\u0924\u093F \u0930\u0940\u0932\u094D\u0938 \u092A\u0938\u0902\u0926 \u0939\u0948\u0902, \u0924\u094B \u0915\u0943\u092A\u092F\u093E \u0939\u092E\u0947\u0902 \u0930\u0947\u091F \u0915\u0930\u0947\u0902!",
      rate_button: "\u092A\u094D\u0932\u0947 \u0938\u094D\u091F\u094B\u0930 \u092A\u0930 \u0930\u0947\u091F \u0915\u0930\u0947\u0902"
    },
    gu: {
      app_title: "\u0AA8\u0AC7\u0A9A\u0AB0 \u0AB8\u0ACD\u0A9F\u0AC7\u0A9F\u0AB8",
      app_tagline: "\u0AB6\u0ABE\u0A82\u0AA4 \u0A85\u0AA8\u0AC7 \u0AB8\u0AC1\u0A82\u0AA6\u0AB0 \u0AAA\u0ACD\u0AB0\u0A95\u0AC3\u0AA4\u0ABF \u0AB0\u0AC0\u0AB2\u0ACD\u0AB8",
      nav_home: "\u0AB9\u0ACB\u0AAE",
      nav_reels: "\u0AB0\u0AC0\u0AB2\u0ACD\u0AB8",
      nav_save: "\u0AB8\u0ABE\u0A9A\u0AB5\u0AC7\u0AB2",
      tab_saved: "\u0AB8\u0ABE\u0A9A\u0AB5\u0AC7\u0AB2",
      tab_liked: "\u0A97\u0AAE\u0AA4\u0ABE (Liked)",
      tab_downloaded: "\u0AA1\u0ABE\u0A89\u0AA8\u0AB2\u0ACB\u0AA1",
      drawer_language: "\u0AAD\u0ABE\u0AB7\u0ABE",
      drawer_feedback: "\u0AAA\u0ACD\u0AB0\u0AA4\u0ABF\u0AB8\u0ABE\u0AA6",
      drawer_rate: "\u0AB0\u0AC7\u0A9F\u0ABF\u0A82\u0A97 \u0A86\u0AAA\u0ACB",
      drawer_share: "\u0A8F\u0AAA \u0AB6\u0AC7\u0AB0 \u0A95\u0AB0\u0ACB",
      drawer_privacy: "\u0A97\u0ACB\u0AAA\u0AA8\u0AC0\u0AAF\u0AA4\u0ABE \u0AA8\u0AC0\u0AA4\u0ABF",
      category_trending: "\u0A9F\u0ACD\u0AB0\u0AC7\u0AA8\u0ACD\u0AA1\u0ABF\u0A82\u0A97",
      category_nature: "\u0AAA\u0ACD\u0AB0\u0A95\u0AC3\u0AA4\u0ABF",
      category_forest: "\u0A9C\u0A82\u0A97\u0AB2",
      category_mountain: "\u0AAA\u0AB0\u0ACD\u0AB5\u0AA4",
      category_rain: "\u0AB5\u0AB0\u0AB8\u0ABE\u0AA6",
      category_river: "\u0AA8\u0AA6\u0AC0",
      category_waterfall: "\u0AA7\u0ACB\u0AA7",
      category_ocean: "\u0AB8\u0AAE\u0AC1\u0AA6\u0ACD\u0AB0",
      category_beach: "\u0AA6\u0AB0\u0ABF\u0AAF\u0ABE\u0A95\u0ABF\u0AA8\u0ABE\u0AB0\u0ACB",
      category_sunset: "\u0AB8\u0AC2\u0AB0\u0ACD\u0AAF\u0ABE\u0AB8\u0ACD\u0AA4",
      category_sunrise: "\u0AB8\u0AC2\u0AB0\u0ACD\u0AAF\u0ACB\u0AA6\u0AAF",
      category_flowers: "\u0AAB\u0AC2\u0AB2\u0ACB",
      category_wildlife: "\u0AB5\u0AA8\u0ACD\u0AAF\u0A9C\u0AC0\u0AB5\u0AA8",
      category_birds: "\u0AAA\u0A95\u0ACD\u0AB7\u0AC0\u0A93",
      category_clouds: "\u0AB5\u0ABE\u0AA6\u0AB3\u0ACB",
      category_snow: "\u0AAC\u0AB0\u0AAB",
      category_greenery: "\u0AB9\u0AB0\u0ABF\u0AAF\u0ABE\u0AB3\u0AC0",
      category_lake: "\u0AB8\u0AB0\u0ACB\u0AB5\u0AB0",
      category_jungle: "\u0A97\u0AC0\u0A9A \u0AB5\u0AA8",
      category_night_sky: "\u0AB0\u0ABE\u0AA4\u0ACD\u0AB0\u0ABF \u0A86\u0A95\u0ABE\u0AB6",
      action_like: "\u0AB2\u0ABE\u0A87\u0A95",
      action_liked: "\u0AB2\u0ABE\u0A87\u0A95 \u0A95\u0AB0\u0AC7\u0AB2",
      action_save: "\u0AB8\u0AC7\u0AB5 \u0A95\u0AB0\u0ACB",
      action_saved: "\u0AB8\u0AC7\u0AB5 \u0A95\u0AB0\u0ACD\u0AAF\u0AC1\u0A82",
      action_download: "\u0AA1\u0ABE\u0A89\u0AA8\u0AB2\u0ACB\u0AA1",
      action_share: "\u0AB6\u0AC7\u0AB0 \u0A95\u0AB0\u0ACB",
      action_delete: "\u0A95\u0ABE\u0AA2\u0AC0 \u0AA8\u0ABE\u0A96\u0ACB",
      action_cancel: "\u0AB0\u0AA6 \u0A95\u0AB0\u0ACB",
      action_done: "\u0AB8\u0A82\u0AAA\u0AA8\u0ACD\u0AA8",
      action_submit: "\u0AB8\u0AAC\u0AAE\u0ABF\u0A9F \u0A95\u0AB0\u0ACB",
      empty_category_title: "\u0A86 \u0A95\u0AC7\u0A9F\u0AC7\u0A97\u0AB0\u0AC0\u0AAE\u0ABE\u0A82 \u0AB9\u0A9C\u0AC0 \u0A95\u0ACB\u0A88 \u0AB0\u0AC0\u0AB2 \u0A89\u0AAA\u0AB2\u0AAC\u0ACD\u0AA7 \u0AA8\u0AA5\u0AC0.",
      empty_category_sub: "\u0A85\u0AAE\u0AC7 \u0AA8\u0ABF\u0AAF\u0AAE\u0ABF\u0AA4\u0AAA\u0AA3\u0AC7 \u0AA8\u0AB5\u0ABE \u0AAA\u0ACD\u0AB0\u0A95\u0AC3\u0AA4\u0ABF \u0AAA\u0AB3\u0ACB \u0A89\u0AAE\u0AC7\u0AB0\u0AC0 \u0AB0\u0AB9\u0ACD\u0AAF\u0ABE \u0A9B\u0AC0\u0A8F.",
      empty_saved_title: "\u0AB9\u0A9C\u0AC1 \u0AB8\u0AC1\u0AA7\u0AC0 \u0A95\u0ACB\u0A88 \u0AB8\u0AC7\u0AB5 \u0A95\u0AB0\u0AC7\u0AB2 \u0AB0\u0AC0\u0AB2 \u0AA8\u0AA5\u0AC0.",
      empty_saved_sub: "\u0AAA\u0A9B\u0AC0\u0AA5\u0AC0 \u0A9C\u0ACB\u0AB5\u0ABE \u0AAE\u0ABE\u0A9F\u0AC7 \u0AA4\u0AAE\u0ABE\u0AB0\u0AC0 \u0AAE\u0AA8\u0AAA\u0AB8\u0A82\u0AA6 \u0AB0\u0AC0\u0AB2\u0ACD\u0AB8 \u0AB8\u0ABE\u0A9A\u0AB5\u0ACB.",
      empty_liked_title: "\u0AB9\u0A9C\u0AC1 \u0AB8\u0AC1\u0AA7\u0AC0 \u0A95\u0ACB\u0A88 \u0AB0\u0AC0\u0AB2 \u0AAA\u0AB8\u0A82\u0AA6 \u0A95\u0AB0\u0AC0 \u0AA8\u0AA5\u0AC0.",
      empty_liked_sub: "\u0AA4\u0AAE\u0ABE\u0AB0\u0ABE \u0AAE\u0AA8\u0AAA\u0AB8\u0A82\u0AA6 \u0AB0\u0AC0\u0AB2\u0ACD\u0AB8\u0AA8\u0AC7 \u0AB9\u0ABE\u0AB0\u0ACD\u0A9F \u0A86\u0A87\u0A95\u0ACB\u0AA8 \u0AAA\u0AB0 \u0A9F\u0AC7\u0AAA \u0A95\u0AB0\u0AC0\u0AA8\u0AC7 \u0AB2\u0ABE\u0A88\u0A95 \u0A95\u0AB0\u0ACB.",
      empty_downloads_title: "\u0AB9\u0A9C\u0AC1 \u0A95\u0ACB\u0A88 \u0AA1\u0ABE\u0A89\u0AA8\u0AB2\u0ACB\u0AA1 \u0AA8\u0AA5\u0AC0.",
      empty_downloads_sub: "\u0A93\u0AAB\u0AB2\u0ABE\u0A87\u0AA8 \u0A9C\u0ACB\u0AB5\u0ABE \u0AAE\u0ABE\u0A9F\u0AC7 \u0AB0\u0AC0\u0AB2\u0ACD\u0AB8 \u0AA1\u0ABE\u0A89\u0AA8\u0AB2\u0ACB\u0AA1 \u0A95\u0AB0\u0ACB.",
      download_started: "\u0AA1\u0ABE\u0A89\u0AA8\u0AB2\u0ACB\u0AA1 \u0AB6\u0AB0\u0AC2 \u0AA5\u0A88 \u0AB0\u0AB9\u0ACD\u0AAF\u0AC1\u0A82 \u0A9B\u0AC7...",
      download_complete: "\u0AB5\u0ABF\u0AA1\u0ABF\u0A93 \u0AB8\u0AAB\u0AB3\u0AA4\u0ABE\u0AAA\u0AC2\u0AB0\u0ACD\u0AB5\u0A95 \u0AA1\u0ABE\u0A89\u0AA8\u0AB2\u0ACB\u0AA1 \u0AA5\u0A88 \u0A97\u0AAF\u0ACB!",
      download_error: "\u0AA1\u0ABE\u0A89\u0AA8\u0AB2\u0ACB\u0AA1 \u0AA8\u0ABF\u0AB7\u0ACD\u0AAB\u0AB3 \u0A97\u0AAF\u0AC1\u0A82.",
      offline_badge: "\u0A93\u0AAB\u0AB2\u0ABE\u0A87\u0AA8 \u0AAA\u0ACD\u0AB2\u0AC7\u0AAC\u0AC7\u0A95",
      select_language_title: "\u0AAD\u0ABE\u0AB7\u0ABE \u0AAA\u0AB8\u0A82\u0AA6 \u0A95\u0AB0\u0ACB",
      feedback_title: "\u0AAA\u0ACD\u0AB0\u0AA4\u0ABF\u0AB8\u0ABE\u0AA6 \u0AAE\u0ACB\u0A95\u0AB2\u0ACB",
      feedback_placeholder: "\u0AA4\u0AAE\u0ABE\u0AB0\u0ACB \u0AAA\u0ACD\u0AB0\u0AA4\u0ABF\u0AB8\u0ABE\u0AA6 \u0A85\u0AB9\u0AC0\u0A82 \u0AB2\u0A96\u0ACB...",
      feedback_rating_label: "\u0AA4\u0AAE\u0ABE\u0AB0\u0AC1\u0A82 \u0AB0\u0AC7\u0A9F\u0ABF\u0A82\u0A97",
      feedback_thanks: "\u0AA4\u0AAE\u0ABE\u0AB0\u0ABE \u0AAA\u0ACD\u0AB0\u0AA4\u0ABF\u0AB8\u0ABE\u0AA6 \u0AAE\u0ABE\u0A9F\u0AC7 \u0A86\u0AAD\u0ABE\u0AB0!",
      privacy_title: "\u0A97\u0ACB\u0AAA\u0AA8\u0AC0\u0AAF\u0AA4\u0ABE \u0AA8\u0AC0\u0AA4\u0ABF",
      privacy_intro: "\u0AA8\u0AC7\u0A9A\u0AB0 \u0AAE\u0ACB\u0AAE\u0AC7\u0AA8\u0ACD\u0A9F\u0ACD\u0AB8 \u0AB8\u0A82\u0AAA\u0AC2\u0AB0\u0ACD\u0AA3 \u0A97\u0ACB\u0AAA\u0AA8\u0AC0\u0AAF\u0AA4\u0ABE \u0AAA\u0AC2\u0AB0\u0AC0 \u0AAA\u0ABE\u0AA1\u0AC7 \u0A9B\u0AC7. \u0A95\u0ACB\u0A88 \u0A96\u0ABE\u0AA4\u0ABE\u0AA8\u0AC0 \u0A9C\u0AB0\u0AC2\u0AB0 \u0AA8\u0AA5\u0AC0.",
      rate_title: "\u0A8F\u0AAA\u0AA8\u0AC7 \u0AB0\u0AC7\u0A9F \u0A95\u0AB0\u0ACB",
      rate_sub: "\u0A95\u0AC3\u0AAA\u0ABE \u0A95\u0AB0\u0AC0\u0AA8\u0AC7 \u0AAA\u0ACD\u0AB2\u0AC7 \u0AB8\u0ACD\u0A9F\u0ACB\u0AB0 \u0AAA\u0AB0 \u0AB0\u0AC7\u0A9F\u0ABF\u0A82\u0A97 \u0A86\u0AAA\u0ACB!",
      rate_button: "\u0AAA\u0ACD\u0AB2\u0AC7 \u0AB8\u0ACD\u0A9F\u0ACB\u0AB0 \u0AAA\u0AB0 \u0AB0\u0AC7\u0A9F \u0A95\u0AB0\u0ACB"
    },
    mr: {
      app_title: "\u0928\u0947\u091A\u0930 \u0938\u094D\u091F\u0947\u091F\u0938",
      app_tagline: "\u0936\u093E\u0902\u0924 \u0935 \u0938\u0941\u0902\u0926\u0930 \u0928\u093F\u0938\u0930\u094D\u0917 \u0930\u0940\u0932\u094D\u0938",
      nav_home: "\u0939\u094B\u092E",
      nav_reels: "\u0930\u0940\u0932\u094D\u0938",
      nav_save: "\u091C\u0924\u0928 \u0915\u0947\u0932\u0947\u0932\u0947",
      tab_saved: "\u091C\u0924\u0928 \u0915\u0947\u0932\u0947\u0932\u0947",
      tab_liked: "\u0906\u0935\u0921\u0932\u0947\u0932\u0947 (Liked)",
      tab_downloaded: "\u0921\u093E\u0909\u0928\u0932\u094B\u0921",
      drawer_language: "\u092D\u093E\u0937\u093E",
      drawer_feedback: "\u0905\u092D\u093F\u092A\u094D\u0930\u093E\u092F",
      drawer_rate: "\u0905\u200D\u0945\u092A\u0932\u093E \u0930\u0947\u091F\u093F\u0902\u0917 \u0926\u094D\u092F\u093E",
      drawer_share: "\u0905\u200D\u0945\u092A \u0936\u0947\u0905\u0930 \u0915\u0930\u093E",
      drawer_privacy: "\u0917\u094B\u092A\u0928\u0940\u092F\u0924\u093E \u0927\u094B\u0930\u0923",
      category_trending: "\u091F\u094D\u0930\u0947\u0902\u0921\u093F\u0902\u0917",
      category_nature: "\u0928\u093F\u0938\u0930\u094D\u0917",
      category_forest: "\u091C\u0902\u0917\u0932",
      category_mountain: "\u0921\u094B\u0902\u0917\u0930/\u092A\u0930\u094D\u0935\u0924",
      category_rain: "\u092A\u093E\u090A\u0938",
      category_river: "\u0928\u0926\u0940",
      category_waterfall: "\u0927\u092C\u0927\u092C\u093E",
      category_ocean: "\u0938\u092E\u0941\u0926\u094D\u0930",
      category_beach: "\u0938\u092E\u0941\u0926\u094D\u0930\u0915\u093F\u0928\u093E\u0930\u093E",
      category_sunset: "\u0938\u0942\u0930\u094D\u092F\u093E\u0938\u094D\u0924",
      category_sunrise: "\u0938\u0942\u0930\u094D\u092F\u094B\u0926\u092F",
      category_flowers: "\u092B\u0941\u0932\u0947",
      category_wildlife: "\u0935\u0928\u094D\u092F\u091C\u0940\u0935",
      category_birds: "\u092A\u0915\u094D\u0937\u0940",
      category_clouds: "\u0922\u0917",
      category_snow: "\u092C\u0930\u094D\u092B\u0935\u0943\u0937\u094D\u091F\u0940",
      category_greenery: "\u0939\u093F\u0930\u0935\u0933",
      category_lake: "\u0924\u0932\u093E\u0935",
      category_jungle: "\u0918\u0928\u0926\u093E\u091F \u091C\u0902\u0917\u0932",
      category_night_sky: "\u0930\u093E\u0924\u094D\u0930\u0940\u091A\u0947 \u0906\u0915\u093E\u0936",
      action_like: "\u0932\u093E\u0908\u0915",
      action_liked: "\u0932\u093E\u0908\u0915 \u0915\u0947\u0932\u0947",
      action_save: "\u091C\u0924\u0928 \u0915\u0930\u093E",
      action_saved: "\u091C\u0924\u0928 \u0915\u0947\u0932\u0947",
      action_download: "\u0921\u093E\u0909\u0928\u0932\u094B\u0921",
      action_share: "\u0936\u0947\u0905\u0930 \u0915\u0930\u093E",
      action_delete: "\u0939\u091F\u0935\u093E",
      action_cancel: "\u0930\u0926\u094D\u0926 \u0915\u0930\u093E",
      action_done: "\u092A\u0942\u0930\u094D\u0923",
      action_submit: "\u092A\u093E\u0920\u0935\u093E",
      empty_category_title: "\u092F\u093E \u0936\u094D\u0930\u0947\u0923\u0940\u0924 \u0905\u0926\u094D\u092F\u093E\u092A \u0915\u094B\u0923\u0924\u0940\u0939\u0940 \u0930\u0940\u0932 \u0909\u092A\u0932\u092C\u094D\u0927 \u0928\u093E\u0939\u0940.",
      empty_category_sub: "\u0932\u0935\u0915\u0930\u091A \u0928\u0935\u0940\u0928 \u0928\u093F\u0938\u0930\u094D\u0917 \u0926\u0943\u0936\u094D\u092F\u0947 \u091C\u094B\u0921\u0932\u0940 \u091C\u093E\u0924\u0940\u0932.",
      empty_saved_title: "\u0905\u0926\u094D\u092F\u093E\u092A \u0915\u094B\u0923\u0924\u0940\u0939\u0940 \u091C\u0924\u0928 \u0915\u0947\u0932\u0947\u0932\u0940 \u0930\u0940\u0932 \u0928\u093E\u0939\u0940.",
      empty_saved_sub: "\u0928\u0902\u0924\u0930 \u092A\u093E\u0939\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0906\u0935\u0921\u0924\u094D\u092F\u093E \u0930\u0940\u0932\u094D\u0938 \u091C\u0924\u0928 \u0915\u0930\u093E.",
      empty_liked_title: "\u0905\u0926\u094D\u092F\u093E\u092A \u090F\u0915\u0939\u0940 \u0930\u0940\u0932 \u0906\u0935\u0921\u0932\u0940 \u0928\u093E\u0939\u0940.",
      empty_liked_sub: "\u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0906\u0935\u0921\u0924\u094D\u092F\u093E \u0930\u0940\u0932\u094D\u0938 \u0939\u093E\u0930\u094D\u091F \u0906\u092F\u0915\u0949\u0928\u0935\u0930 \u091F\u0945\u092A \u0915\u0930\u0942\u0928 \u0932\u093E\u0908\u0915 \u0915\u0930\u093E.",
      empty_downloads_title: "\u0905\u0926\u094D\u092F\u093E\u092A \u0915\u094B\u0923\u0924\u0947\u0939\u0940 \u0921\u093E\u0909\u0928\u0932\u094B\u0921 \u0928\u093E\u0939\u0940.",
      empty_downloads_sub: "\u0911\u092B\u0932\u093E\u0907\u0928 \u092A\u093E\u0939\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0930\u0940\u0932\u094D\u0938 \u0921\u093E\u0909\u0928\u0932\u094B\u0921 \u0915\u0930\u093E.",
      download_started: "\u0921\u093E\u0909\u0928\u0932\u094B\u0921 \u0938\u0941\u0930\u0942 \u0939\u094B\u0924 \u0906\u0939\u0947...",
      download_complete: "\u0935\u094D\u0939\u093F\u0921\u093F\u0913 \u092F\u0936\u0938\u094D\u0935\u0940\u0930\u093F\u0924\u094D\u092F\u093E \u0921\u093E\u0909\u0928\u0932\u094B\u0921 \u091D\u093E\u0932\u093E!",
      download_error: "\u0921\u093E\u0909\u0928\u0932\u094B\u0921 \u0905\u092F\u0936\u0938\u094D\u0935\u0940 \u091D\u093E\u0932\u0947.",
      offline_badge: "\u0911\u092B\u0932\u093E\u0907\u0928 \u092A\u094D\u0932\u0947\u092C\u0945\u0915",
      select_language_title: "\u092D\u093E\u0937\u093E \u0928\u093F\u0935\u0921\u093E",
      feedback_title: "\u0905\u092D\u093F\u092A\u094D\u0930\u093E\u092F \u092A\u093E\u0920\u0935\u093E",
      feedback_placeholder: "\u0924\u0941\u092E\u091A\u093E \u0905\u092D\u093F\u092A\u094D\u0930\u093E\u092F \u092F\u0947\u0925\u0947 \u0932\u093F\u0939\u093E...",
      feedback_rating_label: "\u0924\u0941\u092E\u091A\u0947 \u0930\u0947\u091F\u093F\u0902\u0917",
      feedback_thanks: "\u0924\u0941\u092E\u091A\u094D\u092F\u093E \u092E\u094C\u0932\u094D\u092F\u0935\u093E\u0928 \u0905\u092D\u093F\u092A\u094D\u0930\u093E\u092F\u093E\u092C\u0926\u094D\u0926\u0932 \u0927\u0928\u094D\u092F\u0935\u093E\u0926!",
      privacy_title: "\u0917\u094B\u092A\u0928\u0940\u092F\u0924\u093E \u0927\u094B\u0930\u0923",
      privacy_intro: "\u0928\u0947\u091A\u0930 \u0938\u094D\u091F\u0947\u091F\u0938\u092E\u0927\u094D\u092F\u0947 \u0915\u094B\u0923\u0924\u094D\u092F\u093E\u0939\u0940 \u0916\u093E\u0924\u094D\u092F\u093E\u091A\u0940 \u0915\u093F\u0902\u0935\u093E \u0928\u094B\u0902\u0926\u0923\u0940\u091A\u0940 \u0906\u0935\u0936\u094D\u092F\u0915\u0924\u093E \u0928\u093E\u0939\u0940.",
      rate_title: "\u0905\u200D\u0945\u092A\u0932\u093E \u0930\u0947\u091F\u093F\u0902\u0917 \u0926\u094D\u092F\u093E",
      rate_sub: "\u0915\u0943\u092A\u092F\u093E \u092A\u094D\u0932\u0947 \u0938\u094D\u091F\u094B\u0905\u0930\u0935\u0930 \u0906\u092E\u091A\u0947 \u0905\u200D\u0945\u092A \u0930\u0947\u091F \u0915\u0930\u093E!",
      rate_button: "\u092A\u094D\u0932\u0947 \u0938\u094D\u091F\u094B\u0905\u0930\u0935\u0930 \u0930\u0947\u091F \u0915\u0930\u093E"
    },
    ta: {
      app_title: "\u0BA8\u0BC7\u0B9A\u0BCD\u0B9A\u0BB0\u0BCD \u0BB8\u0BCD\u0B9F\u0BC7\u0B9F\u0BCD\u0B9F\u0BB8\u0BCD",
      app_tagline: "\u0B85\u0BAE\u0BC8\u0BA4\u0BBF\u0BAF\u0BBE\u0BA9 \u0B87\u0BAF\u0BB1\u0BCD\u0B95\u0BC8 \u0BB0\u0BC0\u0BB2\u0BCD\u0BB8\u0BCD",
      nav_home: "\u0BAE\u0BC1\u0B95\u0BAA\u0BCD\u0BAA\u0BC1",
      nav_reels: "\u0BB0\u0BC0\u0BB2\u0BCD\u0BB8\u0BCD",
      nav_save: "\u0B9A\u0BC7\u0BAE\u0BBF\u0BA4\u0BCD\u0BA4\u0BB5\u0BC8",
      tab_saved: "\u0B9A\u0BC7\u0BAE\u0BBF\u0BA4\u0BCD\u0BA4\u0BB5\u0BC8",
      tab_liked: "\u0BB5\u0BBF\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0B99\u0BCD\u0B95\u0BB3\u0BCD (Liked)",
      tab_downloaded: "\u0BAA\u0BA4\u0BBF\u0BB5\u0BBF\u0BB1\u0B95\u0BCD\u0B95\u0BAE\u0BCD",
      drawer_language: "\u0BAE\u0BCA\u0BB4\u0BBF",
      drawer_feedback: "\u0B95\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1",
      drawer_rate: "\u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC0\u0B9F\u0BC1 \u0B9A\u0BC6\u0BAF\u0BCD\u0B95",
      drawer_share: "\u0BAA\u0B95\u0BBF\u0BB0\u0BCD\u0B95",
      drawer_privacy: "\u0BA4\u0BA9\u0BBF\u0BAF\u0BC1\u0BB0\u0BBF\u0BAE\u0BC8\u0B95\u0BCD \u0B95\u0BCA\u0BB3\u0BCD\u0B95\u0BC8",
      category_trending: "\u0B9F\u0BBF\u0BB0\u0BC6\u0BA3\u0BCD\u0B9F\u0BBF\u0B99\u0BCD",
      category_nature: "\u0B87\u0BAF\u0BB1\u0BCD\u0B95\u0BC8",
      category_forest: "\u0B95\u0BBE\u0B9F\u0BC1",
      category_mountain: "\u0BAE\u0BB2\u0BC8",
      category_rain: "\u0BAE\u0BB4\u0BC8",
      category_river: "\u0B86\u0BB1\u0BC1",
      category_waterfall: "\u0BA8\u0BC0\u0BB0\u0BCD\u0BB5\u0BC0\u0BB4\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF",
      category_ocean: "\u0BAA\u0BC6\u0BB0\u0BC1\u0B99\u0BCD\u0B95\u0B9F\u0BB2\u0BCD",
      category_beach: "\u0B95\u0B9F\u0BB1\u0BCD\u0B95\u0BB0\u0BC8",
      category_sunset: "\u0B9A\u0BC2\u0BB0\u0BBF\u0BAF \u0B85\u0BB8\u0BCD\u0BA4\u0BAE\u0BA9\u0BAE\u0BCD",
      category_sunrise: "\u0B9A\u0BC2\u0BB0\u0BBF\u0BAF \u0B89\u0BA4\u0BAF\u0BAE\u0BCD",
      category_flowers: "\u0BAE\u0BB2\u0BB0\u0BCD\u0B95\u0BB3\u0BCD",
      category_wildlife: "\u0BB5\u0BA9\u0BB5\u0BBF\u0BB2\u0B99\u0BCD\u0B95\u0BC1",
      category_birds: "\u0BAA\u0BB1\u0BB5\u0BC8\u0B95\u0BB3\u0BCD",
      category_clouds: "\u0BAE\u0BC7\u0B95\u0B99\u0BCD\u0B95\u0BB3\u0BCD",
      category_snow: "\u0BAA\u0BA9\u0BBF\u0BAA\u0BCD\u0BAA\u0BCA\u0BB4\u0BBF\u0BB5\u0BC1",
      category_greenery: "\u0BAA\u0B9A\u0BC1\u0BAE\u0BC8",
      category_lake: "\u0B8F\u0BB0\u0BBF",
      category_jungle: "\u0B85\u0B9F\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4 \u0B95\u0BBE\u0B9F\u0BC1",
      category_night_sky: "\u0B87\u0BB0\u0BB5\u0BC1 \u0BB5\u0BBE\u0BA9\u0BAE\u0BCD",
      action_like: "\u0BB5\u0BBF\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BAE\u0BCD",
      action_liked: "\u0BB5\u0BBF\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BAE\u0BBE\u0BA9\u0BA4\u0BC1",
      action_save: "\u0B9A\u0BC7\u0BAE\u0BBF",
      action_saved: "\u0B9A\u0BC7\u0BAE\u0BBF\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1",
      action_download: "\u0BAA\u0BA4\u0BBF\u0BB5\u0BBF\u0BB1\u0B95\u0BCD\u0B95\u0BC1",
      action_share: "\u0BAA\u0B95\u0BBF\u0BB0\u0BCD",
      action_delete: "\u0BA8\u0BC0\u0B95\u0BCD\u0B95\u0BC1",
      action_cancel: "\u0BB0\u0BA4\u0BCD\u0BA4\u0BC1",
      action_done: "\u0BAE\u0BC1\u0B9F\u0BBF\u0BA8\u0BCD\u0BA4\u0BA4\u0BC1",
      action_submit: "\u0B9A\u0BAE\u0BB0\u0BCD\u0BAA\u0BCD\u0BAA\u0BBF",
      empty_category_title: "\u0B87\u0BA8\u0BCD\u0BA4 \u0BAA\u0BBF\u0BB0\u0BBF\u0BB5\u0BBF\u0BB2\u0BCD \u0BB0\u0BC0\u0BB2\u0BCD\u0B95\u0BB3\u0BCD \u0B8E\u0BA4\u0BC1\u0BB5\u0BC1\u0BAE\u0BCD \u0B87\u0BB2\u0BCD\u0BB2\u0BC8.",
      empty_category_sub: "\u0BB5\u0BBF\u0BB0\u0BC8\u0BB5\u0BBF\u0BB2\u0BCD \u0BAA\u0BC1\u0BA4\u0BBF\u0BAF \u0B87\u0BAF\u0BB1\u0BCD\u0B95\u0BC8 \u0BA4\u0BB0\u0BC1\u0BA3\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B9A\u0BC7\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0BAE\u0BCD.",
      empty_saved_title: "\u0B9A\u0BC7\u0BAE\u0BBF\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0BB0\u0BC0\u0BB2\u0BCD\u0B95\u0BB3\u0BCD \u0B8E\u0BA4\u0BC1\u0BB5\u0BC1\u0BAE\u0BCD \u0B87\u0BB2\u0BCD\u0BB2\u0BC8.",
      empty_saved_sub: "\u0BAA\u0BBF\u0BA9\u0BCD\u0BA9\u0BB0\u0BCD \u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95 \u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1\u0BAA\u0BCD \u0BAA\u0BBF\u0B9F\u0BBF\u0BA4\u0BCD\u0BA4\u0BB5\u0BB1\u0BCD\u0BB1\u0BC8\u0B9A\u0BCD \u0B9A\u0BC7\u0BAE\u0BBF\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD.",
      empty_liked_title: "\u0BB5\u0BBF\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BAE\u0BBE\u0BA9 \u0BB0\u0BC0\u0BB2\u0BCD\u0BB8\u0BCD \u0B8E\u0BA4\u0BC1\u0BB5\u0BC1\u0BAE\u0BCD \u0B87\u0BB2\u0BCD\u0BB2\u0BC8.",
      empty_liked_sub: "\u0B87\u0BA4\u0BAF \u0B90\u0B95\u0BBE\u0BA9\u0BC8\u0BA4\u0BCD \u0BA4\u0B9F\u0BCD\u0B9F\u0BBF \u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1\u0BAA\u0BCD \u0BAA\u0BBF\u0B9F\u0BBF\u0BA4\u0BCD\u0BA4 \u0BB0\u0BC0\u0BB2\u0BCD\u0BB8\u0BC8 \u0BB2\u0BC8\u0B95\u0BCD \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD.",
      empty_downloads_title: "\u0BAA\u0BA4\u0BBF\u0BB5\u0BBF\u0BB1\u0B95\u0BCD\u0B95\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B8E\u0BA4\u0BC1\u0BB5\u0BC1\u0BAE\u0BCD \u0B87\u0BB2\u0BCD\u0BB2\u0BC8.",
      empty_downloads_sub: "\u0B87\u0BA3\u0BC8\u0BAF\u0BAE\u0BCD \u0B87\u0BB2\u0BCD\u0BB2\u0BBE\u0BAE\u0BB2\u0BCD \u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95 \u0BB0\u0BC0\u0BB2\u0BCD\u0B95\u0BB3\u0BC8\u0BAA\u0BCD \u0BAA\u0BA4\u0BBF\u0BB5\u0BBF\u0BB1\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD.",
      download_started: "\u0BAA\u0BA4\u0BBF\u0BB5\u0BBF\u0BB1\u0B95\u0BCD\u0B95\u0BAE\u0BCD \u0BA4\u0BCA\u0B9F\u0B99\u0BCD\u0B95\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1...",
      download_complete: "\u0BB5\u0BC6\u0BB1\u0BCD\u0BB1\u0BBF\u0B95\u0BB0\u0BAE\u0BBE\u0B95 \u0BAA\u0BA4\u0BBF\u0BB5\u0BBF\u0BB1\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1!",
      download_error: "\u0BAA\u0BA4\u0BBF\u0BB5\u0BBF\u0BB1\u0B95\u0BCD\u0B95\u0BAE\u0BCD \u0BA4\u0BCB\u0BB2\u0BCD\u0BB5\u0BBF\u0BAF\u0BC1\u0BB1\u0BCD\u0BB1\u0BA4\u0BC1.",
      offline_badge: "\u0B86\u0B83\u0BAA\u0BCD\u0BB2\u0BC8\u0BA9\u0BCD \u0BAA\u0BBF\u0BA9\u0BCD\u0BA9\u0BA3\u0BBF",
      select_language_title: "\u0BAE\u0BCA\u0BB4\u0BBF\u0BAF\u0BC8\u0BA4\u0BCD \u0BA4\u0BC7\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4\u0BC6\u0B9F\u0BC1\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD",
      feedback_title: "\u0B95\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BCD\u0B95\u0BB3\u0BC8\u0BAA\u0BCD \u0BAA\u0B95\u0BBF\u0BB0\u0BB5\u0BC1\u0BAE\u0BCD",
      feedback_placeholder: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BAF\u0BCB\u0B9A\u0BA9\u0BC8\u0B95\u0BB3\u0BC8 \u0B87\u0B99\u0BCD\u0B95\u0BC7 \u0BAA\u0B95\u0BBF\u0BB0\u0BB5\u0BC1\u0BAE\u0BCD...",
      feedback_rating_label: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC0\u0B9F\u0BC1",
      feedback_thanks: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B95\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0BAE\u0BBF\u0B95\u0BCD\u0B95 \u0BA8\u0BA9\u0BCD\u0BB1\u0BBF!",
      privacy_title: "\u0BA4\u0BA9\u0BBF\u0BAF\u0BC1\u0BB0\u0BBF\u0BAE\u0BC8\u0B95\u0BCD \u0B95\u0BCA\u0BB3\u0BCD\u0B95\u0BC8",
      privacy_intro: "\u0B8E\u0BA8\u0BCD\u0BA4\u0BB5\u0BCA\u0BB0\u0BC1 \u0BA4\u0BA9\u0BBF\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0BA4\u0B95\u0BB5\u0BB2\u0BC1\u0BAE\u0BCD \u0B9A\u0BC7\u0B95\u0BB0\u0BBF\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0BB5\u0BA4\u0BBF\u0BB2\u0BCD\u0BB2\u0BC8. 100% \u0BA4\u0BA9\u0BBF\u0BAF\u0BC1\u0BB0\u0BBF\u0BAE\u0BC8 \u0BAA\u0BBE\u0BA4\u0BC1\u0B95\u0BBE\u0BAA\u0BCD\u0BAA\u0BBE\u0BA9\u0BA4\u0BC1.",
      rate_title: "\u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC0\u0B9F\u0BC1 \u0B9A\u0BC6\u0BAF\u0BCD\u0B95",
      rate_sub: "\u0BAA\u0BCD\u0BB3\u0BC7 \u0BB8\u0BCD\u0B9F\u0BCB\u0BB0\u0BBF\u0BB2\u0BCD \u0B8E\u0B99\u0BCD\u0B95\u0BB3\u0BC8 \u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BBF\u0B9F\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD!",
      rate_button: "\u0BAA\u0BCD\u0BB3\u0BC7 \u0BB8\u0BCD\u0B9F\u0BCB\u0BB0\u0BBF\u0BB2\u0BCD \u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC0\u0B9F\u0BC1"
    },
    te: {
      app_title: "\u0C28\u0C47\u0C1A\u0C30\u0C4D \u0C38\u0C4D\u0C1F\u0C47\u0C1F\u0C38\u0C4D",
      app_tagline: "\u0C2A\u0C4D\u0C30\u0C36\u0C3E\u0C02\u0C24\u0C2E\u0C48\u0C28 \u0C2A\u0C4D\u0C30\u0C15\u0C43\u0C24\u0C3F \u0C30\u0C40\u0C32\u0C4D\u0C38\u0C4D",
      nav_home: "\u0C39\u0C4B\u0C2E\u0C4D",
      nav_reels: "\u0C30\u0C40\u0C32\u0C4D\u0C38\u0C4D",
      nav_save: "\u0C38\u0C47\u0C35\u0C4D \u0C1A\u0C47\u0C38\u0C3F\u0C28\u0C35\u0C3F",
      tab_saved: "\u0C38\u0C47\u0C35\u0C4D \u0C1A\u0C47\u0C38\u0C3F\u0C28\u0C35\u0C3F",
      tab_liked: "\u0C07\u0C37\u0C4D\u0C1F\u0C2A\u0C21\u0C3F\u0C28\u0C35\u0C3F (Liked)",
      tab_downloaded: "\u0C21\u0C4C\u0C28\u0C4D\u200C\u0C32\u0C4B\u0C21\u0C4D\u0C38\u0C4D",
      drawer_language: "\u0C2D\u0C3E\u0C37",
      drawer_feedback: "\u0C2B\u0C40\u0C21\u0C4D\u200C\u0C2C\u0C4D\u0C2F\u0C3E\u0C15\u0C4D",
      drawer_rate: "\u0C30\u0C47\u0C1F\u0C3F\u0C02\u0C17\u0C4D \u0C07\u0C35\u0C4D\u0C35\u0C02\u0C21\u0C3F",
      drawer_share: "\u0C2F\u0C3E\u0C2A\u0C4D \u0C37\u0C47\u0C30\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F",
      drawer_privacy: "\u0C17\u0C4B\u0C2A\u0C4D\u0C2F\u0C24\u0C3E \u0C35\u0C3F\u0C27\u0C3E\u0C28\u0C02",
      category_trending: "\u0C1F\u0C4D\u0C30\u0C46\u0C02\u0C21\u0C3F\u0C02\u0C17\u0C4D",
      category_nature: "\u0C2A\u0C4D\u0C30\u0C15\u0C43\u0C24\u0C3F",
      category_forest: "\u0C05\u0C21\u0C35\u0C3F",
      category_mountain: "\u0C2A\u0C30\u0C4D\u0C35\u0C24\u0C02",
      category_rain: "\u0C35\u0C30\u0C4D\u0C37\u0C02",
      category_river: "\u0C28\u0C26\u0C3F",
      category_waterfall: "\u0C1C\u0C32\u0C2A\u0C3E\u0C24\u0C02",
      category_ocean: "\u0C38\u0C2E\u0C41\u0C26\u0C4D\u0C30\u0C02",
      category_beach: "\u0C2C\u0C40\u0C1A\u0C4D",
      category_sunset: "\u0C38\u0C42\u0C30\u0C4D\u0C2F\u0C3E\u0C38\u0C4D\u0C24\u0C2E\u0C2F\u0C02",
      category_sunrise: "\u0C38\u0C42\u0C30\u0C4D\u0C2F\u0C4B\u0C26\u0C2F\u0C02",
      category_flowers: "\u0C2A\u0C42\u0C32\u0C41",
      category_wildlife: "\u0C35\u0C28\u0C4D\u0C2F\u0C2A\u0C4D\u0C30\u0C3E\u0C23\u0C41\u0C32\u0C41",
      category_birds: "\u0C2A\u0C15\u0C4D\u0C37\u0C41\u0C32\u0C41",
      category_clouds: "\u0C2E\u0C47\u0C18\u0C3E\u0C32\u0C41",
      category_snow: "\u0C2E\u0C02\u0C1A\u0C41",
      category_greenery: "\u0C2A\u0C1A\u0C4D\u0C1A\u0C26\u0C28\u0C02",
      category_lake: "\u0C38\u0C30\u0C38\u0C4D\u0C38\u0C41",
      category_jungle: "\u0C26\u0C1F\u0C4D\u0C1F\u0C2E\u0C48\u0C28 \u0C05\u0C21\u0C35\u0C3F",
      category_night_sky: "\u0C30\u0C3E\u0C24\u0C4D\u0C30\u0C3F \u0C06\u0C15\u0C3E\u0C36\u0C02",
      action_like: "\u0C32\u0C48\u0C15\u0C4D",
      action_liked: "\u0C32\u0C48\u0C15\u0C4D \u0C1A\u0C47\u0C38\u0C3E\u0C30\u0C41",
      action_save: "\u0C38\u0C47\u0C35\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F",
      action_saved: "\u0C38\u0C47\u0C35\u0C4D \u0C1A\u0C47\u0C38\u0C3E\u0C30\u0C41",
      action_download: "\u0C21\u0C4C\u0C28\u0C4D\u200C\u0C32\u0C4B\u0C21\u0C4D",
      action_share: "\u0C37\u0C47\u0C30\u0C4D",
      action_delete: "\u0C24\u0C4A\u0C32\u0C17\u0C3F\u0C02\u0C1A\u0C41",
      action_cancel: "\u0C30\u0C26\u0C4D\u0C26\u0C41 \u0C1A\u0C47\u0C2F\u0C3F",
      action_done: "\u0C2A\u0C42\u0C30\u0C4D\u0C24\u0C2F\u0C3F\u0C02\u0C26\u0C3F",
      action_submit: "\u0C38\u0C2E\u0C30\u0C4D\u0C2A\u0C3F\u0C02\u0C1A\u0C41",
      empty_category_title: "\u0C08 \u0C35\u0C30\u0C4D\u0C17\u0C02\u0C32\u0C4B \u0C07\u0C02\u0C15\u0C3E \u0C30\u0C40\u0C32\u0C4D\u0C38\u0C4D \u0C05\u0C02\u0C26\u0C41\u0C2C\u0C3E\u0C1F\u0C41\u0C32\u0C4B \u0C32\u0C47\u0C35\u0C41.",
      empty_category_sub: "\u0C24\u0C4D\u0C35\u0C30\u0C32\u0C4B\u0C28\u0C47 \u0C15\u0C4A\u0C24\u0C4D\u0C24 \u0C2A\u0C4D\u0C30\u0C15\u0C43\u0C24\u0C3F \u0C26\u0C43\u0C36\u0C4D\u0C2F\u0C3E\u0C32\u0C41 \u0C1C\u0C4B\u0C21\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C24\u0C3E\u0C2F\u0C3F.",
      empty_saved_title: "\u0C07\u0C02\u0C15\u0C3E \u0C38\u0C47\u0C35\u0C4D \u0C1A\u0C47\u0C38\u0C3F\u0C28 \u0C30\u0C40\u0C32\u0C4D\u0C38\u0C4D \u0C32\u0C47\u0C35\u0C41.",
      empty_saved_sub: "\u0C24\u0C30\u0C4D\u0C35\u0C3E\u0C24 \u0C1A\u0C42\u0C21\u0C1F\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C2E\u0C40 \u0C07\u0C37\u0C4D\u0C1F\u0C2E\u0C48\u0C28 \u0C30\u0C40\u0C32\u0C4D\u0C38\u0C4D \u0C38\u0C47\u0C35\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F.",
      empty_liked_title: "\u0C07\u0C37\u0C4D\u0C1F\u0C2A\u0C21\u0C3F\u0C28 \u0C30\u0C40\u0C32\u0C4D\u0C38\u0C4D \u0C07\u0C02\u0C15\u0C3E \u0C32\u0C47\u0C35\u0C41.",
      empty_liked_sub: "\u0C17\u0C41\u0C02\u0C21\u0C46 \u0C1A\u0C3F\u0C39\u0C4D\u0C28\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C28\u0C4A\u0C15\u0C4D\u0C15\u0C21\u0C02 \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C2E\u0C40\u0C15\u0C41 \u0C28\u0C1A\u0C4D\u0C1A\u0C3F\u0C28 \u0C30\u0C40\u0C32\u0C4D\u0C38\u0C4D\u200C\u0C28\u0C41 \u0C32\u0C48\u0C15\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F.",
      empty_downloads_title: "\u0C07\u0C02\u0C15\u0C3E \u0C21\u0C4C\u0C28\u0C4D\u200C\u0C32\u0C4B\u0C21\u0C4D\u200C\u0C32\u0C41 \u0C32\u0C47\u0C35\u0C41.",
      empty_downloads_sub: "\u0C07\u0C02\u0C1F\u0C30\u0C4D\u0C28\u0C46\u0C1F\u0C4D \u0C32\u0C47\u0C15\u0C41\u0C02\u0C21\u0C3E \u0C1A\u0C42\u0C21\u0C1F\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C21\u0C4C\u0C28\u0C4D\u200C\u0C32\u0C4B\u0C21\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F.",
      download_started: "\u0C21\u0C4C\u0C28\u0C4D\u200C\u0C32\u0C4B\u0C21\u0C4D \u0C2A\u0C4D\u0C30\u0C3E\u0C30\u0C02\u0C2D\u0C2E\u0C35\u0C41\u0C24\u0C4B\u0C02\u0C26\u0C3F...",
      download_complete: "\u0C35\u0C3F\u0C1C\u0C2F\u0C35\u0C02\u0C24\u0C02\u0C17\u0C3E \u0C21\u0C4C\u0C28\u0C4D\u200C\u0C32\u0C4B\u0C21\u0C4D \u0C05\u0C2F\u0C3F\u0C02\u0C26\u0C3F!",
      download_error: "\u0C21\u0C4C\u0C28\u0C4D\u200C\u0C32\u0C4B\u0C21\u0C4D \u0C35\u0C3F\u0C2B\u0C32\u0C2E\u0C48\u0C02\u0C26\u0C3F.",
      offline_badge: "\u0C06\u0C2B\u0C4D\u200C\u0C32\u0C48\u0C28\u0C4D \u0C2A\u0C4D\u0C32\u0C47\u0C2C\u0C4D\u0C2F\u0C3E\u0C15\u0C4D",
      select_language_title: "\u0C2D\u0C3E\u0C37\u0C28\u0C41 \u0C0E\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C02\u0C21\u0C3F",
      feedback_title: "\u0C2B\u0C40\u0C21\u0C4D\u200C\u0C2C\u0C4D\u0C2F\u0C3E\u0C15\u0C4D \u0C07\u0C35\u0C4D\u0C35\u0C02\u0C21\u0C3F",
      feedback_placeholder: "\u0C2E\u0C40 \u0C38\u0C42\u0C1A\u0C28\u0C32\u0C28\u0C41 \u0C07\u0C15\u0C4D\u0C15\u0C21 \u0C30\u0C3E\u0C2F\u0C02\u0C21\u0C3F...",
      feedback_rating_label: "\u0C2E\u0C40 \u0C30\u0C47\u0C1F\u0C3F\u0C02\u0C17\u0C4D",
      feedback_thanks: "\u0C2E\u0C40 \u0C35\u0C3F\u0C32\u0C41\u0C35\u0C48\u0C28 \u0C2B\u0C40\u0C21\u0C4D\u200C\u0C2C\u0C4D\u0C2F\u0C3E\u0C15\u0C4D\u200C\u0C15\u0C41 \u0C27\u0C28\u0C4D\u0C2F\u0C35\u0C3E\u0C26\u0C3E\u0C32\u0C41!",
      privacy_title: "\u0C17\u0C4B\u0C2A\u0C4D\u0C2F\u0C24\u0C3E \u0C35\u0C3F\u0C27\u0C3E\u0C28\u0C02",
      privacy_intro: "\u0C16\u0C3E\u0C24\u0C3E \u0C05\u0C35\u0C38\u0C30\u0C02 \u0C32\u0C47\u0C15\u0C41\u0C02\u0C21\u0C3E 100% \u0C2A\u0C4D\u0C30\u0C48\u0C35\u0C47\u0C1F\u0C4D\u200C\u0C17\u0C3E \u0C09\u0C2A\u0C2F\u0C4B\u0C17\u0C3F\u0C02\u0C1A\u0C35\u0C1A\u0C4D\u0C1A\u0C41.",
      rate_title: "\u0C2F\u0C3E\u0C2A\u0C4D\u200C\u0C28\u0C41 \u0C30\u0C47\u0C1F\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F",
      rate_sub: "\u0C26\u0C2F\u0C1A\u0C47\u0C38\u0C3F \u0C2A\u0C4D\u0C32\u0C47 \u0C38\u0C4D\u0C1F\u0C4B\u0C30\u0C4D\u200C\u0C32\u0C4B \u0C30\u0C47\u0C1F\u0C3F\u0C02\u0C17\u0C4D \u0C07\u0C35\u0C4D\u0C35\u0C02\u0C21\u0C3F!",
      rate_button: "\u0C2A\u0C4D\u0C32\u0C47 \u0C38\u0C4D\u0C1F\u0C4B\u0C30\u0C4D\u200C\u0C32\u0C4B \u0C30\u0C47\u0C1F\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F"
    },
    kn: {
      app_title: "\u0CA8\u0CC7\u0C9A\u0CB0\u0CCD \u0CB8\u0CCD\u0C9F\u0CC7\u0C9F\u0CB8\u0CCD",
      app_tagline: "\u0CB6\u0CBE\u0C82\u0CA4\u0CBF\u0CAF\u0CC1\u0CA4 \u0CAA\u0CCD\u0CB0\u0C95\u0CC3\u0CA4\u0CBF \u0CB0\u0CC0\u0CB2\u0CCD\u0CB8\u0CCD",
      nav_home: "\u0CAE\u0CC1\u0C96\u0CAA\u0CC1\u0C9F",
      nav_reels: "\u0CB0\u0CC0\u0CB2\u0CCD\u0CB8\u0CCD",
      nav_save: "\u0C89\u0CB3\u0CBF\u0CB8\u0CBF\u0CA6\u0CB5\u0CC1",
      tab_saved: "\u0C89\u0CB3\u0CBF\u0CB8\u0CBF\u0CA6\u0CB5\u0CC1",
      tab_liked: "\u0C87\u0CB7\u0CCD\u0C9F\u0CAA\u0C9F\u0CCD\u0C9F\u0CB5\u0CC1 (Liked)",
      tab_downloaded: "\u0CA1\u0CCC\u0CA8\u0CCD\u200C\u0CB2\u0CCB\u0CA1\u0CCD\u200C\u0C97\u0CB3\u0CC1",
      drawer_language: "\u0CAD\u0CBE\u0CB7\u0CC6",
      drawer_feedback: "\u0CAA\u0CCD\u0CB0\u0CA4\u0CBF\u0C95\u0CCD\u0CB0\u0CBF\u0CAF\u0CC6",
      drawer_rate: "\u0CB0\u0CC7\u0C9F\u0CBF\u0C82\u0C97\u0CCD \u0CA8\u0CC0\u0CA1\u0CBF",
      drawer_share: "\u0C86\u0CCD\u0CAF\u0CAA\u0CCD \u0CB9\u0C82\u0C9A\u0CBF\u0C95\u0CCA\u0CB3\u0CCD\u0CB3\u0CBF",
      drawer_privacy: "\u0C97\u0CCC\u0CAA\u0CCD\u0CAF\u0CA4\u0CC6 \u0CA8\u0CC0\u0CA4\u0CBF",
      category_trending: "\u0C9F\u0CCD\u0CB0\u0CC6\u0C82\u0CA1\u0CBF\u0C82\u0C97\u0CCD",
      category_nature: "\u0CAA\u0CCD\u0CB0\u0C95\u0CC3\u0CA4\u0CBF",
      category_forest: "\u0C95\u0CBE\u0CA1\u0CC1",
      category_mountain: "\u0CAA\u0CB0\u0CCD\u0CB5\u0CA4",
      category_rain: "\u0CAE\u0CB3\u0CC6",
      category_river: "\u0CA8\u0CA6\u0CBF",
      category_waterfall: "\u0C9C\u0CB2\u0CAA\u0CBE\u0CA4",
      category_ocean: "\u0CB8\u0CBE\u0C97\u0CB0",
      category_beach: "\u0C95\u0CA1\u0CB2\u0CA4\u0CC0\u0CB0",
      category_sunset: "\u0CB8\u0CC2\u0CB0\u0CCD\u0CAF\u0CBE\u0CB8\u0CCD\u0CA4",
      category_sunrise: "\u0CB8\u0CC2\u0CB0\u0CCD\u0CAF\u0CCB\u0CA6\u0CAF",
      category_flowers: "\u0CB9\u0CC2\u0CB5\u0CC1\u0C97\u0CB3\u0CC1",
      category_wildlife: "\u0CB5\u0CA8\u0CCD\u0CAF\u0C9C\u0CC0\u0CB5\u0CBF",
      category_birds: "\u0CAA\u0C95\u0CCD\u0CB7\u0CBF\u0C97\u0CB3\u0CC1",
      category_clouds: "\u0CAE\u0CCB\u0CA1\u0C97\u0CB3\u0CC1",
      category_snow: "\u0CB9\u0CBF\u0CAE\u0CAA\u0CBE\u0CA4",
      category_greenery: "\u0CB9\u0CB8\u0CBF\u0CB0\u0CC1",
      category_lake: "\u0CB8\u0CB0\u0CCB\u0CB5\u0CB0",
      category_jungle: "\u0CA6\u0C9F\u0CCD\u0C9F \u0C85\u0CB0\u0CA3\u0CCD\u0CAF",
      category_night_sky: "\u0CB0\u0CBE\u0CA4\u0CCD\u0CB0\u0CBF \u0C86\u0C95\u0CBE\u0CB6",
      action_like: "\u0C87\u0CB7\u0CCD\u0C9F\u0CAA\u0CA1\u0CBF",
      action_liked: "\u0C87\u0CB7\u0CCD\u0C9F\u0CAA\u0C9F\u0CCD\u0C9F\u0CBF\u0CA6\u0CCD\u0CA6\u0CC0\u0CB0\u0CBF",
      action_save: "\u0C89\u0CB3\u0CBF\u0CB8\u0CBF",
      action_saved: "\u0C89\u0CB3\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CBF\u0CA6\u0CC6",
      action_download: "\u0CA1\u0CCC\u0CA8\u0CCD\u200C\u0CB2\u0CCB\u0CA1\u0CCD",
      action_share: "\u0CB9\u0C82\u0C9A\u0CBF\u0C95\u0CCA\u0CB3\u0CCD\u0CB3\u0CBF",
      action_delete: "\u0C85\u0CB3\u0CBF\u0CB8\u0CBF",
      action_cancel: "\u0CB0\u0CA6\u0CCD\u0CA6\u0CC1\u0CAE\u0CBE\u0CA1\u0CBF",
      action_done: "\u0CAE\u0CC1\u0C97\u0CBF\u0CA6\u0CBF\u0CA6\u0CC6",
      action_submit: "\u0CB8\u0CB2\u0CCD\u0CB2\u0CBF\u0CB8\u0CBF",
      empty_category_title: "\u0C88 \u0CB5\u0CBF\u0CAD\u0CBE\u0C97\u0CA6\u0CB2\u0CCD\u0CB2\u0CBF \u0C87\u0CA8\u0CCD\u0CA8\u0CC2 \u0CB0\u0CC0\u0CB2\u0CCD\u0CB8\u0CCD \u0CB2\u0CAD\u0CCD\u0CAF\u0CB5\u0CBF\u0CB2\u0CCD\u0CB2.",
      empty_category_sub: "\u0CB6\u0CC0\u0C98\u0CCD\u0CB0\u0CA6\u0CB2\u0CCD\u0CB2\u0CC7 \u0CB9\u0CCA\u0CB8 \u0CAA\u0CCD\u0CB0\u0C95\u0CC3\u0CA4\u0CBF\u0CAF \u0C95\u0CCD\u0CB7\u0CA3\u0C97\u0CB3\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB8\u0CC7\u0CB0\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CC1\u0CB5\u0CC1\u0CA6\u0CC1.",
      empty_saved_title: "\u0C87\u0CA8\u0CCD\u0CA8\u0CC2 \u0CAF\u0CBE\u0CB5\u0CC1\u0CA6\u0CC7 \u0C89\u0CB3\u0CBF\u0CB8\u0CBF\u0CA6 \u0CB0\u0CC0\u0CB2\u0CCD\u0CB8\u0CCD \u0C87\u0CB2\u0CCD\u0CB2.",
      empty_saved_sub: "\u0CA8\u0C82\u0CA4\u0CB0 \u0CB5\u0CC0\u0C95\u0CCD\u0CB7\u0CBF\u0CB8\u0CB2\u0CC1 \u0CA8\u0CBF\u0CAE\u0CCD\u0CAE \u0CA8\u0CC6\u0C9A\u0CCD\u0C9A\u0CBF\u0CA8 \u0CB0\u0CC0\u0CB2\u0CCD\u0CB8\u0CCD \u0C89\u0CB3\u0CBF\u0CB8\u0CBF.",
      empty_liked_title: "\u0C87\u0CA8\u0CCD\u0CA8\u0CC2 \u0CAF\u0CBE\u0CB5\u0CC1\u0CA6\u0CC7 \u0CB0\u0CC0\u0CB2\u0CCD\u200C\u0C97\u0CB3\u0CC1 \u0C87\u0CB7\u0CCD\u0C9F\u0CB5\u0CBE\u0C97\u0CBF\u0CB2\u0CCD\u0CB2.",
      empty_liked_sub: "\u0CB9\u0CC3\u0CA6\u0CAF\u0CA6 \u0C90\u0C95\u0CBE\u0CA8\u0CCD \u0C92\u0CA4\u0CCD\u0CA4\u0CBF \u0CA8\u0CBF\u0CAE\u0CCD\u0CAE \u0CA8\u0CC6\u0C9A\u0CCD\u0C9A\u0CBF\u0CA8 \u0CB0\u0CC0\u0CB2\u0CCD\u200C\u0C97\u0CB3\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB2\u0CC8\u0C95\u0CCD \u0CAE\u0CBE\u0CA1\u0CBF.",
      empty_downloads_title: "\u0C87\u0CA8\u0CCD\u0CA8\u0CC2 \u0CAF\u0CBE\u0CB5\u0CC1\u0CA6\u0CC7 \u0CA1\u0CCC\u0CA8\u0CCD\u200C\u0CB2\u0CCB\u0CA1\u0CCD\u200C\u0C97\u0CB3\u0CC1 \u0C87\u0CB2\u0CCD\u0CB2.",
      empty_downloads_sub: "\u0C86\u0CAB\u0CCD\u200C\u0CB2\u0CC8\u0CA8\u0CCD\u200C\u0CA8\u0CB2\u0CCD\u0CB2\u0CBF \u0CB5\u0CC0\u0C95\u0CCD\u0CB7\u0CBF\u0CB8\u0CB2\u0CC1 \u0CA1\u0CCC\u0CA8\u0CCD\u200C\u0CB2\u0CCB\u0CA1\u0CCD \u0CAE\u0CBE\u0CA1\u0CBF.",
      download_started: "\u0CA1\u0CCC\u0CA8\u0CCD\u200C\u0CB2\u0CCB\u0CA1\u0CCD \u0CAA\u0CCD\u0CB0\u0CBE\u0CB0\u0C82\u0CAD\u0CB5\u0CBE\u0C97\u0CC1\u0CA4\u0CCD\u0CA4\u0CBF\u0CA6\u0CC6...",
      download_complete: "\u0CAF\u0CB6\u0CB8\u0CCD\u0CB5\u0CBF\u0CAF\u0CBE\u0C97\u0CBF \u0CA1\u0CCC\u0CA8\u0CCD\u200C\u0CB2\u0CCB\u0CA1\u0CCD \u0C86\u0C97\u0CBF\u0CA6\u0CC6!",
      download_error: "\u0CA1\u0CCC\u0CA8\u0CCD\u200C\u0CB2\u0CCB\u0CA1\u0CCD \u0CB5\u0CBF\u0CAB\u0CB2\u0CB5\u0CBE\u0C97\u0CBF\u0CA6\u0CC6.",
      offline_badge: "\u0C86\u0CAB\u0CCD\u200C\u0CB2\u0CC8\u0CA8\u0CCD \u0CAA\u0CCD\u0CB2\u0CC7\u0CAC\u0CCD\u0CAF\u0CBE\u0C95\u0CCD",
      select_language_title: "\u0CAD\u0CBE\u0CB7\u0CC6\u0CAF\u0CA8\u0CCD\u0CA8\u0CC1 \u0C86\u0CB0\u0CBF\u0CB8\u0CBF",
      feedback_title: "\u0CAA\u0CCD\u0CB0\u0CA4\u0CBF\u0C95\u0CCD\u0CB0\u0CBF\u0CAF\u0CC6 \u0C95\u0CB3\u0CC1\u0CB9\u0CBF\u0CB8\u0CBF",
      feedback_placeholder: "\u0CA8\u0CBF\u0CAE\u0CCD\u0CAE \u0C85\u0CAD\u0CBF\u0CAA\u0CCD\u0CB0\u0CBE\u0CAF\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0C87\u0CB2\u0CCD\u0CB2\u0CBF \u0CA4\u0CBF\u0CB3\u0CBF\u0CB8\u0CBF...",
      feedback_rating_label: "\u0CA8\u0CBF\u0CAE\u0CCD\u0CAE \u0CB0\u0CC7\u0C9F\u0CBF\u0C82\u0C97\u0CCD",
      feedback_thanks: "\u0CA8\u0CBF\u0CAE\u0CCD\u0CAE \u0C85\u0CAE\u0CC2\u0CB2\u0CCD\u0CAF \u0CAA\u0CCD\u0CB0\u0CA4\u0CBF\u0C95\u0CCD\u0CB0\u0CBF\u0CAF\u0CC6\u0C97\u0CC6 \u0CA7\u0CA8\u0CCD\u0CAF\u0CB5\u0CBE\u0CA6\u0C97\u0CB3\u0CC1!",
      privacy_title: "\u0C97\u0CCC\u0CAA\u0CCD\u0CAF\u0CA4\u0CC6 \u0CA8\u0CC0\u0CA4\u0CBF",
      privacy_intro: "\u0C96\u0CBE\u0CA4\u0CC6\u0CAF \u0C85\u0C97\u0CA4\u0CCD\u0CAF\u0CB5\u0CBF\u0CB2\u0CCD\u0CB2\u0CA6\u0CC6 100% \u0CB8\u0CC1\u0CB0\u0C95\u0CCD\u0CB7\u0CBF\u0CA4 \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0C97\u0CCC\u0CAA\u0CCD\u0CAF.",
      rate_title: "\u0C86\u0CCD\u0CAF\u0CAA\u0CCD \u0CB0\u0CC7\u0C9F\u0CCD \u0CAE\u0CBE\u0CA1\u0CBF",
      rate_sub: "\u0CA6\u0CAF\u0CB5\u0CBF\u0C9F\u0CCD\u0C9F\u0CC1 \u0CAA\u0CCD\u0CB2\u0CC7 \u0CB8\u0CCD\u0C9F\u0CCB\u0CB0\u0CCD\u200C\u0CA8\u0CB2\u0CCD\u0CB2\u0CBF \u0CA8\u0CAE\u0C97\u0CC6 \u0CB0\u0CC7\u0C9F\u0CBF\u0C82\u0C97\u0CCD \u0CA8\u0CC0\u0CA1\u0CBF!",
      rate_button: "\u0CAA\u0CCD\u0CB2\u0CC7 \u0CB8\u0CCD\u0C9F\u0CCB\u0CB0\u0CCD\u200C\u0CA8\u0CB2\u0CCD\u0CB2\u0CBF \u0CB0\u0CC7\u0C9F\u0CCD \u0CAE\u0CBE\u0CA1\u0CBF"
    }
  };
  var I18nService = class {
    constructor() {
      this.currentLang = storage.getLanguage() || "en";
    }
    getLanguage() {
      return this.currentLang;
    }
    setLanguage(code) {
      if (TRANSLATIONS[code]) {
        this.currentLang = code;
        storage.setLanguage(code);
        this.updateDom();
      }
    }
    t(key, fallback = "") {
      const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.en;
      return dict[key] || TRANSLATIONS.en[key] || fallback || key;
    }
    // Translates all elements with data-i18n attribute in DOM
    updateDom() {
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const text = this.t(key);
        if (text) el.textContent = text;
      });
      document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        const text = this.t(key);
        if (text) el.setAttribute("placeholder", text);
      });
      document.querySelectorAll("[data-i18n-title]").forEach((el) => {
        const key = el.getAttribute("data-i18n-title");
        const text = this.t(key);
        if (text) el.setAttribute("title", text);
      });
      window.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang: this.currentLang } }));
    }
  };
  var i18n = new I18nService();

  // js/data/reels.js
  var REELS_DATA = [];
  var APP_STORAGE_VERSION = "v10_clean_user_only_1789863800";
  var DEMO_REEL_IDS = /* @__PURE__ */ new Set([
    "reel-forest-01",
    "reel-flowers-01",
    "reel-waterfall-01",
    "reel-ocean-01",
    "reel-forest-0262u",
    "reel-mountains-z3ycr",
    "reel-ocean-1t68t",
    "reel-rain-ydez8",
    "reel-forest-z3ycr",
    "reel-forest-1t68t",
    "reel-forest-ydez8",
    "reel-user-nature-1"
  ]);
  function normalizeVideoUrl(url) {
    if (!url || typeof url !== "string") return url;
    url = url.trim();
    if (url.startsWith("blob:") || url.startsWith("data:")) return url;
    if (url.includes("drive.google.com")) {
      const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
      }
    }
    if (url.includes("dropbox.com")) {
      return url.replace(/[?&]dl=0/, "?raw=1").replace(/[?&]dl=1/, "?raw=1");
    }
    if (url.includes("github.com") && url.includes("/blob/")) {
      return url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
    }
    let filename = "";
    if (url.startsWith("/uploads/")) {
      filename = url.replace(/^\/uploads\//, "");
    } else if (url.includes("raw.githubusercontent.com/gulshanyadaav8810-svg/terra-nova-nature/main/uploads/")) {
      filename = url.split("/uploads/")[1];
    } else if (url.includes("cdn.jsdelivr.net/gh/gulshanyadaav8810-svg/terra-nova-nature@main/uploads/")) {
      filename = url.split("/uploads/")[1];
    }
    if (filename) {
      return `https://raw.githubusercontent.com/gulshanyadaav8810-svg/terra-nova-nature/main/uploads/${filename}`;
    }
    return url;
  }
  function normalizeImageUrl(url) {
    if (!url || typeof url !== "string") return url;
    if (url.startsWith("blob:") || url.startsWith("data:")) return url;
    let filename = "";
    if (url.startsWith("/uploads/")) {
      filename = url.replace(/^\/uploads\//, "");
    } else if (url.includes("raw.githubusercontent.com/gulshanyadaav8810-svg/terra-nova-nature/main/uploads/")) {
      filename = url.split("/uploads/")[1];
    } else if (url.includes("cdn.jsdelivr.net/gh/gulshanyadaav8810-svg/terra-nova-nature@main/uploads/")) {
      filename = url.split("/uploads/")[1];
    }
    if (filename) {
      return `https://raw.githubusercontent.com/gulshanyadaav8810-svg/terra-nova-nature/main/uploads/${filename}`;
    }
    return url;
  }
  function isDemoReel(r) {
    if (!r || !r.content_id) return true;
    if (DEMO_REEL_IDS.has(r.content_id)) return true;
    const url = (r.video_url || "").toLowerCase();
    if (url.includes("nature_stream.mp4") || url.includes("flower.mp4")) return true;
    const title = (r.title || "").toLowerCase();
    if (title.includes("spring wildflowers") || title.includes("alpine meadows")) return true;
    return false;
  }
  if (typeof window !== "undefined") {
    try {
      const currentVer = localStorage.getItem("nature_storage_version");
      if (currentVer !== APP_STORAGE_VERSION) {
        localStorage.removeItem("nature_remote_reels");
        localStorage.removeItem("nature_custom_reels");
        localStorage.removeItem("nature_deleted_reels");
        localStorage.setItem("nature_storage_version", APP_STORAGE_VERSION);
      }
    } catch (e) {
    }
  }
  function getReelsFingerprint(list) {
    if (!Array.isArray(list) || list.length === 0) return "";
    return list.map((r) => `${r.content_id}#${r.thumbnail_url}#${r.video_url}#${r.title}#${r.category_id}#${r.is_trending ? 1 : 0}`).join("|");
  }
  function loadAllReels() {
    const mergedMap = /* @__PURE__ */ new Map();
    let deletedIds = new Set(DEMO_REEL_IDS);
    try {
      const rawDeleted = localStorage.getItem("nature_deleted_reels");
      if (rawDeleted) {
        const parsed = JSON.parse(rawDeleted);
        if (Array.isArray(parsed)) {
          parsed.forEach((id) => deletedIds.add(id));
        }
      }
    } catch (e) {
    }
    try {
      const remote = localStorage.getItem("nature_remote_reels");
      if (remote) {
        const parsed = JSON.parse(remote);
        if (Array.isArray(parsed)) {
          const sanitizedRemote = parsed.filter((r) => !isDemoReel(r) && !deletedIds.has(r.content_id));
          if (sanitizedRemote.length !== parsed.length) {
            localStorage.setItem("nature_remote_reels", JSON.stringify(sanitizedRemote));
          }
          sanitizedRemote.forEach((r) => {
            if (r.video_url && !r.video_url.startsWith("blob:")) {
              mergedMap.set(r.content_id, {
                ...r,
                video_url: normalizeVideoUrl(r.video_url),
                thumbnail_url: normalizeImageUrl(r.thumbnail_url)
              });
            }
          });
        }
      }
    } catch (e) {
      console.warn("Error reading nature_remote_reels from localStorage:", e);
    }
    const isAdmin = typeof window !== "undefined" && window.location && window.location.pathname.includes("admin");
    if (isAdmin) {
      try {
        const custom = localStorage.getItem("nature_custom_reels");
        if (custom) {
          const parsed = JSON.parse(custom);
          if (Array.isArray(parsed)) {
            const sanitizedCustom = parsed.filter((r) => !isDemoReel(r) && !deletedIds.has(r.content_id));
            sanitizedCustom.forEach((r) => {
              if (r.video_url && !r.video_url.startsWith("blob:")) {
                if (!mergedMap.has(r.content_id)) {
                  mergedMap.set(r.content_id, {
                    ...r,
                    video_url: normalizeVideoUrl(r.video_url),
                    thumbnail_url: normalizeImageUrl(r.thumbnail_url)
                  });
                }
              }
            });
          }
        }
      } catch (e) {
      }
    }
    try {
      const engagements = JSON.parse(localStorage.getItem("nature_reels_engagement") || "{}");
      mergedMap.forEach((r, id) => {
        if (engagements[id]) {
          const eng = engagements[id];
          if (typeof eng.likes === "number") r.likes_count = eng.likes;
          if (typeof eng.shares === "number") r.shares_count = eng.shares;
          if (typeof eng.downloads === "number") r.downloads_count = eng.downloads;
          if (typeof eng.views === "number") r.views_count = eng.views;
        }
      });
    } catch (e) {
      console.warn("Error applying engagement overrides:", e);
    }
    const all = Array.from(mergedMap.values());
    all.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    REELS_DATA = all;
    return REELS_DATA;
  }
  loadAllReels();
  var CLOUD_API_URL = "https://nature-moments-app.vercel.app/api/reels";
  async function syncRemoteReels() {
    const urls = [
      `${CLOUD_API_URL}?t=${Date.now()}`,
      `https://raw.githubusercontent.com/gulshanyadaav8810-svg/terra-nova-nature/main/data/reels.json?t=${Date.now()}`,
      `data/reels.json?t=${Date.now()}`
    ];
    let deletedIds = new Set(DEMO_REEL_IDS);
    try {
      const rawDeleted = localStorage.getItem("nature_deleted_reels");
      if (rawDeleted) {
        const parsed = JSON.parse(rawDeleted);
        if (Array.isArray(parsed)) {
          parsed.forEach((id) => deletedIds.add(id));
        }
      }
    } catch (e) {
    }
    for (const url of urls) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
          const remoteReels = await res.json();
          if (Array.isArray(remoteReels)) {
            const cleanRemote = remoteReels.filter((r) => !isDemoReel(r) && !deletedIds.has(r.content_id));
            try {
              localStorage.setItem("nature_remote_reels", JSON.stringify(cleanRemote));
            } catch (e) {
            }
            const remoteIdSet = new Set(cleanRemote.map((r) => r.content_id));
            try {
              const custom = localStorage.getItem("nature_custom_reels");
              if (custom) {
                const parsed = JSON.parse(custom);
                if (Array.isArray(parsed)) {
                  const cleanedCustom = parsed.filter((r) => {
                    if (deletedIds.has(r.content_id) || isDemoReel(r)) return false;
                    if (remoteIdSet.has(r.content_id)) return true;
                    const age = Date.now() - new Date(r.created_at || 0).getTime();
                    return age < 6e4;
                  });
                  localStorage.setItem("nature_custom_reels", JSON.stringify(cleanedCustom));
                }
              }
            } catch (e) {
            }
            const merged = /* @__PURE__ */ new Map();
            cleanRemote.forEach((r) => {
              if (r.video_url && !r.video_url.startsWith("blob:")) {
                merged.set(r.content_id, {
                  ...r,
                  video_url: normalizeVideoUrl(r.video_url),
                  thumbnail_url: normalizeImageUrl(r.thumbnail_url)
                });
              }
            });
            const isAdmin = typeof window !== "undefined" && window.location && window.location.pathname.includes("admin");
            if (isAdmin) {
              try {
                const custom = localStorage.getItem("nature_custom_reels");
                if (custom) {
                  const parsed = JSON.parse(custom);
                  if (Array.isArray(parsed)) {
                    parsed.forEach((r) => {
                      if (r && !isDemoReel(r) && !deletedIds.has(r.content_id)) {
                        if (r.video_url && !r.video_url.startsWith("blob:")) {
                          if (!merged.has(r.content_id)) {
                            merged.set(r.content_id, {
                              ...r,
                              video_url: normalizeVideoUrl(r.video_url),
                              thumbnail_url: normalizeImageUrl(r.thumbnail_url)
                            });
                          }
                        }
                      }
                    });
                  }
                }
              } catch (e) {
              }
            }
            try {
              const engagements = JSON.parse(localStorage.getItem("nature_reels_engagement") || "{}");
              merged.forEach((r, id) => {
                if (engagements[id]) {
                  const eng = engagements[id];
                  if (typeof eng.likes === "number") r.likes_count = Math.max(r.likes_count || 0, eng.likes);
                  if (typeof eng.shares === "number") r.shares_count = Math.max(r.shares_count || 0, eng.shares);
                  if (typeof eng.downloads === "number") r.downloads_count = Math.max(r.downloads_count || 0, eng.downloads);
                  if (typeof eng.views === "number") r.views_count = Math.max(r.views_count || 0, eng.views);
                }
              });
            } catch (e) {
            }
            const all = Array.from(merged.values());
            all.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
            const oldFingerprint = getReelsFingerprint(REELS_DATA);
            const newFingerprint = getReelsFingerprint(all);
            const hasChanged = oldFingerprint !== newFingerprint || REELS_DATA.length === 0;
            REELS_DATA = all;
            if (hasChanged) {
              console.log("[ReelsSync] Content updated! Firing reelsUpdated event");
              window.dispatchEvent(new CustomEvent("reelsUpdated", { detail: REELS_DATA }));
            }
            return REELS_DATA;
          }
        }
      } catch (err) {
      }
    }
    return REELS_DATA;
  }
  if (typeof window !== "undefined") {
    window.addEventListener("online", () => syncRemoteReels());
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) syncRemoteReels();
    });
    syncRemoteReels();
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel("nature_moments_sync");
      channel.onmessage = (event) => {
        const { type, reel, content_id, reels } = event.data || {};
        if (type === "ADD_REEL" && reel) {
          loadAllReels();
          window.dispatchEvent(new CustomEvent("reelsUpdated", { detail: REELS_DATA }));
        } else if (type === "DELETE_REEL" && content_id) {
          try {
            const rawDeleted = localStorage.getItem("nature_deleted_reels");
            const deletedSet = rawDeleted ? new Set(JSON.parse(rawDeleted)) : /* @__PURE__ */ new Set();
            deletedSet.add(content_id);
            localStorage.setItem("nature_deleted_reels", JSON.stringify(Array.from(deletedSet)));
            const remote = JSON.parse(localStorage.getItem("nature_remote_reels") || "[]");
            const filtered = remote.filter((r) => r.content_id !== content_id);
            localStorage.setItem("nature_remote_reels", JSON.stringify(filtered));
          } catch (e) {
          }
          REELS_DATA = REELS_DATA.filter((r) => r.content_id !== content_id);
          window.dispatchEvent(new CustomEvent("reelsUpdated", { detail: REELS_DATA }));
        } else if (type === "SYNC_ALL_REELS" && Array.isArray(reels)) {
          try {
            localStorage.setItem("nature_remote_reels", JSON.stringify(reels));
          } catch (e) {
          }
          REELS_DATA = reels;
          window.dispatchEvent(new CustomEvent("reelsUpdated", { detail: REELS_DATA }));
        } else if (type === "UPDATE_REEL" && reel) {
          loadAllReels();
          window.dispatchEvent(new CustomEvent("reelsUpdated", { detail: REELS_DATA }));
        } else if (type === "ADD_REELS_BATCH" || type === "DELETE_REELS_BATCH" || type === "WIPE_ALL_REELS") {
          syncRemoteReels();
        } else if (type === "ENGAGEMENT_TRACKED") {
          loadAllReels();
          window.dispatchEvent(new CustomEvent("reelsUpdated", { detail: REELS_DATA }));
          window.dispatchEvent(new CustomEvent("reelEngagementUpdated", { detail: event.data }));
        }
      };
    }
  }
  function getReelsByCategory(categoryId) {
    loadAllReels();
    if (!categoryId || categoryId === "all") {
      return REELS_DATA;
    }
    if (categoryId === "trending") {
      return REELS_DATA.filter((r) => r.is_trending === true || r.category_id === "trending");
    }
    return REELS_DATA.filter((r) => r.category_id === categoryId);
  }
  function getReelById(contentId) {
    loadAllReels();
    return REELS_DATA.find((r) => r.content_id === contentId);
  }
  async function syncToCloudApi(action, data) {
    try {
      const payload = { action, ...data };
      await fetch(CLOUD_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (e) {
    }
  }
  function trackEngagement(contentId, metric) {
    let reel = REELS_DATA.find((r) => r.content_id === contentId);
    if (!reel) {
      loadAllReels();
      reel = REELS_DATA.find((r) => r.content_id === contentId);
    }
    let likesCount = reel ? reel.likes_count || 0 : 0;
    let sharesCount = reel ? reel.shares_count || 0 : 0;
    let downloadsCount = reel ? reel.downloads_count || 0 : 0;
    let viewsCount = reel ? reel.views_count || 0 : 0;
    if (metric === "like") likesCount += 1;
    else if (metric === "unlike") likesCount = Math.max(0, likesCount - 1);
    else if (metric === "share") sharesCount += 1;
    else if (metric === "download") downloadsCount += 1;
    else if (metric === "view") viewsCount += 1;
    if (reel) {
      reel.likes_count = likesCount;
      reel.shares_count = sharesCount;
      reel.downloads_count = downloadsCount;
      reel.views_count = viewsCount;
    }
    try {
      const engagements = JSON.parse(localStorage.getItem("nature_reels_engagement") || "{}");
      engagements[contentId] = {
        likes: likesCount,
        shares: sharesCount,
        downloads: downloadsCount,
        views: viewsCount
      };
      localStorage.setItem("nature_reels_engagement", JSON.stringify(engagements));
      const custom = JSON.parse(localStorage.getItem("nature_custom_reels") || "[]");
      const target = custom.find((r) => r.content_id === contentId);
      if (target) {
        target.likes_count = likesCount;
        target.shares_count = sharesCount;
        target.downloads_count = downloadsCount;
        target.views_count = viewsCount;
        localStorage.setItem("nature_custom_reels", JSON.stringify(custom));
      }
    } catch (e) {
      console.warn("Error persisting engagement:", e);
    }
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel("nature_moments_sync");
      channel.postMessage({
        type: "ENGAGEMENT_TRACKED",
        content_id: contentId,
        metric,
        likes_count: likesCount,
        shares_count: sharesCount,
        downloads_count: downloadsCount
      });
    }
    window.dispatchEvent(new CustomEvent("reelEngagementUpdated", {
      detail: { content_id: contentId, metric, likes_count: likesCount, shares_count: sharesCount, downloads_count: downloadsCount }
    }));
    syncToCloudApi("track", { content_id: contentId, metric });
    return {
      content_id: contentId,
      metric,
      likes_count: likesCount,
      shares_count: sharesCount,
      downloads_count: downloadsCount
    };
  }

  // js/data/categories.js
  var INITIAL_CATEGORIES = [
    { id: "trending", name: "Trending", icon: "\u{1F525}", image_url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=200&q=80", description: "Most watched and peaceful nature moments trending today" },
    { id: "forest", name: "Forest", icon: "\u{1F332}", image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=200&q=80", description: "Deep pine canopies, ancient redwoods, and whispering moss sanctuaries" },
    { id: "mountain", name: "Mountain", icon: "\u26F0\uFE0F", image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=200&q=80", description: "Majestic alpine summits, misty crags, and high-altitude vistas" },
    { id: "waterfall", name: "Waterfall", icon: "\u{1F4A6}", image_url: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=200&q=80", description: "Cascading emerald drops, roaring gorges, and hidden glacial streams" },
    { id: "rain", name: "Rain", icon: "\u{1F327}\uFE0F", image_url: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=200&q=80", description: "Gentle drops falling on leaves, soothing storms, and ambient rainfall" },
    { id: "ocean", name: "Ocean", icon: "\u{1F40B}", image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80", description: "Rhythmic ocean waves, turquoise shallows, and coastal tides" },
    { id: "sunset", name: "Sunset", icon: "\u{1F307}", image_url: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=200&q=80", description: "Golden twilight, fiery orange horizons, and dusk over mountains" },
    { id: "sunrise", name: "Sunrise", icon: "\u{1F305}", image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=200&q=80", description: "First light breaking over misty valleys and serene dawn horizons" },
    { id: "flowers", name: "Flowers", icon: "\u{1F338}", image_url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=200&q=80", description: "Blooming wild blossoms, spring meadows, and petal-draped valleys" },
    { id: "wildlife", name: "Wildlife", icon: "\u{1F98C}", image_url: "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=200&q=80", description: "Graceful deer, playful river otters, and wild creatures in their habitats" },
    { id: "river", name: "River", icon: "\u{1F30A}", image_url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=200&q=80", description: "Crystal mountain brooks, flowing gravel shallows, and winding streams" },
    { id: "beach", name: "Beach", icon: "\u{1F3D6}\uFE0F", image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80", description: "Golden sandy shores, gentle lap of sea waves, and tropical dunes" },
    { id: "clouds", name: "Clouds", icon: "\u2601\uFE0F", image_url: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=200&q=80", description: "Rolling cloud inversions, cotton vapor blankets, and sky drift" },
    { id: "snow", name: "Snow", icon: "\u2744\uFE0F", image_url: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=200&q=80", description: "Quiet snowfall in pine woods, powdered peaks, and winter calm" },
    { id: "greenery", name: "Greenery", icon: "\u{1F343}", image_url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=200&q=80", description: "Lush rolling green hills, clover pastures, and vibrant emerald lawns" },
    { id: "lake", name: "Lake", icon: "\u{1F6F6}", image_url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=200&q=80", description: "Mirror-calm mountain waters, tranquil shorelines, and misty reflections" },
    { id: "jungle", name: "Jungle", icon: "\u{1F334}", image_url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=200&q=80", description: "Tropical rainforests, exotic flora, and lively canopy sounds" },
    { id: "night-sky", name: "Night Sky", icon: "\u2728", image_url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=200&q=80", description: "Starlit celestial expanses, constellations, and quiet midnight skies" },
    { id: "birds", name: "Birds", icon: "\u{1F54A}\uFE0F", image_url: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=200&q=80", description: "Melodic dawn chorus, migratory flocks, and avian woodland songs" },
    { id: "nature", name: "Nature", icon: "\u{1F33F}", image_url: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=200&q=80", description: "Pure unadorned earth moments, organic beauty, and deep serenity" }
  ];
  var CATEGORIES = [...INITIAL_CATEGORIES];
  function loadDynamicCategories() {
    try {
      const custom = localStorage.getItem("nature_custom_categories");
      if (custom) {
        const parsed = JSON.parse(custom);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(INITIAL_CATEGORIES.map((c) => c.id));
          const newCats = parsed.filter((c) => !existingIds.has(c.id));
          CATEGORIES = [...INITIAL_CATEGORIES, ...newCats];
        }
      }
    } catch (e) {
      console.warn("Error loading custom categories:", e);
    }
  }
  loadDynamicCategories();
  function getCategoryById(id) {
    loadDynamicCategories();
    return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
  }

  // js/services/offline-db.js
  var DB_NAME = "nature_moments_db";
  var DB_VERSION = 1;
  var STORE_NAME = "downloads";
  var OfflineDatabase = class {
    constructor() {
      this.db = null;
      this.initPromise = this._init();
      this.activeBlobUrls = /* @__PURE__ */ new Map();
    }
    _init() {
      return new Promise((resolve, reject) => {
        if (typeof window === "undefined" || !window.indexedDB) {
          console.warn("IndexedDB not supported in this environment");
          return resolve(null);
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: "content_id" });
            store.createIndex("downloaded_at", "downloaded_at", { unique: false });
            store.createIndex("category_id", "category_id", { unique: false });
          }
        };
        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve(this.db);
        };
        request.onerror = (event) => {
          console.error("IndexedDB open error:", event.target.error);
          reject(event.target.error);
        };
      });
    }
    async _getStore(mode = "readonly") {
      await this.initPromise;
      if (!this.db) throw new Error("IndexedDB not initialized");
      const transaction = this.db.transaction(STORE_NAME, mode);
      return transaction.objectStore(STORE_NAME);
    }
    // Format bytes helper (e.g. 1.1 MB)
    formatBytes(bytes) {
      if (!bytes || bytes <= 0) return "0 B";
      const units = ["B", "KB", "MB", "GB"];
      const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
      return (bytes / Math.pow(1024, i)).toFixed(1) + " " + units[i];
    }
    // Save downloaded media blob
    async saveDownloadedReel(reel, blob) {
      const store = await this._getStore("readwrite");
      const record = {
        content_id: reel.content_id,
        title: reel.title,
        description: reel.description || "",
        category_id: reel.category_id,
        thumbnail_url: reel.thumbnail_url,
        blob,
        file_size: blob.size,
        formatted_size: this.formatBytes(blob.size),
        mime_type: blob.type || "video/mp4",
        duration: reel.duration || "0:15",
        downloaded_at: (/* @__PURE__ */ new Date()).toISOString()
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
      const store = await this._getStore("readonly");
      return new Promise((resolve, reject) => {
        const request = store.get(contentId);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = (e) => reject(e.target.error);
      });
    }
    // Get all downloaded reels (newest first)
    async getAllDownloadedReels() {
      const store = await this._getStore("readonly");
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
      if (this.activeBlobUrls.has(contentId)) {
        URL.revokeObjectURL(this.activeBlobUrls.get(contentId));
        this.activeBlobUrls.delete(contentId);
      }
      const store = await this._getStore("readwrite");
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
        throw new Error("Local video file not found");
      }
      const blobUrl = URL.createObjectURL(record.blob);
      this.activeBlobUrls.set(contentId, blobUrl);
      return blobUrl;
    }
  };
  var offlineDb = new OfflineDatabase();

  // js/services/downloader.js
  var DownloaderService = class {
    constructor() {
      this.activeDownloads = /* @__PURE__ */ new Map();
    }
    // Check if reel is downloadable
    canDownload(reel) {
      return !!(reel && reel.is_downloadable && reel.video_url);
    }
    // Start real download with progress tracking and abort capability
    async downloadReel(reel, onProgress, onComplete, onError) {
      if (!this.canDownload(reel)) {
        const err = new Error("This video is not marked for download.");
        if (onError) onError(err);
        throw err;
      }
      const alreadySaved = await offlineDb.isDownloaded(reel.content_id);
      if (alreadySaved) {
        console.log("Video already downloaded, refreshing copy:", reel.content_id);
      }
      if (this.activeDownloads.has(reel.content_id)) {
        console.warn("Download already in progress for:", reel.content_id);
        return;
      }
      const controller = new AbortController();
      this.activeDownloads.set(reel.content_id, { controller, reel });
      try {
        if (window.AndroidBridge && typeof window.AndroidBridge.downloadVideo === "function") {
          try {
            window.AndroidBridge.downloadVideo(reel.video_url, reel.title + ".mp4");
          } catch (bridgeErr) {
            console.warn("AndroidBridge call failed, falling back to web download", bridgeErr);
          }
        }
        let response;
        try {
          response = await fetch(reel.video_url, {
            signal: controller.signal,
            headers: { "Accept": "video/*,*/*" }
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
        } catch (fetchErr) {
          if (fetchErr.name === "AbortError") throw fetchErr;
          throw new Error("Download failed: unable to fetch video stream from remote server.");
        }
        if (!response.ok) {
          throw new Error(`Download failed with server status ${response.status} ${response.statusText}`);
        }
        const contentLength = response.headers.get("content-length");
        const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
        const reader = response.body.getReader();
        const chunks = [];
        let receivedBytes = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          receivedBytes += value.length;
          if (totalBytes > 0) {
            const percent = Math.min(100, Math.round(receivedBytes / totalBytes * 100));
            if (onProgress) onProgress(percent, receivedBytes, totalBytes);
          } else {
            const estimatedPercent = Math.min(95, Math.round(receivedBytes / (2 * 1024 * 1024) * 100));
            if (onProgress) onProgress(estimatedPercent, receivedBytes, 0);
          }
        }
        const mimeType = response.headers.get("content-type") || "video/mp4";
        const blob = new Blob(chunks, { type: mimeType });
        if (blob.size < 1e3) {
          throw new Error("Downloaded media file appears incomplete or corrupted.");
        }
        const savedRecord = await offlineDb.saveDownloadedReel(reel, blob);
        try {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = (reel.title.replace(/[^a-zA-Z0-9_-]/g, "_") || "nature_reel") + ".mp4";
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
          }, 1e3);
        } catch (dlErr) {
          console.warn("Direct file trigger error", dlErr);
        }
        this.activeDownloads.delete(reel.content_id);
        if (onProgress) onProgress(100, receivedBytes, totalBytes || receivedBytes);
        if (onComplete) onComplete(savedRecord);
        return savedRecord;
      } catch (error) {
        this.activeDownloads.delete(reel.content_id);
        if (error.name === "AbortError") {
          console.log("Download canceled by user:", reel.content_id);
          const cancelErr = new Error("Download canceled.");
          cancelErr.isCanceled = true;
          if (onError) onError(cancelErr);
          throw cancelErr;
        }
        console.error("Error downloading video:", error);
        if (onError) onError(error);
        throw error;
      }
    }
    // Cancel ongoing download
    cancelDownload(contentId) {
      if (this.activeDownloads.has(contentId)) {
        const { controller } = this.activeDownloads.get(contentId);
        controller.abort();
        this.activeDownloads.delete(contentId);
        return true;
      }
      return false;
    }
  };
  var downloader = new DownloaderService();

  // js/services/share.js
  var ShareService = class {
    // Share specific Reel
    async shareReel(reel) {
      const text = `Check out this trending video on WhatsApp Status! \u2728\u{1F4F2}

"${reel.title}"
Category: ${reel.category_id.toUpperCase()}

Watch more WhatsApp Status reels!`;
      const shareUrl = window.location.origin + window.location.pathname + `?reel=${reel.content_id}`;
      if (window.AndroidBridge && typeof window.AndroidBridge.shareWhatsApp === "function") {
        try {
          window.AndroidBridge.shareWhatsApp(text + "\n" + shareUrl);
          return { success: true, method: "android_bridge" };
        } catch (e) {
          console.warn("AndroidBridge share error", e);
        }
      }
      if (navigator.share) {
        try {
          await navigator.share({
            title: `WhatsApp Status \u2014 ${reel.title}`,
            text,
            url: shareUrl
          });
          return { success: true, method: "navigator_share" };
        } catch (err) {
          if (err.name === "AbortError") {
            return { success: false, aborted: true };
          }
          console.warn("Web Share failed, attempting WhatsApp direct URL", err);
        }
      }
      try {
        const encodedMsg = encodeURIComponent(`${text}
${shareUrl}`);
        const waUrl = `https://api.whatsapp.com/send?text=${encodedMsg}`;
        window.open(waUrl, "_blank", "noopener,noreferrer");
        return { success: true, method: "whatsapp_url" };
      } catch (e) {
        console.error("Failed to open WhatsApp URL", e);
        return { success: false, error: e };
      }
    }
    // Share Application
    async shareApp() {
      const appText = "Watch, download, and share trending short video reels on WhatsApp Status application! \u{1F4F2}\u2728";
      const appUrl = window.location.href;
      if (window.AndroidBridge && typeof window.AndroidBridge.shareApp === "function") {
        try {
          window.AndroidBridge.shareApp(appText + "\n" + appUrl);
          return true;
        } catch (e) {
        }
      }
      if (navigator.share) {
        try {
          await navigator.share({
            title: "WhatsApp Status App",
            text: appText,
            url: appUrl
          });
          return true;
        } catch (e) {
        }
      }
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(appText + " " + appUrl)}`;
      window.open(waUrl, "_blank");
      return true;
    }
  };
  var shareService = new ShareService();

  // js/components/video-player.js
  var VideoPlayer = class {
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
      this.stage = this.overlay.querySelector(".player-stage");
      this.video = this.overlay.querySelector(".player-video");
      this.spinner = this.overlay.querySelector(".player-spinner");
      this.centerPlay = this.overlay.querySelector(".player-center-play");
      this.backBtn = this.overlay.querySelector(".player-back-btn");
      this.titleEl = this.overlay.querySelector(".player-title");
      this.catEl = this.overlay.querySelector(".player-category-tag");
      this.likeBtn = this.overlay.querySelector("#player-btn-like");
      this.saveBtn = this.overlay.querySelector("#player-btn-save");
      this.downloadBtn = this.overlay.querySelector("#player-btn-download");
      this.shareBtn = this.overlay.querySelector("#player-btn-share");
      this.muteBtn = this.overlay.querySelector("#player-btn-mute");
      this.fullscreenBtn = this.overlay.querySelector("#player-btn-fullscreen");
      this.scrubberWrap = this.overlay.querySelector(".player-scrubber-wrap");
      this.scrubberProgress = this.overlay.querySelector(".player-scrubber-progress");
      this.currentTimeEl = this.overlay.querySelector("#player-current-time");
      this.durationTimeEl = this.overlay.querySelector("#player-duration-time");
      this.dlProgressOverlay = this.overlay.querySelector(".download-progress-overlay");
      this.dlProgressBar = this.overlay.querySelector(".download-progress-bar");
      this.dlProgressPercent = this.overlay.querySelector(".download-progress-percent");
      this.dlCancelBtn = this.overlay.querySelector(".download-cancel-btn");
    }
    _bindEvents() {
      this.backBtn.addEventListener("click", () => this.close());
      this.video.addEventListener("click", () => this.togglePlay());
      this.centerPlay.addEventListener("click", () => this.togglePlay());
      this.video.addEventListener("waiting", () => this.spinner.classList.add("loading"));
      this.video.addEventListener("playing", () => {
        this.spinner.classList.remove("loading");
        this.centerPlay.classList.remove("show");
      });
      this.video.addEventListener("pause", () => {
        this.centerPlay.classList.add("show");
      });
      this.video.addEventListener("timeupdate", () => this._onTimeUpdate());
      this.video.addEventListener("loadedmetadata", () => {
        this.durationTimeEl.textContent = this._formatTime(this.video.duration);
      });
      this.video.addEventListener("error", (e) => {
        const cur = this.video.src || "";
        if (cur.includes("cdn.jsdelivr.net")) {
          const fallback = cur.replace("cdn.jsdelivr.net/gh/", "raw.githubusercontent.com/").replace("@main/", "/main/");
          console.log("[VideoPlayer] jsDelivr error, switching to GitHub Raw fallback in 0ms:", fallback);
          this.video.src = fallback;
          this.video.play().catch(() => {
          });
          return;
        } else if (cur.includes("raw.githubusercontent.com")) {
          const fallback = cur.replace("raw.githubusercontent.com/", "cdn.jsdelivr.net/gh/").replace("/main/", "@main/");
          console.log("[VideoPlayer] Raw error, switching to jsDelivr fallback in 0ms:", fallback);
          this.video.src = fallback;
          this.video.play().catch(() => {
          });
          return;
        }
        this.spinner.classList.remove("loading");
        console.warn("Video playback error", e);
        this.showToast("Unable to stream video. Please check your connection.", "\u26A0\uFE0F");
      });
      let isDragging = false;
      const seekToPosition = (e) => {
        const rect = this.scrubberWrap.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        if (this.video.duration) {
          this.video.currentTime = pos * this.video.duration;
        }
      };
      this.scrubberWrap.addEventListener("mousedown", (e) => {
        isDragging = true;
        seekToPosition(e);
      });
      window.addEventListener("mousemove", (e) => {
        if (isDragging) seekToPosition(e);
      });
      window.addEventListener("mouseup", () => {
        isDragging = false;
      });
      this.scrubberWrap.addEventListener("touchstart", (e) => {
        isDragging = true;
        seekToPosition(e);
      }, { passive: true });
      window.addEventListener("touchmove", (e) => {
        if (isDragging) seekToPosition(e);
      }, { passive: true });
      window.addEventListener("touchend", () => {
        isDragging = false;
      });
      this.likeBtn.addEventListener("click", () => {
        if (!this.currentReel) return;
        const isLiked = storage.toggleLike(this.currentReel.content_id);
        const result = trackEngagement(this.currentReel.content_id, isLiked ? "like" : "unlike");
        if (result) this.currentReel.likes_count = result.likes_count;
        this._updateLikeState(isLiked);
        this.showToast(isLiked ? "Added to Liked Reels \u2764\uFE0F" : "Removed from Liked", "\u2764\uFE0F");
      });
      this.saveBtn.addEventListener("click", () => {
        if (!this.currentReel) return;
        const isSaved = storage.toggleSave(this.currentReel.content_id);
        this._updateSaveState(isSaved);
        this.showToast(isSaved ? "Reel saved to bookmarks \u{1F516}" : "Removed from saved", "\u{1F516}");
      });
      this.shareBtn.addEventListener("click", async () => {
        if (!this.currentReel) return;
        const result = trackEngagement(this.currentReel.content_id, "share");
        if (result) this.currentReel.shares_count = result.shares_count;
        await shareService.shareReel(this.currentReel);
      });
      this.downloadBtn.addEventListener("click", () => {
        if (!this.currentReel) return;
        trackEngagement(this.currentReel.content_id, "download");
        this._startDownload();
      });
      this.dlCancelBtn.addEventListener("click", () => {
        if (this.currentReel) {
          downloader.cancelDownload(this.currentReel.content_id);
          this.dlProgressOverlay.classList.remove("show");
          this.showToast("Download canceled", "\u2139\uFE0F");
        }
      });
      this.muteBtn.addEventListener("click", () => {
        this.video.muted = !this.video.muted;
        this.video.volume = this.video.muted ? 0 : 1;
        this._updateMuteState(this.video.muted);
        this.showToast(this.video.muted ? "\u{1F507} Audio Muted" : "\u{1F50A} Audio Active", this.video.muted ? "\u{1F507}" : "\u{1F50A}");
      });
      this.fullscreenBtn.addEventListener("click", () => {
        this._toggleFullscreen();
      });
      document.addEventListener("visibilitychange", () => {
        if (document.hidden && !this.video.paused) {
          this.video.pause();
        }
      });
      window.addEventListener("keydown", (e) => {
        if (!this.overlay.classList.contains("active")) return;
        if (e.key === "Escape") {
          this.close();
        } else if (e.key === " " || e.key === "k") {
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
      this.titleEl.textContent = reel.title;
      const catKey = `category_${reel.category_id.replace(/-/g, "_")}`;
      this.catEl.textContent = i18n.t(catKey, reel.category_id);
      this._updateLikeState(storage.isLiked(reel.content_id));
      this._updateSaveState(storage.isSaved(reel.content_id));
      this.video.muted = false;
      this.video.volume = 1;
      this._updateMuteState(false);
      if (this.isOffline) {
        this.catEl.textContent = `\u26A1 OFFLINE \u2022 ${i18n.t(catKey, reel.category_id)}`;
      }
      if (window.natureAppInstance && window.natureAppInstance.reelsFeed) {
        window.natureAppInstance.reelsFeed.pauseAll();
      }
      this.spinner.classList.add("loading");
      let videoSourceUrl = this.isOffline && this.offlineBlobUrl ? this.offlineBlobUrl : reel.video_url;
      this.video.playsInline = true;
      this.video.setAttribute("playsinline", "");
      this.video.setAttribute("webkit-playsinline", "");
      this.video.setAttribute("x5-playsinline", "");
      this.video.preload = "auto";
      this.video.src = videoSourceUrl;
      this.overlay.classList.add("active");
      document.body.style.overflow = "hidden";
      try {
        this.video.muted = false;
        this.video.volume = 1;
        await this.video.play();
        this.centerPlay.classList.remove("show");
        this.spinner.classList.remove("loading");
      } catch (err) {
        console.log("Unmuted play blocked by Android, trying muted play:", err);
        this.video.muted = true;
        try {
          await this.video.play();
          this.centerPlay.classList.remove("show");
          this.spinner.classList.remove("loading");
        } catch (err2) {
          console.warn("Autoplay error:", err2);
          this.centerPlay.classList.add("show");
          this.spinner.classList.remove("loading");
        }
      }
      if (!this.isOffline) {
        offlineDb.isDownloaded(reel.content_id).then(async (isCached) => {
          if (isCached && this.video.src !== await offlineDb.getPlaybackUrl(reel.content_id)) {
            this.catEl.textContent = `\u{1F4BE} CACHED \u2022 ${this.catEl.textContent}`;
          }
        }).catch(() => {
        });
      }
    }
    close() {
      this.video.pause();
      this.video.removeAttribute("src");
      this.video.load();
      this.overlay.classList.remove("active");
      document.body.style.overflow = "";
      this.dlProgressOverlay.classList.remove("show");
      this.currentReel = null;
      this.isOffline = false;
      if (window.natureAppInstance && window.natureAppInstance.currentView === "reels" && window.natureAppInstance.reelsFeed) {
        window.natureAppInstance.reelsFeed.resumeActive();
      }
    }
    togglePlay() {
      if (this.video.paused) {
        this.video.play().then(() => {
          this.centerPlay.classList.remove("show");
        }).catch(() => {
          this.video.muted = true;
          this.video.play().then(() => {
            this.centerPlay.classList.remove("show");
          }).catch((e) => console.warn(e));
        });
      } else {
        this.video.pause();
        this.centerPlay.classList.add("show");
      }
    }
    _onTimeUpdate() {
      if (!this.video.duration) return;
      const progress = this.video.currentTime / this.video.duration * 100;
      this.scrubberProgress.style.width = `${progress}%`;
      this.currentTimeEl.textContent = this._formatTime(this.video.currentTime);
    }
    _formatTime(seconds) {
      if (isNaN(seconds) || seconds < 0) return "0:00";
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s < 10 ? "0" : ""}${s}`;
    }
    _updateLikeState(isLiked) {
      if (isLiked) {
        this.likeBtn.classList.add("liked");
        this.likeBtn.querySelector("svg").setAttribute("fill", "currentColor");
      } else {
        this.likeBtn.classList.remove("liked");
        this.likeBtn.querySelector("svg").setAttribute("fill", "none");
      }
    }
    _updateSaveState(isSaved) {
      if (isSaved) {
        this.saveBtn.classList.add("saved");
        this.saveBtn.querySelector("svg").setAttribute("fill", "currentColor");
      } else {
        this.saveBtn.classList.remove("saved");
        this.saveBtn.querySelector("svg").setAttribute("fill", "none");
      }
    }
    _updateMuteState(isMuted) {
      const icon = this.muteBtn.querySelector("svg");
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
      this.dlProgressOverlay.classList.add("show");
      this.dlProgressBar.style.width = "0%";
      this.dlProgressPercent.textContent = "0%";
      downloader.downloadReel(
        reel,
        (percent) => {
          this.dlProgressBar.style.width = `${percent}%`;
          this.dlProgressPercent.textContent = `${percent}%`;
        },
        () => {
          setTimeout(() => {
            this.dlProgressOverlay.classList.remove("show");
            this.showToast(i18n.t("download_complete"), "\u2705");
          }, 500);
        },
        (error) => {
          this.dlProgressOverlay.classList.remove("show");
          if (!error.isCanceled) {
            this.showToast(error.message || i18n.t("download_error"), "\u274C");
          }
        }
      );
    }
  };

  // js/services/sound-engine.js
  var NatureSoundEngine = class {
    constructor() {
      this.audioCtx = null;
      this.isPlaying = false;
      this.currentMode = "forest";
      this.gainNode = null;
      this.activeNodes = [];
      this.isMuted = true;
    }
    _initContext() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
        this.gainNode = this.audioCtx.createGain();
        this.gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
        this.gainNode.connect(this.audioCtx.destination);
      }
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
    }
    // Toggle sound on/off
    toggleSound(category = "forest") {
      this._initContext();
      this.isMuted = !this.isMuted;
      if (this.isMuted) {
        this.stop();
        return false;
      } else {
        this.play(category);
        return true;
      }
    }
    setMuted(muted, category = "forest") {
      this.isMuted = muted;
      if (muted) {
        this.stop();
      } else {
        this._initContext();
        this.play(category);
      }
    }
    play(category = "forest") {
      this._initContext();
      this.stopNodes();
      this.isPlaying = true;
      this.currentMode = category;
      const cat = (category || "").toLowerCase();
      if (cat.includes("rain")) {
        this._generateRainSound();
      } else if (cat.includes("waterfall") || cat.includes("river")) {
        this._generateWaterRushSound();
      } else if (cat.includes("ocean") || cat.includes("beach")) {
        this._generateOceanWavesSound();
      } else if (cat.includes("mountain") || cat.includes("snow") || cat.includes("clouds")) {
        this._generateWindSound();
      } else {
        this._generateForestSound();
      }
    }
    stop() {
      this.isPlaying = false;
      this.stopNodes();
    }
    stopNodes() {
      this.activeNodes.forEach((node) => {
        try {
          if (node.stop) node.stop();
          node.disconnect();
        } catch (e) {
        }
      });
      this.activeNodes = [];
    }
    // Pink noise generator for soothing water/rain textures
    _createNoiseBuffer() {
      const bufferSize = this.audioCtx.sampleRate * 2;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }
      return noiseBuffer;
    }
    // 1. Forest ambient breeze + birds
    _generateForestSound() {
      const noiseSource = this.audioCtx.createBufferSource();
      noiseSource.buffer = this._createNoiseBuffer();
      noiseSource.loop = true;
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);
      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainNode);
      noiseSource.start();
      this.activeNodes.push(noiseSource, filter, gain);
      const chirpInterval = setInterval(() => {
        if (!this.isPlaying || this.isMuted) {
          clearInterval(chirpInterval);
          return;
        }
        this._playSingleBirdChirp();
      }, 2800);
    }
    _playSingleBirdChirp() {
      try {
        const osc = this.audioCtx.createOscillator();
        const chirpGain = this.audioCtx.createGain();
        const now = this.audioCtx.currentTime;
        osc.type = "sine";
        const baseFreq = 2200 + Math.random() * 800;
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(baseFreq - 300, now + 0.18);
        chirpGain.gain.setValueAtTime(0.01, now);
        chirpGain.gain.linearRampToValueAtTime(0.08, now + 0.04);
        chirpGain.gain.exponentialRampToValueAtTime(1e-3, now + 0.18);
        osc.connect(chirpGain);
        chirpGain.connect(this.gainNode);
        osc.start(now);
        osc.stop(now + 0.2);
      } catch (e) {
      }
    }
    // 2. Soothing Raindrops
    _generateRainSound() {
      const noiseSource = this.audioCtx.createBufferSource();
      noiseSource.buffer = this._createNoiseBuffer();
      noiseSource.loop = true;
      const bandpass = this.audioCtx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
      bandpass.Q.setValueAtTime(0.8, this.audioCtx.currentTime);
      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
      noiseSource.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.gainNode);
      noiseSource.start();
      this.activeNodes.push(noiseSource, bandpass, gain);
    }
    // 3. Rushing Waterfall & River
    _generateWaterRushSound() {
      const noiseSource = this.audioCtx.createBufferSource();
      noiseSource.buffer = this._createNoiseBuffer();
      noiseSource.loop = true;
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainNode);
      noiseSource.start();
      this.activeNodes.push(noiseSource, filter, gain);
    }
    // 4. Ocean Waves
    _generateOceanWavesSound() {
      const noiseSource = this.audioCtx.createBufferSource();
      noiseSource.buffer = this._createNoiseBuffer();
      noiseSource.loop = true;
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(600, this.audioCtx.currentTime);
      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      const lfo = this.audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(0.18, this.audioCtx.currentTime);
      const lfoGain = this.audioCtx.createGain();
      lfoGain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();
      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainNode);
      noiseSource.start();
      this.activeNodes.push(noiseSource, filter, gain, lfo, lfoGain);
    }
    // 5. Mountain Wind
    _generateWindSound() {
      const noiseSource = this.audioCtx.createBufferSource();
      noiseSource.buffer = this._createNoiseBuffer();
      noiseSource.loop = true;
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(320, this.audioCtx.currentTime);
      filter.Q.setValueAtTime(2, this.audioCtx.currentTime);
      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.22, this.audioCtx.currentTime);
      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainNode);
      noiseSource.start();
      this.activeNodes.push(noiseSource, filter, gain);
    }
  };
  var soundEngine = new NatureSoundEngine();

  // js/components/reels-feed.js
  var ReelsFeed = class {
    constructor(containerElement, showToastCallback) {
      this.container = containerElement;
      this.showToast = showToastCallback || console.log;
      this.activeCategory = "trending";
      this.filteredReels = [];
      this.renderedCount = 0;
      this.observer = null;
      this.activeItem = null;
      this.activeVideo = null;
      this.isMuted = false;
      this._initCategoryHeader();
      this._bindSoundButton();
      this._bindContainerDelegation();
      this._bindScrollSnapHandler();
      this.filterCategory("trending");
      const unmuteOnInteraction = () => {
        if (window.natureAppInstance && window.natureAppInstance.currentView === "reels") {
          if (!this.isMuted && this.activeVideo) {
            this.activeVideo.muted = false;
            this.activeVideo.volume = 1;
          }
        }
        window.removeEventListener("pointerdown", unmuteOnInteraction);
        window.removeEventListener("touchstart", unmuteOnInteraction);
      };
      window.addEventListener("pointerdown", unmuteOnInteraction, { passive: true });
      window.addEventListener("touchstart", unmuteOnInteraction, { passive: true });
      window.addEventListener("languageChanged", () => {
        this._updateLanguageUI();
      });
      window.addEventListener("reelsUpdated", () => {
        this._initCategoryHeader();
        this.refresh();
      });
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          this.pauseAll();
        }
      });
    }
    refresh() {
      const newReels = getReelsByCategory(this.activeCategory);
      const oldFingerprint = (this.filteredReels || []).map((r) => `${r.content_id}:${r.thumbnail_url}:${r.video_url}:${r.title}:${r.category_id}`).join("|");
      const newFingerprint = (newReels || []).map((r) => `${r.content_id}:${r.thumbnail_url}:${r.video_url}:${r.title}:${r.category_id}`).join("|");
      if (oldFingerprint === newFingerprint && this.container.children.length > 0) {
        return;
      }
      this.filteredReels = newReels;
      this.render();
    }
    // Floating Category Scroller inside Reels View
    _initCategoryHeader() {
      const scroller = document.getElementById("reels-category-scroller");
      if (!scroller) return;
      scroller.innerHTML = "";
      CATEGORIES.forEach((cat) => {
        const pill = document.createElement("button");
        pill.className = `floating-cat-pill ${cat.id === this.activeCategory ? "active" : ""}`;
        pill.setAttribute("data-id", cat.id);
        pill.setAttribute("id", `reels-cat-${cat.id}`);
        pill.innerHTML = `
        <span>${cat.icon}</span>
        <span class="cat-name">${cat.name}</span>
        <span class="cat-dot"></span>
      `;
        pill.addEventListener("click", (e) => {
          e.preventDefault();
          this.filterCategory(cat.id);
        });
        scroller.appendChild(pill);
      });
    }
    // Bind Voice / Sound Equalizer Toggle directly to Video Native Audio
    toggleMute() {
      this.isMuted = !this.isMuted;
      this._applyMuteState();
    }
    _applyMuteState() {
      if (this.activeVideo) {
        this.activeVideo.muted = this.isMuted;
        this.activeVideo.volume = this.isMuted ? 0 : 1;
      }
      const allVideos = this.container.querySelectorAll("video");
      allVideos.forEach((v) => {
        v.muted = this.isMuted;
        v.volume = this.isMuted ? 0 : 1;
      });
      const muteBtns = this.container.querySelectorAll(".feed-mute-btn");
      muteBtns.forEach((btn) => {
        if (this.isMuted) {
          btn.classList.add("muted");
          btn.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        `;
        } else {
          btn.classList.remove("muted");
          btn.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        `;
        }
      });
      const labels = this.container.querySelectorAll(".mute-label-display");
      labels.forEach((l) => {
        l.textContent = this.isMuted ? "Muted" : "Sound";
      });
      if (this.soundEq) {
        if (this.isMuted) this.soundEq.classList.remove("active");
        else this.soundEq.classList.add("active");
      }
      if (this.soundLabel) {
        this.soundLabel.textContent = this.isMuted ? "Muted" : "Audio On";
      }
      this.showToast(this.isMuted ? "\u{1F507} Audio Muted" : "\u{1F50A} Sound Active", this.isMuted ? "\u{1F507}" : "\u{1F50A}");
    }
    _bindSoundButton() {
      this.soundBtn = document.getElementById("reels-sound-toggle-btn");
      this.soundEq = document.getElementById("reels-sound-eq");
      this.soundLabel = document.getElementById("reels-sound-label");
      if (this.soundEq) this.soundEq.classList.add("active");
      if (this.soundLabel) this.soundLabel.textContent = "Audio On";
      if (this.soundBtn) {
        this.soundBtn.addEventListener("click", () => {
          this.isMuted = !this.isMuted;
          if (this.activeVideo) {
            this.activeVideo.muted = this.isMuted;
            this.activeVideo.volume = 1;
          }
          const allVideos = this.container.querySelectorAll("video");
          allVideos.forEach((v) => {
            v.muted = this.isMuted;
            v.volume = 1;
          });
          if (!this.isMuted) {
            if (this.soundEq) this.soundEq.classList.add("active");
            if (this.soundLabel) this.soundLabel.textContent = "Audio On";
            this.showToast("\u{1F50A} Video Sound & Voice Active", "\u{1F50A}");
          } else {
            if (this.soundEq) this.soundEq.classList.remove("active");
            if (this.soundLabel) this.soundLabel.textContent = "Muted";
            this.showToast("\u{1F507} Audio Muted", "\u{1F507}");
          }
        });
      }
    }
    // High Performance Event Delegation on container (zero memory leaks)
    _bindContainerDelegation() {
      this.container.addEventListener("click", (e) => {
        const item = e.target.closest(".feed-reel-item");
        if (!item) return;
        const reelId = item.getAttribute("data-id");
        const reel = this.filteredReels.find((r) => r.content_id === reelId);
        if (!reel) return;
        const likeBtn = e.target.closest(".feed-like-btn");
        if (likeBtn) {
          e.stopPropagation();
          const isNowLiked = storage.toggleLike(reel.content_id);
          const result = trackEngagement(reel.content_id, isNowLiked ? "like" : "unlike");
          reel.likes_count = result ? result.likes_count : reel.likes_count || 0;
          const likeCountLabel = item.querySelector(".like-count-display");
          if (isNowLiked) {
            likeBtn.classList.add("liked");
            likeBtn.querySelector("svg").setAttribute("fill", "currentColor");
            if (likeCountLabel) likeCountLabel.textContent = reel.likes_count;
            this.showToast("Added to Liked Nature Reels \u2764\uFE0F", "\u2764\uFE0F");
          } else {
            likeBtn.classList.remove("liked");
            likeBtn.querySelector("svg").setAttribute("fill", "none");
            if (likeCountLabel) likeCountLabel.textContent = reel.likes_count;
            this.showToast("Removed from Liked", "\u{1F90D}");
          }
          return;
        }
        const saveBtn = e.target.closest(".feed-save-btn");
        if (saveBtn) {
          e.stopPropagation();
          const isNowSaved = storage.toggleSave(reel.content_id);
          const saveLabel = item.querySelector(".save-action-label");
          if (isNowSaved) {
            saveBtn.classList.add("saved");
            saveBtn.querySelector("svg").setAttribute("fill", "currentColor");
            if (saveLabel) {
              saveLabel.setAttribute("data-i18n", "action_saved");
              saveLabel.textContent = i18n.t("action_saved");
            }
            this.showToast("Reel saved to bookmarks \u{1F516}", "\u{1F516}");
          } else {
            saveBtn.classList.remove("saved");
            saveBtn.querySelector("svg").setAttribute("fill", "none");
            if (saveLabel) {
              saveLabel.setAttribute("data-i18n", "action_save");
              saveLabel.textContent = i18n.t("action_save");
            }
            this.showToast("Removed from saved", "\u2139\uFE0F");
          }
          return;
        }
        const shareBtn = e.target.closest(".feed-share-btn");
        if (shareBtn) {
          e.stopPropagation();
          const result = trackEngagement(reel.content_id, "share");
          reel.shares_count = result ? result.shares_count : (reel.shares_count || 0) + 1;
          const shareCountLabel = item.querySelector(".share-count-display");
          if (shareCountLabel) shareCountLabel.textContent = reel.shares_count;
          shareService.shareReel(reel);
          return;
        }
        const dlBtn = e.target.closest(".feed-download-btn");
        if (dlBtn) {
          e.stopPropagation();
          trackEngagement(reel.content_id, "download");
          this.showToast(i18n.t("download_started"), "\u2B07\uFE0F");
          downloader.downloadReel(
            reel,
            (pct) => {
              if (pct === 50) this.showToast(`Downloading Nature Reel 50%...`, "\u23F3");
            },
            () => {
              this.showToast(i18n.t("download_complete"), "\u2705");
            },
            (err) => {
              if (!err.isCanceled) this.showToast(err.message, "\u274C");
            }
          );
          return;
        }
        const muteBtn = e.target.closest(".feed-mute-btn");
        if (muteBtn) {
          e.stopPropagation();
          this.toggleMute();
          return;
        }
        if (!e.target.closest(".feed-actions-dock") && !e.target.closest(".floating-cat-pill") && !e.target.closest("#btn-hamburger") && !e.target.closest(".header-sound-btn") && !e.target.closest(".header-brand-pill") && !e.target.closest("button") && !e.target.closest("a")) {
          const now = Date.now();
          if (this._lastTapTime && now - this._lastTapTime < 280) {
            e.stopPropagation();
            clearTimeout(this._singleTapTimeout);
            this._lastTapTime = 0;
            this._triggerHeartBurst(item, reel);
            return;
          }
          this._lastTapTime = now;
          const video = item.querySelector("video");
          const playPulse = item.querySelector(".feed-play-pulse");
          const vinyl = item.querySelector(".dock-vinyl-disc");
          if (video) {
            e.stopPropagation();
            clearTimeout(this._singleTapTimeout);
            this._singleTapTimeout = setTimeout(() => {
              if (video.paused) {
                item.classList.remove("is-paused");
                if (playPulse) playPulse.classList.remove("show");
                if (vinyl) vinyl.classList.remove("paused");
                video.playsInline = true;
                video.muted = this.isMuted;
                video.volume = this.isMuted ? 0 : 1;
                const p = video.play();
                if (p !== void 0) {
                  p.catch(() => {
                    video.muted = true;
                    video.play().catch(() => {
                    });
                  });
                }
              } else {
                video.pause();
                item.classList.add("is-paused");
                if (playPulse) playPulse.classList.add("show");
                if (vinyl) vinyl.classList.add("paused");
              }
            }, 150);
          }
        }
      });
    }
    // Instagram / TikTok style heart burst animation on double tap
    _triggerHeartBurst(item, reel) {
      const isNowLiked = storage.toggleLike(reel.content_id);
      if (isNowLiked) {
        const result = trackEngagement(reel.content_id, "like");
        reel.likes_count = result ? result.likes_count : (reel.likes_count || 0) + 1;
        const likeCountLabel = item.querySelector(".like-count-display");
        if (likeCountLabel) likeCountLabel.textContent = reel.likes_count;
      }
      const likeBtn = item.querySelector(".feed-like-btn");
      if (likeBtn) {
        likeBtn.classList.add("liked");
        likeBtn.querySelector("svg").setAttribute("fill", "currentColor");
      }
      const heart = document.createElement("div");
      heart.className = "double-tap-heart";
      heart.innerHTML = `
      <svg width="84" height="84" viewBox="0 0 24 24" fill="#FF2E63" stroke="#FFFFFF" stroke-width="1.2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    `;
      item.appendChild(heart);
      setTimeout(() => {
        heart.remove();
      }, 850);
      this.showToast("Liked Nature Reel \u2764\uFE0F", "\u2764\uFE0F");
    }
    // Filter vertical feed by category
    filterCategory(categoryId) {
      this.activeCategory = categoryId;
      this.pauseAll();
      const pills = document.querySelectorAll(".floating-cat-pill");
      pills.forEach((p) => {
        if (p.getAttribute("data-id") === categoryId) {
          p.classList.add("active");
          p.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        } else {
          p.classList.remove("active");
        }
      });
      this.filteredReels = getReelsByCategory(categoryId);
      this.render();
      this.container.scrollTo({ top: 0, behavior: "instant" });
      if (typeof this.onCategoryChange === "function") {
        this.onCategoryChange(categoryId);
      }
    }
    // Scroll directly to a specific reel and start playing it seamlessly
    scrollToReel(contentId, categoryId = null) {
      if (!contentId) return;
      if (categoryId && categoryId !== this.activeCategory) {
        this.activeCategory = categoryId;
        this.filteredReels = getReelsByCategory(categoryId);
        const pills = document.querySelectorAll(".floating-cat-pill");
        pills.forEach((p) => {
          if (p.getAttribute("data-id") === categoryId) {
            p.classList.add("active");
            p.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
          } else {
            p.classList.remove("active");
          }
        });
      }
      let reelIndex = (this.filteredReels || []).findIndex((r) => r.content_id === contentId);
      if (reelIndex === -1) {
        this.activeCategory = "trending";
        this.filteredReels = getReelsByCategory("trending");
        reelIndex = (this.filteredReels || []).findIndex((r) => r.content_id === contentId);
        if (reelIndex === -1) {
          this.activeCategory = "all";
          this.filteredReels = getReelsByCategory("all");
          reelIndex = (this.filteredReels || []).findIndex((r) => r.content_id === contentId);
        }
        this.render();
      }
      if (reelIndex !== -1 && reelIndex >= this.renderedCount) {
        const targetRenderCount = Math.min(reelIndex + 4, this.filteredReels.length);
        for (let i = this.renderedCount; i < targetRenderCount; i++) {
          const item = this._createReelItem(this.filteredReels[i], i);
          this.container.appendChild(item);
          if (this.observer) {
            this.observer.observe(item);
          }
        }
        this.renderedCount = targetRenderCount;
      }
      const targetItem = this.container.querySelector(`.feed-reel-item[data-id="${contentId}"]`);
      if (targetItem) {
        this.pauseAll();
        this.container.scrollTop = targetItem.offsetTop;
        this.activeItem = targetItem;
        setTimeout(() => {
          this._playReelItem(targetItem);
        }, 60);
      } else {
        this.render();
        this.resumeActive();
      }
    }
    _bindScrollSnapHandler() {
      let scrollTimeout = null;
      const onScroll = () => {
        const isReelsTab = window.natureAppInstance && window.natureAppInstance.currentView === "reels";
        const reelsView = document.getElementById("view-reels");
        const isReelsVisible = reelsView && (reelsView.style.display === "block" || reelsView.offsetParent !== null);
        if (!isReelsTab || !isReelsVisible) return;
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          this._detectAndPlaySnappedReel();
        }, 60);
      };
      this.container.addEventListener("scroll", onScroll, { passive: true });
      this.container.addEventListener("scrollend", () => {
        this._detectAndPlaySnappedReel();
      }, { passive: true });
    }
    _detectAndPlaySnappedReel() {
      const isReelsTab = window.natureAppInstance && window.natureAppInstance.currentView === "reels";
      const reelsView = document.getElementById("view-reels");
      const isReelsVisible = reelsView && (reelsView.style.display === "block" || reelsView.offsetParent !== null);
      if (!isReelsTab || !isReelsVisible) return;
      const containerTop = this.container.scrollTop;
      const containerHeight = this.container.clientHeight || window.innerHeight;
      const centerPoint = containerTop + containerHeight / 2;
      const items = Array.from(this.container.querySelectorAll(".feed-reel-item"));
      if (!items.length) return;
      let closestItem = null;
      let minDistance = Infinity;
      for (const item of items) {
        const itemCenter = item.offsetTop + (item.clientHeight || containerHeight) / 2;
        const dist = Math.abs(centerPoint - itemCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestItem = item;
        }
      }
      if (closestItem && (this.activeItem !== closestItem || !this.activeVideo || this.activeVideo.paused)) {
        this._playReelItem(closestItem);
      }
    }
    _playReelItem(targetItem) {
      if (!targetItem) return;
      const isReelsTab = window.natureAppInstance && window.natureAppInstance.currentView === "reels";
      const reelsView = document.getElementById("view-reels");
      const isReelsVisible = reelsView && (reelsView.style.display === "block" || reelsView.offsetParent !== null);
      if (!isReelsTab || !isReelsVisible) {
        this.pauseAll();
        return;
      }
      const video = targetItem.querySelector("video");
      if (!video) return;
      const targetIdx = parseInt(targetItem.getAttribute("data-index") || "0", 10);
      const items = this.container.querySelectorAll(".feed-reel-item");
      items.forEach((item) => {
        if (item !== targetItem) {
          item.classList.remove("active-playing");
          item.classList.remove("is-buffering");
          const otherVideo = item.querySelector("video");
          if (otherVideo) {
            otherVideo.pause();
            const itemIdx = parseInt(item.getAttribute("data-index") || "0", 10);
            if (Math.abs(itemIdx - targetIdx) > 1 && otherVideo.src) {
              otherVideo.removeAttribute("src");
              otherVideo.load();
            }
          }
          const otherVinyl = item.querySelector(".dock-vinyl-disc");
          if (otherVinyl) otherVinyl.classList.add("paused");
        }
      });
      this.activeItem = targetItem;
      this.activeVideo = video;
      targetItem.classList.add("active-playing");
      targetItem.classList.remove("is-paused");
      const vinyl = targetItem.querySelector(".dock-vinyl-disc");
      const playPulse = targetItem.querySelector(".feed-play-pulse");
      if (vinyl) vinyl.classList.remove("paused");
      if (playPulse) playPulse.classList.remove("show");
      const dataSrc = video.getAttribute("data-src") || video.src;
      if (dataSrc && (!video.src || video.src === "" || video.src === window.location.href)) {
        video.src = dataSrc;
      }
      video.preload = "auto";
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.setAttribute("x5-playsinline", "");
      video.muted = this.isMuted;
      video.volume = this.isMuted ? 0 : 1;
      if (!video._bufferEngineBound) {
        video._bufferEngineBound = true;
        video.addEventListener("waiting", () => {
          targetItem.classList.add("is-buffering");
        });
        video.addEventListener("playing", () => {
          targetItem.classList.remove("is-buffering");
        });
        video.addEventListener("canplay", () => {
          targetItem.classList.remove("is-buffering");
          if (this.activeItem === targetItem && video.paused && !targetItem.classList.contains("is-paused")) {
            video.play().catch(() => {
            });
          }
        });
        video.addEventListener("error", () => {
          targetItem.classList.remove("is-buffering");
          const cur = video.src || "";
          if (cur.includes("cdn.jsdelivr.net")) {
            video.src = cur.replace("cdn.jsdelivr.net/gh/", "raw.githubusercontent.com/").replace("@main/", "/main/");
            video.play().catch(() => {
            });
          } else if (cur.includes("raw.githubusercontent.com")) {
            video.src = cur.replace("raw.githubusercontent.com/", "cdn.jsdelivr.net/gh/").replace("/main/", "@main/");
            video.play().catch(() => {
            });
          }
        });
      }
      const p = video.play();
      if (p !== void 0) {
        p.catch((err) => {
          video.muted = true;
          video.play().catch((e) => console.warn("Autoplay handled:", e));
        });
      }
      const nextItem = targetItem.nextElementSibling;
      if (nextItem) {
        const nv = nextItem.querySelector("video");
        if (nv) {
          const nextSrc = nv.getAttribute("data-src");
          if (nextSrc && (!nv.src || nv.src === window.location.href)) nv.src = nextSrc;
          nv.preload = "metadata";
        }
      }
      const currentIndex = parseInt(targetItem.getAttribute("data-index") || "0", 10);
      if (currentIndex >= this.renderedCount - 2) {
        this.appendBatch();
      }
    }
    _initObserver() {
      if (this.observer) this.observer.disconnect();
      const options = {
        root: this.container,
        threshold: [0.1, 0.5, 0.8]
      };
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector("video");
          if (!video) return;
          const isReelsTab = window.natureAppInstance && window.natureAppInstance.currentView === "reels";
          const reelsView = document.getElementById("view-reels");
          const isReelsVisible = reelsView && (reelsView.style.display === "block" || reelsView.offsetParent !== null);
          if (!isReelsTab || !isReelsVisible) {
            video.pause();
            return;
          }
          if (entry.intersectionRatio >= 0.5) {
            if (this.activeItem !== entry.target) {
              this._playReelItem(entry.target);
            } else if (video.paused && !entry.target.classList.contains("is-paused")) {
              video.play().catch(() => {
                video.muted = true;
                video.play().catch(() => {
                });
              });
            }
          } else if (entry.intersectionRatio < 0.2) {
            if (this.activeItem === entry.target) {
              entry.target.classList.remove("active-playing");
              video.pause();
            }
          }
        });
      }, options);
      const items = this.container.querySelectorAll(".feed-reel-item");
      items.forEach((item) => this.observer.observe(item));
    }
    pauseAll() {
      this.activeItem = null;
      this.activeVideo = null;
      const videos = this.container.querySelectorAll("video");
      videos.forEach((v) => {
        try {
          v.pause();
        } catch (e) {
        }
      });
      const items = this.container.querySelectorAll(".feed-reel-item");
      items.forEach((item) => {
        item.classList.remove("active-playing");
        item.classList.remove("is-buffering");
        item.classList.add("is-paused");
        const vinyl = item.querySelector(".dock-vinyl-disc");
        if (vinyl) vinyl.classList.add("paused");
      });
      try {
        soundEngine.stop();
      } catch (e) {
      }
    }
    resumeActive() {
      const isReelsTab = window.natureAppInstance && window.natureAppInstance.currentView === "reels";
      const reelsView = document.getElementById("view-reels");
      const isReelsVisible = reelsView && (reelsView.style.display === "block" || reelsView.offsetParent !== null);
      if (!isReelsTab || !isReelsVisible) {
        this.pauseAll();
        return;
      }
      let item = this.activeItem;
      if (!item || !this.container.contains(item)) {
        const containerTop = this.container.scrollTop || 0;
        const items = Array.from(this.container.querySelectorAll(".feed-reel-item"));
        item = items.find((el) => {
          const top = el.offsetTop - this.container.offsetTop;
          return Math.abs(top - containerTop) < 150;
        }) || items[0];
      }
      if (item) {
        this._playReelItem(item);
      }
    }
    // Create individual 9:16 vertical reel DOM node
    _createReelItem(reel, index) {
      const item = document.createElement("div");
      item.className = "feed-reel-item";
      item.setAttribute("data-id", reel.content_id);
      item.setAttribute("data-cat", reel.category_id);
      item.setAttribute("data-index", index);
      item.setAttribute("id", `feed-reel-${reel.content_id}`);
      const isLiked = storage.isLiked(reel.content_id);
      const isSaved = storage.isSaved(reel.content_id);
      const catKey = `category_${reel.category_id.replace(/-/g, "_")}`;
      const catLabel = i18n.t(catKey, reel.category_id);
      const catObj = CATEGORIES.find((c) => c.id === reel.category_id);
      const catIcon = catObj ? catObj.icon : "\u2728";
      item.innerHTML = `
      <!-- Fast 0ms Poster with CDN Fallback -->
      <img class="feed-reel-poster" src="${reel.thumbnail_url}" alt="${reel.title}" loading="${index < 2 ? "eager" : "lazy"}" onerror="if(this.src.includes('cdn.jsdelivr.net')){this.src=this.src.replace('cdn.jsdelivr.net/gh/','raw.githubusercontent.com/').replace('@main/','/main/');}else{this.onerror=null;this.src='https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80';}" />

      <!-- 9:16 Video Canvas (Preloaded for instant 0ms playback) -->
      <video class="feed-reel-video" loop playsinline webkit-playsinline x5-playsinline ${index < 2 ? `src="${reel.video_url}" preload="auto" muted` : 'preload="none"'} poster="${reel.thumbnail_url}" data-src="${reel.video_url}">
      </video>
      
      <div class="feed-reel-overlay"></div>

      <!-- Center Tap Play Pulse -->
      <div class="feed-play-pulse">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="6 3 20 12 6 21 6 3"></polygon>
        </svg>
      </div>

      <!-- Low-Network Buffering Spinner -->
      <div class="feed-buffering-spinner"></div>

      <!-- Right-Side Instagram Action Dock -->
      <div class="feed-actions-dock">
        
        <!-- Heart Like -->
        <div class="dock-action-item">
          <button class="dock-btn feed-like-btn ${isLiked ? "liked" : ""}" data-id="${reel.content_id}" title="Like">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="${isLiked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <span class="dock-label like-count-display" style="font-weight: 700;">${reel.likes_count || 0}</span>
        </div>

        <!-- Save Bookmark -->
        <div class="dock-action-item">
          <button class="dock-btn feed-save-btn ${isSaved ? "saved" : ""}" data-id="${reel.content_id}" title="Save">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="${isSaved ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
          <span class="dock-label save-action-label" data-i18n="${isSaved ? "action_saved" : "action_save"}">${isSaved ? i18n.t("action_saved") : i18n.t("action_save")}</span>
        </div>

        <!-- WhatsApp Share -->
        <div class="dock-action-item">
          <button class="dock-btn feed-share-btn" data-id="${reel.content_id}" title="Share via WhatsApp">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
          <span class="dock-label share-count-display" style="font-weight: 700;">${reel.shares_count || 0}</span>
        </div>

        <!-- Download -->
        <div class="dock-action-item">
          <button class="dock-btn feed-download-btn" data-id="${reel.content_id}" title="Download Reel">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          <span class="dock-label" data-i18n="action_download">${i18n.t("action_download")}</span>
        </div>

        <!-- Audio Mute / Unmute Toggle Button -->
        <div class="dock-action-item">
          <button class="dock-btn feed-mute-btn ${this.isMuted ? "muted" : ""}" data-id="${reel.content_id}" title="Sound Mute/Unmute">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              ${this.isMuted ? '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>' : '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>'}
            </svg>
          </button>
          <span class="dock-label mute-label-display">${this.isMuted ? "Muted" : "Sound"}</span>
        </div>

        <!-- Spinning Vinyl Disc -->
        <div class="dock-vinyl-disc" title="Original Status Audio">
          <img class="vinyl-center-img" src="${reel.thumbnail_url}" alt="WhatsApp Status Disc" />
        </div>

      </div>

      <!-- Bottom Content Info Dock -->
      <div class="feed-content-dock">
        <span class="feed-cat-badge">${catIcon} ${catLabel}</span>
        <h2 class="feed-title-text">${reel.title}</h2>
        <p class="feed-desc-text">${reel.description}</p>
        <div class="feed-sound-marquee">
          <div class="marquee-inner">
            <span>\u{1F3B5} Original Nature Soundscape \u2014 Peaceful ${catLabel} Ambient Atmosphere & Birdsong \u2022 </span>
            <span>\u{1F3B5} Original Nature Soundscape \u2014 Peaceful ${catLabel} Ambient Atmosphere & Birdsong \u2022 </span>
          </div>
        </div>
      </div>

      <!-- Video Scrubber Progress Line -->
      <div class="feed-scrubber-line">
        <div class="feed-scrubber-filled"></div>
      </div>
    `;
      const video = item.querySelector("video");
      const progressBar = item.querySelector(".feed-scrubber-filled");
      if (video) {
        video.addEventListener("error", () => {
          const cur = video.src || video.getAttribute("data-src") || "";
          if (cur.includes("cdn.jsdelivr.net")) {
            const fallback = cur.replace("cdn.jsdelivr.net/gh/", "raw.githubusercontent.com/").replace("@main/", "/main/");
            console.log("[ReelsFeed] CDN error, switching instantly to GitHub Raw fallback:", fallback);
            video.src = fallback;
            video.setAttribute("data-src", fallback);
            if (item.classList.contains("active-playing")) {
              video.play().catch(() => {
              });
            }
          }
        });
      }
      if (video && progressBar) {
        video.addEventListener("timeupdate", () => {
          if (video.duration) {
            progressBar.style.width = `${video.currentTime / video.duration * 100}%`;
          }
        });
        video.addEventListener("error", (e) => {
          console.warn("Feed video error:", e);
        });
      }
      return item;
    }
    appendBatch() {
      if (this.renderedCount >= this.filteredReels.length) return;
      const nextBatchCount = Math.min(this.renderedCount + 5, this.filteredReels.length);
      for (let i = this.renderedCount; i < nextBatchCount; i++) {
        const item = this._createReelItem(this.filteredReels[i], i);
        this.container.appendChild(item);
        if (this.observer) {
          this.observer.observe(item);
        }
      }
      this.renderedCount = nextBatchCount;
    }
    render() {
      this.container.innerHTML = "";
      this.renderedCount = 0;
      if (!this.filteredReels || this.filteredReels.length === 0) {
        const catObj = CATEGORIES.find((c) => c.id === this.activeCategory);
        const catName = catObj ? catObj.name : this.activeCategory;
        this.container.innerHTML = `
        <div class="empty-state" style="height: 100%; justify-content: center; text-align: center; padding: 32px 20px; display: flex; flex-direction: column; align-items: center;">
          <img src="assets/logo.svg" alt="WhatsApp Status" style="width: 64px; height: 64px; margin-bottom: 16px; border-radius: 50%; opacity: 0.95;" />
          <h3 class="empty-state-title" style="color: #fff; font-size: 1.3rem; font-weight: 700; margin-bottom: 8px;">No Videos Available</h3>
          <p class="empty-state-subtitle" style="color: rgba(255,255,255,0.7); font-size: 0.9rem; max-width: 300px; margin: 0 auto 24px;">
            There are currently no videos in "${catName}". Explore other categories or check back soon.
          </p>
          <div style="display: flex; gap: 12px;">
            <button type="button" class="btn-feed-go-trending" style="padding: 12px 26px; background: rgba(37, 211, 102, 0.25); border: 1px solid rgba(37, 211, 102, 0.5); color: #fff; border-radius: 9999px; font-weight: 700; font-size: 0.9rem; cursor: pointer;">
              \u{1F525} Explore Trending
            </button>
            <button type="button" class="btn-feed-refresh" style="padding: 12px 24px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); color: #fff; border-radius: 9999px; font-weight: 700; font-size: 0.9rem; cursor: pointer;">
              \u{1F504} Refresh
            </button>
          </div>
        </div>
      `;
        const btnTrend = this.container.querySelector(".btn-feed-go-trending");
        if (btnTrend) {
          btnTrend.addEventListener("click", (e) => {
            e.preventDefault();
            this.filterCategory("trending");
          });
        }
        const btnRef = this.container.querySelector(".btn-feed-refresh");
        if (btnRef) {
          btnRef.addEventListener("click", (e) => {
            e.preventDefault();
            this.refresh();
          });
        }
        return;
      }
      const initialBatch = Math.min(5, this.filteredReels.length);
      for (let i = 0; i < initialBatch; i++) {
        const item = this._createReelItem(this.filteredReels[i], i);
        this.container.appendChild(item);
      }
      this.renderedCount = initialBatch;
      this._initObserver();
      setTimeout(() => {
        const isReelsTab = window.natureAppInstance && window.natureAppInstance.currentView === "reels";
        const reelsView = document.getElementById("view-reels");
        if (isReelsTab && reelsView && reelsView.style.display === "block") {
          this.resumeActive();
        } else {
          this.pauseAll();
        }
      }, 50);
    }
    _updateLanguageUI() {
      this._initCategoryHeader();
      this.render();
    }
  };

  // js/components/reels-grid.js
  var ReelsGrid = class {
    constructor(containerElement, onReelClickCallback) {
      this.container = containerElement;
      this.onReelClick = onReelClickCallback;
      this.reels = [];
      this.activeCategory = "trending";
      window.addEventListener("languageChanged", () => {
        this.render();
      });
    }
    setReels(reelsList, categoryId = "trending") {
      this.reels = reelsList || [];
      this.activeCategory = categoryId;
      this.render();
    }
    render() {
      this.container.innerHTML = "";
      if (!this.reels || this.reels.length === 0) {
        this.renderEmptyState();
        return;
      }
      this.reels.forEach((reel) => {
        const cat = getCategoryById(reel.category_id);
        const catIcon = cat ? cat.icon : "\u2728";
        const catName = cat ? cat.name : "";
        const card = document.createElement("div");
        card.className = "home-reel-card";
        card.setAttribute("data-id", reel.content_id);
        card.setAttribute("id", `home-card-${reel.content_id}`);
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", `Play ${reel.title}`);
        card.innerHTML = `
        <img src="${reel.thumbnail_url}" alt="${reel.title}" loading="lazy" onerror="if(this.src.includes('cdn.jsdelivr.net')){this.src=this.src.replace('cdn.jsdelivr.net/gh/','raw.githubusercontent.com/').replace('@main/','/main/');}else{this.onerror=null;this.src='https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80';}" />
        
        <!-- Category Pill Badge -->
        <div class="home-card-cat-badge">
          <span>${catIcon}</span>
          <span>${catName}</span>
        </div>

        <!-- Center Frosted Glass Play Circle -->
        <div class="home-play-circle" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 2px;">
            <polygon points="6 3 20 12 6 21 6 3"></polygon>
          </svg>
        </div>

        <!-- Duration Badge -->
        <div class="home-card-duration">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 2px;">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>${reel.duration ? reel.duration.includes(":") ? reel.duration : `0:${reel.duration}` : reel.duration_seconds ? `0:${reel.duration_seconds < 10 ? "0" : ""}${reel.duration_seconds}` : "0:15"}</span>
        </div>

        <!-- Card Meta (Title & Stats) -->
        <div class="home-card-meta">
          <h3 class="home-card-title">${reel.title}</h3>
          <div class="home-card-stats">
            <span class="home-card-stat">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              ${reel.views_count.toLocaleString()}
            </span>
            <span class="home-card-stat">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              ${reel.likes_count.toLocaleString()}
            </span>
          </div>
        </div>
      `;
        card.addEventListener("click", () => {
          if (typeof this.onReelClick === "function") {
            this.onReelClick(reel);
          }
        });
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (typeof this.onReelClick === "function") {
              this.onReelClick(reel);
            }
          }
        });
        this.container.appendChild(card);
      });
    }
    renderEmptyState() {
      const emptyWrapper = document.createElement("div");
      emptyWrapper.className = "empty-state";
      emptyWrapper.style.gridColumn = "1 / -1";
      emptyWrapper.style.padding = "60px 16px";
      emptyWrapper.style.textAlign = "center";
      emptyWrapper.innerHTML = `
      <div class="empty-state-icon" style="margin-bottom: 16px;">
        <img src="assets/logo.svg" alt="WhatsApp Status" style="width: 64px; height: 64px; border-radius: 50%; box-shadow: 0 4px 14px rgba(37,211,102,0.3); display: inline-block;" />
      </div>
      <h3 class="empty-state-title" style="color: #17483A; font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">No Videos Available</h3>
      <p class="empty-state-subtitle" style="color: #61756D; font-size: 0.9rem; max-width: 320px; margin: 0 auto 20px; line-height: 1.5;">
        New status videos will appear here soon. Explore trending status videos or check other categories!
      </p>
      <button type="button" id="btn-empty-explore" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: #25D366; color: #fff; border: none; border-radius: 9999px; font-weight: 700; font-size: 0.95rem; cursor: pointer; box-shadow: 0 4px 14px rgba(37,211,102,0.4);">
        <span>\u{1F525} View Trending Status</span>
      </button>
    `;
      const exploreBtn = emptyWrapper.querySelector("#btn-empty-explore");
      if (exploreBtn) {
        exploreBtn.addEventListener("click", () => {
          if (window.app && typeof window.app.onCategorySelect === "function") {
            window.app.onCategorySelect("all");
          } else if (window.app && typeof window.app.switchView === "function") {
            window.app.switchView("reels");
          }
        });
      }
      this.container.appendChild(emptyWrapper);
    }
  };

  // js/components/save-screen.js
  var SaveScreen = class {
    constructor(containerElement, onOpenPlayerCallback, showToastCallback) {
      this.container = containerElement;
      this.onOpenPlayer = onOpenPlayerCallback;
      this.showToast = showToastCallback || console.log;
      this.activeTab = "saved";
      storage.subscribe(() => {
        this.render();
      });
      window.addEventListener("languageChanged", () => {
        this.render();
      });
    }
    setTab(tabName) {
      this.activeTab = tabName;
      this.render();
    }
    async render() {
      const savedCount = storage.getSaved().size;
      const likedCount = storage.getLikes().size;
      let downloadCount = 0;
      try {
        const downloads = await offlineDb.getAllDownloadedReels();
        downloadCount = downloads ? downloads.length : 0;
      } catch (e) {
        console.warn("Could not read offline reels count", e);
      }
      this.container.innerHTML = `
      <!-- Sticky Top Header matching Home design -->
      <header class="save-header-top">
        <div class="save-header-row">
          <!-- Circular Green Hamburger Menu -->
          <button id="btn-save-hamburger" class="home-hamburger-btn" aria-label="Open Navigation Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round">
              <line x1="4" y1="7" x2="20" y2="7"></line>
              <line x1="4" y1="12" x2="16" y2="12"></line>
              <line x1="4" y1="17" x2="18" y2="17"></line>
            </svg>
          </button>

          <!-- Cursive Nature Moments Title -->
          <h1 class="home-app-title">Saved Moments</h1>

          <!-- Spacer to balance header -->
          <div class="home-header-right"></div>
        </div>

        <!-- Segmented Triple Tabs with Live Badge Counts -->
        <div class="save-segmented-tabs">
          <button id="save-tab-saved" class="save-segment-btn ${this.activeTab === "saved" ? "active" : ""}" type="button">
            <span>\u{1F516}</span>
            <span>Saved</span>
            <span class="save-tab-count">${savedCount}</span>
          </button>
          <button id="save-tab-liked" class="save-segment-btn ${this.activeTab === "liked" ? "active" : ""}" type="button">
            <span>\u2764\uFE0F</span>
            <span>Liked</span>
            <span class="save-tab-count">${likedCount}</span>
          </button>
          <button id="save-tab-downloaded" class="save-segment-btn ${this.activeTab === "downloaded" ? "active" : ""}" type="button">
            <span>\u2B07\uFE0F</span>
            <span>Offline</span>
            <span class="save-tab-count">${downloadCount}</span>
          </button>
        </div>
      </header>

      <!-- Content Area for cards or empty state -->
      <div id="save-tab-content"></div>
    `;
      const hamburgerBtn = this.container.querySelector("#btn-save-hamburger");
      if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", () => {
          if (window.app && window.app.sideDrawer) {
            window.app.sideDrawer.open();
          }
        });
      }
      this.container.querySelector("#save-tab-saved").addEventListener("click", () => {
        this.activeTab = "saved";
        this.render();
      });
      this.container.querySelector("#save-tab-liked").addEventListener("click", () => {
        this.activeTab = "liked";
        this.render();
      });
      this.container.querySelector("#save-tab-downloaded").addEventListener("click", () => {
        this.activeTab = "downloaded";
        this.render();
      });
      await this.renderContent();
    }
    async renderContent() {
      const contentArea = this.container.querySelector("#save-tab-content");
      if (!contentArea) return;
      contentArea.innerHTML = "";
      if (this.activeTab === "saved") {
        this.renderSavedTab(contentArea);
      } else if (this.activeTab === "liked") {
        this.renderLikedTab(contentArea);
      } else {
        await this.renderDownloadedTab(contentArea);
      }
    }
    _renderRecommendations(contentArea) {
      const recReels = REELS_DATA.slice(0, 2);
      const recWrapper = document.createElement("div");
      recWrapper.className = "empty-rec-section";
      recWrapper.innerHTML = `
      <div class="empty-rec-header">
        <span>\u2728</span>
        <span>Recommended for You</span>
      </div>
    `;
      const grid = document.createElement("div");
      grid.className = "home-reels-grid";
      grid.style.padding = "0";
      recReels.forEach((reel) => {
        const cat = getCategoryById(reel.category_id);
        const catIcon = cat ? cat.icon : "\u2728";
        const catName = cat ? cat.name : "";
        const card = document.createElement("div");
        card.className = "home-reel-card";
        card.setAttribute("data-id", reel.content_id);
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.innerHTML = `
        <img src="${reel.thumbnail_url}" alt="${reel.title}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80';" />
        <div class="home-card-cat-badge">
          <span>${catIcon}</span>
          <span>${catName}</span>
        </div>
        <div class="home-card-duration">
          <span>\u23F1\uFE0F ${reel.duration}</span>
        </div>
        <div class="home-play-circle" title="Play Video">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="7 4 19 12 7 20 7 4"></polygon>
          </svg>
        </div>
      `;
        card.addEventListener("click", () => {
          if (typeof this.onOpenPlayer === "function") {
            this.onOpenPlayer(reel, { isOffline: false });
          }
        });
        grid.appendChild(card);
      });
      recWrapper.appendChild(grid);
      contentArea.appendChild(recWrapper);
    }
    // 1. SAVED (BOOKMARKS) TAB
    renderSavedTab(contentArea) {
      const savedIds = storage.getSaved();
      const savedReels = REELS_DATA.filter((r) => savedIds.has(r.content_id));
      if (savedReels.length === 0) {
        contentArea.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3 class="empty-state-title">No saved reels yet</h3>
          <p class="empty-state-subtitle">Bookmark peaceful moments to build your personal collection.</p>
          <button class="empty-state-action-btn" type="button" onclick="window.app && window.app.switchView('home')">
            <img src="assets/logo.svg" alt="WhatsApp Status" style="width: 20px; height: 20px; vertical-align: middle; border-radius: 50%;" />
            <span>Explore Status Videos</span>
          </button>
        </div>
      `;
        this._renderRecommendations(contentArea);
        return;
      }
      const grid = document.createElement("div");
      grid.className = "home-reels-grid";
      savedReels.forEach((reel) => {
        const cat = getCategoryById(reel.category_id);
        const catIcon = cat ? cat.icon : "\u2728";
        const catName = cat ? cat.name : "";
        const card = document.createElement("div");
        card.className = "home-reel-card";
        card.setAttribute("data-id", reel.content_id);
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.innerHTML = `
        <img src="${reel.thumbnail_url}" alt="${reel.title}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80';" />
        
        <div class="home-card-cat-badge">
          <span>${catIcon}</span>
          <span>${catName}</span>
        </div>

        <div class="home-card-duration">
          <span>\u23F1\uFE0F ${reel.duration}</span>
        </div>

        <!-- Unsave badge -->
        <button class="save-card-action-badge" title="Remove Bookmark" aria-label="Remove Bookmark">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#1B4D3E" stroke="#1B4D3E" stroke-width="1.5">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>

        <div class="home-play-circle" title="Play Video">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="7 4 19 12 7 20 7 4"></polygon>
          </svg>
        </div>
      `;
        const unsaveBtn = card.querySelector(".save-card-action-badge");
        unsaveBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          storage.toggleSave(reel.content_id);
          this.showToast("Removed from saved bookmarks", "\u2139\uFE0F");
          this.render();
        });
        card.addEventListener("click", () => {
          if (typeof this.onOpenPlayer === "function") {
            this.onOpenPlayer(reel, { isOffline: false });
          }
        });
        grid.appendChild(card);
      });
      contentArea.appendChild(grid);
    }
    // 2. LIKED (GENUINE USER LIKES) TAB
    renderLikedTab(contentArea) {
      const likedIds = storage.getLikes();
      const likedReels = REELS_DATA.filter((r) => likedIds.has(r.content_id));
      if (likedReels.length === 0) {
        contentArea.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <h3 class="empty-state-title">No liked reels yet</h3>
          <p class="empty-state-subtitle">Tap the heart on any video you love to save it here.</p>
          <button class="empty-state-action-btn" type="button" onclick="window.app && window.app.switchView('home')">
            <img src="assets/logo.svg" alt="WhatsApp Status" style="width: 20px; height: 20px; vertical-align: middle; border-radius: 50%;" />
            <span>Discover Status Videos</span>
          </button>
        </div>
      `;
        this._renderRecommendations(contentArea);
        return;
      }
      const grid = document.createElement("div");
      grid.className = "home-reels-grid";
      likedReels.forEach((reel) => {
        const cat = getCategoryById(reel.category_id);
        const catIcon = cat ? cat.icon : "\u2728";
        const catName = cat ? cat.name : "";
        const card = document.createElement("div");
        card.className = "home-reel-card";
        card.setAttribute("data-id", reel.content_id);
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.innerHTML = `
        <img src="${reel.thumbnail_url}" alt="${reel.title}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80';" />
        
        <div class="home-card-cat-badge">
          <span>${catIcon}</span>
          <span>${catName}</span>
        </div>

        <div class="home-card-duration">
          <span>\u23F1\uFE0F ${reel.duration}</span>
        </div>

        <!-- Unlike button badge -->
        <button class="save-card-action-badge" title="Unlike Reel" aria-label="Unlike Reel">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#E53935" stroke="#E53935" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <div class="home-play-circle" title="Play Video">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="7 4 19 12 7 20 7 4"></polygon>
          </svg>
        </div>
      `;
        const unlikeBtn = card.querySelector(".save-card-action-badge");
        unlikeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          storage.toggleLike(reel.content_id);
          this.showToast("Removed from Liked Reels", "\u{1F90D}");
          this.render();
        });
        card.addEventListener("click", () => {
          if (typeof this.onOpenPlayer === "function") {
            this.onOpenPlayer(reel, { isOffline: false });
          }
        });
        grid.appendChild(card);
      });
      contentArea.appendChild(grid);
    }
    // 3. DOWNLOADED (OFFLINE MEDIA) TAB
    async renderDownloadedTab(contentArea) {
      let downloads = [];
      try {
        downloads = await offlineDb.getAllDownloadedReels();
      } catch (e) {
        console.warn("Error reading offline reels", e);
      }
      if (!downloads || downloads.length === 0) {
        contentArea.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
          <h3 class="empty-state-title">No offline downloads yet</h3>
          <p class="empty-state-subtitle">Download status reels to watch anytime, completely offline.</p>
          <button class="empty-state-action-btn" type="button" onclick="window.app && window.app.switchView('home')">
            <img src="assets/logo.svg" alt="WhatsApp Status" style="width: 20px; height: 20px; vertical-align: middle; border-radius: 50%;" />
            <span>Browse Status Videos</span>
          </button>
        </div>
      `;
        this._renderRecommendations(contentArea);
        return;
      }
      const grid = document.createElement("div");
      grid.className = "home-reels-grid";
      downloads.forEach((dlItem) => {
        const card = document.createElement("div");
        card.className = "home-reel-card";
        card.setAttribute("data-id", dlItem.content_id);
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.innerHTML = `
        <img src="${dlItem.thumbnail_url}" alt="${dlItem.title}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80';" />
        
        <div class="home-card-cat-badge">
          <span>\u26A1</span>
          <span>OFFLINE</span>
        </div>

        <div class="home-card-duration">
          <span>\u{1F4C1} ${dlItem.formatted_size || "HD"}</span>
        </div>

        <!-- Delete download badge -->
        <button class="save-card-action-badge" title="Delete from Offline Storage" aria-label="Delete File">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E53935" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>

        <div class="home-play-circle" title="Play Offline Video">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="7 4 19 12 7 20 7 4"></polygon>
          </svg>
        </div>
      `;
        const deleteBtn = card.querySelector(".save-card-action-badge");
        deleteBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          await offlineDb.deleteDownloadedReel(dlItem.content_id);
          this.showToast("Downloaded video removed from device", "\u{1F5D1}\uFE0F");
          this.render();
        });
        card.addEventListener("click", async () => {
          try {
            const blobUrl = await offlineDb.getPlaybackUrl(dlItem.content_id);
            if (typeof this.onOpenPlayer === "function") {
              this.onOpenPlayer(dlItem, {
                isOffline: true,
                offlineBlobUrl: blobUrl
              });
            }
          } catch (err) {
            console.error(err);
            this.showToast("Could not load local video file", "\u274C");
          }
        });
        grid.appendChild(card);
      });
      contentArea.appendChild(grid);
    }
  };

  // js/components/side-drawer.js
  var SideDrawer = class {
    constructor(backdropElement, callbacks = {}) {
      this.backdrop = backdropElement;
      this.callbacks = callbacks;
      this.isOpen = false;
      this._bindEvents();
      this.updateLabels();
      window.addEventListener("languageChanged", () => {
        this.updateLabels();
      });
    }
    _bindEvents() {
      this.backdrop.addEventListener("click", (e) => {
        if (e.target === this.backdrop) {
          this.close();
        }
      });
      const closeBtn = this.backdrop.querySelector("#drawer-btn-close");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => this.close());
      }
      const langBtn = this.backdrop.querySelector("#drawer-item-language");
      if (langBtn) {
        langBtn.addEventListener("click", () => {
          this.close();
          if (this.callbacks.onOpenLanguage) this.callbacks.onOpenLanguage();
        });
      }
      const fbBtn = this.backdrop.querySelector("#drawer-item-feedback");
      if (fbBtn) {
        fbBtn.addEventListener("click", () => {
          this.close();
          if (this.callbacks.onOpenFeedback) this.callbacks.onOpenFeedback();
        });
      }
      const rateBtn = this.backdrop.querySelector("#drawer-item-rate");
      if (rateBtn) {
        rateBtn.addEventListener("click", () => {
          this.close();
          if (this.callbacks.onOpenRate) this.callbacks.onOpenRate();
        });
      }
      const shareBtn = this.backdrop.querySelector("#drawer-item-share");
      if (shareBtn) {
        shareBtn.addEventListener("click", async () => {
          this.close();
          await shareService.shareApp();
        });
      }
      const privacyBtn = this.backdrop.querySelector("#drawer-item-privacy");
      if (privacyBtn) {
        privacyBtn.addEventListener("click", () => {
          this.close();
          if (this.callbacks.onOpenPrivacy) this.callbacks.onOpenPrivacy();
        });
      }
    }
    open() {
      this.isOpen = true;
      this.backdrop.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    close() {
      this.isOpen = false;
      this.backdrop.classList.remove("open");
      document.body.style.overflow = "";
    }
    toggle() {
      if (this.isOpen) this.close();
      else this.open();
    }
    updateLabels() {
      const langLabel = this.backdrop.querySelector("#drawer-label-language");
      const fbLabel = this.backdrop.querySelector("#drawer-label-feedback");
      const rateLabel = this.backdrop.querySelector("#drawer-label-rate");
      const shareLabel = this.backdrop.querySelector("#drawer-label-share");
      const privLabel = this.backdrop.querySelector("#drawer-label-privacy");
      const langBadge = this.backdrop.querySelector("#drawer-lang-code");
      if (langLabel) langLabel.textContent = i18n.t("drawer_language");
      if (fbLabel) fbLabel.textContent = i18n.t("drawer_feedback");
      if (rateLabel) rateLabel.textContent = i18n.t("drawer_rate");
      if (shareLabel) shareLabel.textContent = i18n.t("drawer_share");
      if (privLabel) privLabel.textContent = i18n.t("drawer_privacy");
      if (langBadge) {
        const code = i18n.getLanguage ? i18n.getLanguage() : "en";
        const langObj = LANGUAGES.find((l) => l.code === code);
        langBadge.textContent = langObj ? langObj.name : code.toUpperCase();
      }
    }
  };

  // js/components/modals.js
  var ModalsManager = class {
    constructor(showToastCallback) {
      this.showToast = showToastCallback || console.log;
      this.selectedLangTemp = i18n.getLanguage();
      this._initModals();
    }
    _initModals() {
      this.langModal = document.getElementById("modal-language");
      this.feedbackModal = document.getElementById("modal-feedback");
      this.rateModal = document.getElementById("modal-rate");
      this.privacyModal = document.getElementById("modal-privacy");
      this._bindLanguageModal();
      this._bindFeedbackModal();
      this._bindRateModal();
      this._bindPrivacyModal();
    }
    // --- 1. LANGUAGE SELECTION MODAL ---
    _bindLanguageModal() {
      if (!this.langModal) return;
      const closeBtn = this.langModal.querySelector("#lang-btn-back");
      const doneBtn = this.langModal.querySelector("#lang-btn-done");
      const listContainer = this.langModal.querySelector("#lang-options-list");
      const renderList = () => {
        listContainer.innerHTML = "";
        const currentCode = this.selectedLangTemp;
        LANGUAGES.forEach((lang) => {
          const card = document.createElement("div");
          const isSelected = lang.code === currentCode;
          card.className = `lang-card ${isSelected ? "active" : ""}`;
          card.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          margin-bottom: 10px;
          border-radius: var(--radius-md);
          background: ${isSelected ? "var(--color-dark-green)" : "var(--color-white)"};
          color: ${isSelected ? "#FFFFFF" : "var(--color-text-dark)"};
          border: 1.5px solid ${isSelected ? "var(--color-dark-green)" : "var(--color-light-gray)"};
          cursor: pointer;
          transition: all var(--trans-fast);
          box-shadow: var(--shadow-sm);
        `;
          card.innerHTML = `
          <div>
            <div style="font-size: 1.05rem; font-weight: 700;">${lang.nativeName}</div>
            <div style="font-size: 0.78rem; opacity: 0.75;">${lang.name}</div>
          </div>
          <div style="width: 24px; height: 24px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; background: ${isSelected ? "var(--color-soft-yellow)" : "transparent"}; color: var(--color-dark-green);">
            ${isSelected ? `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ` : ""}
          </div>
        `;
          card.addEventListener("click", () => {
            this.selectedLangTemp = lang.code;
            renderList();
          });
          listContainer.appendChild(card);
        });
      };
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          this.langModal.classList.remove("open");
        });
      }
      if (doneBtn) {
        doneBtn.addEventListener("click", () => {
          i18n.setLanguage(this.selectedLangTemp);
          this.langModal.classList.remove("open");
          this.showToast("Language updated successfully!", "\u{1F310}");
        });
      }
      this.langModal.addEventListener("click", (e) => {
        if (e.target === this.langModal) this.langModal.classList.remove("open");
      });
      this._renderLangList = renderList;
    }
    openLanguage() {
      this.selectedLangTemp = i18n.getLanguage();
      if (this._renderLangList) this._renderLangList();
      this.langModal.classList.add("open");
    }
    // --- 2. FEEDBACK MODAL ---
    _bindFeedbackModal() {
      if (!this.feedbackModal) return;
      const closeBtn = this.feedbackModal.querySelector("#feedback-btn-close");
      const submitBtn = this.feedbackModal.querySelector("#feedback-btn-submit");
      const textarea = this.feedbackModal.querySelector("#feedback-textarea");
      const stars = this.feedbackModal.querySelectorAll(".feedback-star");
      let currentRating = 5;
      stars.forEach((star) => {
        star.addEventListener("click", () => {
          currentRating = parseInt(star.getAttribute("data-value"), 10);
          stars.forEach((s) => {
            const val = parseInt(s.getAttribute("data-value"), 10);
            if (val <= currentRating) {
              s.style.color = "var(--color-gold)";
              s.style.fill = "var(--color-gold)";
            } else {
              s.style.color = "#ccc";
              s.style.fill = "none";
            }
          });
        });
      });
      if (closeBtn) {
        closeBtn.addEventListener("click", () => this.feedbackModal.classList.remove("open"));
      }
      if (submitBtn) {
        submitBtn.addEventListener("click", () => {
          const text = textarea ? textarea.value.trim() : "";
          storage.saveFeedback({
            rating: currentRating,
            comment: text
          });
          if (textarea) textarea.value = "";
          this.feedbackModal.classList.remove("open");
          this.showToast(i18n.t("feedback_thanks"), "\u{1F33F}");
        });
      }
      this.feedbackModal.addEventListener("click", (e) => {
        if (e.target === this.feedbackModal) this.feedbackModal.classList.remove("open");
      });
    }
    openFeedback() {
      this.feedbackModal.classList.add("open");
    }
    // --- 3. RATE APP MODAL ---
    _bindRateModal() {
      if (!this.rateModal) return;
      const closeBtn = this.rateModal.querySelector("#rate-btn-close");
      const playStoreBtn = this.rateModal.querySelector("#rate-btn-playstore");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => this.rateModal.classList.remove("open"));
      }
      if (playStoreBtn) {
        playStoreBtn.addEventListener("click", () => {
          const playUrl = "market://details?id=com.naturemoments.app";
          const webUrl = "https://play.google.com/store/apps/details?id=com.naturemoments.app";
          try {
            window.open(playUrl, "_blank");
          } catch (e) {
            window.open(webUrl, "_blank");
          }
          this.rateModal.classList.remove("open");
          this.showToast("Thank you for rating Nature Moments!", "\u2B50");
        });
      }
      this.rateModal.addEventListener("click", (e) => {
        if (e.target === this.rateModal) this.rateModal.classList.remove("open");
      });
    }
    openRate() {
      this.rateModal.classList.add("open");
    }
    // --- 4. PRIVACY POLICY MODAL ---
    _bindPrivacyModal() {
      if (!this.privacyModal) return;
      const closeBtn = this.privacyModal.querySelector("#privacy-btn-close");
      const okBtn = this.privacyModal.querySelector("#privacy-btn-ok");
      if (closeBtn) closeBtn.addEventListener("click", () => this.privacyModal.classList.remove("open"));
      if (okBtn) okBtn.addEventListener("click", () => this.privacyModal.classList.remove("open"));
      this.privacyModal.addEventListener("click", (e) => {
        if (e.target === this.privacyModal) this.privacyModal.classList.remove("open");
      });
    }
    openPrivacy() {
      this.privacyModal.classList.add("open");
    }
  };

  // js/app.js
  var NatureMomentsApp = class {
    constructor() {
      this.currentView = "home";
      this.currentCategory = "trending";
      window.natureAppInstance = this;
      window.pauseAllMedia = () => {
        document.querySelectorAll("video").forEach((v) => {
          try {
            v.pause();
            v.muted = true;
          } catch (e) {
          }
        });
        if (this.reelsFeed) {
          try {
            this.reelsFeed.pauseAll();
          } catch (e) {
          }
        }
        if (this.player && this.player.video) {
          try {
            this.player.video.pause();
            this.player.video.muted = true;
          } catch (e) {
          }
        }
        try {
          soundEngine.stop();
        } catch (e) {
        }
      };
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          window.pauseAllMedia();
        }
      });
      window.addEventListener("pagehide", () => window.pauseAllMedia());
      window.addEventListener("blur", () => window.pauseAllMedia());
      this._initToast();
      this._initSplashScreen();
      this._initDomReferences();
      this._initComponents();
      this._initHomeCategories();
      this._bindNavigation();
      this._checkUrlParameters();
      window.pauseAllMedia();
    }
    _initToast() {
      this.toastContainer = document.getElementById("toast-container");
      this.toastTimer = null;
    }
    _initSplashScreen() {
      const splash = document.getElementById("app-splash-screen");
      if (!splash) return;
      const dismiss = () => {
        if (splash.classList.contains("splash-dismissed")) return;
        splash.classList.add("splash-dismissed");
        setTimeout(() => {
          splash.style.display = "none";
        }, 500);
      };
      splash.addEventListener("click", dismiss);
      setTimeout(dismiss, 2600);
    }
    showToast(message, icon = "\u2728") {
      if (!this.toastContainer) return;
      this.toastContainer.innerHTML = "";
      const toast = document.createElement("div");
      toast.className = "toast";
      toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span>${message}</span>
    `;
      this.toastContainer.appendChild(toast);
      requestAnimationFrame(() => {
        toast.classList.add("show");
      });
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
      }, 3e3);
    }
    _initDomReferences() {
      this.homeView = document.getElementById("view-home");
      this.reelsView = document.getElementById("view-reels");
      this.saveView = document.getElementById("view-save");
      this.navBtnBack = document.getElementById("nav-item-back");
      this.navBtnHome = document.getElementById("nav-item-home");
      this.navBtnReels = document.getElementById("nav-item-reels");
      this.navBtnSave = document.getElementById("nav-item-save");
      this.btnHamburger = document.getElementById("btn-hamburger");
      this.btnHomeHamburger = document.getElementById("btn-home-hamburger");
      this.btnHomeSound = document.getElementById("btn-home-sound");
    }
    _initComponents() {
      this.modals = new ModalsManager((msg, icon) => this.showToast(msg, icon));
      const drawerBackdrop = document.getElementById("drawer-backdrop");
      this.sideDrawer = new SideDrawer(drawerBackdrop, {
        onOpenLanguage: () => this.modals.openLanguage(),
        onOpenFeedback: () => this.modals.openFeedback(),
        onOpenRate: () => this.modals.openRate(),
        onOpenPrivacy: () => this.modals.openPrivacy()
      });
      if (this.btnHamburger) {
        this.btnHamburger.addEventListener("click", () => this.sideDrawer.open());
      }
      if (this.btnHomeHamburger) {
        this.btnHomeHamburger.addEventListener("click", () => this.sideDrawer.open());
      }
      const btnReelsBack = document.getElementById("btn-reels-back");
      if (btnReelsBack) {
        btnReelsBack.addEventListener("click", () => {
          this.switchView("home");
        });
      }
      const playerOverlay = document.getElementById("video-player-overlay");
      this.player = new VideoPlayer(playerOverlay, (msg, icon) => this.showToast(msg, icon));
      const homeGridContainer = document.getElementById("home-reels-grid-container");
      if (homeGridContainer) {
        this.homeGrid = new ReelsGrid(homeGridContainer, (reel) => {
          this.openReelInFeed(reel);
        });
        this.homeGrid.setReels(getReelsByCategory("trending"), "trending");
      }
      const reelsFeedContainer = document.getElementById("reels-feed-container");
      this.reelsFeed = new ReelsFeed(reelsFeedContainer, (msg, icon) => this.showToast(msg, icon));
      this.reelsFeed.onCategoryChange = (categoryId) => {
        this.currentCategory = categoryId;
        if (this.homeGrid) {
          const reels = getReelsByCategory(categoryId);
          this.homeGrid.setReels(reels, categoryId);
        }
        const chips = document.querySelectorAll(".home-cat-chip");
        chips.forEach((c) => {
          if (c.getAttribute("data-id") === categoryId) {
            c.classList.add("active");
          } else {
            c.classList.remove("active");
          }
        });
      };
      const saveScreenContainer = document.getElementById("save-screen-container");
      this.saveScreen = new SaveScreen(saveScreenContainer, (reel, opts) => {
        this.openReelInFeed(reel);
      }, (msg, icon) => this.showToast(msg, icon));
      window.addEventListener("reelsUpdated", () => {
        this._initHomeCategories();
        if (this.homeGrid) {
          const reels = getReelsByCategory(this.currentCategory);
          this.homeGrid.setReels(reels, this.currentCategory);
        }
        if (this.reelsFeed) {
          this.reelsFeed.refresh();
        }
      });
      i18n.updateDom();
    }
    _initHomeCategories() {
      const scroller = document.getElementById("home-category-scroller");
      if (!scroller) return;
      scroller.innerHTML = "";
      CATEGORIES.forEach((cat) => {
        const chip = document.createElement("button");
        chip.className = `home-cat-chip ${cat.id === this.currentCategory ? "active" : ""}`;
        chip.setAttribute("data-id", cat.id);
        chip.setAttribute("id", `home-cat-${cat.id}`);
        chip.setAttribute("type", "button");
        chip.setAttribute("aria-label", `Category ${cat.name}`);
        chip.innerHTML = `
        <img src="${cat.image_url}" alt="${cat.name}" loading="lazy" />
        <span>${cat.name}</span>
      `;
        chip.addEventListener("click", (e) => {
          e.preventDefault();
          this.selectCategory(cat.id);
        });
        scroller.appendChild(chip);
      });
    }
    selectCategory(categoryId) {
      this.currentCategory = categoryId;
      const chips = document.querySelectorAll(".home-cat-chip");
      chips.forEach((c) => {
        if (c.getAttribute("data-id") === categoryId) {
          c.classList.add("active");
          c.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        } else {
          c.classList.remove("active");
        }
      });
      const cat = getCategoryById(categoryId);
      const headingEl = document.getElementById("home-category-heading");
      const iconEl = document.getElementById("home-section-icon");
      if (headingEl && cat) {
        headingEl.textContent = `${cat.name} Status & Reels`;
      }
      if (iconEl && cat) {
        iconEl.textContent = cat.icon || "\u2728";
      }
      if (this.homeGrid) {
        const reels = getReelsByCategory(categoryId);
        this.homeGrid.setReels(reels, categoryId);
      }
      if (this.reelsFeed && this.reelsFeed.activeCategory !== categoryId) {
        this.reelsFeed.filterCategory(categoryId);
      }
    }
    _bindNavigation() {
      if (this.navBtnBack) {
        this.navBtnBack.addEventListener("click", () => {
          if (this.currentView === "reels" || this.currentView === "save") {
            this.switchView("home");
          } else if (this.sideDrawer && this.sideDrawer.isOpen) {
            this.sideDrawer.close();
          } else {
            this.switchView("home");
          }
        });
      }
      if (this.navBtnHome) {
        this.navBtnHome.addEventListener("click", () => this.switchView("home"));
      }
      if (this.navBtnReels) {
        this.navBtnReels.addEventListener("click", () => this.switchView("reels"));
      }
      if (this.navBtnSave) {
        this.navBtnSave.addEventListener("click", () => this.switchView("save"));
      }
      window.addEventListener("popstate", () => {
        if (this.player && this.player.overlay.classList.contains("active")) {
          this.player.close();
        } else if (this.sideDrawer && this.sideDrawer.isOpen) {
          this.sideDrawer.close();
        } else if (this.currentView === "save") {
          this.switchView("home");
        }
      });
      const exitModal = document.getElementById("modal-exit-confirm");
      const btnCancelExit = document.getElementById("btn-cancel-exit");
      const btnConfirmExit = document.getElementById("btn-confirm-exit");
      const hideExitModal = () => {
        if (exitModal) {
          exitModal.classList.remove("open");
          exitModal.style.display = "none";
        }
      };
      const showExitModal = () => {
        if (exitModal) {
          exitModal.style.display = "flex";
          exitModal.classList.add("open");
        }
      };
      if (btnCancelExit) {
        btnCancelExit.addEventListener("click", hideExitModal);
      }
      if (btnConfirmExit) {
        btnConfirmExit.addEventListener("click", () => {
          hideExitModal();
          if (window.AndroidBridge && typeof window.AndroidBridge.exitApp === "function") {
            window.AndroidBridge.exitApp();
          }
        });
      }
      if (exitModal) {
        exitModal.addEventListener("click", (e) => {
          if (e.target === exitModal) {
            hideExitModal();
          }
        });
      }
      window.handleAndroidBack = () => {
        const splash = document.getElementById("app-splash-screen");
        if (splash && !splash.classList.contains("splash-dismissed") && splash.style.display !== "none") {
          splash.classList.add("splash-dismissed");
          setTimeout(() => {
            splash.style.display = "none";
          }, 500);
          return true;
        }
        if (exitModal && (exitModal.classList.contains("open") || exitModal.style.display === "flex")) {
          hideExitModal();
          return true;
        }
        if (this.player && this.player.overlay && (this.player.overlay.classList.contains("active") || this.player.overlay.style.display === "flex")) {
          this.player.close();
          return true;
        }
        if (this.sideDrawer && this.sideDrawer.isOpen) {
          this.sideDrawer.close();
          return true;
        }
        const openModals = document.querySelectorAll('.modal-overlay.open, .modal-overlay[style*="display: flex"]');
        let modalClosed = false;
        openModals.forEach((m) => {
          if (m.id !== "modal-exit-confirm") {
            m.classList.remove("open");
            m.style.display = "none";
            modalClosed = true;
          }
        });
        if (modalClosed) {
          return true;
        }
        if (this.currentView === "save" || this.currentView === "reels") {
          this.switchView("home");
          return true;
        }
        if (exitModal) {
          showExitModal();
          return true;
        } else if (window.AndroidBridge && typeof window.AndroidBridge.exitApp === "function") {
          window.AndroidBridge.exitApp();
          return true;
        }
        return false;
      };
      window.showExitConfirm = window.handleAndroidBack;
    }
    switchView(viewName, skipResume = false) {
      this.currentView = viewName;
      const bottomNav = document.getElementById("bottom-nav-bar");
      [this.navBtnBack, this.navBtnHome, this.navBtnReels, this.navBtnSave].forEach((btn) => {
        if (btn) {
          btn.classList.remove("active");
          btn.classList.remove("highlight-back");
          btn.style.color = "";
        }
      });
      const floatingHeader = document.getElementById("reels-floating-header");
      if (viewName === "home") {
        if (bottomNav) {
          bottomNav.classList.remove("bottom-nav-dark");
          bottomNav.classList.add("bottom-nav-light");
        }
        if (this.navBtnHome) {
          this.navBtnHome.classList.add("active");
        }
        if (this.homeView) this.homeView.style.display = "block";
        if (this.reelsView) this.reelsView.style.display = "none";
        if (this.saveView) this.saveView.style.display = "none";
        if (floatingHeader) floatingHeader.style.display = "none";
        if (this.reelsFeed) this.reelsFeed.pauseAll();
        if (this.player && this.player.video) this.player.video.pause();
        if (window.pauseAllMedia) window.pauseAllMedia();
      } else if (viewName === "reels") {
        if (bottomNav) {
          bottomNav.classList.remove("bottom-nav-dark");
          bottomNav.classList.add("bottom-nav-light");
        }
        if (this.navBtnReels) {
          this.navBtnReels.classList.add("active");
        }
        if (this.navBtnBack) {
          this.navBtnBack.classList.add("highlight-back");
        }
        if (this.homeView) this.homeView.style.display = "none";
        if (this.reelsView) this.reelsView.style.display = "block";
        if (this.saveView) this.saveView.style.display = "none";
        if (floatingHeader) floatingHeader.style.display = "block";
        if (this.reelsFeed && !skipResume) {
          this.reelsFeed.resumeActive();
        }
      } else if (viewName === "save") {
        if (bottomNav) {
          bottomNav.classList.remove("bottom-nav-dark");
          bottomNav.classList.add("bottom-nav-light");
        }
        if (this.navBtnSave) {
          this.navBtnSave.classList.add("active");
        }
        if (this.homeView) this.homeView.style.display = "none";
        if (this.reelsView) this.reelsView.style.display = "none";
        if (this.saveView) this.saveView.style.display = "block";
        if (floatingHeader) floatingHeader.style.display = "none";
        if (this.reelsFeed) this.reelsFeed.pauseAll();
        if (this.player && this.player.video) this.player.video.pause();
        if (window.pauseAllMedia) window.pauseAllMedia();
        this.saveScreen.render();
      }
    }
    // Opens reel directly in full-screen snap-scrolling Reels Feed so user can continuously scroll
    openReelInFeed(reel) {
      if (!reel || !reel.content_id) return;
      this.switchView("reels", true);
      if (this.reelsFeed) {
        this.reelsFeed.scrollToReel(reel.content_id, this.currentCategory);
      }
    }
    _checkUrlParameters() {
      const params = new URLSearchParams(window.location.search);
      const reelId = params.get("reel");
      if (reelId) {
        const targetReel = getReelById(reelId);
        if (targetReel) {
          setTimeout(() => this.openReelInFeed(targetReel), 300);
        }
      }
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    window.app = new NatureMomentsApp();
  });
})();
