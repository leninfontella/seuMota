/**
 * seuMota — tarefas-recorrentes.js
 * Gestão de tarefas recorrentes
 */

/* ── Toggle switches (ativar/pausar) ── */
document.querySelectorAll('.toggle-switch input').forEach(toggle => {
  toggle.addEventListener('change', function() {
    const card = this.closest('.recurrence-card');
    const title = card.querySelector('.rec-title').textContent;
    
    if (this.checked) {
      card.classList.remove('paused');
      card.querySelector('.rec-actions button').disabled = false;
      card.querySelector('.rec-actions button').style.opacity = '';
      card.querySelector('.rec-actions button').style.cursor = '';
      console.log(`✅ Recorrência ativada: ${title}`);
    } else {
      card.classList.add('paused');
      card.querySelector('.rec-actions button').disabled = true;
      card.querySelector('.rec-actions button').style.opacity = '.5';
      card.querySelector('.rec-actions button').style.cursor = 'not-allowed';
      console.log(`⏸️ Recorrência pausada: ${title}`);
    }
  });
});

/* ── Criar agora button ── */
document.querySelectorAll('.rec-action-primary').forEach(btn => {
  if (btn.textContent.includes('Criar agora')) {
    btn.addEventListener('click', function() {
      const card = this.closest('.recurrence-card');
      const title = card.querySelector('.rec-title').textContent;
      
      if (confirm(`Criar tarefa "${title}" imediatamente?\n\nVocê será redirecionado para escolher o Mota.`)) {
        console.log(`📋 Criando tarefa: ${title}`);
        // Simulate redirect
        setTimeout(() => {
          window.location.href = 'aguardando-mota.html';
        }, 500);
      }
    });
  }
});

/* ── Editar button ── */
document.querySelectorAll('.rec-action-secondary').forEach(btn => {
  if (btn.textContent.includes('Editar')) {
    btn.addEventListener('click', function() {
      const card = this.closest('.recurrence-card');
      const title = card.querySelector('.rec-title').textContent;
      
      alert(`✏️ Edição de recorrência em breve!\n\nRecorrência: ${title}\n\nEm breve você poderá alterar:\n• Frequência\n• Horário\n• Detalhes da tarefa\n• Mota favorito`);
    });
  }
});

/* ── Ver histórico button ── */
document.querySelectorAll('.rec-action-secondary').forEach(btn => {
  if (btn.textContent.includes('histórico')) {
    btn.addEventListener('click', function() {
      const card = this.closest('.recurrence-card');
      const title = card.querySelector('.rec-title').textContent;
      const execCount = card.querySelector('.rec-stat-val').textContent;
      
      alert(`📜 Histórico de execuções\n\nRecorrência: ${title}\nTotal executado: ${execCount}\n\n[Em breve: lista detalhada com datas, Motas e valores de cada execução]`);
    });
  }
});

/* ── Excluir button ── */
document.querySelectorAll('.rec-action-danger').forEach(btn => {
  btn.addEventListener('click', function() {
    const card = this.closest('.recurrence-card');
    const title = card.querySelector('.rec-title').textContent;
    
    if (confirm(`⚠️ Tem certeza que deseja excluir a recorrência?\n\n"${title}"\n\nEsta ação não pode ser desfeita. O histórico de execuções será mantido, mas novas tarefas não serão mais criadas automaticamente.`)) {
      // Animate removal
      card.style.opacity = '0';
      card.style.transform = 'translateX(-20px)';
      
      setTimeout(() => {
        card.remove();
        checkEmptyState();
        console.log(`🗑️ Recorrência excluída: ${title}`);
      }, 300);
    }
  });
});

/* ── Nova recorrência button (topbar) ── */
document.querySelector('.topbar-right .icon-btn')?.addEventListener('click', () => {
  alert('➕ Criação de recorrência em breve!\n\nVocê poderá configurar:\n\n📋 Tipo de tarefa\n🔁 Frequência (diária, semanal, mensal)\n📅 Dias da semana\n🕐 Horário preferido\n📍 Localização\n⭐ Mota favorito (opcional)\n💰 Orçamento\n📝 Instruções detalhadas');
});

/* ── Check if empty and show empty state ── */
function checkEmptyState() {
  const cards = document.querySelectorAll('.recurrence-card');
  const emptyState = document.getElementById('emptyState');
  
  if (cards.length === 0 && emptyState) {
    emptyState.style.display = 'block';
  }
}

/* ── Card hover effect ── */
document.querySelectorAll('.recurrence-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    if (!this.classList.contains('paused')) {
      this.style.transform = 'translateY(-2px)';
    }
  });
  card.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

/* ── Update next execution countdown (simulated) ── */
function updateNextExecution() {
  document.querySelectorAll('.rec-stat').forEach(stat => {
    if (stat.textContent.includes('Próxima:')) {
      // In production, this would calculate time until next execution
      // and update dynamically
      console.log('Próxima execução checada');
    }
  });
}

// Check every minute
setInterval(updateNextExecution, 60000);
