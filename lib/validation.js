/**
 * Input Sanitization and Validation Utilities
 * Helps prevent injection attacks and validate user input
 */

/**
 * Sanitize user input to prevent injection attacks
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 10000); // Limit length
}

/**
 * Sanitize medical text input
 * @param {string} text - Medical text input
 * @returns {string} Sanitized text
 */
export function sanitizeMedicalText(text) {
  if (typeof text !== 'string') {
    return '';
  }

  return text
    .trim()
    .slice(0, 5000) // Limit length for medical descriptions
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ''); // Remove control characters
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate age is reasonable
 * @param {number} age - Age to validate
 * @returns {boolean} True if age is between 0 and 150
 */
export function validateAge(age) {
  const ageNum = parseInt(age);
  return !isNaN(ageNum) && ageNum >= 0 && ageNum <= 150;
}

/**
 * Validate weight in kg
 * @param {string|number} weight - Weight to validate
 * @returns {boolean} True if valid weight (10-500 kg)
 */
export function validateWeight(weight) {
  const weightNum = parseFloat(weight);
  return !isNaN(weightNum) && weightNum >= 10 && weightNum <= 500;
}

/**
 * Validate height in cm
 * @param {string|number} height - Height to validate
 * @returns {boolean} True if valid height (50-250 cm)
 */
export function validateHeight(height) {
  const heightNum = parseFloat(height);
  return !isNaN(heightNum) && heightNum >= 50 && heightNum <= 250;
}

/**
 * Validate image file
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum file size in MB
 * @returns {object} Validation result {valid: boolean, error?: string}
 */
export function validateImageFile(file, maxSizeMB = 10) {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!allowedMimes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }

  if (file.size > maxSizeBytes) {
    return { valid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }

  if (!file.name || file.name.length > 255) {
    return { valid: false, error: 'Invalid filename' };
  }

  return { valid: true };
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, char => map[char]);
}

/**
 * Validate UUID format
 * @param {string} uuid - UUID to validate
 * @returns {boolean} True if valid UUID
 */
export function validateUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate user ID from Clerk (alphanumeric, underscore)
 * @param {string} userId - User ID to validate
 * @returns {boolean} True if valid format
 */
export function validateUserID(userId) {
  const userIdRegex = /^[a-zA-Z0-9_-]+$/;
  return userIdRegex.test(userId) && userId.length > 0 && userId.length < 256;
}
