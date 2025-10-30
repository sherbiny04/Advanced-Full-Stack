const API_BASE_URL = 'http://localhost:5000';

// Helper function for fetch requests
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Jobs API
export const jobsAPI = {
  // Get all jobs
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/jobs${queryString ? `?${queryString}` : ''}`);
  },

  // Get job by ID
  getById: async (id) => {
    return fetchAPI(`/jobs/${id}`);
  },

  // Create new job
  create: async (jobData) => {
    return fetchAPI('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  },

  // Update job
  update: async (id, jobData) => {
    return fetchAPI(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  },

  // Delete job
  delete: async (id) => {
    return fetchAPI(`/jobs/${id}`, {
      method: 'DELETE',
    });
  },

  // Search jobs
  search: async (query) => {
    return fetchAPI(`/jobs?q=${encodeURIComponent(query)}`);
  },
};

// Companies API
export const companiesAPI = {
  // Get all companies
  getAll: async () => {
    return fetchAPI('/companies');
  },

  // Get company by ID
  getById: async (id) => {
    return fetchAPI(`/companies/${id}`);
  },
};

// Applications API
export const applicationsAPI = {
  // Get all applications
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/applications${queryString ? `?${queryString}` : ''}`);
  },

  // Get application by ID
  getById: async (id) => {
    return fetchAPI(`/applications/${id}`);
  },

  // Create new application
  create: async (applicationData) => {
    return fetchAPI('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  },

  // Update application status
  updateStatus: async (id, status) => {
    return fetchAPI(`/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Get applications by job ID
  getByJobId: async (jobId) => {
    return fetchAPI(`/applications?jobId=${jobId}`);
  },

  // Get applications by seeker ID
  getBySeekerId: async (seekerId) => {
    return fetchAPI(`/applications?seekerId=${seekerId}`);
  },
};

// Users/Auth API
export const authAPI = {
  // Login
  login: async (email, password) => {
    const users = await fetchAPI(`/users?email=${email}&password=${password}`);
    if (users.length > 0) {
      return users[0];
    }
    throw new Error('Invalid credentials');
  },

  // Register
  register: async (userData) => {
    return fetchAPI('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Get user by ID
  getById: async (id) => {
    return fetchAPI(`/users/${id}`);
  },

  // Update user
  update: async (id, userData) => {
    return fetchAPI(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  },
};

export default {
  jobs: jobsAPI,
  companies: companiesAPI,
  applications: applicationsAPI,
  auth: authAPI,
};
