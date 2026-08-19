import { BlogService } from '../services/blogService.js';

/**
 * Public Blog Page Controller
 * Fetches published posts from Supabase and renders premium editorial cards
 * with a Read More detail modal for full content viewing.
 */
class BlogPageController {
  constructor() {
    this.container = document.getElementById('blog-grid');
    if (!this.container) return;

    this.posts = [];
    this.modal = null;
    this.init();
  }

  async init() {
    this.renderSkeletons();
    this.createModal();

    const { data, error } = await BlogService.getPublishedPosts();

    if (error) {
      this.renderError(error);
      return;
    }

    if (!data || data.length === 0) {
      this.renderEmptyState();
      return;
    }

    this.posts = data;
    this.renderPosts(data);
  }

  // ── Modal ──────────────────────────────────────────────
  createModal() {
    if (document.getElementById('blog-detail-modal')) return;

    const overlay = document.createElement('div');
    overlay.className = 'blog-modal-overlay';
    overlay.id = 'blog-detail-modal';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="blog-modal" role="dialog" aria-modal="true">
        <div class="blog-modal__header">
          <span class="blog-modal__date" id="modal-post-date"></span>
          <button class="blog-modal__close" id="blog-modal-close" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <img class="blog-modal__image" id="modal-post-image" alt="" style="display: none;">
        <div class="blog-modal__body">
          <h2 class="blog-modal__title" id="modal-post-title"></h2>
          <div class="blog-modal__content" id="modal-post-content"></div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.modal = overlay;

    // Close handlers
    document.getElementById('blog-modal-close').addEventListener('click', () => this.closeModal());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('is-open')) {
        this.closeModal();
      }
    });
  }

  openModal(post) {
    const dateEl = document.getElementById('modal-post-date');
    const imageEl = document.getElementById('modal-post-image');
    const titleEl = document.getElementById('modal-post-title');
    const contentEl = document.getElementById('modal-post-content');

    // Date
    const calIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
    dateEl.innerHTML = `${calIcon} <time datetime="${post.published_at}">${this.formatDate(post.published_at)}</time>`;

    // Image
    if (post.image_url && post.image_url.trim() !== '') {
      imageEl.src = post.image_url;
      imageEl.alt = post.title;
      imageEl.style.display = 'block';
    } else {
      imageEl.style.display = 'none';
      imageEl.src = '';
    }

    // Title & Content
    titleEl.textContent = post.title;
    contentEl.textContent = post.content;

    // Open
    this.modal.classList.add('is-open');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus trap: move focus into modal
    document.getElementById('blog-modal-close').focus();
  }

  closeModal() {
    this.modal.classList.remove('is-open');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ── Rendering ──────────────────────────────────────────
  renderSkeletons() {
    const count = window.innerWidth >= 1024 ? 6 : window.innerWidth >= 640 ? 4 : 3;
    const skeletonHTML = Array(count).fill(`
      <article class="skeleton-card">
        <div class="skeleton-img skeleton-anim"></div>
        <div class="skeleton-text-container">
          <div class="skeleton-line short skeleton-anim"></div>
          <div class="skeleton-line title skeleton-anim"></div>
          <div class="skeleton-line full skeleton-anim"></div>
          <div class="skeleton-line full skeleton-anim"></div>
          <div class="skeleton-line short skeleton-anim" style="margin-top: auto;"></div>
        </div>
      </article>
    `).join('');

    this.container.innerHTML = skeletonHTML;
  }

  renderEmptyState() {
    this.container.innerHTML = `
      <div class="blog-state-container reveal-on-scroll is-visible">
        <svg class="state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
        <h2>No stories published yet</h2>
        <p class="blog-state-message">We're preparing our latest industry insights and updates. Check back soon for fresh content.</p>
      </div>
    `;
  }

  renderError(errorMessage) {
    this.container.innerHTML = `
      <div class="blog-state-container reveal-on-scroll is-visible">
        <svg class="state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-error, #ef4444);">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2>Something went wrong</h2>
        <p class="blog-state-message">${errorMessage}</p>
        <button class="btn-outline focus-ring" onclick="window.location.reload()">Try Again</button>
      </div>
    `;
  }

  // ── Posts ──────────────────────────────────────────────
  formatDate(dateString) {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch (e) {
      return '';
    }
  }

  renderPosts(posts) {
    const calendarIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
    const arrowIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

    const postsHTML = posts.map((post, index) => {
      const hasImage = post.image_url && post.image_url.trim() !== '';
      const cardClass = hasImage ? 'blog-card' : 'blog-card blog-card--no-image';

      const imageHTML = hasImage ? `
        <div class="blog-card__image-wrapper">
          <img src="${post.image_url}" alt="${post.title}" class="blog-card__image" loading="lazy" onerror="this.closest('.blog-card').classList.add('blog-card--no-image'); this.closest('.blog-card__image-wrapper').style.display='none';">
        </div>
      ` : '';

      return `
        <article class="${cardClass} reveal-on-scroll" data-post-index="${index}">
          ${imageHTML}
          <div class="blog-card__content">
            <span class="blog-card__date">
              ${calendarIcon}
              <time datetime="${post.published_at}">${this.formatDate(post.published_at)}</time>
            </span>
            <h2 class="blog-card__title">${post.title}</h2>
            <p class="blog-card__excerpt">${post.content}</p>
            <button class="blog-card__read-more" data-post-index="${index}" aria-label="Read full article: ${post.title}">
              Read More ${arrowIcon}
            </button>
          </div>
        </article>
      `;
    }).join('');

    this.container.innerHTML = postsHTML;

    // Bind Read More buttons using event delegation
    this.container.addEventListener('click', (e) => {
      const readMoreBtn = e.target.closest('.blog-card__read-more');
      if (!readMoreBtn) return;

      const postIndex = parseInt(readMoreBtn.dataset.postIndex, 10);
      const post = this.posts[postIndex];
      if (post) this.openModal(post);
    });

    this.observeNewCards();
  }

  observeNewCards() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    this.container.querySelectorAll('.reveal-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new BlogPageController();
});
