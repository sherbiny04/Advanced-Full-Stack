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
    pronouns: '',
    location: '',
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
      name: user?.name || 'Emanuel Ayuba',
      age: '31',
      pronouns: 'He/Him',
      location: 'London, UK',
      email: user?.email || 'Emanuel@ayubaassistance.com',
      phone: '+44 000 000 000',
      skills: ['React', 'JavaScript', 'Node.js']
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
      <div className="max-w-7xl mx-auto px-4 py-6">
        {selectedJob ? (
          /* Three-column layout when job is selected */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Job Application Survey - 50% */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6 max-h-screen overflow-y-auto">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="text-wazafny-blue hover:text-wazafny-darkBlue"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <h2 className="text-2xl font-bold">Apply for {selectedJob.title}</h2>
                </div>

                <div className="flex gap-4 mb-6">
                  <img
                    src={selectedJob.companyLogo}
                    alt={selectedJob.company}
                    className="w-16 h-16 object-contain rounded-lg bg-gray-50 p-2"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{selectedJob.title}</h3>
                    <p className="text-blue-600 font-semibold">{selectedJob.company}</p>
                    <p className="text-gray-600">{selectedJob.location}</p>
                  </div>
                </div>

                {/* Application Form */}
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Why are you interested in this position?
                    </label>
                    <textarea
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wazafny-blue"
                      placeholder="Tell us why you're excited about this opportunity..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What makes you a good fit for this role?
                    </label>
                    <textarea
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wazafny-blue"
                      placeholder="Highlight your relevant skills and experience..."
                    />
                  </div>

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

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-wazafny-blue text-white py-3 rounded-lg hover:bg-wazafny-darkBlue transition-colors font-semibold"
                    >
                      Submit Application
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedJob(null)}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Job List - 25% */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-4 max-h-screen overflow-y-auto">
                <h3 className="text-lg font-bold mb-4">Other Jobs</h3>
                <div className="space-y-3">
                  {filteredJobs.slice(0, 6).map((job) => (
                    <div
                      key={job.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedJob?.id === job.id ? 'border-wazafny-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-8 h-8 object-contain"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{job.title}</h4>
                          <p className="text-xs text-gray-600 truncate">{job.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{job.location}</span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile and Goals Sidebar - 25% */}
            <div className="lg:col-span-1 space-y-4">
              {/* Mini Profile Card */}
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop"
                    alt={user?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{user?.name || 'Emanuel Ayuba'}</h3>
                    <button
                      onClick={() => setView('profile')}
                      className="text-xs text-wazafny-blue hover:underline"
                    >
                      View profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="bg-white rounded-xl shadow-md p-4">
                <h4 className="font-bold text-sm mb-3">Quick Filters</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={filters.remote}
                      onChange={(e) => setFilters({...filters, remote: e.target.checked})}
                      className="w-4 h-4 text-wazafny-blue rounded"
                    />
                    Remote
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={filters.fulltime}
                      onChange={(e) => setFilters({...filters, fulltime: e.target.checked})}
                      className="w-4 h-4 text-wazafny-blue rounded"
                    />
                    Full-time
                  </label>
                </div>
              </div>

              {/* Goals */}
              <div className="bg-white rounded-xl shadow-md p-4">
                <h4 className="font-bold text-sm mb-3">Goals</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold">Update Resume</p>
                      <div className="w-16 h-1 bg-gray-200 rounded">
                        <div className="w-3/4 h-1 bg-blue-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold">Apply to 3 Jobs</p>
                      <div className="w-16 h-1 bg-gray-200 rounded">
                        <div className="w-1/3 h-1 bg-green-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Two-column layout when browsing jobs */
          <div>
            {/* View Toggle */}
            <div className="mb-6 flex gap-3 justify-center">
              <button
                onClick={() => setView('profile')}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
                  view === 'profile'
                    ? 'bg-wazafny-blue text-white'
                    : 'bg-white text-wazafny-blue border-2 border-wazafny-blue hover:bg-wazafny-blue hover:text-white'
                }`}
              >
                Profile & Applications
              </button>
              <button
                onClick={() => setView('browse')}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
                  view === 'browse'
                    ? 'bg-wazafny-blue text-white'
                    : 'bg-white text-wazafny-blue border-2 border-wazafny-blue hover:bg-wazafny-blue hover:text-white'
                }`}
              >
                Browse Jobs
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Content Area */}
              <div className="lg:col-span-3">{view === 'browse' ? (
                  /* Browse Jobs Content */
                  <div>
                    {/* Search Filters */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </span>
                          <input
                            type="text"
                            placeholder="Job title, keywords..."
                            value={filters.keywords}
                            onChange={(e) => setFilters({...filters, keywords: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wazafny-blue"
                          />
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </span>
                          <input
                            type="text"
                            placeholder="Location"
                            value={filters.location}
                            onChange={(e) => setFilters({...filters, location: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wazafny-blue"
                          />
                        </div>
                        <button className="bg-wazafny-blue text-white px-6 py-3 rounded-lg hover:bg-wazafny-darkBlue transition-colors font-semibold">
                          Search Jobs
                        </button>
                      </div>
                    </div>
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                  alt={user?.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-gray-900">{user?.name || 'Emanuel Ayuba'}</h3>
                  <Link to="#" className="text-sm text-blue-600 hover:underline">
                    View profile
                  </Link>
                </div>
              </div>

              {/* Keywords Input */}
              <div className="mb-4">
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Keywords"
                    value={filters.keywords}
                    onChange={(e) => setFilters({...filters, keywords: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wazafny-blue"
                  />
                </div>
              </div>

              {/* Location Input */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Location"
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wazafny-blue"
                    />
                  </div>
                  <button className="bg-wazafny-blue text-white px-6 py-3 rounded-lg hover:bg-wazafny-darkBlue transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Salary Slider */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-wazafny-blue font-semibold">Salary</span>
                  <span className="text-sm text-gray-600 font-medium">£{filters.salary.toLocaleString()}+</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="20000"
                    max="150000"
                    step="5000"
                    value={filters.salary}
                    onChange={(e) => setFilters({...filters, salary: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-wazafny-blue"
                    style={{
                      background: `linear-gradient(to right, #2557a7 0%, #2557a7 ${((filters.salary - 20000) / (150000 - 20000)) * 100}%, #e5e7eb ${((filters.salary - 20000) / (150000 - 20000)) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <style jsx>{`
                    input[type="range"]::-webkit-slider-thumb {
                      appearance: none;
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #2557a7;
                      cursor: pointer;
                      border: 3px solid white;
                      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                    }
                    input[type="range"]::-moz-range-thumb {
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #2557a7;
                      cursor: pointer;
                      border: 3px solid white;
                      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                    }
                  `}</style>
                </div>
              </div>

              {/* Distance Slider */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-wazafny-blue font-semibold">Distance</span>
                  <span className="text-sm text-gray-600 font-medium">{filters.distance} Miles</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={filters.distance}
                    onChange={(e) => setFilters({...filters, distance: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-wazafny-blue"
                    style={{
                      background: `linear-gradient(to right, #2557a7 0%, #2557a7 ${((filters.distance - 5) / (100 - 5)) * 100}%, #e5e7eb ${((filters.distance - 5) / (100 - 5)) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                </div>
              </div>

              {/* Work Type Checkboxes */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <label className="flex flex-col items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.remote}
                    onChange={(e) => setFilters({...filters, remote: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">Remote</span>
                </label>
                <label className="flex flex-col items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hybrid}
                    onChange={(e) => setFilters({...filters, hybrid: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">Hybrid</span>
                </label>
                <label className="flex flex-col items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.onsite}
                    onChange={(e) => setFilters({...filters, onsite: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">On site</span>
                </label>
              </div>

              {/* Employment Type Checkboxes */}
              <div className="grid grid-cols-3 gap-4">
                <label className="flex flex-col items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.fulltime}
                    onChange={(e) => setFilters({...filters, fulltime: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">Full time</span>
                </label>
                <label className="flex flex-col items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.parttime}
                    onChange={(e) => setFilters({...filters, parttime: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">Part time</span>
                </label>
                <label className="flex flex-col items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.ftc}
                    onChange={(e) => setFilters({...filters, ftc: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">FTC</span>
                </label>
              </div>
            </div>

            {/* Daily Goals */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Daily Goals</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Update Resume Goal */}
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-3">
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
                        stroke="#3b82f6"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.1)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-center text-gray-900">Update Your Resume</p>
                </div>

                {/* Apply for Jobs Goal */}
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-3">
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
                        stroke="#3b82f6"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.6)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-center text-gray-900">Apply for 5 Positions</p>
                </div>
              </div>

              <div className="text-center text-sm text-gray-600 leading-relaxed">
                <p>Your current CV gets you to interview stage for <span className="text-blue-600 font-semibold">4.5%</span> of applications.</p>
                <p className="mt-2">Consider adding more keywords for your desired position.</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* View Toggle */}
            <div className="mb-6 flex gap-3 justify-center lg:justify-start">
              <button
                onClick={() => setView('profile')}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
                  view === 'profile'
                    ? 'bg-wazafny-blue text-white'
                    : 'bg-white text-wazafny-blue border-2 border-wazafny-blue hover:bg-wazafny-blue hover:text-white'
                }`}
              >
                Profile & Applications
              </button>
              <button
                onClick={() => setView('browse')}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
                  view === 'browse'
                    ? 'bg-wazafny-blue text-white'
                    : 'bg-white text-wazafny-blue border-2 border-wazafny-blue hover:bg-wazafny-blue hover:text-white'
                }`}
              >
                Browse Jobs
              </button>
            </div>

            {view === 'profile' ? (
              <>
                {/* Profile Section */}
                <div className="bg-white rounded-xl shadow-md p-8 mb-6">
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
                                value={profileData.pronouns}
                                onChange={(e) => handleProfileUpdate('pronouns', e.target.value)}
                                className="text-gray-600 border-b border-gray-300 focus:border-wazafny-blue focus:outline-none bg-transparent"
                                placeholder="Pronouns"
                              />
                            </div>
                            <input
                              type="text"
                              value={profileData.location}
                              onChange={(e) => handleProfileUpdate('location', e.target.value)}
                              className="text-gray-700 border-b border-gray-300 focus:border-wazafny-blue focus:outline-none bg-transparent w-full"
                              placeholder="Location"
                            />
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
                            <h2 className="text-3xl font-bold text-gray-900 mb-1">{profileData.name}</h2>
                            <p className="text-gray-600 mb-2">Age: {profileData.age} ({profileData.pronouns})</p>
                            <p className="text-gray-700 mb-1">{profileData.location}</p>
                            <p className="text-gray-700 mb-1">{profileData.email}</p>
                            <p className="text-gray-700">{profileData.phone}</p>
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

                  {/* CV Section */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">CV's</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Primary CV */}
                      <div className="border-2 border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">Emanuel Ayuba (PM)</p>
                            <p className="text-sm text-gray-600">Uploaded 26/12/23</p>
                          </div>
                        </div>
                        <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                          Primary
                        </span>
                      </div>

                      {/* Out of Date CV */}
                      <div className="border-2 border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 bg-orange-100 rounded flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">Emanuel Ayuba (Generic)</p>
                            <p className="text-sm text-gray-600">Uploaded 19/10/22</p>
                          </div>
                        </div>
                        <span className="inline-block px-3 py-1 bg-orange-500 text-white text-sm rounded-full">
                          1 Year Out of Date
                        </span>
                      </div>

                      {/* Upload CV */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <p className="font-semibold text-gray-900">Upload CV</p>
                        <p className="text-sm text-gray-600">Click here</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pending Applications */}
                <div className="bg-white rounded-xl shadow-md p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Pending Applications</h3>
                  
                  {loading ? (
                    <div className="flex justify-center items-center p-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-4">No applications yet</p>
                      <Link to="/jobs" className="btn-primary">
                        Browse Jobs
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      {applications.slice(0, 4).map((application, index) => {
                        const progress = getProgressPercentage(application.status);
                        const circumference = 2 * Math.PI * 45;
                        const offset = circumference - (progress / 100) * circumference;
                        
                        return (
                          <div key={application.id} className="flex flex-col items-center">
                            <div className="relative w-32 h-32 mb-4">
                              <svg className="w-32 h-32 transform -rotate-90">
                                <circle
                                  cx="64"
                                  cy="64"
                                  r="45"
                                  stroke="#e5e7eb"
                                  strokeWidth="6"
                                  fill="none"
                                />
                                <circle
                                  cx="64"
                                  cy="64"
                                  r="45"
                                  stroke={application.status === 'interview' ? '#3b82f6' : '#9ca3af'}
                                  strokeWidth="6"
                                  fill="none"
                                  strokeDasharray={circumference}
                                  strokeDashoffset={offset}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
                                  {application.job?.companyLogo ? (
                                    <img
                                      src={application.job.companyLogo}
                                      alt={application.job.company}
                                      className="w-16 h-16 object-contain"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                      <span className="text-2xl font-bold text-gray-600">
                                        {application.job?.company?.charAt(0) || '?'}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <h4 className="font-bold text-gray-900 text-center mb-1">
                              {application.job?.title?.split(' ').slice(0, 2).join(' ') || 'Position'}
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
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Browse Jobs View */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Job Listings */}
                <div className="space-y-4 max-h-[800px] overflow-y-auto">
                  {filteredJobs.slice(0, 5).map((job) => (
                    <div
                      key={job.id}
                      className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow ${
                        selectedJob?.id === job.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="relative h-32">
                        <img
                          src={job.officeImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=200&fit=crop'}
                          alt="Office"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <img
                            src={job.companyLogo}
                            alt={job.company}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                        <div className="absolute top-4 left-24 flex gap-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{job.type}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                            <p className="text-blue-600 font-semibold">{job.salary}</p>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Job Details Panel */}
                {selectedJob && (
                  <div className="bg-white rounded-xl shadow-md p-6 sticky top-6 max-h-[800px] overflow-y-auto">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <img
                          src={selectedJob.companyLogo}
                          alt={selectedJob.company}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedJob.title}</h2>
                        <p className="text-blue-600 font-semibold">{selectedJob.company}</p>
                      </div>
                    </div>

                    {/* Cover Letters */}
                    <div className="mb-6">
                      <label className="block text-lg font-bold text-gray-900 mb-3">Cover Letters</label>
                      <textarea
                        rows="4"
                        placeholder="Write your cover letter here..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    </div>

                    {/* CV Selection */}
                    <div className="mb-6">
                      <label className="block text-lg font-bold text-gray-900 mb-3">CV's</label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 border-2 border-blue-500 rounded-lg bg-blue-50">
                          <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">Emanuel Ayuba (PM)</p>
                            <p className="text-sm text-gray-600">Uploaded 26/12/23</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer">
                          <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center">
                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">Emanuel Ayuba (Generic)</p>
                            <p className="text-sm text-gray-600">Uploaded 19/10/22</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Questions */}
                    <div className="mb-6">
                      <label className="block text-lg font-bold text-gray-900 mb-3">
                        How many years of HR experience do you have?
                      </label>
                      <input
                        type="text"
                        placeholder="Your answer..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-lg font-bold text-gray-900 mb-3">
                        What are your salary expectations
                      </label>
                      <input
                        type="text"
                        placeholder="Your answer..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Apply Button */}
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors">
                      Apply Now
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default JobSeekerDashboard;
