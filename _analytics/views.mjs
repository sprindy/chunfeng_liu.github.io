const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[c]);
const number = value => Number(value || 0).toLocaleString('en-SG');
const duration = ms => {
  const seconds = Math.round((ms || 0) / 1000);
  if (seconds < 60) return seconds + 's';
  return Math.floor(seconds / 60) + 'm ' + seconds % 60 + 's';
};
const stamp = value => new Intl.DateTimeFormat('en-SG', {
  timeZone: 'Asia/Singapore', dateStyle: 'medium', timeStyle: 'short'
}).format(value);

function page(title, body) {
  return `<!doctype html><html lang="en"><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Chunfeng Liu</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f5f7f3;color:#112b32;font:16px/1.5 system-ui,sans-serif}
main{width:min(1180px,100% - 2rem);margin:2rem auto 4rem}
h1{font-size:clamp(2rem,5vw,3.25rem);margin:.2rem 0}h2{font-size:1.25rem;margin:.2rem 0 .6rem}
p{margin:.5rem 0;color:#435b61}a{color:#175a51}header,section,.login{background:#fff;border:1px solid #d8e3dd;border-radius:12px;padding:clamp(1rem,3vw,1.5rem);margin-bottom:1rem}
header{display:flex;gap:1rem;align-items:flex-start;justify-content:space-between;flex-wrap:wrap}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:1rem}
.stats section{margin:0 0 1rem}.stats b{display:block;font-size:1.7rem}.tabs{display:flex;gap:.6rem;flex-wrap:wrap;margin:1rem 0}
.tabs a,button{border:1px solid #a5bbb2;border-radius:6px;padding:.45rem .75rem;background:#fff;text-decoration:none;cursor:pointer;color:#133e38;font:inherit}
.tabs [aria-current],button[type=submit]{background:#175a51;color:white}
:focus-visible{outline:3px solid #0d786a;outline-offset:3px}
.scroll{overflow:auto}table{border-collapse:collapse;width:100%;text-align:left;font-size:.9rem}
td,th{padding:.55rem .7rem;border-bottom:1px solid #e4ebe7;vertical-align:top}
td:first-child{overflow-wrap:anywhere}th{white-space:nowrap;color:#435b61;background:#f3f7f4}
.chart{display:grid;grid-template-columns:repeat(auto-fit,minmax(10px,1fr));align-items:end;gap:3px;height:150px;border-bottom:1px solid #a5bbb2}
.chart svg{display:block;width:100%;height:100%;max-height:150px}.chart rect{fill:#277d71}
.chart-axis{display:flex;justify-content:space-between;font-size:.8rem;color:#435b61}
.login{max-width:400px;margin:10vh auto}.login label{display:block;margin:1rem 0}.login input{display:block;width:100%;font:inherit;padding:.5rem;border:1px solid #a5bbb2;border-radius:5px}.error{color:#a41625}
</style><main>${body}</main></html>`;
}

export function loginPage(error = '') {
  return page('Visitor analytics sign-in', `<form class="login" method="post" action="/login">
<h1>Visitor analytics</h1><p>Sign in to view your portfolio’s private dashboard.</p>
${error ? '<p class="error" role="alert">' + esc(error) + '</p>' : ''}
<label>Username<input name="username" autocomplete="username" maxlength="150" required></label>
<label>Password<input type="password" name="password" autocomplete="current-password" maxlength="200" required></label>
<button type="submit">Sign in</button></form>`);
}

function table(title, headers, rows, description = '') {
  return `<section><h2>${esc(title)}</h2>${description ? '<p>' + esc(description) + '</p>' : ''}
${rows.length ? '<div class="scroll"><table><thead><tr>' + headers.map(h => '<th scope="col">' + esc(h) + '</th>').join('') +
  '</tr></thead><tbody>' + rows.map(r => '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') +
  '</tbody></table></div>' : '<p>No activity in this period.</p>'}</section>`;
}

function trend(rows, days) {
  if (!rows.length) return '<section><h2>Daily page views</h2><p>No activity in this period.</p></section>';
  const counts = new Map(rows.map(r => [r.date, r.views]));
  const offset = 8 * 3600_000;
  const today = Math.floor((Date.now() + offset) / 86_400_000) * 86_400_000;
  const series = Array.from({ length: days + 1 }, (_, i) => {
    const date = new Date(today - (days - i) * 86_400_000).toISOString().slice(0, 10);
    return [date, counts.get(date) || 0];
  });
  const max = Math.max(1, ...series.map(([, count]) => count));
  return `<section><h2>Daily page views</h2><p>Singapore time · busiest day ${number(max)} views</p>
<div class="chart" role="img" aria-label="Bar chart of daily page views">
${series.map(([date, count]) => {
    const height = Math.round(count / max * 145);
    return `<svg viewBox="0 0 10 150" preserveAspectRatio="none" aria-hidden="true"><title>${esc(date)} · ${number(count)} views</title>
<rect x="0" y="${150 - height}" width="10" height="${height}"/></svg>`;
  }).join('')}</div>
<div class="chart-axis"><span>${series[0][0]}</span><span>${series.at(-1)[0]}</span></div></section>`;
}

export function dashboard([totals, pages, visitors, networks, recent, daily], days, fullIp) {
  const { views, visitors: unique, visits, repeat, active_ms } = totals[0];
  const metrics = [['Visitors', number(unique)], ['Visits', number(visits)], ['Repeat visitors', number(repeat)],
    ['Page views', number(views)], ['Time on visible pages', duration(active_ms)]];
  return page('Visitor analytics', `<header><div><h1>Visitor analytics</h1>
<p>Portfolio traffic from browsers that allowed analytics.</p></div>
<form method="post" action="/logout"><button type="submit">Sign out</button></form></header>
<nav class="tabs" aria-label="Date range">${[7, 30, 90].map(n =>
    `<a href="/?days=${n}"${n === days ? ' aria-current="page"' : ''}>Last ${n} days</a>`).join('')}</nav>
<div class="stats">${metrics.map(([label, value]) => '<section><b>' + esc(value) + '</b>' + esc(label) + '</section>').join('')}</div>
${trend(daily, days)}
${table('Pages', ['Page', 'Views', 'Visitors', 'Avg. visible time'], pages.map(r =>
    [r.path, number(r.views), number(r.visitors), duration(r.active_ms)]))}
${table('Visitors', ['Browser ID', 'Visits', 'Views', 'Visible time', 'Last seen'], visitors.map(r =>
    [r.visitor, number(r.visits), number(r.views), duration(r.active_ms), stamp(r.last_seen)]),
    'A visit restarts after 30 minutes of inactivity. The same browser keeps its ID while its settings are saved.')}
${table('Organizations and networks', ['Network owner', 'ASN', 'Visitors', 'Visits', 'Views'], networks.map(r =>
    [r.network, r.asn ?? '—', number(r.visitors), number(r.visits), number(r.views)]),
    'The network owner may be a company, ISP, VPN, or cloud provider.')}
${table('Recent page views', ['Page opened', 'Page', 'Browser ID', fullIp ? 'IP address' : 'IP prefix', 'Network', 'Visible time'], recent.map(r =>
    [stamp(r.started), r.path, r.visitor, r.ip || '—', r.network || '—', duration(r.active_ms)]), 'Latest 100 page views in the selected period.')}
`);
}
