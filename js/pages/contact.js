import { supabase } from '../supabase.js';

const CONTACT_FORM_ID = 'contact-form';
const CONTACT_SUBMIT_ID = 'contact-submit';

const sanitizeInput = (value) => value.trim();

const validateEmail = (email) => {
  // Use a simple, standard regex for email validation that's user-friendly
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Reusable Notification Utility
const showNotification = (message, type = 'success') => {
  // Remove existing notification if present
  const existingToast = document.getElementById('global-toast-notification');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.id = 'global-toast-notification';
  toast.className = `toast-notification is-${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');

  const iconSvg = type === 'success' 
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="toast-notification__icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="toast-notification__icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

  toast.innerHTML = `
    ${iconSvg}
    <span class="toast-notification__message">${message}</span>
  `;

  document.body.appendChild(toast);

  // Trigger animation (requestAnimationFrame ensures DOM is updated before adding class)
  requestAnimationFrame(() => {
    toast.classList.add('is-visible');
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.remove(), 300); // Wait for transition
  }, 5000);
};

export function initContactPage() {
  const form = document.getElementById(CONTACT_FORM_ID);
  if (!form) return;

  const submitButton = document.getElementById(CONTACT_SUBMIT_ID);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // 1. Validation
    const formData = new FormData(form);
    const name = sanitizeInput(formData.get('name') || '');
    const email = sanitizeInput(formData.get('email') || '');
    const description = sanitizeInput(formData.get('description') || '');

    if (!name) {
      showNotification('Name is required.', 'error');
      return;
    }

    if (!email) {
      showNotification('Email address is required.', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }

    if (!description) {
      showNotification('Please provide a description of your needs.', 'error');
      return;
    }

    // 2. Submission State
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    // 3. Supabase Integration
    try {
      const { error } = await supabase.from('contact').insert([{ name, email, description }]);

      if (error) {
        throw error;
      }

      // 4. Success state and reset
      form.reset();
      showNotification('Thank you for contacting us. We\'ll get back to you shortly.', 'success');
    } catch (error) {
      console.error('Contact submission failed:', error);
      showNotification('We could not send your message right now. Please try again later.', 'error');
    } finally {
      // 5. Restore submission state
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      }
    }
  });
}
