import { API } from './api.js';
import { UI } from './ui.js';
import { ImageUploader } from '../components/ImageUploader.js';

let currentItems = [];
let currentEditId = null;

export const GalleryController = {
  async renderView(container) {
    container.innerHTML = `
      <div class="admin-card">
        <div class="table-responsive">
          <table class="admin-table" id="gallery-table">
            <thead>
              <tr>
                <th class="thumbnail-cell">Image</th>
                <th>Caption</th>
                <th>Order</th>
                <th class="actions-cell">Actions</th>
              </tr>
            </thead>
            <tbody id="gallery-tbody">
              <tr><td colspan="4" class="text-center" style="padding: 2rem;">Loading gallery...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    await this.loadData();
  },

  async loadData() {
    const tbody = document.getElementById('gallery-tbody');
    try {
      const { data, error } = await API.fetchGallery();
      if (error) throw error;
      
      currentItems = data || [];
      this.renderTable(tbody);
    } catch (err) {
      console.error(err);
      UI.showToast('Failed to load gallery items.', 'error');
      tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error loading data.</td></tr>`;
    }
  },

  renderTable(tbody) {
    if (currentItems.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4">
            <div class="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              <p>No gallery images found. Add your first image!</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = currentItems.map(item => `
      <tr>
        <td>
          <img src="${item.image_url}" class="table-thumbnail" alt="Thumbnail" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMiI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIvPjxsaW5lIHgxPSI5IiB5MT0iOSIgeDI9IjE1IiB5Mj0iMTUiLz48bGluZSB4MT0iMTUiIHkxPSI5IiB4Mj0iOSIgeTI9IjE1Ii8+PC9zdmc+'" />
        </td>
        <td>${item.caption || '<span class="badge badge-muted">No caption</span>'}</td>
        <td>${item.display_order || 0}</td>
        <td class="actions-cell">
          <button class="btn-icon" onclick="window.GalleryController.editItem('${item.id}')" aria-label="Edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn-icon text-danger" onclick="window.GalleryController.deleteItem('${item.id}')" aria-label="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </td>
      </tr>
    `).join('');
  },

  showForm(id = null) {
    currentEditId = id;
    const item = id ? currentItems.find(i => i.id === id) : null;
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
      <form id="gallery-form">
        <div class="form-group">
          <label class="form-label">Gallery Image *</label>
          <div id="gallery-image-uploader"></div>
        </div>
        
        <div class="form-group">
          <label class="form-label" for="caption">Caption (Optional)</label>
          <input type="text" id="caption" class="form-control" value="${item?.caption || ''}" placeholder="E.g., Event Canopy Installation">
        </div>
        
        <div class="form-group">
          <label class="form-label" for="display_order">Display Order</label>
          <input type="number" id="display_order" class="form-control" value="${item?.display_order || 0}" min="0">
        </div>
        
        <div class="modal-actions mt-4">
          <button type="button" class="btn-outline" onclick="window.UI.closeModal('admin-modal')">Cancel</button>
          <button type="submit" class="btn-primary">Save Gallery Item</button>
        </div>
      </form>
    `;

    // Initialize Image Uploader
    const imageUploader = new ImageUploader('gallery-image-uploader', {
      defaultImage: item?.image_url || null,
      maxSizeMB: 5,
      acceptedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    });

    // Handle submit
    document.getElementById('gallery-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const saveBtn = e.target.querySelector('button[type="submit"]');
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
      
      try {
        const uploadedUrl = await imageUploader.upload();
        
        if (!uploadedUrl) {
          throw new Error('An image is required for the gallery.');
        }

        const payload = {
          image_url: uploadedUrl,
          caption: document.getElementById('caption').value.trim(),
          display_order: parseInt(document.getElementById('display_order').value) || 0
        };
        
        if (currentEditId) payload.id = currentEditId;
        
        const { error } = await API.saveGalleryItem(payload);
        if (error) throw error;
        
        UI.showToast('Gallery item saved successfully!');
        UI.closeModal('admin-modal');
        await this.loadData();
      } catch (err) {
        console.error(err);
        UI.showToast('Failed to save gallery item.', 'error');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Gallery Item';
      }
    });

    UI.openModal('admin-modal', id ? 'Edit Gallery Item' : 'Add Gallery Item');
  },

  editItem(id) {
    this.showForm(id);
  },

  deleteItem(id) {
    UI.confirmAction('Are you sure you want to delete this image?', async () => {
      try {
        const { error } = await API.deleteGalleryItem(id);
        if (error) throw error;
        
        UI.showToast('Gallery item deleted.');
        await this.loadData();
      } catch (err) {
        console.error(err);
        UI.showToast('Failed to delete item.', 'error');
      }
    });
  }
};
