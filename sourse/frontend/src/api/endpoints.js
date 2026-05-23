const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const endpoints = {
  // Auth
  auth: {
    login: `${API_BASE}/auth/login`,
    register: `${API_BASE}/auth/register`,
  },
  
  // Articles
  articles: {
    list: `${API_BASE}/articles`,
    create: `${API_BASE}/articles`,
    get: (slug) => `${API_BASE}/articles/${slug}`,
    update: (id) => `${API_BASE}/articles/${id}`,
    delete: (id) => `${API_BASE}/articles/${id}`,
  },
  
  // Users
  users: {
    list: `${API_BASE}/users`,
    get: (id) => `${API_BASE}/users/${id}`,
    create: `${API_BASE}/users`,
    update: (id) => `${API_BASE}/users/${id}`,
    delete: (id) => `${API_BASE}/users/${id}`,
  },
  
  // Categories
  categories: {
    list: `${API_BASE}/categories`,
    create: `${API_BASE}/categories`,
    get: (id) => `${API_BASE}/categories/${id}`,
    update: (id) => `${API_BASE}/categories/${id}`,
    delete: (id) => `${API_BASE}/categories/${id}`,
  },
};

export default endpoints;