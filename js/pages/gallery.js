import { supabase } from '../supabase.js';
import { renderMedia } from '../utils/media.js';

export async function initGalleryPage() {
  const galleryGrid = document.getElementById('gallery-grid');
  const emptyState = document.getElementById('gallery-empty');
  
  // Lightbox Elements
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxMediaContainer = document.getElementById('lightbox-media-container');
  const lightboxCaption = document.getElementById('lightbox-caption');

  // Load Data
  try {
    const { data: galleryItems, error } = await supabase
      .from('gallery')
      .select('id, image_url, media_type, caption, display_order')
      .order('display_order', { ascending: true });

    if (error) {
      throw error;
    }

    // Remove loading state
    galleryGrid.innerHTML = '';

    if (!galleryItems || galleryItems.length === 0) {
      emptyState.style.display = 'block';
      return;
    }

    // Render Items
    galleryItems.forEach(item => {
      const article = document.createElement('article');
      article.className = 'gallery-item reveal-on-scroll';
      article.tabIndex = 0; // Make focusable
      article.setAttribute('role', 'button');
      article.setAttribute('aria-label', `View image: ${item.caption || 'Gallery image'}`);
      
      article.innerHTML = `
        ${renderMedia(item, 'gallery-item__image')}
        ${item.caption ? `
          <div class="gallery-item__overlay">
            <p class="gallery-item__caption">${item.caption}</p>
          </div>
        ` : ''}
      `;

      // Event Listeners for Lightbox
      article.addEventListener('click', () => openLightbox(item));
      article.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(item);
        }
      });

      galleryGrid.appendChild(article);
    });

    // Initialize Scroll Reveal for newly added elements
    initScrollReveal();

  } catch (error) {
    console.error('Error fetching gallery items:', error);
    galleryGrid.innerHTML = ''; // Clear loading
    emptyState.textContent = 'Failed to load gallery. Please try again later.';
    emptyState.style.display = 'block';
  }

  // Lightbox Functions
  function openLightbox(item) {
    // Remove old media element if any
    const oldMedia = lightboxMediaContainer.querySelector('.gallery-lightbox__image');
    if (oldMedia) oldMedia.remove();

    // Insert new media element before the caption
    const mediaHtml = renderMedia(item, 'gallery-lightbox__image');
    lightboxMediaContainer.insertAdjacentHTML('afterbegin', mediaHtml);
    
    lightboxCaption.textContent = item.caption || '';
    
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    
    // Focus close button for accessibility
    setTimeout(() => lightboxClose.focus(), 100);
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    
    // Clear media after transition ends so it doesn't flash the old content next time
    setTimeout(() => {
      if (!lightbox.classList.contains('is-open')) {
        const oldMedia = lightboxMediaContainer.querySelector('.gallery-lightbox__image');
        if (oldMedia) oldMedia.remove();
      }
    }, 300);
  }

  // Lightbox Event Listeners
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });

  // Reusable Scroll Reveal Logic
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.gallery-item.reveal-on-scroll');
    if (revealElements.length > 0 && 'IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('is-visible'));
    }
  }
}
