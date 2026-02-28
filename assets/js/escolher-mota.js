/**
 * seuMota — escolher-mota.js
 */

const modal      = document.getElementById('confirmModal');
const chosenName = document.getElementById('chosenName');
const confirmYes = document.getElementById('confirmYes');
const confirmNo  = document.getElementById('confirmNo');

const NAMES = {
  joao:     'João Pedro',
  carlos:   'Carlos Mendes',
  fernanda: 'Fernanda Lima',
  rodrigo:  'Rodrigo Santos',
};

let selectedMota = null;

/* ─── CHOOSE BUTTONS ──────────────────────────────── */
document.querySelectorAll('.btn-choose').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    selectedMota = btn.dataset.mota;
    if (chosenName) chosenName.textContent = NAMES[selectedMota] || selectedMota;
    modal?.classList.add('open');
  });
});

/* Clicking the card itself also opens modal */
document.querySelectorAll('.mota-choice-card').forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('.btn-choose')) return;
    selectedMota = card.dataset.mota;
    if (chosenName) chosenName.textContent = NAMES[selectedMota] || selectedMota;
    modal?.classList.add('open');
  });
});

/* ─── MODAL ACTIONS ───────────────────────────────── */
confirmNo?.addEventListener('click', () => modal?.classList.remove('open'));

modal?.addEventListener('click', e => {
  if (e.target === modal) modal.classList.remove('open');
});

confirmYes?.addEventListener('click', () => {
  confirmYes.textContent = 'Confirmando...';
  confirmYes.disabled    = true;

  // Simulate POST /tasks/:id/match — assign mota
  setTimeout(() => {
    window.location.href = 'acompanhar-tarefa.html';
  }, 1200);
});

/* ─── REAL-TIME COUNT SIMULATION ─────────────────── */
// Simulate a new mota joining after 5s
let newMotaJoined = false;
setTimeout(() => {
  if (newMotaJoined) return;
  newMotaJoined = true;
  const sub = document.getElementById('topbarSub');
  if (sub) sub.textContent = '5 motas aceitaram sua tarefa — escolha um!';
}, 5000);
