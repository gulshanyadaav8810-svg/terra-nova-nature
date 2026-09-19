/* ==========================================================
   NATURE MOMENTS — AUTHENTIC REELS SERVICE & DATASET
   Curated 9:16 vertical nature reels with real-time sync,
   remote fetching from GitHub, and live BroadcastChannel updates.
   ========================================================== */

export const INITIAL_REELS = [
  {
    "content_id": "reel-forest-01",
    "title": "Sunlit Emerald Pine Forest & Mountain Stream",
    "description": "Crisp morning mist drifting through ancient pines with the soothing sound of alpine crystal waters.",
    "category_id": "forest",
    "thumbnail_url": "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
    "video_url": "assets/videos/nature_stream.mp4",
    "duration": "0:24",
    "is_downloadable": true,
    "is_trending": true,
    "created_at": "2026-09-20T00:10:00.000Z"
  },
  {
    "content_id": "reel-flowers-01",
    "title": "Spring Wildflowers Blooming in Alpine Meadows",
    "description": "Vibrant blossoms awakening under warm gentle sunshine with soothing ambient breeze.",
    "category_id": "flowers",
    "thumbnail_url": "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80",
    "video_url": "assets/videos/flower.mp4",
    "duration": "0:19",
    "is_downloadable": true,
    "is_trending": true,
    "created_at": "2026-09-20T00:09:00.000Z"
  },
  {
    "content_id": "reel-waterfall-01",
    "title": "Cascading Emerald Falls Deep in Moss Canyon",
    "description": "Breathtaking waterfall dropping into a tranquil turquoise pool surrounded by dense rainforest.",
    "category_id": "waterfall",
    "thumbnail_url": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80",
    "video_url": "assets/videos/nature_stream.mp4",
    "duration": "0:28",
    "is_downloadable": true,
    "is_trending": true,
    "created_at": "2026-09-20T00:08:00.000Z"
  },
  {
    "content_id": "reel-mountain-01",
    "title": "Snow-Capped Alpine Ridges at First Light",
    "description": "Majestic jagged peaks catching the first fiery rays of dawn above sea of clouds.",
    "category_id": "mountain",
    "thumbnail_url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    "video_url": "assets/videos/nature_stream.mp4",
    "duration": "0:22",
    "is_downloadable": true,
    "is_trending": true,
    "created_at": "2026-09-20T00:07:00.000Z"
  },
  {
    "content_id": "reel-rain-01",
    "title": "Gentle Woodland Raindrops on Forest Canopy",
    "description": "Rhythmic, calming rain falling upon lush green fern leaves with natural atmospheric sound.",
    "category_id": "rain",
    "thumbnail_url": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "video_url": "assets/videos/nature_stream.mp4",
    "duration": "0:30",
    "is_downloadable": true,
    "is_trending": false,
    "created_at": "2026-09-20T00:06:00.000Z"
  },
  {
    "content_id": "reel-ocean-01",
    "title": "Turquoise Coastal Swells & Peaceful Shore",
    "description": "Rhythmic ocean breakers rolling across secluded sands under clear azure skies.",
    "category_id": "ocean",
    "thumbnail_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    "video_url": "assets/videos/nature_stream.mp4",
    "duration": "0:25",
    "is_downloadable": true,
    "is_trending": true,
    "created_at": "2026-09-20T00:05:00.000Z"
  },
  {
    "content_id": "reel-sunset-01",
    "title": "Golden Sunset Horizon Over Mountain Silhouette",
    "description": "Warm gradient of amber, rose, and violet painting the sky as twilight settles.",
    "category_id": "sunset",
    "thumbnail_url": "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=600&q=80",
    "video_url": "assets/videos/nature_stream.mp4",
    "duration": "0:26",
    "is_downloadable": true,
    "is_trending": true,
    "created_at": "2026-09-20T00:04:00.000Z"
  },
  {
    "content_id": "reel-sunrise-01",
    "title": "Morning Mist Rising From Golden Lake Dawn",
    "description": "Sunbeams illuminating low-hanging fog over still mountain lake reflections.",
    "category_id": "sunrise",
    "thumbnail_url": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
    "video_url": "assets/videos/flower.mp4",
    "duration": "0:21",
    "is_downloadable": true,
    "is_trending": false,
    "created_at": "2026-09-20T00:03:00.000Z"
  },
  {
    "content_id": "reel-wildlife-01",
    "title": "Wild Deer Grazing in Sunlit Mountain Meadow",
    "description": "A tranquil peaceful encounter with majestic deer in high alpine pastures.",
    "category_id": "wildlife",
    "thumbnail_url": "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80",
    "video_url": "assets/videos/nature_stream.mp4",
    "duration": "0:20",
    "is_downloadable": true,
    "is_trending": true,
    "created_at": "2026-09-20T00:02:00.000Z"
  },
  {
    "content_id": "reel-river-01",
    "title": "Crystal Brook Flowing Across Polished Stones",
    "description": "Pure glacial runoff babbling gently through ancient mossy riverbed stones.",
    "category_id": "river",
    "thumbnail_url": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80",
    "video_url": "assets/videos/nature_stream.mp4",
    "duration": "0:27",
    "is_downloadable": true,
    "is_trending": false,
    "created_at": "2026-09-20T00:01:00.000Z"
  },
  {
    "content_id": "reel-beach-01",
    "title": "Secluded White Sand Cove with Gentle Waters",
    "description": "Pristine tropical paradise with soft waves lapping upon powdered white sand.",
    "category_id": "beach",
    "thumbnail_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    "video_url": "assets/videos/nature_stream.mp4",
    "duration": "0:23",
    "is_downloadable": true,
    "is_trending": false,
    "created_at": "2026-09-19T23:55:00.000Z"
  },
  {
    "content_id": "reel-clouds-01",
    "title": "Dreamy Cloud Sea Inversion Above Valleys",
    "description": "Ethereal sea of rolling clouds floating beneath high peak viewpoints.",
    "category_id": "clouds",
    "thumbnail_url": "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=600&q=80",
    "video_url": "assets/videos/nature_stream.mp4",
    "duration": "0:30",
    "is_downloadable": true,
    "is_trending": true,
    "created_at": "2026-09-19T23:50:00.000Z"
  },
  {
    "content_id": "reel-snow-01",
    "title": "Silent Winter Snowfall in Evergreen Pines",
    "description": "Quiet snow flakes drifting softly between snow-laden fir boughs.",
    "category_id": "snow",
    "thumbnail_url": "https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=600&q=80",
    "video_url": "assets/videos/nature_stream.mp4",
    "duration": "0:25",
    "is_downloadable": true,
    "is_trending": false,
    "created_at": "2026-09-19T23:45:00.000Z"
  },
  {
    "content_id": "reel-greenery-01",
    "title": "Endless Rolling Green Meadows in Summer Breeze",
    "description": "Vibrant emerald grass rippling like ocean waves across highland slopes.",
    "category_id": "greenery",
    "thumbnail_url": "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80",
    "video_url": "assets/videos/flower.mp4",
    "duration": "0:22",
    "is_downloadable": true,
    "is_trending": true,
    "created_at": "2026-09-19T23:40:00.000Z"
  },
  {
    "content_id": "reel-lake-01",
    "title": "Mirror Lake Reflecting Pine Ridges & Sky",
    "description": "Glass-calm surface mirroring tall pine groves in pristine mountain sanctuary.",
    "category_id": "lake",
    "thumbnail_url": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80",
    "video_url": "assets/videos/nature_stream.mp4",
    "duration": "0:28",
    "is_downloadable": true,
    "is_trending": false,
    "created_at": "2026-09-19T23:35:00.000Z"
  },
  {
    "content_id": "reel-jungle-01",
    "title": "Lush Tropical Canopy & Morning Sunlight",
    "description": "Deep tropical rainforest alive with warm light beams and exotic greenery.",
    "category_id": "jungle",
    "thumbnail_url": "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=600&q=80",
    "video_url": "assets/videos/flower.mp4",
    "duration": "0:24",
    "is_downloadable": true,
    "is_trending": false,
    "created_at": "2026-09-19T23:30:00.000Z"
  },
  {
    "content_id": "reel-night-01",
    "title": "Billion Stars & Milky Way Over Mountain Peak",
    "description": "Clear midnight sky showing the luminous core of the Milky Way galaxy.",
    "category_id": "night-sky",
    "thumbnail_url": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80",
    "video_url": "assets/videos/nature_stream.mp4",
    "duration": "0:30",
    "is_downloadable": true,
    "is_trending": true,
    "created_at": "2026-09-19T23:25:00.000Z"
  },
  {
    "content_id": "reel-birds-01",
    "title": "Morning Songbirds in Dew-Drenched Woods",
    "description": "Gentle avian melodies echoing through the misty dawn trees.",
    "category_id": "birds",
    "thumbnail_url": "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=600&q=80",
    "video_url": "assets/videos/nature_stream.mp4",
    "duration": "0:18",
    "is_downloadable": true,
    "is_trending": false,
    "created_at": "2026-09-19T23:20:00.000Z"
  },
  {
    "content_id": "reel-nature-01",
    "title": "Pure Wilderness Serenity & Gentle Wind",
    "description": "Untouched wild nature in complete tranquility and harmony.",
    "category_id": "nature",
    "thumbnail_url": "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=600&q=80",
    "video_url": "assets/videos/flower.mp4",
    "duration": "0:25",
    "is_downloadable": true,
    "is_trending": true,
    "created_at": "2026-09-19T23:15:00.000Z"
  }
];

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

  // 3. Return sorted array (newest / custom on top)
  const all = Array.from(mergedMap.values());
  all.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  REELS_DATA = all;
  return REELS_DATA;
}

// Initial load
loadAllReels();

// Remote fetch function to sync from GitHub Pages / JSON
export async function syncRemoteReels() {
  const urls = [
    'data/reels.json?t=' + Date.now(),
    'https://raw.githubusercontent.com/gulshanyadaav8810-svg/terra-nova-nature/main/data/reels.json?t=' + Date.now()
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const remoteReels = await res.json();
        if (Array.isArray(remoteReels) && remoteReels.length > 0) {
          const merged = new Map();
          INITIAL_REELS.forEach(r => merged.set(r.content_id, r));
          remoteReels.forEach(r => merged.set(r.content_id, r));
          
          // Also persist any local customs
          const custom = localStorage.getItem('nature_custom_reels');
          if (custom) {
            const parsed = JSON.parse(custom);
            parsed.forEach(r => merged.set(r.content_id, r));
          }

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

// Automatically sync when online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => syncRemoteReels());
  setTimeout(() => syncRemoteReels(), 1500);

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
    return true;
  } catch (e) {
    console.error('Error adding custom reel:', e);
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
    return true;
  } catch (e) {
    console.error('Error deleting custom reel:', e);
    return false;
  }
}
