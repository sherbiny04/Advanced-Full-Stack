import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { user, isEmployer } = useAuth();
  const { jobs, createJob, updateJob, deleteJob, getApplicationsByJobId } = useJobs();
  const [myJobs, setMyJobs] = useState([]);
  const [view, setView] = useState('overview'); // 'overview', 'jobs', 'applications', 'profile'
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [selectedJobApplications, setSelectedJobApplications] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    viewsThisWeek: 0
  });
  const [companyProfile, setCompanyProfile] = useState({
    name: user?.company || '',
    logo: '',
    website: '',
    description: '',
    industry: '',
    size: '',
    location: ''
  });
  const [jobFormData, setJobFormData] = useState({
    title: '',
    company: user?.company || '',
    companyLogo: '',
    location: '',
    type: 'Full-time',
    remote: false,
    salary: '',
    category: 'Engineering',
    experience: 'Mid-level',
    description: '',
    requirements: '',
    benefits: '',
  });

  useEffect(() => {
    if (!isEmployer()) {
      navigate('/login');
      return;
    }
    loadMyJobs();
    loadStats();
  }, [jobs, user]);

  const loadMyJobs = () => {
    const employerJobs = jobs.filter(job => job.company === user?.company);
    setMyJobs(employerJobs);
  };

  const loadStats = async () => {
    const employerJobs = jobs.filter(job => job.company === user?.company);
    let totalApplications = 0;
    
    for (const job of employerJobs) {
      const applications = await getApplicationsByJobId(job.id);
      totalApplications += applications.length;
    }

    setStats({
      totalJobs: employerJobs.length,
      activeJobs: employerJobs.length,
      totalApplications,
      viewsThisWeek: Math.floor(Math.random() * 500) + 100 // Mock data
    });
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setJobFormData({
      title: '',
      company: user?.company || '',
      companyLogo: companyProfile.logo || '',
      location: '',
      type: 'Full-time',
      remote: false,
      salary: '',
      category: 'Engineering',
      experience: 'Mid-level',
      description: '',
      requirements: '',
      benefits: '',
    });
    setShowJobModal(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobFormData({
      title: job.title,
      company: job.company,
      companyLogo: job.companyLogo,
      location: job.location,
      type: job.type,
      remote: job.remote,
      salary: job.salary,
      category: job.category,
      experience: job.experience,
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : job.requirements,
      benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : job.benefits,
    });
    setShowJobModal(true);
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();

    const jobData = {
      ...jobFormData,
      requirements: typeof jobFormData.requirements === 'string' 
        ? jobFormData.requirements.split('\n').filter(r => r.trim())
        : jobFormData.requirements,
      benefits: typeof jobFormData.benefits === 'string'
        ? jobFormData.benefits.split('\n').filter(b => b.trim())
        : jobFormData.benefits,
      postedDate: new Date().toISOString().split('T')[0],
      employerId: user?.id || 1,
    };

    console.log('Submitting job data:', jobData);

    try {
      let result;
      if (editingJob) {
        result = await updateJob(editingJob.id, jobData);
      } else {
        result = await createJob(jobData);
      }

      console.log('Job submission result:', result);

      if (result.success) {
        alert(editingJob ? 'Job updated successfully!' : 'Job posted successfully!');
        setShowJobModal(false);
        loadMyJobs();
        loadStats();
      } else {
        console.error('Job submission failed:', result.error);
        alert(`Failed to save job: ${result.error || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error submitting job:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      const result = await deleteJob(jobId);
      if (result.success) {
        alert('Job deleted successfully!');
        loadMyJobs();
        loadStats();
      } else {
        alert('Failed to delete job. Please try again.');
      }
    }
  };

  const handleViewApplications = async (job) => {
    const applications = await getApplicationsByJobId(job.id);
    setSelectedJobApplications(applications);
    setShowApplicationsModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{companyProfile.name || user?.company}</h1>
              <p className="text-gray-600">Employer Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleCreateJob}
                className="bg-wazafny-blue text-white px-6 py-3 rounded-lg hover:bg-wazafny-darkBlue transition-colors font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Post New Job
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z' },
              { id: 'jobs', label: 'Job Postings', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
              { id: 'applications', label: 'Applications', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { id: 'profile', label: 'Company Profile', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  view === item.id
                    ? 'border-wazafny-blue text-wazafny-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {view === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Jobs</p>
                    <p className="text-3xl font-bold text-wazafny-blue">{stats.totalJobs}</p>
                    <p className="text-xs text-green-600">↗ +2 this month</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-wazafny-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Applications</p>
                    <p className="text-3xl font-bold text-green-600">{stats.totalApplications}</p>
                    <p className="text-xs text-green-600">↗ +12 this week</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Views This Week</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.viewsThisWeek}</p>
                    <p className="text-xs text-green-600">↗ +15% vs last week</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Response Rate</p>
                    <p className="text-3xl font-bold text-orange-600">85%</p>
                    <p className="text-xs text-green-600">↗ +5% this month</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={handleCreateJob}
                  className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-wazafny-blue hover:bg-blue-50 transition-colors group"
                >
                  <svg className="w-8 h-8 text-gray-400 group-hover:text-wazafny-blue mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="font-semibold text-gray-900">Post New Job</p>
                  <p className="text-sm text-gray-600">Create a new job posting</p>
                </button>

                <button
                  onClick={() => setView('applications')}
                  className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-colors group"
                >
                  <svg className="w-8 h-8 text-gray-400 group-hover:text-green-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="font-semibold text-gray-900">Review Applications</p>
                  <p className="text-sm text-gray-600">Check new applications</p>
                </button>

                <button
                  onClick={() => setView('profile')}
                  className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-colors group"
                >
                  <svg className="w-8 h-8 text-gray-400 group-hover:text-purple-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="font-semibold text-gray-900">Update Profile</p>
                  <p className="text-sm text-gray-600">Manage company info</p>
                </button>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Recent Applications</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600">Recent applications will appear here...</p>
              </div>
            </div>
          </div>
        )}

        {view === 'jobs' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">My Job Postings</h2>
              <button onClick={handleCreateJob} className="btn-primary">
                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Post New Job
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {myJobs.length === 0 ? (
                <div className="p-12 text-center">
                  <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
                  <p className="text-gray-600 mb-4">Start by posting your first job opening</p>
                  <button onClick={handleCreateJob} className="btn-primary">
                    Post Your First Job
                  </button>
                </div>
              ) : (
                myJobs.map((job) => (
                  <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            {job.location}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {job.type}
                          </span>
                          {job.remote && (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              Remote
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{job.salary}</p>
                        <p className="text-sm text-gray-500">Posted on {new Date(job.postedDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleViewApplications(job)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          Applications
                        </button>
                        <button
                          onClick={() => handleEditJob(job)}
                          className="px-4 py-2 bg-wazafny-blue hover:bg-wazafny-darkBlue text-white rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {view === 'applications' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">All Applications</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Application management interface will be here...</p>
            </div>
          </div>
        )}

        {view === 'profile' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Profile</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={companyProfile.name}
                    onChange={(e) => setCompanyProfile({...companyProfile, name: e.target.value})}
                    className="input-field"
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={companyProfile.website}
                    onChange={(e) => setCompanyProfile({...companyProfile, website: e.target.value})}
                    className="input-field"
                    placeholder="https://yourcompany.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Description</label>
                <textarea
                  rows={4}
                  value={companyProfile.description}
                  onChange={(e) => setCompanyProfile({...companyProfile, description: e.target.value})}
                  className="input-field"
                  placeholder="Tell candidates about your company..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
                  <select
                    value={companyProfile.industry}
                    onChange={(e) => setCompanyProfile({...companyProfile, industry: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Size</label>
                  <select
                    value={companyProfile.size}
                    onChange={(e) => setCompanyProfile({...companyProfile, size: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Select Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={companyProfile.location}
                    onChange={(e) => setCompanyProfile({...companyProfile, location: e.target.value})}
                    className="input-field"
                    placeholder="Company Location"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-wazafny-blue text-white px-6 py-3 rounded-lg hover:bg-wazafny-darkBlue transition-colors font-semibold"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Job Modal - Keep existing modal code but with better styling */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] my-8 overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingJob ? 'Edit Job' : 'Post New Job'}
                </h2>
                <button
                  onClick={() => setShowJobModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmitJob} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
                    <input
                      type="text"
                      required
                      value={jobFormData.title}
                      onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                      className="input-field"
                      placeholder="e.g. Senior Frontend Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      required
                      value={jobFormData.location}
                      onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                      className="input-field"
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type *</label>
                    <select
                      required
                      value={jobFormData.type}
                      onChange={(e) => setJobFormData({ ...jobFormData, type: e.target.value })}
                      className="input-field"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <select
                      required
                      value={jobFormData.category}
                      onChange={(e) => setJobFormData({ ...jobFormData, category: e.target.value })}
                      className="input-field"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="Product">Product</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Operations">Operations</option>
                      <option value="HR">Human Resources</option>
                      <option value="Finance">Finance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Level</label>
                    <select
                      value={jobFormData.experience}
                      onChange={(e) => setJobFormData({ ...jobFormData, experience: e.target.value })}
                      className="input-field"
                    >
                      <option value="Entry-level">Entry-level</option>
                      <option value="Mid-level">Mid-level</option>
                      <option value="Senior-level">Senior-level</option>
                      <option value="Executive">Executive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Salary Range</label>
                    <input
                      type="text"
                      value={jobFormData.salary}
                      onChange={(e) => setJobFormData({ ...jobFormData, salary: e.target.value })}
                      className="input-field"
                      placeholder="e.g. £50,000 - £70,000"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={jobFormData.remote}
                        onChange={(e) => setJobFormData({ ...jobFormData, remote: e.target.checked })}
                        className="w-4 h-4 text-wazafny-blue rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Remote work available</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description *</label>
                  <textarea
                    required
                    rows={6}
                    value={jobFormData.description}
                    onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                    className="input-field"
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Requirements</label>
                  <textarea
                    rows={4}
                    value={jobFormData.requirements}
                    onChange={(e) => setJobFormData({ ...jobFormData, requirements: e.target.value })}
                    className="input-field"
                    placeholder="List requirements (one per line)..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Benefits</label>
                  <textarea
                    rows={4}
                    value={jobFormData.benefits}
                    onChange={(e) => setJobFormData({ ...jobFormData, benefits: e.target.value })}
                    className="input-field"
                    placeholder="List benefits and perks (one per line)..."
                  />
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowJobModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-wazafny-blue text-white px-6 py-3 rounded-lg hover:bg-wazafny-darkBlue transition-colors font-semibold"
                  >
                    {editingJob ? 'Update Job' : 'Post Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Applications Modal - Keep existing but enhance */}
      {showApplicationsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
                <button
                  onClick={() => setShowApplicationsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {selectedJobApplications.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No applications yet for this job.</p>
              ) : (
                <div className="space-y-4">
                  {selectedJobApplications.map((application, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">Application #{index + 1}</h4>
                      <p className="text-sm text-gray-600">Applied on {new Date(application.appliedDate).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;