import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const { user, isSeeker } = useAuth();
  const { getApplicationsBySeekerId, getJobById, filteredJobs, applyForJob } = useJobs();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('browse'); // 'profile' or 'browse' - default to browse
  const [selectedJob, setSelectedJob] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    whyInterested: '',
    expectedSalary: '',
    availability: 'Immediately'
  });
  const [profileData, setProfileData] = useState({
    firstName: 'Marvin',
    lastName: 'McKinney',
    email: 'marvin.mckinney@gmail.com',
    phone: '+1 (555) 000-0000',
    address: '1234 Main St, San Francisco, CA',
    jobTitle: 'Senior Product Designer',
    experience: '3+ Years',
    gender: 'Male',
    dateOfBirth: 'March 23, 1999',
    age: '26 Yrs Old',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    coverLetter: 'Passionate product designer with over 3 years of experience creating intuitive and engaging user experiences. Skilled in user research, prototyping, and visual design. Looking to join a dynamic team where I can contribute to meaningful products that impact users lives.',
    recentExperience: {
      position: 'Senior Product Designer',
      company: 'Tech Solutions Inc.',
      duration: 'Jan 2022 - Present'
    },
    education: {
      degree: 'Bachelor of Design',
      institution: 'University of California',
      year: '2019'
    },
    skills: ['UI/UX Design', 'Figma', 'Prototyping', 'User Research', 'Adobe Creative Suite', 'Sketch'],
    profileCompletion: 85.93,
    cv: null
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
      skills: user?.skills || [],
      cv: user?.cv || null
    });
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedJob || !user) {
      alert('Please select a job and ensure you are logged in.');
      return;
    }

    const application = {
      jobId: selectedJob.id,
      seekerId: user.id,
      status: 'pending',
      appliedDate: new Date().toISOString(),
      coverLetter: applicationData.coverLetter,
      whyInterested: applicationData.whyInterested,
      expectedSalary: applicationData.expectedSalary,
      availability: applicationData.availability,
      seekerName: profileData.name || user.name,
      seekerEmail: profileData.email || user.email
    };

    const result = await applyForJob(application);
    
    if (result.success) {
      alert('Application submitted successfully!');
      setSelectedJob(null);
      setApplicationData({
        coverLetter: '',
        whyInterested: '',
        expectedSalary: '',
        availability: 'Immediately'
      });
      // Reload applications
      loadApplications();
    } else {
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleApplicationChange = (field, value) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCVUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd upload to a server
      setProfileData(prev => ({
        ...prev,
        cv: {
          name: file.name,
          size: file.size,
          uploadDate: new Date().toISOString()
        }
      }));
    }
  };

  const handleAddSkill = () => {
    setShowSkillInput(true);
  };

  const handleSkillSubmit = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
      setShowSkillInput(false);
    }
  };

  const handleSkillCancel = () => {
    setNewSkill('');
    setShowSkillInput(false);
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSkillSubmit();
    } else if (e.key === 'Escape') {
      handleSkillCancel();
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 pb-16 relative overflow-hidden">
      {/* Background accent elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-40 w-80 h-80 bg-gradient-to-br from-wazafny-blue/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-64 h-64 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-gradient-to-br from-green-400/10 to-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* View Toggle - Centered */}
      <div className="relative bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-10">
        {/* Header accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-wazafny-blue via-purple-500 to-pink-500"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-6 relative">
          {/* Welcome section */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-wazafny-blue to-purple-600">{user?.name}</span>!
            </h1>
            <p className="text-gray-600">Find your dream job and manage your applications</p>
          </div>
          
          <div className="flex justify-center">
            <div className="flex gap-4 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full p-2 shadow-lg border border-white">
              <button
                onClick={() => setView('profile')}
                className={`relative px-6 py-3 rounded-full font-semibold transition-all duration-300 overflow-hidden group ${
                  view === 'profile'
                    ? 'bg-gradient-to-r from-wazafny-blue to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-wazafny-blue'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile & Applications
                </span>
                {view !== 'profile' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-wazafny-blue/10 to-purple-500/10 scale-0 group-hover:scale-100 transition-transform duration-200 rounded-full"></div>
                )}
              </button>
              <button
                onClick={() => setView('browse')}
                className={`relative px-6 py-3 rounded-full font-semibold transition-all duration-300 overflow-hidden group ${
                  view === 'browse'
                    ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8zM8 14v.01M12 14v.01M16 14v.01" />
                  </svg>
                  Browse Jobs
                </span>
                {view !== 'browse' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10 scale-0 group-hover:scale-100 transition-transform duration-200 rounded-full"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {view === 'browse' ? (
        <div className="max-w-7xl mx-auto px-6 py-8 relative">
          <div className="flex gap-6 h-[calc(100vh-200px)] min-h-[700px]">
            
            {/* Profile Sidebar - Enhanced with colors */}
            <div className="w-1/5 flex-shrink-0">
              <div className="relative bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 p-4 h-full overflow-y-auto">
                {/* Sidebar accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-wazafny-blue to-purple-500 rounded-t-xl"></div>
                
                <div className="flex items-center gap-3 mb-6 relative">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-wazafny-blue to-purple-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-teal-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm">{profileData.name || 'Complete profile'}</h3>
                  </div>
                </div>

                {/* Profile Completion */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700">Profile Completion</span>
                    <span className="text-xs font-bold text-wazafny-blue">
                      {Math.round(((profileData.name ? 1 : 0) + 
                                   (profileData.email ? 1 : 0) + 
                                   (profileData.city ? 1 : 0) + 
                                   (profileData.country ? 1 : 0) + 
                                   (profileData.skills.length > 0 ? 1 : 0)) / 5 * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-wazafny-blue to-purple-500 h-2 rounded-full transition-all duration-500"
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
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Applications</span>
                    <span className="text-sm font-bold text-wazafny-blue">{applications.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Views</span>
                    <span className="text-sm font-bold text-green-600">24</span>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <button
                  onClick={() => setView('profile')}
                  className="w-full bg-gradient-to-r from-wazafny-blue to-purple-600 text-white py-2.5 rounded-xl hover:from-purple-600 hover:to-wazafny-blue transition-all duration-300 font-semibold text-xs mb-6 shadow-lg hover:shadow-xl transform hover:scale-105 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>

                {/* Enhanced Filters */}
                <div className="relative">
                  
                  {/* Job Type */}
                  <div className="mb-6 relative">
                    <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-sm"></div>
                    <div className="relative bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                      <h5 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        Job Type
                      </h5>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 text-sm group cursor-pointer hover:bg-blue-50/50 rounded-lg p-2 -m-2 transition-all duration-200">
                          <input
                            type="checkbox"
                            checked={filters.fulltime}
                            onChange={(e) => setFilters({...filters, fulltime: e.target.checked})}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-gray-700 group-hover:text-blue-700 font-medium">Full-time</span>
                        </label>
                        <label className="flex items-center gap-3 text-sm group cursor-pointer hover:bg-green-50/50 rounded-lg p-2 -m-2 transition-all duration-200">
                          <input
                            type="checkbox"
                            checked={filters.parttime}
                            onChange={(e) => setFilters({...filters, parttime: e.target.checked})}
                            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                          />
                          <span className="text-gray-700 group-hover:text-green-700 font-medium">Part-time</span>
                        </label>
                        <label className="flex items-center gap-3 text-sm group cursor-pointer hover:bg-purple-50/50 rounded-lg p-2 -m-2 transition-all duration-200">
                          <input
                            type="checkbox"
                            checked={filters.ftc}
                            onChange={(e) => setFilters({...filters, ftc: e.target.checked})}
                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                          />
                          <span className="text-gray-700 group-hover:text-purple-700 font-medium">Contract</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Work Mode */}
                  <div className="mb-6 relative">
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full blur-sm"></div>
                    <div className="relative bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                      <h5 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"></div>
                        Work Mode
                      </h5>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 text-sm group cursor-pointer hover:bg-teal-50/50 rounded-lg p-2 -m-2 transition-all duration-200">
                          <input
                            type="checkbox"
                            checked={filters.remote}
                            onChange={(e) => setFilters({...filters, remote: e.target.checked})}
                            className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                          />
                          <span className="text-gray-700 group-hover:text-teal-700 font-medium">Remote</span>
                        </label>
                        <label className="flex items-center gap-3 text-sm group cursor-pointer hover:bg-cyan-50/50 rounded-lg p-2 -m-2 transition-all duration-200">
                          <input
                            type="checkbox"
                            checked={filters.hybrid}
                            onChange={(e) => setFilters({...filters, hybrid: e.target.checked})}
                            className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                          />
                          <span className="text-gray-700 group-hover:text-cyan-700 font-medium">Hybrid</span>
                        </label>
                        <label className="flex items-center gap-3 text-sm group cursor-pointer hover:bg-indigo-50/50 rounded-lg p-2 -m-2 transition-all duration-200">
                          <input
                            type="checkbox"
                            checked={filters.onsite}
                            onChange={(e) => setFilters({...filters, onsite: e.target.checked})}
                            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                          />
                          <span className="text-gray-700 group-hover:text-indigo-700 font-medium">On-site</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Salary Range */}
                  <div className="mb-6 relative">
                    <div className="absolute -top-2 -left-2 w-10 h-10 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-sm"></div>
                    <div className="relative bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                      <h5 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                        Salary Range
                      </h5>
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type="range"
                            min="20000"
                            max="100000"
                            step="5000"
                            value={filters.salary}
                            onChange={(e) => setFilters({...filters, salary: parseInt(e.target.value)})}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb focus:outline-none"
                            style={{
                              background: `linear-gradient(to right, #10b981 0%, #10b981 ${((filters.salary - 20000) / (100000 - 20000)) * 100}%, #e5e7eb ${((filters.salary - 20000) / (100000 - 20000)) * 100}%, #e5e7eb 100%)`
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span className="text-gray-500">£20K</span>
                          <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">£{(filters.salary / 1000).toFixed(0)}K+</span>
                          <span className="text-gray-500">£100K</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Distance */}
                  <div className="mb-6 relative">
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full blur-sm"></div>
                    <div className="relative bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                      <h5 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                        Distance
                      </h5>
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type="range"
                            min="5"
                            max="100"
                            step="5"
                            value={filters.distance}
                            onChange={(e) => setFilters({...filters, distance: parseInt(e.target.value)})}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb focus:outline-none"
                            style={{
                              background: `linear-gradient(to right, #f97316 0%, #f97316 ${((filters.distance - 5) / (100 - 5)) * 100}%, #e5e7eb ${((filters.distance - 5) / (100 - 5)) * 100}%, #e5e7eb 100%)`
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span className="text-gray-500">5 mi</span>
                          <span className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">{filters.distance} mi</span>
                          <span className="text-gray-500">100 mi</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={() => setFilters({
                      keywords: '',
                      location: '',
                      salary: 35000,
                      distance: 35,
                      remote: false,
                      hybrid: false,
                      onsite: false,
                      fulltime: false,
                      parttime: false,
                      ftc: false
                    })}
                    className="w-full bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-600 hover:from-red-100 hover:to-pink-100 hover:border-red-300 transition-all duration-200 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 group"
                  >
                    <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Job Listings - Bigger when job selected */}
            <div className={`${selectedJob ? 'w-2/5' : 'w-4/5'} flex-shrink-0 transition-all duration-300`}>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 h-full flex flex-col relative overflow-hidden">
                {/* Background accent elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-400/10 to-cyan-500/10 rounded-full blur-2xl"></div>
                
                {/* Search Header - Fixed height */}
                <div className="p-6 border-b border-gray-200/50 flex-shrink-0 relative z-10">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <span className="absolute left-4 top-4 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        placeholder="Search jobs..."
                        value={filters.keywords}
                        onChange={(e) => setFilters({...filters, keywords: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 bg-white/80 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-sm placeholder-gray-400 shadow-sm hover:shadow-md transition-all duration-200"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-4 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        placeholder="Location"
                        value={filters.location}
                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                        className="w-36 pl-12 pr-4 py-3 border border-gray-200 bg-white/80 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 text-sm placeholder-gray-400 shadow-sm hover:shadow-md transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Job List - Scrollable content */}
                <div className="flex-1 p-6 overflow-y-auto relative z-10">
                  <div className="space-y-4">
                    {filteredJobs.slice(0, 20).map((job, index) => (
                      <div
                        key={job.id}
                        className={`group relative p-5 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                          selectedJob?.id === job.id 
                            ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg scale-[1.02] ring-2 ring-blue-200' 
                            : 'border-gray-200 bg-white/70 backdrop-blur-sm hover:border-blue-300 hover:shadow-md hover:bg-white/90'
                        }`}
                        onClick={() => setSelectedJob(job)}
                      >
                        {/* Accent dot */}
                        <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
                          index % 4 === 0 ? 'bg-gradient-to-br from-blue-400 to-purple-500' :
                          index % 4 === 1 ? 'bg-gradient-to-br from-green-400 to-teal-500' :
                          index % 4 === 2 ? 'bg-gradient-to-br from-orange-400 to-red-500' :
                          'bg-gradient-to-br from-purple-400 to-pink-500'
                        } opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
                        
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {job.companyLogo ? (
                              <img
                                src={job.companyLogo}
                                alt={job.company}
                                className="w-12 h-12 object-contain rounded-lg bg-white p-2 border border-gray-200"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
                                <span className="text-lg font-bold text-gray-600">{job.company?.charAt(0) || '?'}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0 pr-2">
                                <h3 className="font-bold text-gray-900 text-base mb-1 truncate group-hover:text-blue-700 transition-colors duration-200">{job.title}</h3>
                                <p className="text-blue-600 font-semibold mb-2 text-sm truncate">{job.company}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                                  <div className="flex items-center gap-1 min-w-0">
                                    <svg className="w-3 h-3 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    <span className="truncate">{job.location}</span>
                                  </div>
                                  <span className="text-emerald-600 font-bold whitespace-nowrap bg-emerald-50 px-2 py-0.5 rounded-full">{job.salary}</span>
                                </div>
                                <p className="text-gray-600 text-xs overflow-hidden" style={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  lineHeight: '1.2',
                                  maxHeight: '2.4em'
                                }}>{job.description}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2 ml-2 flex-shrink-0">
                                <span className={`px-3 py-1 text-white text-xs rounded-full whitespace-nowrap font-medium ${
                                  job.type === 'Full-time' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                  job.type === 'Part-time' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                  'bg-gradient-to-r from-purple-500 to-purple-600'
                                }`}>{job.type}</span>
                                <span className="text-xs text-gray-500 whitespace-nowrap">2 days ago</span>
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

            {/* Application Form - Adjusted width for new layout */}
            {selectedJob && (
              <div className="w-2/5 flex-shrink-0">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 h-full flex flex-col relative overflow-hidden">
                  {/* Background accents */}
                  <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tr from-blue-400/10 to-cyan-500/10 rounded-full blur-2xl"></div>
                  
                  {/* Header - Fixed */}
                  <div className="p-6 border-b border-gray-200/50 flex-shrink-0 relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <button
                        onClick={() => setSelectedJob(null)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                      >
                        <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Apply for Position</h2>
                        <p className="text-sm text-blue-600 font-medium">{selectedJob.title} at {selectedJob.company}</p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={selectedJob.companyLogo}
                        alt={selectedJob.company}
                        className="w-12 h-12 object-contain rounded-lg bg-white p-2"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{selectedJob.title}</h3>
                        <p className="text-wazafny-blue font-semibold">{selectedJob.company}</p>
                        <p className="text-gray-600 text-sm">{selectedJob.location}</p>
                        <p className="text-green-600 font-semibold text-sm">{selectedJob.salary}</p>
                      </div>
                    </div>
                  </div>

                  {/* Form Content - Scrollable */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                      {/* Job Description */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Job Description</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-700 leading-relaxed">{selectedJob.description}</p>
                        </div>
                      </div>

                      {/* Job Requirements (if available) */}
                      {selectedJob.requirements && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Requirements</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            {Array.isArray(selectedJob.requirements) ? (
                              <ul className="list-disc list-inside space-y-1">
                                {selectedJob.requirements.map((req, index) => (
                                  <li key={index} className="text-sm text-gray-700">{req}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-700">{selectedJob.requirements}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Application Form */}
                      <form onSubmit={handleApplicationSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Why are you interested in this position? *
                        </label>
                        <textarea
                          rows={3}
                          value={applicationData.whyInterested}
                          onChange={(e) => handleApplicationChange('whyInterested', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wazafny-blue text-sm"
                          placeholder="Tell us why you're excited about this opportunity..."
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          What makes you a good fit for this role? *
                        </label>
                        <textarea
                          rows={3}
                          value={applicationData.coverLetter}
                          onChange={(e) => handleApplicationChange('coverLetter', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wazafny-blue text-sm"
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
                            value={applicationData.expectedSalary}
                            onChange={(e) => handleApplicationChange('expectedSalary', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wazafny-blue text-sm"
                            placeholder="e.g., £50,000 - £60,000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Availability
                          </label>
                          <select 
                            value={applicationData.availability}
                            onChange={(e) => handleApplicationChange('availability', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wazafny-blue text-sm"
                          >
                            <option value="Immediately">Immediately</option>
                            <option value="Within 2 weeks">Within 2 weeks</option>
                            <option value="Within 1 month">Within 1 month</option>
                            <option value="Within 2 months">Within 2 months</option>
                          </select>
                        </div>
                      </div>

                      {/* Submit buttons moved to footer */}
                    </form>
                    </div>
                  </div>

                  {/* Footer Buttons - Fixed */}
                  <div className="p-6 border-t border-gray-200 flex-shrink-0">
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        onClick={handleApplicationSubmit}
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
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Professional Profile Dashboard */
        <div className="bg-gray-50 min-h-screen">
          {/* Header with Back Button */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setView('browse')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Senior Product Designer
                </button>
                
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Complete Profile
                  </span>
                  <span className="text-gray-500 text-sm">Hi, Insights</span>
                </div>
              </div>
            </div>
          </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Sidebar - Profile Info */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <img
                        src={profileData.profileImage}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {profileData.firstName} {profileData.lastName}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">{profileData.jobTitle}</p>
                    <p className="text-gray-500 text-xs">{profileData.experience}</p>
                  </div>
                </div>

                {/* Profile Completion */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#10b981"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - profileData.profileCompletion / 100)}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-900">
                          {profileData.profileCompletion}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">Profile Matched</p>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                        <p className="text-sm text-gray-900">{profileData.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                        <p className="text-sm text-gray-900">{profileData.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                        <p className="text-sm text-gray-900">{profileData.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">LinkedIn</p>
                        <p className="text-sm text-gray-900">linkedin.com/in/marvin</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  
                  {/* Tab Navigation */}
                  <div className="border-b border-gray-200">
                    <div className="px-6 py-4">
                      <div className="flex space-x-8">
                        <button className="px-4 py-2 text-sm font-medium text-green-600 border-b-2 border-green-600">
                          Personal Details
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                          Career
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                          Skills Interests
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                          Schedule Interview
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    
                    {/* Personal Details Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <p className="text-gray-900">{profileData.firstName} {profileData.lastName}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <p className="text-gray-900">{profileData.gender}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <p className="text-gray-900">{profileData.phone}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <p className="text-gray-900">{profileData.dateOfBirth} ({profileData.age})</p>
                      </div>
                    </div>

                    {/* Cover Letter */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Cover Letter</h3>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {profileData.coverLetter}
                      </p>
                    </div>

                    {/* Recent Experience */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Experience</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {profileData.recentExperience.position}
                        </h4>
                        <p className="text-gray-600 text-sm mb-1">
                          {profileData.recentExperience.company}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {profileData.recentExperience.duration}
                        </p>
                      </div>
                    </div>

                    {/* Two Column Layout for Education and Skills */}
                    <div className="grid grid-cols-2 gap-8">
                      
                      {/* Education */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Education</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {profileData.education.degree}
                          </h4>
                          <p className="text-gray-600 text-sm mb-1">
                            {profileData.education.institution}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {profileData.education.year}
                          </p>
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {profileData.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Resume Section */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Resume</h3>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-600 text-sm mb-2">Upload your resume</p>
                        <button className="text-blue-600 text-sm hover:text-blue-700">
                          Click to browse files
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
            {/* Profile Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex gap-6">
                  <div className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
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

              {/* Skills Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Skills</h3>
                  {!editMode && !showSkillInput && (
                    <button 
                      onClick={handleAddSkill}
                      className="text-wazafny-blue hover:text-wazafny-darkBlue transition-colors text-sm font-medium"
                    >
                      + Add Skill
                    </button>
                  )}
                </div>

                {/* Skill Input Form */}
                {showSkillInput && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-wazafny-blue">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Enter a new skill:
                      </label>
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={handleSkillKeyPress}
                        placeholder="e.g., JavaScript, React, Python..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wazafny-blue focus:border-transparent"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSkillSubmit}
                          disabled={!newSkill.trim()}
                          className="px-4 py-2 bg-wazafny-blue text-white rounded-lg hover:bg-wazafny-darkBlue transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add Skill
                        </button>
                        <button
                          onClick={handleSkillCancel}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">Press Enter to add or Escape to cancel</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
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
                  {editMode && !showSkillInput && (
                    <button 
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors text-sm"
                    >
                      + Add Skill
                    </button>
                  )}
                  {profileData.skills.length === 0 && !showSkillInput && (
                    <p className="text-gray-500 text-sm">No skills added yet. Click "Add Skill" to get started.</p>
                  )}
                </div>
              </div>

              {/* CV Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">CV/Resume</h3>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {profileData.cv ? (
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{profileData.cv.name}</h4>
                        <p className="text-sm text-gray-600">
                          Uploaded: {new Date(profileData.cv.uploadDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Size: {(profileData.cv.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-wazafny-blue text-white rounded-lg hover:bg-wazafny-darkBlue transition-colors text-sm">
                          View
                        </button>
                        <button 
                          onClick={() => setProfileData(prev => ({ ...prev, cv: null }))}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Upload your CV/Resume</h4>
                      <p className="text-gray-600 mb-4">Add your CV to increase your chances of getting hired</p>
                      <label className="inline-block cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleCVUpload}
                          className="hidden"
                        />
                        <span className="px-6 py-3 bg-wazafny-blue text-white rounded-lg hover:bg-wazafny-darkBlue transition-colors font-semibold">
                          Choose File
                        </span>
                      </label>
                      <p className="text-sm text-gray-500 mt-2">Supports PDF, DOC, DOCX (Max 5MB)</p>
                    </div>
                  )}
                </div>
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