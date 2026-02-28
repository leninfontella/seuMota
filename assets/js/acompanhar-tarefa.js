/**
 * seuMota — acompanhar-tarefa.js
 * Simulação de progressão de status, pin animado e chat
 */

/* ─── STATUS SIMULATION ───────────────────────────── */
const STATUS_FLOW = [
  {
    stepId:      'stepAcaminho',
    etaTime:     '~5 min',
    etaSub:      'João Pedro está a 320m do mercado',
    statusTitle: 'A caminho do local',
    statusDesc:  'João Pedro saiu e está se deslocando até o Pão de Açúcar',
    topbar:      'João Pedro está a caminho do mercado',
    pinTop: '55%', pinLeft: '35%',
    delay: 0,
  },
  {
    stepId:      'stepChegou',
    etaTime:     'Chegou!',
    etaSub:      'João Pedro está no Pão de Açúcar agora',
    statusTitle: 'Mota chegou no local',
    statusDesc:  'João Pedro está no mercado e iniciará as compras em breve',
    topbar:      'João Pedro chegou no mercado',
    pinTop: '28%', pinLeft: '55%',
    delay: 8000,
  },
  {
    stepId:      'stepFazendo',
    etaTime:     '~15 min',
    etaSub:      'João Pedro está fazendo as compras',
    statusTitle: 'Realizando a tarefa',
    statusDesc:  'Coletando os itens da lista no Pão de Açúcar',
    topbar:      'João Pedro está comprando os itens',
    pinTop: '30%', pinLeft: '57%',
    delay: 15000,
  },
  {
    stepId:      'stepConcluido',
    etaTime:     'Concluído!',
    etaSub:      'Tarefa finalizada com sucesso',
    statusTitle: 'Tarefa concluída!',
    statusDesc:  'João Pedro marcou a tarefa como concluída',
    topbar:      'Tarefa concluída!',
    pinTop: '65%', pinLeft: '68%',
    delay: 28000,
  },
];

let currentStatusIdx = 0;

function applyStatus(s) {
  // Update step nodes
  const allSteps = ['stepAcaminho','stepChegou','stepFazendo','stepConcluido'];
  allSteps.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('active','done');
    if (id === s.stepId) el.classList.add('active');
    else if (i < allSteps.indexOf(s.stepId)) el.classList.add('done');
  });

  // ETA
  const etaTimeEl = document.getElementById('etaTime');
  const etaSubEl  = document.getElementById('etaSub');
  if (etaTimeEl) etaTimeEl.textContent = s.etaTime;
  if (etaSubEl)  etaSubEl.textContent  = s.etaSub;

  // Status badge
  const stTitle = document.getElementById('statusTitle');
  const stDesc  = document.getElementById('statusDesc');
  if (stTitle) stTitle.textContent = s.statusTitle;
  if (stDesc)  stDesc.textContent  = s.statusDesc;

  // Topbar
  const topbarStatus = document.getElementById('topbarStatus');
  if (topbarStatus) topbarStatus.textContent = s.topbar;

  // Move pin
  const pin = document.getElementById('motaPin');
  if (pin) { pin.style.top = s.pinTop; pin.style.left = s.pinLeft; }
}

// Apply initial status immediately
applyStatus(STATUS_FLOW[0]);

// Schedule remaining status transitions
STATUS_FLOW.forEach((s, i) => {
  if (i === 0) return;
  setTimeout(() => {
    applyStatus(s);
    currentStatusIdx = i;

    // On last step, open completion modal
    if (i === STATUS_FLOW.length - 1) {
      setTimeout(() => {
        document.getElementById('completeModal')?.classList.add('open');
      }, 1500);
    }
  }, s.delay);
});

/* ─── MODAL ───────────────────────────────────────── */
document.getElementById('skipReview')?.addEventListener('click', () => {
  window.location.href = 'historico-usuario.html';
});

document.getElementById('completeModal')?.addEventListener('click', e => {
  if (e.target === document.getElementById('completeModal')) {
    document.getElementById('completeModal').classList.remove('open');
  }
});

/* ─── CHAT ────────────────────────────────────────── */
const chatInput = document.getElementById('chatInput');
const chatSend  = document.getElementById('chatSend');
const chatBody  = document.getElementById('chatBody');

function sendMsg() {
  const text = chatInput?.value.trim();
  if (!text || !chatBody) return;

  const now  = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const msg  = document.createElement('div');
  msg.className = 'chat-msg from-me';
  msg.innerHTML = `${text}<div class="chat-msg-time">${now}</div>`;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
  chatInput.value = '';
  chatInput.focus();
}

chatSend?.addEventListener('click', sendMsg);
chatInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
});
