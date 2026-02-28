/**
 * seuMota — notificacoes.js
 * Abas, marcar como lida, dispensar, filtro por tipo
 */

let unreadCount = document.querySelectorAll('.notif-item.unread').length;

/* ─── UPDATE COUNT LABEL ──────────────────────────── */
function updateCountLabel() {
  const label = document.getElementById('notifCount');
  if (label) {
    label.textContent = unreadCount > 0
      ? `${unreadCount} não ${unreadCount === 1 ? 'lida' : 'lidas'}`
      : 'Tudo em dia!';
  }
  const tabCount = document.getElementById('tabCountAll');
  if (tabCount) {
    tabCount.textContent = unreadCount;
    tabCount.style.display = unreadCount > 0 ? '' : 'none';
  }
}

/* ─── MARK INDIVIDUAL AS READ ─────────────────────── */
document.querySelectorAll('.notif-item').forEach(item => {
  item.addEventListener('click', () => {
    if (item.classList.contains('unread')) {
      item.classList.remove('unread');
      unreadCount = Math.max(0, unreadCount - 1);
      updateCountLabel();
    }
  });
});

/* ─── MARK ALL READ ───────────────────────────────── */
document.getElementById('markAllRead')?.addEventListener('click', () => {
  document.querySelectorAll('.notif-item.unread').forEach(item => {
    item.classList.remove('unread');
  });
  unreadCount = 0;
  updateCountLabel();
});

/* ─── TABS ────────────────────────────────────────── */
document.querySelectorAll('.notif-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.notif-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const type = tab.dataset.tab;
    const items = document.querySelectorAll('.notif-item');
    let visible = 0;

    items.forEach(item => {
      const show = type === 'all' || item.dataset.type === type;
      item.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    // Show/hide dividers
    document.querySelectorAll('.notif-divider').forEach(div => {
      const next = div.nextElementSibling;
      const hasVisible = next && [...next.parentElement.querySelectorAll(
        `.notif-item[data-type="${type}"]`
      )].some(el => el.style.display !== 'none');
      div.style.display = (type === 'all' || hasVisible) ? '' : 'none';
    });

    const empty = document.getElementById('notifEmpty');
    if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
  });
});

// Initialize
updateCountLabel();
