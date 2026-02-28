/**
 * seuMota — configuracoes.js
 */

/* ─── TOAST ───────────────────────────────────────── */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

/* ─── SECTION NAV ─────────────────────────────────── */
document.querySelectorAll('.config-nav-item').forEach(item => {
  item.addEventListener('click', () => {
    // Update nav active state
    document.querySelectorAll('.config-nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // Show target section
    const target = item.dataset.target;
    document.querySelectorAll('.config-section').forEach(s => s.classList.remove('active'));
    const sec = document.getElementById(`sec-${target}`);
    if (sec) sec.classList.add('active');
  });
});

/* ─── THEME BUTTONS ───────────────────────────────── */
document.querySelectorAll('#themeRow .theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#themeRow .theme-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showToast(`${btn.textContent.trim()} selecionado`);
  });
});

/* ─── TOGGLES WITH FEEDBACK ───────────────────────── */
document.querySelectorAll('.toggle-switch input[type="checkbox"]').forEach(chk => {
  chk.addEventListener('change', () => {
    const label  = chk.closest('.config-row')?.querySelector('.config-row-title')?.textContent || '';
    const state  = chk.checked ? 'ativado' : 'desativado';
    if (label) showToast(`${label}: ${state}`);
  });
});

/* ─── SELECTS WITH FEEDBACK ───────────────────────── */
document.querySelectorAll('.config-select').forEach(sel => {
  sel.addEventListener('change', () => {
    const label = sel.closest('.config-row')?.querySelector('.config-row-title')?.textContent || '';
    if (label) showToast(`✅ ${label} atualizado`);
  });
});

/* ─── DEVICE REMOVE ───────────────────────────────── */
document.querySelectorAll('.device-remove').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.device-card');
    const name = card?.querySelector('.device-name')?.textContent || 'Dispositivo';
    if (confirm(`Encerrar sessão: ${name}?`)) {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.96)';
      card.style.transition = 'all .3s';
      setTimeout(() => card.remove(), 320);
      showToast('🔒 Sessão encerrada');
    }
  });
});
