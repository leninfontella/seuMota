/**
 * seuMota — tarefa-em-andamento.js
 * Progressão de etapas, chat simulado, modal de conclusão
 */

/* ─── STEP PROGRESSION ────────────────────────────── */
const steps = ['going', 'arrived', 'doing', 'done'];
const stepLabels = [
  { btn: '📍 Confirmar chegada no local', title: 'Chegou no local', next: 'arrived' },
  { btn: '⚙️ Iniciar tarefa',             title: 'Realizando a tarefa', next: 'doing'   },
  { btn: '✅ Marcar como concluída',       title: null,                  next: 'done'    },
];

let currentStepIdx = 0;
const mainBtn = document.getElementById('mainActionBtn');

const getStepEl = id => document.getElementById(`step-${id}`);

function advanceStep() {
  if (currentStepIdx >= stepLabels.length) return;

  const current = stepLabels[currentStepIdx];

  // Mark current step as done
  const currentStepEl = getStepEl(steps[currentStepIdx + 1]);
  const prevStepEl    = currentStepIdx === 0
    ? getStepEl('going')
    : getStepEl(steps[currentStepIdx]);

  if (prevStepEl) {
    prevStepEl.classList.remove('active');
    prevStepEl.classList.add('done');
    const dot = prevStepEl.querySelector('.timeline-dot');
    if (dot) dot.textContent = '✓';
  }

  currentStepIdx++;

  if (currentStepIdx >= stepLabels.length) {
    // Open completion modal
    document.getElementById('completeModal')?.classList.add('open');
    if (mainBtn) {
      mainBtn.textContent = '✅ Tarefa concluída!';
      mainBtn.disabled    = true;
    }
    return;
  }

  // Activate next step
  if (currentStepEl) {
    currentStepEl.classList.add('active');
    const dot = currentStepEl.querySelector('.timeline-dot');
    if (dot) {
      const icons = ['📍', '⚙️', '✅'];
      dot.textContent = icons[currentStepIdx - 1] || '●';
    }
  }

  // Update button
  if (mainBtn) mainBtn.textContent = stepLabels[currentStepIdx]?.btn || '✅ Concluir';
}

mainBtn?.addEventListener('click', advanceStep);

/* ─── COMPLETION MODAL ────────────────────────────── */
const completeModal = document.getElementById('completeModal');
const completeYes   = document.getElementById('completeYes');
const completeNo    = document.getElementById('completeNo');

completeNo?.addEventListener('click', () => {
  completeModal?.classList.remove('open');
  if (mainBtn) {
    mainBtn.textContent = '✅ Marcar como concluída';
    mainBtn.disabled    = false;
    currentStepIdx      = stepLabels.length - 1;
  }
});

completeModal?.addEventListener('click', e => {
  if (e.target === completeModal) completeModal.classList.remove('open');
});

completeYes?.addEventListener('click', () => {
  completeYes.textContent = 'Aguardando confirmação do cliente...';
  completeYes.disabled    = true;

  // Simulate server + client confirmation
  setTimeout(() => {
    completeModal.classList.remove('open');
    // Show success banner
    const banner = document.querySelector('.task-banner');
    if (banner) {
      banner.style.background = 'linear-gradient(135deg, #0F2318 0%, #1A3A28 100%)';
      banner.querySelector('h3').textContent = '🎉 Tarefa concluída com sucesso!';
      banner.querySelector('p').textContent  = 'Aguarde a avaliação do cliente. R$ 25 creditados.';
    }
    // Redirect after brief celebration
    setTimeout(() => {
      window.location.href = 'dashboard-mota.html';
    }, 2500);
  }, 2000);
});

/* ─── SIMPLE CHAT ─────────────────────────────────── */
const chatInput   = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatMessages = document.getElementById('chatMessages');

function sendMessage() {
  const text = chatInput?.value.trim();
  if (!text || !chatMessages) return;

  const msg = document.createElement('div');
  msg.className = 'chat-msg from-mota';
  msg.innerHTML = `${text}<div class="chat-msg-time">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>`;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  chatInput.value = '';
  chatInput.focus();
}

chatSendBtn?.addEventListener('click', sendMessage);
chatInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
