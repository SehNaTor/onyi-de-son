import { DashboardController } from './dashboard.js';
import { GalleryController } from './gallery.js';
import { ProjectsController } from './projects.js';
import { ProductsController } from './products.js';
import { ContactsController } from './contacts.js';
import { BlogController } from './blog.js';
import { UI } from './ui.js';
import { AuthService } from '../auth/authService.js';

// Expose controllers and UI globally for inline HTML event handlers (e.g. onclick="window.GalleryController.editItem()")
window.DashboardController = DashboardController;
window.GalleryController = GalleryController;
window.ProjectsController = ProjectsController;
window.ProductsController = ProductsController;
window.ContactsController = ContactsController;
window.BlogController = BlogController;
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

  let currentView = 'dashboard';

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

    // Hide "Add New" button on Dashboard and Contacts
    if (viewName === 'dashboard' || viewName === 'contacts') {
      if (btnAddNew) btnAddNew.style.display = 'none';
    } else {
      if (btnAddNew) btnAddNew.style.display = 'inline-flex';
    }

    // Render respective controller
    switch (viewName) {
      case 'dashboard':
        await DashboardController.renderView(contentArea);
        break;
      case 'gallery':
        await GalleryController.renderView(contentArea);
        break;
      case 'projects':
        await ProjectsController.renderView(contentArea);
        break;
      case 'products':
        await ProductsController.renderView(contentArea);
        break;
      case 'blog':
        await BlogController.renderView(contentArea);
        break;
      case 'contacts':
        await ContactsController.renderView(contentArea);
        break;
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
      switch (currentView) {
        case 'gallery':
          GalleryController.showForm();
          break;
        case 'projects':
          ProjectsController.showForm();
          break;
        case 'products':
          ProductsController.showForm();
          break;
        case 'blog':
          BlogController.showForm();
          break;
      }
    });
  }

  // Handle hash routing on load
  const hash = window.location.hash.replace('#', '');
  if (hash === 'gallery') {
    loadView('gallery');
  } else if (hash === 'projects') {
    loadView('projects');
  } else if (hash === 'products') {
    loadView('products');
  } else if (hash === 'contacts') {
    loadView('contacts');
  } else {
    loadView('dashboard');
  }
});
