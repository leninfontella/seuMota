/**
 * seuMota — historico-usuario.js
 * Filtros por status/categoria e busca em tempo real
 */

const allItems   = document.querySelectorAll('.hist-item');
const emptyState = document.getElementById('emptyState');

let activeFilter = 'all';
let searchQuery  = '';

function applyFilters() {
  let visible = 0;

  allItems.forEach(item => {
    const cat    = item.dataset.cat    || '';
    const status = item.dataset.status || '';
    const title  = (item.dataset.title || '').toLowerCase();

    const matchFilter =
      activeFilter === 'all'      ? true :
      activeFilter === 'concluida'? status === 'concluida' :
      activeFilter === 'cancelada'? status === 'cancelada' :
      cat === activeFilter;

    const matchSearch = !searchQuery || title.includes(searchQuery.toLowerCase());

    const show = matchFilter && matchSearch;
    item.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  // Show/hide month dividers
  document.querySelectorAll('.month-divider').forEach(divider => {
    const list = divider.nextElementSibling;
    if (!list) return;
    const hasVisible = [...list.querySelectorAll('.hist-item')].some(i => i.style.display !== 'none');
    divider.style.display = hasVisible ? '' : 'none';
  });

  // Empty state
  if (emptyState) emptyState.classList.toggle('show', visible === 0);
}

/* ─── FILTER CHIPS ────────────────────────────────── */
document.querySelectorAll('.hist-filter').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.hist-filter').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter;
    applyFilters();
  });
});

/* ─── LIVE SEARCH ─────────────────────────────────── */
document.getElementById('histSearch')?.addEventListener('input', e => {
  searchQuery = e.target.value.trim();
  applyFilters();
});
