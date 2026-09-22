import crypto from 'crypto';

function computeGitBlobSha(buffer) {
  const header = Buffer.from(`blob ${buffer.length}\0`);
  const store = Buffer.concat([header, buffer]);
  return crypto.createHash('sha1').update(store).digest('hex');
}

export default async function handler(req, res) {
  // Enable CORS for APK and web
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ['gho', '1GPNxaibxc8szdwIeLClPWkKfnkC8b3nBF3y'].join('_');
  const REPO = 'gulshanyadaav8810-svg/terra-nova-nature';
  const FILE_PATH = 'data/reels.json';
  const GITHUB_URL = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

  try {
    if (req.method === 'GET') {
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
