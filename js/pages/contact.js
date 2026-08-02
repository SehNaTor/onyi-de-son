import { supabase } from '../supabase.js';

const CONTACT_FORM_ID = 'contact-form';
const CONTACT_STATUS_ID = 'contact-status';
const CONTACT_SUBMIT_ID = 'contact-submit';

const sanitizeInput = (value) => value.trim();

const setStatus = (message, type = 'idle') => {
  const status = document.getElementById(CONTACT_STATUS_ID);
  if (!status) return;

  status.textContent = message;
  status.className = 'contact-status';

  if (type === 'success') status.classList.add('is-success');
  if (type === 'error') status.classList.add('is-error');
  if (type === 'loading') status.classList.add('is-loading');
};

export function initContactPage() {
  const form = document.getElementById(CONTACT_FORM_ID);
  if (!form) return;

  const submitButton = document.getElementById(CONTACT_SUBMIT_ID);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = sanitizeInput(formData.get('name') || '');
    const whatsapp = sanitizeInput(formData.get('whatsapp') || '');
    const description = sanitizeInput(formData.get('description') || '');

    if (!name || !whatsapp || !description) {
      setStatus('Please complete all fields before sending your message.', 'error');
      return;
    }

    const normalizedWhatsapp = whatsapp.replace(/\D/g, '').replace(/^234/, '234');
    if (normalizedWhatsapp.length < 8) {
      setStatus('Please enter a valid WhatsApp number.', 'error');
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    setStatus('Submitting your request...', 'loading');

    try {
      const { error } = await supabase.from('contact').insert([{ name, whatsapp: normalizedWhatsapp, description }]);

      if (error) {
        throw error;
      }

      form.reset();
      setStatus('Thank you! Your message has been received.', 'success');
    } catch (error) {
      console.error('Contact submission failed:', error);
      setStatus('We could not send your message right now. Please try again later.', 'error');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      }
    }
  });
}
