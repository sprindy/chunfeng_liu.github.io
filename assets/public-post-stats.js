(() => {
  const display = document.querySelector('[data-public-post-stats]');
  if (!display) return;

  const endpoint = new URL('/post-stats', display.dataset.publicPostStats);
  endpoint.searchParams.set('post', display.dataset.postPath);

  fetch(endpoint, { credentials: 'omit' })
    .then(response => response.ok ? response.json() : null)
    .then(stats => {
      if (!Number.isSafeInteger(stats?.views) || stats.views < 0) return;
      const count = stats.views.toLocaleString();
      display.textContent = `${count} ${stats.views === 1 ? 'view' : 'views'} in the last 90 days`;
      display.hidden = false;
    })
    .catch(() => {});
})();
