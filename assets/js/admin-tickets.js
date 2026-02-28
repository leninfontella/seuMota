/**
 * seuMota — admin-tickets.js
 * Ticket detail view, reply, resolve, filter tabs
 */

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1E1B4B;color:white;padding:12px 20px;border-radius:12px;font-family:Nunito,sans-serif;font-size:.85rem;font-weight:800;z-index:999;animation:slideUp .3s ease';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.textContent = '', 3000);
}

/* ── OPEN TICKET ── */
function openTicket(el, id, subject, user, avatar, statusColor, statusText, priority) {
  // Highlight selected row
  document.querySelectorAll('.ticket-item').forEach(i => i.classList.remove('active-ticket'));
  el.classList.add('active-ticket');

  // Remove unread dot
  const dot = el.querySelector('.unread-dot');
  if (dot) dot.remove();

  // Update detail panel
  const detailId      = document.getElementById('detailId');
  const detailSubject = document.getElementById('detailSubject');
  const detailUser    = document.getElementById('detailUser');
  const detailStatus  = document.getElementById('detailStatus');

  if (detailId)      detailId.textContent = `${id} · ${priority} prioridade`;
  if (detailSubject) detailSubject.textContent = subject;
  if (detailUser)    detailUser.textContent = user;
  if (detailStatus) {
    detailStatus.textContent = statusText;
    detailStatus.style.color = statusColor;
  }

  // Update messages area with contextual messages
  const messagesArea = document.getElementById('messagesArea');
  if (messagesArea) {
    messagesArea.innerHTML = `
      <div class="msg-bubble">
        <div class="msg-avatar">${avatar}</div>
        <div class="msg-body">
          <div class="msg-meta">${user} · Agora</div>
          <div class="msg-text">Preciso de ajuda com: "${subject}". Podem verificar o que aconteceu com minha conta?</div>
        </div>
      </div>`;
  }

  // Clear reply field
  const replyText = document.getElementById('replyText');
  if (replyText) replyText.value = '';
}

/* ── STATUS TAB FILTER ── */
let activeTab = 'all';

function tabFilter(btn, filter) {
  document.querySelectorAll('.status-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  activeTab = filter;

  const items = document.querySelectorAll('.ticket-item');
  let visible = 0;

  const MAP = {
    all:      ['open','pending','resolved','closed'],
    open:     ['open'],
    pending:  ['pending'],
    resolved: ['resolved','closed'],
  };

  const allowed = MAP[filter] || [];

  items.forEach(item => {
    const s = item.dataset.status;
    const show = allowed.includes(s);
    item.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  const el = document.getElementById('ticketCount');
  if (el) el.textContent = `${visible} ticket${visible !== 1 ? 's' : ''}`;
}

/* ── SEARCH ── */
function filterTickets(q) {
  const lq = q.toLowerCase();
  const items = document.querySelectorAll('.ticket-item');
  let visible = 0;

  items.forEach(item => {
    const matches = !lq || item.textContent.toLowerCase().includes(lq);
    item.style.display = matches ? '' : 'none';
    if (matches) visible++;
  });

  const el = document.getElementById('ticketCount');
  if (el) el.textContent = `${visible} ticket${visible !== 1 ? 's' : ''}`;
}

/* ── SEND REPLY ── */
function sendReply() {
  const textarea = document.getElementById('replyText');
  const msg = textarea?.value.trim();
  if (!msg) { showToast('⚠️ Escreva uma mensagem antes de enviar.'); return; }

  const btn = document.querySelector('.send-btn');
  if (btn) { btn.textContent = 'Enviando…'; btn.disabled = true; }

  setTimeout(() => {
    const messagesArea = document.getElementById('messagesArea');
    if (messagesArea) {
      const bubble = document.createElement('div');
      bubble.className = 'msg-bubble admin';
      bubble.innerHTML = `
        <div class="msg-avatar">🛡️</div>
        <div class="msg-body">
          <div class="msg-meta">Admin seuMota · Agora</div>
          <div class="msg-text">${msg}</div>
        </div>`;
      messagesArea.appendChild(bubble);
      messagesArea.scrollTop = messagesArea.scrollHeight;
    }
    if (textarea) textarea.value = '';
    if (btn) { btn.textContent = 'Enviar ↑'; btn.disabled = false; }
    showToast('✅ Resposta enviada ao usuário.');
  }, 700);
}

/* ── SHORTCUTS ── */
function insertShortcut(text) {
  const textarea = document.getElementById('replyText');
  if (textarea) {
    textarea.value = text;
    textarea.focus();
  }
}

/* ── RESOLVE TICKET ── */
function resolveTicket() {
  const detailStatus = document.getElementById('detailStatus');
  if (detailStatus) {
    detailStatus.textContent = 'Resolvido';
    detailStatus.style.color = '#166534';
  }
  // Update active ticket item pill
  const activeItem = document.querySelector('.active-ticket');
  if (activeItem) {
    const pill = activeItem.querySelector('.pill');
    if (pill) { pill.textContent = 'Resolvido'; pill.className = 'pill pill-resolved'; }
    activeItem.dataset.status = 'resolved';
    const dot = activeItem.querySelector('.priority-dot');
    if (dot) { dot.className = 'priority-dot priority-low'; }
  }
  showToast('🎉 Ticket marcado como resolvido.');
}

/* ── EXPOSE GLOBALS ── */
window.openTicket     = openTicket;
window.tabFilter      = tabFilter;
window.filterTickets  = filterTickets;
window.sendReply      = sendReply;
window.insertShortcut = insertShortcut;
window.resolveTicket  = resolveTicket;
window.showToast      = showToast;
