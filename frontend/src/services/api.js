import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const key = localStorage.getItem('vajra_api_key');
  if (key) config.headers['X-API-Key'] = key;
  return config;
});

api.interceptors.response.use(
  res => res.data,
  err => {
    const msg = err.response?.data?.message || err.message || 'Request failed';
    return Promise.reject(new Error(msg));
  }
);

export const scanEmail = (subject, body) =>
  api.post('/analyze/email', { subject, body });

export const scanURL = (url) =>
  api.post('/analyze-url', { url });

export const scanPrompt = (prompt) =>
  api.post('/analyze-prompt', { prompt });

export const scanAttachment = (formData) =>
  api.post('/analyze-attachment', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const getThreatLogs = () => api.get('/threats/logs');
export const getThreatDomains = () => api.get('/threats/domains');
export const getThreatStats = () => api.get('/threats/stats');
export const getHealth = () => api.get('/health');

export default api;
