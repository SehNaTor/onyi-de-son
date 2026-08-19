export const MEDIA_CONFIG = {
  image: {
    maxSizeMB: 5,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  },
  video: {
    maxSizeMB: 50,
    acceptedTypes: ['video/mp4', 'video/webm', 'video/quicktime']
  }
};

/**
 * Reusable media renderer
 * @param {Object} media - The media object containing image_url and media_type
 * @param {string} className - Optional CSS class for the media element
 * @param {string} fallbackImage - Optional fallback image URL for errors
 * @returns {string} HTML string of the media element
 */
export function renderMedia(media, className = '', fallbackImage = '') {
  const url = media?.image_url || '';
  const type = media?.media_type || 'image'; // Default to image for backward compatibility
  
  if (!url) {
    return `<img src="${fallbackImage || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMiI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIvPjxsaW5lIHgxPSI5IiB5MT0iOSIgeDI9IjE1IiB5Mj0iMTUiLz48bGluZSB4MT0iMTUiIHkxPSI5IiB4Mj0iOSIgeTI9IjE1Ii8+PC9zdmc+'}" class="${className}" alt="Placeholder" />`;
  }

  if (type === 'video') {
    return `
      <video src="${url}" class="${className}" controls playsinline preload="metadata" style="object-fit: cover;"></video>
    `;
  }

  // Default image render
  const defaultFallback = fallbackImage || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMiI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIvPjxsaW5lIHgxPSI5IiB5MT0iOSIgeDI9IjE1IiB5Mj0iMTUiLz48bGluZSB4MT0iMTUiIHkxPSI5IiB4Mj0iOSIgeTI9IjE1Ii8+PC9zdmc+";
  return `<img src="${url}" class="${className}" alt="Media" onerror="this.src='${defaultFallback}'" />`;
}

/**
 * Determine media type from a File object
 */
export function getMediaTypeFromFile(file) {
  if (file.type.startsWith('video/')) return 'video';
  return 'image';
}
