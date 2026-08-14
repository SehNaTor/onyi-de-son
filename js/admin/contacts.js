import { UI } from './ui.js';
import { supabase } from '../supabase.js';

let currentContacts = [];

export const ContactsController = {
  async renderView(container) {
    container.innerHTML = `
      <div class="admin-card">
        <div class="table-responsive">
          <table class="admin-table" id="contacts-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Description</th>
                <th>Created</th>
                <th class="actions-cell">Actions</th>
              </tr>
            </thead>
            <tbody id="contacts-tbody">
              <tr><td colspan="5" class="text-center" style="padding: 2rem;">Loading contacts...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    await this.loadData();
  },

  async loadData() {
    const tbody = document.getElementById('contacts-tbody');
    try {
      const { data, error } = await supabase
        .from('contact')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      currentContacts = data || [];
      this.renderTable(tbody);
    } catch (error) {
      console.error(error);
      UI.showToast('Failed to load contacts.', 'error');
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error loading contacts.</td></tr>`;
    }
  },

  renderTable(tbody) {
    if (!currentContacts.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5">
            <div class="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <p>No contact submissions yet.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = currentContacts.map((item) => {
      const createdAt = item.created_at ? new Date(item.created_at).toLocaleString() : 'Unknown';
      const shortDescription = item.description ? String(item.description).slice(0, 90) : 'No description provided';
      const emailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${item.email || ''}`;
      return `
        <tr>
          <td>
            <div style="font-weight: 600;">${this.escape(item.name || 'Unknown')}</div>
          </td>
          <td>${this.escape(item.email || '—')}</td>
          <td>${this.escape(shortDescription)}</td>
          <td>${this.escape(createdAt)}</td>
          <td class="actions-cell">
            <button class="btn-icon" onclick="window.ContactsController.viewItem('${item.id}')" aria-label="View details">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
            <a class="btn-icon" href="${emailUrl}" target="_blank" rel="noopener noreferrer" aria-label="Reply via Gmail">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </a>
            <button class="btn-icon text-danger" onclick="window.ContactsController.deleteItem('${item.id}')" aria-label="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  async viewItem(id) {
    const item = currentContacts.find((contact) => contact.id === id);
    if (!item) return;

    UI.openModal('admin-modal', 'Contact Details');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
      <div class="stack">
        <div class="form-group">
          <label>Name</label>
          <div class="text-bold">${this.escape(item.name || 'Unknown')}</div>
        </div>
        <div class="form-group">
          <label>Email</label>
          <div><a href="https://mail.google.com/mail/?view=cm&fs=1&to=${this.escape(item.email || '')}" target="_blank" rel="noopener noreferrer">${this.escape(item.email || '—')}</a></div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <div>${this.escape(item.description || 'No description provided')}</div>
        </div>
        <div class="form-group">
          <label>Created</label>
          <div>${this.escape(item.created_at ? new Date(item.created_at).toLocaleString() : 'Unknown')}</div>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-outline" onclick="window.UI.closeModal('admin-modal')">Close</button>
        </div>
      </div>
    `;
  },

  deleteItem(id) {
    UI.confirmAction('Delete this contact submission?', async () => {
      try {
        const { error } = await supabase.from('contact').delete().eq('id', id);
        if (error) throw error;
        UI.showToast('Contact deleted.', 'success');
        await this.loadData();
      } catch (error) {
        console.error(error);
        UI.showToast('Failed to delete contact.', 'error');
      }
    });
  },

  escape(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
};

window.ContactsController = ContactsController;
