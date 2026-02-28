/**
 * seuMota — recuperar-senha.js
 * Fluxo 3 etapas: e-mail → código OTP → nova senha → sucesso
 */

let currentStep = 1;
let countdownInterval = null;

/* ─── STEP NAVIGATION ─────────────────────────────── */
function goTo(step) {
  [1, 2, 3, 'Success'].forEach(s => {
    const el = document.getElementById(s === 'Success' ? 'stepSuccess' : `step${s}`);
    if (el) el.classList.toggle('active', s === step);
  });

  // Progress indicators
  for (let i = 1; i <= 3; i++) {
    const dot  = document.getElementById(`rp${i}`);
    const line = document.getElementById(`rl${i}`);
    if (!dot) continue;
    if (step === 'Success') {
      dot.classList.toggle('done', true);
      dot.textContent = '✓';
    } else {
      dot.classList.remove('active', 'done');
      if (i < step)       { dot.classList.add('done'); dot.textContent = '✓'; }
      else if (i === step) { dot.classList.add('active'); dot.textContent = String(i); }
      else                 { dot.textContent = String(i); }
    }
    if (line) line.classList.toggle('done', i < (step === 'Success' ? 4 : step));
  }

  // Hide progress bar on success
  const prog = document.getElementById('resetProgress');
  if (prog) prog.style.display = step === 'Success' ? 'none' : '';

  currentStep = step;
}

/* ─── STEP 1: E-MAIL ──────────────────────────────── */
document.getElementById('sendCodeBtn')?.addEventListener('click', () => {
  const email = document.getElementById('emailInput')?.value.trim();
  const err   = document.getElementById('errorEmail');

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (err) err.classList.add('show');
    return;
  }
  if (err) err.classList.remove('show');

  const btn = document.getElementById('sendCodeBtn');
  btn.textContent = 'Enviando...';
  btn.disabled    = true;

  // Simulate API POST /auth/password-reset/request
  setTimeout(() => {
    const display = document.getElementById('emailDisplay');
    if (display) display.textContent = email;
    goTo(2);
    startCountdown();
    btn.textContent = 'Enviar código →';
    btn.disabled    = false;
    // Focus first OTP input
    document.querySelector('.otp-input')?.focus();
  }, 1200);
});

/* ─── OTP INPUTS: auto-advance + paste ───────────────  */
const otpInputs = document.querySelectorAll('.otp-input');

otpInputs.forEach((input, idx) => {
  input.addEventListener('input', e => {
    const val = input.value.replace(/\D/g, '');
    input.value = val.slice(-1);
    if (val && idx < otpInputs.length - 1) otpInputs[idx + 1].focus();
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Backspace' && !input.value && idx > 0) {
      otpInputs[idx - 1].focus();
    }
  });
});

// Paste support — spread digits across inputs
document.getElementById('otpRow')?.addEventListener('paste', e => {
  e.preventDefault();
  const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
  otpInputs.forEach((inp, i) => { inp.value = pasted[i] || ''; });
  const last = Math.min(pasted.length, otpInputs.length) - 1;
  otpInputs[last]?.focus();
});

/* ─── STEP 2: RESEND COUNTDOWN ────────────────────── */
function startCountdown() {
  let secs = 60;
  const btn   = document.getElementById('resendBtn');
  const span  = document.getElementById('countdown');
  if (btn)  btn.disabled = true;
  if (span) span.textContent = secs;

  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    secs--;
    if (span) span.textContent = secs;
    if (secs <= 0) {
      clearInterval(countdownInterval);
      if (btn)  { btn.disabled = false; btn.textContent = 'Reenviar código'; }
    }
  }, 1000);
}

document.getElementById('resendBtn')?.addEventListener('click', function () {
  this.disabled    = true;
  this.textContent = `Reenviar em 60s`;
  // Reset OTP
  otpInputs.forEach(i => i.value = '');
  otpInputs[0]?.focus();
  startCountdown();
});

/* ─── STEP 2: VERIFY CODE ─────────────────────────── */
document.getElementById('verifyCodeBtn')?.addEventListener('click', () => {
  const code = [...otpInputs].map(i => i.value).join('');
  const err  = document.getElementById('errorOtp');

  if (code.length < 6) {
    if (err) err.classList.add('show');
    otpInputs[0].focus();
    return;
  }
  if (err) err.classList.remove('show');

  const btn = document.getElementById('verifyCodeBtn');
  btn.textContent = 'Verificando...';
  btn.disabled    = true;

  // Demo: accept any 6-digit code
  // Real: POST /auth/password-reset/verify
  setTimeout(() => {
    clearInterval(countdownInterval);
    goTo(3);
    btn.textContent = 'Verificar código →';
    btn.disabled    = false;
    document.getElementById('newPwd')?.focus();
  }, 1000);
});

document.getElementById('backStep1')?.addEventListener('click', () => goTo(1));

/* ─── STEP 3: PASSWORD STRENGTH ───────────────────── */
const newPwd = document.getElementById('newPwd');
const bar    = document.getElementById('strengthBar');
const label  = document.getElementById('strengthLabel');

const STRENGTH = [
  { min: 0,  pct: '0%',   color: '',        text: 'Força da senha', textColor: 'var(--ink-light)' },
  { min: 1,  pct: '20%',  color: '#EF4444', text: '🔴 Muito fraca',  textColor: '#EF4444' },
  { min: 5,  pct: '45%',  color: '#F59E0B', text: '🟡 Fraca',        textColor: '#F59E0B' },
  { min: 7,  pct: '65%',  color: '#F59E0B', text: '🟡 Razoável',     textColor: '#F59E0B' },
  { min: 9,  pct: '85%',  color: '#22C55E', text: '🟢 Boa',          textColor: '#22C55E' },
  { min: 12, pct: '100%', color: '#16A34A', text: '💪 Muito forte',  textColor: '#16A34A' },
];

newPwd?.addEventListener('input', () => {
  const len   = newPwd.value.length;
  const score = STRENGTH.filter(s => len >= s.min).pop();
  if (bar)   { bar.style.width = score.pct; bar.style.background = score.color; }
  if (label) { label.textContent = score.text; label.style.color = score.textColor; }
});

/* ─── STEP 3: TOGGLE VISIBILITY ──────────────────── */
function makeToggle(btnId, inputId) {
  document.getElementById(btnId)?.addEventListener('click', () => {
    const inp = document.getElementById(inputId);
    if (!inp) return;
    const isText = inp.type === 'text';
    inp.type = isText ? 'password' : 'text';
    document.getElementById(btnId).textContent = isText ? '👁️' : '🙈';
  });
}
makeToggle('toggleNewPwd',     'newPwd');
makeToggle('toggleConfirmPwd', 'confirmPwd');

/* ─── STEP 3: SAVE PASSWORD ───────────────────────── */
document.getElementById('saveNewPwdBtn')?.addEventListener('click', () => {
  const pwd     = document.getElementById('newPwd')?.value || '';
  const confirm = document.getElementById('confirmPwd')?.value || '';
  const err     = document.getElementById('errorPwd');

  if (pwd.length < 8 || pwd !== confirm) {
    if (err) err.classList.add('show');
    return;
  }
  if (err) err.classList.remove('show');

  const btn = document.getElementById('saveNewPwdBtn');
  btn.textContent = 'Salvando...';
  btn.disabled    = true;

  // Real: POST /auth/password-reset/confirm
  setTimeout(() => {
    goTo('Success');
    btn.textContent = 'Salvar nova senha →';
    btn.disabled    = false;
  }, 1400);
});
