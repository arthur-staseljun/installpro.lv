(() => {
  const EMAIL = 'installpro@inbox.lv';
  const TITLES = {
    lv: 'Install Pro — Izkārtnes un montāža, Rīga',
    ru: 'Install Pro — Вывески и монтаж, Рига'
  };

  const buttons = document.querySelectorAll('.lang button');

  function apply(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-lv]').forEach((el) => {
      el.textContent = el.dataset[lang];
    });
    buttons.forEach((b) => b.setAttribute('aria-pressed', b.dataset.set === lang));
    document.title = TITLES[lang];
    try { localStorage.setItem('lang', lang); } catch (e) { /* storage unavailable */ }
  }

  let lang = 'lv';
  try {
    lang = localStorage.getItem('lang') || ((navigator.language || '').startsWith('ru') ? 'ru' : 'lv');
  } catch (e) { /* storage unavailable */ }

  buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.set)));
  document.getElementById('yr').textContent = new Date().getFullYear();

  document.getElementById('f').addEventListener('submit', (e) => {
    e.preventDefault();
    const { msg, name, contact } = e.target.elements;
    const body = `${msg.value}\n\n${name.value}\n${contact.value}`;
    const subject = 'Pieprasījums / Запрос — installpro.lv';
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  const COUNTER_API = 'https://installpro-counter-worker.latvia-robotics.workers.dev/api/counter';
  const OWNER_TOKEN = 'ip-owner-fae4edf7';
  const VISITED_KEY = 'ip-unique-visitor-v1';
  const OWNER_KEY = 'ip-owner-counter-enabled';

  function isOwner() {
    const params = new URLSearchParams(location.search);
    try {
      if (params.get('counter_access') === OWNER_TOKEN) {
        localStorage.setItem(OWNER_KEY, '1');
        params.delete('counter_access');
        const q = params.toString();
        history.replaceState(null, '', location.pathname + (q ? `?${q}` : '') + location.hash);
        return true;
      }
      return localStorage.getItem(OWNER_KEY) === '1';
    } catch (e) {
      // storage unavailable (private mode, blocked cookies): treat as a regular visitor
      return false;
    }
  }

  function updateVisitorCount() {
    if (!COUNTER_API.includes('/api/counter') || COUNTER_API.includes('REPLACE_WITH')) return;

    const owner = isOwner();
    let visited = false;
    try { visited = localStorage.getItem(VISITED_KEY) === '1'; } catch (e) { /* storage unavailable */ }
    if (!owner && visited) return;

    fetch(`${COUNTER_API}?mode=${visited ? 'get' : 'hit'}`)
      .then((r) => {
        if (!r.ok) throw new Error('Counter request failed');
        return r.json();
      })
      .then(({ value }) => {
        if (!visited) {
          try { localStorage.setItem(VISITED_KEY, '1'); } catch (e) { /* storage unavailable */ }
        }
        if (!owner || !Number.isFinite(value)) return;
        document.getElementById('visitor-count-value').textContent = value.toLocaleString();
        document.getElementById('visitor-counter').hidden = false;
      })
      .catch(() => { /* counter is non-essential */ });
  }

  apply(lang);
  updateVisitorCount();
})();
