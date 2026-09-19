/* ==========================================================
   NATURE MOMENTS — AUTHENTIC REELS SERVICE & DATASET
   Curated 9:16 vertical nature reels with real-time sync,
   remote fetching from GitHub, and live BroadcastChannel updates.
   ========================================================== */

export const INITIAL_REELS = [];

export let REELS_DATA = [...INITIAL_REELS];

// Dynamic merge function
export function loadAllReels() {
  const mergedMap = new Map();

  // 1. Add base reels
  INITIAL_REELS.forEach(r => mergedMap.set(r.content_id, r));

  // 2. Add local custom reels from Admin Panel
  try {
    const custom = localStorage.getItem('nature_custom_reels');
    if (custom) {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed)) {
        parsed.forEach(r => {
          if (r && r.content_id) {
            mergedMap.set(r.content_id, r);
          }
        });
      }
    }
  } catch (e) {
    console.warn('Error reading custom reels from localStorage:', e);
  }

  // 3. Apply persistent engagement overrides (likes, shares, downloads, views)
  try {
    const engagements = JSON.parse(localStorage.getItem('nature_reels_engagement') || '{}');
    mergedMap.forEach((r, id) => {
      if (engagements[id]) {
        const eng = engagements[id];
        if (typeof eng.likes === 'number') r.likes_count = eng.likes;
        if (typeof eng.shares === 'number') r.shares_count = eng.shares;
        if (typeof eng.downloads === 'number') r.downloads_count = eng.downloads;
        if (typeof eng.views === 'number') r.views_count = eng.views;
      }
    });
  } catch (e) {
    console.warn('Error applying engagement overrides:', e);
  }

  // 4. Return sorted array (newest / custom on top)
  const all = Array.from(mergedMap.values());
  all.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  REELS_DATA = all;
  return REELS_DATA;
}

// Initial load
loadAllReels();

// Cloud API Base URL
const CLOUD_API_URL = 'https://nature-moments-app.vercel.app/api/reels';

// Remote fetch function to sync from Cloud API & GitHub
export async function syncRemoteReels() {
  const urls = [
    `${CLOUD_API_URL}?t=${Date.now()}`,
    `https://raw.githubusercontent.com/gulshanyadaav8810-svg/terra-nova-nature/main/data/reels.json?t=${Date.now()}`,
    `data/reels.json?t=${Date.now()}`
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const remoteReels = await res.json();
        if (Array.isArray(remoteReels)) {
          const merged = new Map();
          INITIAL_REELS.forEach(r => merged.set(r.content_id, r));
          remoteReels.forEach(r => merged.set(r.content_id, r));
          
          // Also persist any local customs
          const custom = localStorage.getItem('nature_custom_reels');
          if (custom) {
            try {
              const parsed = JSON.parse(custom);
              if (Array.isArray(parsed)) {
                parsed.forEach(r => merged.set(r.content_id, r));
              }
            } catch (e) {}
          }

          // Also apply local engagement overrides
          try {
            const engagements = JSON.parse(localStorage.getItem('nature_reels_engagement') || '{}');
            merged.forEach((r, id) => {
              if (engagements[id]) {
                const eng = engagements[id];
                if (typeof eng.likes === 'number') r.likes_count = Math.max(r.likes_count || 0, eng.likes);
                if (typeof eng.shares === 'number') r.shares_count = Math.max(r.shares_count || 0, eng.shares);
                if (typeof eng.downloads === 'number') r.downloads_count = Math.max(r.downloads_count || 0, eng.downloads);
                if (typeof eng.views === 'number') r.views_count = Math.max(r.views_count || 0, eng.views);
              }
            });
          } catch (e) {}

          const all = Array.from(merged.values());
          all.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
          REELS_DATA = all;
          window.dispatchEvent(new CustomEvent('reelsUpdated', { detail: REELS_DATA }));
          return REELS_DATA;
        }
      }
    } catch (err) {
      // Continue to next fallback
    }
  }
  return REELS_DATA;
}

// Automatically sync when online, on window focus, and on periodic poll
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => syncRemoteReels());
  window.addEventListener('focus', () => syncRemoteReels());
  setTimeout(() => syncRemoteReels(), 800);
  setInterval(() => syncRemoteReels(), 15000); // 15s live polling

  // BroadcastChannel for 0-millisecond cross-tab admin sync
  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel('nature_moments_sync');
    channel.onmessage = (event) => {
      const { type, reel, content_id } = event.data || {};
      if (type === 'ADD_REEL' && reel) {
        loadAllReels();
        window.dispatchEvent(new CustomEvent('reelsUpdated', { detail: REELS_DATA }));
      } else if (type === 'DELETE_REEL' && content_id) {
        loadAllReels();
        window.dispatchEvent(new CustomEvent('reelsUpdated', { detail: REELS_DATA }));
      } else if (type === 'ADD_REELS_BATCH' || type === 'DELETE_REELS_BATCH' || type === 'WIPE_ALL_REELS') {
        loadAllReels();
        window.dispatchEvent(new CustomEvent('reelsUpdated', { detail: REELS_DATA }));
      } else if (type === 'ENGAGEMENT_TRACKED') {
        loadAllReels();
        window.dispatchEvent(new CustomEvent('reelsUpdated', { detail: REELS_DATA }));
        window.dispatchEvent(new CustomEvent('reelEngagementUpdated', { detail: event.data }));
      }
    };
  }
}

export function getReelsByCategory(categoryId) {
  loadAllReels();
  if (!categoryId || categoryId === 'trending') {
    return REELS_DATA.filter(r => r.is_trending);
  }
  return REELS_DATA.filter(r => r.category_id === categoryId);
}

export function getReelById(contentId) {
  loadAllReels();
  return REELS_DATA.find(r => r.content_id === contentId);
}

async function syncToCloudApi(action, data) {
  try {
    const payload = { action, ...data };
    await fetch(CLOUD_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    // Background cloud sync failed, local persistence still active
  }
}

export function trackEngagement(contentId, metric) {
  let reel = REELS_DATA.find(r => r.content_id === contentId);
  if (!reel) {
    loadAllReels();
    reel = REELS_DATA.find(r => r.content_id === contentId);
  }

  let likesCount = reel ? (reel.likes_count || 0) : 0;
  let sharesCount = reel ? (reel.shares_count || 0) : 0;
  let downloadsCount = reel ? (reel.downloads_count || 0) : 0;
  let viewsCount = reel ? (reel.views_count || 0) : 0;

  if (metric === 'like') likesCount += 1;
  else if (metric === 'unlike') likesCount = Math.max(0, likesCount - 1);
  else if (metric === 'share') sharesCount += 1;
  else if (metric === 'download') downloadsCount += 1;
  else if (metric === 'view') viewsCount += 1;

  if (reel) {
    reel.likes_count = likesCount;
    reel.shares_count = sharesCount;
    reel.downloads_count = downloadsCount;
    reel.views_count = viewsCount;
  }

  // 1. Update localStorage engagement registry
  try {
    const engagements = JSON.parse(localStorage.getItem('nature_reels_engagement') || '{}');
    engagements[contentId] = {
      likes: likesCount,
      shares: sharesCount,
      downloads: downloadsCount,
      views: viewsCount
    };
    localStorage.setItem('nature_reels_engagement', JSON.stringify(engagements));

    // 2. Also update in nature_custom_reels if present
    const custom = JSON.parse(localStorage.getItem('nature_custom_reels') || '[]');
    const target = custom.find(r => r.content_id === contentId);
    if (target) {
      target.likes_count = likesCount;
      target.shares_count = sharesCount;
      target.downloads_count = downloadsCount;
      target.views_count = viewsCount;
      localStorage.setItem('nature_custom_reels', JSON.stringify(custom));
    }
  } catch (e) {
    console.warn('Error persisting engagement:', e);
  }

  // Broadcast cross-tab
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    const channel = new BroadcastChannel('nature_moments_sync');
    channel.postMessage({
      type: 'ENGAGEMENT_TRACKED',
      content_id: contentId,
      metric,
      likes_count: likesCount,
      shares_count: sharesCount,
      downloads_count: downloadsCount
    });
  }

  window.dispatchEvent(new CustomEvent('reelEngagementUpdated', {
    detail: { content_id: contentId, metric, likes_count: likesCount, shares_count: sharesCount, downloads_count: downloadsCount }
  }));

  syncToCloudApi('track', { content_id: contentId, metric });

  return {
    content_id: contentId,
    metric,
    likes_count: likesCount,
    shares_count: sharesCount,
    downloads_count: downloadsCount
  };
}

export function addCustomReel(reel) {
  try {
    const custom = JSON.parse(localStorage.getItem('nature_custom_reels') || '[]');
    const filtered = custom.filter(r => r.content_id !== reel.content_id);
    filtered.unshift(reel);
    localStorage.setItem('nature_custom_reels', JSON.stringify(filtered));
    loadAllReels();

    // Broadcast to app
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('nature_moments_sync');
      channel.postMessage({ type: 'ADD_REEL', reel });
    }
    window.dispatchEvent(new CustomEvent('reelsUpdated', { detail: REELS_DATA }));
    syncToCloudApi('add', { reel });
    return true;
  } catch (e) {
    console.error('Error adding custom reel:', e);
    return false;
  }
}

export function addCustomReelsBatch(reelsList) {
  try {
    if (!Array.isArray(reelsList) || reelsList.length === 0) return false;
    const custom = JSON.parse(localStorage.getItem('nature_custom_reels') || '[]');
    const newIds = new Set(reelsList.map(r => r.content_id));
    const filtered = custom.filter(r => !newIds.has(r.content_id));
    const merged = [...reelsList, ...filtered];
    localStorage.setItem('nature_custom_reels', JSON.stringify(merged));
    loadAllReels();

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('nature_moments_sync');
      channel.postMessage({ type: 'ADD_REELS_BATCH', count: reelsList.length });
    }
    window.dispatchEvent(new CustomEvent('reelsUpdated', { detail: REELS_DATA }));
    syncToCloudApi('batch_add', { reels: reelsList });
    return true;
  } catch (e) {
    console.error('Error batch adding custom reels:', e);
    return false;
  }
}

export function deleteCustomReel(contentId) {
  try {
    const custom = JSON.parse(localStorage.getItem('nature_custom_reels') || '[]');
    const filtered = custom.filter(r => r.content_id !== contentId);
    localStorage.setItem('nature_custom_reels', JSON.stringify(filtered));
    
    // Also remove from local list if in base
    REELS_DATA = REELS_DATA.filter(r => r.content_id !== contentId);

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('nature_moments_sync');
      channel.postMessage({ type: 'DELETE_REEL', content_id: contentId });
    }
    window.dispatchEvent(new CustomEvent('reelsUpdated', { detail: REELS_DATA }));
    syncToCloudApi('delete', { id: contentId });
    return true;
  } catch (e) {
    console.error('Error deleting custom reel:', e);
    return false;
  }
}

export function deleteCustomReelsBatch(idList) {
  try {
    if (!Array.isArray(idList) || idList.length === 0) return false;
    const idSet = new Set(idList);
    const custom = JSON.parse(localStorage.getItem('nature_custom_reels') || '[]');
    const filtered = custom.filter(r => !idSet.has(r.content_id));
    localStorage.setItem('nature_custom_reels', JSON.stringify(filtered));
    REELS_DATA = REELS_DATA.filter(r => !idSet.has(r.content_id));

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('nature_moments_sync');
      channel.postMessage({ type: 'DELETE_REELS_BATCH', ids: idList });
    }
    window.dispatchEvent(new CustomEvent('reelsUpdated', { detail: REELS_DATA }));
    syncToCloudApi('batch_delete', { ids: idList });
    return true;
  } catch (e) {
    console.error('Error batch deleting custom reels:', e);
    return false;
  }
}

export function wipeAllReels() {
  try {
    localStorage.removeItem('nature_custom_reels');
    REELS_DATA = [];

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('nature_moments_sync');
      channel.postMessage({ type: 'WIPE_ALL_REELS' });
    }
    window.dispatchEvent(new CustomEvent('reelsUpdated', { detail: REELS_DATA }));
    syncToCloudApi('wipe', {});
    return true;
  } catch (e) {
    console.error('Error wiping reels:', e);
    return false;
  }
}
