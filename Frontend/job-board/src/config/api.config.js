// API Configuration for JSON Server
// Use window.location.hostname to automatically work on both localhost and network
const API_HOST = window.location.hostname === 'localhost' 
  ? 'localhost' 
  : window.location.hostname;

export const apiConfig = {
  baseURL: `http://${API_HOST}:5000`,
  timeout: 10000,
  retries: 3
};

// API Endpoints for JSON Server
export const API_ENDPOINTS = {
  // Authentication endpoints (using users endpoint)
  auth: {
    login: '/users',
    register: '/users',
    profile: '/users'
  },
  
  // Jobs endpoints
  jobs: {
    getAll: '/jobs',
    getById: (id) => `/jobs/${id}`,
    create: '/jobs',
    update: (id) => `/jobs/${id}`,
    delete: (id) => `/jobs/${id}`,
    search: '/jobs'
  },
  
  // Companies endpoints
  companies: {
    getAll: '/companies',
    getById: (id) => `/companies/${id}`
  },

  // Users endpoints
  users: {
    getAll: '/users',
    getById: (id) => `/users/${id}`,
    create: '/users',
    update: (id) => `/users/${id}`
  },

  // Applications endpoints
  applications: {
    getAll: '/applications',
    getById: (id) => `/applications/${id}`,
    create: '/applications',
    update: (id) => `/applications/${id}`,
    delete: (id) => `/applications/${id}`
  }
};

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Helper function to get headers
export const getHeaders = (requireAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (requireAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};
