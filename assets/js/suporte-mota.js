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
