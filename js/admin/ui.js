export const UI = {
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    toast.innerHTML = `
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;
    
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Setup close
    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    };
    
    closeBtn.addEventListener('click', dismiss);
    setTimeout(dismiss, 5000); // auto dismiss
  },

  openModal(modalId, title = '') {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    if (title && modal.querySelector('.modal-title')) {
      modal.querySelector('.modal-title').textContent = title;
    }
    
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Bind close events
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    const closeHandler = () => this.closeModal(modalId);
    
    if (closeBtn) closeBtn.onclick = closeHandler;
    if (overlay) overlay.onclick = closeHandler;
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  },

  confirmAction(message, onConfirm) {
    const confirmModal = document.getElementById('confirm-modal');
    const msgEl = document.getElementById('confirm-message');
    const btnOk = document.getElementById('btn-confirm-ok');
    const btnCancel = document.getElementById('btn-confirm-cancel');
    const overlay = document.getElementById('confirm-overlay');
    
    if (msgEl) msgEl.textContent = message;
    
    confirmModal.classList.add('is-open');
    confirmModal.setAttribute('aria-hidden', 'false');
    
    const cleanup = () => {
      confirmModal.classList.remove('is-open');
      confirmModal.setAttribute('aria-hidden', 'true');
      btnOk.onclick = null;
      btnCancel.onclick = null;
      overlay.onclick = null;
    };
    
    btnCancel.onclick = cleanup;
    overlay.onclick = cleanup;
    
    btnOk.onclick = () => {
      cleanup();
      if (onConfirm) onConfirm();
    };
  }
};
