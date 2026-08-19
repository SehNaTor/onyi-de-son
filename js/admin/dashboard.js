import { AnalyticsService } from '../services/analyticsService.js';

export const DashboardController = {
  container: null,

  async renderView(containerElement) {
    this.container = containerElement;
    
    // Initial UI with loading state
    this.container.innerHTML = `
      <div class="dashboard-container">
        ${this.renderSkeletons()}
      </div>
    `;

    // Fetch analytics data
    const { data, error } = await AnalyticsService.getDashboardStats();

    if (error) {
      this.container.innerHTML = `
        <div class="dashboard-container">
          <div class="dashboard-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3>Failed to load analytics</h3>
            <p>${error}</p>
            <button class="btn-primary" id="btn-dashboard-retry">
              Retry
            </button>
          </div>
        </div>
      `;
      
      document.getElementById('btn-dashboard-retry').addEventListener('click', () => {
        this.renderView(this.container);
      });
      return;
    }

    // Render Actual Data
    this.container.innerHTML = `
      <div class="dashboard-container">
        <!-- Main Stats Overview -->
        <section class="dashboard-overview">
          <h2 class="dashboard-section-title">Overview</h2>
          <div class="stats-grid">
            ${this.renderStatCard('Total Images', data.totals.images, 'image')}
            ${this.renderStatCard('Total Videos', data.totals.videos, 'video')}
            ${this.renderStatCard('Total Media', data.totals.media, 'media')}
            ${this.renderStatCard('Total Contacts', data.totals.contacts, 'contact')}
            
            <div class="stat-card">
              <div class="stat-icon-wrapper blog" style="background-color: rgba(236, 72, 153, 0.1); color: #ec4899;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              </div>
              <div class="stat-content">
                <p class="stat-title">Published Blogs</p>
                <h3 class="stat-value">${data.totals.blogs.published}</h3>
                <span style="font-size: 0.75rem; color: var(--admin-text-muted); margin-top: 0.25rem;">${data.totals.blogs.draft} in draft</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Media Breakdown -->
        <section class="dashboard-breakdown">
          <h2 class="dashboard-section-title">Media Distribution</h2>
          <div class="breakdown-grid">
            ${this.renderBreakdownCard('Gallery', data.breakdown.gallery)}
            ${this.renderBreakdownCard('Projects', data.breakdown.projects)}
            ${this.renderBreakdownCard('Products', data.breakdown.products)}
          </div>
        </section>
      </div>
    `;
  },

  renderStatCard(title, value, type) {
    const icons = {
      image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
      video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`,
      media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>`,
      contact: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
      blog: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`
    };

    return `
      <div class="stat-card">
        <div class="stat-icon-wrapper ${type}">
          ${icons[type]}
        </div>
        <div class="stat-content">
          <p class="stat-title">${title}</p>
          <h3 class="stat-value">${value}</h3>
        </div>
      </div>
    `;
  },

  renderBreakdownCard(title, data) {
    const total = data.total;
    // Prevent division by zero
    const imagePercent = total > 0 ? (data.images / total) * 100 : 0;
    const videoPercent = total > 0 ? (data.videos / total) * 100 : 0;

    return `
      <div class="breakdown-card">
        <div class="breakdown-header">
          <h4 class="breakdown-title">${title}</h4>
          <span class="breakdown-total">${total} items</span>
        </div>
        
        <div class="breakdown-bar">
          <div class="breakdown-segment image" style="width: ${imagePercent}%"></div>
          <div class="breakdown-segment video" style="width: ${videoPercent}%"></div>
        </div>

        <div class="breakdown-legend">
          <div class="legend-item">
            <span class="legend-dot image"></span>
            <span class="legend-label">Images</span>
            <span class="legend-value">${data.images}</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot video"></span>
            <span class="legend-label">Videos</span>
            <span class="legend-value">${data.videos}</span>
          </div>
        </div>
      </div>
    `;
  },

  renderSkeletons() {
    return `
      <section class="dashboard-overview">
        <div class="skeleton skeleton-title"></div>
        <div class="stats-grid">
          <div class="stat-card skeleton-card"></div>
          <div class="stat-card skeleton-card"></div>
          <div class="stat-card skeleton-card"></div>
          <div class="stat-card skeleton-card"></div>
        </div>
      </section>
      <section class="dashboard-breakdown">
        <div class="skeleton skeleton-title"></div>
        <div class="breakdown-grid">
          <div class="breakdown-card skeleton-card"></div>
          <div class="breakdown-card skeleton-card"></div>
          <div class="breakdown-card skeleton-card"></div>
        </div>
      </section>
    `;
  }
};
