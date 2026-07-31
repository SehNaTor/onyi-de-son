/**
 * Services Page JavaScript
 * Handles IntersectionObserver animations and auto-swiping image layouts.
 */

export function initServicesPage() {
  // 1. Scroll Reveal Animation with IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target); 
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // 2. Auto-swiping Image Layouts for Service Cards (Seamless Infinite Loop)
  const swipers = document.querySelectorAll('.service-card__swiper');
  
  swipers.forEach(swiper => {
    const wrapper = swiper.querySelector('.service-card__swiper-wrapper');
    if (!wrapper) return;
    
    const slides = wrapper.querySelectorAll('.service-card__swiper-slide');
    
    // Only animate if there are multiple images
    if (slides.length > 1) {
      // Clone the first slide and append it to the wrapper for seamless infinite loop
      const firstClone = slides[0].cloneNode(true);
      wrapper.appendChild(firstClone);
      
      let currentIndex = 0;
      const totalOriginalSlides = slides.length;
      
      setInterval(() => {
        currentIndex++;
        
        // Translate the wrapper to show the correct slide
        wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // If we reached the clone slide
        if (currentIndex === totalOriginalSlides) {
          // Wait for the transition to finish (matches the 0.8s CSS transition time)
          setTimeout(() => {
            // Disable transition and instantly snap back to the original first slide
            wrapper.classList.add('no-transition');
            currentIndex = 0;
            wrapper.style.transform = `translateX(0)`;
            
            // Force a reflow so the browser applies the transform instantly
            wrapper.offsetHeight; // trigger reflow
            
            // Re-enable transition for the next slide animation
            wrapper.classList.remove('no-transition');
          }, 800);
        }
      }, 4000); // 4 seconds interval
    }
  });
}
