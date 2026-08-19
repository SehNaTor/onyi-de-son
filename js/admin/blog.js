import { API } from './api.js';
import { UI } from './ui.js';
import { MediaUploader } from '../components/MediaUploader.js';
import { renderMedia } from '../utils/media.js';

let currentBlogs = [];
let currentEditId = null;

export const BlogController = {
  async renderView(container) {
    container.innerHTML = `
      <div class="admin-card">
        <div class="table-responsive">
          <table class="admin-table" id="blog-table">
            <thead>
              <tr>
                <th class="thumbnail-cell">Image</th>
                <th>Title</th>
                <th>Status</th>
                <th>Published Date</th>
                <th class="actions-cell">Actions</th>
              </tr>
            </thead>
            <tbody id="blog-tbody">
              <tr><td colspan="5" class="text-center" style="padding: 2rem;">Loading blogs...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    await this.loadData();
  },

  async loadData() {
    const tbody = document.getElementById('blog-tbody');
    try {
      const { data, error } = await API.fetchBlogs();
      if (error) throw error;
      
      currentBlogs = data || [];
      this.renderTable(tbody);
    } catch (err) {
      console.error(err);
      UI.showToast('Failed to load blog posts.', 'error');
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error loading data.</td></tr>`;
    }
  },

  formatDate(dateString) {
    if (!dateString) return 'Not set';
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit'
      }).format(new Date(dateString));
    } catch (e) {
      return 'Invalid Date';
    }
  },

  renderTable(tbody) {
    if (currentBlogs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5">
            <div class="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <p>No blog posts found. Create your first post!</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = currentBlogs.map(blog => `
      <tr>
        <td>
          ${blog.image_url ? renderMedia({ image_url: blog.image_url, media_type: 'image' }, 'table-thumbnail') : '<span class="badge badge-muted">No Image</span>'}
        </td>
        <td><strong>${blog.title}</strong></td>
        <td>
          <span class="badge ${blog.is_published ? 'badge-success' : 'badge-muted'}">
            ${blog.is_published ? 'Published' : 'Draft'}
          </span>
        </td>
        <td>${blog.is_published ? this.formatDate(blog.published_at) : '-'}</td>
        <td class="actions-cell">
          <button class="btn-icon" onclick="window.BlogController.togglePublish('${blog.id}', ${blog.is_published})" aria-label="${blog.is_published ? 'Unpublish' : 'Publish'}" title="${blog.is_published ? 'Unpublish' : 'Publish'}">
            ${blog.is_published ? 
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>' : 
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
            }
          </button>
          <button class="btn-icon" onclick="window.BlogController.editItem('${blog.id}')" aria-label="Edit" title="Edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn-icon text-danger" onclick="window.BlogController.deleteItem('${blog.id}')" aria-label="Delete" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </td>
      </tr>
    `).join('');
  },

  showForm(id = null) {
    currentEditId = id;
    const blog = id ? currentBlogs.find(b => b.id === id) : null;
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
      <form id="blog-form">
        <div class="form-group">
          <label class="form-label" for="blog-title">Title *</label>
          <input type="text" id="blog-title" class="form-control" value="${blog?.title || ''}" placeholder="Post Title" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">Cover Image (Optional)</label>
          <div id="blog-media-uploader"></div>
        </div>
        
        <div class="form-group">
          <label class="form-label" for="blog-content">Content *</label>
          <textarea id="blog-content" class="form-control" rows="8" placeholder="Write your post content here..." required>${blog?.content || ''}</textarea>
        </div>

        <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem;">
          <input type="checkbox" id="blog-is-published" ${blog?.is_published ? 'checked' : ''}>
          <label for="blog-is-published" style="margin: 0; cursor: pointer; font-weight: 500;">Publish Post immediately</label>
        </div>
        
        <div class="modal-actions">
          <button type="button" class="btn-outline" id="btn-cancel-form">Cancel</button>
          <button type="submit" class="btn-primary" id="btn-save-form">Save Post</button>
        </div>
      </form>
    `;

    UI.openModal('admin-modal', id ? 'Edit Blog Post' : 'Create Blog Post');

    // Initialize Media Uploader
    const uploader = new MediaUploader('blog-media-uploader', {
      defaultMedia: blog?.image_url || null,
      defaultMediaType: 'image'
    });

    // Form Event Listeners
    document.getElementById('btn-cancel-form').addEventListener('click', () => UI.closeModal('admin-modal'));
    
    document.getElementById('blog-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const title = document.getElementById('blog-title').value.trim();
      const content = document.getElementById('blog-content').value.trim();
      const is_published = document.getElementById('blog-is-published').checked;
      
      if (!title || !content) {
        UI.showToast('Title and content are required.', 'error');
        return;
      }

      const btnSave = document.getElementById('btn-save-form');
      const originalText = btnSave.textContent;
      btnSave.disabled = true;
      btnSave.textContent = 'Saving...';

      try {
        const media = await uploader.upload();
        
        const payload = {
          title,
          content,
          image_url: media?.url || null,
          is_published,
          // Set published_at if publishing for the first time, else leave alone.
          // In a real app we might allow editing the exact date.
          published_at: is_published && (!blog || !blog.published_at) ? new Date().toISOString() : (blog?.published_at || null)
        };

        if (currentEditId) {
          payload.id = currentEditId;
          payload.updated_at = new Date().toISOString();
        }

        const { error } = await API.saveBlog(payload);
        if (error) throw error;

        UI.showToast(`Post ${currentEditId ? 'updated' : 'created'} successfully!`);
        UI.closeModal('admin-modal');
        await this.loadData();
      } catch (err) {
        console.error(err);
        UI.showToast('Failed to save post.', 'error');
      } finally {
        btnSave.disabled = false;
        btnSave.textContent = originalText;
      }
    });
  },

  editItem(id) {
    this.showForm(id);
  },

  deleteItem(id) {
    UI.confirmAction(
      'Are you sure you want to delete this post? This action cannot be undone.',
      async () => {
        try {
          const { error } = await API.deleteBlog(id);
          if (error) throw error;
          
          UI.showToast('Post deleted successfully.');
          await this.loadData();
        } catch (err) {
          console.error(err);
          UI.showToast('Failed to delete post.', 'error');
        }
      }
    );
  },

  async togglePublish(id, currentlyPublished) {
    const newStatus = !currentlyPublished;
    const blog = currentBlogs.find(b => b.id === id);
    
    // If it's being published for the very first time, set the date.
    let published_at = blog?.published_at;
    if (newStatus && !published_at) {
      published_at = new Date().toISOString();
    }

    try {
      const { error } = await API.saveBlog({
        id,
        is_published: newStatus,
        published_at,
        updated_at: new Date().toISOString()
      });
      
      if (error) throw error;
      
      UI.showToast(`Post successfully ${newStatus ? 'published' : 'unpublished'}.`);
      await this.loadData(); // Re-fetch to guarantee sync with Supabase
    } catch (err) {
      console.error(err);
      UI.showToast(`Failed to ${newStatus ? 'publish' : 'unpublish'} post.`, 'error');
    }
  }
};
