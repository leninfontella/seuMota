/**
 * seuMota — perfil-usuario.js
 * Edição inline de dados, endereços, foto, toast, código de indicação
 */

/* ─── TOAST ───────────────────────────────────────── */
function showToast(msg, duration = 2800) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

/* ─── GENERIC SECTION EDITOR ──────────────────────── */
function makeSectionEditable(editBtnId, saveBtn, cancelBtn, fieldIds, actionsId) {
  const editBtn = document.getElementById(editBtnId);
  const save    = document.getElementById(saveBtn);
  const cancel  = document.getElementById(cancelBtn);
  const actions = document.getElementById(actionsId);
  const fields  = fieldIds.map(id => document.getElementById(id));

  let originalValues = [];

  editBtn?.addEventListener('click', () => {
    originalValues = fields.map(f => f?.value || '');
    fields.forEach(f => { if (f) f.disabled = false; });
    if (actions) actions.style.display = 'flex';
    editBtn.style.display = 'none';
    fields[0]?.focus();
  });

  save?.addEventListener('click', () => {
    fields.forEach(f => { if (f) f.disabled = true; });
    if (actions) actions.style.display = 'none';
    editBtn.style.display = '';
    showToast('✅ Dados atualizados com sucesso!');
  });

  cancel?.addEventListener('click', () => {
    fields.forEach((f, i) => {
      if (f) { f.value = originalValues[i]; f.disabled = true; }
    });
    if (actions) actions.style.display = 'none';
    editBtn.style.display = '';
  });
}

makeSectionEditable(
  'editPersonalBtn', 'savePersonalBtn', 'cancelPersonalBtn',
  ['fieldNome', 'fieldSobrenome', 'fieldNasc'],
  'personalActions'
);

makeSectionEditable(
  'editContactBtn', 'saveContactBtn', 'cancelContactBtn',
  ['fieldEmail', 'fieldTel'],
  'contactActions'
);

/* ─── PROFILE PIC ─────────────────────────────────── */
document.getElementById('picAvatar')?.addEventListener('click', () => {
  showToast('📷 Upload de foto disponível no app móvel');
});

document.getElementById('changePicBtn')?.addEventListener('click', () => {
  showToast('📷 Upload de foto disponível no app móvel');
});

/* ─── ADDRESS MODAL ───────────────────────────────── */
const addressModal = document.getElementById('addressModal');
const addressList  = document.getElementById('addressList');

document.getElementById('addAddressBtn')?.addEventListener('click', () => {
  if (addressModal) addressModal.style.display = 'flex';
});

document.getElementById('cancelAddrBtn')?.addEventListener('click', () => {
  if (addressModal) addressModal.style.display = 'none';
});

addressModal?.addEventListener('click', e => {
  if (e.target === addressModal) addressModal.style.display = 'none';
});

document.getElementById('saveAddrBtn')?.addEventListener('click', () => {
  const label = document.getElementById('newAddrLabel')?.value.trim();
  const full  = document.getElementById('newAddrFull')?.value.trim();
  if (!label || !full) { showToast('⚠️ Preencha todos os campos'); return; }

  const icons = { casa: '🏠', trabalho: '💼', academia: '🏋️', mercado: '🛒' };
  const icon  = icons[label.toLowerCase()] || '📍';

  const card = document.createElement('div');
  card.className = 'address-card';
  card.dataset.addr = label.toLowerCase().replace(/\s+/g, '-');
  card.innerHTML = `
    <div class="address-icon">${icon}</div>
    <div class="address-info">
      <div class="address-label">${label}</div>
      <div class="address-full">${full}</div>
    </div>`;
  addressList?.appendChild(card);

  document.getElementById('newAddrLabel').value = '';
  document.getElementById('newAddrFull').value  = '';
  addressModal.style.display = 'none';
  showToast('📍 Endereço adicionado!');
});

/* ─── REFERRAL COPY ───────────────────────────────── */
document.getElementById('copyRefBtn')?.addEventListener('click', () => {
  navigator.clipboard?.writeText('ANAPAULA10').catch(() => {});
  showToast('📋 Código copiado: ANAPAULA10');
});

/* ─── DANGER ZONE ─────────────────────────────────── */
document.getElementById('deactivateBtn')?.addEventListener('click', () => {
  if (confirm('Tem certeza que deseja desativar sua conta? Você poderá reativá-la depois.')) {
    showToast('😴 Conta desativada. Entre em contato para reativar.');
  }
});

document.getElementById('deleteBtn')?.addEventListener('click', () => {
  if (confirm('⚠️ ATENÇÃO: Esta ação é irreversível! Todos os seus dados serão apagados. Continuar?')) {
    showToast('🗑️ Solicitação enviada. Nossa equipe entrará em contato.');
  }
});
