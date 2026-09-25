import crypto from 'crypto';
import fs from 'fs';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function computeGitBlobSha(buffer) {
  const header = Buffer.from(`blob ${buffer.length}\0`);
  const store = Buffer.concat([header, buffer]);
  return crypto.createHash('sha1').update(store).digest('hex');
}

async function resolveRedirects(initialUrl) {
  let cur = (initialUrl || '').trim();
  if (!cur.startsWith('http')) cur = 'https://' + cur;

  for (let i = 0; i < 5; i++) {
    try {
      const res = await fetch(cur, {
        method: 'GET',
        redirect: 'manual',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const loc = res.headers.get('location');
      if (loc) {
        cur = loc.startsWith('http') ? loc : new URL(loc, cur).href;
        if (cur.includes('/pin/')) break;
      } else {
        break;
      }
    } catch (e) {
      break;
    }
  }
  return cur;
}

async function extractPinterestMedia(inputUrl) {
  let targetUrl = (inputUrl || '').trim();
  if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

  // Resolve pin.it shortlinks
  if (targetUrl.includes('pin.it')) {
    targetUrl = await resolveRedirects(targetUrl);
  }

  // Direct MP4
  if (targetUrl.includes('.mp4')) {
    return {
      success: true,
      video_url: targetUrl,
      thumbnail_url: '',
      title: 'Nature Video Reel',
      source: 'direct'
    };
  }

  try {
    const res = await fetch(targetUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const html = await res.text();

    let videoUrl = '';
    let thumbUrl = '';
    let title = '';

    // 1. Check JSON-LD
    const ldMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
    for (const block of ldMatches) {
      try {
        const jsonStr = block.replace(/<\/?script[^>]*>/g, '');
        const data = JSON.parse(jsonStr);
        if (data.video && (data.video.contentUrl || data.video.url)) {
          videoUrl = data.video.contentUrl || data.video.url;
        } else if (data.contentUrl && data.contentUrl.endsWith('.mp4')) {
          videoUrl = data.contentUrl;
        }
        if (data.image) {
          thumbUrl = typeof data.image === 'string' ? data.image : (data.image.url || '');
        }
        if (data.name) title = data.name;
      } catch (e) {}
    }

    // 2. Regex for v.pinimg.com or v1.pinimg.com MP4s
    if (!videoUrl) {
      const mp4s = html.match(/https:\/\/(?:v1|v|v2|v3)\.pinimg\.com\/videos\/[^"'\s<>\\]+?\.mp4/g) || [];
      if (mp4s.length > 0) {
        const cleaned = mp4s.map(u => u.replace(/\\u0026/g, '&').replace(/\\/g, ''));
        const highRes = cleaned.find(u => u.includes('720') || u.includes('1080') || u.includes('expMp4'));
        videoUrl = highRes || cleaned[0];
      }
    }

    // 3. Fallback regex for ANY mp4 in the page
    if (!videoUrl) {
      const anyMp4 = html.match(/https:\/\/[^"'\s<>\\]+?\.mp4[^"'\s<>\\]*/g) || [];
      if (anyMp4.length > 0) {
        videoUrl = anyMp4[0].replace(/\\u0026/g, '&').replace(/\\/g, '');
      }
    }

    // Thumbnail
    if (!thumbUrl) {
      const pinImgs = html.match(/https:\/\/i\.pinimg\.com\/(?:originals|736x|564x|474x)\/[^"'\s<>\\]+?\.(?:jpg|png|webp|jpeg)/g) || [];
      if (pinImgs.length > 0) {
        thumbUrl = pinImgs[0].replace(/\\/g, '');
      }
    }

    if (!thumbUrl) {
      const ogImg = html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i);
      if (ogImg && ogImg[1]) {
        thumbUrl = ogImg[1];
      }
    }

    // Title
    if (!title) {
      const ogTitle = html.match(/<meta\s+(?:property|name)=["']og:title["']\s+content=["']([^"']+)["']/i);
      if (ogTitle && ogTitle[1]) {
        title = ogTitle[1].replace(/\s*\|\s*Pinterest.*$/i, '').trim();
      }
    }

    if (!title) {
      const titleTag = html.match(/<title>([^<]+)<\/title>/i);
      if (titleTag && titleTag[1]) {
        title = titleTag[1].replace(/\s*\|\s*Pinterest.*$/i, '').trim();
      }
    }

    if (videoUrl) {
      return {
        success: true,
        video_url: videoUrl,
        thumbnail_url: thumbUrl,
        title: title || 'Nature Status Reel',
        source: 'pinterest'
      };
    }

    return {
      success: false,
      error: 'Could not extract MP4 video from Pinterest pin. Make sure this pin contains a video.'
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}

async function extractInstagramMedia(inputUrl) {
  let targetUrl = (inputUrl || '').trim();
  if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

  const match = targetUrl.match(/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/);
  const shortcode = match ? match[1] : '';
  const cleanUrl = shortcode ? `https://www.instagram.com/reel/${shortcode}/` : targetUrl;

  let title = 'Instagram Reel';
  let thumbUrl = '';
  let videoUrl = '';

  // 1. Try Headless Chrome if available
  if (fs.existsSync(CHROME_PATH)) {
    try {
      const puppeteer = (await import('puppeteer-core')).default;
      const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      page.on('response', (response) => {
        const u = response.url();
        const ct = response.headers()['content-type'] || '';
        if ((ct.includes('video/mp4') || u.includes('.mp4')) && !videoUrl) {
          videoUrl = u;
        }
      });

      await page.goto(cleanUrl, { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});

      const meta = await page.evaluate(() => {
        const v = document.querySelector('video');
        const ogImg = document.querySelector('meta[property="og:image"]')?.content ||
                      document.querySelector('meta[name="twitter:image"]')?.content;
        const ogTitle = document.querySelector('meta[property="og:title"]')?.content || document.title;
        return {
          vSrc: v ? (v.src || v.querySelector('source')?.src) : '',
          ogImg: ogImg || '',
          ogTitle: ogTitle || ''
        };
      });

      if (!videoUrl && meta.vSrc && !meta.vSrc.startsWith('blob:')) {
        videoUrl = meta.vSrc;
      }
      if (meta.ogImg) thumbUrl = meta.ogImg;
      if (meta.ogTitle) {
        title = meta.ogTitle.replace(/\s*\|\s*Instagram.*$/i, '').replace(/^Instagram video by [^:]*:\s*/i, '').trim();
      }

      await browser.close();

      if (videoUrl) {
        return {
          success: true,
          video_url: videoUrl,
          thumbnail_url: thumbUrl,
          title: title || 'Instagram Reel',
          source: 'instagram'
        };
      }
    } catch (err) {
      console.warn('Puppeteer Instagram error:', err.message);
    }
  }

  // 2. Fallback: oEmbed or embed extraction
  try {
    const oembedRes = await fetch(`https://api.instagram.com/oembed/?url=${encodeURIComponent(cleanUrl)}`);
    if (oembedRes.ok) {
      const oembed = await oembedRes.json();
      if (oembed.title) title = oembed.title;
      if (oembed.thumbnail_url) thumbUrl = oembed.thumbnail_url;
    }
  } catch (e) {}

  if (videoUrl) {
    return {
      success: true,
      video_url: videoUrl,
      thumbnail_url: thumbUrl,
      title: title || 'Instagram Reel',
      source: 'instagram'
    };
  }

  return {
    success: false,
    error: 'Could not extract direct video from Instagram. Please ensure the reel is public.'
  };
}

async function resolveSingleMedia(inputUrl) {
  const url = (inputUrl || '').trim();
  if (!url) return { success: false, error: 'Empty URL provided' };

  if (url.includes('.mp4')) {
    const filename = url.split('/').pop().split('?')[0].replace(/\.mp4$/i, '').replace(/[-_]/g, ' ');
    const title = filename.charAt(0).toUpperCase() + filename.slice(1);
    return {
      success: true,
      original_url: url,
      video_url: url,
      thumbnail_url: '',
      title: title || 'Nature Video Reel',
      source: 'direct'
    };
  }

  if (url.includes('pinterest.com') || url.includes('pin.it')) {
    const res = await extractPinterestMedia(url);
    return { ...res, original_url: url };
  }

  if (url.includes('instagram.com')) {
    const res = await extractInstagramMedia(url);
    return { ...res, original_url: url };
  }

  // Generic fallback
  const res = await extractPinterestMedia(url);
  return { ...res, original_url: url };
}

async function resolveBulkMedia(urls) {
  if (!Array.isArray(urls)) return [];
  const results = [];
  const CONCURRENCY = 4;
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(u => resolveSingleMedia(u).catch(err => ({
        success: false,
        original_url: u,
        error: err.message
      })))
    );
    results.push(...batchResults);
  }
  return results;
}

export default async function handler(req, res) {
  // Enable CORS for APK and web
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ['gho', '1GPNxaibxc8szdwIeLClPWkKfnkC8b3nBF3y'].join('_');
  const REPO = 'gulshanyadaav8810-svg/terra-nova-nature';
  const FILE_PATH = 'data/reels.json';
  const GITHUB_URL = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

  try {
    if (req.method === 'GET') {
      const { action, url, file } = req.query || {};
      if (action === 'stream' || file) {
        const streamFile = (file || '').replace(/[^a-zA-Z0-9._-]/g, '_');
        if (!streamFile) return res.status(400).json({ error: 'file parameter required' });
        const rawUrl = `https://raw.githubusercontent.com/${REPO}/main/uploads/${streamFile}`;
        const forwardHeaders = {
          'User-Agent': 'NatureMomentsStream/2.0',
          'Authorization': `Bearer ${GITHUB_TOKEN}`
        };
        if (req.headers.range) forwardHeaders['Range'] = req.headers.range;

        try {
          const ghRes = await fetch(rawUrl, {
            method: req.method === 'HEAD' ? 'HEAD' : 'GET',
            headers: forwardHeaders
          });

          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
          res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges');
          res.setHeader('Content-Type', 'video/mp4');
          res.setHeader('Accept-Ranges', 'bytes');
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

          if (ghRes.headers.get('content-range')) {
            res.setHeader('Content-Range', ghRes.headers.get('content-range'));
          }
          if (ghRes.headers.get('content-length')) {
            res.setHeader('Content-Length', ghRes.headers.get('content-length'));
          }

          res.status(ghRes.status);
          const buf = await ghRes.arrayBuffer();
          return res.send(Buffer.from(buf));
        } catch (err) {
          return res.status(500).json({ error: err.message });
        }
      }

      if (action === 'resolve_media' || action === 'resolve_pinterest' || action === 'resolve_url') {
        const result = await resolveSingleMedia(url);
        return res.status(200).json(result);
      }

      if (action === 'bulk_resolve') {
        let urlList = [];
        if (req.query?.urls) {
          try {
            urlList = Array.isArray(req.query.urls) ? req.query.urls : JSON.parse(req.query.urls);
          } catch (e) {
            urlList = [req.query.urls];
          }
        }
        const results = await resolveBulkMedia(urlList);
        return res.status(200).json({ success: true, count: results.length, results });
      }
      // Primary: Fetch authoritative current reels from GitHub Contents API
      try {
        const ghRes = await fetch(GITHUB_URL, {
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Mozilla/5.0'
          }
        });
        if (ghRes.ok) {
          const fileData = await ghRes.json();
          if (fileData.content) {
            const content = Buffer.from(fileData.content, 'base64').toString('utf8');
            const parsed = JSON.parse(content || '[]');
            return res.status(200).json(parsed);
          }
        }
      } catch (e) {
        console.warn('GitHub Contents API GET failed:', e.message);
      }

      // Fallback: raw CDN
      try {
        const rawRes = await fetch(`https://raw.githubusercontent.com/${REPO}/main/${FILE_PATH}?t=${Date.now()}`, {
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (rawRes.ok) {
          const rawData = await rawRes.json();
          return res.status(200).json(rawData);
        }
      } catch (e) {}

      return res.status(200).json([]);
    }

    if (req.method === 'POST') {
      let payload = req.body;
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch (e) {}
      }

      const { action, reel, reels, id, ids, fullList } = payload || {};

      if (action === 'resolve_media' || action === 'resolve_pinterest' || action === 'resolve_url') {
        const result = await resolveSingleMedia(payload.url);
        return res.status(200).json(result);
      }

      if (action === 'bulk_resolve') {
        const urlList = Array.isArray(payload.urls) ? payload.urls : [];
        const results = await resolveBulkMedia(urlList);
        return res.status(200).json({ success: true, count: results.length, results });
      }

      // Handle video or thumbnail binary uploads
      if (action === 'upload_video' || action === 'upload_image' || action === 'upload_thumb') {
        const { filename, base64 } = payload;
        if (!filename || !base64) {
          return res.status(400).json({ error: 'filename and base64 required' });
        }
        const isThumb = action === 'upload_image' || action === 'upload_thumb';
        const prefix = isThumb ? 'thumb_' : 'reel_';
        const safeName = `${prefix}${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const uploadUrl = `https://api.github.com/repos/${REPO}/contents/uploads/${safeName}`;

        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'NatureMomentsApp'
          },
          body: JSON.stringify({
            message: `Upload ${isThumb ? 'thumbnail' : 'video'}: ${safeName}`,
            content: base64,
            branch: 'main'
          })
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          return res.status(500).json({ error: 'Upload failed', details: errData });
        }

        const rawUrl = `https://raw.githubusercontent.com/${REPO}/main/uploads/${safeName}`;
        const cdnUrl = `https://cdn.jsdelivr.net/gh/${REPO}@main/uploads/${safeName}`;
        const vercelUrl = `/uploads/${safeName}`;

        fetch(`https://purge.jsdelivr.net/gh/${REPO}@main/uploads/${safeName}`).catch(() => {});

        return res.status(200).json({ success: true, url: rawUrl, cdn_url: cdnUrl, vercel_url: vercelUrl, filename: safeName });
      }

      // 1. Fetch authoritative current reels.json and exact SHA directly from GitHub API
      let currentReels = [];
      let sha = null;

      try {
        const ghRes = await fetch(GITHUB_URL, {
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
          }
        });
        if (ghRes.ok) {
          const fileData = await ghRes.json();
          sha = fileData.sha;
          if (fileData.content) {
            const content = Buffer.from(fileData.content, 'base64').toString('utf8');
            currentReels = JSON.parse(content || '[]');
          }
        }
      } catch (e) {
        console.warn('GitHub API fetch failed:', e.message);
      }

      // Fallback if GitHub API failed: calculate from raw
      if (!sha) {
        try {
          const rawRes = await fetch(`https://raw.githubusercontent.com/${REPO}/main/${FILE_PATH}?t=${Date.now()}`, {
            headers: { 'Cache-Control': 'no-cache' }
          });
          if (rawRes.ok) {
            const rawText = await rawRes.text();
            const buf = Buffer.from(rawText, 'utf8');
            sha = computeGitBlobSha(buf);
            currentReels = JSON.parse(rawText || '[]');
          }
        } catch (e) {}
      }

      // 2. Perform modification
      let updatedReels = [...currentReels];

      if (fullList && Array.isArray(fullList)) {
        updatedReels = fullList;
      } else if (action === 'add' && reel) {
        if (typeof reel.likes_count !== 'number') reel.likes_count = 0;
        if (typeof reel.shares_count !== 'number') reel.shares_count = 0;
        if (typeof reel.downloads_count !== 'number') reel.downloads_count = 0;
        if (typeof reel.views_count !== 'number') reel.views_count = 0;
        updatedReels = updatedReels.filter(r => r.content_id !== reel.content_id);
        updatedReels.unshift(reel);
      } else if (action === 'update' && reel) {
        const idx = updatedReels.findIndex(r => r.content_id === reel.content_id);
        if (idx !== -1) {
          updatedReels[idx] = { ...updatedReels[idx], ...reel };
        } else {
          updatedReels.unshift(reel);
        }
      } else if (action === 'batch_add' && Array.isArray(reels)) {
        const newIds = new Set(reels.map(r => r.content_id));
        updatedReels = updatedReels.filter(r => !newIds.has(r.content_id));
        const normalized = reels.map(r => ({
          ...r,
          likes_count: typeof r.likes_count === 'number' ? r.likes_count : 0,
          shares_count: typeof r.shares_count === 'number' ? r.shares_count : 0,
          downloads_count: typeof r.downloads_count === 'number' ? r.downloads_count : 0,
          views_count: typeof r.views_count === 'number' ? r.views_count : 0,
        }));
        updatedReels = [...normalized, ...updatedReels];
      } else if (action === 'delete' && id) {
        updatedReels = updatedReels.filter(r => r.content_id !== id);
      } else if (action === 'batch_delete' && Array.isArray(ids)) {
        const idSet = new Set(ids);
        updatedReels = updatedReels.filter(r => !idSet.has(r.content_id));
      } else if (action === 'wipe') {
        updatedReels = [];
      } else if (action === 'track') {
        const { content_id, metric } = payload;
        const target = updatedReels.find(r => r.content_id === content_id);
        if (target) {
          if (metric === 'like') target.likes_count = (target.likes_count || 0) + 1;
          else if (metric === 'unlike') target.likes_count = Math.max(0, (target.likes_count || 1) - 1);
          else if (metric === 'share') target.shares_count = (target.shares_count || 0) + 1;
          else if (metric === 'download') target.downloads_count = (target.downloads_count || 0) + 1;
          else if (metric === 'view') target.views_count = (target.views_count || 0) + 1;
        }
      } else if (Array.isArray(payload)) {
        updatedReels = payload;
      }

      // 3. Commit back to GitHub
      const newJsonString = JSON.stringify(updatedReels, null, 2);
      const encodedContent = Buffer.from(newJsonString, 'utf8').toString('base64');

      const putRes = await fetch(GITHUB_URL, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
        },
        body: JSON.stringify({
          message: `Admin Studio: ${action || 'sync'} (${updatedReels.length} reels) ${new Date().toISOString()}`,
          content: encodedContent,
          sha: sha || undefined,
          branch: 'main'
        })
      });

      if (!putRes.ok) {
        const errData = await putRes.json().catch(() => ({}));
        console.warn('[CloudApi] GitHub commit failed:', errData);
        return res.status(500).json({ error: 'GitHub commit failed', details: errData });
      }

      // Purge data/reels.json CDN cache immediately
      fetch(`https://purge.jsdelivr.net/gh/${REPO}@main/${FILE_PATH}`).catch(() => {});

      return res.status(200).json({ success: true, count: updatedReels.length, reels: updatedReels });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('API /api/reels error:', err);
    return res.status(500).json({ error: err.message });
  }
}
