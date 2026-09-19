import { request } from './api';

export const applicationService = {
  // Citizen: Apply for a scheme
  applyScheme: (schemeId) => {
    return request('/applyScheme', {
      method: 'POST',
      body: JSON.stringify({ schemeId })
    });
  },

  // Get applications (Citizen sees own, Admin sees all)
  getApplications: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.search && params.search.trim()) query.append('search', params.search.trim());

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/applications${queryString}`, { method: 'GET' });
  },

  // Admin: Update application status (Approved / Rejected)
  updateApplicationStatus: (id, applicationStatus) => {
    return request(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ applicationStatus })
    });
  },

  // Citizen: Cancel a pending application
  cancelApplication: (id) => {
    return request(`/cancelApplication/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin: View all approved beneficiaries
  getBeneficiaries: () => {
    return request('/beneficiaries', { method: 'GET' });
  }
};
