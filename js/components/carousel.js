export function initCarousel() {
  const container = document.querySelector('[data-carousel]');
  const track = document.querySelector('[data-carousel-track]');
  const prevButton = document.querySelector('[data-carousel-prev]');
  const nextButton = document.querySelector('[data-carousel-next]');
  const dotsContainer = document.querySelector('[data-carousel-dots]');

  if (!container || !track) return;

  const slides = Array.from(track.children);
  if (slides.length === 0) return;

  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;

  const updateDots = () => {
    if (!dotsContainer) return;

    Array.from(dotsContainer.children).forEach((dot, index) => {
      dot.classList.toggle('is-active', index === currentIndex);
      dot.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
    });
  };

  const updateCarousel = (index) => {
    const safeIndex = (index + slides.length) % slides.length;
    currentIndex = safeIndex;

    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();

    if (prevButton) {
      prevButton.disabled = slides.length <= 1;
    }

    if (nextButton) {
      nextButton.disabled = slides.length <= 1;
    }
  };

  if (dotsContainer) {
    dotsContainer.innerHTML = '';

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => updateCarousel(index));
      dotsContainer.appendChild(dot);
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => updateCarousel(currentIndex - 1));
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => updateCarousel(currentIndex + 1));
  }

  container.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      updateCarousel(currentIndex + 1);
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      updateCarousel(currentIndex - 1);
    }
  });

  const getX = (event) => event.touches ? event.touches[0].clientX : event.clientX;

  container.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button')) return;
    isDragging = true;
    startX = getX(event);
    container.setPointerCapture(event.pointerId);
  });

  container.addEventListener('pointermove', (event) => {
    if (!isDragging) return;
    const deltaX = getX(event) - startX;
    if (Math.abs(deltaX) > 8) {
      event.preventDefault();
    }
  });

  container.addEventListener('pointerup', (event) => {
    if (!isDragging) return;

    const deltaX = getX(event) - startX;
    isDragging = false;

    if (deltaX < -50) {
      updateCarousel(currentIndex + 1);
    } else if (deltaX > 50) {
      updateCarousel(currentIndex - 1);
    }
  });

  container.addEventListener('pointercancel', () => {
    isDragging = false;
  });

  updateCarousel(0);
}
