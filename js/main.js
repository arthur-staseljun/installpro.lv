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

  apply(lang);
})();
