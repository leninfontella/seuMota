/**
 * seuMota — admin-financeiro.js
 * Financeiro admin panel
 */

/* ── Period filter buttons ── */
const periodBtns = document.querySelectorAll('.period-btn');

periodBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    periodBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    
    const period = this.textContent;
    showToast(`📊 Atualizando dados — ${period}`);
    
    // Simulate data refresh
    setTimeout(() => {
      console.log(`Dados atualizados para: ${period}`);
    }, 800);
  });
});

/* ── Export report button ── */
document.querySelector('.admin-btn-ghost').addEventListener('click', () => {
  const period = document.querySelector('.period-btn.active').textContent;
  
  if (confirm(`Exportar relatório financeiro de "${period}" em formato CSV?`)) {
    showToast('📥 Gerando relatório...');
    
    setTimeout(() => {
      // Simulate CSV download
      const csvContent = 'ID,Data,Tipo,Cliente,Mota,Valor,Taxa,Status\n' +
        '#TX-8473,18 fev 14h32,Pagamento,Ana Paula F.,João Pedro,R$ 25.00,R$ 3.75,Concluído\n';
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `relatorio-financeiro-${period.toLowerCase().replace(/ /g, '-')}.csv`;
      link.click();
      
      showToast('✅ Relatório exportado!');
    }, 1500);
  }
});

/* ── Toast notification ── */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  setTimeout(() => { toast.textContent = ''; }, 3000);
}

/* ── Pagination buttons ── */
document.querySelectorAll('.page-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    if (this.textContent === '...' || this.textContent === '←' || this.textContent === '→') return;
    
    document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    
    showToast(`📄 Carregando página ${this.textContent}...`);
  });
});

/* ── Highlight negative values ── */
document.querySelectorAll('td').forEach(td => {
  if (td.textContent.includes('-R$')) {
    td.style.color = '#DC2626';
  }
});

/* ── Custom period (placeholder) ── */
periodBtns.forEach(btn => {
  if (btn.textContent === 'Personalizado') {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      alert('📅 Seletor de período personalizado em breve!\n\nPermitirá escolher data inicial e final.');
    });
  }
});

/* ── Auto-refresh indicator (simulated) ── */
let autoRefresh = true;
setInterval(() => {
  if (autoRefresh) {
    // Subtle indicator that data is being monitored
    console.log('🔄 Monitoramento ativo — dados atualizados');
  }
}, 30000); // Every 30 seconds
