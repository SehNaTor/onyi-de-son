import { MediaUploader } from './MediaUploader.js';

export class ImageUploader extends MediaUploader {
  constructor(containerId, options = {}) {
    // Force image mode for the legacy wrapper
    options.defaultMediaType = 'image';
    
    // acceptedTypes for legacy
    const legacyAcceptedTypes = options.acceptedTypes || ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    
    super(containerId, options);
    
    // Override the acceptedTypes getter to restrict to images if this class is used directly
    Object.defineProperty(this, 'acceptedTypes', {
      get: function() {
        return legacyAcceptedTypes;
      }
    });
  }

  // Override upload to return a string instead of an object to preserve backward compatibility
  async upload() {
    const result = await super.upload();
    return result ? result.url : null;
  }
}

