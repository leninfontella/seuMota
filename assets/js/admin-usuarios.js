/**
 * seuMota — admin-usuarios.js
 * User management: filter, ban, activate, toast
 */

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1E1B4B;color:white;padding:12px 20px;border-radius:12px;font-family:Nunito,sans-serif;font-size:.85rem;font-weight:800;z-index:999;animation:slideUp .3s ease';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.textContent = '', 3000);
}

function filterUsers() {
  const q      = document.getElementById('userSearch')?.value.toLowerCase() || '';
  const status = document.getElementById('statusFilter')?.value || 'all';
  const rows   = document.querySelectorAll('#usersTableBody tr');
  let visible  = 0;

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    const rowStatus = row.dataset.status || '';
    const matchQ = !q || text.includes(q);
    const matchS = status === 'all' || rowStatus === status;
    row.style.display = matchQ && matchS ? '' : 'none';
    if (matchQ && matchS) visible++;
  });

  const el = document.getElementById('userCount');
  if (el) el.textContent = `${visible} usuário${visible !== 1 ? 's' : ''}`;
}

function banUser(btn, name) {
  if (!confirm(`Banir ${name}? O usuário perderá acesso imediatamente.`)) return;
  const row = btn.closest('tr');
  if (!row) return;
  row.dataset.status = 'banido';
  const pill = row.querySelector('.pill');
  if (pill) { pill.textContent = 'Banido'; pill.className = 'pill pill-banned'; }
  btn.textContent = 'Desbanir';
  btn.classList.replace('row-btn-danger', 'row-btn-success');
  btn.onclick = () => activateUser(btn, name);
  showToast(`🚫 ${name} banido com sucesso.`);
}

function activateUser(btn, name) {
  const row = btn.closest('tr');
  if (!row) return;
  row.dataset.status = 'ativo';
  const pill = row.querySelector('.pill');
  if (pill) { pill.textContent = 'Ativo'; pill.className = 'pill pill-active'; }
  btn.textContent = 'Banir';
  btn.classList.replace('row-btn-success', 'row-btn-danger');
  btn.onclick = () => banUser(btn, name);
  showToast(`✅ ${name} reativado com sucesso.`);
}

window.filterUsers  = filterUsers;
window.banUser      = banUser;
window.activateUser = activateUser;
window.showToast    = showToast;
