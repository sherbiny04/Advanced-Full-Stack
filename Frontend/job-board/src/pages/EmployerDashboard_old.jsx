import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { user, isEmployer } = useAuth();
  const { jobs, createJob, updateJob, deleteJob, getApplicationsByJobId } = useJobs();
  const [myJobs, setMyJobs] = useState([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [selectedJobApplications, setSelectedJobApplications] = useState([]);
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
  }, [jobs, user]);

  const loadMyJobs = () => {
    const employerJobs = jobs.filter(job => job.company === user?.company);
    setMyJobs(employerJobs);
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setJobFormData({
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
      requirements: job.requirements.join('\n'),
      benefits: job.benefits.join('\n'),
    });
    setShowJobModal(true);
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();

    const jobData = {
      ...jobFormData,
      requirements: jobFormData.requirements.split('\n').filter(r => r.trim()),
      benefits: jobFormData.benefits.split('\n').filter(b => b.trim()),
      postedDate: new Date().toISOString().split('T')[0],
      employerId: user.id,
    };

    let result;
    if (editingJob) {
      result = await updateJob(editingJob.id, jobData);
    } else {
      result = await createJob(jobData);
    }

    if (result.success) {
      alert(editingJob ? 'Job updated successfully!' : 'Job posted successfully!');
      setShowJobModal(false);
      loadMyJobs();
    } else {
      alert('Failed to save job. Please try again.');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      const result = await deleteJob(jobId);
      if (result.success) {
        alert('Job deleted successfully!');
        loadMyJobs();
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Employer Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Jobs Posted</p>
                <p className="text-3xl font-bold text-wazafny-blue">{myJobs.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-wazafny-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Jobs</p>
                <p className="text-3xl font-bold text-green-600">{myJobs.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Company</p>
                <p className="text-xl font-bold text-gray-900">{user?.company}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <button onClick={handleCreateJob} className="btn-primary">
            <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Post New Job
          </button>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">My Job Postings</h2>
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

        {/* Job Modal */}
        {showJobModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
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

                <form onSubmit={handleSubmitJob} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <option value="Product">Product</option>
                        <option value="Data Science">Data Science</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Experience *</label>
                      <select
                        required
                        value={jobFormData.experience}
                        onChange={(e) => setJobFormData({ ...jobFormData, experience: e.target.value })}
                        className="input-field"
                      >
                        <option value="Entry-level">Entry-level</option>
                        <option value="Mid-level">Mid-level</option>
                        <option value="Senior">Senior</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Salary Range *</label>
                      <input
                        type="text"
                        required
                        value={jobFormData.salary}
                        onChange={(e) => setJobFormData({ ...jobFormData, salary: e.target.value })}
                        className="input-field"
                        placeholder="e.g. $80,000 - $120,000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Company Logo URL</label>
                      <input
                        type="text"
                        value={jobFormData.companyLogo}
                        onChange={(e) => setJobFormData({ ...jobFormData, companyLogo: e.target.value })}
                        className="input-field"
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={jobFormData.remote}
                        onChange={(e) => setJobFormData({ ...jobFormData, remote: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-semibold text-gray-700">Remote Position</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description *</label>
                    <textarea
                      required
                      value={jobFormData.description}
                      onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                      rows="4"
                      className="input-field"
                      placeholder="Describe the role and responsibilities..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Requirements (one per line) *</label>
                    <textarea
                      required
                      value={jobFormData.requirements}
                      onChange={(e) => setJobFormData({ ...jobFormData, requirements: e.target.value })}
                      rows="4"
                      className="input-field"
                      placeholder="5+ years of experience&#10;Strong knowledge of React&#10;..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Benefits (one per line) *</label>
                    <textarea
                      required
                      value={jobFormData.benefits}
                      onChange={(e) => setJobFormData({ ...jobFormData, benefits: e.target.value })}
                      rows="4"
                      className="input-field"
                      placeholder="Health insurance&#10;401(k) matching&#10;..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowJobModal(false)}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 btn-primary">
                      {editingJob ? 'Update Job' : 'Post Job'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Applications Modal */}
        {showApplicationsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
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

                {selectedJobApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No applications yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedJobApplications.map((app) => (
                      <div key={app.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{app.seekerName}</h3>
                            <p className="text-gray-600">{app.seekerEmail}</p>
                          </div>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                            {app.status}
                          </span>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Cover Letter:</p>
                          <p className="text-gray-600">{app.coverLetter}</p>
                        </div>
                        {app.resume && (
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Resume:</p>
                            <a
                              href={app.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-wazafny-blue hover:text-wazafny-darkBlue"
                            >
                              View Resume
                            </a>
                          </div>
                        )}
                        <p className="text-sm text-gray-500 mt-4">
                          Applied on {new Date(app.appliedDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
