/**
 * seuMota — admin-motas.js
 * Mota management: filter, verify, suspend, toast
 */

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1E1B4B;color:white;padding:12px 20px;border-radius:12px;font-family:Nunito,sans-serif;font-size:.85rem;font-weight:800;z-index:999;animation:slideUp .3s ease';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.textContent = '', 3000);
}

function filterMotas() {
  const q      = document.getElementById('motaSearch')?.value.toLowerCase() || '';
  const status = document.getElementById('motaStatusFilter')?.value || 'all';
  const rows   = document.querySelectorAll('#motasTableBody tr');
  let visible  = 0;

  rows.forEach(row => {
    const text      = row.textContent.toLowerCase();
    const rowStatus = row.dataset.status || '';
    const matchQ = !q || text.includes(q);
    const matchS = status === 'all' || rowStatus === status;
    row.style.display = matchQ && matchS ? '' : 'none';
    if (matchQ && matchS) visible++;
  });

  const el = document.getElementById('motaCount');
  if (el) el.textContent = `${visible} Mota${visible !== 1 ? 's' : ''}`;
}

function verifyMota(btn, name) {
  const row = btn.closest('tr');
  if (!row) return;
  btn.textContent = 'Verificando…';
  btn.disabled = true;
  setTimeout(() => {
    row.dataset.status = 'ativo';
    const pill = row.querySelector('.pill');
    if (pill) { pill.textContent = 'Verificado'; pill.className = 'pill pill-verified'; }
    // Add verified badge to avatar
    const avatar = row.querySelector('.user-cell-avatar');
    if (avatar && !avatar.querySelector('.verified-badge')) {
      const badge = document.createElement('div');
      badge.className = 'verified-badge';
      badge.textContent = '✓';
      avatar.appendChild(badge);
    }
    // Replace actions
    const actions = btn.closest('.row-actions');
    if (actions) {
      actions.innerHTML = `
        <button class="row-btn row-btn-purple" onclick="showToast('👤 Abrindo perfil…')">Ver</button>
        <button class="row-btn row-btn-danger" onclick="suspendMota(this,'${name}')">Suspender</button>`;
    }
    showToast(`✅ ${name} verificado e ativado.`);
  }, 900);
}

function suspendMota(btn, name) {
  if (!confirm(`Suspender ${name}? O Mota não poderá aceitar novas tarefas.`)) return;
  const row = btn.closest('tr');
  if (!row) return;
  row.dataset.status = 'suspenso';
  const pill = row.querySelector('.pill');
  if (pill) { pill.textContent = 'Suspenso'; pill.className = 'pill pill-suspended'; }
  const actions = btn.closest('.row-actions');
  if (actions) {
    actions.innerHTML = `
      <button class="row-btn row-btn-purple" onclick="showToast('👤 Abrindo perfil…')">Ver</button>
      <button class="row-btn row-btn-success" onclick="verifyMota(this,'${name}')">Reativar</button>`;
  }
  showToast(`⛔ ${name} suspenso.`);
}

window.filterMotas  = filterMotas;
window.verifyMota   = verifyMota;
window.suspendMota  = suspendMota;
window.showToast    = showToast;
