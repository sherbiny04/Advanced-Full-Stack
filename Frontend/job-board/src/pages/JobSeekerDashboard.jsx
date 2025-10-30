import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import ApplicationForm from '../components/ApplicationForm';
import EasyApplyForm from '../components/EasyApplyForm';

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const { user, isSeeker, updateUser } = useAuth();
  const { getApplicationsBySeekerId, getJobById, filteredJobs, applyForJob } = useJobs();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('browse'); // 'profile' or 'browse'
  const [selectedJob, setSelectedJob] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    linkedIn: '',
    location: '',
    dateOfBirth: '',
    age: '',
    jobTitle: '',
    experience: '',
    profileImage: '',
    coverLetter: '',
    recentExperience: {
      position: '',
      company: '',
      duration: ''
    },
    education: {
      degree: '',
      institution: '',
      year: ''
    },
    skills: [],
    city: '',
    country: ''
  });

  // Application form state - replaced with new multi-step form
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  // Easy Apply form state (simple form)
  const [showEasyApplyForm, setShowEasyApplyForm] = useState(false);
  
  // Keep old state for compatibility with existing modal
  const [applicationForm, setApplicationForm] = useState({
    whyInterested: '',
    goodFit: '',
    expectedSalary: '',
    availability: 'Immediately'
  });
  
  // Filter states for browse view
  const [filters, setFilters] = useState({
    keywords: '',
    location: '',
    salaryRange: 35000,
    distance: 35
  });

  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (!isSeeker()) {
      navigate('/login');
      return;
    }
    loadApplications();
    initializeProfileData();
  }, [user]);

  const initializeProfileData = () => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        linkedIn: user.linkedIn || '',
        location: user.location || (user.city && user.country ? `${user.city}, ${user.country}` : ''),
        dateOfBirth: user.dateOfBirth || '',
        age: user.age || '',
        jobTitle: user.jobTitle || '',
        experience: user.experience || '',
        profileImage: user.profileImage || '',
        coverLetter: user.coverLetter || '',
        recentExperience: user.recentExperience || {
          position: '',
          company: '',
          duration: ''
        },
        education: user.education || {
          degree: '',
          institution: '',
          year: ''
        },
        skills: user.skills || [],
        city: user.city || '',
        country: user.country || ''
      });
    }
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

  const handleProfileUpdate = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedUpdate = (parent, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleSkillAdd = () => {
    if (newSkill && !profileData.skills.includes(newSkill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
      setNewSkill('');
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const result = await updateUser(user.id, profileData);
    setSaving(false);
    
    if (result.success) {
      setEditMode(false);
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile: ' + result.error);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    initializeProfileData();
  };

  // Image upload handler (reads file as data URL and stores in profileData)
  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert('Image file size must be less than 5MB');
      e.target.value = ''; // Reset input
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      e.target.value = ''; // Reset input
      return;
    }
    
    setImageLoading(true);
    
    // Create immediate preview URL for instant feedback
    const previewUrl = URL.createObjectURL(file);
    handleProfileUpdate('profileImage', previewUrl);
    
    // Also process the file for data URL (for persistence)
    const reader = new FileReader();
    reader.onload = () => {
      // Replace the object URL with data URL for proper storage
      handleProfileUpdate('profileImage', reader.result);
      // Clean up the object URL to prevent memory leaks
      URL.revokeObjectURL(previewUrl);
      setImageLoading(false);
    };
    reader.onerror = () => {
      alert('Error reading the image file. Please try again.');
      // Revert to previous image on error
      handleProfileUpdate('profileImage', profileData.profileImage || '');
      URL.revokeObjectURL(previewUrl);
      setImageLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProfileImage = () => {
    handleProfileUpdate('profileImage', '');
  };



  const calculateProfileCompletion = () => {
    const fields = [
      profileData.firstName,
      profileData.lastName,
      profileData.email,
      profileData.phone,
      profileData.address,
      profileData.location,
      profileData.dateOfBirth,
      profileData.jobTitle,
      profileData.coverLetter,
      profileData.recentExperience.position,
      profileData.education.degree,
      profileData.skills.length > 0
    ];
    const completed = fields.filter(field => field).length;
    return Math.round((completed / fields.length) * 100);
  };

  const handleApplicationSubmit = async (formData) => {
    const applicationData = {
      jobId: selectedJob.id,
      seekerId: user.id,
      status: 'pending',
      appliedDate: new Date().toISOString(),
      // New application data structure
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      yearsOfExperience: formData.yearsOfExperience,
      relevantSkills: formData.relevantSkills,
      keyAchievements: formData.keyAchievements,
      motivationLetter: formData.motivationLetter,
      availability: formData.availability,
      noticePeriod: formData.noticePeriod,
      seekerName: user.name,
      seekerEmail: user.email
    };

    const result = await applyForJob(applicationData);
    
    if (result.success) {
      alert('Application submitted successfully!');
      setShowApplicationForm(false);
      setSelectedJob(null);
      loadApplications();
    } else {
      alert('Failed to submit application: ' + result.error);
    }
  };

  const handleEasyApplySubmit = async (formData) => {
    const applicationData = {
      jobId: selectedJob.id,
      seekerId: user.id,
      status: 'pending',
      appliedDate: new Date().toISOString(),
      applicationType: 'easy_apply',
      // Easy apply data structure
      firstName: formData.firstName,
      profession: formData.profession,
      email: formData.email,
      phone: formData.phone,
      cv: formData.cv ? formData.cv.name : null,
      seekerName: user.name,
      seekerEmail: user.email
    };

    const result = await applyForJob(applicationData);
    
    if (result.success) {
      alert('Easy application submitted successfully!');
      setShowEasyApplyForm(false);
      setSelectedJob(null);
      loadApplications();
    } else {
      alert('Failed to submit easy application: ' + result.error);
    }
  };

  const filteredJobsList = filteredJobs.filter(job => {
    const matchesKeywords = !filters.keywords || 
      job.title.toLowerCase().includes(filters.keywords.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.keywords.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.keywords.toLowerCase());
    
    const matchesLocation = !filters.location || 
      job.location.toLowerCase().includes(filters.location.toLowerCase());
    
    // Extract salary number from job.salary string (e.g., "$120,000 - $180,000")
    const matchesSalary = !job.salary || (() => {
      const salaryNumbers = job.salary.match(/\d+,?\d*/g);
      if (!salaryNumbers || salaryNumbers.length === 0) return true;
      const minSalary = parseInt(salaryNumbers[0].replace(/,/g, ''));
      return minSalary >= filters.salaryRange;
    })();
    
    return matchesKeywords && matchesLocation && matchesSalary;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* View Toggle */}
      <div className="bg-white/50 backdrop-blur-lg shadow-md border-b border-purple-200/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-center">
            <div className="flex gap-4 bg-gray-100 rounded-full p-2">
              <button
                onClick={() => setView('profile')}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  view === 'profile'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-blue-600 hover:bg-blue-600 hover:text-white'
                }`}
              >
                Profile Dashboard
              </button>
              <button
                onClick={() => setView('browse')}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  view === 'browse'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-blue-600 hover:bg-blue-600 hover:text-white'
                }`}
              >
                Browse Jobs
              </button>
            </div>
          </div>
        </div>
      </div>

      {view === 'browse' ? (
  /* BROWSE JOBS VIEW - Enhanced Modern Design */
  <div className="w-full px-4 py-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 min-h-screen">
          <div className="flex gap-4 h-[calc(100vh-120px)]">
            
            {/* Left Sidebar - Profile & Filters (~20%) */}
            <div className="w-64 flex-shrink-0 sticky top-4 h-full transform transition-all duration-300 ease-in-out">
              <div className="bg-white/40 backdrop-blur-lg rounded-xl shadow-xl border border-purple-200/40 p-4 overflow-y-auto pb-4 h-full hover:shadow-2xl hover:bg-white/60 transition-all duration-300">
                
                {/* Profile Section - Enhanced Design */}
                <div className="flex items-center gap-3 mb-6 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white transform hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => setView('profile')}>
                  {profileData.profileImage ? (
                    <img
                      src={profileData.profileImage}
                      alt={user?.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/30 shadow-md"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center shadow-md">
                      <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-sm mb-1">
                      {profileData.firstName && profileData.lastName 
                        ? `${profileData.firstName} ${profileData.lastName}`
                        : user?.name || 'Complete your profile'}
                    </h3>
                    <p className="text-white/80 text-xs flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Profile
                    </p>
                  </div>
                </div>

                {/* Keywords Filter - Enhanced Design */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    Keywords
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g., Designer, Developer"
                      value={filters.keywords}
                      onChange={(e) => setFilters({...filters, keywords: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                    />
                    <div className="absolute right-2 top-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Location Filter - Enhanced Design */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-md flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g., New York, Remote"
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                    />
                    <div className="absolute right-2 top-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Salary Range - Enhanced Design */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-md flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    Salary Range
                  </label>
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-3 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-emerald-600 font-bold text-sm">$</span>
                      <input
                        type="range"
                        min="0"
                        max="200000"
                        step="5000"
                        value={filters.salaryRange}
                        onChange={(e) => setFilters({...filters, salaryRange: parseInt(e.target.value)})}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #10b981 0%, #10b981 ${(filters.salaryRange / 200000) * 100}%, #e5e7eb ${(filters.salaryRange / 200000) * 100}%, #e5e7eb 100%)`
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-emerald-700">$0</span>
                      <span className="text-sm font-bold text-emerald-600 bg-white px-2 py-1 rounded shadow-sm">
                        ${filters.salaryRange.toLocaleString()}+
                      </span>
                      <span className="text-xs text-emerald-700">$200k</span>
                    </div>
                  </div>
                </div>

                {/* Distance - Enhanced Design */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-md flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    Distance
                  </label>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={filters.distance}
                        onChange={(e) => setFilters({...filters, distance: parseInt(e.target.value)})}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #f97316 0%, #f97316 ${filters.distance}%, #e5e7eb ${filters.distance}%, #e5e7eb 100%)`
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-orange-700">0 Miles</span>
                      <span className="text-sm font-bold text-orange-600 bg-white px-2 py-1 rounded shadow-sm">
                        {filters.distance} Miles
                      </span>
                      <span className="text-xs text-orange-700">100+ Miles</span>
                    </div>
                  </div>
                </div>

                {/* Work Type Checkboxes - Enhanced Design */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-md flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    Work Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 cursor-pointer group">
                      <input type="checkbox" className="w-3 h-3 text-blue-600 rounded" />
                      <span className="text-xs font-medium text-blue-700">Remote</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 cursor-pointer group">
                      <input type="checkbox" defaultChecked className="w-3 h-3 text-green-600 rounded" />
                      <span className="text-xs font-medium text-green-700">Hybrid</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200 hover:from-orange-100 hover:to-red-100 transition-all duration-200 cursor-pointer group">
                      <input type="checkbox" className="w-3 h-3 text-orange-600 rounded" />
                      <span className="text-xs font-medium text-orange-700">On-site</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 hover:from-purple-100 hover:to-indigo-100 transition-all duration-200 cursor-pointer group">
                      <input type="checkbox" className="w-3 h-3 text-purple-600 rounded" />
                      <span className="text-xs font-medium text-purple-700">Full time</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200 hover:from-teal-100 hover:to-cyan-100 transition-all duration-200 cursor-pointer group">
                      <input type="checkbox" className="w-3 h-3 text-teal-600 rounded" />
                      <span className="text-xs font-medium text-teal-700">Part time</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200 hover:from-pink-100 hover:to-rose-100 transition-all duration-200 cursor-pointer group">
                      <input type="checkbox" className="w-3 h-3 text-pink-600 rounded" />
                      <span className="text-xs font-medium text-pink-700">Contract</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Listings - Split into Two Cards */}
            <div className={`flex-1 ${selectedJob ? 'max-w-md' : ''} transition-all duration-500 ease-in-out flex flex-col gap-4 h-full`}>
              
              {/* Search Header Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <div className="p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl">
                  <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                      </svg>
                    </div>
                    Discover Your Next Role
                  </h2>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <svg className="w-4 h-4 absolute left-3 top-2.5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search jobs..."
                        value={filters.keywords}
                        onChange={(e) => setFilters({...filters, keywords: e.target.value})}
                        className="w-full pl-10 pr-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-white placeholder-white/60 text-sm transition-all duration-300"
                      />
                    </div>
                    <div className="relative">
                      <svg className="w-4 h-4 absolute left-3 top-2.5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Location"
                        value={filters.location}
                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                        className="w-32 pl-10 pr-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-white placeholder-white/60 text-sm transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-white/80 text-sm font-medium flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      {filteredJobsList.length} jobs
                    </p>
                    <div className="flex gap-1">
                      <button className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-all duration-200 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                        </svg>
                        Sort
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job List Card */}
              <div className="bg-white/40 backdrop-blur-lg rounded-xl shadow-xl border border-purple-200/40 flex-1 min-h-0 hover:shadow-2xl hover:bg-white/60 transition-all duration-300">
                <div className="h-full overflow-y-auto p-4">
                  <div className="space-y-3">
                    {filteredJobsList.map((job, index) => (
                      <div
                        key={job.id}
                        className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 ease-out transform hover:scale-[1.01] ${
                          selectedJob?.id === job.id 
                            ? 'bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border-2 border-blue-400 shadow-lg ring-2 ring-blue-500/20' 
                            : 'bg-white/70 backdrop-blur-sm border border-gray-200/50 hover:border-blue-300 hover:shadow-md hover:bg-white/90'
                        }`}
                        onClick={() => setSelectedJob(job)}
                      >
                        {/* Animated background gradient on hover */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-indigo-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative flex gap-3">
                          {/* Company Logo with enhanced styling */}
                          <div className="relative">
                            <div className="w-12 h-12 bg-white rounded-lg shadow-md p-2 ring-1 ring-gray-200 group-hover:ring-blue-300 transition-all duration-300">
                              <img
                                src={job.companyLogo}
                                alt={job.company}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            {/* Notification dot for new jobs */}
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0 space-y-2">
                            {/* Job Title with enhanced styling */}
                            <div className="flex items-start justify-between">
                              <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                                {job.title}
                              </h3>
                              <button className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 hover:bg-blue-100 rounded-lg">
                                <svg className="w-5 h-5 text-gray-400 hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              </button>
                            </div>
                            
                            {/* Company and Location */}
                            <div className="flex items-center gap-3 text-sm">
                              <span className="font-semibold text-gray-700 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                {job.company}
                              </span>
                              <span className="text-gray-500 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {job.location}
                              </span>
                              <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs font-medium">
                                {job.type}
                              </span>
                            </div>
                            
                            {/* Salary with enhanced styling */}
                            {job.salary && (
                              <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg w-fit">
                                <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                <span className="font-bold text-emerald-700 text-sm">{job.salary}</span>
                              </div>
                            )}
                            
                            {/* Status indicators */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                  Actively hiring
                                </span>
                                <span className="text-xs text-gray-400">1w ago</span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                                  100+ applicants
                                </span>
                                {selectedJob?.id === job.id && (
                                  <div className="flex items-center gap-1 text-blue-600 text-xs font-medium animate-pulse">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    Viewing
                                  </div>
                                )}
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

            {/* Right Section - Job Details & Application with Smooth Animations */}
            {selectedJob && (
              <div className="flex-1 transform transition-all duration-500 ease-out animate-in slide-in-from-right h-full">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 h-full overflow-y-auto">
                  {/* Company Office Image Header with Parallax Effect */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop"
                      alt="Office"
                      className="w-full h-full object-cover opacity-70 hover:opacity-80 transition-opacity duration-500 hover:scale-110 transform duration-700"
                    />
                    
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    
                    {/* Floating action buttons */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => setSelectedJob(null)}
                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-2 text-white hover:text-white shadow-lg transition-all duration-300 hover:scale-110"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-2 text-white hover:text-white shadow-lg transition-all duration-300 hover:scale-110">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Job status badge */}
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-2 bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full shadow-lg">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold">Recently Posted</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    {/* Job Header with Logo - Enhanced Design */}
                    <div className="flex items-start gap-6 mb-8 -mt-16">
                      <div className="relative">
                        <div className="bg-white rounded-xl p-3 shadow-xl ring-2 ring-white/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                          <img
                            src={selectedJob.companyLogo}
                            alt={selectedJob.company}
                            className="w-16 h-16 object-contain"
                          />
                        </div>
                        {/* Company verification badge */}
                        <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2 shadow-lg">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 mt-16 space-y-3">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-bold text-gray-900 leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {selectedJob.title}
                          </h2>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-2 text-blue-600 font-bold text-base">
                              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                              {selectedJob.company}
                            </span>
                            <div className="flex items-center gap-2 text-gray-600">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              <span className="font-medium text-sm">{selectedJob.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quick stats */}
                        <div className="flex gap-2">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                            <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-green-700 font-semibold text-xs">Posted 2 days ago</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
                            <svg className="w-3.5 h-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-orange-700 font-semibold text-xs">120+ Applied</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Enhanced Design */}
                    <div className="flex gap-3 mb-6">
                      <button 
                        onClick={() => setShowEasyApplyForm(true)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Easy Apply
                        <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                      <button className="px-6 py-3 border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:bg-blue-50 hover:shadow-lg hover:scale-105">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Save Job
                      </button>
                      <button className="px-4 py-3 border-2 border-gray-300 hover:border-emerald-500 text-gray-700 hover:text-emerald-600 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:bg-emerald-50 hover:shadow-lg hover:scale-105">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </button>
                    </div>

                    {/* Job Type Badges - Enhanced Design */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-4 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs rounded-full font-semibold border border-blue-300 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {selectedJob.type}
                      </span>
                      <span className="px-4 py-1.5 bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 text-xs rounded-full font-semibold border border-green-300 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {selectedJob.remote ? 'Remote Friendly' : 'On-site'}
                      </span>
                      <span className="px-4 py-1.5 bg-gradient-to-r from-purple-100 to-indigo-200 text-purple-800 text-xs rounded-full font-semibold border border-purple-300 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Fast Apply
                      </span>
                    </div>

                    {/* Profile Match Section - Enhanced Design */}
                    <div className="relative bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-6 mb-8 overflow-hidden">
                      {/* Background pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 right-4 w-20 h-20 bg-orange-300 rounded-full"></div>
                        <div className="absolute bottom-4 left-4 w-12 h-12 bg-yellow-300 rounded-full"></div>
                      </div>
                      
                      <div className="relative flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg mb-2">
                            ⚡ Great Profile Match!
                          </h4>
                          <p className="text-gray-700 mb-3">
                            Your skills and experience align well with this role's requirements. You're in the top 15% of candidates.
                          </p>
                          <button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                            View Match Details
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Job Description Section - Enhanced Design */}
                    <div className="mb-8">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Job Description</h3>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 rounded-2xl p-6 border-2 border-gray-200/50 hover:border-blue-300/50 transition-all duration-300">
                        <p className="text-gray-700 leading-relaxed text-base">
                          {selectedJob.description || 'We are looking for a passionate and experienced professional to join our dynamic team. This role offers exciting opportunities for growth and innovation in a collaborative environment where your skills will make a real impact.'}
                        </p>
                      </div>
                    </div>

                    {/* Job Requirements Section - Enhanced Design */}
                    {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                      <div className="mb-8">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900">Requirements & Qualifications</h3>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 via-pink-50/30 to-indigo-50/20 rounded-2xl p-6 border-2 border-purple-200/50 hover:border-purple-300/50 transition-all duration-300">
                          <ul className="space-y-4">
                            {selectedJob.requirements.map((requirement, index) => (
                              <li key={index} className="group">
                                <span className="text-gray-700 font-medium leading-relaxed group-hover:text-gray-900 transition-colors duration-200">• {requirement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Job Benefits Section - Enhanced Design */}
                    {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                      <div className="mb-8">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900">Benefits & Perks</h3>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-50 via-teal-50/30 to-green-50/20 rounded-2xl p-6 border-2 border-emerald-200/50 hover:border-emerald-300/50 transition-all duration-300">
                          <div className="grid grid-cols-1 gap-4">
                            {selectedJob.benefits.map((benefit, index) => (
                              <div key={index} className="p-4 bg-white/70 rounded-xl hover:bg-white/90 transition-all duration-200 group border border-emerald-200/30">
                                <span className="text-gray-800 font-semibold leading-relaxed group-hover:text-emerald-700 transition-colors duration-200">• {benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Salary Information - Enhanced Design */}
                    {selectedJob.salary && (
                      <div className="mb-8">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900">Compensation Package</h3>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50/20 rounded-2xl p-6 border-2 border-green-200/50 hover:border-green-300/50 transition-all duration-300">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-2xl font-bold text-green-700 mb-1">{selectedJob.salary}</p>
                              <p className="text-green-600 text-sm font-medium">Annual Base Salary</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-green-600 font-medium">Competitive Package</p>
                              <p className="text-xs text-green-500">+ Benefits & Bonuses</p>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <span className="px-3 py-1 bg-green-200/50 text-green-700 text-xs rounded-full font-medium">
                              Health Insurance
                            </span>
                            <span className="px-3 py-1 bg-blue-200/50 text-blue-700 text-xs rounded-full font-medium">
                              401(k) Match
                            </span>
                            <span className="px-3 py-1 bg-purple-200/50 text-purple-700 text-xs rounded-full font-medium">
                              Performance Bonus
                            </span>
                            <span className="px-3 py-1 bg-orange-200/50 text-orange-700 text-xs rounded-full font-medium">
                              Stock Options
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Simple Apply Button - Opens Multi-step Form */}
                    <div className="pt-6">
                      <button
                        onClick={() => setShowApplicationForm(true)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Apply
                        <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* PROFILE DASHBOARD VIEW */
        <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 min-h-screen">
          {/* Header */}
          <div className="bg-white/50 backdrop-blur-lg border-b border-purple-200/50">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setView('browse')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back to {profileData.jobTitle || 'Job Search'}</span>
                </button>
                
                <div className="flex items-center gap-4">
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  )}
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Complete Profile
                  </span>
                  <span className="text-gray-500 text-sm">All Insights</span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Profile Card - LinkedIn Style */}
                <div className="bg-white/60 backdrop-blur-lg rounded-xl shadow-lg border border-purple-200/40 overflow-hidden">
                  {/* Cover Photo Background */}
                  <div className="h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700"></div>
                  
                  {/* Profile Content */}
                  <div className="px-6 pb-6 relative">
                    {/* Profile Image */}
                    <div className="relative -mt-12 mb-4">
                      <div className="relative inline-block">
                        <div className="relative">
                          {profileData.profileImage ? (
                            <>
                              <img
                                src={profileData.profileImage}
                                alt="Profile"
                                className={`w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg bg-white transition-opacity duration-200 ${
                                  imageLoading ? 'opacity-75' : 'opacity-100'
                                }`}
                                onLoad={() => setImageLoading(false)}
                              />
                              {/* Loading spinner overlay */}
                              {imageLoading && (
                                <div className="absolute inset-0 flex items-center justify-center w-24 h-24 rounded-full bg-black bg-opacity-20">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7-7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* File input shown when editing */}
                        {editMode && (
                          <div className="absolute -bottom-2 -right-2">
                            <label className={`cursor-pointer p-2 rounded-full shadow-lg transition-colors ${
                              imageLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}>
                              {imageLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={imageLoading}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Profile Info - LinkedIn Style */}
                    <div className="text-left">
                      {/* Name */}
                      <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">
                        {profileData.firstName} {profileData.lastName}
                      </h3>
                      
                      {/* Job Title/Profession */}
                      <p className="text-gray-700 text-base font-medium mb-2 leading-snug">
                        {profileData.jobTitle || 'Software Developer'}
                      </p>
                      
                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{profileData.location || profileData.address || 'Cairo, Egypt'}</span>
                      </div>

                      {/* Experience Level */}
                      {profileData.experience && (
                        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8m0 0v.01M8 6v.01" />
                          </svg>
                          <span>{profileData.experience} experience</span>
                        </div>
                      )}
                    </div>

                    {/* Additional file input options when editing */}
                    {editMode && profileData.profileImage && (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={handleRemoveProfileImage}
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Remove Photo
                        </button>
                      </div>
                    )}
                  </div>


                </div>

                {/* Profile Completion */}
                <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6">
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
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - calculateProfileCompletion() / 100)}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-900">
                          {calculateProfileCompletion()}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">Profile Matched</p>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                        <p className="text-sm text-gray-900">{profileData.email || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                        <p className="text-sm text-gray-900">{profileData.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                        <p className="text-sm text-gray-900">{profileData.address || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">LinkedIn</p>
                        <p className="text-sm text-gray-900">{profileData.linkedIn || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pending Applications */}
                <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/30 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">Pending Applications</h4>
                  
                  {applications && applications.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {applications.slice(0, 4).map((app, index) => {
                        // Define company colors and progress based on status
                        const getStatusInfo = (status) => {
                          switch(status) {
                            case 'pending':
                              return { progress: 25, color: '#6B7280', label: 'Applied' };
                            case 'reviewing':
                              return { progress: 50, color: '#3B82F6', label: 'CV Opened' };
                            case 'interview':
                              return { progress: 75, color: '#3B82F6', label: 'Interview Stage' };
                            case 'approved':
                              return { progress: 100, color: '#10B981', label: 'Approved' };
                            case 'rejected':
                              return { progress: 100, color: '#EF4444', label: 'Rejected' };
                            default:
                              return { progress: 25, color: '#6B7280', label: 'Applied' };
                          }
                        };

                        const statusInfo = getStatusInfo(app.status);
                        const circumference = 2 * Math.PI * 36; // radius = 36
                        const strokeDashoffset = circumference - (statusInfo.progress / 100) * circumference;

                        // Company logo with proper styling
                        const getCompanyLogo = (company) => {
                          const logoComponents = {
                            'Spotify': (
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 14.424c-.185.302-.58.396-.882.211-2.42-1.477-5.462-1.812-9.04-.993-.38.087-.762-.147-.849-.527-.087-.38.147-.762.527-.849 3.909-.895 7.278-.511 10.019 1.146.302.185.396.58.211.882zm1.26-2.805c-.233.378-.728.496-1.106.263-2.77-1.703-6.991-2.195-10.26-1.201-.46.139-.951-.121-1.09-.581-.139-.46.121-.951.581-1.09 3.738-1.135 8.447-.595 11.612 1.373.378.233.496.728.263 1.106zm.108-2.92c-3.32-1.97-8.793-2.152-11.958-1.19-.551.168-1.133-.142-1.301-.693-.168-.551.142-1.133.693-1.301 3.626-1.1 9.768-.895 13.611 1.377.426.252.564.804.312 1.23-.252.426-.804.564-1.23.312z"/>
                                </svg>
                              </div>
                            ),
                            'Google': (
                              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                              </div>
                            ),
                            'Microsoft': (
                              <div className="w-8 h-8 bg-white rounded flex items-center justify-center shadow-sm">
                                <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                                  <div className="bg-red-500 w-full h-full rounded-sm"></div>
                                  <div className="bg-green-500 w-full h-full rounded-sm"></div>
                                  <div className="bg-blue-500 w-full h-full rounded-sm"></div>
                                  <div className="bg-yellow-500 w-full h-full rounded-sm"></div>
                                </div>
                              </div>
                            ),
                            'Apple': (
                              <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                </svg>
                              </div>
                            ),
                            'IBM': (
                              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-xs">IBM</span>
                              </div>
                            ),
                            'Meta': (
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">M</span>
                              </div>
                            ),
                            'Netflix': (
                              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-xs">N</span>
                              </div>
                            ),
                            'Amazon': (
                              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M.045 18.02c.072-.116.194-.182.32-.165 3.982.562 8.02.562 12.002 0 .126-.017.248.049.32.165.071.115.062.26-.024.367-.372.462-.98.462-1.352 0-.085-.107-.094-.252-.023-.367z"/>
                                </svg>
                              </div>
                            ),
                            'Adidas': (
                              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                <div className="flex space-x-0.5">
                                  <div className="w-1 h-3 bg-white transform rotate-12"></div>
                                  <div className="w-1 h-4 bg-white transform rotate-12"></div>
                                  <div className="w-1 h-3 bg-white transform rotate-12"></div>
                                </div>
                              </div>
                            )
                          };
                          
                          return logoComponents[company] || (
                            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {company?.charAt(0)?.toUpperCase() || 'C'}
                              </span>
                            </div>
                          );
                        };

                        return (
                          <div key={app.id} className="text-center">
                            {/* Circular Progress */}
                            <div className="relative w-20 h-20 mx-auto mb-3">
                              {/* Background Circle */}
                              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                                <circle
                                  cx="40"
                                  cy="40"
                                  r="36"
                                  stroke="#E5E7EB"
                                  strokeWidth="4"
                                  fill="none"
                                />
                                {/* Progress Circle */}
                                <circle
                                  cx="40"
                                  cy="40"
                                  r="36"
                                  stroke={statusInfo.color}
                                  strokeWidth="4"
                                  fill="none"
                                  strokeDasharray={circumference}
                                  strokeDashoffset={strokeDashoffset}
                                  strokeLinecap="round"
                                  className="transition-all duration-500 ease-in-out"
                                />
                              </svg>
                              {/* Company Logo/Initial */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                                  {getCompanyLogo(app.company)}
                                </div>
                              </div>
                            </div>
                            
                            {/* Job Title */}
                            <div className="mb-2">
                              <p className="text-sm font-medium text-gray-900 leading-tight">
                                {app.company || 'Company'}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                {app.jobTitle || 'Job Position'}
                              </p>
                            </div>
                            
                            {/* Status Badge */}
                            <div>
                              <span className={`px-2 py-1 text-xs rounded-md font-medium ${
                                app.status === 'pending' 
                                  ? 'bg-gray-100 text-gray-700' 
                                  : app.status === 'reviewing'
                                  ? 'bg-blue-100 text-blue-700'
                                  : app.status === 'interview' 
                                  ? 'bg-blue-100 text-blue-700'
                                  : app.status === 'approved' 
                                  ? 'bg-green-100 text-green-700'
                                  : app.status === 'rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {statusInfo.label}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm font-medium">No applications yet</p>
                      <p className="text-gray-400 text-xs mt-1">Start applying to jobs to see your progress here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Content Area */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/30">
                  
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
                          Skills & Interests
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                          Schedule Interview
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    
                    {/* Profile Photo Section */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
                      <div className="flex items-center gap-6">
                        <div className="flex-shrink-0">
                          {profileData.profileImage ? (
                            <img
                              src={profileData.profileImage}
                              alt="Profile"
                              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                              title="Click to view larger"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        {editMode ? (
                          <div className="flex flex-col gap-3">
                            <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors inline-block text-center">
                              Upload New Photo
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                              />
                            </label>
                            {profileData.profileImage && (
                              <button
                                type="button"
                                onClick={handleRemoveProfileImage}
                                className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                              >
                                Remove Photo
                              </button>
                            )}
                            <p className="text-xs text-gray-500">Recommended: Square image, at least 300x300 pixels</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              {profileData.profileImage ? 'Profile photo uploaded' : 'No profile photo'}
                            </p>
                            <p className="text-xs text-gray-500">Click "Edit Profile" to manage your photo</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Personal Details Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={profileData.firstName}
                            onChange={(e) => handleProfileUpdate('firstName', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">{profileData.firstName || 'Not provided'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        {editMode ? (
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => handleProfileUpdate('email', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">{profileData.email || 'Not provided'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={profileData.location}
                            onChange={(e) => handleProfileUpdate('location', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="City, Country"
                          />
                        ) : (
                          <p className="text-gray-900">{profileData.location || 'Not provided'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        {editMode ? (
                          <input
                            type="date"
                            value={profileData.dateOfBirth}
                            onChange={(e) => handleProfileUpdate('dateOfBirth', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-gray-900">{profileData.dateOfBirth || 'Not provided'}</p>
                        )}
                      </div>
                    </div>

                    {/* Cover Letter */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Cover Letter</h3>
                      {editMode ? (
                        <textarea
                          rows={6}
                          value={profileData.coverLetter}
                          onChange={(e) => handleProfileUpdate('coverLetter', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Write your cover letter here..."
                        />
                      ) : (
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {profileData.coverLetter || 'No cover letter provided'}
                        </p>
                      )}
                    </div>

                    {/* Recent Experience */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Experience</h3>
                      {editMode ? (
                        <div className="space-y-4 bg-gray-50 rounded-lg p-4">
                          <input
                            type="text"
                            value={profileData.recentExperience.position}
                            onChange={(e) => handleNestedUpdate('recentExperience', 'position', e.target.value)}
                            placeholder="Position"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={profileData.recentExperience.company}
                            onChange={(e) => handleNestedUpdate('recentExperience', 'company', e.target.value)}
                            placeholder="Company"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={profileData.recentExperience.duration}
                            onChange={(e) => handleNestedUpdate('recentExperience', 'duration', e.target.value)}
                            placeholder="Duration (e.g., Jan 2022 - Present)"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {profileData.recentExperience.position || 'Position not provided'}
                          </h4>
                          <p className="text-gray-600 text-sm mb-1">
                            {profileData.recentExperience.company || 'Company not provided'}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {profileData.recentExperience.duration || 'Duration not provided'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Two Column Layout for Education and Skills */}
                    <div className="grid grid-cols-2 gap-8">
                      
                      {/* Education */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Education</h3>
                        {editMode ? (
                          <div className="space-y-4 bg-gray-50 rounded-lg p-4">
                            <input
                              type="text"
                              value={profileData.education.degree}
                              onChange={(e) => handleNestedUpdate('education', 'degree', e.target.value)}
                              placeholder="Degree"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              value={profileData.education.institution}
                              onChange={(e) => handleNestedUpdate('education', 'institution', e.target.value)}
                              placeholder="Institution"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              value={profileData.education.year}
                              onChange={(e) => handleNestedUpdate('education', 'year', e.target.value)}
                              placeholder="Year"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {profileData.education.degree || 'Degree not provided'}
                            </h4>
                            <p className="text-gray-600 text-sm mb-1">
                              {profileData.education.institution || 'Institution not provided'}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {profileData.education.year || 'Year not provided'}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Skills */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                        {editMode && (
                          <div className="flex gap-2 mb-3">
                            <input
                              type="text"
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())}
                              placeholder="Add a skill"
                              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <button
                              type="button"
                              onClick={handleSkillAdd}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                            >
                              Add
                            </button>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {profileData.skills.length > 0 ? (
                            profileData.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center gap-2"
                              >
                                {skill}
                                {editMode && (
                                  <button
                                    type="button"
                                    onClick={() => handleSkillRemove(skill)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    ×
                                  </button>
                                )}
                              </span>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No skills added</p>
                          )}
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
                        <button className="text-blue-600 text-sm hover:text-blue-700 font-semibold">
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
      )}

      {/* New Multi-step Application Form */}
      {showApplicationForm && selectedJob && (
        <ApplicationForm
          job={selectedJob}
          onSubmit={handleApplicationSubmit}
          onCancel={() => setShowApplicationForm(false)}
        />
      )}

      {/* Easy Apply Form */}
      {showEasyApplyForm && selectedJob && (
        <EasyApplyForm
          job={selectedJob}
          user={user}
          onSubmit={handleEasyApplySubmit}
          onCancel={() => setShowEasyApplyForm(false)}
        />
      )}
    </div>
  );
};

export default JobSeekerDashboard;
