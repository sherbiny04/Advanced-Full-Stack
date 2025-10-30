import { createContext, useContext, useState, useEffect } from 'react';
import { jobsAPI, applicationsAPI } from '../services/api';

const JobContext = createContext();

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    category: '',
    type: '',
    remote: '',
    experience: '',
  });

  // Fetch all jobs
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobsAPI.getAll();
      setJobs(data);
      setFilteredJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Apply filters whenever filters change
  useEffect(() => {
    applyFilters();
  }, [filters, jobs]);

  const applyFilters = () => {
    let filtered = [...jobs];

    // Search filter (title, company, description)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower)
      );
    }

    // Location filter
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(locationLower)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((job) => job.category === filters.category);
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter((job) => job.type === filters.type);
    }

    // Remote filter
    if (filters.remote !== '') {
      const isRemote = filters.remote === 'true';
      filtered = filtered.filter((job) => job.remote === isRemote);
    }

    // Experience filter
    if (filters.experience) {
      filtered = filtered.filter((job) => job.experience === filters.experience);
    }

    setFilteredJobs(filtered);
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      location: '',
      category: '',
      type: '',
      remote: '',
      experience: '',
    });
  };

  // Get job by ID
  const getJobById = async (id) => {
    try {
      return await jobsAPI.getById(id);
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Create job (employer)
  const createJob = async (jobData) => {
    try {
      const newJob = await jobsAPI.create(jobData);
      setJobs((prev) => [newJob, ...prev]);
      return { success: true, job: newJob };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Update job (employer)
  const updateJob = async (id, jobData) => {
    try {
      const updatedJob = await jobsAPI.update(id, jobData);
      setJobs((prev) =>
        prev.map((job) => (job.id === id ? updatedJob : job))
      );
      return { success: true, job: updatedJob };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Delete job (employer)
  const deleteJob = async (id) => {
    try {
      await jobsAPI.delete(id);
      setJobs((prev) => prev.filter((job) => job.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Apply for job (seeker)
  const applyForJob = async (applicationData) => {
    try {
      const application = await applicationsAPI.create(applicationData);
      return { success: true, application };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Get applications by job ID (employer)
  const getApplicationsByJobId = async (jobId) => {
    try {
      return await applicationsAPI.getByJobId(jobId);
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  // Get applications by seeker ID (seeker)
  const getApplicationsBySeekerId = async (seekerId) => {
    try {
      return await applicationsAPI.getBySeekerId(seekerId);
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  const value = {
    jobs,
    filteredJobs,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    fetchJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    applyForJob,
    getApplicationsByJobId,
    getApplicationsBySeekerId,
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};
