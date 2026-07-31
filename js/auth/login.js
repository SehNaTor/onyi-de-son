import { AuthService } from './authService.js';
import { Validators } from './validators.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Check if already authenticated, if so, redirect immediately
  const { session } = await AuthService.getSession();
  if (session) {
    window.location.href = '/admin.html';
    return;
  }

  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  
  const togglePasswordBtn = document.getElementById('toggle-password');
  const iconEye = togglePasswordBtn.querySelector('.icon-eye');
  const iconEyeOff = togglePasswordBtn.querySelector('.icon-eye-off');
  
  const btnLogin = document.getElementById('btn-login');
  const btnText = btnLogin.querySelector('.btn-text');
  const btnSpinner = document.getElementById('login-spinner');
  
  const btnForgot = document.getElementById('btn-forgot-password');
  const alertContainer = document.getElementById('auth-alert');

  // --- Helpers ---
  const showAlert = (message, type = 'error') => {
    alertContainer.style.display = 'flex';
    alertContainer.className = `auth-alert ${type}`;
    
    const icon = type === 'success' 
      ? `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
      : `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
      
    alertContainer.innerHTML = `${icon} <span>${message}</span>`;
  };

  const hideAlert = () => {
    alertContainer.style.display = 'none';
    alertContainer.innerHTML = '';
  };

  const setLoading = (isLoading) => {
    btnLogin.disabled = isLoading;
    btnText.style.display = isLoading ? 'none' : 'inline-block';
    btnSpinner.style.display = isLoading ? 'inline-block' : 'none';
    emailInput.disabled = isLoading;
    passwordInput.disabled = isLoading;
  };

  // --- Password Toggle ---
  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    iconEye.style.display = isPassword ? 'none' : 'block';
    iconEyeOff.style.display = isPassword ? 'block' : 'none';
  });

  // --- Real-time Validation clearing ---
  emailInput.addEventListener('input', () => {
    emailInput.classList.remove('is-invalid');
    emailError.textContent = '';
  });

  passwordInput.addEventListener('input', () => {
    passwordInput.classList.remove('is-invalid');
    passwordError.textContent = '';
  });

  // --- Login Submit ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const email = Validators.sanitize(emailInput.value);
    const password = passwordInput.value; // Don't trim passwords

    const emailCheck = Validators.validateEmail(email);
    const passCheck = Validators.validatePassword(password);

    let hasError = false;

    if (!emailCheck.isValid) {
      emailInput.classList.add('is-invalid');
      emailError.textContent = emailCheck.message;
      hasError = true;
    }

    if (!passCheck.isValid) {
      passwordInput.classList.add('is-invalid');
      passwordError.textContent = passCheck.message;
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const { data, error } = await AuthService.login(email, password);
      
      if (error) {
        throw error;
      }
      
      // Success Animation & Redirect
      showAlert('Login Successful. Redirecting...', 'success');
      
      // Artificial delay for smooth UX transition
      setTimeout(() => {
        window.location.href = '/admin.html';
      }, 1000);

    } catch (err) {
      console.error('Login Error:', err);
      // Map common Supabase error messages to user-friendly ones
      let userMessage = 'Authentication failed. Please try again.';
      if (err.message.includes('Invalid login credentials')) {
        userMessage = 'Invalid email or password.';
      } else if (err.message.includes('Email not confirmed')) {
        userMessage = 'Please verify your email address before logging in.';
      }
      
      showAlert(userMessage, 'error');
      setLoading(false);
    }
  });

  // --- Forgot Password Workflow ---
  btnForgot.addEventListener('click', async () => {
    hideAlert();
    const email = Validators.sanitize(emailInput.value);
    const emailCheck = Validators.validateEmail(email);
    
    if (!emailCheck.isValid) {
      emailInput.classList.add('is-invalid');
      emailError.textContent = 'Enter your email above to reset password.';
      emailInput.focus();
      return;
    }

    const originalText = btnForgot.textContent;
    btnForgot.textContent = 'Sending...';
    btnForgot.style.pointerEvents = 'none';

    try {
      const { error } = await AuthService.resetPassword(email);
      if (error) throw error;
      
      showAlert('Password reset link sent! Check your email.', 'success');
    } catch (err) {
      console.error('Reset Error:', err);
      showAlert('Failed to send reset link. Please try again.', 'error');
    } finally {
      btnForgot.textContent = originalText;
      btnForgot.style.pointerEvents = 'auto';
    }
  });
});
