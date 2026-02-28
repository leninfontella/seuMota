/**
 * seuMota — main.js
 * Interações da landing page
 */

/* ─── DROPDOWN: close on outside click ──────────────── */
document.addEventListener('click', (e) => {
  const dropdown = document.querySelector('[style*="position: absolute"]');
  const button = document.querySelector('.nav-link-ghost');
  if (dropdown && !button?.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = 'none';
  }
});

/* ─── NAV: sticky shadow on scroll ──────────────── */
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
  } else {
    nav.style.boxShadow = 'none';
  }
});

/* ─── CHIPS: filtro de categoria (visual) ────────── */
const chips = document.querySelectorAll('.chip');

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('chip--active'));
    chip.classList.add('chip--active');
  });
});

/* ─── CARDS: animate on scroll (IntersectionObserver) ── */
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.step-card, .cat-card, .review-card, .stat-item').forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

/* ─── STATS: número animado ao entrar na viewport ── */
function animateCounter(el, target, duration = 1200) {
  const isDecimal = target.toString().includes('.');
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = eased * target;

    el.textContent = isDecimal
      ? current.toFixed(1)
      : Math.floor(current).toLocaleString('pt-BR');

    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString('pt-BR');
  };

  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    const raw = el.dataset.value;
    if (!raw) return;

    animateCounter(el, parseFloat(raw));
    statsObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-value]').forEach(el => {
  statsObserver.observe(el);
});
