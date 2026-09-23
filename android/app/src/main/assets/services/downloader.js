/* ==========================================================
   NATURE MOMENTS — REAL CHUNKED DOWNLOAD SERVICE
   Streams media bytes, calculates real %, supports cancellation,
   stores into IndexedDB, and triggers device file download
   ========================================================== */

import { offlineDb } from './offline-db.js';

class DownloaderService {
  constructor() {
    this.activeDownloads = new Map(); // contentId -> { controller, reel }
  }

  // Check if reel is downloadable
  canDownload(reel) {
    return !!(reel && reel.is_downloadable && reel.video_url);
  }

  // Start real download with progress tracking and abort capability
  async downloadReel(reel, onProgress, onComplete, onError) {
    if (!this.canDownload(reel)) {
      const err = new Error('This video is not marked for download.');
      if (onError) onError(err);
      throw err;
    }

    // Check duplicate download
    const alreadySaved = await offlineDb.isDownloaded(reel.content_id);
    if (alreadySaved) {
      console.log('Video already downloaded, refreshing copy:', reel.content_id);
    }

    // Check if already in progress
    if (this.activeDownloads.has(reel.content_id)) {
      console.warn('Download already in progress for:', reel.content_id);
      return;
    }

    const controller = new AbortController();
    this.activeDownloads.set(reel.content_id, { controller, reel });

    try {
      // Call Android Native Bridge if available
      if (window.AndroidBridge && typeof window.AndroidBridge.downloadVideo === 'function') {
        try {
          window.AndroidBridge.downloadVideo(reel.video_url, reel.title + '.mp4');
        } catch (bridgeErr) {
          console.warn('AndroidBridge call failed, falling back to web download', bridgeErr);
        }
      }

      // Real fetch streaming with fallback for CORS-restricted CDNs
      let response;
      try {
        response = await fetch(reel.video_url, {
          signal: controller.signal,
          headers: { 'Accept': 'video/*,*/*' }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
      } catch (fetchErr) {
        if (fetchErr.name === 'AbortError') throw fetchErr;
        throw new Error('Download failed: unable to fetch video stream from remote server.');
      }

      if (!response.ok) {
        throw new Error(`Download failed with server status ${response.status} ${response.statusText}`);
      }

      const contentLength = response.headers.get('content-length');
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
          const percent = Math.min(100, Math.round((receivedBytes / totalBytes) * 100));
          if (onProgress) onProgress(percent, receivedBytes, totalBytes);
        } else {
          // Synthetic steady progress if Content-Length is chunked/missing
          const estimatedPercent = Math.min(95, Math.round((receivedBytes / (2 * 1024 * 1024)) * 100));
          if (onProgress) onProgress(estimatedPercent, receivedBytes, 0);
        }
      }

      // Combine chunks into single Blob
      const mimeType = response.headers.get('content-type') || 'video/mp4';
      const blob = new Blob(chunks, { type: mimeType });

      // Verify blob is valid
      if (blob.size < 1000) {
        throw new Error('Downloaded media file appears incomplete or corrupted.');
      }

      // Save to IndexedDB for offline in-app playback
      const savedRecord = await offlineDb.saveDownloadedReel(reel, blob);

      // Trigger standard browser download for device file system
      try {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = (reel.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'nature_reel') + '.mp4';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(a.href);
        }, 1000);
      } catch (dlErr) {
        console.warn('Direct file trigger error', dlErr);
      }

      this.activeDownloads.delete(reel.content_id);

      if (onProgress) onProgress(100, receivedBytes, totalBytes || receivedBytes);
      if (onComplete) onComplete(savedRecord);
      return savedRecord;

    } catch (error) {
      this.activeDownloads.delete(reel.content_id);
      if (error.name === 'AbortError') {
        console.log('Download canceled by user:', reel.content_id);
        const cancelErr = new Error('Download canceled.');
        cancelErr.isCanceled = true;
        if (onError) onError(cancelErr);
        throw cancelErr;
      }
      console.error('Error downloading video:', error);
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
}

export const downloader = new DownloaderService();
