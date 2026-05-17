import axios from 'axios';

// In production, this would be an environment variable (e.g. import.meta.env.VITE_API_URL)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchServices = async () => {
  const response = await api.get('/services/');
  return response.data;
};

export const fetchProjects = async () => {
  const response = await api.get('/projects/');
  return response.data;
};

export const fetchTestimonials = async () => {
  const response = await api.get('/testimonials/');
  return response.data;
};

export const fetchTeam = async () => {
  const response = await api.get('/team/');
  return response.data;
};

export const fetchJobs = async () => {
  const response = await api.get('/jobs/');
  return response.data;
};

export const submitContactForm = async (data) => {
  const response = await api.post('/contact/', data);
  return response.data;
};

export default api;
