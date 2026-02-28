/**
 * seuMota — verificacao-email.js
 * OTP verification flow post-registration
 */

/* ── EMAIL FROM URL / SESSION ── */
const params = new URLSearchParams(location.search);
const email  = params.get('email') || sessionStorage.getItem('registerEmail') || 'seu@email.com';
const emailEl = document.getElementById('emailDisplay');
if (emailEl) emailEl.textContent = email;

/* ── OTP INPUTS ── */
const inputs = [...document.querySelectorAll('.otp-input')];

inputs.forEach((inp, idx) => {
  inp.addEventListener('input', e => {
    const val = e.target.value.replace(/\D/g, '');
    e.target.value = val;

    if (val) {
      inp.classList.add('filled');
      if (idx < inputs.length - 1) inputs[idx + 1].focus();
    } else {
      inp.classList.remove('filled');
    }

    hideError();

    // Auto-verify when all 6 filled
    if (inputs.every(i => i.value.length === 1)) {
      setTimeout(verifyCode, 400);
    }
  });

  inp.addEventListener('keydown', e => {
    if (e.key === 'Backspace' && !inp.value && idx > 0) {
      inputs[idx - 1].focus();
      inputs[idx - 1].value = '';
      inputs[idx - 1].classList.remove('filled');
    }
  });

  inp.addEventListener('paste', e => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData)
      .getData('text').replace(/\D/g, '').slice(0, 6);
    pasted.split('').forEach((ch, i) => {
      if (inputs[i]) {
        inputs[i].value = ch;
        inputs[i].classList.add('filled');
      }
    });
    const next = inputs[Math.min(pasted.length, inputs.length - 1)];
    next?.focus();
    hideError();
    if (pasted.length === 6) setTimeout(verifyCode, 400);
  });
});

// Focus first input on load
inputs[0]?.focus();

/* ── VERIFY ── */
function verifyCode() {
  const code = inputs.map(i => i.value).join('');
  if (code.length < 6) { showError('Preencha todos os 6 dígitos.'); return; }

  const btn = document.getElementById('verifyBtn');
  if (!btn) return;
  btn.textContent = 'Verificando…';
  btn.disabled = true;

  // Simulate POST /auth/verify-email
  setTimeout(() => {
    if (code === '000000') {
      // Demo: wrong code
      showError('Código inválido. Tente novamente.');
      inputs.forEach(i => i.classList.add('error'));
      setTimeout(() => inputs.forEach(i => i.classList.remove('error')), 600);
      btn.textContent = 'Verificar e-mail →';
      btn.disabled = false;
      return;
    }
    showSuccess();
  }, 1200);
}

/* ── ERROR / HIDE ERROR ── */
function showError(msg) {
  const el = document.getElementById('otpError');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}

function hideError() {
  const el = document.getElementById('otpError');
  if (el) el.style.display = 'none';
}

/* ── SUCCESS ── */
function showSuccess() {
  const otpStep = document.getElementById('otpStep');
  const success = document.getElementById('successScreen');
  if (otpStep) otpStep.style.display = 'none';
  if (success) success.style.display = 'block';

  // Update progress indicators
  const dots   = document.querySelectorAll('.step-dot');
  const labels = document.querySelectorAll('.step-label');
  const connectors = document.querySelectorAll('.step-connector');
  if (dots[1])      dots[1].textContent = '✓';
  if (dots[2])      { dots[2].classList.replace('future', 'active'); }
  if (labels[2])    labels[2].classList.add('active');
  if (connectors[1]) connectors[1].classList.add('done');

  // Auto-redirect after 4s
  setTimeout(() => { window.location.href = 'dashboard-usuario.html'; }, 4000);
}

/* ── COUNTDOWN / RESEND ── */
let timerInterval;

function startCountdown(secs = 60) {
  const countEl   = document.getElementById('timerCount');
  const timerWrap = document.getElementById('timerWrap');
  const resendBtn = document.getElementById('resendBtn');
  let remaining = secs;

  if (resendBtn)  resendBtn.disabled = true;
  if (timerWrap)  timerWrap.style.display = 'inline';

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    remaining--;
    if (countEl)  countEl.textContent = remaining;
    if (remaining <= 0) {
      clearInterval(timerInterval);
      if (resendBtn)  resendBtn.disabled = false;
      if (timerWrap)  timerWrap.style.display = 'none';
    }
  }, 1000);
}

function resendCode() {
  const btn = document.getElementById('resendBtn');
  if (!btn) return;
  const originalText = btn.textContent;
  btn.textContent = 'Enviando…';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = originalText;
    startCountdown(60);
    inputs.forEach(i => { i.value = ''; i.classList.remove('filled', 'error'); });
    inputs[0]?.focus();
    hideError();
  }, 900);
}

/* ── CHANGE EMAIL TOGGLE ── */
function showChangeEmail() {
  const area = document.getElementById('changeEmailArea');
  if (!area) return;
  area.style.display = area.style.display === 'none' ? 'block' : 'none';
}

function updateEmail() {
  const inp = document.getElementById('newEmailInput');
  if (!inp) return;
  const val = inp.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!val || !emailRegex.test(val)) {
    inp.style.borderColor = '#EF4444';
    setTimeout(() => inp.style.borderColor = '', 1500);
    return;
  }
  if (emailEl) emailEl.textContent = val;
  document.getElementById('changeEmailArea').style.display = 'none';
  inputs.forEach(i => { i.value = ''; i.classList.remove('filled'); });
  inputs[0]?.focus();
  clearInterval(timerInterval);
  startCountdown(60);
}

/* ── START ── */
startCountdown(60);

// Expose functions used inline in HTML
window.verifyCode     = verifyCode;
window.resendCode     = resendCode;
window.showChangeEmail = showChangeEmail;
window.updateEmail    = updateEmail;
