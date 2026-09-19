/* ==========================================================
   NATURE MOMENTS — AUTHENTIC REELS SERVICE & DATASET
   Curated 9:16 vertical nature reels with real-time sync,
   remote fetching from GitHub, and live BroadcastChannel updates.
   Zero demo reels: strictly loads real user uploads from Admin Studio.
   ========================================================== */

export const INITIAL_REELS = [];

export let REELS_DATA = [];

const APP_STORAGE_VERSION = 'v6_github_autosync';

const DEMO_REEL_IDS = new Set([
  'reel-forest-01',
  'reel-flowers-01',
  'reel-waterfall-01',
  'reel-ocean-01',
  'reel-forest-0262u',
  'reel-mountains-z3ycr',
  'reel-ocean-1t68t',
  'reel-rain-ydez8',
  'reel-forest-z3ycr',
  'reel-forest-1t68t',
  'reel-forest-ydez8',
  'reel-user-nature-1'
]);

export function normalizeVideoUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.startsWith('blob:') || url.startsWith('data:')) return url;

  let filename = '';
  if (url.startsWith('/uploads/')) {
    filename = url.replace(/^\/uploads\//, '');
  } else if (url.includes('raw.githubusercontent.com/gulshanyadaav8810-svg/terra-nova-nature/main/uploads/')) {
    filename = url.split('/uploads/')[1];
  } else if (url.includes('cdn.jsdelivr.net/gh/gulshanyadaav8810-svg/terra-nova-nature@main/uploads/')) {
    filename = url.split('/uploads/')[1];
  }

  if (filename) {
    return `https://cdn.jsdelivr.net/gh/gulshanyadaav8810-svg/terra-nova-nature@main/uploads/${filename}`;
  }
  return url;
}

export function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.startsWith('blob:') || url.startsWith('data:')) return url;

  let filename = '';
  if (url.startsWith('/uploads/')) {
    filename = url.replace(/^\/uploads\//, '');
  } else if (url.includes('raw.githubusercontent.com/gulshanyadaav8810-svg/terra-nova-nature/main/uploads/')) {
    filename = url.split('/uploads/')[1];
  } else if (url.includes('cdn.jsdelivr.net/gh/gulshanyadaav8810-svg/terra-nova-nature@main/uploads/')) {
    filename = url.split('/uploads/')[1];
  }

  if (filename) {
    return `https://cdn.jsdelivr.net/gh/gulshanyadaav8810-svg/terra-nova-nature@main/uploads/${filename}`;
  }
  return url;
}

export function isDemoReel(r) {
  if (!r || !r.content_id) return true;
  if (DEMO_REEL_IDS.has(r.content_id)) return true;
  const url = (r.video_url || '').toLowerCase();
  if (url.includes('nature_stream.mp4') || url.includes('flower.mp4')) return true;
  const title = (r.title || '').toLowerCase();
  if (title.includes('spring wildflowers') || title.includes('alpine meadows')) return true;
  return false;
}

export function getRawFallbackUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('cdn.jsdelivr.net/gh/gulshanyadaav8810-svg/terra-nova-nature@main/uploads/')) {
    return url.replace('cdn.jsdelivr.net/gh/gulshanyadaav8810-svg/terra-nova-nature@main/uploads/', 'raw.githubusercontent.com/gulshanyadaav8810-svg/terra-nova-nature/main/uploads/');
  }
  if (url.includes('raw.githubusercontent.com/gulshanyadaav8810-svg/terra-nova-nature/main/uploads/')) {
    return url.replace('raw.githubusercontent.com/gulshanyadaav8810-svg/terra-nova-nature/main/uploads/', 'cdn.jsdelivr.net/gh/gulshanyadaav8810-svg/terra-nova-nature@main/uploads/');
  }
  return url;
}

// Storage version check: purge any legacy cached demo reels on new app version
if (typeof window !== 'undefined') {
  try {
    const currentVer = localStorage.getItem('nature_storage_version');
    if (currentVer !== APP_STORAGE_VERSION) {
      localStorage.removeItem('nature_remote_reels');
      localStorage.removeItem('nature_custom_reels');
      localStorage.removeItem('nature_deleted_reels');
      localStorage.setItem('nature_storage_version', APP_STORAGE_VERSION);
    }
  } catch (e) {}
}

// Compute comprehensive content fingerprint to detect any thumbnail, video, or title edit
export function getReelsFingerprint(list) {
  if (!Array.isArray(list) || list.length === 0) return '';
  return list.map(r => `${r.content_id}#${r.thumbnail_url}#${r.video_url}#${r.title}#${r.category_id}#${r.is_trending ? 1 : 0}`).join('|');
}

// Dynamic merge function: Remote dataset is authoritative
export function loadAllReels() {
  const mergedMap = new Map();

  // 1. Get tombstone deleted IDs (including all demo reel IDs)
  let deletedIds = new Set(DEMO_REEL_IDS);
  try {
    const rawDeleted = localStorage.getItem('nature_deleted_reels');
    if (rawDeleted) {
      const parsed = JSON.parse(rawDeleted);
      if (Array.isArray(parsed)) {
        parsed.forEach(id => deletedIds.add(id));
      }
    }
  } catch (e) {}

  // 2. Add remote reels cached from Cloud/GitHub sync (Authoritative Source)
  try {
    const remote = localStorage.getItem('nature_remote_reels');
    if (remote) {
      const parsed = JSON.parse(remote);
      if (Array.isArray(parsed)) {
        const sanitizedRemote = parsed.filter(r => !isDemoReel(r) && !deletedIds.has(r.content_id));
        if (sanitizedRemote.length !== parsed.length) {
          localStorage.setItem('nature_remote_reels', JSON.stringify(sanitizedRemote));
        }
        sanitizedRemote.forEach(r => {
          if (r.video_url && !r.video_url.startsWith('blob:')) {
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
    console.warn('Error reading nature_remote_reels from localStorage:', e);
  }

  // 3. Add local custom reels ONLY if not already present or if created locally
  try {
    const custom = localStorage.getItem('nature_custom_reels');
    if (custom) {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed)) {
        // Prune deleted reels from custom reels
        const sanitizedCustom = parsed.filter(r => !isDemoReel(r) && !deletedIds.has(r.content_id));
        sanitizedCustom.forEach(r => {
          if (r.video_url && !r.video_url.startsWith('blob:')) {
            // Only add if not already present in remote, so remote thumbnail/edits are preserved!
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
    console.warn('Error reading custom reels from localStorage:', e);
  }

  // 4. Apply persistent engagement overrides (likes, shares, downloads, views)
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

  // 5. Return sorted array (newest on top)
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

  // Load deleted IDs tombstone including demo reels
  let deletedIds = new Set(DEMO_REEL_IDS);
  try {
    const rawDeleted = localStorage.getItem('nature_deleted_reels');
    if (rawDeleted) {
      const parsed = JSON.parse(rawDeleted);
      if (Array.isArray(parsed)) {
        parsed.forEach(id => deletedIds.add(id));
      }
    }
  } catch (e) {}

  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const remoteReels = await res.json();
        if (Array.isArray(remoteReels)) {
          // Filter out demo reels and deleted tombstones
          const cleanRemote = remoteReels.filter(r => !isDemoReel(r) && !deletedIds.has(r.content_id));

          // Persist raw remote dataset to localStorage as authoritative source
          try {
            localStorage.setItem('nature_remote_reels', JSON.stringify(cleanRemote));
          } catch (e) {}

          const remoteIdSet = new Set(cleanRemote.map(r => r.content_id));

          // Clean stale entries from nature_custom_reels so deleted reels never resurrect!
          try {
            const custom = localStorage.getItem('nature_custom_reels');
            if (custom) {
              const parsed = JSON.parse(custom);
              if (Array.isArray(parsed)) {
                // Keep only items that are either in cleanRemote or created locally in the last 60s
                const cleanedCustom = parsed.filter(r => {
                  if (deletedIds.has(r.content_id) || isDemoReel(r)) return false;
                  if (remoteIdSet.has(r.content_id)) return true;
                  const age = Date.now() - new Date(r.created_at || 0).getTime();
                  return age < 60000; // Keep pending local uploads under 60 seconds
                });
                localStorage.setItem('nature_custom_reels', JSON.stringify(cleanedCustom));
              }
            }
          } catch (e) {}

          const merged = new Map();

          // 1. Add valid remote reels first (AUTHORITATIVE: contains newest thumbnails and titles)
          cleanRemote.forEach(r => {
            if (r.video_url && !r.video_url.startsWith('blob:')) {
              merged.set(r.content_id, {
                ...r,
                video_url: normalizeVideoUrl(r.video_url),
                thumbnail_url: normalizeImageUrl(r.thumbnail_url)
              });
            }
          });

          // 2. Add local customs ONLY if they are brand new and pending remote sync
          try {
            const custom = localStorage.getItem('nature_custom_reels');
            if (custom) {
              const parsed = JSON.parse(custom);
              if (Array.isArray(parsed)) {
                parsed.forEach(r => {
                  if (r && !isDemoReel(r) && !deletedIds.has(r.content_id)) {
                    if (r.video_url && !r.video_url.startsWith('blob:')) {
                      // Do NOT overwrite if remote already has it (remote has updated cloud URLs/thumbnails!)
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
          } catch (e) {}

          // 3. Apply local engagement overrides
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

          const oldFingerprint = getReelsFingerprint(REELS_DATA);
          const newFingerprint = getReelsFingerprint(all);
          const hasChanged = oldFingerprint !== newFingerprint || REELS_DATA.length === 0;

          REELS_DATA = all;
          if (hasChanged) {
            console.log('[ReelsSync] Content updated! Firing reelsUpdated event');
            window.dispatchEvent(new CustomEvent('reelsUpdated', { detail: REELS_DATA }));
          }
          return REELS_DATA;
        }
      }
    } catch (err) {
      // Continue to next fallback
    }
  }
  return REELS_DATA;
}

// Automatically sync when online, on window focus, touch, and periodic live polling
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => syncRemoteReels());
  window.addEventListener('focus', () => syncRemoteReels());
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) syncRemoteReels();
  });

  // Fast touch sync for 1-second responsiveness
  let lastTouchSync = 0;
  window.addEventListener('touchstart', () => {
    const now = Date.now();
    if (now - lastTouchSync > 3000) {
      lastTouchSync = now;
      syncRemoteReels();
    }
  }, { passive: true });

  // Initial sync & steady 10s background sync
  syncRemoteReels();
  setInterval(() => syncRemoteReels(), 10000);

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
      } else if (type === 'ADD_REELS_BATCH' || type === 'DELETE_REELS_BATCH' || type === 'WIPE_ALL_REELS' || type === 'UPDATE_REEL') {
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

// Strict category filtering: NEVER leaks all reels if category is empty
export function getReelsByCategory(categoryId) {
  loadAllReels();
  if (!categoryId || categoryId === 'all') {
    return REELS_DATA;
  }
  if (categoryId === 'trending') {
    return REELS_DATA.filter(r => r.is_trending === true || r.category_id === 'trending');
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
    // 1. Remove from tombstone deleted IDs if re-added
    try {
      const rawDeleted = localStorage.getItem('nature_deleted_reels');
      if (rawDeleted) {
        const deletedSet = new Set(JSON.parse(rawDeleted));
        deletedSet.delete(reel.content_id);
        localStorage.setItem('nature_deleted_reels', JSON.stringify(Array.from(deletedSet)));
      }
    } catch (e) {}

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

export function updateCustomReel(reel) {
  try {
    if (!reel || !reel.content_id) return false;

    // 1. Update in nature_custom_reels
    const custom = JSON.parse(localStorage.getItem('nature_custom_reels') || '[]');
    const idx = custom.findIndex(r => r.content_id === reel.content_id);
    if (idx !== -1) {
      custom[idx] = { ...custom[idx], ...reel };
    } else {
      custom.unshift(reel);
    }
    localStorage.setItem('nature_custom_reels', JSON.stringify(custom));

    // 2. Update in nature_remote_reels
    const remote = JSON.parse(localStorage.getItem('nature_remote_reels') || '[]');
    const rIdx = remote.findIndex(r => r.content_id === reel.content_id);
    if (rIdx !== -1) {
      remote[rIdx] = { ...remote[rIdx], ...reel };
      localStorage.setItem('nature_remote_reels', JSON.stringify(remote));
    }

    // 3. Update in-memory REELS_DATA
    const dIdx = REELS_DATA.findIndex(r => r.content_id === reel.content_id);
    if (dIdx !== -1) {
      REELS_DATA[dIdx] = { ...REELS_DATA[dIdx], ...reel };
    } else {
      REELS_DATA.unshift(reel);
    }

    // 4. Broadcast
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('nature_moments_sync');
      channel.postMessage({ type: 'UPDATE_REEL', reel });
    }
    window.dispatchEvent(new CustomEvent('reelsUpdated', { detail: REELS_DATA }));
    syncToCloudApi('update', { reel });
    return true;
  } catch (e) {
    console.error('Error updating custom reel:', e);
    return false;
  }
}

export function addCustomReelsBatch(reelsList) {
  try {
    if (!Array.isArray(reelsList) || reelsList.length === 0) return false;

    // Remove from tombstone deleted IDs
    try {
      const rawDeleted = localStorage.getItem('nature_deleted_reels');
      if (rawDeleted) {
        const deletedSet = new Set(JSON.parse(rawDeleted));
        reelsList.forEach(r => deletedSet.delete(r.content_id));
        localStorage.setItem('nature_deleted_reels', JSON.stringify(Array.from(deletedSet)));
      }
    } catch (e) {}

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
    // 1. Add to tombstone deleted IDs
    try {
      const rawDeleted = localStorage.getItem('nature_deleted_reels');
      const deletedSet = rawDeleted ? new Set(JSON.parse(rawDeleted)) : new Set();
      deletedSet.add(contentId);
      localStorage.setItem('nature_deleted_reels', JSON.stringify(Array.from(deletedSet)));
    } catch (e) {}

    // 2. Remove from custom reels
    const custom = JSON.parse(localStorage.getItem('nature_custom_reels') || '[]');
    const filtered = custom.filter(r => r.content_id !== contentId);
    localStorage.setItem('nature_custom_reels', JSON.stringify(filtered));
    
    // 3. Remove from cached remote reels
    const remote = JSON.parse(localStorage.getItem('nature_remote_reels') || '[]');
    const filteredRemote = remote.filter(r => r.content_id !== contentId);
    localStorage.setItem('nature_remote_reels', JSON.stringify(filteredRemote));

    // 4. Remove from in-memory list
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

    // 1. Add to tombstone deleted IDs
    try {
      const rawDeleted = localStorage.getItem('nature_deleted_reels');
      const deletedSet = rawDeleted ? new Set(JSON.parse(rawDeleted)) : new Set();
      idList.forEach(id => deletedSet.add(id));
      localStorage.setItem('nature_deleted_reels', JSON.stringify(Array.from(deletedSet)));
    } catch (e) {}

    // 2. Remove from custom reels
    const custom = JSON.parse(localStorage.getItem('nature_custom_reels') || '[]');
    const filtered = custom.filter(r => !idSet.has(r.content_id));
    localStorage.setItem('nature_custom_reels', JSON.stringify(filtered));

    // 3. Remove from cached remote reels
    const remote = JSON.parse(localStorage.getItem('nature_remote_reels') || '[]');
    const filteredRemote = remote.filter(r => !idSet.has(r.content_id));
    localStorage.setItem('nature_remote_reels', JSON.stringify(filteredRemote));

    // 4. Remove from in-memory list
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
    try {
      const deletedSet = new Set(REELS_DATA.map(r => r.content_id));
      DEMO_REEL_IDS.forEach(id => deletedSet.add(id));
      localStorage.setItem('nature_deleted_reels', JSON.stringify(Array.from(deletedSet)));
    } catch (e) {}

    localStorage.removeItem('nature_custom_reels');
    localStorage.removeItem('nature_remote_reels');
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
