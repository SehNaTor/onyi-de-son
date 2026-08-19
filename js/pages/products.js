import { ProductService } from '../services/productService.js';
import { renderMedia } from '../utils/media.js';

export const initProducts = async () => {
  const containers = {
    Wallpaper: document.getElementById('wallpaper-container'),
    Tarpaulin: document.getElementById('tarpaulin-container'),
    Carport: document.getElementById('carport-container')
  };

  // Render skeletons for all present containers
  Object.values(containers).forEach(container => {
    if (container) {
      container.innerHTML = Array(3).fill(getSkeletonHTML()).join('');
    }
  });

  const { data: products, error } = await ProductService.fetchActiveProducts();

  if (error || !products) {
    Object.values(containers).forEach(container => {
      if (container) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
            <p style="color: var(--color-error); font-size: 1.125rem;">Failed to load products. Please try again later.</p>
          </div>
        `;
      }
    });
    return;
  }

  // Group by category
  const groupedProducts = {
    Wallpaper: products.filter(p => p.category === 'Wallpaper'),
    Tarpaulin: products.filter(p => p.category === 'Tarpaulin'),
    Carport: products.filter(p => p.category === 'Carport')
  };

  // Render products
  Object.entries(groupedProducts).forEach(([category, items]) => {
    const container = containers[category];
    if (!container) return;

    if (items.length === 0) {
      const sectionId = category.toLowerCase();
      const section = document.getElementById(sectionId);
      if (section) {
        section.style.display = 'none';
      } else {
        container.style.display = 'none';
      }
      return;
    }

    container.innerHTML = items.map(product => getProductHTML(product)).join('');
  });
};

function getProductHTML(product) {
  return `
    <div class="prod-card reveal-on-scroll is-visible">
      <div class="prod-card__img-wrap">
        ${renderMedia(product, 'prod-card__img')}
      </div>
      <div class="prod-card__content">
        <span class="prod-card__badge">${product.category}</span>
        <h3 class="prod-card__title">${product.name}</h3>
        <p class="prod-card__desc">${product.description || ''}</p>
        <a href="${product.enquiry_url || 'contact.html'}" class="prod-card__btn focus-ring">${product.enquiry_text || 'Inquiries'}</a>
      </div>
    </div>
  `;
}

function getSkeletonHTML() {
  return `
    <div class="prod-card" style="animation: pulse 1.5s infinite ease-in-out; border-color: rgba(255,255,255,0.05);">
      <div class="prod-card__img-wrap" style="background: rgba(128,128,128,0.2); border-radius: var(--radius-xl) var(--radius-xl) 0 0;"></div>
      <div class="prod-card__content">
        <div style="width: 30%; height: 24px; background: rgba(128,128,128,0.2); border-radius: var(--radius-pill); margin-bottom: var(--space-4);"></div>
        <div style="width: 80%; height: 28px; background: rgba(128,128,128,0.2); border-radius: var(--radius-sm); margin-bottom: var(--space-3);"></div>
        <div style="width: 100%; height: 60px; background: rgba(128,128,128,0.2); border-radius: var(--radius-sm); margin-bottom: var(--space-4);"></div>
        <div style="width: 100%; height: 44px; background: rgba(128,128,128,0.2); border-radius: var(--radius-pill);"></div>
      </div>
    </div>
  `;
}

// Add CSS keyframes for skeleton pulsing if not present globally
if (!document.getElementById('skeleton-styles')) {
  const style = document.createElement('style');
  style.id = 'skeleton-styles';
  style.textContent = `
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}
