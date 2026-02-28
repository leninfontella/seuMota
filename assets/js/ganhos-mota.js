/**
 * seuMota — ganhos-mota.js
 * Bar chart, troca de período, modal de saque
 */

/* ─── BAR CHART DATA ──────────────────────────────── */
const chartData = {
  week: {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Hoje'],
    values: [45, 0, 28, 15, 50, 80, 0],
    total:  'R$ 218',
    sub:    'Esta semana',
  },
  month: {
    labels: ['1','3','5','7','9','11','13','Hj'],
    values: [20, 35, 0, 45, 28, 60, 50, 0],
    total:  'R$ 284',
    sub:    'Fevereiro 2026',
  },
  all: {
    labels: ['Mai','Jun','Jul','Ago','Set','Out','Nov','Fev'],
    values: [80, 120, 95, 160, 210, 180, 245, 284],
    total:  'R$ 1.240',
    sub:    'Maio 2025 — hoje',
  },
};

function renderChart(period) {
  const chart  = document.getElementById('barChart');
  const sub    = document.getElementById('chartSubtitle');
  if (!chart) return;

  const data   = chartData[period];
  const max    = Math.max(...data.values, 1);

  if (sub) sub.textContent = data.sub;

  const rightTotal = document.querySelector('.chart-area div div:last-child');
  if (rightTotal) rightTotal.textContent = data.total;

  chart.innerHTML = data.labels.map((label, i) => {
    const pct   = Math.round((data.values[i] / max) * 100);
    const today = label === 'Hoje' || label === 'Hj';
    return `
      <div class="bar-col">
        <div class="bar-val">${data.values[i] ? 'R$' + data.values[i] : ''}</div>
        <div class="bar ${today ? 'today' : ''}" style="height:${Math.max(pct, 2)}%" title="R$ ${data.values[i]}"></div>
        <div class="bar-label">${label}</div>
      </div>
    `;
  }).join('');
}

// Initial render
renderChart('month');

/* ─── PERIOD TABS ─────────────────────────────────── */
document.querySelectorAll('.period-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.period-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderChart(tab.dataset.period);

    const data = chartData[tab.dataset.period];
    const periodTotal = document.getElementById('periodTotal');
    const periodLabel = document.getElementById('periodLabel');
    if (periodTotal) periodTotal.textContent = data.total;
    if (periodLabel) periodLabel.textContent  = data.sub;
  });
});

/* ─── WITHDRAW MODAL ──────────────────────────────── */
const withdrawModal   = document.getElementById('withdrawModal');
const withdrawBtn     = document.getElementById('withdrawBtn');
const withdrawCancel  = document.getElementById('withdrawCancel');
const withdrawConfirm = document.getElementById('withdrawConfirm');

withdrawBtn?.addEventListener('click', () => withdrawModal?.classList.add('open'));
withdrawCancel?.addEventListener('click', () => withdrawModal?.classList.remove('open'));
withdrawModal?.addEventListener('click', e => {
  if (e.target === withdrawModal) withdrawModal.classList.remove('open');
});

withdrawConfirm?.addEventListener('click', () => {
  const amount = parseFloat(document.getElementById('withdrawAmount')?.value) || 0;
  if (amount < 10) {
    alert('Valor mínimo para saque é R$ 10.');
    return;
  }
  withdrawConfirm.textContent = 'Processando...';
  withdrawConfirm.disabled    = true;

  // Simulate API call — POST /payouts
  setTimeout(() => {
    withdrawModal.classList.remove('open');
    withdrawConfirm.textContent = '✅ Confirmar saque';
    withdrawConfirm.disabled    = false;

    // Show success feedback
    const pill = document.querySelector('.earning-pill-value');
    if (pill) pill.textContent = 'R$ 0';

    const highlight = document.querySelector('.earnings-card.highlight .earnings-card-value');
    if (highlight) highlight.textContent = 'R$ 0';

    // Insert pending tx at top
    const txList = document.getElementById('txList');
    if (txList) {
      const tx = document.createElement('div');
      tx.className = 'tx-item';
      tx.style.animation = 'slideUp .3s ease both';
      tx.innerHTML = `
        <div class="tx-icon out">🏦</div>
        <div class="tx-info">
          <div class="tx-title">Saque solicitado — Pix (***1234)</div>
          <div class="tx-date">Agora · Processando</div>
        </div>
        <div class="tx-amount out">-R$ ${amount}</div>
      `;
      txList.prepend(tx);
    }
  }, 1500);
});
