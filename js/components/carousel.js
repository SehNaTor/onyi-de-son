export function initCarousel() {
  const container = document.querySelector('[data-carousel]');
  const track = document.querySelector('[data-carousel-track]');
  
  if (!container || !track) return;
  
  // Calculate how many items can be shown based on container width
  const items = Array.from(track.children);
  const totalItems = items.length;
  
  if (totalItems === 0) return;

  let currentIndex = 0;
  
  // Auto-swipe every 2 seconds
  setInterval(() => {
    // Check how many items are visible
    const containerWidth = container.offsetWidth;
    const itemWidth = items[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
    
    // Total space per item including gap
    const advanceWidth = itemWidth + gap;
    
    // Calculate max index to avoid swiping past the end
    const visibleItems = Math.max(1, Math.floor((containerWidth + gap) / advanceWidth));
    const maxIndex = Math.max(0, totalItems - visibleItems);
    
    currentIndex++;
    if (currentIndex > maxIndex) {
      currentIndex = 0;
    }
    
    const translateValue = -(currentIndex * advanceWidth);
    track.style.transform = `translateX(${translateValue}px)`;
  }, 2000);
}
