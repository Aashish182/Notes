// Mirrors the backend's password rules so users get instant feedback
// before the request round-trip.
export const checkPasswordRules = (password = "") => ({
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  number: /[0-9]/.test(password),
});

export const isPasswordValid = (password) =>
  Object.values(checkPasswordRules(password)).every(Boolean);

export const isValidEmail = (email = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());