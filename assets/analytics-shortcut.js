(() => {
  const label = document.querySelector('[data-analytics-sign-in]');
  if (!label) return;

  const openSignIn = () => {
    window.location.assign(label.dataset.analyticsSignIn);
  };

  label.addEventListener('dblclick', openSignIn);
  label.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.repeat) {
      event.preventDefault();
      openSignIn();
    }
  });
})();
