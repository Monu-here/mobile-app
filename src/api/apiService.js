import { API_BASE_URL, ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES } from './config';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  /**
   * Get current school settings
   */
  async getSchoolSettings() {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getSchoolSettings called');
      const response = await this.get(ENDPOINTS.SCHOOL_SETTINGS_GET);

      // Normalize response similar to other methods
      const data = response?.data || response || null;
      const message = response?.message || null;
      return { raw: response, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getSchoolSettings error:', error);
      throw error;
    }
  }

  /**
   * Get academic years list
   */
  async getAcademicYears() {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] getAcademicYears called');
      const response = await this.get(ENDPOINTS.ACADEMIC_YEAR_GET);
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || null;
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] getAcademicYears error:', error);
      throw error;
    }
  }

  /**
   * Add a new academic year
   * @param {Object} payload { name, start_date, end_date, status }
   */
  async addAcademicYear(payload) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] addAcademicYear called', payload);
      // eslint-disable-next-line no-console
      console.log('[apiService] Token exists?', !!this.token, 'Token preview:', this.token ? this.token.substring(0, 20) + '...' : 'NO TOKEN');
      const response = await this.post(ENDPOINTS.ACADEMIC_YEAR_ADD, payload);
      const raw = response;
      const data = (response && (response.data?.data || response.data)) || response || null;
      const message = response?.message || 'Academic year added';
      return { raw, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] addAcademicYear error:', error);
      throw error;
    }
  }

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Get authentication token
   */
  getToken() {
    return this.token;
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    this.token = null;
  }

  /**
   * Make HTTP request
   */
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Add auth token if available
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.data ? JSON.stringify(options.data) : undefined,
      });

      // Read raw text first so we can handle non-JSON responses (HTML error pages, etc.)
      const rawText = await response.text();
      let responseData = null;
      try {
        responseData = rawText ? JSON.parse(rawText) : null;
      } catch (parseErr) {
        // Not JSON — keep rawText available for debugging
        responseData = null;
        // eslint-disable-next-line no-console
        console.warn('[apiService] Non-JSON response received for', url, 'status', response.status);
        // eslint-disable-next-line no-console
        console.warn('[apiService] Raw response text:', rawText ? rawText.substring(0, 1000) : '<empty>');
      }

      if (!response.ok) {
        // Try to extract a message from parsed JSON, otherwise use raw text or a generic message
        const message = (responseData && (responseData.message || responseData.error)) || (rawText ? rawText : ERROR_MESSAGES.UNKNOWN_ERROR);
        throw {
          status: response.status,
          message,
          data: responseData || rawText,
        };
      }

      return responseData;
    } catch (error) {
      // Map native fetch/network errors (TypeError) to a clear network message.
      // Our code above throws plain objects for HTTP errors (status, message, data),
      // so only transform real Error instances that look like network failures.
      if (error instanceof Error && (error.name === 'TypeError' || (error.message && error.message.includes('Network')))) {
        throw {
          status: 0,
          message: ERROR_MESSAGES.NETWORK_ERROR,
          error,
        };
      }
      // Otherwise rethrow the original error object (may contain status, data, raw HTML, etc.)
      throw error;
    }
  }

  /**
   * GET request
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  post(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', data });
  }

  /**
   * PUT request
   */
  put(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', data });
  }

  /**
   * PATCH request
   */
  patch(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', data });
  }

  /**
   * DELETE request
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      const response = await this.post(ENDPOINTS.LOGIN, { email, password });

      // Normalize and extract token from common response shapes
      const token = response?.token || response?.access_token || response?.data?.token || response?.auth?.token || null;
      const user = response?.user || response?.data?.user || response?.data || null;

      if (token) {
        this.setToken(token);
      }

      // Return a consistent shape
      return { raw: response, token, user };
    } catch (error) {
      // Log login error for debugging and rethrow
      // eslint-disable-next-line no-console
      console.error('[apiService] login error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await this.post(ENDPOINTS.LOGOUT);
      this.clearToken();
    } catch (error) {
      this.clearToken();
      throw error;
    }
  }

  /**
   * Register user
   */
  async register(userData) {
    try {
      const response = await this.post(ENDPOINTS.REGISTER, userData);
      
      if (response.token) {
        this.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getProfile() {
    try {
      return await this.get(ENDPOINTS.PROFILE);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Auth check - returns detailed user info including role, student/teacher data and permissions
   */
  async authCheck() {
    try {
      const response = await this.get(ENDPOINTS.AUTH_CHECK);

      // The backend may wrap data differently. Try to normalize:
      // Common shapes: { success: true, data: { ... } } or direct { user_id, name, role, ... }
      const data = response?.data || response || {};

      // If wrapper has success flag and empty data when unauthenticated, handle that upstream
      const userInfo = data;

      // response may contain token inside data.token as per RoleHelper
      const token = data?.token || response?.token || null;

      return { raw: response, user: userInfo, token };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Subscribe FCM token for push notifications
   * @param {string} fcmToken
   */
  async subscribe(fcmToken) {
    try {
      if (!fcmToken) throw { message: 'FCM token is required' };
      const response = await this.post(ENDPOINTS.SUBSCRIBE, { fcm_token: fcmToken });
      // backend returns res(true, [], ['message']) or similar. Normalize message
      const message = response?.message || (response?.meta && response.meta.message) || (Array.isArray(response?.errors) ? response.errors[0] : null) || null;
      return { raw: response, message };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change user password
   * @param {string} currentPassword
   * @param {string} newPassword
   */
  async changePassword(currentPassword, newPassword) {
    try {
      if (!currentPassword || !newPassword) throw { message: 'Both current and new passwords are required' };
      // DO NOT log passwords themselves. Log call info for debugging.
      // eslint-disable-next-line no-console
      console.log('[apiService] changePassword called for endpoint', ENDPOINTS.CHANGE_PASSWORD);

      const response = await this.post(ENDPOINTS.CHANGE_PASSWORD, {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPassword,
      });

      // Log response for debugging (avoid sensitive fields)
      // eslint-disable-next-line no-console
      console.log('[apiService] changePassword response:', response);

      // Normalize message
      const message = response?.message || (response?.meta && response.meta.message) || (Array.isArray(response?.errors) ? response.errors[0] : null) || 'Password changed';
      return { raw: response, message };
    } catch (error) {
      // Log error for debugging
      // eslint-disable-next-line no-console
      console.error('[apiService] changePassword error:', error);
      throw error;
    }
  }

  /**
   * Refresh token
   */
  async refreshToken() {
    try {
      const response = await this.post(ENDPOINTS.REFRESH_TOKEN);
      
      if (response.token) {
        this.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      this.clearToken();
      throw error;
    }
  }

  /**
   * Get or update school settings
   */
  async updateSchoolSettings(settingsData) {
    try {
      // eslint-disable-next-line no-console
      console.log('[apiService] updateSchoolSettings called');

      const url = `${this.baseURL}${ENDPOINTS.SCHOOL_SETTINGS}`;
      
      const headers = {};

      // Add auth token if available
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      // Determine if this is FormData (for file uploads) or JSON
      const isFormData = settingsData instanceof FormData;
      
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }
      // If FormData, don't set Content-Type - fetch will set it automatically with boundary

      // Log the request details
      // eslint-disable-next-line no-console
      console.log('[apiService] Sending request to:', url);
      // eslint-disable-next-line no-console
      console.log('[apiService] Headers:', headers);
      
      if (isFormData) {
        // eslint-disable-next-line no-console
        console.log('[apiService] Data: FormData (multipart) - file upload');
      } else {
        // eslint-disable-next-line no-console
        console.log('[apiService] Data:', JSON.stringify(settingsData));
      }

      const fetchOptions = {
        method: 'POST',
        headers,
        body: isFormData ? settingsData : JSON.stringify(settingsData),
      };

      const response = await fetch(url, fetchOptions);

      // Read raw text first
      const rawText = await response.text();
      let responseData = null;
      try {
        responseData = rawText ? JSON.parse(rawText) : null;
      } catch (parseErr) {
        // eslint-disable-next-line no-console
        console.warn('[apiService] Non-JSON response:', rawText ? rawText.substring(0, 500) : '<empty>');
      }

      // eslint-disable-next-line no-console
      console.log('[apiService] updateSchoolSettings response status:', response.status);
      // eslint-disable-next-line no-console
      console.log('[apiService] updateSchoolSettings response:', responseData || rawText);

      if (!response.ok) {
        const message = (responseData && (responseData.message || responseData.error)) || 
                       (rawText ? rawText : 'Failed to update school settings');
        throw {
          status: response.status,
          message,
          data: responseData || rawText,
        };
      }

      // Normalize response
      const data = responseData?.data || responseData;
      const message = responseData?.message || 'School settings updated successfully';
      
      return { raw: responseData, data, message };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[apiService] updateSchoolSettings error:', error);
      throw error;
    }
  }
}

export default new ApiService();
