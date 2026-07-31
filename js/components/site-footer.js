export class SiteFooter {
  constructor({ rootSelector = '[data-site-footer]' } = {}) {
    this.rootSelector = rootSelector;
    this.root = document.querySelector(this.rootSelector);
    
    if (this.root) {
      this.render();
    }
  }

  render() {
    this.root.innerHTML = `
      <footer class="site-footer">
        <div class="container site-footer__container">
          
          <!-- Brand Column -->
          <div class="site-footer__brand-col">
            <a href="index.html" class="site-footer__brand-name focus-ring" aria-label="Onyi De Son of Grace Nig Ltd - Home">
              <svg class="site-footer__brand-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect width="32" height="32" rx="8" fill="var(--color-surface)"/>
                <path d="M16 8L24 22H8L16 8Z" fill="var(--color-accent)"/>
              </svg>
              Onyi De Son
            </a>
            <p class="site-footer__description">
              West Africa's trusted supplier of premium tarpaulin, upholstery, and interior finishing materials. 
              Engineered for strength, delivered with confidence.
            </p>
          </div>

          <!-- Quick Links -->
          <div class="site-footer__links-col">
            <h3 class="site-footer__heading">Explore</h3>
            <nav aria-label="Footer Quick Links">
              <ul class="site-footer__list">
                <li>
                  <a href="products.html" class="site-footer__link focus-ring">Products</a>
                </li>
                <li>
                  <a href="projects.html" class="site-footer__link focus-ring">Projects</a>
                </li>
                <li>
                  <a href="services.html" class="site-footer__link focus-ring">Services</a>
                </li>
                <li>
                  <a href="gallery.html" class="site-footer__link focus-ring">Gallery</a>
                </li>
                <li>
                  <a href="about.html" class="site-footer__link focus-ring">About Us</a>
                </li>
              </ul>
            </nav>
          </div>

          <!-- Contact Column -->
          <div class="site-footer__links-col">
            <h3 class="site-footer__heading">Contact Us</h3>
            <address style="font-style: normal;">
              <ul class="site-footer__list">
              <li class="site-footer__contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>09161594257 (Call & WhatsApp)</span>
              </li>
              <li class="site-footer__contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <a href="mailto:donatuschukwu202@gmail.com" class="site-footer__link focus-ring">donatuschukwu202@gmail.com</a>
              </li>
              <li class="site-footer__contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>248 Agege Motor Road, Mushin, Lagos</span>
              </li>
            </ul>
            </address>
          </div>

        </div>

        <div class="container">
          <div class="site-footer__bottom">
            <p class="site-footer__copyright">
              &copy; ${new Date().getFullYear()} Onyi De Son of Grace Nig Ltd. All rights reserved.
            </p>
            <div class="site-footer__legal-links">
              <a href="#" class="site-footer__legal-link focus-ring">Privacy Policy</a>
              <a href="#" class="site-footer__legal-link focus-ring">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}
