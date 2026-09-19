import { request } from './api';

export const schemeService = {
  // Get all schemes with query parameters
  getSchemes: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.search && params.search.trim()) query.append('search', params.search.trim());

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/schemes${queryString}`, { method: 'GET' });
  },

  // Get scheme by schemeId
  getSchemeById: (id) => {
    return request(`/schemes/${id}`, { method: 'GET' });
  },

  // Admin: Create new scheme
  createScheme: (schemeData) => {
    return request('/schemes', {
      method: 'POST',
      body: JSON.stringify(schemeData)
    });
  },

  // Admin: Update scheme
  updateScheme: (id, schemeData) => {
    return request(`/schemes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(schemeData)
    });
  },

  // Admin: Delete scheme
  deleteScheme: (id) => {
    return request(`/schemes/${id}`, {
      method: 'DELETE'
    });
  }
};
