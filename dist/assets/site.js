
(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  const panel = $('#site-search');
  const searchToggle = $('.search-toggle');
  const searchInput = $('#site-search-input');
  const searchClose = $('.search-close');
  const searchForm = $('.search-form');
  const searchResults = $('.search-results');
  let searchIndex = null;

  const openSearch = async () => {
    if (!panel) return;
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden','false');
    searchToggle?.setAttribute('aria-expanded','true');
    if (!searchIndex) {
      try { searchIndex = await (await fetch('/assets/search-index.json')).json(); }
      catch (_) { searchIndex = []; }
    }
    setTimeout(() => searchInput?.focus(), 50);
  };
  const closeSearch = () => {
    panel?.classList.remove('is-open');
    panel?.setAttribute('aria-hidden','true');
    searchToggle?.setAttribute('aria-expanded','false');
  };
  const renderResults = (query) => {
    if (!searchResults) return;
    const q = query.trim().toLocaleLowerCase('fr');
    if (!q || q.length < 2) { searchResults.innerHTML = ''; return; }
    const matches = (searchIndex || []).filter(item => (`${item.title} ${item.category} ${item.description}`).toLocaleLowerCase('fr').includes(q)).slice(0,6);
    searchResults.innerHTML = matches.length
      ? matches.map(item => `<a class="search-result" href="${item.url}"><span>${item.category} · ${item.date}</span><strong>${item.title}</strong></a>`).join('')
      : '<p class="search-empty">Aucune analyse ne correspond à cette recherche.</p>';
  };
  searchToggle?.addEventListener('click', openSearch);
  searchClose?.addEventListener('click', closeSearch);
  searchInput?.addEventListener('input', e => renderResults(e.target.value));
  searchForm?.addEventListener('submit', e => { e.preventDefault(); renderResults(searchInput.value); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });

  const nav = $('#site-nav');
  const navToggle = $('.nav-toggle');
  navToggle?.addEventListener('click', () => {
    const active = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded',String(active));
  });

  const chips = $$('.filter-chip');
  const cards = $$('.articles-grid[data-filterable] .story-card');
  const noResults = $('.no-results');
  chips.forEach(chip => chip.addEventListener('click', () => {
    const category = chip.dataset.category;
    chips.forEach(c => c.classList.toggle('is-active', c === chip));
    let visible = 0;
    cards.forEach(card => {
      const show = category === 'all' || card.dataset.category === category;
      card.classList.toggle('is-hidden',!show);
      if (show) visible++;
    });
    noResults?.classList.toggle('is-visible', visible === 0);
  }));

  const share = $('.share-button');
  share?.addEventListener('click', async () => {
    const payload = { title: document.title.replace(' · Insight 221',''), url: location.href };
    try {
      if (navigator.share) await navigator.share(payload);
      else { await navigator.clipboard.writeText(location.href); share.textContent = 'Lien copié ✓'; setTimeout(() => share.textContent = 'Partager ↗', 1600); }
    } catch (_) {}
  });

  const progress = $('.reading-progress');
  if (progress) {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = `${Math.max(0,Math.min(100,(scrollY / max) * 100))}%`;
    };
    addEventListener('scroll', updateProgress, {passive:true});
    updateProgress();
  }

  const url = new URL(location.href);
  const query = url.searchParams.get('q');
  if (query) {
    openSearch().then(() => { searchInput.value = query; renderResults(query); });
  }
})();
