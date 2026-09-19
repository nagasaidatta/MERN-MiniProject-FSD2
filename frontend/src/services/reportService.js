import { request } from './api';

export const reportService = {
  // Public landing page metrics
  getPublicStats: () => {
    return request('/stats/public', { method: 'GET' });
  },

  // Admin reports summary
  getReportSummary: () => {
    return request('/reports/summary', { method: 'GET' });
  }
};
