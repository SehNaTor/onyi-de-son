import { ReviewService } from '../services/reviewService.js';

export class ReviewsSection {
  constructor(root = document.querySelector('[data-reviews-root]')) {
    this.root = root;
    this.reviews = [];
    this.currentIndex = 0;
    this.startX = 0;
    this.startScrollLeft = 0;
    this.pendingTouch = false;

    if (!this.root) return;

    this.root.innerHTML = `
      <section class="reviews-section section-padding" aria-labelledby="reviews-heading">
        <div class="reviews-section__inner reveal-on-scroll">
          <div class="reviews-section__header">
            <div>
              <span class="reviews-section__eyebrow">Client Reviews</span>
              <h2 id="reviews-heading" class="reviews-section__title">What our customers say</h2>
            </div>
            <button class="reviews-section__drop-btn btn-primary focus-ring" type="button" data-open-review-modal>
              Drop a Review
            </button>
          </div>

          <div class="reviews-section__carousel" aria-live="polite">
            <button class="reviews-section__nav reviews-section__nav--prev" type="button" aria-label="Previous reviews" data-review-prev>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>

            <div class="reviews-section__viewport" data-review-viewport>
              <div class="reviews-section__track" data-review-track></div>
            </div>

            <button class="reviews-section__nav reviews-section__nav--next" type="button" aria-label="Next reviews" data-review-next>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

          <div class="reviews-section__dots" data-review-dots aria-label="Review pagination"></div>
        </div>
      </section>

      <div class="reviews-modal" id="reviews-modal" aria-hidden="true">
        <div class="reviews-modal__backdrop" data-close-review-modal></div>
        <div class="reviews-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="reviews-modal-title">
          <div class="reviews-modal__header">
            <h3 id="reviews-modal-title">Drop a Review</h3>
            <button class="reviews-modal__close" type="button" aria-label="Close review form" data-close-review-modal>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <form id="reviews-form" class="reviews-form" novalidate>
            <div class="reviews-form__field">
              <label for="review-name">Your name</label>
              <input id="review-name" name="customer_name" type="text" maxlength="80" placeholder="Jane Doe" required>
            </div>

            <div class="reviews-form__field">
              <label>Rating</label>
              <div class="reviews-form__stars" aria-label="Choose rating" role="radiogroup">
                <button class="reviews-form__star" type="button" data-rating="1" aria-label="1 star" aria-pressed="false">★</button>
                <button class="reviews-form__star" type="button" data-rating="2" aria-label="2 stars" aria-pressed="false">★</button>
                <button class="reviews-form__star" type="button" data-rating="3" aria-label="3 stars" aria-pressed="false">★</button>
                <button class="reviews-form__star" type="button" data-rating="4" aria-label="4 stars" aria-pressed="false">★</button>
                <button class="reviews-form__star" type="button" data-rating="5" aria-label="5 stars" aria-pressed="false">★</button>
              </div>
              <input type="hidden" name="rating" id="review-rating" value="">
            </div>

            <div class="reviews-form__field">
              <label for="review-message">Your review</label>
              <textarea id="review-message" name="review" maxlength="1000" rows="5" placeholder="Tell us about your experience with Onyii De Son..." required></textarea>
            </div>

            <div class="reviews-form__status" id="review-form-status" aria-live="polite"></div>

            <div class="reviews-form__actions">
              <button type="button" class="btn-outline focus-ring" data-close-review-modal>Cancel</button>
              <button type="submit" class="btn-primary focus-ring" id="review-submit-btn">Submit Review</button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.bindGlobalEvents();
    this.loadReviews();
  }

  async loadReviews() {
    const track = this.root.querySelector('[data-review-track]');
    if (!track) return;

    track.innerHTML = `
      <div class="reviews-section__state reviews-section__state--loading" role="status" aria-live="polite">
        <div class="reviews-section__spinner" aria-hidden="true"></div>
        <p>Loading customer reviews...</p>
      </div>
    `;

    const { data, error } = await ReviewService.getApprovedReviews();

    if (error) {
      track.innerHTML = `
        <div class="reviews-section__state reviews-section__state--error" role="alert">
          <p>${this.escapeHtml(error)}</p>
        </div>
      `;
      return;
    }

    this.reviews = data || [];
    this.currentIndex = 0;

    if (!this.reviews.length) {
      track.innerHTML = `
        <div class="reviews-section__state reviews-section__state--empty" role="status" aria-live="polite">
          <p>No approved customer reviews yet. Be the first to share your experience.</p>
        </div>
      `;
      this.updateNavState();
      return;
    }

    track.innerHTML = this.reviews.map((review) => this.renderReviewCard(review)).join('');
    this.updateNavState();
    this.bindCarouselEvents();
    this.initMobileDots();
  }

  renderReviewCard(review) {
    const initials = this.getInitials(review.customer_name || 'Customer');
    const avatar = review.avatar_url || '';
    const stars = Array.from({ length: 5 }, (_, index) => {
      const filled = index < Number(review.rating || 0);
      return `<span class="reviews-card__star ${filled ? 'is-filled' : ''}" aria-hidden="true">★</span>`;
    }).join('');

    const customerDisplay = this.escapeHtml(review.customer_name || 'Customer');
    const reviewText = this.escapeHtml(review.review || '');

    return `
      <article class="reviews-card" aria-label="Review from ${customerDisplay}">
        <div class="reviews-card__topbar">
          <div class="reviews-card__avatar" aria-hidden="true">
            ${avatar ? `<img src="${this.escapeHtml(avatar)}" alt="" loading="lazy">` : `<span>${this.escapeHtml(initials)}</span>`}
          </div>
          <div class="reviews-card__meta">
            <h3>${customerDisplay}</h3>
            <div class="reviews-card__rating" aria-label="Rated ${Number(review.rating || 0)} out of 5 stars">
              ${stars}
            </div>
          </div>
        </div>
        <p class="reviews-card__quote">“${reviewText}”</p>
      </article>
    `;
  }

  bindGlobalEvents() {
    const openBtn = this.root.querySelector('[data-open-review-modal]');
    if (openBtn) {
      openBtn.addEventListener('click', () => this.openModal());
    }

    const prevBtn = this.root.querySelector('[data-review-prev]');
    const nextBtn = this.root.querySelector('[data-review-next]');
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

    const modal = document.getElementById('reviews-modal');
    if (modal) {
      const closeTriggers = modal.querySelectorAll('[data-close-review-modal]');
      closeTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => this.closeModal());
      });

      modal.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') this.closeModal();
      });
    }

    this.root.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') this.nextSlide();
      if (event.key === 'ArrowLeft') this.prevSlide();
    });

    this.bindRatingSelection();
    this.bindFormSubmission();
  }

  bindCarouselEvents() {
    const viewport = this.root.querySelector('[data-review-viewport]');
    const track = this.root.querySelector('[data-review-track]');

    if (!viewport || !track || !track.querySelector('.reviews-card')) {
      return;
    }

    viewport.onpointerdown = (event) => {
      this.pendingTouch = true;
      this.startX = event.clientX;
      this.startScrollLeft = viewport.scrollLeft;
    };

    viewport.onpointerup = (event) => {
      if (!this.pendingTouch) return;
      const deltaX = event.clientX - this.startX;
      if (Math.abs(deltaX) > 45) {
        if (deltaX < 0) this.nextSlide();
        else this.prevSlide();
      }
      this.pendingTouch = false;
    };

    viewport.onpointerleave = () => {
      this.pendingTouch = false;
    };

    const updateFromScroll = () => {
      const card = track.querySelector('.reviews-card');
      if (!card) return;
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0);
      const cardWidth = card.getBoundingClientRect().width + gap;
      const rawIndex = Math.round(viewport.scrollLeft / cardWidth);
      this.currentIndex = Math.max(0, Math.min(rawIndex, Math.max(0, this.reviews.length - 1)));
      this.updateNavState();
      this.updateActiveDot(this.currentIndex);
    };

    viewport.addEventListener('scroll', updateFromScroll, { passive: true });

    // Update edge-fade mask classes on scroll (mobile)
    viewport.addEventListener('scroll', () => this.updateScrollMask(viewport), { passive: true });
    // Initial mask state
    requestAnimationFrame(() => this.updateScrollMask(viewport));

    setTimeout(() => this.goToSlide(this.currentIndex), 20);
  }

  nextSlide() {
    if (!this.reviews.length) return;
    const nextIndex = Math.min(this.currentIndex + 1, this.reviews.length - 1);
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    if (!this.reviews.length) return;
    const prevIndex = Math.max(this.currentIndex - 1, 0);
    this.goToSlide(prevIndex);
  }

  goToSlide(index) {
    const viewport = this.root.querySelector('[data-review-viewport]');
    const track = this.root.querySelector('[data-review-track]');
    if (!viewport || !track || !track.querySelector('.reviews-card')) return;

    const card = track.querySelector('.reviews-card');
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0);
    const cardWidth = card.getBoundingClientRect().width + gap;
    const nextIndex = Math.max(0, Math.min(index, this.reviews.length - 1));

    this.currentIndex = nextIndex;
    viewport.scrollTo({
      left: nextIndex * cardWidth,
      behavior: 'smooth'
    });
    this.updateNavState();
    this.updateActiveDot(nextIndex);
  }

  updateNavState() {
    const prevBtn = this.root.querySelector('[data-review-prev]');
    const nextBtn = this.root.querySelector('[data-review-next]');
    if (!prevBtn || !nextBtn) return;

    prevBtn.disabled = this.currentIndex === 0 || this.reviews.length <= 1;
    nextBtn.disabled = this.currentIndex >= this.reviews.length - 1 || this.reviews.length <= 1;
  }

  /* ── Mobile Pagination Dots ── */

  initMobileDots() {
    const dotsContainer = this.root.querySelector('[data-review-dots]');
    if (!dotsContainer || !this.reviews.length) return;

    // Build dot buttons
    dotsContainer.innerHTML = this.reviews.map((_, index) => {
      const active = index === this.currentIndex ? ' is-active' : '';
      return `<button class="reviews-section__dot${active}" type="button" aria-label="Go to review ${index + 1}" data-dot-index="${index}"></button>`;
    }).join('');

    // Tap to navigate
    dotsContainer.addEventListener('click', (e) => {
      const dot = e.target.closest('[data-dot-index]');
      if (!dot) return;
      this.goToSlide(Number(dot.dataset.dotIndex));
    });
  }

  updateActiveDot(index) {
    const dotsContainer = this.root.querySelector('[data-review-dots]');
    if (!dotsContainer) return;

    const dots = dotsContainer.querySelectorAll('.reviews-section__dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });
  }

  /* ── Scroll Edge Mask (mobile) ── */

  updateScrollMask(viewport) {
    if (!viewport) return;
    const { scrollLeft, scrollWidth, clientWidth } = viewport;
    const atStart = scrollLeft <= 2;
    const atEnd = scrollLeft + clientWidth >= scrollWidth - 2;

    viewport.classList.remove('is-scrolled-end', 'is-scrolled-mid');

    if (atEnd && !atStart) {
      viewport.classList.add('is-scrolled-end');
    } else if (!atStart && !atEnd) {
      viewport.classList.add('is-scrolled-mid');
    }
    // at start (default) — no class needed, CSS default mask applies
  }

  bindRatingSelection() {
    const modal = document.getElementById('reviews-modal');
    if (!modal) return;

    const stars = modal.querySelectorAll('.reviews-form__star');
    const hiddenInput = modal.querySelector('#review-rating');

    stars.forEach((star) => {
      star.addEventListener('click', () => {
        const rating = Number(star.dataset.rating);
        hiddenInput.value = String(rating);

        stars.forEach((button) => {
          const active = Number(button.dataset.rating) <= rating;
          button.classList.toggle('is-active', active);
          button.setAttribute('aria-pressed', String(active));
        });
      });
    });
  }

  bindFormSubmission() {
    const modal = document.getElementById('reviews-modal');
    if (!modal) return;

    const form = modal.querySelector('#reviews-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = form.querySelector('#review-name').value.trim();
      const rating = Number(form.querySelector('#review-rating').value);
      const message = form.querySelector('#review-message').value.trim();
      const statusEl = form.querySelector('#review-form-status');
      const submitBtn = form.querySelector('#review-submit-btn');

      if (!name || !rating || !message) {
        statusEl.textContent = 'Please complete your name, rating, and review before submitting.';
        statusEl.className = 'reviews-form__status is-error';
        return;
      }

      if (rating < 1 || rating > 5) {
        statusEl.textContent = 'Please choose a valid rating from 1 to 5 stars.';
        statusEl.className = 'reviews-form__status is-error';
        return;
      }

      if (message.length < 10) {
        statusEl.textContent = 'Your review needs to be at least 10 characters long.';
        statusEl.className = 'reviews-form__status is-error';
        return;
      }

      form.querySelectorAll('input, textarea, button').forEach((field) => {
        if (field.tagName !== 'BUTTON' || field.type === 'submit') {
          field.disabled = true;
        }
      });

      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      statusEl.className = 'reviews-form__status';
      statusEl.textContent = 'Sending your review...';

      const result = await ReviewService.submitReview({
        customer_name: name,
        rating,
        review: message,
        avatar_url: null
      });

      if (result.error) {
        form.querySelectorAll('input, textarea').forEach((field) => {
          field.disabled = false;
        });
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Review';
        statusEl.textContent = result.error;
        statusEl.className = 'reviews-form__status is-error';
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));
      statusEl.textContent = 'Success! Your review has been submitted and is pending approval.';
      statusEl.className = 'reviews-form__status is-success';
      submitBtn.textContent = 'Submitted';
      submitBtn.disabled = true;

      setTimeout(() => {
        this.resetForm();
        this.closeModal();
        this.loadReviews();
      }, 1200);
    });
  }

  openModal() {
    const modal = document.getElementById('reviews-modal');
    if (!modal) return;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('#review-name');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 50);
    }
  }

  closeModal() {
    const modal = document.getElementById('reviews-modal');
    if (!modal) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    this.resetForm();
  }

  resetForm() {
    const modal = document.getElementById('reviews-modal');
    if (!modal) return;

    const form = modal.querySelector('#reviews-form');
    if (!form) return;

    form.reset();
    modal.querySelector('#review-rating').value = '';
    const stars = modal.querySelectorAll('.reviews-form__star');
    stars.forEach((star) => {
      star.classList.remove('is-active');
      star.setAttribute('aria-pressed', 'false');
    });

    const statusEl = modal.querySelector('#review-form-status');
    statusEl.textContent = '';
    statusEl.className = 'reviews-form__status';

    const submitBtn = modal.querySelector('#review-submit-btn');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Review';

    form.querySelectorAll('input, textarea').forEach((field) => {
      field.disabled = false;
    });
  }

  getInitials(name) {
    return (name || 'Customer')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'C';
  }

  escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

window.ReviewsSection = ReviewsSection;
