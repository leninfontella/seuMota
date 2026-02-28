/**
 * seuMota — form-usuario.js
 * Validação e submissão do cadastro de usuário (cliente)
 */

/* ─── HELPERS ─────────────────────────────────────── */
const $ = id => document.getElementById(id);

function showError(fieldId, errId, show) {
  const field = $(fieldId);
  const err   = $(errId);
  if (!field || !err) return;
  field.classList.toggle('error', show);
  err.classList.toggle('visible', show);
}

function clearErrors(ids) {
  ids.forEach(({ f, e }) => showError(f, e, false));
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidPhone(v) {
  return v.replace(/\D/g, '').length >= 10;
}

function isValidCEP(v) {
  return v.replace(/\D/g, '').length === 8;
}

/* ─── MASKS ───────────────────────────────────────── */
function maskPhone(el) {
  el.addEventListener('input', () => {
    let v = el.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    el.value = v;
  });
}

function maskCEP(el) {
  el.addEventListener('input', () => {
    let v = el.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = `${v.slice(0,5)}-${v.slice(5)}`;
    el.value = v;
  });
}

/* ─── PASSWORD TOGGLE ─────────────────────────────── */
document.querySelectorAll('.toggle-pass').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    if (!input) return;
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
    btn.textContent = isPass ? '🙈' : '👁️';
  });
});

/* ─── APPLY MASKS ─────────────────────────────────── */
maskPhone($('phone'));
maskCEP($('cep'));

/* ─── VALIDATION ──────────────────────────────────── */
function validate() {
  let ok = true;

  const fields = [
    { f: 'firstName',       e: 'firstNameErr',       test: v => v.trim().length >= 2 },
    { f: 'lastName',        e: 'lastNameErr',         test: v => v.trim().length >= 2 },
    { f: 'email',           e: 'emailErr',            test: isValidEmail },
    { f: 'phone',           e: 'phoneErr',            test: isValidPhone },
    { f: 'cep',             e: 'cepErr',              test: isValidCEP  },
    { f: 'password',        e: 'passwordErr',         test: v => v.length >= 8 },
    { f: 'confirmPassword', e: 'confirmPasswordErr',  test: v => v === $('password').value },
  ];

  clearErrors(fields.map(f => ({ f: f.f, e: f.e })));

  fields.forEach(({ f, e, test }) => {
    const val = $(f)?.value || '';
    if (!test(val)) {
      showError(f, e, true);
      ok = false;
    }
  });

  // Terms
  const termsOk = $('terms')?.checked;
  showError('terms', 'termsErr', !termsOk);
  if (!termsOk) ok = false;

  return ok;
}

/* ─── FORM SUBMIT ─────────────────────────────────── */
$('userForm').addEventListener('submit', e => {
  e.preventDefault();

  if (!validate()) return;

  // Simulate API call
  const btn = e.target.querySelector('.btn-submit');
  btn.textContent = 'Criando conta...';
  btn.disabled = true;

  setTimeout(() => {
    $('formWrap').style.display = 'none';
    $('successScreen').classList.add('active');
  }, 1400);
});

/* ─── INLINE VALIDATION ON BLUR ───────────────────── */
['firstName', 'lastName', 'email', 'phone', 'cep', 'password', 'confirmPassword'].forEach(id => {
  const el = $(id);
  if (!el) return;
  el.addEventListener('blur', () => {
    // trigger visual feedback per field
    const map = {
      firstName:       { e: 'firstNameErr',       test: v => v.trim().length >= 2 },
      lastName:        { e: 'lastNameErr',         test: v => v.trim().length >= 2 },
      email:           { e: 'emailErr',            test: isValidEmail },
      phone:           { e: 'phoneErr',            test: isValidPhone },
      cep:             { e: 'cepErr',              test: isValidCEP  },
      password:        { e: 'passwordErr',         test: v => v.length >= 8 },
      confirmPassword: { e: 'confirmPasswordErr',  test: v => v === $('password').value },
    };
    const { e, test } = map[id];
    showError(id, e, !test(el.value));
  });

  el.addEventListener('input', () => {
    el.classList.remove('error');
  });
});
