import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

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

export default api;
