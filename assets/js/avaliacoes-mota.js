/**
 * seuMota — avaliacoes-mota.js
 */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

/* ─── SCORE BARS ──────────────────────────────────── */
const BARS = [
  { stars: 5, count: 60 },
  { stars: 4, count: 5  },
  { stars: 3, count: 2  },
  { stars: 2, count: 0  },
  { stars: 1, count: 0  },
];

const barsEl = document.getElementById('scoreBars');
if (barsEl) {
  const max = Math.max(...BARS.map(b => b.count));
  barsEl.innerHTML = BARS.map(b => `
    <div class="score-bar-row">
      <span class="score-bar-label">${b.stars}</span>
      <div class="score-bar-track">
        <div class="score-bar-fill" style="width:0%" data-target="${Math.round(b.count / max * 100)}%"></div>
      </div>
      <span class="score-bar-count">${b.count}</span>
    </div>`
  ).join('');
  // Animate
  setTimeout(() => {
    barsEl.querySelectorAll('.score-bar-fill').forEach(bar => {
      bar.style.transition = 'width .8s cubic-bezier(.22,1,.36,1)';
      bar.style.width = bar.dataset.target;
    });
  }, 150);
}

/* ─── BADGE TALLY ─────────────────────────────────── */
const BADGES = [
  { icon: '⏰', label: 'Pontual',      count: 54 },
  { icon: '💬', label: 'Comunicativo', count: 48 },
  { icon: '💎', label: 'Cuidadoso',    count: 42 },
  { icon: '⚡', label: 'Rápido',       count: 38 },
  { icon: '😊', label: 'Educado',      count: 61 },
  { icon: '🤝', label: 'Confiável',    count: 57 },
];

const tallyEl = document.getElementById('badgeTally');
if (tallyEl) {
  tallyEl.innerHTML = BADGES.map(b => `
    <div class="badge-tally-item">
      <span>${b.icon}</span> ${b.label}
      <span class="badge-tally-count">${b.count}</span>
    </div>`
  ).join('');
}

/* ─── FILTER CHIPS ────────────────────────────────── */
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    filterReviews(chip.dataset.filter);
  });
});

function filterReviews(f) {
  let visible = 0;
  document.querySelectorAll('.review-card').forEach(card => {
    const stars = parseInt(card.dataset.stars);
    const hasTip = card.dataset.tip === 'true';
    let show = false;
    if (f === 'all')  show = true;
    else if (f === '5')   show = stars === 5;
    else if (f === '4')   show = stars === 4;
    else if (f === '3')   show = stars <= 3;
    else if (f === 'tip') show = hasTip;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  const empty = document.getElementById('reviewsEmpty');
  if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
}

/* ─── REPLY TOGGLE ────────────────────────────────── */
window.toggleReply = function(btn) {
  const area = btn.nextElementSibling;
  if (!area) return;
  const open = area.style.display === 'block';
  area.style.display = open ? 'none' : 'block';
  btn.textContent = open ? '↩️ Responder' : '✕ Cancelar';
  if (!open) area.querySelector('textarea')?.focus();
};

/* ─── SEND REPLY ──────────────────────────────────── */
window.sendReply = function(sendBtn) {
  const area   = sendBtn.closest('.review-reply-area');
  const text   = area?.querySelector('textarea')?.value.trim();
  const card   = sendBtn.closest('.review-card');
  const replyBtn = card?.querySelector('.review-reply-btn');

  if (!text) { showToast('⚠️ Escreva sua resposta primeiro'); return; }

  sendBtn.textContent = 'Enviando...';
  sendBtn.disabled = true;

  setTimeout(() => {
    // Remove input area and show saved reply
    area.style.display = 'none';
    replyBtn.style.display = 'none';

    const replyDiv = document.createElement('div');
    replyDiv.className = 'review-mota-reply';
    const now = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
    replyDiv.innerHTML = `<div class="review-mota-reply-label">Sua resposta · ${now}</div>${text}`;
    card.appendChild(replyDiv);

    showToast('✅ Resposta publicada!');
    sendBtn.textContent = 'Enviar resposta';
    sendBtn.disabled = false;
  }, 900);
};
