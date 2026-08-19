import { API } from './api.js';
import { UI } from './ui.js';
import { MediaUploader } from '../components/MediaUploader.js';
import { renderMedia } from '../utils/media.js';

let currentItems = [];
let currentEditId = null;

export const ProductsController = {
  async renderView(container) {
    container.innerHTML = `
      <div class="admin-card">
        <div class="table-responsive">
          <table class="admin-table" id="products-table">
            <thead>
              <tr>
                <th class="thumbnail-cell">Image</th>
                <th>Product Details</th>
                <th>Status</th>
                <th>Order</th>
                <th class="actions-cell">Actions</th>
              </tr>
            </thead>
            <tbody id="products-tbody">
              <tr><td colspan="5" class="text-center" style="padding: 2rem;">Loading products...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    await this.loadData();
  },

  async loadData() {
    const tbody = document.getElementById('products-tbody');
    try {
      const { data, error } = await API.fetchProducts();
      if (error) throw error;
      
      currentItems = data || [];
      this.renderTable(tbody);
    } catch (err) {
      console.error(err);
      UI.showToast('Failed to load products.', 'error');
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error loading data.</td></tr>`;
    }
  },

  renderTable(tbody) {
    if (currentItems.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5">
            <div class="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 20 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              <p>No products found. Add your first product!</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = currentItems.map(item => `
      <tr>
        <td>
          ${renderMedia(item, 'table-thumbnail')}
        </td>
        <td>
          <div style="font-weight: 600; margin-bottom: 0.25rem;">${item.name || 'Untitled'}</div>
          <div style="font-size: 0.75rem; color: var(--admin-text-muted);">${item.category || 'Uncategorized'}</div>
        </td>
        <td>
          ${item.is_active 
            ? '<span class="badge badge-success">Active</span>' 
            : '<span class="badge badge-muted">Inactive</span>'}
        </td>
        <td>${item.display_order || 0}</td>
        <td class="actions-cell">
          <button class="btn-icon" onclick="window.ProductsController.editItem('${item.id}')" aria-label="Edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn-icon text-danger" onclick="window.ProductsController.deleteItem('${item.id}')" aria-label="Delete">
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
      <form id="product-form">
        <div class="form-group">
          <label class="form-label" for="name">Product Name *</label>
          <input type="text" id="name" class="form-control" required value="${item?.name || ''}" placeholder="E.g., Premium South Korean Tarpaulin">
        </div>
        
        <div class="form-group">
          <label class="form-label" for="category">Category *</label>
          <select id="category" class="form-control" required>
            <option value="Wallpaper" ${item?.category === 'Wallpaper' ? 'selected' : ''}>Wallpaper</option>
            <option value="Tarpaulin" ${item?.category === 'Tarpaulin' ? 'selected' : ''}>Tarpaulin</option>
            <option value="Carport" ${item?.category === 'Carport' ? 'selected' : ''}>Carport</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label" for="description">Description</label>
          <textarea id="description" class="form-control" placeholder="Brief description of the product...">${item?.description || ''}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Product Media</label>
          <div id="product-media-uploader"></div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label for="enquiry_text">Button Text</label>
            <input type="text" id="enquiry_text" class="form-control" value="${item?.enquiry_text || 'Inquiries'}">
          </div>
          
          <div class="form-group">
            <label class="form-label" for="enquiry_url">Enquiry URL</label>
            <input type="text" id="enquiry_url" class="form-control" value="${item?.enquiry_url || 'contact.html'}">
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label" for="status">Status</label>
            <select id="status" class="form-control">
              <option value="active" ${item?.is_active !== false ? 'selected' : ''}>Active</option>
              <option value="inactive" ${item?.is_active === false ? 'selected' : ''}>Inactive</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="display_order">Display Order</label>
            <input type="number" id="display_order" class="form-control" value="${item?.display_order || 0}" min="0">
          </div>
        </div>
        
        <div class="modal-actions mt-4">
          <button type="button" class="btn-outline" onclick="window.UI.closeModal('admin-modal')">Cancel</button>
          <button type="submit" class="btn-primary">Save Product</button>
        </div>
      </form>
    `;

    // Initialize Media Uploader
    const mediaUploader = new MediaUploader('product-media-uploader', {
      defaultMedia: item?.image_url || null,
      defaultMediaType: item?.media_type || 'image'
    });

    // Handle submit
    document.getElementById('product-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const saveBtn = e.target.querySelector('button[type="submit"]');
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
      
      try {
        // Upload media first if needed
        const uploadedMedia = await mediaUploader.upload();

        const payload = {
          name: document.getElementById('name').value.trim(),
          category: document.getElementById('category').value,
          description: document.getElementById('description').value.trim(),
          image_url: uploadedMedia?.url || '',
          media_type: uploadedMedia?.type || 'image',
          enquiry_url: document.getElementById('enquiry_url').value.trim() || 'contact.html',
          enquiry_text: document.getElementById('enquiry_text').value.trim() || 'Inquiries',
          is_active: document.getElementById('status').value === 'active',
          display_order: parseInt(document.getElementById('display_order').value) || 0
        };
      
        if (currentEditId) payload.id = currentEditId;
      
        const { error } = await API.saveProduct(payload);
        if (error) throw error;
        
        UI.showToast('Product saved successfully!');
        UI.closeModal('admin-modal');
        await this.loadData();
      } catch (err) {
        console.error(err);
        UI.showToast('Failed to save product.', 'error');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Product';
      }
    });

    UI.openModal('admin-modal', id ? 'Edit Product' : 'Add Product');
  },

  editItem(id) {
    this.showForm(id);
  },

  deleteItem(id) {
    UI.confirmAction('Are you sure you want to delete this product?', async () => {
      try {
        const { error } = await API.deleteProduct(id);
        if (error) throw error;
        
        UI.showToast('Product deleted.');
        await this.loadData();
      } catch (err) {
        console.error(err);
        UI.showToast('Failed to delete product.', 'error');
      }
    });
  }
};
