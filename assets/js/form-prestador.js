/**
 * seuMota — form-prestador.js
 * Formulário multi-etapas do cadastro de Mota (prestador)
 */

/* ─── HELPERS ─────────────────────────────────────── */
const $ = id => document.getElementById(id);

let currentStep = 1;
const TOTAL_STEPS = 4;

const STEP_TITLES = [
  'Dados pessoais',
  'Endereço',
  'Perfil e categorias',
  'Senha e documentos',
];

function showError(fieldId, errId, show) {
  const field = $(fieldId);
  const err   = $(errId);
  if (field) field.classList.toggle('error', show);
  if (err)   err.classList.toggle('visible', show);
}

function isValidEmail(v)  { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isValidPhone(v)  { return v.replace(/\D/g, '').length >= 10; }
function isValidCEP(v)    { return v.replace(/\D/g, '').length === 8; }
function isValidCPF(v)    { return v.replace(/\D/g, '').length === 11; }

function isAdult(dateStr) {
  if (!dateStr) return false;
  const birth = new Date(dateStr);
  const now   = new Date();
  const age   = now.getFullYear() - birth.getFullYear();
  const m     = now.getMonth() - birth.getMonth();
  return age > 18 || (age === 18 && m >= 0);
}

/* ─── MASKS ───────────────────────────────────────── */
function applyMask(el, fn) {
  el?.addEventListener('input', () => { el.value = fn(el.value); });
}

const maskPhone = v => {
  v = v.replace(/\D/g, '').slice(0, 11);
  if (v.length > 6) return `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  if (v.length > 2) return `(${v.slice(0,2)}) ${v.slice(2)}`;
  if (v.length > 0) return `(${v}`;
  return v;
};

const maskCPF = v => {
  v = v.replace(/\D/g, '').slice(0, 11);
  if (v.length > 9) return `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9)}`;
  if (v.length > 6) return `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`;
  if (v.length > 3) return `${v.slice(0,3)}.${v.slice(3)}`;
  return v;
};

const maskCEP = v => {
  v = v.replace(/\D/g, '').slice(0, 8);
  if (v.length > 5) return `${v.slice(0,5)}-${v.slice(5)}`;
  return v;
};

applyMask($('p_phone'), maskPhone);
applyMask($('p_cpf'),   maskCPF);
applyMask($('p_cep'),   maskCEP);

/* ─── CEP AUTOFILL ────────────────────────────────── */
$('p_cep')?.addEventListener('blur', async () => {
  const cep = $('p_cep').value.replace(/\D/g, '');
  if (cep.length !== 8) return;

  try {
    const res  = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();
    if (data.erro) return;

    if ($('p_street'))       $('p_street').value       = data.logradouro || '';
    if ($('p_neighborhood')) $('p_neighborhood').value = data.bairro     || '';
    if ($('p_city'))         $('p_city').value          = `${data.localidade} / ${data.uf}`;
  } catch (_) {
    // silently fail — user fills manually
  }
});

/* ─── PASSWORD TOGGLES ────────────────────────────── */
document.querySelectorAll('.toggle-pass').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = $(btn.dataset.target);
    if (!input) return;
    const isPass = input.type === 'password';
    input.type   = isPass ? 'text' : 'password';
    btn.textContent = isPass ? '🙈' : '👁️';
  });
});

/* ─── PHOTO PREVIEW ───────────────────────────────── */
function setupPhotoPreview(inputId, previewId, iconId, labelId) {
  const input   = $(inputId);
  const preview = $(previewId);
  if (!input || !preview) return;

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      preview.src     = e.target.result;
      preview.style.display = 'block';
      if ($(iconId))  $(iconId).style.display  = 'none';
      if ($(labelId)) $(labelId).textContent    = '✅ Foto carregada!';
    };
    reader.readAsDataURL(file);
  });
}

setupPhotoPreview('p_photo',    'photoPreview',    'photoIcon',  'photoLabel');
setupPhotoPreview('p_selfie',   'selfiePreview',   'selfieIcon', 'selfieLabel');
setupPhotoPreview('p_docFront', 'docFrontPreview', null, null);
setupPhotoPreview('p_docBack',  'docBackPreview',  null, null);

/* ─── CATEGORY CHECKBOXES ─────────────────────────── */
document.querySelectorAll('.cat-check').forEach(label => {
  const checkbox = label.querySelector('input[type="checkbox"]');
  if (!checkbox) return;

  checkbox.addEventListener('change', () => {
    label.classList.toggle('selected', checkbox.checked);
  });
});

/* ─── STEPPER UI ──────────────────────────────────── */
function updateStepper(step) {
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const circle = $(`sc${i}`);
    const label  = $(`sl${i}`);
    const line   = $(`line${i}`);

    circle?.classList.remove('active', 'done');
    label?.classList.remove('active', 'done');

    if (i < step) {
      circle?.classList.add('done');
      label?.classList.add('done');
      circle && (circle.textContent = '✓');
      if (line) line.classList.add('done');
    } else if (i === step) {
      circle?.classList.add('active');
      label?.classList.add('active');
      circle && (circle.textContent = String(i));
      if (line) line.classList.remove('done');
    } else {
      circle && (circle.textContent = String(i));
      if (line) line.classList.remove('done');
    }
  }

  // Update panel sidebar
  document.querySelectorAll('[data-panel-step]').forEach(item => {
    const n = parseInt(item.dataset.panelStep);
    item.classList.remove('active', 'done');
    if (n < step)      item.classList.add('done');
    else if (n === step) item.classList.add('active');
  });

  // Update form title
  const titleEl = $('formTitle');
  if (titleEl) titleEl.textContent = STEP_TITLES[step - 1];
}

function goToStep(n) {
  $(`step${currentStep}`)?.classList.remove('active');
  currentStep = n;
  $(`step${currentStep}`)?.classList.add('active');
  updateStepper(currentStep);

  // Scroll form area to top
  document.querySelector('.auth-form-area')?.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─── VALIDATORS PER STEP ─────────────────────────── */
function validateStep1() {
  let ok = true;
  const checks = [
    { f: 'p_firstName', e: 'p_firstNameErr', test: v => v.trim().length >= 2 },
    { f: 'p_lastName',  e: 'p_lastNameErr',  test: v => v.trim().length >= 2 },
    { f: 'p_email',     e: 'p_emailErr',     test: isValidEmail },
    { f: 'p_phone',     e: 'p_phoneErr',     test: isValidPhone },
    { f: 'p_birth',     e: 'p_birthErr',     test: isAdult },
    { f: 'p_cpf',       e: 'p_cpfErr',       test: isValidCPF },
  ];

  checks.forEach(({ f, e, test }) => {
    const val = $(f)?.value || '';
    const pass = test(val);
    showError(f, e, !pass);
    if (!pass) ok = false;
  });

  return ok;
}

function validateStep2() {
  let ok = true;
  const checks = [
    { f: 'p_cep', e: 'p_cepErr', test: isValidCEP },
    { f: 'p_num', e: 'p_numErr', test: v => v.trim().length > 0 },
  ];

  checks.forEach(({ f, e, test }) => {
    const val = $(f)?.value || '';
    const pass = test(val);
    showError(f, e, !pass);
    if (!pass) ok = false;
  });

  return ok;
}

function validateStep3() {
  let ok = true;

  // Photo
  const photoOk = $('p_photo')?.files?.length > 0;
  showError('p_photo', 'p_photoErr', !photoOk);
  if (!photoOk) ok = false;

  // Categories — at least one
  const catChecked = document.querySelectorAll('input[name="cats"]:checked').length > 0;
  $('p_catsErr')?.classList.toggle('visible', !catChecked);
  if (!catChecked) ok = false;

  return ok;
}

function validateStep4() {
  let ok = true;

  const checks = [
    { f: 'p_password',        e: 'p_passwordErr',        test: v => v.length >= 8 },
    { f: 'p_confirmPassword', e: 'p_confirmPasswordErr', test: v => v === $('p_password')?.value },
  ];

  checks.forEach(({ f, e, test }) => {
    const val = $(f)?.value || '';
    const pass = test(val);
    showError(f, e, !pass);
    if (!pass) ok = false;
  });

  // Documents
  const docOk = $('p_docFront')?.files?.length > 0 && $('p_docBack')?.files?.length > 0;
  $('p_docErr')?.classList.toggle('visible', !docOk);
  if (!docOk) ok = false;

  // Selfie
  const selfieOk = $('p_selfie')?.files?.length > 0;
  showError('p_selfie', 'p_selfieErr', !selfieOk);
  if (!selfieOk) ok = false;

  // Terms
  const termsOk = $('p_terms')?.checked;
  $('p_termsErr')?.classList.toggle('visible', !termsOk);
  if (!termsOk) ok = false;

  return ok;
}

/* ─── STEP NAVIGATION ─────────────────────────────── */
$('next1')?.addEventListener('click', () => { if (validateStep1()) goToStep(2); });
$('next2')?.addEventListener('click', () => { if (validateStep2()) goToStep(3); });
$('next3')?.addEventListener('click', () => { if (validateStep3()) goToStep(4); });

$('back2')?.addEventListener('click', () => goToStep(1));
$('back3')?.addEventListener('click', () => goToStep(2));
$('back4')?.addEventListener('click', () => goToStep(3));

/* ─── FORM SUBMIT ─────────────────────────────────── */
$('motaForm')?.addEventListener('submit', e => {
  e.preventDefault();

  if (!validateStep4()) return;

  const btn = e.target.querySelector('.btn-submit');
  btn.textContent = 'Enviando cadastro...';
  btn.disabled    = true;

  setTimeout(() => {
    $('formWrap').style.display = 'none';
    $('successScreen')?.classList.add('active');
  }, 1800);
});

/* ─── INLINE BLUR VALIDATION ──────────────────────── */
const blurMap = {
  p_firstName: { e: 'p_firstNameErr', test: v => v.trim().length >= 2 },
  p_lastName:  { e: 'p_lastNameErr',  test: v => v.trim().length >= 2 },
  p_email:     { e: 'p_emailErr',     test: isValidEmail },
  p_phone:     { e: 'p_phoneErr',     test: isValidPhone },
  p_cpf:       { e: 'p_cpfErr',       test: isValidCPF },
  p_birth:     { e: 'p_birthErr',     test: isAdult },
  p_cep:       { e: 'p_cepErr',       test: isValidCEP },
  p_num:       { e: 'p_numErr',       test: v => v.trim().length > 0 },
  p_password:  { e: 'p_passwordErr',  test: v => v.length >= 8 },
  p_confirmPassword: { e: 'p_confirmPasswordErr', test: v => v === $('p_password')?.value },
};

Object.entries(blurMap).forEach(([id, { e, test }]) => {
  const el = $(id);
  if (!el) return;
  el.addEventListener('blur',  () => showError(id, e, !test(el.value)));
  el.addEventListener('input', () => el.classList.remove('error'));
});
