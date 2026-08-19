import { API } from './api.js';
import { UI } from './ui.js';
import { MediaUploader } from '../components/MediaUploader.js';
import { renderMedia } from '../utils/media.js';

let currentItems = [];
let currentEditId = null;

export const ProjectsController = {
  async renderView(container) {
    container.innerHTML = `
      <div class="admin-card">
        <div class="table-responsive">
          <table class="admin-table" id="projects-table">
            <thead>
              <tr>
                <th class="thumbnail-cell">Cover</th>
                <th>Project Details</th>
                <th>Status</th>
                <th>Order</th>
                <th class="actions-cell">Actions</th>
              </tr>
            </thead>
            <tbody id="projects-tbody">
              <tr><td colspan="5" class="text-center" style="padding: 2rem;">Loading projects...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    await this.loadData();
  },

  async loadData() {
    const tbody = document.getElementById('projects-tbody');
    try {
      const { data, error } = await API.fetchProjects();
      if (error) throw error;
      
      currentItems = data || [];
      this.renderTable(tbody);
    } catch (err) {
      console.error(err);
      UI.showToast('Failed to load projects.', 'error');
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error loading data.</td></tr>`;
    }
  },

  renderTable(tbody) {
    if (currentItems.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5">
            <div class="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              <p>No projects found. Create your first project!</p>
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
          <div style="font-weight: 600; margin-bottom: 0.25rem;">${item.title || 'Untitled'}</div>
          <div style="font-size: 0.75rem; color: var(--admin-text-muted);">${item.category || 'Uncategorized'}</div>
        </td>
        <td>
          ${item.status === 'active' 
            ? '<span class="badge badge-success">Active</span>' 
            : '<span class="badge badge-muted">Inactive</span>'}
          ${item.featured 
            ? '<span class="badge badge-primary" style="margin-left: 0.25rem;">Featured</span>' 
            : ''}
        </td>
        <td>${item.display_order || 0}</td>
        <td class="actions-cell">
          <button class="btn-icon" onclick="window.ProjectsController.editItem('${item.id}')" aria-label="Edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn-icon text-danger" onclick="window.ProjectsController.deleteItem('${item.id}')" aria-label="Delete">
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
      <form id="project-form">
        <div class="form-group">
          <label class="form-label" for="title">Project Title *</label>
          <input type="text" id="title" class="form-control" required value="${item?.title || ''}" placeholder="E.g., Warehouse Canopy Installation">
        </div>
        
        <div class="form-group">
          <label class="form-label" for="category">Category</label>
          <input type="text" id="category" class="form-control" value="${item?.category || ''}" placeholder="E.g., Industrial">
        </div>
        
        <div class="form-group">
          <label class="form-label" for="description">Description</label>
          <textarea id="description" class="form-control" placeholder="Brief description of the project...">${item?.description || ''}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Cover Media</label>
          <div id="project-media-uploader"></div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label" for="status">Status</label>
            <select id="status" class="form-control">
              <option value="active" ${item?.status !== 'inactive' ? 'selected' : ''}>Active</option>
              <option value="inactive" ${item?.status === 'inactive' ? 'selected' : ''}>Inactive</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="display_order">Display Order</label>
            <input type="number" id="display_order" class="form-control" value="${item?.display_order || 0}" min="0">
          </div>
        </div>

        <div class="form-group" style="margin-top: 0.5rem;">
          <label class="checkbox-label">
            <input type="checkbox" id="featured" ${item?.featured ? 'checked' : ''}>
            Feature this project on the homepage/highlights
          </label>
        </div>
        
        <div class="modal-actions mt-4">
          <button type="button" class="btn-outline" onclick="window.UI.closeModal('admin-modal')">Cancel</button>
          <button type="submit" class="btn-primary">Save Project</button>
        </div>
      </form>
    `;

    // Initialize Media Uploader
    const mediaUploader = new MediaUploader('project-media-uploader', {
      defaultMedia: item?.image_url || null,
      defaultMediaType: item?.media_type || 'image'
    });

    // Handle submit
    document.getElementById('project-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const saveBtn = e.target.querySelector('button[type="submit"]');
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
      
      try {
        // Upload media first if needed
        const uploadedMedia = await mediaUploader.upload();

        const payload = {
          title: document.getElementById('title').value.trim(),
          category: document.getElementById('category').value.trim(),
          description: document.getElementById('description').value.trim(),
          image_url: uploadedMedia?.url || '',
          media_type: uploadedMedia?.type || 'image',
          status: document.getElementById('status').value,
          display_order: parseInt(document.getElementById('display_order').value) || 0,
          featured: document.getElementById('featured').checked
        };
      
      if (currentEditId) payload.id = currentEditId;
      
      const { error } = await API.saveProject(payload);
      if (error) throw error;
        
        UI.showToast('Project saved successfully!');
        UI.closeModal('admin-modal');
        await this.loadData();
      } catch (err) {
        console.error(err);
        UI.showToast('Failed to save project.', 'error');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Project';
      }
    });

    UI.openModal('admin-modal', id ? 'Edit Project' : 'Add Project');
  },

  editItem(id) {
    this.showForm(id);
  },

  deleteItem(id) {
    UI.confirmAction('Are you sure you want to delete this project?', async () => {
      try {
        const { error } = await API.deleteProject(id);
        if (error) throw error;
        
        UI.showToast('Project deleted.');
        await this.loadData();
      } catch (err) {
        console.error(err);
        UI.showToast('Failed to delete project.', 'error');
      }
    });
  }
};
