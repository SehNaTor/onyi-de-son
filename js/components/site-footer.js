/**
 * Purpose: Site Footer Component
 * Responsibilities: Render premium card-based footer with navigation,
 * company information and interactive contact actions.
 * Dependencies: None
 * Version: 2.1.0
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
    /*
     * ==========================================
     * CONTACT DETAILS CONFIGURATION
     * ==========================================
     *
     * Replace the placeholder values below with
     * the actual company contact information.
     *
     * WhatsApp format:
     * Example: 2348012345678
     * Do not include +, spaces, or special symbols.
     */

    const contact = {
      whatsappNumber: '+2349161594257',
      phoneNumber: '+2349161594257',
      email: 'donatuschukwu202@gmail.com',
     
      
    };

    const whatsappLink = `https://wa.me/${contact.whatsappNumber}`;

    this.root.innerHTML = `
      <div class="site-footer" role="contentinfo">

        <div class="container site-footer__inner">

          <!-- Footer Cards Grid -->
          <div class="site-footer__grid">

            <!-- ==========================================
                 Card 1: Company Overview
            =========================================== -->
            <div class="site-footer__card site-footer__card--brand">

              <a
                href="index.html"
                class="site-footer__brand-name focus-ring"
                aria-label="Onyii De Son of Grace Nig Ltd - Home"
              >
                <img
                  src="./assets/onyii-logo.png"
                  alt="Onyii De Son Logo"
                  class="site-footer__brand-logo"
                  width="36"
                  height="36"
                >

                <span>Onyii De Son</span>
              </a>

              <p class="site-footer__description">
                West Africa's trusted supplier of premium tarpaulin, upholstery,
                and interior finishing materials. Built for demanding conditions,
                delivered with confidence.
              </p>

              <p class="site-footer__address">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>

                <span>
                  248 Agege Motor Road, Mushin, Lagos
                </span>

              </p>

            </div>


            <!-- ==========================================
                 Card 2: Quick Navigation
            =========================================== -->
            <div class="site-footer__card">

              <h3 class="site-footer__heading">
                Quick Links
              </h3>

              <nav aria-label="Footer Quick Links">

                <ul class="site-footer__list">

                  <li>
                    <a
                      href="index.html"
                      class="site-footer__link focus-ring"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>

                      Home
                    </a>
                  </li>


                  <li>
                    <a
                      href="products.html"
                      class="site-footer__link focus-ring"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>

                      Products
                    </a>
                  </li>


                  <li>
                    <a
                      href="projects.html"
                      class="site-footer__link focus-ring"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>

                      Projects
                    </a>
                  </li>


                  <li>
                    <a
                      href="gallery.html"
                      class="site-footer__link focus-ring"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>

                      Gallery
                    </a>
                  </li>


                  <li>
                    <a
                      href="about.html"
                      class="site-footer__link focus-ring"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>

                      About Us
                    </a>
                  </li>

                </ul>

              </nav>

            </div>


            <!-- ==========================================
                 Card 3: Products & Services
            =========================================== -->
            <div class="site-footer__card">

              <h3 class="site-footer__heading">
                Products & Services
              </h3>

              <nav aria-label="Footer Products and Services">

                <ul class="site-footer__list">

                  <li>
                    <a
                      href="products.html#tarpaulin"
                      class="site-footer__link focus-ring"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>

                      Tarpaulin Materials
                    </a>
                  </li>


                  <li>
                    <a
                      href="products.html#wallpaper"
                      class="site-footer__link focus-ring"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>

                      Wallpaper
                    </a>
                  </li>


                  <li>
                    <a
                      href="services.html"
                      class="site-footer__link focus-ring"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>

                      Installation Services
                    </a>
                  </li>

                </ul>

              </nav>

            </div>


            <!-- ==========================================
                 Card 4: Contact Information
            =========================================== -->
            <div class="site-footer__card site-footer__card--contact">

              <h3 class="site-footer__heading">
                Contact Us
              </h3>

              <p class="site-footer__contact-intro">
                Have questions or need a quotation? Reach out to our team and
                we will be happy to assist you.
              </p>


              <div class="site-footer__contact-list">

                <!-- WhatsApp -->
                <a
                  href="${whatsappLink}"
                  class="site-footer__contact-item focus-ring"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with us on WhatsApp"
                >

                  <span class="site-footer__contact-icon" aria-hidden="true">

                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.52 3.48A11.94 11.94 0 0 0 12.04 0C5.46 0 .1 5.36.1 11.94c0 2.1.55 4.15 1.6 5.95L0 24l6.27-1.64a11.94 11.94 0 0 0 5.76 1.47h.01c6.58 0 11.94-5.36 11.94-11.94 0-3.19-1.24-6.19-3.46-8.41ZM12.04 21.8c-1.77 0-3.5-.48-5.01-1.38l-.36-.21-3.72.97.99-3.63-.24-.37a9.82 9.82 0 0 1-1.5-5.24c0-5.42 4.41-9.83 9.84-9.83 2.63 0 5.1 1.02 6.96 2.88a9.78 9.78 0 0 1 2.88 6.95c0 5.43-4.41 9.84-9.84 9.84Zm5.39-7.37c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.77-1.64-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.09 4.5.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.69.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"/>
                    </svg>

                  </span>

                  <span class="site-footer__contact-content">

                    <span class="site-footer__contact-label">
                      WhatsApp
                    </span>

                    <span class="site-footer__contact-value">
                      ${contact.phoneNumber}
                    </span>

                  </span>

                </a>


                <!-- Phone -->
                <a
                  href="${whatsappLink}"
                  class="site-footer__contact-item focus-ring"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact us via WhatsApp"
                >

                  <span class="site-footer__contact-icon" aria-hidden="true">

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8.01 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z"/>
                    </svg>

                  </span>

                  <span class="site-footer__contact-content">

                    <span class="site-footer__contact-label">
                      Phone
                    </span>

                    <span class="site-footer__contact-value">
                      ${contact.phoneNumber}
                    </span>

                  </span>

                </a>


                <!-- Email -->
                <a
                  href="${whatsappLink}"
                  class="site-footer__contact-item focus-ring"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact us via WhatsApp"
                >

                  <span class="site-footer__contact-icon" aria-hidden="true">

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                      <path d="m3 7 9 6 9-6"></path>
                    </svg>

                  </span>

                  <span class="site-footer__contact-content">

                    <span class="site-footer__contact-label">
                      Email
                    </span>

                    <span class="site-footer__contact-value">
                      ${contact.email}
                    </span>

                  </span>

                </a>

              </div>

            </div>

          </div>

        </div>


        <!-- ==========================================
             Footer Bottom Bar
        =========================================== -->
        <div class="container">

          <div class="site-footer__bottom">

            <p class="site-footer__copyright">
              &copy; ${new Date().getFullYear()}
              Onyi De Son of Grace Nig Ltd. All rights reserved.
            </p>

            <div class="site-footer__legal-links">

              <a
                href="#"
                class="site-footer__legal-link focus-ring"
              >
                Privacy Policy
              </a>

              <a
                href="#"
                class="site-footer__legal-link focus-ring"
              >
                Terms of Service
              </a>

            </div>

          </div>

        </div>

      </div>
    `;
  }
}