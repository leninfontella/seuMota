/**
 * seuMota — configuracoes-mota.js
 * Configurações do Mota
 */

const $ = id => document.getElementById(id);

/* ── RAIO SLIDER ────────────────────────────────── */
const raioSlider = $('raioSlider');
const raioValue = $('raioValue');

if (raioSlider && raioValue) {
  // Load saved value
  const savedRaio = localStorage.getItem('motaRaio') || '2.0';
  raioSlider.value = savedRaio;
  raioValue.textContent = `${savedRaio} km`;

  raioSlider.addEventListener('input', function() {
    const value = parseFloat(this.value).toFixed(1);
    raioValue.textContent = `${value} km`;
  });

  raioSlider.addEventListener('change', function() {
    const value = parseFloat(this.value).toFixed(1);
    localStorage.setItem('motaRaio', value);
    showToast(`✅ Raio atualizado para ${value}km`);
  });
}

/* ── CATEGORY CHIPS TOGGLE ──────────────────────── */
document.querySelectorAll('.category-chip').forEach(chip => {
  chip.addEventListener('click', function() {
    this.classList.toggle('active');
    
    // Save to localStorage
    const categories = Array.from(document.querySelectorAll('.category-chip.active'))
      .map(c => c.dataset.cat);
    localStorage.setItem('motaCategorias', JSON.stringify(categories));
    
    showToast('✅ Preferências atualizadas');
  });
});

// Load saved categories
const savedCats = JSON.parse(localStorage.getItem('motaCategorias') || '[]');
if (savedCats.length > 0) {
  document.querySelectorAll('.category-chip').forEach(chip => {
    if (savedCats.includes(chip.dataset.cat)) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
}

/* ── TOGGLE SWITCHES ────────────────────────────── */
const toggles = [
  'autoAccept',
  'notifTarefas',
  'notifMensagens',
  'notifAvaliacoes',
  'notifLembretes',
  'notifSom',
  'privLocalizacao',
  'privPerfil',
  'privAtividade'
];

toggles.forEach(id => {
  const toggle = $(id);
  if (!toggle) return;

  // Load saved state
  const saved = localStorage.getItem(`mota_${id}`);
  if (saved !== null) {
    toggle.checked = saved === 'true';
  }

  // Save on change
  toggle.addEventListener('change', function() {
    localStorage.setItem(`mota_${id}`, this.checked);
    
    const labels = {
      autoAccept: 'Aceite automático',
      notifTarefas: 'Notificações de tarefas',
      notifMensagens: 'Notificações de mensagens',
      notifAvaliacoes: 'Notificações de avaliações',
      notifLembretes: 'Lembretes de tarefa',
      notifSom: 'Som de notificação',
      privLocalizacao: 'Localização aproximada',
      privPerfil: 'Perfil público',
      privAtividade: 'Última atividade'
    };
    
    const status = this.checked ? 'ativado' : 'desativado';
    showToast(`${labels[id]} ${status}`);
  });
});

/* ── PAUSE ACCOUNT ──────────────────────────────── */
$('pauseBtn')?.addEventListener('click', () => {
  if (confirm('⏸️ Pausar sua conta?\n\nVocê não receberá mais ofertas de tarefas e ficará invisível para clientes.\n\nPode reativar a qualquer momento.')) {
    showToast('⏸️ Conta pausada. Faça login novamente para reativar.');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  }
});

/* ── DELETE ACCOUNT ─────────────────────────────── */
$('deleteBtn')?.addEventListener('click', () => {
  if (confirm('⚠️ ATENÇÃO: Excluir conta permanentemente?\n\nTodos os seus dados serão apagados:\n• Histórico de tarefas\n• Ganhos\n• Avaliações\n• Dados bancários\n\nEsta ação NÃO PODE ser desfeita!')) {
    if (confirm('Digite "EXCLUIR" para confirmar (letras maiúsculas)')) {
      const confirmText = prompt('Digite EXCLUIR para confirmar:');
      if (confirmText === 'EXCLUIR') {
        // Clear all localStorage
        localStorage.clear();
        showToast('🗑️ Conta excluída. Você será redirecionado...');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2500);
      } else {
        showToast('❌ Texto incorreto. Exclusão cancelada.');
      }
    }
  }
});

/* ── TOAST ──────────────────────────────────────── */
function showToast(msg) {
  const toast = $('toast');
  if (!toast) return;
  toast.textContent = msg;
  setTimeout(() => { toast.textContent = ''; }, 3500);
}

/* ── AUTO-SAVE NOTIFICATION ─────────────────────── */
let saveTimeout;
function autoSaveNotify() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    console.log('⚡ Configurações salvas automaticamente');
  }, 1000);
}

// Trigger auto-save on any change
document.querySelectorAll('input, select').forEach(input => {
  input.addEventListener('change', autoSaveNotify);
});
