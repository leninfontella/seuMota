/**
 * seuMota — minhas-tarefas.js
 * Gerenciamento de tarefas ativas (aguardando + em andamento)
 */

/* ── Tab switching ── */
const tabs = document.querySelectorAll('.task-tab');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    
    // Update active tab
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Show target content
    contents.forEach(c => {
      c.classList.remove('active');
      if (c.id === `tab-${target}`) {
        c.classList.add('active');
      }
    });
  });
});

/* ── Cancel task confirmation ── */
document.querySelectorAll('.task-action-danger').forEach(btn => {
  btn.addEventListener('click', function() {
    const card = this.closest('.active-task-card');
    const title = card.querySelector('.task-card-title').textContent;
    
    if (confirm(`Tem certeza que deseja cancelar "${title}"?\n\nEsta ação não pode ser desfeita.`)) {
      // Simulate cancellation
      card.style.opacity = '0.5';
      card.style.pointerEvents = 'none';
      
      setTimeout(() => {
        card.remove();
        updateBadgeCounts();
        checkEmptyStates();
      }, 300);
    }
  });
});

/* ── Edit button (placeholder) ── */
document.querySelectorAll('.task-action-secondary').forEach(btn => {
  if (btn.textContent.includes('Editar')) {
    btn.addEventListener('click', () => {
      alert('Edição de tarefas em breve!\n\nPor enquanto, você pode cancelar e criar uma nova tarefa.');
    });
  }
});

/* ── Live counter increment simulation ── */
function animateCounter() {
  const counters = document.querySelectorAll('.status-text');
  counters.forEach(counter => {
    if (counter.textContent.includes('visualizaram')) {
      setInterval(() => {
        const match = counter.textContent.match(/(\d+) Motas/);
        if (match) {
          const current = parseInt(match[1]);
          if (current < 15 && Math.random() > 0.7) {
            counter.textContent = counter.textContent.replace(/\d+/, current + 1);
            // Brief highlight animation
            counter.style.color = 'var(--orange)';
            setTimeout(() => { counter.style.color = ''; }, 800);
          }
        }
      }, 8000);
    }
  });
}

animateCounter();

/* ── Countdown timer for expiry ── */
function updateTimers() {
  document.querySelectorAll('.status-time').forEach(timer => {
    const text = timer.textContent;
    if (text.includes('Expira em')) {
      // Parse time
      const match = text.match(/(\d+)h\s*(\d+)min|(\d+)min/);
      if (!match) return;
      
      let totalMinutes = match[3] ? parseInt(match[3]) : parseInt(match[1]) * 60 + parseInt(match[2]);
      
      setInterval(() => {
        totalMinutes--;
        if (totalMinutes <= 0) {
          timer.textContent = '⏱️ Expirado';
          timer.style.color = '#DC2626';
          return;
        }
        
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        
        if (h > 0) {
          timer.textContent = `⏱️ Expira em ${h}h ${m}min`;
        } else {
          timer.textContent = `⏱️ Expira em ${m}min`;
          if (m <= 5) timer.style.color = '#DC2626';
        }
      }, 60000); // Update every minute
    }
  });
}

updateTimers();

/* ── Update badge counts ── */
function updateBadgeCounts() {
  const aguardandoCount = document.querySelectorAll('#tab-aguardando .active-task-card').length;
  const andamentoCount = document.querySelectorAll('#tab-andamento .active-task-card').length;
  
  document.querySelectorAll('.task-tab').forEach(tab => {
    const badge = tab.querySelector('.tab-badge');
    if (tab.dataset.tab === 'aguardando') {
      badge.textContent = aguardandoCount;
    } else if (tab.dataset.tab === 'andamento') {
      badge.textContent = andamentoCount;
    }
  });
  
  // Update sidebar badge
  const sidebarBadge = document.querySelector('.nav-item.active .nav-badge');
  if (sidebarBadge) {
    sidebarBadge.textContent = aguardandoCount + andamentoCount;
  }
}

/* ── Check and show empty states ── */
function checkEmptyStates() {
  const aguardandoCards = document.querySelectorAll('#tab-aguardando .active-task-card');
  const andamentoCards = document.querySelectorAll('#tab-andamento .active-task-card');
  
  // Show empty state if no cards (would need to uncomment HTML)
  if (aguardandoCards.length === 0) {
    console.log('No waiting tasks - show empty state');
  }
  if (andamentoCards.length === 0) {
    console.log('No active tasks - show empty state');
  }
}

/* ── Card hover effect ── */
document.querySelectorAll('.active-task-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-2px)';
  });
  card.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});
