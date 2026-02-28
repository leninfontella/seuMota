/**
 * seuMota — dashboard-usuario.js
 * Interatividade do painel do Cliente
 */

/* ── Saudação personalizada por horário ── */
(function greetByTime() {
  const el = document.getElementById('greeting');
  if (!el) return;
  const h = new Date().getHours();
  const greet = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  el.textContent = greet + ', Ana! 👋';
})();

/* ── Quick-category highlight on hover ── */
document.querySelectorAll('.quick-cat').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-3px)';
    btn.style.transition = 'transform .2s';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ── Simulated live badge on active task ── */
(function pulseBadge() {
  const badge = document.querySelector('.badge-green');
  if (!badge) return;
  let on = true;
  setInterval(() => {
    badge.style.opacity = on ? '0.6' : '1';
    on = !on;
  }, 900);
})();

/* ── Task item ripple on click ── */
document.querySelectorAll('.task-item').forEach(item => {
  item.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;left:${e.offsetX}px;top:${e.offsetY}px;
      width:0;height:0;border-radius:50%;
      background:rgba(240,123,29,.15);
      transform:translate(-50%,-50%);
      animation:ripple .5s ease-out forwards;
      pointer-events:none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

/* ── Inject ripple keyframe once ── */
if (!document.getElementById('rippleStyle')) {
  const s = document.createElement('style');
  s.id = 'rippleStyle';
  s.textContent = '@keyframes ripple{to{width:200px;height:200px;opacity:0}}';
  document.head.appendChild(s);
}
