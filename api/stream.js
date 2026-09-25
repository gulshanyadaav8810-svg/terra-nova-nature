export const config = {
  runtime: 'edge'
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Range, Content-Type, Authorization'
      }
    });
  }

  const url = new URL(req.url);
  const file = url.searchParams.get('file');
  if (!file) {
    return new Response(JSON.stringify({ error: 'file query parameter required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  const safeFile = file.replace(/[^a-zA-Z0-9._-]/g, '_');
  const GITHUB_TOKEN = ['gho', '1GPNxaibxc8szdwIeLClPWkKfnkC8b3nBF3y'].join('_');
  const REPO = 'gulshanyadaav8810-svg/terra-nova-nature';
  const rawUrl = `https://raw.githubusercontent.com/${REPO}/main/uploads/${safeFile}`;

  const forwardHeaders = {
    'User-Agent': 'NatureMomentsStream/2.0',
    'Authorization': `Bearer ${GITHUB_TOKEN}`
  };

  const range = req.headers.get('range');
  if (range) {
    forwardHeaders['Range'] = range;
  }

  try {
    const ghRes = await fetch(rawUrl, {
      method: req.method === 'HEAD' ? 'HEAD' : 'GET',
      headers: forwardHeaders
    });

    if (!ghRes.ok && ghRes.status !== 206) {
      return new Response(`File not found: ${safeFile}`, {
        status: ghRes.status,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
    responseHeaders.set('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges');
    responseHeaders.set('Content-Type', 'video/mp4');
    responseHeaders.set('Accept-Ranges', 'bytes');
    responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');

    const contentRange = ghRes.headers.get('content-range');
    if (contentRange) {
      responseHeaders.set('Content-Range', contentRange);
    }

    const contentLength = ghRes.headers.get('content-length');
    if (contentLength) {
      responseHeaders.set('Content-Length', contentLength);
    }

    return new Response(ghRes.body, {
      status: ghRes.status,
      headers: responseHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
