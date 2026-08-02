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
                <th>WhatsApp</th>
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
      const whatsappUrl = `https://wa.me/${item.whatsapp || ''}`;
      return `
        <tr>
          <td>
            <div style="font-weight: 600;">${this.escape(item.name || 'Unknown')}</div>
          </td>
          <td>${this.escape(item.whatsapp || '—')}</td>
          <td>${this.escape(shortDescription)}</td>
          <td>${this.escape(createdAt)}</td>
          <td class="actions-cell">
            <button class="btn-icon" onclick="window.ContactsController.viewItem('${item.id}')" aria-label="View details">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
            <a class="btn-icon" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" aria-label="Open WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>
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
          <label>WhatsApp</label>
          <div><a href="https://wa.me/${this.escape(item.whatsapp || '')}" target="_blank" rel="noopener noreferrer">${this.escape(item.whatsapp || '—')}</a></div>
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
