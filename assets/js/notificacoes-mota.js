/**
 * seuMota — notificacoes-mota.js
 * Gerenciamento de notificações do Mota
 */

const $ = id => document.getElementById(id);

/* ── FILTER TABS ────────────────────────────────── */
const tabs = document.querySelectorAll('.notif-tab');
const cards = document.querySelectorAll('.notif-card');

tabs.forEach(tab => {
  tab.addEventListener('click', function() {
    const filter = this.dataset.filter;
    
    // Update active tab
    tabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    
    // Filter notifications
    let visibleCount = 0;
    cards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    // Show/hide empty state
    const emptyState = $('emptyState');
    const notifList = $('notifList');
    if (visibleCount === 0) {
      notifList.style.display = 'none';
      emptyState.style.display = 'block';
    } else {
      notifList.style.display = 'flex';
      emptyState.style.display = 'none';
    }
  });
});

/* ── MARK AS READ ───────────────────────────────── */
// Individual click
cards.forEach(card => {
  card.addEventListener('click', function(e) {
    // Don't mark as read if clicking a button
    if (e.target.classList.contains('notif-btn')) return;
    
    if (this.classList.contains('unread')) {
      this.classList.remove('unread');
      updateUnreadCount();
      showToast('✓ Marcada como lida');
    }
  });
});

// Mark all as read
$('markAllRead')?.addEventListener('click', () => {
  const unreadCards = document.querySelectorAll('.notif-card.unread');
  
  if (unreadCards.length === 0) {
    showToast('ℹ️ Não há notificações não lidas');
    return;
  }
  
  unreadCards.forEach(card => card.classList.remove('unread'));
  updateUnreadCount();
  showToast(`✓ ${unreadCards.length} notificação${unreadCards.length > 1 ? 'ões' : ''} marcada${unreadCards.length > 1 ? 's' : ''} como lida${unreadCards.length > 1 ? 's' : ''}`);
});

/* ── UPDATE UNREAD COUNT ────────────────────────── */
function updateUnreadCount() {
  const unreadCount = document.querySelectorAll('.notif-card.unread').length;
  const countElement = $('notifCount');
  const badge = document.querySelector('.sidebar .nav-item.active .nav-badge');
  
  if (countElement) {
    countElement.textContent = unreadCount > 0 
      ? `${unreadCount} notificação${unreadCount > 1 ? 'ões' : ''} não lida${unreadCount > 1 ? 's' : ''}`
      : 'Nenhuma notificação não lida';
  }
  
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = '';
    } else {
      badge.style.display = 'none';
    }
  }
}

/* ── TOAST ──────────────────────────────────────── */
function showToast(msg) {
  const toast = $('toast');
  if (!toast) return;
  toast.textContent = msg;
  setTimeout(() => { toast.textContent = ''; }, 3000);
}

/* ── SIMULATE NEW NOTIFICATION ──────────────────── */
function simulateNewNotification() {
  // In production, this would be a WebSocket/SSE connection
  // For demo purposes, we could add a new notification card dynamically
  console.log('🔔 Checking for new notifications...');
}

// Check for new notifications every 30 seconds
setInterval(simulateNewNotification, 30000);

/* ── DELETE NOTIFICATION ────────────────────────── */
// Add swipe-to-delete on mobile (optional feature)
let touchStartX = 0;
let touchEndX = 0;

cards.forEach(card => {
  card.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  card.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe(card);
  });
});

function handleSwipe(card) {
  const swipeDistance = touchStartX - touchEndX;
  
  // Swipe left to delete (> 100px)
  if (swipeDistance > 100) {
    if (confirm('🗑️ Excluir esta notificação?')) {
      card.style.opacity = '0';
      card.style.transform = 'translateX(-100%)';
      setTimeout(() => {
        card.remove();
        updateUnreadCount();
        
        // Check if list is now empty
        const remainingCards = document.querySelectorAll('.notif-card');
        if (remainingCards.length === 0) {
          $('notifList').style.display = 'none';
          $('emptyState').style.display = 'block';
        }
      }, 300);
    }
  }
}

/* ── INITIAL COUNT UPDATE ───────────────────────── */
updateUnreadCount();
