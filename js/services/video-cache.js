/* ==========================================================
   NATURE MOMENTS — HIGH PERFORMANCE 0ms OFFLINE VIDEO CACHE
   Native Cache Storage & Blob ObjectURL provider for 100%
   offline playback, zero-buffering, and instant swiping.
   ========================================================== */

const CACHE_NAME = 'nature_reels_video_cache_v2';
const blobUrlRegistry = new Map();

class VideoCacheService {
  constructor() {
    this.cacheAvailable = typeof window !== 'undefined' && 'caches' in window;
    this.pendingDownloads = new Set();
  }

  // Get optimal playback URL: returns instant in-memory Blob URL if cached, or network URL
  async getPlaybackUrl(videoUrl) {
    if (!videoUrl || typeof videoUrl !== 'string') return videoUrl;
    if (videoUrl.startsWith('blob:') || videoUrl.startsWith('data:')) return videoUrl;

    // Check if in-memory registry already has an active Blob URL
    if (blobUrlRegistry.has(videoUrl)) {
      return blobUrlRegistry.get(videoUrl);
    }

    if (!this.cacheAvailable) return videoUrl;

    try {
      const cache = await caches.open(CACHE_NAME);
      const match = await cache.match(videoUrl);
      if (match) {
        const blob = await match.blob();
        if (blob && blob.size > 0) {
          const blobUrl = URL.createObjectURL(blob);
          blobUrlRegistry.set(videoUrl, blobUrl);
          return blobUrl;
        }
      }
    } catch (e) {
      // Cache lookup failed, continue with network
    }

    // Trigger background cache fetch for future offline / instant replay
    this.precacheVideo(videoUrl);
    return videoUrl;
  }

  // Save a video File or Blob directly into cache (used immediately on upload)
  async saveVideoBlob(urlKey, blob) {
    if (!urlKey || !blob) return '';
    try {
      const blobUrl = URL.createObjectURL(blob);
      blobUrlRegistry.set(urlKey, blobUrl);

      if (this.cacheAvailable) {
        const cache = await caches.open(CACHE_NAME);
        const headers = new Headers({
          'Content-Type': blob.type || 'video/mp4',
          'Content-Length': String(blob.size),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000, immutable'
        });
        const response = new Response(blob, { headers });
        await cache.put(urlKey, response);
      }
      return blobUrl;
    } catch (e) {
      console.warn('[VideoCache] saveVideoBlob error:', e);
      return '';
    }
  }

  // Pre-cache video in background without blocking main thread
  async precacheVideo(videoUrl) {
    if (!videoUrl || typeof videoUrl !== 'string') return;
    if (videoUrl.startsWith('blob:') || videoUrl.startsWith('data:')) return;
    if (this.pendingDownloads.has(videoUrl) || blobUrlRegistry.has(videoUrl)) return;

    if (!this.cacheAvailable) return;

    this.pendingDownloads.add(videoUrl);

    try {
      const cache = await caches.open(CACHE_NAME);
      const exists = await cache.match(videoUrl);
      if (exists) {
        this.pendingDownloads.delete(videoUrl);
        return;
      }

      // Fetch with range or full body
      const res = await fetch(videoUrl, {
        headers: { 'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8' }
      });

      if (res.ok || res.status === 206) {
        const clone = res.clone();
        await cache.put(videoUrl, clone);
        const blob = await res.blob();
        if (blob && blob.size > 0) {
          const blobUrl = URL.createObjectURL(blob);
          blobUrlRegistry.set(videoUrl, blobUrl);
        }
      }
    } catch (e) {
      // Ignore network aborts
    } finally {
      this.pendingDownloads.delete(videoUrl);
    }
  }

  // Preload a batch of upcoming video URLs
  precacheBatch(urls) {
    if (!Array.isArray(urls)) return;
    urls.slice(0, 4).forEach(u => this.precacheVideo(u));
  }
}

export const videoCache = new VideoCacheService();
