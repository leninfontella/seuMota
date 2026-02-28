/**
 * seuMota — perfil-mota.js
 * Disponibilidade interativa, edição inline de bio
 */

/* ─── AVAILABILITY DAYS TOGGLE ────────────────────── */
document.querySelectorAll('.avail-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    dot.classList.toggle('available');
    dot.textContent = dot.classList.contains('available') ? '✓' : '–';
  });
});

/* ─── EDIT PROFILE ────────────────────────────────── */
document.getElementById('editProfileBtn')?.addEventListener('click', () => {
  // Placeholder — would open edit modal or redirect to edit-profile page
  alert('Edição de perfil em breve! (conectar ao backend)');
});
