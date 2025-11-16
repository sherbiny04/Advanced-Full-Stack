import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const { user, isSeeker } = useAuth();
  const { filteredJobs } = useJobs();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('All');

  const categories = ['All', 'Designer', 'Web Developer', 'Software Engineer', 'Doctors', 'Marketing'];
  const jobTypes = ['All', 'Full Time', 'Part Time', 'Remote', 'Hybrid'];

  useEffect(() => {
    if (!isSeeker()) {
      navigate('/login');
      return;
    }
  }, [user]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
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
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center hover:bg-yellow-500 transition-colors">
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <button className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="mt-8 text-center">
              <button className="w-full py-4 bg-gradient-to-r from-yellow-300 to-yellow-400 text-gray-900 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-sm">
                Load More
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Call to Action Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Your Next Great Hire is Just a Click Away!</h3>
              <p className="text-gray-300 text-sm mb-6">
                Post your job today and quickly connect with top talent. Our user-friendly platform streamlines hiring, making it easy to find skilled professionals ready to join.
              </p>
              <button className="w-full py-3 bg-gradient-to-r from-yellow-300 to-yellow-400 text-gray-900 rounded-lg font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all">
                Post Job On Quietly
              </button>
            </div>

            {/* Featured Company Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Featured Company</h3>
              <div className="space-y-4">
                {[
                  { name: 'Behance', location: 'London, UK', logo: '🎨' },
                  { name: 'Microsoft', location: 'USA', logo: '⊞' },
                  { name: 'Fiverr', location: 'London, UK', logo: '●' },
                  { name: 'Behance', location: 'London, UK', logo: '🎨' },
                  { name: 'Intel', location: 'London, UK', logo: 'intel' }
                ].map((company, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-wazafny-blue to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      {company.logo}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{company.name}</h4>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {company.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
