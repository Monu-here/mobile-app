// API Configuration
// Updated to the user-provided API
export const API_BASE_URL = 'http://mschool.zic.edu.np/api';

export const ENDPOINTS = {
  // Login endpoint (user provided: http://mschool.zic.edu.np/api/login)
  LOGIN: '/login',
   AUTH_CHECK: '/auth-check',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
  PROFILE: '/user/profile',
  REFRESH_TOKEN: '/auth/refresh',
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
};
