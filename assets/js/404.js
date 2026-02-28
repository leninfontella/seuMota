/**
 * seuMota — 404.js
 * Smart search + back navigation
 */

const SEARCH_MAP = {
  'tarefa':     'postar-tarefa.html',
  'mercado':    'postar-tarefa.html',
  'farmácia':   'postar-tarefa.html',
  'lixo':       'postar-tarefa.html',
  'pagamento':  'pagamentos.html',
  'cartão':     'pagamentos.html',
  'pix':        'pagamentos.html',
  'senha':      'recuperar-senha.html',
  'recuperar':  'recuperar-senha.html',
  'perfil':     'perfil-usuario.html',
  'conta':      'perfil-usuario.html',
  'suporte':    'suporte.html',
  'ajuda':      'suporte.html',
  'faq':        'suporte.html',
  'mota':       'dashboard-mota.html',
  'ganhos':     'ganhos-mota.html',
  'avaliação':  'avaliacoes-mota.html',
  'favorito':   'favoritos.html',
  'histórico':  'historico-usuario.html',
  'chat':       'chat.html',
  'mensagem':   'chat.html',
  'configuração': 'configuracoes.html',
  'notificação': 'notificacoes.html',
};

function handleSearch() {
  const q = document.getElementById('searchInput')?.value.trim().toLowerCase();
  if (!q) return;
  const key = Object.keys(SEARCH_MAP).find(k => q.includes(k));
  window.location.href = key ? SEARCH_MAP[key] : 'suporte.html';
}

function goBack() {
  if (history.length > 1) {
    history.back();
  } else {
    window.location.href = 'index.html';
  }
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSearch();
  });
});
