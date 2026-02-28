/**
 * seuMota — dashboard-mota.js
 * Online toggle, filtro de categorias, dispensar cards
 */

/* ─── ONLINE TOGGLE ───────────────────────────────── */
const toggle     = document.getElementById('onlineToggle');
const statusLabel = document.getElementById('statusLabel');
const statusDot   = document.getElementById('statusDot');

toggle?.addEventListener('change', () => {
  const on = toggle.checked;
  if (statusLabel) {
    statusLabel.className = 'online-toggle-status' + (on ? ' is-online' : '');
    statusLabel.innerHTML = `<div class="online-dot${on ? ' is-online' : ''}" id="statusDot"></div>${on ? 'Online' : 'Offline'}`;
  }
  const taskCount = document.getElementById('taskCount');
  if (taskCount) {
    taskCount.textContent = on
      ? '6 tarefas disponíveis a menos de 1,5km de você'
      : 'Você está offline. Ligue para ver novas tarefas.';
  }
  const feed = document.getElementById('taskFeed');
  if (feed) feed.style.opacity = on ? '1' : '0.4';
});

/* ─── FILTER CHIPS ────────────────────────────────── */
const chips = document.querySelectorAll('.filter-chip');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    const filter = chip.dataset.filter;
    const cards  = document.querySelectorAll('.feed-card');
    let visible  = 0;

    cards.forEach(card => {
      const cat = card.dataset.cat || '';
      const show = filter === 'all' || cat === filter;
      card.style.display = show ? 'block' : 'none';
      if (show) visible++;
    });

    const count = document.getElementById('taskCount');
    if (count) {
      count.textContent = visible > 0
        ? `${visible} tarefa${visible !== 1 ? 's' : ''} disponíve${visible !== 1 ? 'is' : 'l'} no filtro selecionado`
        : 'Nenhuma tarefa nesta categoria no momento';
    }
  });
});

/* ─── DECLINE / SKIP CARDS ────────────────────────── */
document.querySelectorAll('.btn-decline').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    e.preventDefault();
    const card = btn.closest('.feed-card');
    if (!card) return;
    card.style.transition = 'transform .3s, opacity .3s';
    card.style.transform  = 'translateX(60px)';
    card.style.opacity    = '0';
    setTimeout(() => card.remove(), 320);
  });
});
