/**
 * seuMota — aguardando-mota.js
 * Live waiting room: offer feed, timers, counters
 */

/* ── MOTA POOL (simula WebSocket feed) ── */
const MOTAS = [
  { name:'João Pedro',  emoji:'🧑', rating:'4.9', tasks:67, cats:['Mercado','Banco'],    delay:4000  },
  { name:'Carlos M.',   emoji:'👨', rating:'4.8', tasks:43, cats:['Farmácia','Mercado'], delay:9000  },
  { name:'Fernanda L.', emoji:'👩', rating:'4.7', tasks:38, cats:['Mercado','Lixo'],     delay:15000 },
  { name:'Diego A.',    emoji:'🧔', rating:'4.9', tasks:55, cats:['Banco','Correios'],   delay:22000 },
];

let offerCount = 0;

/* ── BUMP ANIMATION ── */
function bumpCounter(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = val;
  el.classList.remove('bump');
  void el.offsetWidth; // reflow to restart animation
  el.classList.add('bump');
}

/* ── ADD OFFER CARD TO FEED ── */
function addOffer(mota) {
  // Remove empty state
  const empty = document.getElementById('feedEmpty');
  if (empty) empty.remove();

  offerCount++;
  bumpCounter('offerCount', offerCount);

  const sidebarCount = document.getElementById('sidebarCount');
  if (sidebarCount) sidebarCount.textContent = offerCount;

  // Enable choose button after first offer
  const btn  = document.getElementById('chooseBtn');
  const hint = document.getElementById('chooseHint');
  if (btn) btn.disabled = false;
  if (hint) {
    hint.textContent = offerCount === 1
      ? `${offerCount} Mota disponível — clique para escolher`
      : `${offerCount} Motas disponíveis — escolha o melhor!`;
    hint.style.color = '#16A34A';
  }

  // Build card
  const item = document.createElement('div');
  item.className = 'offer-item';
  item.innerHTML = `
    <div class="offer-avatar">
      ${mota.emoji}
      <div class="offer-online"></div>
    </div>
    <div class="offer-info">
      <div class="offer-name">${mota.name}</div>
      <div class="offer-rating"><span class="stars">★</span> ${mota.rating} · ${mota.tasks} tarefas</div>
      <div class="offer-cats">
        ${mota.cats.map(c => `<span class="offer-cat">${c}</span>`).join('')}
      </div>
      <div class="offer-time">Agora</div>
    </div>
    <div class="offer-actions">
      <button class="offer-quick-view" onclick="window.location.href='escolher-mota.html'">Ver perfil</button>
    </div>`;

  const list = document.getElementById('offerList');
  if (list) list.insertBefore(item, list.firstChild);

  // Toast notification
  showOfferToast(mota);

  // Update feed timestamp
  const ts = document.getElementById('feedTimestamp');
  if (ts) {
    ts.textContent = 'Atualizado agora';
    setTimeout(() => { ts.textContent = 'Há poucos segundos'; }, 3000);
  }
}

/* ── TOAST ── */
function showOfferToast(mota) {
  const toast = document.getElementById('offerToast');
  const avatar = document.getElementById('toastAvatar');
  const name   = document.getElementById('toastName');
  if (!toast) return;
  if (avatar) avatar.textContent = mota.emoji;
  if (name)   name.textContent   = mota.name;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ── ELAPSED TIMER ── */
let seconds = 0;
setInterval(() => {
  seconds++;
  const m  = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s  = String(seconds % 60).padStart(2, '0');
  const el = document.getElementById('elapsedTimer');
  if (el) el.textContent = `${m}:${s}`;
}, 1000);

/* ── EXPIRY COUNTDOWN ── */
let expiryMins = 45;
setInterval(() => {
  if (expiryMins > 0) {
    expiryMins--;
    const el = document.getElementById('expiryCount');
    if (el) {
      el.textContent = expiryMins;
      if (expiryMins <= 5) el.style.color = '#EF4444';
    }
  }
}, 60000);

/* ── VIEW COUNT SIMULATION ── */
let views = 1;
setInterval(() => {
  if (Math.random() > 0.5) {
    views++;
    bumpCounter('viewCount', views);
  }
}, 3000);

/* ── CANCEL ── */
function confirmCancel() {
  if (confirm('Cancelar a tarefa? Nenhum Mota será cobrado.')) {
    window.location.href = 'dashboard-usuario.html';
  }
}

/* ── SCHEDULE MOTAS ── */
MOTAS.forEach(mota => setTimeout(() => addOffer(mota), mota.delay));

// Expose for inline onclick
window.confirmCancel = confirmCancel;
