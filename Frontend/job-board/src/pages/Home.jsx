import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { companiesAPI } from '../services/api';
import { useTheme } from '../hooks/useTheme';

const Home = () => {
  const navigate = useNavigate();
  const { updateFilters } = useJobs();
  const { isDarkMode } = useTheme();
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

  const heroBackgroundClasses = isDarkMode
    ? 'bg-gradient-to-br from-[#050b17] via-[#0a1530] to-[#050812] text-white'
    : 'bg-white text-gray-900';
  const faqSectionClasses = isDarkMode
    ? 'py-20 px-4 bg-slate-950 text-white'
    : 'py-20 px-4 bg-gray-50 text-gray-900';
  const employerSectionClasses = isDarkMode
    ? 'relative py-20 px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden'
    : 'relative py-20 px-4 bg-white text-gray-900 overflow-hidden';
  const missionSectionClasses = isDarkMode
    ? 'relative py-24 px-4 bg-gradient-to-br from-[#030712] via-[#0b1220] to-[#030712] text-white overflow-hidden'
    : 'relative py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 overflow-hidden';
  const missionPrimaryCardClasses = isDarkMode
    ? 'relative p-10 rounded-3xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-md'
    : 'relative p-10 rounded-3xl bg-white border border-gray-100 shadow-xl';
  const missionSecondaryCardClasses = isDarkMode
    ? 'relative p-6 rounded-2xl bg-white/5 border border-white/10 shadow-xl'
    : 'relative p-6 rounded-2xl bg-white border border-gray-100 shadow-md';
  const missionIconWrapperClasses = isDarkMode
    ? 'w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg'
    : 'w-14 h-14 rounded-2xl bg-gradient-to-br from-wazafny-blue to-purple-500 flex items-center justify-center shadow-lg';
  const missionStatCardClasses = isDarkMode
    ? 'px-5 py-4 rounded-2xl border border-white/10 bg-white/5 text-white'
    : 'px-5 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Accent Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-wazafny-blue/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-64 h-64 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-gradient-to-br from-green-400/10 to-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className={`relative py-20 px-4 overflow-hidden transition-colors duration-500 ${heroBackgroundClasses}`}>
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {isDarkMode ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-[#050b17] via-[#0c1c3f] to-[#05070f]"></div>
              <div className="absolute -top-24 -left-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
              <div className="absolute top-10 right-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
              <div className="absolute top-24 left-12 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="absolute top-1/2 right-40 w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
              <div className="absolute bottom-24 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              <svg className="absolute inset-0 opacity-20" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="darkHeroLine" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#21d4fd" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#b721ff" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                <path d="M0,220 Q220,60 440,220 T880,220" stroke="url(#darkHeroLine)" strokeWidth="2" fill="none" />
                <path d="M0,420 Q200,320 400,420 T800,420" stroke="url(#darkHeroLine)" strokeWidth="1.5" fill="none" opacity="0.6" />
              </svg>
            </>
          ) : (
            <>
              {/* Floating dots with project colors */}
              <div className="absolute top-20 left-20 w-3 h-3 bg-wazafny-blue rounded-full animate-pulse"></div>
              <div className="absolute top-40 right-32 w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
              <div className="absolute bottom-32 left-1/4 w-2.5 h-2.5 bg-wazafny-blue rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-purple-600 rounded-full animate-ping"></div>
              
              {/* Abstract lines/curves with project colors */}
              <svg className="absolute top-0 left-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,200 Q200,100 400,200 T800,200" stroke="url(#gradient1)" strokeWidth="2" fill="none"/>
                <path d="M100,400 Q300,300 500,400 T900,400" stroke="url(#gradient2)" strokeWidth="2" fill="none"/>
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e40af" stopOpacity="0.5"/>
                    <stop offset="100%" stopColor="#9333ea" stopOpacity="0.5"/>
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#9333ea" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#1e40af" stopOpacity="0.4"/>
                  </linearGradient>
                </defs>
              </svg>
            </>
          )}
        </div>
        
        {/* Decorative grid pattern with project colors */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${isDarkMode ? '#21d4fd' : '#1e40af'} 1px, transparent 0)`,
            backgroundSize: isDarkMode ? '60px 60px' : '40px 40px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-10 md:space-y-12 relative max-w-2xl mx-auto text-center lg:text-left lg:max-w-none px-2 sm:px-0">
              {/* Accent decoration */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-wazafny-blue to-purple-600 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute top-20 -right-4 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-30 animate-bounce"></div>
              
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight relative ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Unlock <span className="relative text-wazafny-blue">13K+</span> Career
                <br />
                <span className="bg-gradient-to-r from-wazafny-blue to-purple-600 bg-clip-text text-transparent">Opportunities</span>
              </h1>
              <p className={`text-base md:text-lg leading-relaxed max-w-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Job search experience. Find the job that fits your life. Discover opportunities that match your skills and aspirations.
              </p>

              {/* Call To Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => navigate('/jobs')}
                  className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-base md:text-lg rounded-full font-semibold text-white bg-gradient-to-r from-wazafny-blue to-purple-600 hover:from-wazafny-darkBlue hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Find Jobs
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/services')}
                  className={`inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-base md:text-lg rounded-full font-semibold border transition-colors duration-200 ${
                    isDarkMode
                      ? 'border-white/30 text-white bg-transparent hover:bg-white/10'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  Learn more
                </button>
              </div>
            </div>

            {/* Right Content - Image with Floating Cards */}
            <div className="relative hidden lg:block px-4 py-4 pl-8 lg:pl-14">
              <div className={`relative flex items-center justify-center h-[500px] w-full max-w-[400px] ml-6 lg:ml-10 rounded-3xl overflow-visible shadow-2xl ${
                isDarkMode ? 'bg-white/5 backdrop-blur border border-white/10' : 'bg-gradient-to-br from-blue-50/20 to-purple-50/20'
              }`}>
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

        {/* Top Companies Section - Inside Hero */}
        <div className="max-w-7xl mx-auto relative mt-40">
          <div className="text-center mb-10">
            <h2 className={`text-2xl md:text-3xl font-bold mb-3 relative inline-block ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Top companies hiring now
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-wazafny-blue to-purple-500 rounded-full"></div>
            </h2>
            <p className={`text-sm mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Join thousands of professionals working at these industry-leading companies
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {companies.length > 0 ? companies.map((company) => (
              <div
                key={company.id}
                className={`relative flex items-center justify-center p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 ${
                  isDarkMode
                    ? 'bg-white/5 border border-white/10 hover:border-wazafny-blue/40'
                    : 'bg-white border border-gray-100 hover:border-wazafny-blue/30'
                }`}
              >
                <div className="absolute top-0 right-0 w-2 h-2 bg-gradient-to-br from-wazafny-blue to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-10 object-contain transition-all duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=2557a7&color=ffffff&size=128`;
                  }}
                />
              </div>
            )) : (
              ['Google', 'Microsoft', 'Spotify', 'Netflix', 'Apple'].map((name, index) => (
                <div
                  key={index}
                  className={`relative flex items-center justify-center p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 ${
                    isDarkMode
                      ? 'bg-white/5 border border-white/10 hover:border-wazafny-blue/40'
                      : 'bg-white border border-gray-100 hover:border-wazafny-blue/30'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-2 h-2 bg-gradient-to-br from-wazafny-blue to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="h-10 w-20 bg-gradient-to-r from-wazafny-blue to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    {name}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Stats Section - Elegant Design */}
      <section ref={statsRef} className="relative py-20 px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {/* Gradient orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          
          {/* Floating particles */}
          <div className="absolute top-20 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-32 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"></div>
          
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block">
              <span className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-2 block">Our Impact</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Trusted Growth Metrics
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
            <p className="text-blue-200 text-base max-w-xl mx-auto mt-5">
              Real momentum powered by employers & seekers building careers together
            </p>
          </div>
          
          {/* Stats Grid */}
          <div className="max-w-5xl mx-auto">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-50"></div>
              
              {/* Single container with all stats */}
              <div className="relative bg-slate-800/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                  
                  {/* Job Openings */}
                  <div className="text-center pt-6 sm:pt-0">
                    <div className="mb-4">
                      <div className="w-11 h-11 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className={`text-3xl md:text-4xl font-bold mb-2 text-cyan-400 ${hasAnimated ? 'animate-count-up' : ''}`}>
                      {formatNumber(jobCount)}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium">Job Openings</p>
                  </div>
                  
                  {/* Verified Companies */}
                  <div className="text-center pt-6 sm:pt-0 sm:px-6">
                    <div className="mb-4">
                      <div className="w-11 h-11 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                    <h3 className={`text-3xl md:text-4xl font-bold mb-2 text-purple-400 ${hasAnimated ? 'animate-count-up' : ''}`}>
                      {formatNumber(companyCount)}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium">Verified Companies</p>
                  </div>
                  
                  {/* Happy Job Seekers */}
                  <div className="text-center pt-6 sm:pt-0 sm:px-6 lg:px-0">
                    <div className="mb-4">
                      <div className="w-11 h-11 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className={`text-3xl md:text-4xl font-bold mb-2 text-emerald-400 ${hasAnimated ? 'animate-count-up' : ''}`}>
                      {formatNumber(seekerCount)}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium">Happy Job Seekers</p>
                  </div>
                  
                </div>
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
      <section className={employerSectionClasses}>
        {/* Background accent elements */}
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl transform translate-x-32 -translate-y-32 ${
          isDarkMode ? 'bg-gradient-to-br from-wazafny-blue/30 to-purple-600/30 opacity-70' : 'bg-gradient-to-br from-wazafny-blue/10 to-purple-500/10'
        }`}></div>
        <div className={`absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl transform -translate-x-24 translate-y-24 ${
          isDarkMode ? 'bg-gradient-to-br from-green-400/20 to-teal-500/20 opacity-70' : 'bg-gradient-to-br from-green-400/10 to-teal-500/10'
        }`}></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <div className="order-2 lg:order-1 relative">
              {/* Image decorative elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-70 animate-pulse"></div>
              
              <div className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 ${
                isDarkMode ? 'border-slate-800/70' : 'border-white'
              }`}>
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
                <p className={`font-semibold text-lg mb-2 uppercase tracking-wide flex items-center gap-2 ${
                  isDarkMode ? 'text-blue-200' : 'text-wazafny-blue'
                }`}>
                  <span className="w-3 h-3 bg-gradient-to-r from-wazafny-blue to-purple-500 rounded-full"></span>
                  WAZAFNY FOR EMPLOYERS
                </p>
                <h2 className={`text-5xl md:text-6xl font-bold mb-4 relative ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Want to 
                  <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-wazafny-blue to-purple-600 ml-3">
                    hire?
                    <div className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-wazafny-blue/20 to-purple-600/20 -skew-x-12"></div>
                  </span>
                </h2>
                <p className={`text-xl leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
                
                <button className={`group font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-3 transform hover:scale-105 ${
                  isDarkMode
                    ? 'bg-slate-900 text-white border border-slate-700 hover:border-wazafny-blue/60 hover:bg-slate-800'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-wazafny-blue'
                }`}>
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
      <section className={missionSectionClasses}>
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_55%)]' : 'bg-[radial-gradient(circle_at_bottom,_rgba(37,99,235,0.12),_transparent_60%)]'}`}></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(115deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(245deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '90px 90px',
            opacity: isDarkMode ? 0.25 : 0.1
          }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <p className={`uppercase tracking-[0.4em] text-[0.65rem] font-semibold mb-4 ${isDarkMode ? 'text-blue-200/70' : 'text-wazafny-blue/70'}`}>
              STRATEGIC DIRECTION
            </p>
            <h2 className={`text-3xl md:text-4xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              A modern talent partner with enterprise-grade rigor
            </h2>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-lg`}>
              Every initiative ladders up to a dual focus: a visionary outlook for where hiring is going and a mission engineered for measurable delivery.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-stretch">
            {/* Vision Narrative */}
            <div className={missionPrimaryCardClasses}>
              <div className="flex items-start gap-5 mb-8">
                <div className={missionIconWrapperClasses}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className={`text-xs uppercase tracking-[0.3em] mb-2 ${isDarkMode ? 'text-blue-200/70' : 'text-wazafny-blue/70'}`}>Vision</p>
                  <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>A market where teams hire with confidence, speed, and context.</h3>
                </div>
              </div>

              <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} text-lg leading-relaxed mb-8`}>
                We lead with strategic insight, surfacing the stories behind talent markets and giving leadership teams a clear line-of-sight from role design to impact delivered.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                {[
                  { title: 'Executive-grade reporting', desc: 'Quarterly intelligence packs for CHRO and Finance alignment.' },
                  { title: 'Experience-first workflows', desc: 'Every touchpoint crafted to respect candidates and hiring squads.' },
                  { title: 'Responsible innovation', desc: 'AI tooling audited for fairness, security, and measurable value.' },
                  { title: 'Global-ready playbook', desc: 'Compliance, onboarding, and mobility pathways built-in.' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className={`text-sm font-semibold tracking-wide ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</p>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm leading-relaxed`}>{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className={`pt-6 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                <p className={`text-xs uppercase tracking-[0.4em] mb-2 ${isDarkMode ? 'text-blue-200/70' : 'text-wazafny-blue/70'}`}>2025 Focus</p>
                <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-lg font-medium`}>
                  Embed hiring intelligence inside strategic planning cycles for every enterprise partner.
                </p>
              </div>
            </div>

            {/* Mission Systems */}
            <div className="flex flex-col gap-5">
              <div className={missionSecondaryCardClasses}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={missionIconWrapperClasses}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-xs uppercase tracking-[0.4em] mb-1 ${isDarkMode ? 'text-blue-200/70' : 'text-wazafny-blue/70'}`}>Mission</p>
                    <h4 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Deliver outcomes that compound for seekers & employers.</h4>
                  </div>
                </div>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm leading-relaxed mb-4`}>
                  Product, service, and data teams work as one operating unit to turn requisitions into signed offers with fewer handoffs and richer context.
                </p>
                <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {['Dedicated hiring strategists per portfolio','Observable SLAs for every stage of the funnel','Enablement tracks for hiring managers and seekers'].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className={`mt-2 w-1 h-8 rounded-full ${isDarkMode ? 'bg-blue-300/70' : 'bg-wazafny-blue/60'}`}></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={missionSecondaryCardClasses}>
                <p className={`text-xs uppercase tracking-[0.4em] mb-4 ${isDarkMode ? 'text-blue-200/70' : 'text-wazafny-blue/70'}`}>Operating metrics</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '48h', label: 'Shortlist target for priority roles' },
                    { value: '92%', label: 'Offer acceptance rate we defend' },
                    { value: '4.8/5', label: 'Candidate experience score' },
                    { value: '120+', label: 'Enterprise playbooks shipped' }
                  ].map((stat) => (
                    <div key={stat.value} className={missionStatCardClasses}>
                      <p className="text-2xl font-semibold text-wazafny-blue">{stat.value}</p>
                      <p className="text-xs uppercase tracking-widest opacity-70 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className={missionSecondaryCardClasses}>
                <p className={`text-xs uppercase tracking-[0.4em] mb-4 ${isDarkMode ? 'text-blue-200/70' : 'text-wazafny-blue/70'}`}>Delivery rhythm</p>
                <ol className={`space-y-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {[
                    { title: 'Intake workshops', desc: 'Clarify outcomes, risks, and culture markers with hiring squads.' },
                    { title: 'Signal loops', desc: 'Weekly analytics pulse to flag gaps before they become blockers.' },
                    { title: 'Executive readouts', desc: 'Monthly board-ready summaries tying hiring to business KPIs.' }
                  ].map((step, idx) => (
                    <li key={step.title} className="flex gap-4">
                      <span className={`text-base font-semibold ${isDarkMode ? 'text-blue-200' : 'text-wazafny-blue'}`}>0{idx + 1}</span>
                      <div>
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{step.title}</p>
                        <p className="text-sm opacity-80">{step.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Integrity by default', desc: 'Governance reviews, bias checks, and transparent pricing keep trust at the center.' },
              { title: 'Designing for scale', desc: 'Reusable systems, API-first integrations, and modular playbooks reduce friction.' },
              { title: 'Empathy in action', desc: 'Guidance, feedback, and coaching loops ensure humans feel championed.' }
            ].map((value, idx) => (
              <div key={value.title} className={`${missionSecondaryCardClasses} h-full`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx === 0
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                    : idx === 1
                      ? 'bg-gradient-to-br from-emerald-400 to-teal-500'
                      : 'bg-gradient-to-br from-purple-500 to-pink-500'
                  } text-white font-semibold`}>{idx + 1}</div>
                  <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value.title}</h4>
                </div>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm leading-relaxed`}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={faqSectionClasses}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className={`font-semibold mb-3 uppercase tracking-wide text-sm ${isDarkMode ? 'text-blue-200' : 'text-wazafny-blue'}`}>FAQ</p>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Frequently Asked Questions
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Quick answers to help you get started with Wazafny
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-3">
              {faqData.map((faq, index) => (
                <div
                  key={index}
                  className={`rounded-lg transition-shadow duration-300 overflow-hidden border ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-800 shadow-[0_10px_35px_rgba(15,23,42,0.45)] hover:shadow-[0_15px_45px_rgba(8,15,35,0.6)]'
                      : 'bg-white border-gray-100 shadow-sm hover:shadow-md'
                  }`}
                >
                  <button 
                    onClick={() => toggleFAQ(index)}
                    className={`w-full px-6 py-5 flex items-center justify-between text-left transition-colors ${
                      isDarkMode ? 'text-white hover:bg-slate-800/60' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className={`text-lg font-semibold pr-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {faq.question}
                    </span>
                    <svg 
                      className={`w-5 h-5 transform transition-transform duration-200 flex-shrink-0 ${
                        openFAQ === index ? 'rotate-45' : ''
                      } ${isDarkMode ? 'text-blue-200' : 'text-wazafny-blue'}`}
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
                    <div className={`px-6 pb-5 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Contact support */}
          <div className="text-center mt-12">
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>Need more help?</p>
            <a 
              href="mailto:support@wazafny.com" 
              className={`inline-flex items-center font-semibold py-2 px-6 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg ${
                isDarkMode
                  ? 'bg-white text-slate-900 hover:bg-blue-100'
                  : 'bg-wazafny-blue hover:bg-wazafny-darkBlue text-white'
              }`}
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
