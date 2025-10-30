import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const { user, isSeeker } = useAuth();
  const { getApplicationsBySeekerId, getJobById, filteredJobs } = useJobs();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('browse'); // 'profile' or 'browse' - default to browse
  const [selectedJob, setSelectedJob] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    city: '',
    country: '',
    email: '',
    phone: '',
    skills: []
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    keywords: '',
    location: '',
    salary: 35000,
    distance: 35,
    remote: true,
    hybrid: false,
    onsite: false,
    fulltime: false,
    parttime: false,
    ftc: false
  });

  useEffect(() => {
    if (!isSeeker()) {
      navigate('/login');
      return;
    }
    loadApplications();
    initializeProfileData();
  }, [user]);

  const initializeProfileData = () => {
    setProfileData({
      name: user?.name || '',
      age: user?.age || '',
      city: user?.city || '',
      country: user?.country || '',
      email: user?.email || '',
      phone: user?.phone || '',
      skills: user?.skills || []
    });
  };

  const handleProfileUpdate = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillAdd = (skill) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const loadApplications = async () => {
    setLoading(true);
    if (user?.id) {
      const apps = await getApplicationsBySeekerId(user.id);
      
      const appsWithJobs = await Promise.all(
        apps.map(async (app) => {
          const job = await getJobById(app.jobId);
          return { ...app, job };
        })
      );
      
      setApplications(appsWithJobs);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-gray-600';
      case 'interview':
        return 'text-blue-600';
      case 'accepted':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case 'pending':
        return 25;
      case 'interview':
        return 50;
      case 'accepted':
        return 100;
      default:
        return 25;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* View Toggle - Centered */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-center">
            <div className="flex gap-4 bg-gray-100 rounded-full p-2">
              <button
                onClick={() => setView('profile')}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  view === 'profile'
                    ? 'bg-wazafny-blue text-white shadow-md'
                    : 'text-wazafny-blue hover:bg-wazafny-blue hover:text-white'
                }`}
              >
                Profile & Applications
              </button>
              <button
                onClick={() => setView('browse')}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  view === 'browse'
                    ? 'bg-wazafny-blue text-white shadow-md'
                    : 'text-wazafny-blue hover:bg-wazafny-blue hover:text-white'
                }`}
              >
                Browse Jobs
              </button>
            </div>
          </div>
        </div>
      </div>

      {view === 'browse' ? (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className={`grid gap-6 h-[calc(100vh-140px)] ${
            selectedJob 
              ? 'grid-cols-4' // 25% profile + 25% jobs + 50% application
              : 'grid-cols-5' // 25% profile + 75% jobs (70% + 5% gap)
          }`}>
            
            {/* Profile Sidebar - Always 25% */}
            <div className="col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
                    alt={user?.name || 'User'}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{profileData.name || 'Complete your profile'}</h3>
                    <p className="text-sm text-gray-600">{profileData.city && profileData.country ? `${profileData.city}, ${profileData.country}` : 'Add location'}</p>
                  </div>
                </div>

                {/* Profile Completion */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Profile Complete</span>
                    <span className="text-sm text-wazafny-blue">
                      {Math.round(((profileData.name ? 1 : 0) + 
                                   (profileData.email ? 1 : 0) + 
                                   (profileData.city ? 1 : 0) + 
                                   (profileData.country ? 1 : 0) + 
                                   (profileData.skills.length > 0 ? 1 : 0)) / 5 * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-wazafny-blue h-2 rounded-full transition-all duration-300" 
                      style={{
                        width: `${((profileData.name ? 1 : 0) + 
                                  (profileData.email ? 1 : 0) + 
                                  (profileData.city ? 1 : 0) + 
                                  (profileData.country ? 1 : 0) + 
                                  (profileData.skills.length > 0 ? 1 : 0)) / 5 * 100}%`
                      }}
                    ></div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Applications</span>
                    <span className="text-lg font-bold text-wazafny-blue">{applications.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Views</span>
                    <span className="text-lg font-bold text-green-600">24</span>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <button
                  onClick={() => setView('profile')}
                  className="w-full bg-wazafny-blue text-white py-2 rounded-lg hover:bg-wazafny-darkBlue transition-colors font-semibold text-sm"
                >
                  Edit Profile
                </button>

                {/* Quick Filters */}
                <div className="mt-6">
                  <h4 className="font-bold text-sm mb-3 text-gray-900">Quick Filters</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={filters.remote}
                        onChange={(e) => setFilters({...filters, remote: e.target.checked})}
                        className="w-3 h-3 text-wazafny-blue rounded"
                      />
                      <span className="text-gray-700">Remote</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={filters.fulltime}
                        onChange={(e) => setFilters({...filters, fulltime: e.target.checked})}
                        className="w-3 h-3 text-wazafny-blue rounded"
                      />
                      <span className="text-gray-700">Full-time</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Listings - 70% when no job selected, 25% when job selected */}
            <div className={selectedJob ? 'col-span-1' : 'col-span-4'}>
              <div className="bg-white rounded-xl shadow-lg h-full">
                {/* Search Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-3 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        placeholder="Search jobs..."
                        value={filters.keywords}
                        onChange={(e) => setFilters({...filters, keywords: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wazafny-blue text-sm"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        placeholder="Location"
                        value={filters.location}
                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                        className="w-32 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wazafny-blue text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Job List */}
                <div className="p-4 h-[calc(100%-80px)] overflow-y-auto">
                  <div className="space-y-4">
                    {filteredJobs.slice(0, 12).map((job) => (
                      <div
                        key={job.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          selectedJob?.id === job.id 
                            ? 'border-wazafny-blue bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-wazafny-blue hover:shadow-sm'
                        }`}
                        onClick={() => setSelectedJob(job)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <img
                              src={job.companyLogo}
                              alt={job.company}
                              className="w-12 h-12 object-contain rounded-lg bg-white p-1 border"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-lg mb-1">{job.title}</h3>
                                <p className="text-wazafny-blue font-semibold mb-2">{job.company}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                  <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    <span>{job.location}</span>
                                  </div>
                                  <span className="text-green-600 font-semibold">{job.salary}</span>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span className="px-3 py-1 bg-wazafny-blue text-white text-xs rounded-full">{job.type}</span>
                                <span className="text-xs text-gray-500">2 days ago</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Application Form - 50% when job selected */}
            {selectedJob && (
              <div className="col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-6 h-full overflow-y-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="text-wazafny-blue hover:text-wazafny-darkBlue transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">Apply for {selectedJob.title}</h2>
                  </div>

                  <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={selectedJob.companyLogo}
                      alt={selectedJob.company}
                      className="w-16 h-16 object-contain rounded-lg bg-white p-2"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedJob.title}</h3>
                      <p className="text-wazafny-blue font-semibold">{selectedJob.company}</p>
                      <p className="text-gray-600">{selectedJob.location}</p>
                      <p className="text-green-600 font-semibold">{selectedJob.salary}</p>
                    </div>
                  </div>

                  {/* Application Form */}
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Why are you interested in this position? *
                      </label>
                      <textarea
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wazafny-blue"
                        placeholder="Tell us why you're excited about this opportunity..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What makes you a good fit for this role? *
                      </label>
                      <textarea
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wazafny-blue"
                        placeholder="Highlight your relevant skills and experience..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expected Salary
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wazafny-blue"
                          placeholder="e.g., £50,000 - £60,000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Availability
                        </label>
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wazafny-blue">
                          <option>Immediately</option>
                          <option>Within 2 weeks</option>
                          <option>Within 1 month</option>
                          <option>Within 2 months</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-wazafny-blue text-white py-3 rounded-lg hover:bg-wazafny-darkBlue transition-colors font-semibold"
                      >
                        Submit Application
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedJob(null)}
                        className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Profile View */
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex gap-6">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                    alt={profileData.name}
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    {editMode ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => handleProfileUpdate('name', e.target.value)}
                          className="text-3xl font-bold text-gray-900 border-b-2 border-wazafny-blue focus:outline-none bg-transparent"
                          placeholder="Your Name"
                        />
                        <div className="flex gap-4">
                          <input
                            type="text"
                            value={profileData.age}
                            onChange={(e) => handleProfileUpdate('age', e.target.value)}
                            className="text-gray-600 border-b border-gray-300 focus:border-wazafny-blue focus:outline-none bg-transparent w-20"
                            placeholder="Age"
                          />
                          <input
                            type="text"
                            value={profileData.city}
                            onChange={(e) => handleProfileUpdate('city', e.target.value)}
                            className="text-gray-600 border-b border-gray-300 focus:border-wazafny-blue focus:outline-none bg-transparent"
                            placeholder="City"
                          />
                          <input
                            type="text"
                            value={profileData.country}
                            onChange={(e) => handleProfileUpdate('country', e.target.value)}
                            className="text-gray-600 border-b border-gray-300 focus:border-wazafny-blue focus:outline-none bg-transparent"
                            placeholder="Country"
                          />
                        </div>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleProfileUpdate('email', e.target.value)}
                          className="text-gray-700 border-b border-gray-300 focus:border-wazafny-blue focus:outline-none bg-transparent w-full"
                          placeholder="Email"
                        />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                          className="text-gray-700 border-b border-gray-300 focus:border-wazafny-blue focus:outline-none bg-transparent w-full"
                          placeholder="Phone"
                        />
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-1">{profileData.name || 'Please enter your name'}</h2>
                        <p className="text-gray-600 mb-2">Age: {profileData.age || 'Not specified'}</p>
                        <p className="text-gray-700 mb-1">{profileData.city && profileData.country ? `${profileData.city}, ${profileData.country}` : 'Location not specified'}</p>
                        <p className="text-gray-700 mb-1">{profileData.email || 'Email not provided'}</p>
                        <p className="text-gray-700">{profileData.phone || 'Phone not provided'}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {editMode ? (
                    <>
                      <button 
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 bg-wazafny-blue text-white rounded-lg hover:bg-wazafny-darkBlue transition-colors"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => {
                          setEditMode(false);
                          initializeProfileData();
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setEditMode(true)}
                      className="text-wazafny-blue hover:text-wazafny-darkBlue transition-colors"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                {profileData.skills.map((skill, index) => (
                  <span key={index} className="px-4 py-2 bg-wazafny-blue text-white rounded-full flex items-center gap-2">
                    {skill}
                    {editMode && (
                      <button
                        onClick={() => handleSkillRemove(skill)}
                        className="hover:text-red-200 transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
                {editMode && (
                  <button 
                    onClick={() => {
                      const skill = prompt('Enter a new skill:');
                      if (skill) handleSkillAdd(skill);
                    }}
                    className="w-10 h-10 bg-wazafny-blue text-white rounded-full flex items-center justify-center hover:bg-wazafny-darkBlue transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Applications Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h3>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wazafny-blue"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {applications.map((application) => {
                    const progressPercentage = getProgressPercentage(application.status);
                    return (
                      <div
                        key={application.id}
                        className="relative p-4 border-2 border-gray-200 rounded-xl hover:border-wazafny-blue transition-colors"
                      >
                        <div className="text-center">
                          <div className="relative w-24 h-24 mx-auto mb-4">
                            <svg className="w-24 h-24 transform -rotate-90">
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="#e5e7eb"
                                strokeWidth="8"
                                fill="none"
                              />
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="#2557a7"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 40}`}
                                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercentage / 100)}`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              {application.job?.companyLogo ? (
                                <img
                                  src={application.job.companyLogo}
                                  alt={application.job.company}
                                  className="w-12 h-12 object-contain rounded"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                  {application.job?.company?.charAt(0) || '?'}
                                </div>
                              )}
                            </div>
                          </div>
                          <h4 className="font-bold text-gray-900 mb-1">
                            {application.job?.title || 'Job Position'}
                          </h4>
                          <p className="text-sm text-gray-600 text-center mb-2">
                            {application.job?.company || 'Company'}
                          </p>
                          <span className={`text-sm font-medium ${getStatusColor(application.status)}`}>
                            {application.status === 'pending' ? 'Applied' : 
                             application.status === 'interview' ? 'Interview Stage' : 
                             application.status === 'accepted' ? 'CV Opened' : 'Applied'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSeekerDashboard;