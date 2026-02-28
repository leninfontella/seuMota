/**
 * seuMota — chat-mota.js
 * Chat messaging system for Mota-Cliente conversations
 */

const $ = id => document.getElementById(id);

/* ── MOCK CHAT DATA ─────────────────────────────── */
const chatData = {
  1: {
    id: 1,
    name: 'Ana Paula',
    avatar: '👩',
    status: 'online',
    messages: [
      { sender: 'them', text: 'Oi João! Você pode fazer as compras pra mim hoje às 14h?', time: '13:15' },
      { sender: 'me', text: 'Oi Ana! Sim, sem problemas! Qual mercado você prefere?', time: '13:18' },
      { sender: 'them', text: 'Pode ser no Extra da esquina. Vou enviar a lista agora 📝', time: '13:20' },
      { sender: 'them', text: '- 2L de leite<br>- 1kg de arroz<br>- Café 500g<br>- 6 ovos', time: '13:21' },
      { sender: 'me', text: 'Perfeito! Anotado tudo aqui 👍', time: '13:22' },
      { sender: 'them', text: 'Ah, uma coisa: pode comprar leite desnatado? Obrigada!', time: '13:45' }
    ]
  },
  2: {
    id: 2,
    name: 'Roberto Santos',
    avatar: '👴',
    status: 'offline',
    messages: [
      { sender: 'them', text: 'Boa tarde! Consegue buscar meu remédio na farmácia hoje?', time: '11:30' },
      { sender: 'me', text: 'Claro, Sr. Roberto! Qual farmácia e horário?', time: '11:32' },
      { sender: 'them', text: 'Drogasil da Av. Paulista, até as 16h pode ser?', time: '11:35' },
      { sender: 'me', text: 'Perfeito! Já estou indo até lá 👍', time: '11:40' }
    ]
  },
  3: {
    id: 3,
    name: 'Carlos Mendes',
    avatar: '👨',
    status: 'online',
    messages: [
      { sender: 'them', text: 'João, preciso que você leve umas caixas pro correio', time: '10:15' },
      { sender: 'me', text: 'Tranquilo! Quantas caixas são?', time: '10:20' },
      { sender: 'them', text: 'São 3 caixas médias. Pode vir buscar às 15h?', time: '10:22' },
      { sender: 'me', text: 'Pode deixar! Vou estar aí às 15h', time: '10:25' },
      { sender: 'them', text: 'O porteiro vai deixar a chave com você', time: '10:30' }
    ]
  },
  4: {
    id: 4,
    name: 'Beatriz Lima',
    avatar: '👩',
    status: 'offline',
    messages: [
      { sender: 'them', text: 'Olá! Você pode passear com meu cachorro hoje?', time: 'ontem 14:00' },
      { sender: 'me', text: 'Oi Beatriz! Claro que sim! Que horas?', time: 'ontem 14:05' },
      { sender: 'them', text: 'Por volta das 17h está ótimo!', time: 'ontem 14:10' },
      { sender: 'me', text: 'Combinado! Até logo 🐕', time: 'ontem 14:12' },
      { sender: 'them', text: 'Muito obrigada pela ajuda! Você é ótimo ⭐', time: 'ontem 18:30' }
    ]
  },
  5: {
    id: 5,
    name: 'Thiago Alves',
    avatar: '👨',
    status: 'offline',
    messages: [
      { sender: 'them', text: 'Preciso descer o lixo amanhã cedo, pode?', time: '2 dias atrás' },
      { sender: 'me', text: 'Posso sim! Que horas?', time: '2 dias atrás' },
      { sender: 'them', text: 'Antes das 8h seria ótimo', time: '2 dias atrás' },
      { sender: 'me', text: 'Tarefa concluída! 😊', time: '2 dias atrás' }
    ]
  }
};

let currentChatId = 1;

/* ── SWITCH CONVERSATION ────────────────────────── */
function switchConversation(chatId) {
  currentChatId = chatId;
  
  // Update active state in list
  document.querySelectorAll('.conversation-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.chatId == chatId) {
      item.classList.add('active');
      item.classList.remove('unread'); // Mark as read
      const badge = item.querySelector('.unread-badge');
      if (badge) badge.remove();
    }
  });
  
  // Load chat
  loadChat(chatId);
}

/* ── LOAD CHAT ──────────────────────────────────── */
function loadChat(chatId) {
  const chat = chatData[chatId];
  if (!chat) return;
  
  // Update header
  const headerAvatar = document.querySelector('.chat-header-avatar');
  const headerName = document.querySelector('.chat-header-name');
  const headerStatus = document.querySelector('.chat-header-status');
  
  headerAvatar.textContent = chat.avatar;
  headerName.textContent = chat.name;
  headerStatus.textContent = chat.status === 'online' ? '● Online' : '○ Offline';
  headerStatus.style.color = chat.status === 'online' ? '#22C55E' : 'var(--ink-light)';
  
  // Render messages
  renderMessages(chat.messages);
}

/* ── RENDER MESSAGES ────────────────────────────── */
function renderMessages(messages) {
  const container = $('chatMessages');
  
  let html = '<div class="date-separator">Hoje</div>';
  
  messages.forEach(msg => {
    const messageClass = msg.sender === 'me' ? 'sent' : 'received';
    const avatar = msg.sender === 'me' ? '🧑' : chatData[currentChatId].avatar;
    
    html += `
      <div class="message ${messageClass}">
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
          <div class="message-bubble">${msg.text}</div>
          <div class="message-time">${msg.time}</div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  // Scroll to bottom
  setTimeout(() => {
    container.scrollTop = container.scrollHeight;
  }, 100);
}

/* ── SEND MESSAGE ───────────────────────────────── */
function sendMessage() {
  const input = $('messageInput');
  const text = input.value.trim();
  
  if (!text) return;
  
  // Add message to data
  const now = new Date();
  const time = now.getHours().toString().padStart(2, '0') + ':' + 
               now.getMinutes().toString().padStart(2, '0');
  
  chatData[currentChatId].messages.push({
    sender: 'me',
    text: text.replace(/\n/g, '<br>'),
    time: time
  });
  
  // Re-render
  renderMessages(chatData[currentChatId].messages);
  
  // Clear input
  input.value = '';
  input.style.height = 'auto';
  input.focus();
  
  // Show toast
  showToast('✅ Mensagem enviada');
  
  // Simulate response after 2s
  setTimeout(() => {
    const responses = [
      'Obrigado! 😊',
      'Perfeito, até logo!',
      'Pode deixar!',
      'Combinado! 👍',
      'Muito obrigado pela ajuda!'
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    chatData[currentChatId].messages.push({
      sender: 'them',
      text: randomResponse,
      time: new Date().getHours().toString().padStart(2, '0') + ':' + 
            new Date().getMinutes().toString().padStart(2, '0')
    });
    
    renderMessages(chatData[currentChatId].messages);
  }, 2000);
}

/* ── AUTO-RESIZE TEXTAREA ───────────────────────── */
const messageInput = $('messageInput');

if (messageInput) {
  messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });
  
  // Send on Enter (Shift+Enter for new line)
  messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

/* ── SEND BUTTON ────────────────────────────────── */
const sendButton = $('sendButton');

if (sendButton) {
  sendButton.addEventListener('click', sendMessage);
}

/* ── CONVERSATION CLICK ─────────────────────────── */
document.querySelectorAll('.conversation-item').forEach(item => {
  item.addEventListener('click', function() {
    const chatId = parseInt(this.dataset.chatId);
    switchConversation(chatId);
  });
});

/* ── SEARCH CONVERSATIONS ───────────────────────── */
const searchInput = $('searchConversations');

if (searchInput) {
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    
    document.querySelectorAll('.conversation-item').forEach(item => {
      const name = item.querySelector('.conversation-name').textContent.toLowerCase();
      const preview = item.querySelector('.conversation-preview').textContent.toLowerCase();
      
      if (name.includes(query) || preview.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

/* ── HELPER FUNCTIONS ───────────────────────────── */
function showToast(msg) {
  const toast = $('toast');
  if (!toast) return;
  toast.textContent = msg;
  setTimeout(() => { toast.textContent = ''; }, 3000);
}

/* ── INITIALIZE ─────────────────────────────────── */
// Load initial chat
loadChat(currentChatId);
