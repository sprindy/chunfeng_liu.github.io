(() => {
  const box = document.querySelector('[data-public-post-stats]');
  if (!box) return;
  const element = name => box.querySelector('[data-' + name + ']');
  const like = element('post-like');
  const comment = element('post-comments');
  const panel = document.getElementById('post-comments');
  const form = element('post-comment-form');
  const status = element('post-status');
  const count = number => Number(number).toLocaleString();
  const endpoint = route => {
    const url = new URL(route, box.dataset.publicPostStats);
    url.searchParams.set('post', box.dataset.postPath);
    return url;
  };
  async function request(url, input) {
    const options = { credentials: 'omit' };
    if (input) Object.assign(options, { method: 'POST', body: JSON.stringify(input) });
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw Error(error.error || 'Could not reach the blog. Please try again.');
    }
    return response.json();
  }

  const stats = endpoint('/post-stats');
  request(stats).then(({ views }) => {
    if (!Number.isSafeInteger(views) || views < 0) return;
    const display = element('post-views');
    display.textContent = count(views) + (views === 1 ? ' view' : ' views') + ' in the last 90 days';
    display.hidden = false;
  }).catch(() => {});

  let reader = '';
  try {
    const key = 'portfolio-blog-reactions';
    reader = localStorage.getItem(key) || '';
    if (!reader) {
      reader = crypto.randomUUID();
      localStorage.setItem(key, reader);
    }
  } catch {
    reader = '';
  }

  const engagement = endpoint('/post-engagement');
  const readerEngagement = new URL(engagement);
  if (reader) readerEngagement.searchParams.set('reader', reader);
  function showLikes(data) {
    element('like-count').textContent = count(data.likes);
    like.setAttribute('aria-pressed', String(data.liked));
  }
  function showComments(data) {
    element('comment-count').textContent = count(data.commentCount);
    const list = element('post-comment-list');
    list.replaceChildren();
    if (!data.comments.length) {
      list.textContent = 'No published comments yet.';
      return;
    }
    if (data.comments.length < data.commentCount) {
      const note = document.createElement('p');
      note.textContent = 'Showing the latest ' + count(data.comments.length) + ' comments.';
      list.append(note);
    }
    for (const entry of data.comments) {
      const item = document.createElement('div');
      item.className = 'post-comment';
      const author = document.createElement('strong');
      author.textContent = entry.name;
      const body = document.createElement('p');
      body.textContent = entry.body;
      item.append(author, body);
      list.append(item);
    }
  }

  request(readerEngagement).then(data => {
    showLikes(data);
    showComments(data);
    like.hidden = !reader;
    like.disabled = !reader;
    comment.hidden = false;
    comment.disabled = false;
  }).catch(() => {});

  like.addEventListener('click', async () => {
    like.disabled = true;
    status.textContent = '';
    try {
      showLikes(await request(engagement, { action: 'like', reader, liked: like.getAttribute('aria-pressed') !== 'true' }));
    } catch (error) {
      status.textContent = error.message;
    } finally {
      like.disabled = false;
    }
  });
  comment.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    comment.setAttribute('aria-expanded', String(!panel.hidden));
    if (!panel.hidden) form.elements.body.focus();
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const submit = form.querySelector('button[type=submit]');
    const fields = new FormData(form);
    submit.disabled = true;
    status.textContent = '';
    try {
      const result = await request(engagement, { action: 'comment', name: fields.get('name'), body: fields.get('body') });
      form.reset();
      showComments(await request(readerEngagement));
      status.textContent = result.pending ? 'Comment submitted. Immediate publishing is awaiting a server update.' : 'Comment published.';
    } catch (error) {
      status.textContent = error.message;
    } finally {
      submit.disabled = false;
    }
  });
  element('post-share').addEventListener('click', async () => {
    const url = document.querySelector('link[rel=canonical]')?.href || window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: document.title, url });
      else {
        await navigator.clipboard.writeText(url);
        status.textContent = 'Link copied.';
      }
    } catch (error) {
      if (error.name !== 'AbortError') status.textContent = 'Copy the post URL from your address bar.';
    }
  });
})();
