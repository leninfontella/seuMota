/**
 * seuMota — suporte.js
 * Support page interactions
 */

const $ = id => document.getElementById(id);

/* ── TOGGLE FAQ ─────────────────────────────────── */
window.toggleFAQ = function(element) {
  const item = element.closest('.faq-item');
  const answer = item.querySelector('.faq-answer');
  
  // Toggle this item
  item.classList.toggle('open');
  answer.classList.toggle('show');
};

/* ── SCROLL TO SECTION ──────────────────────────── */
window.scrollToFAQ = function(e) {
  e.preventDefault();
  document.getElementById('faq').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.scrollToContact = function(e) {
  e.preventDefault();
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/* ── FORM SUBMISSION ────────────────────────────── */
const form = $('supportForm');

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const subject = $('subject').value;
    const message = $('message').value;
    const email = $('email').value;
    
    if (!subject || !message) {
      showToast('❌ Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    // Simulate API call
    const btn = form.querySelector('.btn-submit');
    const originalText = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled = true;
    
    setTimeout(() => {
      // Create ticket ID
      const ticketId = '#TICKET-' + Math.floor(Math.random() * 9000 + 1000);
      
      // Save to localStorage (in production, would save to backend)
      const tickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');
      tickets.unshift({
        id: ticketId,
        subject: getSubjectLabel(subject),
        message,
        email: email || 'Não informado',
        status: 'open',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('support_tickets', JSON.stringify(tickets));
      
      // Reset form
      form.reset();
      btn.textContent = originalText;
      btn.disabled = false;
      
      // Show success
      showToast(`✅ Ticket ${ticketId} criado com sucesso! Nossa equipe responderá em breve.`);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  });
}

/* ── HELPER FUNCTIONS ───────────────────────────── */
function getSubjectLabel(value) {
  const labels = {
    pagamento: 'Pagamento / Saque',
    tarefa: 'Problema com tarefa',
    conta: 'Conta / Cadastro',
    tecnico: 'Problema técnico',
    avaliacao: 'Avaliação / Feedback',
    outro: 'Outro assunto'
  };
  return labels[value] || value;
}

function showToast(msg) {
  const toast = $('toast');
  if (!toast) return;
  toast.textContent = msg;
  setTimeout(() => { toast.textContent = ''; }, 4000);
}

/* ── CHAT MODAL ─────────────────────────────────── */
window.openChatModal = function(e) {
  e.preventDefault();
  const modal = $('chatModal');
  if (modal) {
    modal.classList.add('active');
    $('chatInput')?.focus();
  }
};

function closeChatModal() {
  const modal = $('chatModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Close button
$('closeChatModal')?.addEventListener('click', closeChatModal);

// Close on overlay click
$('chatModal')?.addEventListener('click', function(e) {
  if (e.target === this) closeChatModal();
});

// Close on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && $('chatModal')?.classList.contains('active')) {
    closeChatModal();
  }
});

/* ── SEND CHAT MESSAGE ──────────────────────────── */
function sendChatMessage() {
  const input = $('chatInput');
  const text = input?.value.trim();
  
  if (!text) return;
  
  const messagesContainer = $('chatMessages');
  if (!messagesContainer) return;
  
  // Get current time
  const now = new Date();
  const time = now.getHours().toString().padStart(2, '0') + ':' + 
               now.getMinutes().toString().padStart(2, '0');
  
  // Add user message
  const userMessage = document.createElement('div');
  userMessage.className = 'chat-message sent';
  userMessage.innerHTML = `
    <div class="chat-message-avatar">🧑</div>
    <div class="chat-message-content">
      <div class="chat-message-bubble">${text}</div>
      <div class="chat-message-time">${time}</div>
    </div>
  `;
  messagesContainer.appendChild(userMessage);
  
  // Clear input
  input.value = '';
  
  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Simulate support response after 2s
  setTimeout(() => {
    const responses = [
      'Obrigado pela sua mensagem! Vou verificar isso para você.',
      'Entendo sua situação. Deixe-me ajudar você com isso.',
      'Perfeito! Estou verificando as informações aqui.',
      'Vou encaminhar seu caso para o departamento responsável.',
      'Ótima pergunta! Vou buscar essa informação para você.'
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const supportMessage = document.createElement('div');
    supportMessage.className = 'chat-message received';
    const responseTime = new Date().getHours().toString().padStart(2, '0') + ':' + 
                         new Date().getMinutes().toString().padStart(2, '0');
    supportMessage.innerHTML = `
      <div class="chat-message-avatar">🛡️</div>
      <div class="chat-message-content">
        <div class="chat-message-bubble">${randomResponse}</div>
        <div class="chat-message-time">${responseTime}</div>
      </div>
    `;
    messagesContainer.appendChild(supportMessage);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Play sound (optional)
    // new Audio('notification.mp3').play();
  }, 2000);
}

// Send button click
$('chatSendBtn')?.addEventListener('click', sendChatMessage);

// Send on Enter key
$('chatInput')?.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChatMessage();
  }
});

