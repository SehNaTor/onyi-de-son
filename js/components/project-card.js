function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function createProjectCard(project) {
  if (!project || typeof project !== 'object') {
    return '';
  }

  const title = escapeHtml(project.title || 'Completed Project');
  const description = escapeHtml(project.description || 'A thoughtfully delivered project that reflects our commitment to premium quality and dependable execution.');
  const category = escapeHtml(project.category || 'Featured Project');
  const imageUrl = project.image_url || '';
  const altText = `${title} - ${category}`;

  return `
    <article class="project-card reveal-on-scroll" aria-label="${title}">
      <div class="project-card__image-wrapper">
        <img
          src="${imageUrl}"
          alt="${altText}"
          class="project-card__image"
          loading="lazy"
          decoding="async"
        >
      </div>
      <div class="project-card__content">
        <h3 class="project-card__title">${title}</h3>
        <p class="project-card__description">${description}</p>
      </div>
    </article>
  `;
}
