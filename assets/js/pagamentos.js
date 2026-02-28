/**
 * seuMota — pagamentos.js
 */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

/* ─── FILTER CHIPS ────────────────────────────────── */
document.querySelectorAll('.tx-filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.tx-filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    filterTx(chip.dataset.filter);
  });
});

function filterTx(type) {
  let visible = 0;
  document.querySelectorAll('.tx-item').forEach(item => {
    const show = type === 'all' || item.dataset.type === type;
    item.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  const empty = document.getElementById('txEmpty');
  if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
}

/* ─── REMOVE PAYMENT METHOD ───────────────────────── */
window.removeMethod = function(id, label) {
  if (!confirm(`Remover ${label}?`)) return;
  const el = document.getElementById(id);
  if (!el) return;
  el.style.transition = 'all .3s';
  el.style.opacity = '0';
  el.style.transform = 'scale(0.96)';
  setTimeout(() => { el.remove(); showToast(`🗑️ ${label} removido`); }, 320);
};

/* ─── COPY REFERRAL CODE ──────────────────────────── */
window.copyCode = function() {
  navigator.clipboard?.writeText('ANAPAULA10').catch(() => {});
  showToast('📋 Código copiado: ANAPAULA10');
};
