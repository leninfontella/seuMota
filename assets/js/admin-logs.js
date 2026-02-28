/**
 * seuMota — admin-logs.js
 * Admin system logs viewer
 */

const $ = id => document.getElementById(id);

/* ── MOCK LOG DATA ──────────────────────────────── */
const mockLogs = [
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    type: 'success',
    action: 'USER_LOGIN',
    details: 'Usuário João Pedro (ID: 1234) fez login com sucesso',
    admin: 'Sistema',
    ip: '192.168.1.45'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    type: 'info',
    action: 'TASK_CREATED',
    details: 'Nova tarefa criada: Compras no mercado (ID: 8742)',
    admin: 'Sistema',
    ip: '192.168.1.78'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    type: 'success',
    action: 'PAYMENT_PROCESSED',
    details: 'Pagamento de R$ 25,00 processado para João Pedro',
    admin: 'Sistema',
    ip: '192.168.1.45'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    type: 'warning',
    action: 'LOGIN_ATTEMPT_FAILED',
    details: 'Tentativa de login falhou 3 vezes para usuario@email.com',
    admin: 'Sistema',
    ip: '192.168.1.99'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    type: 'security',
    action: 'ADMIN_LOGIN',
    details: 'Admin seuMota fez login no painel administrativo',
    admin: 'Admin seuMota',
    ip: '192.168.1.1'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    type: 'error',
    action: 'API_ERROR',
    details: 'Erro ao processar requisição de pagamento: Gateway timeout',
    admin: 'Sistema',
    ip: 'N/A'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    type: 'info',
    action: 'BACKUP_COMPLETED',
    details: 'Backup automático do banco de dados concluído (1.2GB)',
    admin: 'Sistema',
    ip: 'N/A'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    type: 'success',
    action: 'MOTA_VERIFIED',
    details: 'Mota Marcos Oliveira (ID: 892) verificado e aprovado',
    admin: 'Admin seuMota',
    ip: '192.168.1.1'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    type: 'warning',
    action: 'REPORT_CREATED',
    details: 'Novo reporte: Cliente reportou Mota por não comparecimento',
    admin: 'Sistema',
    ip: '192.168.1.67'
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    type: 'security',
    action: 'USER_SUSPENDED',
    details: 'Conta de Diego Alves suspensa por 7 dias devido a múltiplos reportes',
    admin: 'Admin seuMota',
    ip: '192.168.1.1'
  }
];

// Load from localStorage and merge with mock
let allLogs = [
  ...(JSON.parse(localStorage.getItem('admin_logs') || '[]')),
  ...mockLogs
];

// Sort by timestamp (newest first)
allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

let filteredLogs = [...allLogs];

/* ── RENDER LOGS ────────────────────────────────── */
function renderLogs() {
  const logsList = $('logsList');
  const emptyState = $('emptyState');

  if (filteredLogs.length === 0) {
    logsList.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  logsList.style.display = 'block';
  emptyState.style.display = 'none';

  const typeIcons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    security: '🔒'
  };

  logsList.innerHTML = filteredLogs.map(log => `
    <div class="log-entry">
      <div class="log-icon ${log.type}">
        ${typeIcons[log.type]}
      </div>
      <div class="log-content">
        <div class="log-header">
          <div class="log-action">${log.action.replace(/_/g, ' ')}</div>
          <div class="log-badge ${log.type}">${log.type}</div>
        </div>
        <div class="log-details">${log.details}</div>
        <div class="log-meta">
          <div class="log-meta-item">
            <span>🕐</span>
            <span class="log-time">${formatTimestamp(log.timestamp)}</span>
          </div>
          <div class="log-meta-item">
            <span>👤</span>
            <span>${log.admin}</span>
          </div>
          <div class="log-meta-item">
            <span>🌐</span>
            <span>${log.ip}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  updateStats();
}

/* ── FORMAT TIMESTAMP ───────────────────────────── */
function formatTimestamp(iso) {
  const date = new Date(iso);
  const now = new Date();
  const diff = now - date;

  // Less than 1 hour
  if (diff < 3600000) {
    const mins = Math.floor(diff / 60000);
    return `há ${mins} min${mins > 1 ? 's' : ''}`;
  }

  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `há ${hours}h`;
  }

  // More than 24 hours
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${mins}`;
}

/* ── UPDATE STATS ───────────────────────────────── */
function updateStats() {
  const totalLogs = allLogs.length;
  const todayLogs = allLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    const today = new Date();
    return logDate.toDateString() === today.toDateString();
  }).length;
  const errorLogs = allLogs.filter(log => log.type === 'error').length;
  const securityLogs = allLogs.filter(log => log.type === 'security').length;

  $('totalLogs').textContent = totalLogs;
  $('todayLogs').textContent = todayLogs;
  $('errorLogs').textContent = errorLogs;
  $('securityLogs').textContent = securityLogs;

  $('logCount').textContent = `${filteredLogs.length} log${filteredLogs.length !== 1 ? 's' : ''} exibido${filteredLogs.length !== 1 ? 's' : ''}`;
}

/* ── FILTER BY TYPE ─────────────────────────────── */
const filterChips = document.querySelectorAll('.filter-chip');

filterChips.forEach(chip => {
  chip.addEventListener('click', function() {
    const filter = this.dataset.filter;

    // Update active chip
    filterChips.forEach(c => c.classList.remove('active'));
    this.classList.add('active');

    // Filter logs
    if (filter === 'all') {
      filteredLogs = [...allLogs];
    } else {
      filteredLogs = allLogs.filter(log => log.type === filter);
    }

    // Apply search if active
    const searchTerm = $('searchInput').value.toLowerCase();
    if (searchTerm) {
      filteredLogs = filteredLogs.filter(log => 
        log.action.toLowerCase().includes(searchTerm) ||
        log.details.toLowerCase().includes(searchTerm) ||
        log.admin.toLowerCase().includes(searchTerm)
      );
    }

    renderLogs();
  });
});

/* ── SEARCH ─────────────────────────────────────── */
$('searchInput')?.addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase();

  // Get current filter
  const activeFilter = document.querySelector('.filter-chip.active').dataset.filter;
  
  // Start with filtered logs
  if (activeFilter === 'all') {
    filteredLogs = [...allLogs];
  } else {
    filteredLogs = allLogs.filter(log => log.type === activeFilter);
  }

  // Apply search
  if (searchTerm) {
    filteredLogs = filteredLogs.filter(log => 
      log.action.toLowerCase().includes(searchTerm) ||
      log.details.toLowerCase().includes(searchTerm) ||
      log.admin.toLowerCase().includes(searchTerm)
    );
  }

  renderLogs();
});

/* ── REFRESH ────────────────────────────────────── */
$('refreshBtn')?.addEventListener('click', () => {
  const btn = $('refreshBtn');
  btn.textContent = '⏳';
  btn.disabled = true;

  // Simulate fetch
  setTimeout(() => {
    // Reload from localStorage
    allLogs = [
      ...(JSON.parse(localStorage.getItem('admin_logs') || '[]')),
      ...mockLogs
    ];
    allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Reapply current filter
    const activeFilter = document.querySelector('.filter-chip.active').dataset.filter;
    if (activeFilter === 'all') {
      filteredLogs = [...allLogs];
    } else {
      filteredLogs = allLogs.filter(log => log.type === activeFilter);
    }

    renderLogs();
    btn.textContent = '🔄 Atualizar';
    btn.disabled = false;
    showToast('✅ Logs atualizados');
  }, 500);
});

/* ── EXPORT ─────────────────────────────────────── */
$('exportBtn')?.addEventListener('click', () => {
  const data = JSON.stringify(filteredLogs, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `seumota-logs-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('📥 Logs exportados com sucesso');
});

/* ── AUTO-REFRESH ───────────────────────────────── */
// Refresh every 30 seconds
setInterval(() => {
  console.log('🔄 Auto-refresh logs...');
  // In production, this would fetch from API
}, 30000);

/* ── TOAST ──────────────────────────────────────── */
function showToast(msg) {
  const toast = $('toast');
  if (!toast) return;
  toast.textContent = msg;
  setTimeout(() => { toast.textContent = ''; }, 3000);
}

/* ── INITIALIZE ─────────────────────────────────── */
renderLogs();
