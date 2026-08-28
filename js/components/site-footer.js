/**
 * Purpose: Site Footer Component
 * Responsibilities: Render premium card-based footer with interactive contact actions.
 * Dependencies: None
 * Version: 2.0.0
 */

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
      <div class="site-footer" role="contentinfo">
        <div class="container site-footer__inner">

          <!-- Footer Cards Grid -->
          <div class="site-footer__grid">

            <!-- Card 1: Company Overview -->
            <div class="site-footer__card site-footer__card--brand">
              <a href="index.html" class="site-footer__brand-name focus-ring" aria-label="Onyii De Son of Grace Nig Ltd - Home">
                <img src="./assets/onyii-logo.png" alt="Onyii De Son Logo" class="site-footer__brand-logo" width="36" height="36">
                Onyi De Son
              </a>
              <p class="site-footer__description">
                West Africa's trusted supplier of premium tarpaulin, upholstery, and interior finishing materials. 
                Engineered for strength, delivered with confidence.
              </p>
              <p class="site-footer__address">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>248 Agege Motor Road, Mushin, Lagos</span>
              </p>
            </div>

            <!-- Card 2: Quick Navigation -->
            <div class="site-footer__card">
              <h3 class="site-footer__heading">Quick Links</h3>
              <nav aria-label="Footer Quick Links">
                <ul class="site-footer__list">
                  <li>
                    <a href="index.html" class="site-footer__link focus-ring">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="products.html" class="site-footer__link focus-ring">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      Products
                    </a>
                  </li>
                  <li>
                    <a href="projects.html" class="site-footer__link focus-ring">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      Projects
                    </a>
                  </li>
                  <li>
                    <a href="gallery.html" class="site-footer__link focus-ring">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      Gallery
                    </a>
                  </li>
                  <li>
                    <a href="about.html" class="site-footer__link focus-ring">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      About Us
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            <!-- Card 3: Products & Services -->
            <div class="site-footer__card">
              <h3 class="site-footer__heading">Products & Services</h3>
              <nav aria-label="Footer Products & Services">
                <ul class="site-footer__list">
                  <li>
                    <a href="products.html#tarpaulin" class="site-footer__link focus-ring">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      Tarpaulin Materials
                    </a>
                  </li>
                  <li>
                    <a href="products.html#carport" class="site-footer__link focus-ring">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      Carport Materials
                    </a>
                  </li>
                  <li>
                    <a href="products.html#wallpaper" class="site-footer__link focus-ring">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      Wallpaper
                    </a>
                  </li>
                  <li>
                    <a href="services.html" class="site-footer__link focus-ring">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      Installation Services
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

          </div>

        </div>

        <!-- Bottom Bar -->
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
      </div>
    `;
  }
}
