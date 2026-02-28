/**
 * seuMota — admin-reportes.js
 * Admin reports management
 */

/* ── Status filter tabs ── */
const statusTabs = document.querySelectorAll('.status-tab');
const reportCards = document.querySelectorAll('.report-card');

statusTabs.forEach(tab => {
  tab.addEventListener('click', function() {
    const status = this.dataset.status;
    
    // Update active tab
    statusTabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    
    // Filter reports
    reportCards.forEach(card => {
      const cardStatus = card.querySelector('.pill').textContent.trim().toLowerCase();
      
      if (status === 'all') {
        card.style.display = '';
      } else if (status === 'open' && cardStatus.includes('aberto')) {
        card.style.display = '';
      } else if (status === 'analyzing' && cardStatus.includes('análise')) {
        card.style.display = '';
      } else if (status === 'resolved' && cardStatus.includes('resolvido')) {
        card.style.display = '';
      } else if (status === 'dismissed' && cardStatus.includes('descartado')) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ── Open detail modal ── */
const detailOverlay = document.getElementById('detailOverlay');
const detailClose = document.getElementById('detailClose');

reportCards.forEach(card => {
  card.addEventListener('click', function() {
    const reportId = this.dataset.report;
    
    // Populate modal with report data (in production, fetch from API)
    const title = this.querySelector('.report-title').textContent;
    const id = this.querySelector('.report-id').textContent;
    
    document.getElementById('detailTitle').textContent = title;
    document.getElementById('detailId').textContent = id;
    
    // Show modal
    detailOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

// Close modal
detailClose.addEventListener('click', () => {
  detailOverlay.classList.remove('active');
  document.body.style.overflow = '';
});

// Close on overlay click
detailOverlay.addEventListener('click', (e) => {
  if (e.target === detailOverlay) {
    detailOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && detailOverlay.classList.contains('active')) {
    detailOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
});

/* ── Admin action buttons ── */
const actionBtns = document.querySelectorAll('.action-btn');

actionBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const action = this.textContent.trim();
    const reportId = document.getElementById('detailId').textContent;
    
    if (this.classList.contains('action-resolve')) {
      if (confirm(`✅ Resolver reporte ${reportId}?\n\nO usuário reportado receberá uma advertência formal e o reporte será marcado como resolvido.`)) {
        showToast('✅ Reporte resolvido e advertência enviada');
        setTimeout(() => {
          detailOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }, 1000);
      }
    }
    
    else if (this.classList.contains('action-suspend')) {
      if (confirm(`⏸️ Suspender usuário por 7 dias?\n\nReporte: ${reportId}\n\nO usuário ficará impossibilitado de usar a plataforma durante este período e receberá notificação por email.`)) {
        showToast('⏸️ Usuário suspenso por 7 dias');
        setTimeout(() => {
          detailOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }, 1000);
      }
    }
    
    else if (this.classList.contains('action-ban')) {
      if (confirm(`🚫 ATENÇÃO: Banimento permanente!\n\nReporte: ${reportId}\n\nEsta ação é IRREVERSÍVEL. O usuário será banido permanentemente e não poderá criar nova conta com os mesmos dados.\n\nTem certeza?`)) {
        if (confirm('Confirme novamente: BANIR PERMANENTEMENTE?')) {
          showToast('🚫 Usuário banido permanentemente');
          setTimeout(() => {
            detailOverlay.classList.remove('active');
            document.body.style.overflow = '';
          }, 1000);
        }
      }
    }
    
    else if (this.classList.contains('action-dismiss')) {
      if (confirm(`❌ Descartar reporte ${reportId}?\n\nO reporte será marcado como descartado e arquivado. Nenhuma ação será tomada contra o usuário reportado.`)) {
        showToast('❌ Reporte descartado');
        setTimeout(() => {
          detailOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }, 1000);
      }
    }
  });
});

/* ── Toast notification ── */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  setTimeout(() => { toast.textContent = ''; }, 3000);
}

/* ── Priority sorting (optional feature) ── */
function sortByPriority() {
  const container = document.querySelector('.reports-list');
  const cards = Array.from(container.querySelectorAll('.report-card'));
  
  const priorityOrder = { 'critical': 1, 'high': 2, 'medium': 3, 'low': 4 };
  
  cards.sort((a, b) => {
    const aPriority = a.classList.contains('critical') ? 1 : 
                     a.classList.contains('high') ? 2 : 3;
    const bPriority = b.classList.contains('critical') ? 1 : 
                     b.classList.contains('high') ? 2 : 3;
    return aPriority - bPriority;
  });
  
  // Re-append sorted
  cards.forEach(card => container.appendChild(card));
}

// Auto-sort on page load
sortByPriority();

/* ── Auto-refresh indicator ── */
let autoRefresh = true;
setInterval(() => {
  if (autoRefresh) {
    console.log('🔄 Verificando novos reportes...');
    // In production: fetch new reports from API
  }
}, 30000); // Every 30 seconds
