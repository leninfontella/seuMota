/**
 * seuMota — favoritos.js
 */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

function updateCount() {
  const cards = document.querySelectorAll('.fav-card');
  const count = document.getElementById('favCount');
  const empty = document.getElementById('favEmpty');
  const grid  = document.getElementById('favGrid');
  if (count) count.textContent = `${cards.length} favorito${cards.length !== 1 ? 's' : ''}`;
  if (empty) empty.style.display = cards.length === 0 ? 'block' : 'none';
  if (grid)  grid.style.display  = cards.length === 0 ? 'none' : '';
}

/* ─── REMOVE FAVORITE ─────────────────────────────── */
window.removeFav = function(btn, id, name) {
  if (!confirm(`Remover ${name} dos favoritos?`)) return;
  const card = btn.closest('.fav-card');
  if (!card) return;
  card.style.transition = 'all .3s ease';
  card.style.opacity = '0';
  card.style.transform = 'scale(0.95)';
  setTimeout(() => {
    card.remove();
    showToast(`💔 ${name} removido dos favoritos`);
    updateCount();
  }, 300);
};

/* ─── SORT ────────────────────────────────────────── */
document.getElementById('favSort')?.addEventListener('change', function() {
  const grid  = document.getElementById('favGrid');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.fav-card')];

  cards.sort((a, b) => {
    if (this.value === 'rating') return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
    if (this.value === 'name')   return a.dataset.name.localeCompare(b.dataset.name, 'pt-BR');
    return new Date(b.dataset.added) - new Date(a.dataset.added); // recent
  });

  cards.forEach(c => grid.appendChild(c));
  showToast('✅ Ordenação aplicada');
});

updateCount();
