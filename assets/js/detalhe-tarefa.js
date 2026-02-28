/**
 * seuMota — detalhe-tarefa.js
 * Countdown timer, modal de aceite, redirecionamento
 */

/* ─── EXPIRY COUNTDOWN ────────────────────────────── */
const timerEl = document.getElementById('expiryTimer');
let seconds   = 14 * 60 + 32; // 14:32

const tick = () => {
  if (!timerEl) return;
  if (seconds <= 0) {
    timerEl.textContent = '00:00';
    timerEl.style.color = '#EF4444';
    clearInterval(interval);
    return;
  }
  seconds--;
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  timerEl.textContent = `${m}:${s}`;

  if (seconds < 300) {
    timerEl.style.color = '#EF4444';
  }
};

const interval = setInterval(tick, 1000);

/* ─── ACCEPT FLOW ─────────────────────────────────── */
const modal      = document.getElementById('confirmModal');
const acceptBtn  = document.getElementById('acceptBtn');
const declineBtn = document.getElementById('declineBtn');
const confirmYes = document.getElementById('confirmYes');
const confirmNo  = document.getElementById('confirmNo');

acceptBtn?.addEventListener('click', () => {
  modal?.classList.add('open');
});

confirmNo?.addEventListener('click', () => {
  modal?.classList.remove('open');
});

modal?.addEventListener('click', e => {
  if (e.target === modal) modal.classList.remove('open');
});

confirmYes?.addEventListener('click', () => {
  confirmYes.textContent = 'Aceitando...';
  confirmYes.disabled = true;

  // Simulate API call — POST /tasks/:id/accept
  setTimeout(() => {
    window.location.href = 'tarefa-em-andamento.html';
  }, 1200);
});

/* ─── DECLINE ─────────────────────────────────────── */
declineBtn?.addEventListener('click', () => {
  window.location.href = 'dashboard-mota.html';
});
