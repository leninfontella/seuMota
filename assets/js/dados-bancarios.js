/**
 * seuMota — dados-bancarios.js
 * Gerenciamento de dados bancários
 */

const $ = id => document.getElementById(id);

/* ── VIEW STATES ─────────────────────────────────── */
const views = {
  empty: $('emptyState'),
  card: $('bankCardView'),
  form: $('bankForm')
};

/* ── SHOW VIEW ──────────────────────────────────── */
function showView(viewName) {
  Object.values(views).forEach(view => view.style.display = 'none');
  views[viewName].style.display = 'block';
}

/* ── CHECK IF DATA EXISTS ───────────────────────── */
const hasBankData = localStorage.getItem('bankData');

if (hasBankData) {
  const data = JSON.parse(hasBankData);
  populateCard(data);
  showView('card');
} else {
  showView('empty');
}

/* ── POPULATE CARD ──────────────────────────────── */
function populateCard(data) {
  const bancoNome = $('banco').querySelector(`option[value="${data.banco}"]`)?.textContent || data.banco;
  $('displayBanco').textContent = bancoNome;
  $('displayAgencia').textContent = data.agencia;
  $('displayConta').textContent = data.conta;
  $('displayTipo').textContent = data.tipoConta === 'corrente' ? 'Conta Corrente' : 
                                  data.tipoConta === 'poupanca' ? 'Conta Poupança' : 'Conta Pagamento';
  $('displayTitular').textContent = data.titular;
}

/* ── ADD BUTTON ─────────────────────────────────── */
$('addBtn')?.addEventListener('click', () => {
  showView('form');
  $('form').reset();
});

/* ── EDIT BUTTON ────────────────────────────────── */
$('editBtn')?.addEventListener('click', () => {
  const data = JSON.parse(localStorage.getItem('bankData'));
  
  // Populate form
  $('banco').value = data.banco;
  $('agencia').value = data.agencia;
  $('conta').value = data.conta;
  $('tipoConta').value = data.tipoConta;
  $('cpf').value = data.cpf;
  $('titular').value = data.titular;
  
  showView('form');
});

/* ── REMOVE BUTTON ──────────────────────────────── */
$('removeBtn')?.addEventListener('click', () => {
  if (confirm('⚠️ Tem certeza que deseja remover seus dados bancários?\n\nVocê não receberá mais seus ganhos automaticamente até adicionar uma nova conta.')) {
    localStorage.removeItem('bankData');
    showView('empty');
    showToast('🗑️ Dados bancários removidos');
  }
});

/* ── CANCEL BUTTON ──────────────────────────────── */
$('cancelBtn')?.addEventListener('click', () => {
  if (localStorage.getItem('bankData')) {
    showView('card');
  } else {
    showView('empty');
  }
});

/* ── INPUT MASKS ────────────────────────────────── */
// CPF mask: 000.000.000-00
$('cpf')?.addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  
  e.target.value = value;
});

// Agencia: only numbers
$('agencia')?.addEventListener('input', function(e) {
  e.target.value = e.target.value.replace(/\D/g, '');
});

// Conta: numbers and dash
$('conta')?.addEventListener('input', function(e) {
  e.target.value = e.target.value.replace(/[^\d-]/g, '');
});

/* ── VALIDATION HELPERS ─────────────────────────── */
function showError(fieldId, errId, show) {
  $(fieldId)?.classList.toggle('error', show);
  $(errId)?.classList.toggle('visible', show);
}

function isValidCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11) return false;
  
  // Check if all digits are the same
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  // Validate check digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 > 9) digit1 = 0;
  if (parseInt(cpf.charAt(9)) !== digit1) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 > 9) digit2 = 0;
  if (parseInt(cpf.charAt(10)) !== digit2) return false;
  
  return true;
}

/* ── INLINE VALIDATION ──────────────────────────── */
$('banco')?.addEventListener('blur', () => {
  showError('banco', 'bancoErr', !$('banco').value);
});

$('agencia')?.addEventListener('blur', () => {
  const value = $('agencia').value;
  showError('agencia', 'agenciaErr', value.length !== 4);
});

$('conta')?.addEventListener('blur', () => {
  showError('conta', 'contaErr', !$('conta').value);
});

$('tipoConta')?.addEventListener('blur', () => {
  showError('tipoConta', 'tipoContaErr', !$('tipoConta').value);
});

$('cpf')?.addEventListener('blur', () => {
  const value = $('cpf').value;
  showError('cpf', 'cpfErr', !isValidCPF(value));
});

$('titular')?.addEventListener('blur', () => {
  showError('titular', 'titularErr', !$('titular').value.trim());
});

// Remove error on input
['banco', 'agencia', 'conta', 'tipoConta', 'cpf', 'titular'].forEach(id => {
  $(id)?.addEventListener('input', () => $(id).classList.remove('error'));
});

/* ── FORM SUBMIT ────────────────────────────────── */
$('form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const banco = $('banco').value;
  const agencia = $('agencia').value;
  const conta = $('conta').value;
  const tipoConta = $('tipoConta').value;
  const cpf = $('cpf').value;
  const titular = $('titular').value.trim();
  
  let ok = true;
  
  // Validate all fields
  showError('banco', 'bancoErr', !banco);
  showError('agencia', 'agenciaErr', agencia.length !== 4);
  showError('conta', 'contaErr', !conta);
  showError('tipoConta', 'tipoContaErr', !tipoConta);
  showError('cpf', 'cpfErr', !isValidCPF(cpf));
  showError('titular', 'titularErr', !titular);
  
  if (!banco || agencia.length !== 4 || !conta || !tipoConta || !isValidCPF(cpf) || !titular) {
    ok = false;
  }
  
  if (!ok) return;
  
  const btn = $('saveBtn');
  btn.textContent = 'Salvando...';
  btn.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    const data = { banco, agencia, conta, tipoConta, cpf, titular };
    localStorage.setItem('bankData', JSON.stringify(data));
    
    populateCard(data);
    showView('card');
    showToast('✅ Dados bancários salvos com sucesso!');
    
    btn.textContent = '💾 Salvar dados';
    btn.disabled = false;
  }, 1000);
});

/* ── TOAST ──────────────────────────────────────── */
function showToast(msg) {
  const toast = $('toast');
  if (!toast) return;
  toast.textContent = msg;
  setTimeout(() => { toast.textContent = ''; }, 3500);
}
