/**
 * seuMota — admin-configuracoes.js
 * Admin system configuration management
 */

const $ = id => document.getElementById(id);

/* ── SAVE SETTING ───────────────────────────────── */
window.saveSetting = function(id) {
  const input = $(id);
  if (!input) return;
  
  const value = input.value;
  localStorage.setItem(`admin_config_${id}`, value);
  
  showToast(`✅ ${id} salvo: ${value}`);
  logAction('CONFIG_UPDATE', `${id} atualizado para ${value}`);
};

/* ── TOGGLE SETTING ─────────────────────────────── */
window.toggleSetting = function(id) {
  const statusElement = $(`${id}Status`);
  if (!statusElement) return;
  
  const isActive = statusElement.classList.contains('pill-green');
  
  if (isActive) {
    statusElement.classList.remove('pill-green');
    statusElement.classList.add('pill-gray');
    statusElement.textContent = '○ Inativo';
  } else {
    statusElement.classList.remove('pill-gray');
    statusElement.classList.add('pill-green');
    statusElement.textContent = '✓ Ativo';
  }
  
  showToast(`${isActive ? '❌' : '✅'} ${id} ${isActive ? 'desativado' : 'ativado'}`);
  logAction('CONFIG_TOGGLE', `${id} ${isActive ? 'desativado' : 'ativado'}`);
};

/* ── TOGGLE MAINTENANCE ─────────────────────────── */
window.toggleMaintenance = function() {
  const btn = $('modoManutencaoBtn');
  const statusElement = $('modoManutencaoStatus');
  
  const isActive = statusElement.classList.contains('pill-gray');
  
  if (!isActive) {
    // Currently active, turn off
    if (!confirm('⚠️ Desativar modo manutenção?\n\nOs usuários poderão acessar a plataforma novamente.')) return;
    
    statusElement.classList.remove('pill-green');
    statusElement.classList.add('pill-gray');
    statusElement.textContent = '○ Inativo';
    btn.textContent = '🔧 Ativar modo manutenção';
    
    showToast('✅ Modo manutenção desativado');
    logAction('MAINTENANCE_OFF', 'Modo manutenção desativado');
  } else {
    // Currently inactive, turn on
    if (!confirm('⚠️ ATENÇÃO: Ativar modo manutenção?\n\nTodos os usuários serão desconectados e não poderão acessar a plataforma.\n\nDeseja continuar?')) return;
    
    statusElement.classList.remove('pill-gray');
    statusElement.classList.add('pill-green');
    statusElement.textContent = '✓ Ativo';
    btn.textContent = '🔓 Desativar modo manutenção';
    
    showToast('⚠️ Modo manutenção ativado!');
    logAction('MAINTENANCE_ON', 'Modo manutenção ativado');
  }
};

/* ── CONFIRM RESET ──────────────────────────────── */
window.confirmReset = function() {
  if (!confirm('⚠️ ATENÇÃO: Resetar TODAS as configurações?\n\nTodas as configurações voltarão aos valores padrão.\n\nEsta ação não pode ser desfeita!')) return;
  
  if (confirm('Digite "RESETAR" para confirmar (letras maiúsculas)')) {
    const confirmText = prompt('Digite RESETAR para confirmar:');
    if (confirmText === 'RESETAR') {
      // Clear all config from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('admin_config_')) {
          localStorage.removeItem(key);
        }
      });
      
      showToast('🔄 Configurações resetadas! Recarregando...');
      logAction('CONFIG_RESET', 'Todas as configurações foram resetadas');
      
      setTimeout(() => {
        location.reload();
      }, 2000);
    } else {
      showToast('❌ Texto incorreto. Reset cancelado.');
    }
  }
};

/* ── LOAD SAVED VALUES ──────────────────────────── */
function loadSavedValues() {
  // Load all numeric inputs
  const inputs = ['taxaPlataforma', 'taxaSaque', 'saqueMinimo', 'tarefaMinima', 'tarefaMaxima', 
                  'raioMaximo', 'tarefasSimultaneas', 'tempoAnalise', 'limiteReportes', 
                  'duracaoSuspensao', 'retencaoLogs'];
  
  inputs.forEach(id => {
    const input = $(id);
    if (!input) return;
    
    const saved = localStorage.getItem(`admin_config_${id}`);
    if (saved !== null) {
      input.value = saved;
    }
  });
}

/* ── LOG ACTION ─────────────────────────────────── */
function logAction(action, details) {
  const logs = JSON.parse(localStorage.getItem('admin_logs') || '[]');
  
  logs.unshift({
    timestamp: new Date().toISOString(),
    action,
    details,
    admin: 'Admin seuMota',
    ip: '192.168.1.100',
    type: 'info'
  });

  // Keep only last 1000 logs
  if (logs.length > 1000) logs.pop();
  
  localStorage.setItem('admin_logs', JSON.stringify(logs));
}

/* ── TOAST ──────────────────────────────────────── */
function showToast(msg) {
  const toast = $('toast');
  if (!toast) return;
  toast.textContent = msg;
  setTimeout(() => { toast.textContent = ''; }, 3500);
}

/* ── INITIALIZE ─────────────────────────────────── */
loadSavedValues();
