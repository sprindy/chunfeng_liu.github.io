import { dashboard, dashboardUrl, loginPage } from './views.mjs';

const day = 86_400_000;
const encoder = new TextEncoder();
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const cookieName = '__Host-portfolio-admin';
const headers = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin',
  'X-Robots-Tag': 'noindex, nofollow',
  'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'"
};

const html = (body, status = 200, extra = {}) => new Response(body, {
  status, headers: { ...headers, ...extra, 'Content-Type': 'text/html; charset=utf-8' }
});
const redirect = (cookie, location = '/') => new Response(null, {
  status: 303, headers: { ...headers, Location: location, 'Set-Cookie': cookie }
});

function cookie(value, age) {
  return `${cookieName}=${value}; Max-Age=${age}; Path=/; HttpOnly; Secure; SameSite=Strict`;
}

async function sign(secret, data) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const bytes = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(data)));
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

function equal(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function limitedIp(ip) {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) return ip.replace(/\.\d+$/, '.0/24');
  if (!/^[a-f0-9:]+$/i.test(ip) || !ip.includes(':')) return '';
  const [head, tail] = ip.split('::');
  const prefix = head.split(':').filter(Boolean);
  const end = (tail || '').split(':').filter(Boolean);
  const expanded = tail === undefined ? prefix : [...prefix, ...Array(Math.max(0, 8 - prefix.length - end.length)).fill('0'), ...end];
  return expanded.length === 8 ? expanded.slice(0, 3).join(':') + '::/48' : '';
}

async function smallBody(request, max = 2048) {
  if (!request.body) throw Error('Missing request body');
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) return text + decoder.decode();
    size += value.length;
    if (size > max) {
      await reader.cancel();
      throw Error('Request too large');
    }
    text += decoder.decode(value, { stream: true });
  }
}

async function collect(request, env) {
  const origin = request.headers.get('Origin');
  if (origin !== env.SITE_ORIGIN) return new Response(null, { status: 403 });
  const cors = { 'Access-Control-Allow-Origin': origin, Vary: 'Origin', 'Cache-Control': 'no-store' };
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: {
    ...cors, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type'
  } });
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: cors });

  let event;
  try {
    event = JSON.parse(await smallBody(request));
  } catch {
    return new Response(null, { status: 400, headers: cors });
  }
  const { id, visitor, session, path, activeMs } = event || {};
  if (![id, visitor, session].every(x => typeof x === 'string' && uuid.test(x)) ||
      typeof path !== 'string' || path.length > 350 || !/^\/[a-z0-9_./-]*$/i.test(path) ||
      !path.startsWith(env.SITE_BASE + '/') || path.includes('..') || path.includes('//') ||
      !Number.isSafeInteger(activeMs) || activeMs < 0 || activeMs > 12 * 60 * 60_000) {
    return new Response(null, { status: 400, headers: cors });
  }

  const now = Date.now();
  const ip = request.headers.get('CF-Connecting-IP') || '';
  const prefix = limitedIp(ip);
  const network = request.cf?.asOrganization?.slice(0, 160) || null;
  const asn = Number.isSafeInteger(request.cf?.asn) ? request.cf.asn : null;
  await env.DB.prepare(`
    INSERT INTO page_views (id, visitor, session, path, started, active_ms, ip, asn, network)
    VALUES (?, ?, ?, ?, ?, MIN(?, 15000), ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET active_ms =
      MAX(page_views.active_ms, MIN(?, ? - page_views.started + 15000))
    WHERE page_views.visitor = excluded.visitor AND page_views.session = excluded.session
      AND page_views.path = excluded.path AND excluded.started - page_views.started < 43200000
  `).bind(id, visitor, session, path, now, activeMs,
    env.STORE_FULL_IP === 'true' && prefix ? ip : prefix, asn, network, activeMs, now).run();
  return new Response(null, { status: 204, headers: cors });
}

async function signedIn(request, env) {
  const token = (request.headers.get('Cookie') || '').match(new RegExp(`(?:^|; )${cookieName}=([^;]+)`))?.[1] || '';
  const [time, signature] = token.split('.');
  if (!/^\d{13}$/.test(time || '') || Number(time) <= Date.now() || !/^[a-f0-9]{64}$/.test(signature || '')) return false;
  return equal(signature, await sign(env.SESSION_SECRET, time + ':' + env.ADMIN_PASSWORD));
}

async function login(request, env, path, days) {
  const destination = dashboardUrl(days, path);
  const ip = request.headers.get('CF-Connecting-IP') || '';
  const bucket = Math.floor(Date.now() / (15 * 60_000));
  const key = await sign(env.SESSION_SECRET, 'login:' + ip);
  const row = await env.DB.prepare(`
    INSERT INTO login_attempts (key, bucket, attempts) VALUES (?, ?, 1)
    ON CONFLICT(key) DO UPDATE SET
      attempts = CASE WHEN bucket = excluded.bucket THEN attempts + 1 ELSE 1 END,
      bucket = excluded.bucket
    RETURNING attempts
  `).bind(key, bucket).first();
  if (row.attempts > 10) return html(loginPage('Too many attempts. Try again in 15 minutes.', destination), 429);
  let form;
  try {
    form = new URLSearchParams(await smallBody(request));
  } catch {
    return html(loginPage('Invalid sign-in request.', destination), 400);
  }
  const expected = JSON.stringify([env.ADMIN_USERNAME, env.ADMIN_PASSWORD]);
  const entered = JSON.stringify([form.get('username') || '', form.get('password') || '']);
  if (!equal(await sign(env.SESSION_SECRET, entered), await sign(env.SESSION_SECRET, expected))) {
    return html(loginPage('Username or password is incorrect.', destination), 401);
  }
  const age = 8 * 60 * 60;
  const time = String(Date.now() + age * 1000);
  return redirect(cookie(time + '.' + await sign(env.SESSION_SECRET, time + ':' + env.ADMIN_PASSWORD), age), destination);
}

function isBlogPostPath(path, base) {
  return path.length <= 350 && path.startsWith(base) &&
    /^[a-z0-9_-]+\/$/i.test(path.slice(base.length));
}

async function publicPostStats(request, env, url) {
  const responseHeaders = {
    'Access-Control-Allow-Origin': env.SITE_ORIGIN,
    'Cache-Control': 'public, max-age=300',
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff'
  };
  if (request.method !== 'GET') {
    return new Response(null, { status: 405, headers: { Allow: 'GET' } });
  }
  const path = url.searchParams.get('post') || '';
  if (!isBlogPostPath(path, env.SITE_BASE + '/blog/')) {
    return Response.json({ error: 'Invalid blog post address.' }, { status: 400, headers: responseHeaders });
  }
  const { views } = await env.DB.prepare(
    'SELECT COUNT(*) AS views FROM page_views WHERE path = ? AND started >= ?'
  ).bind(path, Date.now() - 90 * day).first();
  return Response.json({ views }, { headers: responseHeaders });
}

async function report(db, days, path) {
  const cutoff = Date.now() - days * day;
  const scope = 'WITH selected_views AS (SELECT * FROM page_views WHERE started >= ?' +
    (path ? ' AND path = ?)' : ')');
  const queries = [
    `SELECT COUNT(*) views, COUNT(DISTINCT visitor) visitors, COUNT(DISTINCT session) visits,
      SUM(active_ms) active_ms, (SELECT COUNT(*) FROM
      (SELECT visitor FROM selected_views GROUP BY visitor HAVING COUNT(DISTINCT session) > 1)) repeat
      FROM selected_views`,
    `SELECT path, COUNT(*) views, COUNT(DISTINCT visitor) visitors, AVG(active_ms) active_ms
      FROM selected_views GROUP BY path ORDER BY views DESC, path LIMIT 100`,
    `SELECT visitor, COUNT(DISTINCT session) visits, COUNT(*) views, SUM(active_ms) active_ms,
      MAX(started) last_seen FROM selected_views GROUP BY visitor ORDER BY visits DESC, last_seen DESC LIMIT 100`,
    `SELECT asn, network, COUNT(DISTINCT visitor) visitors, COUNT(DISTINCT session) visits,
      COUNT(*) views FROM selected_views WHERE network IS NOT NULL
      GROUP BY asn, network ORDER BY visits DESC, network LIMIT 100`,
    `SELECT path, visitor, ip, network, active_ms, started FROM selected_views
      ORDER BY started DESC LIMIT 100`,
    `SELECT date(started / 1000, 'unixepoch', '+8 hours') date, COUNT(*) views
      FROM selected_views GROUP BY date ORDER BY date`
  ];
  return (await db.batch(queries.map(query =>
    db.prepare(scope + ' ' + query).bind(...(path ? [cutoff, path] : [cutoff]))
  ))).map(r => r.results);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/collect') return collect(request, env);
    if (url.pathname === '/post-stats') return publicPostStats(request, env, url);
    if (!env.ADMIN_USERNAME || env.ADMIN_PASSWORD?.length < 12 || !env.ADMIN_PASSWORD || !env.SESSION_SECRET || env.SESSION_SECRET.length < 32) {
      return new Response('Dashboard setup is incomplete.', { status: 503, headers });
    }
    if (request.method === 'POST' && request.headers.get('Origin') !== url.origin) {
      return new Response(null, { status: 403, headers });
    }
    const days = [7, 30, 90].find(n => String(n) === url.searchParams.get('days')) || 30;
    const path = url.searchParams.get('post') || '';
    if (path && !isBlogPostPath(path, env.SITE_BASE + '/blog/')) {
      return new Response('Invalid blog post address.', { status: 400, headers });
    }
    if (url.pathname === '/login' && request.method === 'POST') return login(request, env, path, days);
    if (url.pathname === '/logout' && request.method === 'POST') return redirect(cookie('', 0));
    if (url.pathname !== '/' || request.method !== 'GET') return new Response(null, { status: 404, headers });
    if (!await signedIn(request, env)) return html(loginPage('', dashboardUrl(days, path)));
    return html(dashboard(await report(env.DB, days, path), days, env.STORE_FULL_IP === 'true',
      path, env.SITE_BASE + '/blog/'));
  },
  async scheduled(_event, env) {
    await env.DB.batch([
      env.DB.prepare('DELETE FROM page_views WHERE started < ?').bind(Date.now() - 90 * day),
      env.DB.prepare('DELETE FROM login_attempts WHERE bucket < ?').bind(Math.floor(Date.now() / (15 * 60_000)) - 96)
    ]);
  }
};
