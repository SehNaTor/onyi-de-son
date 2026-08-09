import CONFIG from '../config.js';

export class ImageUploader {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) throw new Error(`Container #${containerId} not found`);

    this.options = {
      defaultImage: options.defaultImage || null,
      maxSizeMB: options.maxSizeMB || 5,
      acceptedTypes: options.acceptedTypes || ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
      onSuccess: options.onSuccess || (() => {}),
      onError: options.onError || (() => {}),
      onFileSelect: options.onFileSelect || (() => {})
    };

    this.file = null;
    this.previewUrl = null;
    this.isUploading = false;
    this.uploadedUrl = this.options.defaultImage;

    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="image-uploader ${this.uploadedUrl ? 'has-image' : ''}" id="${this.container.id}-wrapper">
        <input type="file" id="${this.container.id}-input" class="uploader-input" accept="${this.options.acceptedTypes.join(',')}" hidden>
        
        <div class="uploader-drop-area" id="${this.container.id}-drop-area">
          <div class="uploader-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="uploader-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            <span class="uploader-text">Click or drag image to upload</span>
            <span class="uploader-hint">Max ${this.options.maxSizeMB}MB</span>
          </div>
          
          <div class="uploader-preview-container" style="${this.uploadedUrl ? 'display: block;' : 'display: none;'}">
            <img src="${this.uploadedUrl || ''}" id="${this.container.id}-preview" class="uploader-preview-image" alt="Image preview">
            <div class="uploader-actions">
              <button type="button" class="btn-icon btn-small uploader-change-btn" title="Change Image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button type="button" class="btn-icon btn-small text-danger uploader-remove-btn" title="Remove Image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>
          
          <div class="uploader-loading">
            <div class="spinner"></div>
            <span>Uploading...</span>
          </div>
        </div>
        <div class="uploader-error-text" id="${this.container.id}-error"></div>
      </div>
    `;

    this.input = document.getElementById(`${this.container.id}-input`);
    this.dropArea = document.getElementById(`${this.container.id}-drop-area`);
    this.previewImg = document.getElementById(`${this.container.id}-preview`);
    this.previewContainer = this.dropArea.querySelector('.uploader-preview-container');
    this.placeholder = this.dropArea.querySelector('.uploader-placeholder');
    this.errorText = document.getElementById(`${this.container.id}-error`);
    this.wrapper = document.getElementById(`${this.container.id}-wrapper`);
  }

  bindEvents() {
    // Click on drop area to open file dialog
    this.placeholder.addEventListener('click', () => this.input.click());
    
    // Change button
    const changeBtn = this.wrapper.querySelector('.uploader-change-btn');
    if (changeBtn) changeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.input.click();
    });

    // Remove button
    const removeBtn = this.wrapper.querySelector('.uploader-remove-btn');
    if (removeBtn) removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.clear();
    });

    // File input change
    this.input.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.handleFile(e.target.files[0]);
      }
    });

    // Drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      this.dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
      this.dropArea.addEventListener(eventName, () => this.dropArea.classList.add('highlight'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      this.dropArea.addEventListener(eventName, () => this.dropArea.classList.remove('highlight'), false);
    });

    this.dropArea.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files[0]) {
        this.handleFile(files[0]);
      }
    });
  }

  handleFile(file) {
    this.clearError();
    
    // Validation
    if (!this.options.acceptedTypes.includes(file.type)) {
      this.showError('Invalid file type. Please select a valid image.');
      return;
    }
    
    if (file.size > this.options.maxSizeMB * 1024 * 1024) {
      this.showError(`File is too large. Maximum size is ${this.options.maxSizeMB}MB.`);
      return;
    }

    this.file = file;
    this.uploadedUrl = null; // Reset uploaded URL since we have a new local file

    // Cleanup previous object URL to avoid memory leaks
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
    
    this.previewUrl = URL.createObjectURL(file);
    this.previewImg.src = this.previewUrl;
    
    this.wrapper.classList.add('has-image');
    this.previewContainer.style.display = 'block';
    
    this.options.onFileSelect(file);
  }

  showError(msg) {
    this.errorText.textContent = msg;
    this.errorText.style.display = 'block';
    this.wrapper.classList.add('is-invalid');
  }

  clearError() {
    this.errorText.textContent = '';
    this.errorText.style.display = 'none';
    this.wrapper.classList.remove('is-invalid');
  }

  clear() {
    this.file = null;
    this.uploadedUrl = null;
    this.input.value = '';
    
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
    
    this.previewImg.src = '';
    this.wrapper.classList.remove('has-image');
    this.previewContainer.style.display = 'none';
    this.clearError();
  }

  async upload() {
    if (!this.file) {
      // If no new file is selected, return the existing URL (if any)
      return this.uploadedUrl;
    }

    const cloudName = CONFIG.cloudinary?.cloudName;
    const uploadPreset = CONFIG.cloudinary?.uploadPreset;

    if (!cloudName || !uploadPreset || cloudName.includes('YOUR_CLOUD_NAME')) {
      const errorMsg = 'Cloudinary configuration is missing. Please update config.js.';
      this.showError(errorMsg);
      this.options.onError(new Error(errorMsg));
      throw new Error(errorMsg);
    }

    this.setUploading(true);
    
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || 'Failed to upload image');
      }

      const data = await response.json();
      this.uploadedUrl = data.secure_url;
      this.file = null; // Clear file since it's uploaded
      this.setUploading(false);
      
      this.options.onSuccess(data);
      return this.uploadedUrl;
    } catch (err) {
      this.setUploading(false);
      this.showError('Upload failed: ' + err.message);
      this.options.onError(err);
      throw err;
    }
  }

  setUploading(isUploading) {
    this.isUploading = isUploading;
    if (isUploading) {
      this.wrapper.classList.add('is-uploading');
    } else {
      this.wrapper.classList.remove('is-uploading');
    }
  }

  destroy() {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
  }
}
