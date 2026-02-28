/**
 * seuMota — admin-tarefas.js
 * Task management: status tabs, search, cancel, toast
 */

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1E1B4B;color:white;padding:12px 20px;border-radius:12px;font-family:Nunito,sans-serif;font-size:.85rem;font-weight:800;z-index:999;animation:slideUp .3s ease';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.textContent = '', 3000);
}

let activeStatusFilter = 'all';

function filterTasks(btn) {
  document.querySelectorAll('.status-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  activeStatusFilter = btn.dataset.filter;
  applyFilters();
}

function searchTasks() {
  applyFilters();
}

function applyFilters() {
  const q    = document.getElementById('taskSearch')?.value.toLowerCase() || '';
  const rows = document.querySelectorAll('#tasksTableBody tr');
  let visible = 0;

  rows.forEach(row => {
    const text      = row.textContent.toLowerCase();
    const rowStatus = row.dataset.status || '';
    const matchQ = !q || text.includes(q);
    const matchS = activeStatusFilter === 'all' || rowStatus === activeStatusFilter;
    row.style.display = matchQ && matchS ? '' : 'none';
    if (matchQ && matchS) visible++;
  });

  const el = document.getElementById('taskCount');
  if (el) el.textContent = `${visible} tarefa${visible !== 1 ? 's' : ''}`;
}

function cancelTask(btn, id) {
  if (!confirm(`Cancelar tarefa ${id}? O cliente será notificado e reembolsado.`)) return;
  const row = btn.closest('tr');
  if (!row) return;
  row.dataset.status = 'cancelada';
  const pill = row.querySelector('.pill');
  if (pill) { pill.textContent = 'Cancelada'; pill.className = 'pill pill-cancelled'; }
  const priceCell = row.querySelectorAll('td')[4];
  if (priceCell) priceCell.style.textDecoration = 'line-through';
  const actions = btn.closest('.row-actions');
  if (actions) actions.innerHTML = `<button class="row-btn" onclick="showToast('📋 Abrindo tarefa…')">Ver</button>`;
  showToast(`🗑️ Tarefa ${id} cancelada. Reembolso em processamento.`);
}

window.filterTasks  = filterTasks;
window.searchTasks  = searchTasks;
window.cancelTask   = cancelTask;
window.showToast    = showToast;
