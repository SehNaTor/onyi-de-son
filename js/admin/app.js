import { GalleryController } from './gallery.js';
import { ProjectsController } from './projects.js';
import { ProductsController } from './products.js';
import { ContactsController } from './contacts.js';
import { UI } from './ui.js';
import { AuthService } from '../auth/authService.js';

// Expose controllers and UI globally for inline HTML event handlers (e.g. onclick="window.GalleryController.editItem()")
window.GalleryController = GalleryController;
window.ProjectsController = ProjectsController;
window.ProductsController = ProductsController;
window.ContactsController = ContactsController;
window.UI = UI;

document.addEventListener('DOMContentLoaded', async () => {
  // --- Authentication Guard ---
  const { session, error } = await AuthService.getSession();
  if (!session || error) {
    window.location.replace('login.html');
    return; // Stop execution
  }

  // Bind Logout
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', async (e) => {
      e.preventDefault();
      await AuthService.logout();
      window.location.replace('login.html');
    });
  }

  const contentArea = document.getElementById('admin-content');
  const pageTitle = document.getElementById('page-title');
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item[data-view]');
  const btnAddNew = document.getElementById('btn-add-new');
  
  // Mobile Sidebar Toggle
  const sidebar = document.getElementById('admin-sidebar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileClose = document.getElementById('mobile-close');
  
  const toggleSidebar = () => sidebar.classList.toggle('is-open');
  if (mobileToggle) mobileToggle.addEventListener('click', toggleSidebar);
  if (mobileClose) mobileClose.addEventListener('click', toggleSidebar);

  let currentView = 'gallery';

  // Routing / View Switching
  const loadView = async (viewName) => {
    currentView = viewName;
    
    // Update active nav
    navItems.forEach(nav => {
      if (nav.dataset.view === viewName) {
        nav.classList.add('active');
        pageTitle.textContent = nav.textContent.trim() + ' Management';
      } else {
        nav.classList.remove('active');
      }
    });

    // Close sidebar on mobile after clicking
    if (window.innerWidth <= 768 && sidebar.classList.contains('is-open')) {
      sidebar.classList.remove('is-open');
    }

    // Render respective controller
    if (viewName === 'gallery') {
      await GalleryController.renderView(contentArea);
    } else if (viewName === 'projects') {
      await ProjectsController.renderView(contentArea);
    } else if (viewName === 'products') {
      await ProductsController.renderView(contentArea);
    } else if (viewName === 'contacts') {
      await ContactsController.renderView(contentArea);
    }
  };

  // Bind Nav Clicks
  navItems.forEach(nav => {
    nav.addEventListener('click', (e) => {
      e.preventDefault();
      const view = e.currentTarget.dataset.view;
      if (view !== currentView) {
        loadView(view);
      }
    });
  });

  // Bind "Add New" Button
  if (btnAddNew) {
    btnAddNew.addEventListener('click', () => {
      if (currentView === 'gallery') {
        GalleryController.showForm();
      } else if (currentView === 'projects') {
        ProjectsController.showForm();
      } else if (currentView === 'products') {
        ProductsController.showForm();
      }
    });
  }

  // Handle hash routing on load
  const hash = window.location.hash.replace('#', '');
  if (hash === 'projects') {
    loadView('projects');
  } else if (hash === 'products') {
    loadView('products');
  } else if (hash === 'contacts') {
    loadView('contacts');
  } else {
    loadView('gallery');
  }
});
