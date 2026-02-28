/**
 * seuMota — historico-mota.js
 */
let activeFilter = 'all';
let searchQuery  = '';

/* ─── FILTER CHIPS ────────────────────────────────── */
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter;
    applyFilters();
  });
});

/* ─── SEARCH ──────────────────────────────────────── */
document.getElementById('motaHistSearch')?.addEventListener('input', e => {
  searchQuery = e.target.value.trim().toLowerCase();
  applyFilters();
});

/* ─── APPLY ───────────────────────────────────────── */
function applyFilters() {
  let visible = 0;
  document.querySelectorAll('.history-item').forEach(item => {
    const cat    = item.dataset.cat    || '';
    const status = item.dataset.status || '';
    const title  = item.dataset.title  || '';

    const matchFilter = activeFilter === 'all'
      || activeFilter === status
      || activeFilter === cat;
    const matchSearch = !searchQuery || title.includes(searchQuery);

    const show = matchFilter && matchSearch;
    item.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  // Month dividers
  document.querySelectorAll('.history-month-divider').forEach(div => {
    let next = div.nextElementSibling;
    let hasVisible = false;
    while (next && !next.classList.contains('history-month-divider')) {
      if (next.classList.contains('history-item') && next.style.display !== 'none') {
        hasVisible = true; break;
      }
      next = next.nextElementSibling;
    }
    div.style.display = hasVisible ? '' : 'none';
  });

  const empty = document.getElementById('motaHistEmpty');
  if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
}
