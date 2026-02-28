/**
 * seuMota — postar-tarefa.js
 * Lógica do formulário multi-etapas de criação de tarefa
 */

/* ─── STATE ───────────────────────────────────────── */
const state = {
  step:     1,
  category: null,
  title:    '',
  desc:     '',
  date:     '',
  time:     '',
  address:  '',
  price:    25,
};

const CAT_LABELS = {
  lixo:       '🗑️ Levar o lixo',
  lavanderia: '👕 Lavanderia',
  mercado:    '🛒 Mercado',
  banco:      '🏦 Banco / Lotérica',
  farmacia:   '💊 Farmácia',
  encomenda:  '📦 Encomenda',
  pet:        '🐕 Pet',
  outro:      '➕ Outro',
};

const CAT_PRICE_HINTS = {
  lixo:       [5, 8, 10],
  lavanderia: [15, 20, 30],
  mercado:    [15, 25, 40],
  banco:      [10, 15, 25],
  farmacia:   [10, 15, 20],
  encomenda:  [10, 15, 20],
  pet:        [20, 30, 50],
  outro:      [15, 25, 40],
};

/* ─── HELPERS ─────────────────────────────────────── */
const $ = id => document.getElementById(id);

function showError(errId, show) {
  const el = $(errId);
  if (!el) return;
  el.classList.toggle('visible', show);
  el.style.display = show ? 'block' : 'none';
}

function fmtDate(dateStr, timeStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00');
  const formatted = d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
  return timeStr ? `${formatted} às ${timeStr}` : formatted;
}

/* ─── STEPPER UPDATE ──────────────────────────────── */
function updateStepper(step) {
  for (let i = 1; i <= 3; i++) {
    const circle = $(`ts${i}`);
    const label  = $(`tl${i}`);
    const line   = $(`tline${i}`);

    circle?.classList.remove('active', 'done');
    label?.classList.remove('active', 'done');

    if (i < step) {
      circle?.classList.add('done');
      label?.classList.add('done');
      if (circle) circle.textContent = '✓';
    } else if (i === step) {
      circle?.classList.add('active');
      label?.classList.add('active');
      if (circle) circle.textContent = String(i);
    } else {
      if (circle) circle.textContent = String(i);
    }

    if (line) line.classList.toggle('done', i < step);
  }
}

function goStep(n) {
  $(`tstep${state.step}`)?.classList.remove('active');
  state.step = n;
  $(`tstep${state.step}`)?.classList.add('active');
  updateStepper(state.step);
  document.querySelector('.main')?.scrollTo({ top: 0, behavior: 'smooth' });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─── STEP 1: CATEGORY ────────────────────────────── */
document.querySelectorAll('.cat-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.cat-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    state.category = opt.dataset.cat;
    showError('catErr', false);

    // Update price hints for this category
    const hints = CAT_PRICE_HINTS[state.category] || [15, 25, 40];
    const pills = document.querySelectorAll('.price-pill');
    pills.forEach((pill, i) => {
      const val = hints[i] ?? parseInt(pill.dataset.price);
      pill.dataset.price   = val;
      pill.textContent     = `R$ ${val}`;
      pill.classList.remove('selected');
    });
    // Select middle suggestion
    if (pills[1]) {
      pills[1].classList.add('selected');
      state.price = parseInt(pills[1].dataset.price);
      if ($('t_price')) $('t_price').value = state.price;
    }
  });
});

$('tnext1')?.addEventListener('click', () => {
  if (!state.category) {
    showError('catErr', true);
    return;
  }
  goStep(2);
});

/* ─── STEP 2: DETAILS ─────────────────────────────── */
// Set min date to today
const today = new Date().toISOString().split('T')[0];
if ($('t_date')) $('t_date').min = today;

function validateStep2() {
  let ok = true;

  if (!$('t_title')?.value.trim()) {
    showError('t_titleErr', true); ok = false;
  } else { showError('t_titleErr', false); }

  if (!$('t_date')?.value) {
    showError('t_dateErr', true); ok = false;
  } else { showError('t_dateErr', false); }

  if (!$('t_time')?.value) {
    showError('t_timeErr', true); ok = false;
  } else { showError('t_timeErr', false); }

  if (!$('t_address')?.value.trim()) {
    showError('t_addressErr', true); ok = false;
  } else { showError('t_addressErr', false); }

  return ok;
}

$('tnext2')?.addEventListener('click', () => {
  if (!validateStep2()) return;

  state.title   = $('t_title').value;
  state.desc    = $('t_desc')?.value || '';
  state.date    = $('t_date').value;
  state.time    = $('t_time').value;
  state.address = $('t_address').value;

  // Populate summary
  if ($('sum_cat'))   $('sum_cat').textContent   = CAT_LABELS[state.category] || state.category;
  if ($('sum_title')) $('sum_title').textContent  = state.title;
  if ($('sum_when'))  $('sum_when').textContent   = fmtDate(state.date, state.time);
  if ($('sum_addr'))  $('sum_addr').textContent   = state.address;
  if ($('sum_price')) $('sum_price').textContent  = `R$ ${state.price}`;

  goStep(3);
});

$('tback2')?.addEventListener('click', () => goStep(1));

/* ─── STEP 3: PRICE ───────────────────────────────── */
document.querySelectorAll('.price-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.price-pill').forEach(p => p.classList.remove('selected'));
    pill.classList.add('selected');
    state.price = parseInt(pill.dataset.price);
    if ($('t_price')) $('t_price').value = state.price;
    if ($('sum_price')) $('sum_price').textContent = `R$ ${state.price}`;
  });
});

$('t_price')?.addEventListener('input', () => {
  state.price = parseInt($('t_price').value) || 0;
  document.querySelectorAll('.price-pill').forEach(p => p.classList.remove('selected'));
  if ($('sum_price')) $('sum_price').textContent = `R$ ${state.price}`;
  showError('t_priceErr', state.price < 5);
});

$('tback3')?.addEventListener('click', () => goStep(2));

/* ─── SUBMIT ──────────────────────────────────────── */
$('taskForm')?.addEventListener('submit', e => {
  e.preventDefault();

  if (state.price < 5) {
    showError('t_priceErr', true);
    return;
  }

  const btn = e.target.querySelector('.btn-submit');
  btn.textContent = 'Publicando...';
  btn.disabled    = true;

  // Simulate POST /tasks
  setTimeout(() => {
    $('taskForm').style.display      = 'none';
    document.querySelector('.task-stepper').style.display = 'none';
    $('taskSuccess')?.classList.add('active');
  }, 1500);
});

/* ─── PRE-SELECT FROM URL PARAM ───────────────────── */
const urlCat = new URLSearchParams(window.location.search).get('cat');
if (urlCat) {
  const opt = document.querySelector(`[data-cat="${urlCat}"]`);
  if (opt) opt.click();
}
