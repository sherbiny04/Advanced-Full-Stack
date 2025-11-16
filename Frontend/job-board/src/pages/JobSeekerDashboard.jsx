import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { companiesAPI } from '../services/api';
import ApplicationForm from '../components/ApplicationForm';
import EasyApplyForm from '../components/EasyApplyForm';
import { useTheme } from '../hooks/useTheme';

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const { user, isSeeker } = useAuth();
  const { filteredJobs, applyForJob } = useJobs();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [companies, setCompanies] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showEasyApplyForm, setShowEasyApplyForm] = useState(false);
  const [activeView, setActiveView] = useState('profile'); // 'browse' or 'profile'
  const [showJobSearch, setShowJobSearch] = useState(false); // Show job search within dashboard
  const [selectedJobForDetails, setSelectedJobForDetails] = useState(null); // Selected job in browse view
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'company'
  const { isDarkMode, setTheme } = useTheme();

  const categories = ['All', 'Designer', 'Web Developer', 'Software Engineer', 'Doctors', 'Marketing'];
  const jobTypes = ['All', 'Full Time', 'Part Time', 'Remote', 'Hybrid'];

  useEffect(() => {
    if (!isSeeker()) {
      navigate('/login');
      return;
    }
    fetchCompanies();
  }, [user]);


  const fetchCompanies = async () => {
    try {
      const data = await companiesAPI.getAll();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    // Show the multi-step application form
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = async (applicationData) => {
    try {
      await applyForJob(selectedJob.id, {
        seekerId: user.id,
        jobId: selectedJob.id,
        ...applicationData,
        status: 'pending',
        appliedAt: new Date().toISOString()
      });
      
      setShowApplicationForm(false);
      setShowEasyApplyForm(false);
      setSelectedJob(null);
      
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleCancelApplication = () => {
    setShowApplicationForm(false);
    setShowEasyApplyForm(false);
    setSelectedJob(null);
  };

  const filteredJobsList = filteredJobs.filter(job => {
    const matchesCategory = selectedCategory === 'All' || 
      job.title.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedJobType === 'All' || 
      job.type.toLowerCase().includes(selectedJobType.toLowerCase());
    
    return matchesCategory && matchesSearch && matchesType;
  });

  const themeClasses = {
    pageBg: isDarkMode ? 'bg-slate-950 text-gray-100' : 'bg-gray-50 text-gray-900',
    sidebarBg: isDarkMode ? 'bg-slate-900/80 border-r border-white/10 text-gray-100' : 'bg-white border-r border-gray-100 text-gray-900',
    navText: isDarkMode ? 'text-gray-300 hover:bg-slate-900/40' : 'text-gray-600 hover:bg-gray-50',
    mutedText: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    divider: isDarkMode ? 'border-white/10' : 'border-gray-200'
  };

  const panelClass = isDarkMode
    ? 'bg-[#0f172a]/90 border border-white/10 shadow-[0_30px_80px_rgba(2,6,23,0.7)] text-white'
    : 'bg-white border border-gray-100 shadow-lg text-gray-900';

  const softPanelClass = isDarkMode
    ? 'bg-[#1a2140]/80 border border-white/5 text-white'
    : 'bg-gray-50 border border-gray-100 text-gray-900';

  const chartSurfaceClass = isDarkMode
    ? 'bg-gradient-to-br from-[#1b1533] via-[#111325] to-[#090d19]'
    : 'bg-gradient-to-br from-white to-gray-50';

  const mutedTextClass = isDarkMode ? 'text-slate-400' : 'text-gray-500';
  const softerTextClass = isDarkMode ? 'text-slate-300' : 'text-gray-600';
  const mobileNavClasses = isDarkMode
    ? 'bg-slate-950/85 text-white border-white/10'
    : 'bg-white/85 text-gray-900 border-gray-200';
  const mobileButtonNeutral = isDarkMode
    ? 'bg-transparent border-white/30 text-white'
    : 'bg-transparent border-gray-300 text-gray-900';

  return (
    <>
      <div
        data-theme={isDarkMode ? 'dark' : 'light'}
        className={`dashboard-root min-h-screen flex flex-col lg:flex-row transition-colors duration-500 ${themeClasses.pageBg}`}
      >
      {/* Left Sidebar - Only show in profile view */}
      {activeView === 'profile' && (
        <div className={`hidden lg:flex lg:flex-col w-64 fixed h-full shadow-lg transition-colors duration-500 ${themeClasses.sidebarBg}`}>
          <div className="p-6">
            {/* User Profile Section */}
            <div className={`flex items-center gap-3 mb-8 pb-6 border-b ${themeClasses.divider}`}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-wazafny-blue to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-bold text-lg">{user?.firstName || 'User'} {user?.lastName || ''}</p>
                <p className={`text-xs ${themeClasses.mutedText}`}>{user?.jobTitle || 'Software Engineer'}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={() => {
                  setActiveView('profile');
                  setShowJobSearch(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  !showJobSearch 
                    ? 'bg-gradient-to-r from-wazafny-blue to-purple-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </button>
              <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${themeClasses.navText}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                My Application
              </button>
              <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${themeClasses.navText}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Schedule
              </button>
              <button 
                onClick={() => setShowJobSearch(true)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  showJobSearch 
                    ? 'bg-gradient-to-r from-wazafny-blue to-purple-600 text-white shadow-lg' 
                    : themeClasses.navText
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Job Search
              </button>
              <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${themeClasses.navText}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Explore Companies
              </button>
              <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${themeClasses.navText}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Messages
              </button>
            </nav>

            {/* Theme Toggle */}
            <div className={`mt-6 flex items-center gap-2 rounded-xl p-1 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/40' : 'bg-gray-100'}`}>
              <button
                onClick={() => setTheme(false)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  !isDarkMode
                    ? 'bg-white text-gray-900 shadow-lg'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Light</span>
              </button>
              <button
                onClick={() => setTheme(true)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isDarkMode
                    ? 'bg-slate-900 text-white shadow-inner shadow-black/40'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span>Dark</span>
              </button>
            </div>

            {/* Bottom Section */}
            <div className="absolute bottom-8 left-6 right-6">
              {/* Settings Links */}
              <div className="space-y-2">
                <button className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${themeClasses.navText}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Get Help
                </button>
                <button className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${themeClasses.navText}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  English
                </button>
                <button 
                  onClick={() => {
                    // Add logout logic
                    navigate('/');
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${themeClasses.navText}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile controls */}
      <div className={`lg:hidden w-full border-b ${mobileNavClasses} backdrop-blur-xl sticky top-0 z-30`}>        
        <div className="max-w-5xl mx-auto flex flex-wrap gap-3 items-center justify-between">
          <button
            onClick={() => {
              setActiveView('profile');
              setShowJobSearch(false);
            }}
            className={`flex-1 min-w-[140px] px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${
              !showJobSearch && activeView === 'profile'
                ? 'bg-gradient-to-r from-wazafny-blue to-purple-600 text-white border-transparent shadow-lg'
                : mobileButtonNeutral
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              setActiveView('profile');
              setShowJobSearch(true);
            }}
            className={`flex-1 min-w-[140px] px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${
              showJobSearch && activeView === 'profile'
                ? 'bg-gradient-to-r from-wazafny-blue to-purple-600 text-white border-transparent shadow-lg'
                : mobileButtonNeutral
            }`}
          >
            Job Search
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 w-full ${activeView === 'profile' ? 'lg:ml-64' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* View Toggle Navigation - only show when not in sidebar view */}
          {activeView === 'browse' && (
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setActiveView('browse')}
                  className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-wazafny-blue to-purple-600 text-white shadow-lg"
                >
                  Browse Jobs
                </button>
                <button
                  onClick={() => setActiveView('profile')}
                  className="px-6 py-3 rounded-lg font-semibold bg-white text-gray-600 hover:bg-gray-50"
                >
                  My Dashboard
                </button>
              </div>
            </div>
          )}

        {/* Browse Jobs View */}
        {activeView === 'browse' && (
          <>
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Featured Job Circulars</h1>
              <p className="text-gray-600">Discover your next career opportunity</p>
            </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="etc Search Your Needs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wazafny-blue/20 focus:border-wazafny-blue"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-wazafny-blue to-purple-600 rounded-lg flex items-center justify-center hover:from-blue-700 hover:to-purple-700 transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Job Type Dropdown */}
            <div className="relative min-w-[200px]">
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wazafny-blue/20 focus:border-wazafny-blue appearance-none bg-white cursor-pointer"
              >
                <option value="All">All Job Types</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-sm text-gray-600 font-medium">Popular Categories:</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-wazafny-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Listings Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobsList.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 hover:border-wazafny-blue/30"
                >
                  {/* Job Card Header */}
                  <div className="flex items-start gap-3 mb-4">
                    {/* Company Logo */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-wazafny-blue to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                          {job.company.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Job Title and Company */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1 truncate">{job.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="truncate">{job.company}</span>
                      </div>
                    </div>
                  </div>

                  {/* Job Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Posted 05 Hours Ago</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-wazafny-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span className="font-bold text-wazafny-blue">{job.salary || '$45k-$55k'}</span>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button 
                    onClick={() => handleApplyClick(job)}
                    className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="mt-8 text-center">
              <button className="w-full py-4 bg-gradient-to-r from-wazafny-blue to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm">
                Load More
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Call to Action Card */}
            <div className={`${isDarkMode ? 'bg-gradient-to-br from-[#101424] via-[#161930] to-[#101424] text-white border border-white/10 shadow-[0_30px_80px_rgba(2,6,23,0.7)]' : 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'} rounded-2xl p-8`}>
              <h3 className="text-2xl font-bold mb-3 leading-snug">Your Next Great Hire is Just a Click Away!</h3>
              <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-200'}`}>
                Post your job today and quickly connect with top talent. Our user-friendly platform streamlines hiring, making it easy to find skilled professionals ready to join.
              </p>
              <button className="w-full py-3 bg-gradient-to-r from-wazafny-blue to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg">
                Post Job On Wazafny
              </button>
            </div>

            {/* Featured Company Section */}
            <div className={`${panelClass} rounded-2xl p-6 shadow-lg`}>
              <h3 className="text-xl font-bold mb-6">Featured Company</h3>
              <div className="space-y-4">
                {companies.length > 0 ? companies.slice(0, 5).map((company) => (
                  <div 
                    key={company.id} 
                    onClick={() => navigate(`/company/${company.id}`)}
                    className={`${softPanelClass} flex items-center gap-3 p-3 rounded-xl hover:-translate-y-0.5 transition-all cursor-pointer`}
                  >
                    <div className={`w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 ${isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-gray-50'} flex items-center justify-center`}>
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-wazafny-blue to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                          {company.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">{company.name}</h4>
                      <div className={`flex items-center gap-1 text-sm ${mutedTextClass}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {company.location || 'Remote'}
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className={`${mutedTextClass} text-sm text-center py-4`}>Loading companies...</p>
                )}
              </div>
            </div>
          </div>
        </div>
          </>
        )}

        {/* Profile View */}
        {activeView === 'profile' && (
          <div className="space-y-4">
            {/* Conditional: Show either Job Search or Profile Dashboard */}
            {showJobSearch ? (
              /* Browse Jobs Section */
              <div className={`${panelClass} rounded-2xl shadow-2xl p-6`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-wazafny-blue to-purple-600 bg-clip-text text-transparent">
                    Browse Jobs
                  </h2>
                  <button 
                    onClick={() => setShowJobSearch(false)}
                    className={`px-4 py-2 font-medium ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Back to Dashboard
                  </button>
                </div>

                {/* Search and Filter Section */}
                <div className={`${softPanelClass} rounded-2xl p-6 mb-6`}>
                  <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
                    {/* Search Input */}
                    <div className="flex-1 relative w-full">
                      <input
                        type="text"
                        placeholder="Search your needs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full px-4 py-3 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors ${isDarkMode ? 'bg-[#111524] border border-white/10 text-white placeholder:text-slate-400' : 'border border-gray-200'}`}
                      />
                      <svg className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>

                    {/* Job Type Filter */}
                    <select
                      value={selectedJobType}
                      onChange={(e) => setSelectedJobType(e.target.value)}
                      className={`px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors ${isDarkMode ? 'bg-[#111524] border border-white/10 text-white' : 'border border-gray-200 bg-white'}`}
                    >
                      {jobTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-wazafny-blue to-purple-600 text-white shadow-md'
                            : isDarkMode
                              ? 'bg-white/5 text-gray-200 hover:bg-white/10 border border-white/10'
                              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Two Column Layout: Job List + Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Job Listings */}
                  <div className="lg:col-span-1">
                    <div className={`${panelClass} rounded-2xl shadow-lg overflow-hidden`}>
                      <div className={`overflow-y-auto pr-1 transition-all duration-200 ${
                        selectedJobForDetails ? 'max-h-[720px]' : 'max-h-[600px]'
                      }`}>
                        {filteredJobsList.map(job => (
                          <div
                            key={job.id}
                            onClick={() => setSelectedJobForDetails(job)}
                            className={`p-4 cursor-pointer transition-all duration-200 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'} ${
                              selectedJobForDetails?.id === job.id
                                ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-l-4 border-purple-500'
                                : isDarkMode
                                  ? 'bg-white/5 hover:bg-white/10'
                                  : 'bg-white hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 ${isDarkMode ? 'bg-white/10 border border-white/10' : 'bg-white border border-gray-100'}`}>
                                  {job.companyLogo ? (
                                    <img
                                      src={job.companyLogo}
                                      alt={job.company}
                                      className="w-full h-full object-contain p-1"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-wazafny-blue to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                      {job.company.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-sm truncate">{job.title}</h3>
                                  <p className={`text-xs truncate ${mutedTextClass}`}>{job.company}</p>
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${isDarkMode ? 'bg-purple-500/20 text-purple-200' : 'bg-purple-100 text-purple-700'}`}>
                                {job.type}
                              </span>
                            </div>
                            <div className={`mt-3 flex items-center justify-between gap-2 text-[11px] ${softerTextClass}`}>
                              <div className="flex items-center gap-1 truncate">
                                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="truncate">{job.location}</span>
                              </div>
                              <div className="flex items-center gap-1 font-semibold text-wazafny-blue">
                                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{job.salary}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Job Details */}
                  <div className="lg:col-span-2">
                    {selectedJobForDetails ? (
                      <div className={`${panelClass} rounded-2xl overflow-hidden sticky top-4`}>
                        {/* Company Cover Photo */}
                        <div className="h-32 bg-gradient-to-r from-wazafny-blue to-purple-600 relative">
                          <div className="absolute -bottom-12 left-6">
                            <div className={`w-24 h-24 rounded-2xl overflow-hidden border-4 ${isDarkMode ? 'bg-[#0b1120] border-[#0b1120]' : 'bg-white border-white'} shadow-xl`}>
                              {selectedJobForDetails.companyLogo ? (
                                <img
                                  src={selectedJobForDetails.companyLogo}
                                  alt={selectedJobForDetails.company}
                                  className="w-full h-full object-contain p-2"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-wazafny-blue to-purple-600 flex items-center justify-center text-white font-bold text-3xl">
                                  {selectedJobForDetails.company.charAt(0)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Easy Apply Section */}
                        <div className={`pt-16 px-6 pb-6 border-b ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <h2 className="text-2xl font-bold mb-1">{selectedJobForDetails.title}</h2>
                              <p className={`${mutedTextClass} mb-3`}>{selectedJobForDetails.company}</p>
                              <div className={`flex items-center gap-4 text-sm ${softerTextClass} mb-4`}>
                                <span className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {selectedJobForDetails.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {selectedJobForDetails.type}
                                </span>
                                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-green-500/15 text-green-300' : 'bg-green-100 text-green-700'}`}>
                                  {selectedJobForDetails.salary}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Easy Apply Button */}
                          <button
                            onClick={() => {
                              setSelectedJob(selectedJobForDetails);
                              setShowEasyApplyForm(true);
                            }}
                            className="w-full px-6 py-3 bg-gradient-to-r from-wazafny-blue to-purple-600 text-white rounded-lg font-bold hover:shadow-xl transition-all mb-3"
                          >
                            Easy Apply
                          </button>
                          <p className={`text-xs text-center ${mutedTextClass}`}>Quick application with your profile</p>
                        </div>

                        {/* Job Header with Tabs */}
                        <div className="px-6 pt-4 pb-0">
                          {/* Tabs */}
                          <div className={`flex gap-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                            <button
                              onClick={() => setActiveTab('details')}
                              className={`pb-3 px-2 font-medium transition-all ${
                                activeTab === 'details'
                                  ? 'text-wazafny-blue border-b-2 border-wazafny-blue'
                                  : `${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`
                              }`}
                            >
                              Details
                            </button>
                            <button
                              onClick={() => setActiveTab('company')}
                              className={`pb-3 px-2 font-medium transition-all ${
                                activeTab === 'company'
                                  ? 'text-wazafny-blue border-b-2 border-wazafny-blue'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              Company
                            </button>
                          </div>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 max-h-[400px] overflow-y-auto">
                          {activeTab === 'details' ? (
                            <>
                              {/* Job Description */}
                              <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Job Description</h3>
                                <p className="text-gray-600 leading-relaxed">
                                  {selectedJobForDetails.description || 
                                    "We are looking for a talented professional to join our team. This role offers an excellent opportunity to work on exciting projects and grow your career. The ideal candidate will have strong skills and a passion for excellence."}
                                </p>
                              </div>

                              {/* Requirements */}
                              <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Requirements</h3>
                                <ul className="space-y-2">
                                  <li className="flex items-start gap-2 text-gray-600">
                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Bachelor's degree or equivalent experience
                                  </li>
                                  <li className="flex items-start gap-2 text-gray-600">
                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    3+ years of relevant work experience
                                  </li>
                                  <li className="flex items-start gap-2 text-gray-600">
                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Strong communication and teamwork skills
                                  </li>
                                  <li className="flex items-start gap-2 text-gray-600">
                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Ability to work in a fast-paced environment
                                  </li>
                                </ul>
                              </div>
                            </>
                          ) : (
                            <>
                              {/* Company Info */}
                              <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">About {selectedJobForDetails.company}</h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                  {selectedJobForDetails.company} is a leading company in the industry, committed to innovation and excellence. We provide a dynamic work environment where talented individuals can thrive and make a meaningful impact.
                                </p>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <svg className="w-5 h-5 text-wazafny-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>500+ employees</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <svg className="w-5 h-5 text-wazafny-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span>Technology Industry</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <svg className="w-5 h-5 text-wazafny-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                    <span>www.{selectedJobForDetails.company.toLowerCase().replace(/\s+/g, '')}.com</span>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Apply Buttons */}
                        <div className="p-6 border-t border-gray-200 bg-gray-50">
                          <button
                            onClick={() => {
                              setSelectedJob(selectedJobForDetails);
                              setShowApplicationForm(true);
                            }}
                            className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-all"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Job</h3>
                        <p className="text-gray-600">Click on a job from the list to view details and apply</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Profile Dashboard */
              <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Applications */}
              <div className={`${panelClass} rounded-2xl px-6 py-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer border-l-4 border-orange-400/80`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner shadow-black/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className={`${mutedTextClass} text-[11px] font-semibold uppercase tracking-[0.2em]`}>Total Applications</p>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-orange-400 via-pink-400 to-pink-500 bg-clip-text text-transparent">845</h2>
                  </div>
                </div>
              </div>

              {/* Application Rejected */}
              <div className={`${panelClass} rounded-2xl px-6 py-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer border-l-4 border-pink-500/70`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner shadow-black/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className={`${mutedTextClass} text-[11px] font-semibold uppercase tracking-[0.2em]`}>Application Rejected</p>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">123</h2>
                  </div>
                </div>
              </div>

              {/* Interview Schedule */}
              <div className={`${panelClass} rounded-2xl px-6 py-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer border-l-4 border-purple-500/70`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner shadow-black/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className={`${mutedTextClass} text-[11px] font-semibold uppercase tracking-[0.2em]`}>Interview Schedule</p>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">34</h2>
                  </div>
                </div>
              </div>

              {/* Profile Visited */}
              <div className={`${panelClass} rounded-2xl px-6 py-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer border-l-4 border-emerald-400/80`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner shadow-black/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className={`${mutedTextClass} text-[11px] font-semibold uppercase tracking-[0.2em]`}>Profile Visited</p>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">612</h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Salary Trend Chart */}
              <div className={`${chartSurfaceClass} rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-white/5`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-500"></span>
                    Salary Trend
                  </h3>
                  <select className={`text-xs rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 transition-colors ${isDarkMode ? 'bg-[#1f2233] border border-white/10 text-gray-300 focus:ring-orange-400/30' : 'border border-gray-200 text-gray-700 focus:ring-orange-400/30'}`}>
                    <option>Monthly</option>
                    <option>Weekly</option>
                  </select>
                </div>
                <div className={`h-32 relative rounded-xl overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-[#1a1c2c] via-[#121424] to-[#1c1f33]' : 'bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50'}`}>
                  <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                    <defs>
                      {/* Orange wave gradient */}
                      <linearGradient id="orangeWave" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fb923c" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#fb923c" stopOpacity="0.2" />
                      </linearGradient>
                      {/* Pink wave gradient */}
                      <linearGradient id="pinkWave" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.15" />
                      </linearGradient>
                      {/* Purple wave gradient */}
                      <linearGradient id="purpleWave" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.12" />
                      </linearGradient>
                      {/* Red wave gradient */}
                      <linearGradient id="redWave" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.88" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.18" />
                      </linearGradient>
                    </defs>
                    
                    {/* Large orange wave in background */}
                    <path d="M0,35 Q25,20 50,28 T100,22 T150,30 T200,24 L200,80 L0,80 Z" 
                          fill="url(#orangeWave)">
                      <animate attributeName="d" 
                               dur="10s" 
                               repeatCount="indefinite"
                               values="M0,35 Q25,20 50,28 T100,22 T150,30 T200,24 L200,80 L0,80 Z;
                                       M0,32 Q25,18 50,25 T100,20 T150,27 T200,22 L200,80 L0,80 Z;
                                       M0,35 Q25,20 50,28 T100,22 T150,30 T200,24 L200,80 L0,80 Z"/>
                    </path>
                    
                    {/* Pink wave flowing through */}
                    <path d="M0,42 Q20,28 40,35 T80,30 T120,38 T160,32 T200,36 L200,80 L0,80 Z" 
                          fill="url(#pinkWave)">
                      <animate attributeName="d" 
                               dur="12s" 
                               repeatCount="indefinite"
                               values="M0,42 Q20,28 40,35 T80,30 T120,38 T160,32 T200,36 L200,80 L0,80 Z;
                                       M0,38 Q20,25 40,32 T80,28 T120,35 T160,30 T200,34 L200,80 L0,80 Z;
                                       M0,42 Q20,28 40,35 T80,30 T120,38 T160,32 T200,36 L200,80 L0,80 Z"/>
                    </path>
                    
                    {/* Purple wave overlay */}
                    <path d="M0,28 Q30,15 60,22 T120,18 T180,24 T200,20 L200,80 L0,80 Z" 
                          fill="url(#purpleWave)">
                      <animate attributeName="d" 
                               dur="14s" 
                               repeatCount="indefinite"
                               values="M0,28 Q30,15 60,22 T120,18 T180,24 T200,20 L200,80 L0,80 Z;
                                       M0,25 Q30,12 60,20 T120,16 T180,22 T200,18 L200,80 L0,80 Z;
                                       M0,28 Q30,15 60,22 T120,18 T180,24 T200,20 L200,80 L0,80 Z"/>
                    </path>
                    
                    {/* Red/coral accent wave */}
                    <path d="M0,48 Q18,35 36,40 T72,36 T108,42 T144,38 T180,44 T200,40 L200,80 L0,80 Z" 
                          fill="url(#redWave)">
                      <animate attributeName="d" 
                               dur="16s" 
                               repeatCount="indefinite"
                               values="M0,48 Q18,35 36,40 T72,36 T108,42 T144,38 T180,44 T200,40 L200,80 L0,80 Z;
                                       M0,45 Q18,32 36,38 T72,34 T108,40 T144,36 T180,42 T200,38 L200,80 L0,80 Z;
                                       M0,48 Q18,35 36,40 T72,36 T108,42 T144,38 T180,44 T200,40 L200,80 L0,80 Z"/>
                    </path>
                    
                    {/* Timeline with dots */}
                    <line x1="0" y1="40" x2="200" y2="40" stroke="gray" strokeWidth="0.5" opacity="0.3"/>
                    {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200].map((x, i) => (
                      <circle key={i} cx={x} cy="40" r="1.2" fill="gray" opacity="0.4"/>
                    ))}
                  </svg>
                  
                  {/* Timeline labels */}
                  <div className={`absolute bottom-1 left-0 right-0 flex justify-between px-1 text-[8px] font-medium ${mutedTextClass}`}>
                    <span>0</span>
                    <span>20</span>
                    <span>40</span>
                    <span>60</span>
                    <span>80</span>
                    <span>100</span>
                    <span>120</span>
                    <span>140</span>
                    <span>160</span>
                    <span>180</span>
                    <span>200</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-500"></div>
                    <span className={`text-xs ${softerTextClass}`}>Application Sent</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-400"></div>
                    <span className={`text-xs ${softerTextClass}`}>Interview</span>
                  </div>
                </div>
              </div>

              {/* Profile Views Chart */}
              <div className={`${chartSurfaceClass} rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-white/5`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-500"></span>
                    Profile Views
                  </h3>
                  <select className={`text-xs rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 transition-colors ${isDarkMode ? 'bg-[#1f2233] border border-white/10 text-gray-300 focus:ring-pink-400/30' : 'border border-gray-200 text-gray-700 focus:ring-pink-400/30'}`}>
                    <option>Monthly</option>
                  </select>
                </div>
                <div className={`h-32 flex items-end justify-between gap-1 rounded-xl p-3 ${isDarkMode ? 'bg-gradient-to-br from-[#1e1424] via-[#2a152d] to-[#1f0f22]' : 'bg-gradient-to-br from-pink-50 to-rose-50'}`}>
                  {[40, 55, 35, 60, 75, 45, 70, 50, 80, 55, 75, 65].map((height, i) => (
                    <div 
                      key={i}
                      className={`flex-1 rounded-t-lg relative group cursor-pointer transition-all hover:scale-105 shadow-sm ${
                        i % 2 === 0 
                          ? 'bg-gradient-to-t from-pink-500 via-pink-600 to-pink-700 hover:from-pink-600 hover:to-pink-800' 
                          : 'bg-gradient-to-t from-rose-300 via-rose-400 to-rose-400 hover:from-rose-400 hover:to-rose-500'
                      }`}
                      style={{height: `${height}%`}}
                    >
                      {i === 4 && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap shadow-lg font-bold">24,892</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-700"></div>
                    <span className={`text-xs ${softerTextClass}`}>Recruiter</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-rose-300 to-rose-400"></div>
                    <span className={`text-xs ${softerTextClass}`}>User</span>
                  </div>
                </div>
              </div>

              {/* Application Status Chart - Third Container */}
              <div className={`${chartSurfaceClass} rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-white/5`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500"></span>
                    Salary Trend
                  </h3>
                  <div className="flex items-center gap-1">
                    <select className={`text-xs rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 transition-colors ${isDarkMode ? 'bg-[#1f2233] border border-white/10 text-gray-300 focus:ring-purple-400/30' : 'border border-gray-200 text-gray-700 focus:ring-purple-400/30'}`}>
                      <option>2027</option>
                      <option>2026</option>
                      <option>2025</option>
                    </select>
                    <select className={`text-xs rounded-lg px-2 py-0.5 focus:outline-none transition-colors ${isDarkMode ? 'bg-[#1f2233] border border-white/10 text-gray-300' : 'border border-gray-200 text-gray-700'}`}>
                      <option>Monthly</option>
                      <option>Weekly</option>
                    </select>
                  </div>
                </div>
                <div className={`h-32 flex items-end justify-between gap-1 rounded-xl p-3 ${isDarkMode ? 'bg-gradient-to-br from-[#1b1230] via-[#201833] to-[#1b0f2a]' : 'bg-gradient-to-br from-purple-50 to-pink-50'}`}>
                  <div className="flex-1 flex items-end justify-center bg-gradient-to-t from-purple-400 to-purple-500 rounded-t-lg" style={{height: '45%'}}></div>
                  <div className="flex-1 flex items-end justify-center bg-gradient-to-t from-purple-400 to-purple-500 rounded-t-lg" style={{height: '55%'}}></div>
                  <div className="flex-1 flex items-end justify-center bg-gradient-to-t from-purple-400 to-purple-500 rounded-t-lg" style={{height: '70%'}}></div>
                  <div className="flex-1 flex items-end justify-center bg-gradient-to-t from-purple-400 to-purple-500 rounded-t-lg" style={{height: '50%'}}></div>
                  <div className="flex-1 flex items-end justify-center bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg relative" style={{height: '85%'}}>
                    <div className="absolute -top-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">$4,892</div>
                  </div>
                  <div className="flex-1 flex items-end justify-center bg-gradient-to-t from-purple-400 to-purple-500 rounded-t-lg" style={{height: '60%'}}></div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Column - Profile & Portfolio */}
              <div className="space-y-4">
                {/* User Profile Card */}
                <div className={`${panelClass} rounded-2xl p-5 shadow-xl transition-all duration-300`}>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-wazafny-blue to-purple-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white/10">
                      {user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl leading-tight">{user?.firstName || 'User'} {user?.lastName || ''}</h3>
                      <p className={`text-xs flex items-center gap-1 ${mutedTextClass}`}>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                        </svg>
                        {user?.jobTitle || 'Software Engineer'}
                      </p>
                      <button className="mt-3 text-xs text-white bg-gradient-to-r from-wazafny-blue to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-1.5 rounded-lg flex items-center gap-1 transition-all shadow-lg">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {[{
                      label: 'Experience',
                      value: user?.experience || '10+ years'
                    }, {
                      label: 'Work Level',
                      value: 'Expert'
                    }, {
                      label: 'Projects',
                      value: '450+'
                    }, {
                      label: 'Completed',
                      value: '700+'
                    }].map((item, idx) => (
                      <div key={idx} className={`${softPanelClass} rounded-xl p-3`}> 
                        <p className={`text-[11px] uppercase tracking-[0.2em] ${mutedTextClass}`}>{item.label}</p>
                        <p className="font-semibold text-base">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-sm">Skills</h4>
                      <button className={`text-sm ${mutedTextClass}`}>+</button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(user?.skills || ['Node.js', 'Bootstrap', 'Angular.JS', 'Python', 'React', 'Laravel']).slice(0, 6).map((skill, i) => (
                        <span 
                          key={i} 
                          className={`px-2 py-1 rounded-lg text-xs font-medium border ${isDarkMode ? 'bg-white/5 text-white border-white/10' : 'bg-purple-50 text-purple-600 border-purple-100'}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Portfolio */}
                <div className={`${panelClass} rounded-2xl p-5 shadow-lg`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-sm">Portfolio</h4>
                    <button className={`text-sm ${mutedTextClass}`}>+</button>
                  </div>
                  <div className="space-y-3">
                    {[{ title: 'My Portfolio 03', size: 'PDF · 10 MB' }, { title: 'Recent Century Portfolio', size: 'PDF · 23 MB' }].map((item) => (
                      <div key={item.title} className={`${softPanelClass} rounded-xl p-3 flex items-center gap-3 hover:-translate-y-0.5 transition-transform cursor-pointer`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isDarkMode ? 'bg-white/10' : 'bg-red-100'}`}>
                          <svg className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-sm truncate">{item.title}</h5>
                          <p className={`text-xs ${softerTextClass}`}>{item.size}</p>
                        </div>
                        <svg className={`w-4 h-4 ${mutedTextClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Column - Experience & Interviews */}
              <div className="space-y-4">
                {/* Experience */}
                <div className={`${panelClass} rounded-2xl p-5 shadow-lg`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-sm">Experience</h4>
                    <button className={`text-sm ${mutedTextClass}`}>+</button>
                  </div>
                  <div className="space-y-3">
                    {[{
                      role: 'Lead Software Engineer',
                      company: 'Invormation Technology Inc.',
                      duration: 'Sep 2024 - Present'
                    }, {
                      role: 'Software Engineer',
                      company: 'Precision Bytes',
                      duration: 'Aug 2021 - Aug 2024'
                    }, {
                      role: 'Software Engineer',
                      company: 'Logic Line Innovations',
                      duration: 'Jan 2011 - Apr 2021'
                    }].map((job) => (
                      <div key={job.role} className={`${softPanelClass} rounded-xl p-3`}> 
                        <h5 className="font-semibold text-sm">{job.role}</h5>
                        <p className={`text-xs ${softerTextClass}`}>{job.company}</p>
                        <p className={`text-[11px] ${mutedTextClass}`}>{job.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Interview */}
                <div className={`${panelClass} rounded-2xl p-5 shadow-lg`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-sm">Upcoming Interview</h4>
                    <button className={`text-sm ${mutedTextClass}`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-center mb-4">
                    <p className={`text-xs ${mutedTextClass}`}>Today Sep 20, 2027</p>
                  </div>
                  <div className="space-y-3">
                    {[{
                      name: 'Brielle Dionne',
                      company: 'Innovate Logic',
                      time: '09:00',
                      gradient: 'from-pink-400 to-purple-400'
                    }, {
                      name: 'Jeff Tanako',
                      company: 'Data Doves',
                      time: '07:00',
                      gradient: 'from-blue-400 to-cyan-400'
                    }].map((event) => (
                      <div key={event.name} className={`${softPanelClass} rounded-xl p-3 flex items-center gap-3`}>
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${event.gradient} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                          {event.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-sm truncate">{event.name}</h5>
                          <p className={`text-xs ${softerTextClass}`}>{event.company}</p>
                        </div>
                        <span className={`text-xs font-medium ${mutedTextClass} flex-shrink-0`}>{event.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Application History */}
              <div className="space-y-4">
                {/* Application History */}
                <div className={`${panelClass} rounded-2xl p-5 shadow-lg`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-sm">Application History</h4>
                    <select className={`text-xs rounded-lg px-2 py-0.5 focus:outline-none ${isDarkMode ? 'bg-[#1f2233] border border-white/10 text-gray-300' : 'border border-gray-200 text-gray-700'}`}>
                      <option>Last 24h</option>
                      <option>Last Week</option>
                      <option>Last Month</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    {[{
                      title: 'Product Designer',
                      subtitle: 'Google Inc • Irvine, CA',
                      status: 'In Review',
                      statusClass: 'bg-blue-500/20 text-blue-300',
                      border: 'border-blue-500'
                    }, {
                      title: 'Finance Manager',
                      subtitle: 'Vacant Land • LA, CA',
                      status: 'Decline',
                      statusClass: 'bg-red-500/15 text-red-300',
                      border: 'border-red-500'
                    }, {
                      title: 'Product Designer',
                      subtitle: 'Complex Studio • San Diego',
                      status: 'Decline',
                      statusClass: 'bg-red-500/15 text-red-300',
                      border: 'border-red-500'
                    }].map((item) => (
                      <div key={item.title + item.subtitle} className={`${softPanelClass} rounded-xl p-3 flex items-center gap-3 border-l-4 ${item.border}`}>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-wazafny-blue to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {item.title.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-sm truncate">{item.title}</h5>
                          <p className={`text-xs truncate ${softerTextClass}`}>{item.subtitle}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${item.statusClass}`}>{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
    </div>

    {/* Application Forms */}
    {showApplicationForm && selectedJob && (
      <ApplicationForm
        job={selectedJob}
        onSubmit={handleApplicationSubmit}
        onCancel={handleCancelApplication}
      />
    )}

    {showEasyApplyForm && selectedJob && (
      <EasyApplyForm
        job={selectedJob}
        user={user}
        onSubmit={handleApplicationSubmit}
        onCancel={handleCancelApplication}
      />
    )}
    </>
  );
};

export default JobSeekerDashboard;
