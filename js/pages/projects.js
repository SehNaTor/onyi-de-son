import { fetchActiveProjects } from '../services/projectService.js';
import { renderMedia } from '../utils/media.js';

/**
 * Initializes the projects page logic.
 * Handles state transitions and DOM rendering.
 */
export async function initProjectsPage() {
  const loadingState = document.getElementById('state-loading');
  const emptyState = document.getElementById('state-empty');
  const errorState = document.getElementById('state-error');
  const projectsGrid = document.getElementById('projects-grid');

  if (!loadingState || !emptyState || !errorState || !projectsGrid) return;

  function updateState(state) {
    loadingState.classList.remove('is-active');
    emptyState.classList.remove('is-active');
    errorState.classList.remove('is-active');
    projectsGrid.style.display = 'none';

    if (state === 'loading') {
      loadingState.classList.add('is-active');
    } else if (state === 'empty') {
      emptyState.classList.add('is-active');
    } else if (state === 'error') {
      errorState.classList.add('is-active');
    } else if (state === 'success') {
      projectsGrid.style.display = 'grid';
    }
  }

  // Set initial loading state before fetch begins
  updateState('loading');

  // Fetch data
  const projects = await fetchActiveProjects();

  if (projects === null) {
    // Error occurred during fetch
    updateState('error');
    return;
  }

  if (projects.length === 0) {
    // No active projects found
    updateState('empty');
    return;
  }

  // Render projects
  renderProjects(projects, projectsGrid);
  updateState('success');
}

/**
 * Generates the HTML for a single project card.
 * @param {Object} project
 * @returns {string} HTML string
 */
function createProjectCard(project) {
  // Defensive check for missing image
  const fallbackImage = 'https://res.cloudinary.com/vwrjamwn/image/upload/v1784937107/IMG-20260724-WA0039_ftxd99.jpg';
  const imageUrl = project.image_url ? project.image_url : fallbackImage;
  const categoryBadge = project.category ? `<span class="project-card__badge">${escapeHtml(project.category)}</span>` : '';

  return `
    <article class="project-card reveal-on-scroll">
      <div class="project-card__img-wrap">
        ${categoryBadge}
        ${renderMedia(project, 'project-card__img', fallbackImage)}
      </div>
      <div class="project-card__content">
        <h3 class="project-card__title">${escapeHtml(project.title || 'Untitled Project')}</h3>
        <p class="project-card__desc">${escapeHtml(project.description || 'No description available for this project.')}</p>
      </div>
    </article>
  `;
}

/**
 * Renders an array of projects into the DOM container.
 * @param {Array} projects 
 * @param {HTMLElement} container 
 */
function renderProjects(projects, container) {
  const html = projects.map(project => createProjectCard(project)).join('');
  container.innerHTML = html;
  
  // Trigger intersection observer on new elements if available globally
  // We dispatch a custom event so the main observer can pick them up if needed,
  // or simply add the class to make them visible since they load dynamically.
  setTimeout(() => {
    const newCards = container.querySelectorAll('.reveal-on-scroll');
    newCards.forEach(card => card.classList.add('is-visible'));
  }, 100);
}

/**
 * Simple HTML escaper to prevent XSS.
 */
function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
