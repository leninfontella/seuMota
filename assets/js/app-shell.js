/**
 * seuMota — app-shell.js
 * Comportamentos compartilhados por todas as páginas internas:
 * sidebar mobile, overlay, active nav, topbar shadow
 */

/* ─── SIDEBAR MOBILE TOGGLE ───────────────────────── */
const sidebar  = document.getElementById('sidebar');
const overlay  = document.getElementById('sidebarOverlay');
const navToggle = document.getElementById('navToggle');

navToggle?.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
});

overlay?.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
});

// Close sidebar on ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('active');
  }
});

/* ─── TOPBAR SHADOW ON SCROLL ─────────────────────── */
const topbar = document.querySelector('.topbar');

window.addEventListener('scroll', () => {
  if (!topbar) return;
  topbar.style.boxShadow = window.scrollY > 4
    ? '0 4px 20px rgba(0,0,0,0.07)'
    : 'none';
}, { passive: true });

/* ─── ACTIVE NAV HIGHLIGHT ─────────────────────────── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.nav-item').forEach(item => {
  const href = item.getAttribute('href') || '';
  if (href && href !== '#' && currentPage.includes(href.replace('.html', ''))) {
    // Already handled in HTML via class, but this keeps it dynamic
    // if page links are ever changed programmatically
  }
});

/* ─── USER MENU BUTTON ─────────────────────────────── */
const userMenuBtn = document.querySelector('.user-menu-btn');

if (userMenuBtn) {
  userMenuBtn.addEventListener('click', e => {
    e.stopPropagation();
    // Placeholder: would open a dropdown
    const items = ['👤 Meu perfil', '⚙️ Configurações', '🚪 Sair'];
    console.log('User menu:', items);
    // TODO: implement dropdown component
  });
}
