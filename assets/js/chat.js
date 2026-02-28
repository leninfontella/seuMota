/**
 * seuMota — chat.js
 * Troca de conversa, envio de mensagens, indicador de digitação, respostas automáticas
 */

/* ─── CONVERSATION DATA ───────────────────────────── */
const CONVS = {
  joao: {
    name:   'João Pedro',
    avatar: '🧑',
    status: '● Online · Realizando sua tarefa',
    task:   '🛒 Compras no mercado — lista pequena · R$ 25',
    messages: [
      { from: 'them', text: 'Oi, Ana! Acabei de sair. Estou a caminho do mercado. 👋', time: '13:46' },
      { from: 'me',   text: 'Oi João! Obrigada. O iogurte pode ser Natural Grego Activia se não tiver o Danone. 😊', time: '13:48' },
      { from: 'them', text: 'Entendido! Anotado aqui. Em uns 5 minutinhos chego lá.', time: '13:49' },
      { from: 'them', text: 'Já cheguei no mercado! 🛒', time: '13:54' },
    ],
    autoReplies: [
      'Estou coletando os itens agora 🛒',
      'Quase pronto! Só falta o pão de forma.',
      'Tudo certo por aqui. A caminho da entrega em alguns minutinhos! 🏍️',
    ],
  },
  carlos: {
    name:   'Carlos Mendes',
    avatar: '👨',
    status: '● Offline · visto às 13:40',
    task:   '🏦 Pagar boleto na lotérica · R$ 15',
    messages: [
      { from: 'them', text: 'Oi! Vi sua tarefa. Posso passar às 15h, tudo bem?', time: '13:40' },
    ],
    autoReplies: [
      'Ótimo! Estarei lá às 15h pontualmente.',
      'Confirmado, até logo! 👍',
    ],
  },
  fernanda: {
    name:   'Fernanda Lima',
    avatar: '👩',
    status: '● Online',
    task:   '💊 Buscar remédio na farmácia · R$ 18',
    messages: [
      { from: 'them', text: 'Remédio entregue! Espero que melhore logo. Até mais 😊', time: 'ontem' },
      { from: 'me',   text: 'Muito obrigada, Fernanda! Serviço impecável! ⭐', time: 'ontem' },
    ],
    autoReplies: [
      'Obrigada pela avaliação! 🥰',
      'Quando precisar é só chamar!',
    ],
  },
  rodrigo: {
    name:   'Rodrigo Santos',
    avatar: '🧔',
    status: '● Offline · visto seg',
    task:   '📦 Retirar encomenda nos Correios · R$ 15',
    messages: [
      { from: 'me',   text: 'Obrigada pelo serviço, Rodrigo! 👍', time: 'seg' },
      { from: 'them', text: 'Disponha! Foi um prazer ajudar. Qualquer tarefa é só chamar.', time: 'seg' },
    ],
    autoReplies: [
      'Claro! Sempre à disposição 😊',
    ],
  },
};

let activeConv = 'joao';
let autoReplyIdx = {};

/* ─── HELPERS ─────────────────────────────────────── */
function now() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function makeMsg(from, text, time) {
  const isMe = from === 'me';
  return `
    <div class="msg-row${isMe ? ' me' : ''}">
      ${!isMe ? `<div class="msg-avatar-small">${CONVS[activeConv]?.avatar || '🧑'}</div>` : ''}
      <div>
        <div class="msg-bubble">${text}</div>
        <div class="msg-time">${time}${isMe ? ' ✓✓' : ''}</div>
      </div>
    </div>`;
}

/* ─── RENDER CONVERSATION ─────────────────────────── */
function loadConv(id) {
  const data = CONVS[id];
  if (!data) return;
  activeConv = id;

  // Update header
  document.getElementById('chatWinName').textContent   = data.name;
  document.getElementById('chatWinStatus').textContent = data.status;

  // Build messages
  const msgs = document.getElementById('chatMessages');
  msgs.innerHTML = `<div class="chat-date-divider">Hoje · 13 de Fevereiro</div>`;

  if (data.task) {
    msgs.innerHTML += `<div class="task-chip">${data.task}</div>`;
  }

  data.messages.forEach(m => {
    msgs.innerHTML += makeMsg(m.from, m.text, m.time);
  });

  // Typing indicator
  msgs.innerHTML += `
    <div id="typingIndicator" style="display:none;">
      <div class="msg-row">
        <div class="msg-avatar-small">${data.avatar}</div>
        <div class="msg-bubble" style="padding:10px 16px;">
          <span style="display:inline-flex;gap:4px;align-items:center;">
            <span style="width:7px;height:7px;border-radius:50%;background:var(--ink-light);animation:typingBounce .6s infinite;display:inline-block;"></span>
            <span style="width:7px;height:7px;border-radius:50%;background:var(--ink-light);animation:typingBounce .6s .15s infinite;display:inline-block;"></span>
            <span style="width:7px;height:7px;border-radius:50%;background:var(--ink-light);animation:typingBounce .6s .3s infinite;display:inline-block;"></span>
          </span>
        </div>
      </div>
    </div>`;

  msgs.scrollTop = msgs.scrollHeight;

  // Mark as read
  document.querySelectorAll('.conv-item').forEach(el => {
    el.classList.remove('active');
    if (el.dataset.conv === id) {
      el.classList.add('active');
      el.classList.remove('unread');
      const badge = el.querySelector('.conv-badge');
      if (badge) badge.remove();
    }
  });
}

// Initial load
loadConv('joao');

/* ─── SWITCH CONVERSATION ─────────────────────────── */
document.querySelectorAll('.conv-item').forEach(item => {
  item.addEventListener('click', () => loadConv(item.dataset.conv));
});

/* ─── SEND MESSAGE ────────────────────────────────── */
function sendMessage() {
  const input = document.getElementById('chatInput');
  const text  = input?.value.trim();
  if (!text) return;

  const msgs = document.getElementById('chatMessages');
  const typing = document.getElementById('typingIndicator');

  // Append my message before typing indicator
  const msgDiv = document.createElement('div');
  msgDiv.innerHTML = makeMsg('me', text, now());
  msgs.insertBefore(msgDiv, typing);
  msgs.scrollTop = msgs.scrollHeight;

  input.value = '';

  // Show typing after 800ms
  const data = CONVS[activeConv];
  if (!data?.autoReplies?.length) return;

  setTimeout(() => {
    if (typing) typing.style.display = 'block';
    msgs.scrollTop = msgs.scrollHeight;
  }, 800);

  // Auto-reply after 2s
  const idx    = autoReplyIdx[activeConv] || 0;
  const reply  = data.autoReplies[idx % data.autoReplies.length];
  autoReplyIdx[activeConv] = idx + 1;

  setTimeout(() => {
    if (typing) typing.style.display = 'none';
    const replyDiv = document.createElement('div');
    replyDiv.innerHTML = makeMsg('them', reply, now());
    msgs.insertBefore(replyDiv, typing);
    msgs.scrollTop = msgs.scrollHeight;
  }, 2400);
}

document.getElementById('chatSendBtn')?.addEventListener('click', sendMessage);
document.getElementById('chatInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});

/* ─── CONVERSATION SEARCH ─────────────────────────── */
document.getElementById('convSearch')?.addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll('.conv-item').forEach(item => {
    const name = item.querySelector('.conv-name')?.textContent.toLowerCase() || '';
    item.style.display = (!q || name.includes(q)) ? '' : 'none';
  });
});
