/**
 * Purpose: Navigation Component Logic
 * Responsibilities: Render navbar HTML, handle sticky scroll, mobile menu toggling, dynamic dropdown rendering, and accessibility features.
 * Dependencies: js/config.js
 * Version: 2.0.0
 */

import CONFIG from '../config.js';

class Navbar {
  constructor({ rootSelector = '[data-navbar-root]' } = {}) {
    this.rootSelector = rootSelector;
    this.root = document.querySelector(this.rootSelector);
    
    if (this.root) {
      this.render();
      this.cacheDOM();
      this.bindEvents();
      this.initDropdown();
      this.checkActivePage();
      
      // Initial check for scroll position on page load
      this.handleScroll();
    }
  }

  /**
   * Render the HTML structure into the root element
   */
  render() {
    this.root.innerHTML = `
      <header class="header" data-navbar="header">
        <div class="container nav">
          
          <!-- Brand Logo -->
          <a href="index.html" class="nav__brand focus-ring" aria-label="Onyii Deson Global Tarpaulin - Home">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="flex-shrink: 0;">
              <rect width="32" height="32" rx="8" fill="var(--color-primary)"/>
              <path d="M16 8L24 22H8L16 8Z" fill="var(--color-accent)"/>
            </svg>
            <span class="nav__brand-text">
              <span class="nav__brand-primary">Onyii Deson</span>
              <span class="nav__brand-secondary">Global Tarpaulin</span>
            </span>
          </a>

          <!-- Desktop Navigation -->
          <nav aria-label="Main Navigation">
            <ul class="nav__list">
              <li class="nav__item"><a href="index.html" class="nav__link focus-ring">Home</a></li>
              
              <li class="nav__item">
                <a href="products.html" class="nav__link focus-ring" aria-expanded="false" aria-controls="desktop-products-dropdown">
                  Products
                  <svg class="nav__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </a>
                <ul class="nav__dropdown" id="desktop-products-dropdown" data-navbar="desktop-dropdown">
                  <!-- JS Injects Links Here -->
                </ul>
              </li>
              
              <li class="nav__item"><a href="projects.html" class="nav__link focus-ring">Projects</a></li>
              <li class="nav__item"><a href="services.html" class="nav__link focus-ring">Services</a></li>
              <li class="nav__item"><a href="gallery.html" class="nav__link focus-ring">Gallery</a></li>
              <li class="nav__item"><a href="about.html" class="nav__link focus-ring">About</a></li>
            </ul>
          </nav>

          <!-- Desktop Actions -->
          <div class="nav__actions">
            <a href="tel:+2349161594257" class="btn-secondary focus-ring">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Call Us Now
            </a>
            <a href="contact.html" class="btn-primary focus-ring">Contact Us</a>
          </div>

          <!-- Mobile Menu Toggle Button -->
          <button class="nav__toggle focus-ring" aria-label="Toggle menu" aria-expanded="false" aria-controls="mobile-menu" data-navbar="mobile-toggle">
            <span class="nav__toggle-line" aria-hidden="true"></span>
            <span class="nav__toggle-line" aria-hidden="true"></span>
            <span class="nav__toggle-line" aria-hidden="true"></span>
          </button>

        </div>
      </header>

      <!-- Mobile Menu Overlay -->
      <div class="nav__mobile-overlay" aria-hidden="true" data-navbar="mobile-overlay"></div>

      <!-- Mobile Off-Canvas Menu -->
      <nav class="nav__mobile-menu" id="mobile-menu" aria-label="Mobile Navigation" data-navbar="mobile-menu">
        <div class="nav__mobile-header">
          <a href="index.html" class="nav__brand focus-ring" aria-label="Onyii Deson Global Tarpaulin - Home">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="flex-shrink: 0;">
              <rect width="32" height="32" rx="8" fill="var(--color-primary)"/>
              <path d="M16 8L24 22H8L16 8Z" fill="var(--color-accent)"/>
            </svg>
            <span class="nav__brand-text">
              <span class="nav__brand-primary">Onyii Deson</span>
              <span class="nav__brand-secondary">Global Tarpaulin</span>
            </span>
          </a>
          <button class="nav__mobile-close focus-ring" aria-label="Close menu" data-navbar="mobile-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <ul class="nav__mobile-list">
          <li><a href="index.html" class="nav__mobile-link focus-ring">Home</a></li>
          <li>
            <a href="products.html" class="nav__mobile-link focus-ring" aria-expanded="false" aria-controls="mobile-products-dropdown" data-navbar="mobile-dropdown-toggle">
              <span>Products</span>
              <span class="nav__chevron-wrapper" style="padding: 0.5rem; margin: -0.5rem; display: flex; align-items: center; justify-content: center;">
                <svg class="nav__chevron" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </a>
            <div class="nav__mobile-dropdown" id="mobile-products-dropdown" data-navbar="mobile-dropdown">
              <ul class="nav__mobile-dropdown-inner" data-navbar="mobile-dropdown-inner">
                <!-- JS Injects Links Here -->
              </ul>
            </div>
          </li>
          <li><a href="projects.html" class="nav__mobile-link focus-ring">Projects</a></li>
          <li><a href="services.html" class="nav__mobile-link focus-ring">Services</a></li>
          <li><a href="gallery.html" class="nav__mobile-link focus-ring">Gallery</a></li>
          <li><a href="about.html" class="nav__mobile-link focus-ring">About</a></li>
        </ul>

        <div class="nav__mobile-actions">
          <a href="tel:+2349161594257" class="btn-secondary focus-ring">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            Call Us Now
          </a>
          <a href="contact.html" class="btn-primary focus-ring">Contact Us</a>
        </div>
      </nav>
    `;
  }

  /**
   * Cache all required DOM elements to minimize DOM queries
   */
  cacheDOM() {
    this.header = this.root.querySelector('[data-navbar="header"]');
    this.mobileToggle = this.root.querySelector('[data-navbar="mobile-toggle"]');
    this.mobileMenu = this.root.querySelector('[data-navbar="mobile-menu"]');
    this.mobileOverlay = this.root.querySelector('[data-navbar="mobile-overlay"]');
    this.mobileClose = this.root.querySelector('[data-navbar="mobile-close"]');
    
    // Desktop Dropdown targets
    this.dropdownContainer = this.root.querySelector('[data-navbar="desktop-dropdown"]');
    
    // Mobile Dropdown targets
    this.mobileDropdownToggle = this.root.querySelector('[data-navbar="mobile-dropdown-toggle"]');
    this.mobileDropdownContainer = this.root.querySelector('[data-navbar="mobile-dropdown"]');
    this.mobileDropdownInner = this.root.querySelector('[data-navbar="mobile-dropdown-inner"]');
  }

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Scroll event with requestAnimationFrame for performance
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.handleScroll();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }, { passive: true });

    // Mobile Menu Toggle
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu on close button click
    if (this.mobileClose) {
      this.mobileClose.addEventListener('click', () => this.closeMobileMenu());
    }

    // Close mobile menu on overlay click
    if (this.mobileOverlay) {
      this.mobileOverlay.addEventListener('click', () => this.closeMobileMenu());
    }

    // Close mobile menu when a navigation link is clicked (excluding the dropdown toggle)
    if (this.mobileMenu) {
      const mobileLinks = this.mobileMenu.querySelectorAll('a:not([data-navbar="mobile-dropdown-toggle"])');
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => this.closeMobileMenu());
      });
    }

    // Escape key support for accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });

    // Mobile Dropdown Toggle
    if (this.mobileDropdownToggle) {
      this.mobileDropdownToggle.addEventListener('click', (e) => {
        // Toggle the dropdown if they click on the chevron wrapper
        if (e.target.closest('.nav__chevron-wrapper')) {
          e.preventDefault();
          this.toggleMobileDropdown();
        }
        // Otherwise, the link will naturally navigate to products.html
      });
    }
  }

  /**
   * Populate dropdowns dynamically from config.js
   */
  initDropdown() {
    const categories = CONFIG.products.categories;
    
    if (!categories || categories.length === 0) return;

    const createLinks = (isMobile = false) => {
      return categories.map(category => `
        <li class="${isMobile ? '' : 'nav__dropdown-item'}">
          <a href="${category.url}" class="${isMobile ? 'nav__mobile-dropdown-link focus-ring' : 'nav__dropdown-link focus-ring'}">
            ${category.label}
          </a>
        </li>
      `).join('');
    };

    if (this.dropdownContainer) {
      this.dropdownContainer.innerHTML = createLinks(false);
    }
    
    if (this.mobileDropdownInner) {
      this.mobileDropdownInner.innerHTML = createLinks(true);
    }

    // Attach click events to the newly generated dropdown links
    const allDropdownLinks = this.root.querySelectorAll('.nav__dropdown-link, .nav__mobile-dropdown-link');
    allDropdownLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Close mobile menu if open
        if (this.mobileMenu && this.mobileMenu.classList.contains('is-active')) {
          this.closeMobileMenu();
        }

        if (href && href.includes('#')) {
          const [path, hash] = href.split('#');
          const currentPath = window.location.pathname;
          
          // If the link points to a section on the current page, scroll smoothly
          if (!path || currentPath.endsWith(path) || (currentPath.endsWith('/') && path === 'index.html') || currentPath.endsWith('/' + path)) {
            e.preventDefault();
            
            const targetId = '#' + hash;
            
            if (window.lenis) {
              // Lenis might not auto-read scroll-margin-top in all versions, 
              // but we pass offset to match the CSS scroll-margin-top value.
              window.lenis.scrollTo(targetId, { offset: -72 });
            } else {
              const target = document.getElementById(hash);
              if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }
        }
      });
    });
  }

  /**
   * Handle sticky header appearance on scroll
   */
  handleScroll() {
    if (window.scrollY > 20) {
      this.header.classList.add('is-scrolled');
    } else {
      this.header.classList.remove('is-scrolled');
    }
  }

  /**
   * Toggle the off-canvas mobile menu
   */
  toggleMobileMenu() {
    const isExpanded = this.mobileToggle.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Open the mobile menu and lock body scroll
   */
  openMobileMenu() {
    this.mobileToggle.setAttribute('aria-expanded', 'true');
    this.mobileMenu.classList.add('is-active');
    this.mobileOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden'; // Lock scroll
    
    // Stop Lenis smooth scrolling while menu is open
    if (window.lenis) {
      window.lenis.stop();
    }
  }

  /**
   * Close the mobile menu and restore body scroll
   */
  closeMobileMenu() {
    if (!this.mobileToggle) return;
    
    this.mobileToggle.setAttribute('aria-expanded', 'false');
    this.mobileMenu.classList.remove('is-active');
    this.mobileOverlay.classList.remove('is-active');
    document.body.style.overflow = ''; // Restore scroll
    
    // Resume Lenis smooth scrolling
    if (window.lenis) {
      window.lenis.start();
    }
  }

  /**
   * Toggle the mobile products dropdown
   */
  toggleMobileDropdown() {
    const isExpanded = this.mobileDropdownToggle.getAttribute('aria-expanded') === 'true';
    this.mobileDropdownToggle.setAttribute('aria-expanded', !isExpanded);
    
    if (isExpanded) {
      this.mobileDropdownContainer.classList.remove('is-open');
    } else {
      this.mobileDropdownContainer.classList.add('is-open');
    }
  }

  /**
   * Dynamically detect the active page and set aria-current
   */
  checkActivePage() {
    // Get current path, defaulting to index.html if pointing to a directory root
    let currentPath = window.location.pathname;
    if (currentPath.endsWith('/')) {
      currentPath += 'index.html';
    }

    // Function to check and set active links in a given container
    const setActiveLinks = (selector) => {
      const links = this.root.querySelectorAll(selector);
      links.forEach(link => {
        // Strip origin and exact match path
        const linkPath = new URL(link.href, window.location.origin).pathname;
        if (linkPath === currentPath) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    setActiveLinks('.nav__link');
    setActiveLinks('.nav__mobile-link');
  }
}

export default Navbar;
