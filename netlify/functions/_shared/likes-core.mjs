import { randomUUID } from 'node:crypto';

export function createLikesHandler(getStore, ids) {
  const knownIds = new Set(ids);
  return async request => {
    let visitor = /(?:^|;\s*)pv_visitor=([0-9a-f-]{36})(?:;|$)/i.exec(request.headers.get('cookie') || '')?.[1];
    const newVisitor = !visitor;
    if (!visitor) visitor = randomUUID();
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store', 'Vary': 'Cookie' };
    if (newVisitor) headers['Set-Cookie'] = `pv_visitor=${visitor}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Strict${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`;
    const response = (data, status = 200) => new Response(JSON.stringify(data), { status, headers });
    if (!['GET', 'POST'].includes(request.method)) return response({ error: 'Method not allowed' }, 405);
    if (request.method === 'POST') {
      if (request.headers.get('origin') !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') return response({ error: 'Same-origin requests only' }, 403);
      if (!request.headers.get('content-type')?.startsWith('application/json')) return response({ error: 'JSON body required' }, 415);
      const body = await request.text();
      if (body.length > 1024) return response({ error: 'Request too large' }, 413);
      let vote;
      try { vote = JSON.parse(body); } catch { return response({ error: 'Invalid JSON' }, 400); }
      if (!vote || !knownIds.has(vote.id) || typeof vote.liked !== 'boolean') return response({ error: 'Valid prompt and liked value required' }, 400);
      try {
        const store = getStore();
        const key = `votes/${vote.id}~${visitor}`;
        if (vote.liked) await store.set(key, '1'); else await store.delete(key);
      } catch { return response({ error: 'Likes are temporarily unavailable. Try again shortly.' }, 503); }
    }
    try {
      const { blobs } = await getStore().list({ prefix: 'votes/' });
      const counts = Object.fromEntries(ids.map(id => [id, 0]));
      const liked = [];
      for (const blob of blobs) {
        const [id, browser] = blob.key.slice(6).split('~');
        if (!knownIds.has(id) || !browser) continue;
        counts[id]++;
        if (browser === visitor) liked.push(id);
      }
      return response({ counts, liked });
    } catch { return response({ error: 'Likes are temporarily unavailable. Try again shortly.' }, 503); }
  };
}
