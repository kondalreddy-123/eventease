/**
 * Sanitization and Validation Utilities for EventEase AI
 * Protects against XSS, HTML injection, and malformed inputs.
 */

/**
 * Strips HTML tags and script elements from a string.
 * @param {string} str - Raw input string
 * @returns {string} Sanitized string
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove <script> tags
    .replace(/<[^>]+>/g, '') // Strip all remaining HTML tags
    .replace(/javascript:/gi, '') // Strip javascript: pseudo-protocols
    .trim();
}

/**
 * Recursively sanitizes all string properties within an object.
 * @param {object} obj - Object to sanitize
 * @returns {object} Sanitized clone of object
 */
export function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      clean[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = sanitizeObject(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

/**
 * Validates an email address format.
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates password strength (min 6 characters).
 * @param {string} password
 * @returns {boolean}
 */
export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

/**
 * Validates a positive numeric value.
 * @param {any} val
 * @returns {number|null}
 */
export function validatePositiveNumber(val, defaultVal = 0) {
  const num = Number(val);
  if (isNaN(num) || num < 0) return defaultVal;
  return num;
}
