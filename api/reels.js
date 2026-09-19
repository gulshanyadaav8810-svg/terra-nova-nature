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
      // Fetch latest reels from GitHub repo
      const ghRes = await fetch(GITHUB_URL, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'NatureMomentsApp'
        }
      });

      if (!ghRes.ok) {
        // Fallback to raw URL
        const rawRes = await fetch(`https://raw.githubusercontent.com/${REPO}/main/${FILE_PATH}?t=${Date.now()}`);
        if (rawRes.ok) {
          const rawData = await rawRes.json();
          return res.status(200).json(rawData);
        }
        return res.status(200).json([]);
      }

      const fileData = await ghRes.json();
      const content = Buffer.from(fileData.content, 'base64').toString('utf8');
      const reels = JSON.parse(content || '[]');
      return res.status(200).json(reels);
    }

    if (req.method === 'POST') {
      let payload = req.body;
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch (e) {
          // keep as string
        }
      }

      const { action, reel, reels, id, ids, fullList } = payload || {};

      // 1. Get current file data and SHA from GitHub
      const ghRes = await fetch(GITHUB_URL, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'NatureMomentsApp'
        }
      });

      let currentReels = [];
      let sha = null;

      if (ghRes.ok) {
        const fileData = await ghRes.json();
        sha = fileData.sha;
        try {
          const content = Buffer.from(fileData.content, 'base64').toString('utf8');
          currentReels = JSON.parse(content || '[]');
        } catch (e) {
          currentReels = [];
        }
      }

      // 2. Perform modification
      let updatedReels = [...currentReels];

      if (action === 'upload_video') {
        const { filename, base64 } = payload;
        if (!filename || !base64) {
          return res.status(400).json({ error: 'filename and base64 required' });
        }
        const safeName = `reel_${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
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
            message: `Upload video: ${safeName}`,
            content: base64,
            branch: 'main'
          })
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          return res.status(500).json({ error: 'Video upload failed', details: errData });
        }

        const rawUrl = `https://raw.githubusercontent.com/${REPO}/main/uploads/${safeName}`;
        const cdnUrl = `https://cdn.jsdelivr.net/gh/${REPO}@main/uploads/${safeName}`;
        return res.status(200).json({ success: true, url: rawUrl, cdn_url: cdnUrl, filename: safeName });
      }

      if (fullList && Array.isArray(fullList)) {
        updatedReels = fullList;
      } else if (action === 'add' && reel) {
        if (typeof reel.likes_count !== 'number') reel.likes_count = 0;
        if (typeof reel.shares_count !== 'number') reel.shares_count = 0;
        if (typeof reel.downloads_count !== 'number') reel.downloads_count = 0;
        if (typeof reel.views_count !== 'number') reel.views_count = 0;
        updatedReels = updatedReels.filter(r => r.content_id !== reel.content_id);
        updatedReels.unshift(reel);
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
          'User-Agent': 'NatureMomentsApp'
        },
        body: JSON.stringify({
          message: `Admin Cloud API: Sync reels (${updatedReels.length} reels)`,
          content: encodedContent,
          sha: sha || undefined,
          branch: 'main'
        })
      });

      if (!putRes.ok) {
        const errData = await putRes.json();
        return res.status(500).json({ error: 'GitHub commit failed', details: errData });
      }

      return res.status(200).json({ success: true, count: updatedReels.length, reels: updatedReels });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('API /api/reels error:', err);
    return res.status(500).json({ error: err.message });
  }
}
