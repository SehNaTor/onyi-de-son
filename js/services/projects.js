import { supabase } from '../supabase.js';

export const PROJECTS_PAGE_PATH = 'projects.html';
export const HOMEPAGE_PROJECT_LIMIT = 3;

const FALLBACK_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
    <rect width="1200" height="800" fill="#f5efe2" />
    <rect x="80" y="80" width="1040" height="640" rx="32" fill="#fffdf8" stroke="#d8c38d" stroke-width="4" />
    <path d="M260 560c60-118 160-220 300-220 140 0 240 102 300 220" fill="none" stroke="#b8860b" stroke-width="12" stroke-linecap="round" />
    <circle cx="560" cy="280" r="92" fill="#b8860b" fill-opacity="0.14" />
    <circle cx="560" cy="280" r="56" fill="#b8860b" fill-opacity="0.24" />
  </svg>
`)}`;

function sanitizeText(value, fallback = '') {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed || fallback;
}

function normalizeProject(project) {
  if (!project || typeof project !== 'object') {
    return null;
  }

  const title = sanitizeText(project.title, 'Completed Project');
  const description = sanitizeText(
    project.description,
    'A thoughtfully delivered project that reflects our commitment to premium quality and dependable execution.'
  );
  const category = sanitizeText(project.category, 'Featured Project');
  const imageUrl = sanitizeText(project.image_url, '');

  return {
    id: project.id ?? null,
    title,
    description,
    category,
    image_url: imageUrl || FALLBACK_IMAGE,
    featured: Boolean(project.featured),
    display_order: Number(project.display_order) || 0,
    status: sanitizeText(project.status, 'active')
  };
}

export async function fetchFeaturedProjects({ limit = HOMEPAGE_PROJECT_LIMIT } = {}) {
  try {
    let query = supabase
      .from('projects')
      .select('id, title, description, category, image_url, featured, display_order, status')
      .eq('status', 'active')
      .eq('featured', true)
      .order('display_order', { ascending: true });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const projects = (Array.isArray(data) ? data : [])
      .map(normalizeProject)
      .filter(Boolean)
      .slice(0, limit);

    return { projects, error: null };
  } catch (error) {
    console.warn('[projects] Unable to load featured projects.', error);
    return {
      projects: [],
      error: error?.message || 'Featured projects could not be loaded right now.'
    };
  }
}
