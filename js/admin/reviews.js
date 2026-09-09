import { ReviewService } from '../services/reviewService.js';
import { UI } from './ui.js';

let currentReviews = [];
const activeDeletions = new Set();

export const ReviewsController = {
  async renderView(container) {
    container.innerHTML = `
      <div class="admin-card">
        <div class="table-responsive">
          <table class="admin-table" id="reviews-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Rating</th>
                <th class="col-message">Review</th>
                <th>Status</th>
                <th>Created</th>
                <th class="actions-cell">Actions</th>
              </tr>
            </thead>
            <tbody id="reviews-tbody">
              <tr><td colspan="6" class="text-center" style="padding: 2rem;">Loading reviews...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    await this.loadData();
  },

  async loadData() {
    const tbody = document.getElementById('reviews-tbody');
    if (!tbody) {
      console.error('[ReviewsController] Missing #reviews-tbody element.');
      return;
    }

    try {
      const { data, error } = await ReviewService.getAllReviews();
      console.debug('[ReviewsController] admin review load result', {
        rowCount: data?.length || 0,
        error
      });
      if (error) throw new Error(error);

      currentReviews = data || [];
      this.renderTable(tbody);
    } catch (error) {
      console.error(error);
      UI.showToast('Failed to load reviews.', 'error');
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">${this.escape(error.message || 'Error loading reviews.')}</td></tr>`;
    }
  },

  renderTable(tbody) {
    if (!currentReviews.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <p>No reviews submitted yet.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = currentReviews.map((review) => {
      const statusClass = this.getStatusBadgeClass(review.status);
      const createdAt = review.created_at ? new Date(review.created_at).toLocaleString() : 'Unknown';
      const fullReview = review.review ? String(review.review).trim() : 'No review text provided';

      return `
        <tr>
          <td>
            <div style="font-weight: 600;">${this.escape(review.customer_name || 'Unknown')}</div>
          </td>
          <td>
            <div class="reviews-admin-rating" aria-label="Rated ${review.rating || 0} out of 5 stars">
              ${Array.from({ length: 5 }, (_, index) => `<span class="reviews-admin-star ${index < (review.rating || 0) ? 'is-filled' : ''}">★</span>`).join('')}
            </div>
          </td>
          <td class="message-cell">
            <div class="admin-message-bubble">${this.escape(fullReview)}</div>
          </td>
          <td><span class="badge ${statusClass}">${this.escape(this.formatStatus(review.status))}</span></td>
          <td>${this.escape(createdAt)}</td>
          <td class="actions-cell">
            ${this.statusActionButton(review)}
            <button class="btn-icon" onclick="window.ReviewsController.viewItem('${review.id}')" aria-label="View review">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
            <button class="btn-icon text-danger" onclick="window.ReviewsController.deleteItem('${review.id}')" aria-label="Delete review">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  statusActionButton(review) {
    if (review.status === 'approved') {
      return `<button class="btn-icon" onclick="window.ReviewsController.setStatus('${review.id}', 'rejected')" aria-label="Reject review" title="Reject review">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"></path><path d="M6 6l12 12"></path></svg>
      </button>`;
    }

    return `<button class="btn-icon" onclick="window.ReviewsController.setStatus('${review.id}', 'approved')" aria-label="Approve review" title="Approve review">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
    </button>`;
  },

  async setStatus(id, status) {
    const review = currentReviews.find((item) => String(item.id) === String(id));
    if (!review) return;

    const actionLabel = status === 'approved' ? 'approve' : 'reject';
    UI.confirmAction(`Are you sure you want to ${actionLabel} this review?`, async () => {
      try {
        const { error } = await ReviewService.updateReviewStatus(id, status);
        if (error) throw error;

        UI.showToast(`Review ${status === 'approved' ? 'approved' : 'rejected'}.`, 'success');
        await this.loadData();
      } catch (error) {
        console.error(error);
        UI.showToast('Failed to update review status.', 'error');
      }
    });
  },

  async deleteItem(id) {
    if (!id || (typeof id === 'string' && !id.trim()) || id === 'undefined' || id === 'null') {
      console.error('[ReviewsController] deleteItem: Invalid review ID provided:', id);
      UI.showToast('Invalid review selected for deletion.', 'error');
      return;
    }

    const cleanId = typeof id === 'string' ? id.trim() : id;
    const review = currentReviews.find((item) => String(item.id) === String(cleanId));
    if (!review) {
      console.warn('[ReviewsController] Review not found in active list:', cleanId);
      UI.showToast('Review not found or already deleted.', 'error');
      return;
    }

    if (activeDeletions.has(cleanId)) {
      console.warn('[ReviewsController] Deletion already in progress for review ID:', cleanId);
      return;
    }

    const reviewerLabel = review.customer_name ? ` from "${review.customer_name}"` : '';
    UI.confirmAction(`Delete this review submission${reviewerLabel} permanently?`, async () => {
      if (activeDeletions.has(cleanId)) return;
      activeDeletions.add(cleanId);

      try {
        const { error } = await ReviewService.deleteReview(cleanId);
        if (error) {
          throw new Error(error);
        }

        UI.showToast('Review deleted.', 'success');

        // Only remove the deleted review from local UI state after confirmed deletion
        currentReviews = currentReviews.filter((item) => String(item.id) !== String(cleanId));
        const tbody = document.getElementById('reviews-tbody');
        if (tbody) {
          this.renderTable(tbody);
        }
      } catch (error) {
        console.error('[ReviewsController] Delete failed:', error);
        UI.showToast(error.message || 'Failed to delete review.', 'error');
        // Re-sync with database to ensure UI reflects actual state
        await this.loadData();
      } finally {
        activeDeletions.delete(cleanId);
      }
    });
  },

  async viewItem(id) {
    const review = currentReviews.find((item) => String(item.id) === String(id));
    if (!review) return;

    UI.openModal('admin-modal', 'Review Details');
    const modalBody = document.getElementById('modal-body');
    const starMarkup = Array.from({ length: 5 }, (_, index) =>
      `<span class="reviews-admin-star ${index < (review.rating || 0) ? 'is-filled' : ''}">★</span>`
    ).join('');

    modalBody.innerHTML = `
      <div class="stack">
        <div class="form-group">
          <label>Name</label>
          <div class="text-bold">${this.escape(review.customer_name || 'Unknown')}</div>
        </div>
        <div class="form-group">
          <label>Rating</label>
          <div class="reviews-admin-rating" aria-label="Rated ${review.rating || 0} out of 5 stars">${starMarkup}</div>
        </div>
        <div class="form-group">
          <label>Status</label>
          <div><span class="badge ${this.getStatusBadgeClass(review.status)}">${this.escape(this.formatStatus(review.status))}</span></div>
        </div>
        <div class="form-group">
          <label>Customer Review</label>
          <div class="admin-modal-message-view">${this.escape(review.review || 'No review text provided')}</div>
        </div>
        <div class="form-group">
          <label>Created</label>
          <div>${this.escape(review.created_at ? new Date(review.created_at).toLocaleString() : 'Unknown')}</div>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-outline" onclick="window.UI.closeModal('admin-modal')">Close</button>
        </div>
      </div>
    `;
  },

  getStatusBadgeClass(status) {
    switch (status) {
      case 'approved':
        return 'badge-success';
      case 'rejected':
        return 'badge-danger';
      default:
        return 'badge-primary';
    }
  },

  formatStatus(status) {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
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

window.ReviewsController = ReviewsController;
