/**
 * Reusable input validation rules and error messages.
 */

export const Validators = {
  /**
   * Validates an email address format.
   * @param {string} email
   * @returns {object} { isValid: boolean, message: string }
   */
  validateEmail(email) {
    const value = email.trim();
    if (!value) {
      return { isValid: false, message: 'Email address is required.' };
    }
    
    // Basic RFC 5322 regex for email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test(value)) {
      return { isValid: false, message: 'Please enter a valid email address.' };
    }

    return { isValid: true, message: '' };
  },

  /**
   * Validates a password input.
   * @param {string} password
   * @returns {object} { isValid: boolean, message: string }
   */
  validatePassword(password) {
    if (!password) {
      return { isValid: false, message: 'Password is required.' };
    }

    if (password.length < 6) {
      return { isValid: false, message: 'Password must be at least 6 characters long.' };
    }

    return { isValid: true, message: '' };
  },

  /**
   * Sanitizes a string by trimming whitespace.
   */
  sanitize(input) {
    return input ? input.trim() : '';
  }
};
