/**
 * seuMota — admin-verificacoes.js
 * Admin candidate verification management
 */

const $ = id => document.getElementById(id);

/* ── MOCK DATA ──────────────────────────────────── */
const candidatesData = {
  1: {
    id: 1,
    name: 'Marcos Oliveira Santos',
    candidateId: '#CAND-4782',
    avatar: '🧑',
    cpf: '123.456.789-00',
    birth: '15/03/1992',
    age: 32,
    phone: '(11) 98765-4321',
    email: 'marcos.oliveira@email.com',
    city: 'São Paulo, SP',
    submittedTime: 'há 2h',
    urgent: true,
    docs: {
      cpf: { status: 'verified', name: 'CPF_frente.jpg', time: 'há 2h' },
      selfie: { status: 'verified', name: 'Selfie_com_documento.jpg', time: 'há 2h' },
      address: { status: 'verified', name: 'Comprovante_residencia.pdf', time: 'há 2h' },
      background: { status: 'pending', name: 'Antecedentes', time: 'em andamento' }
    },
    timeline: [
      { time: '18 fev, 14h30', text: 'Candidatura enviada' },
      { time: '18 fev, 14h32', text: 'CPF verificado automaticamente' },
      { time: '18 fev, 14h35', text: 'Selfie aprovada pelo sistema' },
      { time: '18 fev, 14h40', text: 'Comprovante de endereço verificado' },
      { time: '18 fev, 15h10', text: 'Consulta de antecedentes em andamento' }
    ]
  },
  2: {
    id: 2,
    name: 'Carla Mendes Silva',
    candidateId: '#CAND-4781',
    avatar: '👩',
    cpf: '234.567.890-11',
    birth: '22/07/1988',
    age: 36,
    phone: '(21) 97654-3210',
    email: 'carla.mendes@email.com',
    city: 'Rio de Janeiro, RJ',
    submittedTime: 'há 5h',
    urgent: false,
    docs: {
      cpf: { status: 'verified', name: 'CPF_frente.jpg', time: 'há 5h' },
      selfie: { status: 'verified', name: 'Selfie_com_documento.jpg', time: 'há 5h' },
      address: { status: 'pending', name: 'Comprovante End.', time: 'aguardando' },
      background: { status: 'pending', name: 'Antecedentes', time: 'aguardando' }
    }
  },
  3: {
    id: 3,
    name: 'Rafael Costa Lima',
    candidateId: '#CAND-4780',
    avatar: '👨',
    cpf: '345.678.901-22',
    birth: '10/11/1995',
    age: 29,
    phone: '(31) 96543-2109',
    email: 'rafael.costa@email.com',
    city: 'Belo Horizonte, MG',
    submittedTime: 'há 8h',
    urgent: false,
    docs: {
      cpf: { status: 'verified', name: 'CPF_frente.jpg', time: 'há 8h' },
      selfie: { status: 'missing', name: 'Selfie Inválida', time: 'rejeitada' },
      address: { status: 'pending', name: 'Comprovante End.', time: 'aguardando' },
      background: { status: 'pending', name: 'Antecedentes', time: 'aguardando' }
    }
  },
  4: {
    id: 4,
    name: 'Diego Alves Pereira',
    candidateId: '#CAND-4779',
    avatar: '🧔',
    cpf: '456.789.012-33',
    birth: '05/02/1990',
    age: 34,
    phone: '(41) 95432-1098',
    email: 'diego.alves@email.com',
    city: 'Curitiba, PR',
    submittedTime: 'há 1d',
    urgent: true,
    docs: {
      cpf: { status: 'verified', name: 'CPF_frente.jpg', time: 'há 1d' },
      selfie: { status: 'verified', name: 'Selfie_com_documento.jpg', time: 'há 1d' },
      address: { status: 'verified', name: 'Comprovante_residencia.pdf', time: 'há 1d' },
      background: { status: 'verified', name: 'Antecedentes Limpos', time: 'há 1d' }
    }
  },
  5: {
    id: 5,
    name: 'Fernanda Lima Costa',
    candidateId: '#CAND-4778',
    avatar: '👩',
    cpf: '567.890.123-44',
    birth: '18/09/1993',
    age: 31,
    phone: '(51) 94321-0987',
    email: 'fernanda.lima@email.com',
    city: 'Porto Alegre, RS',
    submittedTime: 'há 1d',
    urgent: false,
    docs: {
      cpf: { status: 'verified', name: 'CPF_frente.jpg', time: 'há 1d' },
      selfie: { status: 'verified', name: 'Selfie_com_documento.jpg', time: 'há 1d' },
      address: { status: 'pending', name: 'Comprovante End.', time: 'aguardando' },
      background: { status: 'pending', name: 'Antecedentes', time: 'em andamento' }
    }
  }
};

let currentCandidateId = null;

/* ── OPEN DETAIL MODAL ──────────────────────────── */
window.openDetail = function(candidateId) {
  const candidate = candidatesData[candidateId];
  if (!candidate) return;
  
  currentCandidateId = candidateId;
  
  // Update modal content
  document.querySelector('.verification-detail-panel .candidate-id').textContent = candidate.candidateId;
  document.querySelector('.verification-detail-panel .detail-title').textContent = candidate.name;
  
  // Update personal info fields
  const fields = {
    'Nome Completo': candidate.name,
    'CPF': candidate.cpf,
    'Data Nascimento': `${candidate.birth} (${candidate.age} anos)`,
    'Telefone': candidate.phone,
    'Email': candidate.email,
    'Cidade': candidate.city
  };
  
  // Show overlay
  $('detailOverlay').classList.add('active');
  
  // Log action
  logAction('VERIFICATION_VIEW', `Admin visualizou candidato ${candidate.candidateId}`);
};

/* ── CLOSE DETAIL MODAL ─────────────────────────── */
function closeDetail() {
  $('detailOverlay').classList.remove('active');
  currentCandidateId = null;
}

$('detailClose')?.addEventListener('click', closeDetail);

// Close on overlay click
$('detailOverlay')?.addEventListener('click', function(e) {
  if (e.target === this) closeDetail();
});

// Close on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && $('detailOverlay').classList.contains('active')) {
    closeDetail();
  }
});

/* ── QUICK APPROVE ──────────────────────────────── */
window.quickApprove = function(candidateId) {
  const candidate = candidatesData[candidateId];
  if (!candidate) return;
  
  if (!confirm(`✅ Aprovar candidatura de ${candidate.name}?\n\nEste candidato será aprovado e poderá começar a aceitar tarefas.`)) {
    return;
  }
  
  // Remove card with animation
  const card = document.querySelector(`.verification-card[data-candidate="${candidateId}"]`);
  if (card) {
    card.style.transform = 'translateX(100%)';
    card.style.opacity = '0';
    
    setTimeout(() => {
      card.remove();
      updateCounters();
    }, 300);
  }
  
  // Show success
  showToast(`✅ ${candidate.name} foi aprovado com sucesso!`);
  
  // Log action
  logAction('VERIFICATION_APPROVED', `${candidate.candidateId} - ${candidate.name} aprovado`);
};

/* ── QUICK REJECT ───────────────────────────────── */
window.quickReject = function(candidateId) {
  const candidate = candidatesData[candidateId];
  if (!candidate) return;
  
  const reason = prompt(`❌ Rejeitar candidatura de ${candidate.name}?\n\nPor favor, informe o motivo da rejeição:`);
  
  if (!reason) {
    showToast('❌ Rejeição cancelada - motivo não informado');
    return;
  }
  
  // Remove card with animation
  const card = document.querySelector(`.verification-card[data-candidate="${candidateId}"]`);
  if (card) {
    card.style.transform = 'translateX(-100%)';
    card.style.opacity = '0';
    
    setTimeout(() => {
      card.remove();
      updateCounters();
    }, 300);
  }
  
  // Show success
  showToast(`❌ ${candidate.name} foi rejeitado. Motivo: ${reason}`);
  
  // Log action
  logAction('VERIFICATION_REJECTED', `${candidate.candidateId} - ${candidate.name} rejeitado. Motivo: ${reason}`);
};

/* ── APPROVE FROM DETAIL ────────────────────────── */
window.approveFromDetail = function() {
  if (!currentCandidateId) return;
  
  closeDetail();
  
  setTimeout(() => {
    quickApprove(currentCandidateId);
  }, 300);
};

/* ── REJECT FROM DETAIL ─────────────────────────── */
window.rejectFromDetail = function() {
  if (!currentCandidateId) return;
  
  closeDetail();
  
  setTimeout(() => {
    quickReject(currentCandidateId);
  }, 300);
};

/* ── REQUEST MORE DOCS ──────────────────────────── */
window.requestMoreDocs = function() {
  if (!currentCandidateId) return;
  
  const candidate = candidatesData[currentCandidateId];
  
  const message = prompt(`📄 Solicitar documentos adicionais de ${candidate.name}?\n\nDescreva quais documentos são necessários:`);
  
  if (!message) {
    showToast('❌ Solicitação cancelada');
    return;
  }
  
  showToast(`📧 Solicitação enviada para ${candidate.name}`);
  
  // Log action
  logAction('DOCS_REQUESTED', `Documentos solicitados para ${candidate.candidateId}: ${message}`);
  
  closeDetail();
};

/* ── UPDATE COUNTERS ────────────────────────────── */
function updateCounters() {
  const remainingCards = document.querySelectorAll('.verification-card').length;
  
  // Update sidebar badge
  const badge = document.querySelector('.nav-item.active .nav-badge');
  if (badge) {
    badge.textContent = remainingCards;
  }
  
  // Update topbar badge
  const topbarBadge = document.querySelector('.topbar-right > div');
  if (topbarBadge && remainingCards > 0) {
    topbarBadge.innerHTML = `
      <span style="width:7px;height:7px;border-radius:50%;background:#F59E0B;animation:pulse-orange 1.5s infinite;display:inline-block;"></span>
      ${remainingCards} pendentes
    `;
  } else if (topbarBadge) {
    topbarBadge.innerHTML = `
      <span style="width:7px;height:7px;border-radius:50%;background:#22C55E;animation:pulse-green 1.5s infinite;display:inline-block;"></span>
      Nenhuma pendência
    `;
    topbarBadge.style.background = '#DCFCE7';
    topbarBadge.style.borderColor = '#BBF7D0';
    topbarBadge.style.color = '#16A34A';
  }
  
  // Update stat card
  const statValue = document.querySelector('.admin-stat-value');
  if (statValue) {
    statValue.textContent = remainingCards;
  }
  
  // Update tab badge
  const pendingTab = document.querySelector('.status-tab[data-status="pending"] span');
  if (pendingTab) {
    pendingTab.textContent = remainingCards;
  }
}

/* ── STATUS TABS ────────────────────────────────── */
document.querySelectorAll('.status-tab').forEach(tab => {
  tab.addEventListener('click', function() {
    // Remove active from all
    document.querySelectorAll('.status-tab').forEach(t => t.classList.remove('active'));
    
    // Add active to clicked
    this.classList.add('active');
    
    const status = this.dataset.status;
    
    // Filter cards (in a real app, would fetch from API)
    showToast(`📊 Filtro aplicado: ${this.textContent.trim()}`);
  });
});

/* ── LOG ACTION ─────────────────────────────────── */
function logAction(action, details) {
  const logs = JSON.parse(localStorage.getItem('admin_logs') || '[]');
  
  logs.unshift({
    timestamp: new Date().toISOString(),
    action,
    details,
    admin: 'Admin seuMota',
    ip: '192.168.1.100',
    type: action.includes('APPROVED') ? 'success' : action.includes('REJECTED') ? 'warning' : 'info'
  });
  
  if (logs.length > 1000) logs.pop();
  
  localStorage.setItem('admin_logs', JSON.stringify(logs));
}

/* ── TOAST ──────────────────────────────────────── */
function showToast(msg) {
  const toast = $('toast');
  if (!toast) return;
  toast.textContent = msg;
  setTimeout(() => { toast.textContent = ''; }, 4000);
}
