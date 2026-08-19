import CONFIG from '../config.js';
import { MEDIA_CONFIG, getMediaTypeFromFile } from '../utils/media.js';

export class MediaUploader {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) throw new Error(`Container #${containerId} not found`);

    this.options = {
      defaultMedia: options.defaultMedia || null,
      defaultMediaType: options.defaultMediaType || 'image',
      onSuccess: options.onSuccess || (() => {}),
      onError: options.onError || (() => {}),
      onFileSelect: options.onFileSelect || (() => {})
    };

    this.file = null;
    this.previewUrl = null;
    this.isUploading = false;
    this.uploadedUrl = this.options.defaultMedia;
    this.uploadedType = this.options.defaultMediaType;

    this.render();
    this.bindEvents();
  }

  get acceptedTypes() {
    return [...MEDIA_CONFIG.image.acceptedTypes, ...MEDIA_CONFIG.video.acceptedTypes];
  }

  render() {
    const hasMedia = !!this.uploadedUrl;
    
    let previewContent = '';
    if (hasMedia) {
      if (this.uploadedType === 'video') {
        previewContent = `<video src="${this.uploadedUrl}" id="${this.container.id}-preview-video" class="uploader-preview-video" controls playsinline preload="metadata" style="max-height: 200px; width: 100%; object-fit: contain; display: block;"></video>`;
        previewContent += `<img src="" id="${this.container.id}-preview-image" class="uploader-preview-image" alt="Image preview" style="display: none;">`;
      } else {
        previewContent = `<img src="${this.uploadedUrl}" id="${this.container.id}-preview-image" class="uploader-preview-image" alt="Image preview" style="display: block;">`;
        previewContent += `<video src="" id="${this.container.id}-preview-video" class="uploader-preview-video" controls playsinline preload="metadata" style="max-height: 200px; width: 100%; object-fit: contain; display: none;"></video>`;
      }
    } else {
      previewContent = `
        <img src="" id="${this.container.id}-preview-image" class="uploader-preview-image" alt="Image preview" style="display: none;">
        <video src="" id="${this.container.id}-preview-video" class="uploader-preview-video" controls playsinline preload="metadata" style="max-height: 200px; width: 100%; object-fit: contain; display: none;"></video>
      `;
    }

    this.container.innerHTML = `
      <div class="image-uploader ${hasMedia ? 'has-image' : ''}" id="${this.container.id}-wrapper">
        <input type="file" id="${this.container.id}-input" class="uploader-input" accept="image/*,video/*" hidden>
        
        <div class="uploader-drop-area" id="${this.container.id}-drop-area">
          <div class="uploader-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="uploader-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            <span class="uploader-text">Click or drag media to upload</span>
            <span class="uploader-hint">Max ${MEDIA_CONFIG.image.maxSizeMB}MB (Image) / ${MEDIA_CONFIG.video.maxSizeMB}MB (Video)</span>
          </div>
          
          <div class="uploader-preview-container" style="${hasMedia ? 'display: block;' : 'display: none;'}">
            ${previewContent}
            <div class="uploader-actions">
              <button type="button" class="btn-icon btn-small uploader-change-btn" title="Change Media">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button type="button" class="btn-icon btn-small text-danger uploader-remove-btn" title="Remove Media">
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
    this.previewImg = document.getElementById(`${this.container.id}-preview-image`);
    this.previewVideo = document.getElementById(`${this.container.id}-preview-video`);
    this.previewContainer = this.dropArea.querySelector('.uploader-preview-container');
    this.placeholder = this.dropArea.querySelector('.uploader-placeholder');
    this.errorText = document.getElementById(`${this.container.id}-error`);
    this.wrapper = document.getElementById(`${this.container.id}-wrapper`);
  }

  bindEvents() {
    this.placeholder.addEventListener('click', () => this.input.click());
    
    const changeBtn = this.wrapper.querySelector('.uploader-change-btn');
    if (changeBtn) changeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.input.click();
    });

    const removeBtn = this.wrapper.querySelector('.uploader-remove-btn');
    if (removeBtn) removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.clear();
    });

    this.input.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.handleFile(e.target.files[0]);
      }
    });

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
    
    if (!this.acceptedTypes.includes(file.type)) {
      this.showError('Invalid file type. Please select a supported image or video.');
      return;
    }

    const type = getMediaTypeFromFile(file);
    const maxSize = MEDIA_CONFIG[type].maxSizeMB;
    
    if (file.size > maxSize * 1024 * 1024) {
      this.showError(`${type === 'video' ? 'Video' : 'Image'} exceeds the allowed file size. Maximum size is ${maxSize}MB.`);
      return;
    }

    this.file = file;
    this.uploadedUrl = null;
    this.uploadedType = type;

    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
    
    this.previewUrl = URL.createObjectURL(file);
    
    if (type === 'video') {
      this.previewVideo.src = this.previewUrl;
      this.previewVideo.style.display = 'block';
      this.previewImg.style.display = 'none';
      this.previewImg.src = '';
    } else {
      this.previewImg.src = this.previewUrl;
      this.previewImg.style.display = 'block';
      this.previewVideo.style.display = 'none';
      this.previewVideo.src = '';
    }
    
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
    this.uploadedType = 'image';
    this.input.value = '';
    
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
    
    this.previewImg.src = '';
    this.previewVideo.src = '';
    this.wrapper.classList.remove('has-image');
    this.previewContainer.style.display = 'none';
    this.clearError();
  }

  async upload() {
    if (!this.file) {
      return { url: this.uploadedUrl, type: this.uploadedType };
    }

    const cloudName = CONFIG.cloudinary?.cloudName?.trim();
    const uploadPreset = CONFIG.cloudinary?.uploadPreset?.trim();

    if (!cloudName || !uploadPreset) {
      const errorMsg = 'Missing Cloudinary Config: Please add your Cloud Name in js/config.js';
      this.showError(errorMsg);
      this.options.onError(new Error(errorMsg));
      throw new Error(errorMsg);
    }

    this.setUploading(true);
    
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('upload_preset', uploadPreset);

    const resourceType = this.uploadedType === 'video' ? 'video' : 'image';

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json();
        let errMsg = errData.error?.message || 'Failed to upload media';
        
        if (response.status === 401 && errMsg.includes('Unknown API key')) {
          errMsg = 'Cloudinary Error: Your upload preset ("' + uploadPreset + '") must be set to "Unsigned" in your Cloudinary Dashboard, or your Cloud Name is incorrect.';
        } else if (response.status === 400 && errMsg.includes('upload preset')) {
          errMsg = 'Cloudinary Error: Upload preset "' + uploadPreset + '" does not exist. Please create it in your Cloudinary settings.';
        }
        
        throw new Error(errMsg);
      }

      const data = await response.json();
      this.uploadedUrl = data.secure_url;
      this.file = null; 
      this.setUploading(false);
      
      this.options.onSuccess(data);
      return { url: this.uploadedUrl, type: this.uploadedType };
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
