import { fetchFeaturedProjects, PROJECTS_PAGE_PATH } from '../services/projects.js';
import { createProjectCard } from './project-card.js';

export class CompletedProjectsSection {
  constructor({ rootSelector = '[data-completed-projects]' } = {}) {
    this.rootSelector = rootSelector;
    this.root = document.querySelector(this.rootSelector);
    this.initialize();
  }

  async initialize() {
    if (!this.root) {
      return;
    }

    this.renderLoadingState();

    try {
      const { projects, error } = await fetchFeaturedProjects();

      if (error) {
        this.renderErrorState(error);
        return;
      }

      if (!projects.length) {
        this.renderEmptyState();
        return;
      }

      this.renderProjects(projects);
    } catch (error) {
      this.renderErrorState(error?.message || 'The section could not be loaded.');
    }
  }

  renderLoadingState() {
    this.root.innerHTML = `
      <div class="completed-projects__loading" role="status" aria-live="polite">
        <p>Loading featured projects…</p>
      </div>
    `;
  }

  renderProjects(projects) {
    const cardsMarkup = projects.map(project => createProjectCard(project)).join('');

    this.root.innerHTML = `
      <div class="completed-projects__header reveal-on-scroll">
        <span class="completed-projects__label">Completed Projects</span>
        <h2 class="completed-projects__heading">Trusted Projects, Delivered With Precision</h2>
        <p class="completed-projects__intro">
          A snapshot of recently completed work that reflects our standards for quality, execution, and lasting value.
        </p>
      </div>
      <div class="completed-projects__grid" aria-live="polite">
        ${cardsMarkup}
      </div>
      <div class="completed-projects__footer reveal-on-scroll">
        <a href="${PROJECTS_PAGE_PATH}" class="completed-projects__view-more focus-ring">
          View More
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    `;

    this.revealCards();
  }

  renderEmptyState() {
    this.root.innerHTML = `
      <div class="completed-projects__empty reveal-on-scroll">
        <h2 class="completed-projects__heading">Completed Projects</h2>
        <p class="completed-projects__intro">
          Featured project updates will appear here as soon as they are published.
        </p>
      </div>
    `;
  }

  renderErrorState(message) {
    this.root.innerHTML = `
      <div class="completed-projects__empty reveal-on-scroll" role="alert">
        <h2 class="completed-projects__heading">Completed Projects</h2>
        <p class="completed-projects__intro">${message}</p>
      </div>
    `;
  }

  revealCards() {
    const elements = this.root.querySelectorAll('.reveal-on-scroll');

    if (!elements.length) {
      return;
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      elements.forEach((element) => observer.observe(element));
      return;
    }

    elements.forEach((element) => element.classList.add('is-visible'));
  }
}
