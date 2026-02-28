/**
 * seuMota — avaliar-mota.js
 * Estrelas, badges, favorito, gorjeta e envio
 */

const STAR_LABELS = ['', 'Ruim 😞', 'Regular 😐', 'Bom 👍', 'Ótimo 😄', 'Excelente! ⭐'];
let selectedStars  = 0;
let selectedBadges = new Set();
let selectedTip    = 0;
let isFav          = false;

/* ─── STAR RATING ─────────────────────────────────── */
const starBtns  = document.querySelectorAll('.star-btn');
const starLabel = document.getElementById('starLabel');
const badgeSection = document.getElementById('badgeSection');

starBtns.forEach(btn => {
  btn.addEventListener('mouseover', () => highlightStars(Number(btn.dataset.star)));
  btn.addEventListener('mouseout',  () => highlightStars(selectedStars));
  btn.addEventListener('click', () => {
    selectedStars = Number(btn.dataset.star);
    highlightStars(selectedStars);
    if (starLabel) starLabel.textContent = STAR_LABELS[selectedStars];

    // Show rest of form
    if (badgeSection) {
      badgeSection.style.display = 'block';
      badgeSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
});

function highlightStars(n) {
  starBtns.forEach((btn, i) => {
    btn.classList.toggle('lit', i < n);
    btn.style.filter = i < n ? 'none' : 'grayscale(1) opacity(0.3)';
    btn.style.transform = i < n ? 'scale(1.1)' : 'scale(1)';
  });
}

/* ─── BADGES ──────────────────────────────────────── */
document.querySelectorAll('.badge-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    const key = pill.dataset.badge;
    if (selectedBadges.has(key)) {
      selectedBadges.delete(key);
      pill.classList.remove('selected');
    } else {
      selectedBadges.add(key);
      pill.classList.add('selected');
    }
  });
});

/* ─── FAVORITE TOGGLE ─────────────────────────────── */
const favRow    = document.getElementById('favRow');
const favToggle = document.getElementById('favToggle');

favRow?.addEventListener('click', () => {
  isFav = !isFav;
  if (favToggle) {
    favToggle.textContent = isFav ? '✓' : '';
    favToggle.style.background     = isFav ? 'var(--orange)' : 'var(--white)';
    favToggle.style.borderColor    = isFav ? 'var(--orange)' : 'var(--sand)';
    favToggle.style.color          = isFav ? 'white' : '';
  }
  if (favRow) {
    favRow.style.borderColor  = isFav ? 'var(--orange)' : 'var(--sand)';
    favRow.style.background   = isFav ? 'var(--orange-soft)' : 'var(--white)';
  }
});

/* ─── TIP SELECTION ───────────────────────────────── */
document.querySelectorAll('.tip-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.tip-opt').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    selectedTip = parseInt(opt.dataset.tip) || 0;
  });
});

/* ─── SUBMIT ──────────────────────────────────────── */
document.getElementById('submitReview')?.addEventListener('click', () => {
  if (selectedStars === 0) {
    if (starLabel) {
      starLabel.textContent = 'Selecione pelo menos 1 estrela!';
      starLabel.style.color = '#EF4444';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const btn = document.getElementById('submitReview');
  btn.textContent = 'Enviando...';
  btn.disabled    = true;

  // Simulate POST /reviews
  setTimeout(() => {
    document.getElementById('badgeSection').style.display  = 'none';
    document.querySelector('.review-hero').style.display   = 'none';
    document.getElementById('reviewSuccess').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 1400);
});
