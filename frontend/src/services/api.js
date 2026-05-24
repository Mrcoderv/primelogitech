import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Interceptors ────────────────────────────────────────────────────────────

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/token/')
    ) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
            refresh,
          });
          localStorage.setItem('access_token', data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/secret-admin';
        }
      }
    }

    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function loginAdmin(username, password) {
  const { data } = await api.post('/api/token/', { username, password });
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  return data;
}

export function logoutAdmin() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
}

// ─── Public ──────────────────────────────────────────────────────────────────

export async function fetchSiteContent() {
  const { data } = await api.get('/api/site-content/');
  return data;
}

export async function fetchProjects() {
  const { data } = await api.get('/api/projects/');
  return data;
}

export async function fetchTeam() {
  const { data } = await api.get('/api/team/');
  return data;
}

export async function fetchServices() {
  const { data } = await api.get('/api/services/');
  return data;
}

export async function fetchTestimonials() {
  const { data } = await api.get('/api/testimonials/');
  return data;
}

export async function fetchJobs() {
  const { data } = await api.get('/api/jobs/');
  return data;
}

export async function submitContact(payload) {
  const { data } = await api.post('/api/contact/', payload);
  return data;
}

export async function subscribeNewsletter(email) {
  const { data } = await api.post('/api/newsletter/', { email });
  return data;
}

// ─── Admin: Site Content ─────────────────────────────────────────────────────

export async function fetchAdminSiteContent() {
  const { data } = await api.get('/api/admin/site-content/');
  return data;
}

export async function updateAdminSiteContent(payload) {
  const { data } = await api.patch('/api/admin/site-content/', payload);
  return data;
}

// ─── Admin: Projects ─────────────────────────────────────────────────────────

export async function fetchAdminProjects() {
  const { data } = await api.get('/api/admin/projects/');
  return data;
}

export async function createAdminProject(payload) {
  const form = new FormData();
  Object.entries(payload).forEach(([key, val]) => {
    if (key === 'tech_stack' && Array.isArray(val)) {
      form.append(key, JSON.stringify(val));
    } else if (val !== null && val !== undefined) {
      form.append(key, val);
    }
  });
  const { data } = await api.post('/api/admin/projects/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function updateAdminProject(id, payload) {
  const form = new FormData();
  Object.entries(payload).forEach(([key, val]) => {
    if (key === 'tech_stack' && Array.isArray(val)) {
      form.append(key, JSON.stringify(val));
    } else if (key === 'image' && !val) {
      return;
    } else if (val !== null && val !== undefined) {
      form.append(key, val);
    }
  });
  const { data } = await api.patch(`/api/admin/projects/${id}/`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteAdminProject(id) {
  await api.delete(`/api/admin/projects/${id}/`);
}

// ─── Admin: Team ─────────────────────────────────────────────────────────────

export async function fetchAdminTeam() {
  const { data } = await api.get('/api/admin/team/');
  return data;
}

export async function createAdminTeam(payload) {
  const form = new FormData();
  Object.entries(payload).forEach(([key, val]) => {
    if (val !== null && val !== undefined) form.append(key, val);
  });
  const { data } = await api.post('/api/admin/team/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function updateAdminTeam(id, payload) {
  const form = new FormData();
  Object.entries(payload).forEach(([key, val]) => {
    if (key === 'image' && !val) return;
    if (val !== null && val !== undefined) form.append(key, val);
  });
  const { data } = await api.patch(`/api/admin/team/${id}/`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteAdminTeam(id) {
  await api.delete(`/api/admin/team/${id}/`);
}

// ─── Admin: Services ─────────────────────────────────────────────────────────

export async function fetchAdminServices() {
  const { data } = await api.get('/api/admin/services/');
  return data;
}

export async function createAdminService(payload) {
  const { data } = await api.post('/api/admin/services/', payload);
  return data;
}

export async function updateAdminService(id, payload) {
  const { data } = await api.patch(`/api/admin/services/${id}/`, payload);
  return data;
}

export async function deleteAdminService(id) {
  await api.delete(`/api/admin/services/${id}/`);
}

// ─── Admin: Testimonials ─────────────────────────────────────────────────────

export async function fetchAdminTestimonials() {
  const { data } = await api.get('/api/admin/testimonials/');
  return data;
}

export async function createAdminTestimonial(payload) {
  const { data } = await api.post('/api/admin/testimonials/', payload);
  return data;
}

export async function updateAdminTestimonial(id, payload) {
  const { data } = await api.patch(`/api/admin/testimonials/${id}/`, payload);
  return data;
}

export async function deleteAdminTestimonial(id) {
  await api.delete(`/api/admin/testimonials/${id}/`);
}

// ─── Admin: Jobs ─────────────────────────────────────────────────────────────

export async function fetchAdminJobs() {
  const { data } = await api.get('/api/admin/jobs/');
  return data;
}

export async function createAdminJob(payload) {
  const { data } = await api.post('/api/admin/jobs/', payload);
  return data;
}

export async function updateAdminJob(id, payload) {
  const { data } = await api.patch(`/api/admin/jobs/${id}/`, payload);
  return data;
}

export async function deleteAdminJob(id) {
  await api.delete(`/api/admin/jobs/${id}/`);
}

// ─── Admin: Contacts ─────────────────────────────────────────────────────────

export async function fetchAdminContacts() {
  const { data } = await api.get('/api/admin/contacts/');
  return data;
}

export async function fetchAdminContact(id) {
  const { data } = await api.get(`/api/admin/contacts/${id}/`);
  return data;
}

// ─── Admin: Newsletter ───────────────────────────────────────────────────────

export async function fetchAdminNewsletter() {
  const { data } = await api.get('/api/admin/newsletter/');
  return data;
}

export default api;
