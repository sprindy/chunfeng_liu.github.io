(() => {
  const control = document.querySelector('[data-visitor-analytics]');
  if (!control || !globalThis.crypto?.randomUUID) return;

  const prompt = document.querySelector('[data-analytics-prompt]');
  const settingsButton = document.querySelector('[data-analytics-settings]');
  const key = 'chunfeng-portfolio-analytics';
  const endpoint = new URL('/collect', control.dataset.visitorAnalytics);
  const path = control.dataset.pagePath;
  const idleMs = 30 * 60_000;
  let view;

  const read = () => JSON.parse(localStorage.getItem(key) || '{}');
  const write = state => localStorage.setItem(key, JSON.stringify(state));
  const stop = () => {
    view = undefined;
  };

  function send(beacon = false) {
    if (!view) return;
    try {
      const state = read();
      if (state.choice !== 'allow' || state.visitor !== view.visitor) return stop();
      const body = JSON.stringify({
        id: view.id, visitor: view.visitor, session: view.session,
        path, activeMs: Math.round(view.activeMs)
      });
      if (beacon && navigator.sendBeacon?.(endpoint, body)) return;
      fetch(endpoint, { method: 'POST', body, credentials: 'omit', keepalive: true }).catch(() => {});
    } catch {
      stop();
    }
  }

  function start(state) {
    const now = Date.now();
    if (!state.session || now - state.last > idleMs) state.session = crypto.randomUUID();
    state.last = now;
    write(state);
    view = { id: crypto.randomUUID(), visitor: state.visitor, session: state.session,
      activeMs: 0, tick: performance.now(), visible: document.visibilityState === 'visible' };
    send();
  }

  function update(visible) {
    if (!view) return;
    const now = performance.now();
    if (view.visible) view.activeMs += Math.min(now - view.tick, 15_000);
    view.tick = now;
    view.visible = visible;
  }

  function heartbeat() {
    if (!view || document.visibilityState !== 'visible') return;
    try {
      const state = read();
      if (state.choice !== 'allow') return stop();
      if (Date.now() - state.last > idleMs || state.session !== view.session) return start(state);
      update(true);
      state.last = Date.now();
      write(state);
      send();
    } catch {
      stop();
    }
  }

  function reflect(choice) {
    if (prompt) prompt.hidden = choice === 'allow' || choice === 'decline';
    control.querySelector('[data-analytics-status]').textContent = choice === 'allow'
      ? 'Analytics allowed.' : choice === 'decline' ? 'Analytics disabled.' : 'Analytics are off until you allow them.';
  }

  try {
    const previous = read();
    reflect(previous.choice);
    if (settingsButton && typeof control.showModal === 'function') {
      settingsButton.addEventListener('click', () => control.showModal());
      settingsButton.hidden = false;
    }
    if (previous.choice === 'allow') start(previous);
    for (const button of document.querySelectorAll('[data-analytics-choice]')) {
      button.addEventListener('click', () => {
        try {
          const choice = button.dataset.analyticsChoice;
          const state = read();
          if (choice === 'allow') {
            if (state.choice !== 'allow') start({ choice, visitor: crypto.randomUUID() });
          } else {
            write({ choice });
            stop();
          }
          const moveFocus = prompt?.contains(button) && document.activeElement === button;
          reflect(choice);
          if (moveFocus) document.getElementById('main')?.focus({ preventScroll: true });
        } catch {
          stop();
        }
      });
    }
    setInterval(heartbeat, 10_000);
    document.addEventListener('visibilitychange', () => {
      update(document.visibilityState === 'visible');
      if (document.visibilityState === 'hidden') send(true);
      else heartbeat();
    });
    window.addEventListener('pagehide', () => { update(false); send(true); });
    window.addEventListener('pageshow', e => { if (e.persisted) heartbeat(); });
    window.addEventListener('storage', e => {
      if (e.key !== key && e.key !== null) return;
      try {
        const state = read();
        reflect(state.choice);
        if (state.choice !== 'allow') stop();
      } catch {
        stop();
      }
    });
  } catch {
    stop();
  }
})();
