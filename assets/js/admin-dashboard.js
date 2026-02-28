/**
 * seuMota — admin-dashboard.js
 */

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

/* ─── DATE LABEL ──────────────────────────────────── */
const adminDate = document.getElementById('adminDate');
if (adminDate) {
  const now = new Date();
  adminDate.textContent = now.toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

/* ─── TASKS BAR CHART ─────────────────────────────── */
const CHART_DATA = [
  { label: '01/02', val: 28 }, { label: '02/02', val: 35 }, { label: '03/02', val: 31 },
  { label: '04/02', val: 42 }, { label: '05/02', val: 38 }, { label: '06/02', val: 29 },
  { label: '07/02', val: 18 }, { label: '08/02', val: 44 }, { label: '09/02', val: 51 },
  { label: '10/02', val: 39 }, { label: '11/02', val: 47 }, { label: '12/02', val: 43 },
  { label: '13/02', val: 55 }, { label: '14/02', val: 47, today: true },
];

function renderChart() {
  const wrap = document.getElementById('taskChart');
  if (!wrap) return;
  const max = Math.max(...CHART_DATA.map(d => d.val));
  const maxH = 110; // px

  wrap.innerHTML = CHART_DATA.map(d => {
    const h = Math.round((d.val / max) * maxH);
    return `
      <div class="chart-col-wrap" title="${d.label}: ${d.val} tarefas">
        <div class="chart-col${d.today ? ' today' : ''}" style="height:${h}px;"></div>
        <div class="chart-col-label">${d.label.slice(0, 5)}</div>
      </div>`;
  }).join('');
}

renderChart();

/* ─── CATEGORY BREAKDOWN ──────────────────────────── */
const CATS = [
  { name: '🛒 Mercado',   count: 847, pct: 29 },
  { name: '💊 Farmácia',  count: 612, pct: 21 },
  { name: '🏦 Banco',     count: 524, pct: 18 },
  { name: '🗑️ Lixo',      count: 381, pct: 13 },
  { name: '📦 Encomenda', count: 298, pct: 10 },
  { name: '👕 Lavanderia',count: 229, pct:  9 },
];

const catEl = document.getElementById('catBreakdown');
if (catEl) {
  catEl.innerHTML = CATS.map(c => `
    <div style="padding:10px 20px;border-bottom:1px solid var(--sand);">
      <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
        <span style="font-size:0.82rem;font-weight:700;color:var(--ink-mid);">${c.name}</span>
        <span style="font-size:0.82rem;font-weight:900;color:var(--ink);">${c.pct}%</span>
      </div>
      <div style="height:5px;border-radius:50px;background:var(--sand);overflow:hidden;">
        <div style="height:100%;width:${c.pct}%;background:var(--orange);border-radius:50px;transition:width .5s;"></div>
      </div>
    </div>`
  ).join('');
  // Animate bars in
  setTimeout(() => {
    catEl.querySelectorAll('div > div > div').forEach(bar => {
      bar.style.transition = 'width .8s cubic-bezier(.22,1,.36,1)';
    });
  }, 100);
}

/* ─── APPROVE / REJECT VERIFICATIONS ─────────────── */
window.approveRow = function(btn) {
  const row  = btn.closest('tr');
  const name = row?.querySelector('td')?.textContent.trim() || 'Candidato';
  row.style.opacity    = '0';
  row.style.transition = 'opacity .3s';
  setTimeout(() => {
    row.remove();
    showToast(`✅ ${name} aprovado como Mota!`);
    updatePendingCount(-1);
  }, 320);
};

window.rejectRow = function(btn) {
  const row  = btn.closest('tr');
  const name = row?.querySelector('td')?.textContent.trim() || 'Candidato';
  if (!confirm(`Rejeitar verificação de ${name}?`)) return;
  row.style.opacity    = '0';
  row.style.transition = 'opacity .3s';
  setTimeout(() => {
    row.remove();
    showToast(`❌ ${name} rejeitado.`);
    updatePendingCount(-1);
  }, 320);
};

function updatePendingCount(delta) {
  const pills = document.querySelectorAll('.pill-orange');
  pills.forEach(p => {
    const n = parseInt(p.textContent) + delta;
    if (!isNaN(n) && n >= 0) p.textContent = n + (p.textContent.includes('pendente') ? ' pendentes' : '');
  });
}
