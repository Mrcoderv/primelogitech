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
  try {
    const { data } = await api.get('/api/site-content/');
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch site content:', error.message);
    return null;
  }
}

export async function fetchProjects() {
  try {
    const { data } = await api.get('/api/projects/');
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch projects:', error.message);
    return [];
  }
}

export async function fetchTeam() {
  try {
    const { data } = await api.get('/api/team/');
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch team:', error.message);
    return [];
  }
}

export async function fetchServices() {
  try {
    const { data } = await api.get('/api/services/');
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch services:', error.message);
    return [];
  }
}

export async function fetchTestimonials() {
  try {
    const { data } = await api.get('/api/testimonials/');
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch testimonials:', error.message);
    return [];
  }
}

export async function fetchJobs() {
  try {
    const { data } = await api.get('/api/jobs/');
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch jobs:', error.message);
    return [];
  }
}

export async function submitContact(payload) {
  try {
    const { data } = await api.post('/api/contact/', payload);
    return data;
  } catch (error) {
    console.error('[API] Failed to submit contact:', error.message);
    throw error;
  }
}

export async function subscribeNewsletter(email) {
  try {
    const { data } = await api.post('/api/newsletter/', { email });
    return data;
  } catch (error) {
    console.error('[API] Failed to subscribe newsletter:', error.message);
    throw error;
  }
}

// ─── Admin: Site Content ─────────────────────────────────────────────────────

export async function fetchAdminSiteContent() {
  try {
    const { data } = await api.get('/api/admin/site-content/');
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch admin site content:', error.message);
    return null;
  }
}

export async function updateAdminSiteContent(payload) {
  try {
    const { data } = await api.patch('/api/admin/site-content/', payload);
    return data;
  } catch (error) {
    console.error('[API] Failed to update site content:', error.message);
    throw error;
  }
}

// ─── Admin: Projects ─────────────────────────────────────────────────────────

export async function fetchAdminProjects() {
  try {
    const { data } = await api.get('/api/admin/projects/');
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch projects:', error.message);
    return [];
  }
}

export async function createAdminProject(payload) {
  try {
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
  } catch (error) {
    console.error('[API] Failed to create project:', error.message);
    throw error;
  }
}

export async function updateAdminProject(id, payload) {
  try {
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
  } catch (error) {
    console.error('[API] Failed to update project:', error.message);
    throw error;
  }
}

export async function deleteAdminProject(id) {
  try {
    await api.delete(`/api/admin/projects/${id}/`);
  } catch (error) {
    console.error('[API] Failed to delete project:', error.message);
    throw error;
  }
}

// ─── Admin: Team ─────────────────────────────────────────────────────────────

export async function fetchAdminTeam() {
  try {
    const { data } = await api.get('/api/admin/team/');
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch team:', error.message);
    return [];
  }
}

// ─── Admin: Services ─────────────────────────────────────────────────────────

export async function fetchAdminServices() {
  try {
    const { data } = await api.get('/api/admin/services/');
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch services:', error.message);
    return [];
  }
}

// ─── Admin: Testimonials ─────────────────────────────────────────────────────

export async function fetchAdminTestimonials() {
  try {
    const { data } = await api.get('/api/admin/testimonials/');
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch testimonials:', error.message);
    return [];
  }
}

// ─── Admin: Jobs ─────────────────────────────────────────���───────────────────

export async function fetchAdminJobs() {
  try {
    const { data } = await api.get('/api/admin/jobs/');
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch jobs:', error.message);
    return [];
  }
}

// ─── Admin: Contacts ─────────────────────────────────────────────────────────

export async function fetchAdminContacts() {
  try {
    const { data } = await api.get('/api/admin/contacts/');
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch contacts:', error.message);
    return [];
  }
}

// ─── Admin: Newsletter ───────────────────────────────────────────────────────

export async function fetchAdminNewsletter() {
  try {
    const { data } = await api.get('/api/admin/newsletter/');
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch newsletter:', error.message);
    return [];
  }
}

export async function createAdminTeam(payload) {
  try {
    const form = new FormData();
    Object.entries(payload).forEach(([key, val]) => {
      if (val !== null && val !== undefined) form.append(key, val);
    });
    const { data } = await api.post('/api/admin/team/', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (error) {
    console.error('[API] Failed to create team member:', error.message);
    throw error;
  }
}

export async function updateAdminTeam(id, payload) {
  try {
    const form = new FormData();
    Object.entries(payload).forEach(([key, val]) => {
      if (key === 'image' && !val) return;
      if (val !== null && val !== undefined) form.append(key, val);
    });
    const { data } = await api.patch(`/api/admin/team/${id}/`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (error) {
    console.error('[API] Failed to update team member:', error.message);
    throw error;
  }
}

export async function deleteAdminTeam(id) {
  try {
    await api.delete(`/api/admin/team/${id}/`);
  } catch (error) {
    console.error('[API] Failed to delete team member:', error.message);
    throw error;
  }
}

export async function createAdminService(payload) {
  try {
    const { data } = await api.post('/api/admin/services/', payload);
    return data;
  } catch (error) {
    console.error('[API] Failed to create service:', error.message);
    throw error;
  }
}

export async function updateAdminService(id, payload) {
  try {
    const { data } = await api.patch(`/api/admin/services/${id}/`, payload);
    return data;
  } catch (error) {
    console.error('[API] Failed to update service:', error.message);
    throw error;
  }
}

export async function deleteAdminService(id) {
  try {
    await api.delete(`/api/admin/services/${id}/`);
  } catch (error) {
    console.error('[API] Failed to delete service:', error.message);
    throw error;
  }
}

export async function createAdminTestimonial(payload) {
  try {
    const { data } = await api.post('/api/admin/testimonials/', payload);
    return data;
  } catch (error) {
    console.error('[API] Failed to create testimonial:', error.message);
    throw error;
  }
}

export async function updateAdminTestimonial(id, payload) {
  try {
    const { data } = await api.patch(`/api/admin/testimonials/${id}/`, payload);
    return data;
  } catch (error) {
    console.error('[API] Failed to update testimonial:', error.message);
    throw error;
  }
}

export async function deleteAdminTestimonial(id) {
  try {
    await api.delete(`/api/admin/testimonials/${id}/`);
  } catch (error) {
    console.error('[API] Failed to delete testimonial:', error.message);
    throw error;
  }
}

export async function createAdminJob(payload) {
  try {
    const { data } = await api.post('/api/admin/jobs/', payload);
    return data;
  } catch (error) {
    console.error('[API] Failed to create job:', error.message);
    throw error;
  }
}

export async function updateAdminJob(id, payload) {
  try {
    const { data } = await api.patch(`/api/admin/jobs/${id}/`, payload);
    return data;
  } catch (error) {
    console.error('[API] Failed to update job:', error.message);
    throw error;
  }
}

export async function deleteAdminJob(id) {
  try {
    await api.delete(`/api/admin/jobs/${id}/`);
  } catch (error) {
    console.error('[API] Failed to delete job:', error.message);
    throw error;
  }
}

export async function fetchAdminContact(id) {
  try {
    const { data } = await api.get(`/api/admin/contacts/${id}/`);
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch contact:', error.message);
    return null;
  }
}

export async function updateContactStatus(id, payload) {
  try {
    const { data } = await api.patch(`/api/admin/contacts/${id}/status/`, payload);
    return data;
  } catch (error) {
    console.error('[API] Failed to update contact status:', error.message);
    throw error;
  }
}

// ─── Admin: Users ────────────────────────────────────────────────────────────

export async function fetchAdminUsers() {
  try {
    const { data } = await api.get('/api/admin/users/');
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch admin users:', error.message);
    return [];
  }
}

export async function createAdminUser(payload) {
  try {
    const { data } = await api.post('/api/admin/users/', payload);
    return data;
  } catch (error) {
    console.error('[API] Failed to create admin user:', error.message);
    throw error;
  }
}

export async function updateAdminUser(id, payload) {
  try {
    const { data } = await api.patch(`/api/admin/users/${id}/`, payload);
    return data;
  } catch (error) {
    console.error('[API] Failed to update admin user:', error.message);
    throw error;
  }
}

export async function deleteAdminUser(id) {
  try {
    await api.delete(`/api/admin/users/${id}/`);
  } catch (error) {
    console.error('[API] Failed to delete admin user:', error.message);
    throw error;
  }
}

export async function resetAdminUserPassword(id, password) {
  try {
    const { data } = await api.post(`/api/admin/users/${id}/reset-password/`, { password });
    return data;
  } catch (error) {
    console.error('[API] Failed to reset password:', error.message);
    throw error;
  }
}

// ─── Admin: Images ───────────────────────────────────────────────────────────

export async function fetchAdminImages() {
  try {
    const { data } = await api.get('/api/admin/images/');
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch admin images:', error.message);
    return [];
  }
}

export async function fetchAdminImagesByType(assetType) {
  try {
    const { data } = await api.get(`/api/admin/images/type/${assetType}/`);
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch images by type:', error.message);
    return [];
  }
}

export async function uploadImage(payload) {
  try {
    const form = new FormData();
    Object.entries(payload).forEach(([key, val]) => {
      if (val !== null && val !== undefined) form.append(key, val);
    });
    const { data } = await api.post('/api/admin/images/', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (error) {
    console.error('[API] Failed to upload image:', error.message);
    throw error;
  }
}

export async function updateAdminImage(id, payload) {
  try {
    const { data } = await api.patch(`/api/admin/images/${id}/`, payload);
    return data;
  } catch (error) {
    console.error('[API] Failed to update image:', error.message);
    throw error;
  }
}

export async function deleteAdminImage(id) {
  try {
    await api.delete(`/api/admin/images/${id}/`);
  } catch (error) {
    console.error('[API] Failed to delete image:', error.message);
    throw error;
  }
}

export default api;
