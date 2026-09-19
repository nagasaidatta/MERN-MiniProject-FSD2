import { request } from './api';

export const authService = {
  // Register citizen
  register: (name, email, password) => {
    return request('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  },

  // Login (Citizen or Admin)
  login: (email, password, portalType) => {
    return request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, portalType })
    });
  },

  // Get current user profile
  getProfile: () => {
    return request('/profile', {
      method: 'GET'
    });
  },

  // Update profile
  updateProfile: (userData) => {
    return request('/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }
};
