import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { companiesAPI } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const { updateFilters } = useJobs();
  const [companies, setCompanies] = useState([]);
  const [openFAQ, setOpenFAQ] = useState(null); // State to track which FAQ is open
  const [searchData, setSearchData] = useState({
    title: '',
    category: '',
    location: '',
  });

  // Animation states for counting numbers
  const [jobCount, setJobCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
  const [seekerCount, setSeekerCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateNumbers();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateNumbers = () => {
    // Animate job count to 13K+
    let currentJob = 0;
    const jobTarget = 13000;
    const jobIncrement = jobTarget / 100;
    
    const jobTimer = setInterval(() => {
      currentJob += jobIncrement;
      if (currentJob >= jobTarget) {
        currentJob = jobTarget;
        clearInterval(jobTimer);
      }
      setJobCount(Math.floor(currentJob));
    }, 20);

    // Animate company count to 7K+
    let currentCompany = 0;
    const companyTarget = 7000;
    const companyIncrement = companyTarget / 100;
    
    const companyTimer = setInterval(() => {
      currentCompany += companyIncrement;
      if (currentCompany >= companyTarget) {
        currentCompany = companyTarget;
        clearInterval(companyTimer);
      }
      setCompanyCount(Math.floor(currentCompany));
    }, 25);

    // Animate seeker count to 50K+
    let currentSeeker = 0;
    const seekerTarget = 50000;
    const seekerIncrement = seekerTarget / 100;
    
    const seekerTimer = setInterval(() => {
      currentSeeker += seekerIncrement;
      if (currentSeeker >= seekerTarget) {
        currentSeeker = seekerTarget;
        clearInterval(seekerTimer);
      }
      setSeekerCount(Math.floor(currentSeeker));
    }, 15);
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return Math.floor(num / 1000) + 'K+';
    }
    return num.toString();
  };

  const fetchCompanies = async () => {
    try {
      const data = await companiesAPI.getAll();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({
      search: searchData.title,
      category: searchData.category,
      location: searchData.location,
    });
    navigate('/jobs');
  };

  const handleInputChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handlePostJob = () => {
    // Check if user is logged in and is an employer
    const userRole = localStorage.getItem('userRole');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn && userRole === 'employer') {
      navigate('/employer/dashboard');
    } else {
      // Redirect to register page with employer role
      navigate('/register?role=employer');
    }
  };

  const faqData = [
    {
      question: "How Do I Create a Wazafny Account?",
      answer: (
        <div>
          <p className="mb-3">Creating a new Wazafny account is quick and easy:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click the Register button in the top navigation.</li>
            <li>Choose your role (Job Seeker or Employer).</li>
            <li>Fill in your email and create a secure password.</li>
            <li>Complete your profile information and click "Create Account".</li>
          </ol>
        </div>
      )
    },
    {
      question: "How do I apply for jobs on Wazafny?",
      answer: (
        <div>
          <p className="mb-3">Applying for jobs is simple:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Browse jobs or use our search filters to find relevant positions.</li>
            <li>Click on a job to view details and requirements.</li>
            <li>Click "Apply Now" and upload your CV.</li>
            <li>Fill in any additional information and submit your application.</li>
          </ol>
        </div>
      )
    },
    {
      question: "What makes Wazafny different?",
      answer: (
        <div>
          <p className="mb-3">Wazafny stands out with these key features:</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>AI-Powered matching</strong> for the most relevant opportunities</li>
            <li><strong>Direct communication</strong> with employers and hiring managers</li>
            <li><strong>Quality control</strong> - we verify all job postings and employers</li>
            <li><strong>Mobile optimized</strong> for seamless job searching anywhere</li>
          </ul>
        </div>
      )
    },
    {
      question: "Is Wazafny free to use?",
      answer: (
        <div>
          <p className="mb-3">Yes! Basic features are free for everyone:</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Job Seekers:</strong> Free job searching, applications, and profile creation</li>
            <li><strong>Employers:</strong> Free basic job posting and candidate browsing</li>
            <li><strong>Premium options:</strong> Advanced features available for enhanced experience</li>
          </ul>
        </div>
      )
    },
    {
      question: "How can I get support?",
      answer: (
        <div>
          <p className="mb-3">We're here to help through multiple channels:</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Email:</strong> support@wazafny.com</li>
            <li><strong>Live Chat:</strong> Available on our website</li>
            <li><strong>Help Center:</strong> Browse articles and tutorials</li>
          </ul>
          <p className="mt-3 text-sm">Our support team responds within 24 hours.</p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Accent Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-wazafny-blue/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-64 h-64 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-gradient-to-br from-green-400/10 to-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4">
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #1e40af 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 relative pl-8 lg:pl-12">
              {/* Accent decoration */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-wazafny-blue to-purple-600 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute top-20 -right-4 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-30 animate-bounce"></div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight relative">
                Search between <span className="relative text-wazafny-blue">
                  13K+
                  <div className="absolute -bottom-2 left-0 w-full h-3 bg-gradient-to-r from-wazafny-blue/20 to-purple-500/20 -skew-x-12 -z-10"></div>
                </span>
                <br />
                Job opening
              </h1>
              <p className="text-base text-gray-600 leading-relaxed max-w-lg">
                Job search experience. Find the job that fits your life. Discover opportunities that match your skills and aspirations.
              </p>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="relative bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                {/* Form accent decorations */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-br from-green-400 to-teal-500 rounded-full"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Title Input */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-gradient-to-r from-wazafny-blue to-purple-500 rounded-full"></span>
                      What
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={searchData.title}
                      onChange={handleInputChange}
                      placeholder="Title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wazafny-blue focus:border-transparent transition-all duration-300 hover:border-wazafny-blue/50"
                    />
                  </div>

                  {/* Category Select */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                      Type
                    </label>
                    <select
                      name="category"
                      value={searchData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wazafny-blue focus:border-transparent"
                    >
                      <option value="">Category</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Product">Product</option>
                      <option value="Data Science">Data Science</option>
                    </select>
                  </div>

                  {/* Location Input */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></span>
                      Search
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={searchData.location}
                      onChange={handleInputChange}
                      placeholder="Location"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wazafny-blue focus:border-transparent transition-all duration-300 hover:border-wazafny-blue/50"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="relative w-full bg-gradient-to-r from-wazafny-blue to-purple-600 hover:from-wazafny-darkBlue hover:to-purple-700 text-white font-semibold py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 group overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Search
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </form>
            </div>

            {/* Right Content - Image with Floating Cards */}
            <div className="relative hidden lg:block px-4 py-4 pl-8 lg:pl-14">
              <div className="relative flex items-center justify-center h-[500px] w-full max-w-[400px] ml-6 lg:ml-10 bg-gradient-to-br from-blue-50/20 to-purple-50/20 rounded-3xl overflow-visible shadow-2xl">
                <img
                  src="/employee.jpg"
                  alt="Professional businessman"
                  className="hero-image w-full h-full object-cover object-center rounded-3xl"
                />

                {/* Floating Info Cards */}
                <div className="absolute -top-2 -left-10 floating-card animate-float z-10">
                  <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Connecting</p>
                    <p className="text-xs text-gray-500">People all over.</p>
                  </div>
                </div>

                <div className="absolute top-12 -right-12 floating-card animate-float-delay-1 z-10">
                  <div className="w-9 h-9 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Top Rated</p>
                    <p className="text-xs text-gray-500">Job search site.</p>
                  </div>
                </div>

                <div className="absolute bottom-12 -right-8 floating-card animate-float-delay-2 z-10">
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">7K+ Verified</p>
                    <p className="text-xs text-gray-500">Job openings.</p>
                  </div>
                </div>

                <div className="absolute -bottom-2 -left-4 floating-card animate-float-delay-3 z-10">
                  <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Upload CV</p>
                    <p className="text-xs text-gray-500">Let us do the rest</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Companies Section */}
      <section className="relative py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Background accent elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-wazafny-blue/10 to-purple-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-2xl"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 relative inline-block">
              Top companies hiring now
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-wazafny-blue to-purple-500 rounded-full"></div>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of professionals working at these industry-leading companies
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
            {companies.length > 0 ? companies.map((company) => (
              <div
                key={company.id}
                className="relative flex items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2 border border-gray-100 hover:border-wazafny-blue/30"
              >
                {/* Company card accent */}
                <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-br from-wazafny-blue to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-12 object-contain transition-all duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=2557a7&color=ffffff&size=128`;
                  }}
                />
              </div>
            )) : (
              // Fallback companies with placeholder logos
              ['Google', 'Microsoft', 'Spotify', 'Netflix', 'Apple'].map((name, index) => (
                <div
                  key={index}
                  className="relative flex items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2 border border-gray-100 hover:border-wazafny-blue/30"
                >
                  <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-br from-wazafny-blue to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="h-12 w-20 bg-gradient-to-r from-wazafny-blue to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    {name}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Subtle shadow transition */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-600/20"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="relative py-20 px-4 bg-gradient-to-br from-wazafny-blue via-purple-600 to-pink-600 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl -translate-x-48 -translate-y-48 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-3xl translate-x-40 translate-y-40 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-green-400/15 to-transparent rounded-full blur-3xl -translate-x-32 -translate-y-32 animate-pulse"></div>
          
          {/* Additional atmospheric effects */}
          <div className="absolute top-0 right-1/4 w-48 h-48 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-gradient-to-br from-rose-400/10 to-transparent rounded-full blur-2xl animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Join the Success Story
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Thousands of professionals trust us to find their dream careers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-sm border border-white/20 transform group-hover:scale-105 transition-all duration-300"></div>
              <div className="relative p-8 transform transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8zM8 14v.01M12 14v.01M16 14v.01" />
                  </svg>
                </div>
                <h3 className={`text-3xl font-bold mb-2 stats-number ${hasAnimated ? 'animate-count-up' : ''}`}>
                  {formatNumber(jobCount)}
                </h3>
                <p className="text-lg text-white/90">Job Openings</p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-sm border border-white/20 transform group-hover:scale-105 transition-all duration-300"></div>
              <div className="relative p-8 transform transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className={`text-3xl font-bold mb-2 stats-number ${hasAnimated ? 'animate-count-up' : ''}`}>
                  {formatNumber(companyCount)}
                </h3>
                <p className="text-lg text-white/90">Verified Companies</p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-sm border border-white/20 transform group-hover:scale-105 transition-all duration-300"></div>
              <div className="relative p-8 transform transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className={`text-3xl font-bold mb-2 stats-number ${hasAnimated ? 'animate-count-up' : ''}`}>
                  {formatNumber(seekerCount)}
                </h3>
                <p className="text-lg text-white/90">Happy Job Seekers</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Subtle shadow transition */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20"></div>
        </div>
      </section>

      {/* Employer Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 overflow-hidden">
        {/* Background accent elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-wazafny-blue/10 to-purple-500/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-green-400/10 to-teal-500/10 rounded-full blur-3xl transform -translate-x-24 translate-y-24"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <div className="order-2 lg:order-1 relative">
              {/* Image decorative elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-70 animate-pulse"></div>
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=600&fit=crop"
                  alt="Professional employers"
                  className="w-full h-[500px] object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wazafny-blue/20 to-transparent"></div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="order-1 lg:order-2 space-y-8 relative">
              {/* Content decorative elements */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-wazafny-blue/20 to-purple-500/20 rounded-full blur-xl"></div>
              
              <div className="relative">
                <p className="text-wazafny-blue font-semibold text-lg mb-2 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-3 h-3 bg-gradient-to-r from-wazafny-blue to-purple-500 rounded-full"></span>
                  WAZAFNY FOR EMPLOYERS
                </p>
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 relative">
                  Want to 
                  <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-wazafny-blue to-purple-600 ml-3">
                    hire?
                    <div className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-wazafny-blue/20 to-purple-600/20 -skew-x-12"></div>
                  </span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Find the best candidates from 105+ active job seekers!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handlePostJob}
                  className="group relative bg-gradient-to-r from-wazafny-blue to-purple-600 hover:from-wazafny-darkBlue hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transform hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 text-lg">Post Job</span>
                  <svg 
                    className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <button className="group bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-wazafny-blue font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-3 transform hover:scale-105">
                  <span className="text-lg">Learn More</span>
                  <svg 
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements gamda */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating Orbs */}
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '0s'}}></div>
          <div className="absolute bottom-32 right-1/4 w-40 h-40 bg-gradient-to-br from-emerald-400/15 to-cyan-600/15 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/6 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
          
          {/* Geometric Patterns */}
          <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.03]">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <pattern id="visionGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="#ffffff"/>
                  <path d="M0,20 L40,20 M20,0 L20,40" stroke="#ffffff" strokeWidth="0.5" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#visionGrid)"/>
            </svg>
          </div>

          {/* Abstract Lines */}
          <div className="absolute bottom-0 left-0 w-full h-full opacity-[0.05]">
            <svg className="w-full h-full" viewBox="0 0 800 600">
              <path d="M0,300 Q200,100 400,300 T800,300" stroke="#ffffff" strokeWidth="2" fill="none"/>
              <path d="M0,400 Q200,200 400,400 T800,400" stroke="#60a5fa" strokeWidth="1.5" fill="none"/>
              <path d="M0,500 Q200,300 400,500 T800,500" stroke="#34d399" strokeWidth="1" fill="none"/>
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Purpose</span>
              </h2>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Driven by innovation and guided by purpose, we're reshaping the future of work
            </p>
          </div>

          {/* Vision & Mission Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Vision Card */}
            <div className="group relative">
              {/* Card Background with Glassmorphism */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl"></div>
              
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              
              {/* Card Content */}
              <div className="relative p-8 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Vision</h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                  </div>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  To become the world's most trusted platform connecting exceptional talent with innovative companies, 
                  creating opportunities that drive both individual success and global progress.
                </p>
                
                {/* Floating Icons */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-24 h-24 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Mission Card */}
            <div className="group relative">
              {/* Card Background with Glassmorphism */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl"></div>
              
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/50 via-teal-500/50 to-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              
              {/* Card Content */}
              <div className="relative p-8 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Mission</h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
                  </div>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  To empower careers and fuel business growth by providing cutting-edge tools, personalized experiences, 
                  and meaningful connections that transform how people find opportunities and companies discover talent.
                </p>
                
                {/* Floating Icons */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-24 h-24 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-8">
              Our <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Core Values</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Innovation */}
              <div className="group p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Innovation</h4>
                <p className="text-gray-400 text-sm">Constantly pushing boundaries to create better solutions</p>
              </div>

              {/* Integrity */}
              <div className="group p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Integrity</h4>
                <p className="text-gray-400 text-sm">Building trust through transparency and ethical practices</p>
              </div>

              {/* Excellence */}
              <div className="group p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Excellence</h4>
                <p className="text-gray-400 text-sm">Delivering exceptional quality in everything we do</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-wazafny-blue font-semibold mb-3 uppercase tracking-wide text-sm">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quick answers to help you get started with Wazafny
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-3">
              {faqData.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
                  <button 
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    <svg 
                      className={`w-5 h-5 text-wazafny-blue transform transition-transform duration-200 flex-shrink-0 ${
                        openFAQ === index ? 'rotate-45' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Contact support */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Need more help?</p>
            <a 
              href="mailto:support@wazafny.com" 
              className="inline-flex items-center bg-wazafny-blue hover:bg-wazafny-darkBlue text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
