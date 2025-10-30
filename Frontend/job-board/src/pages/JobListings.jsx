import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '../context/JobContext';

const JobListings = () => {
  const { filteredJobs, loading, filters, updateFilters, resetFilters } = useJobs();
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (filterName, value) => {
    updateFilters({ [filterName]: value });
  };

  return (
    <div className="bg-gray-50 pt-6 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
          <p className="text-gray-600">
            {filteredJobs.length} jobs found
            {filters.search && ` for "${filters.search}"`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-5 sticky top-20">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-wazafny-blue hover:text-wazafny-darkBlue font-medium"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Job title or keyword"
                    className="input-field"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    placeholder="City or state"
                    className="input-field"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Categories</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Product">Product</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                {/* Remote */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Work Mode
                  </label>
                  <select
                    value={filters.remote}
                    onChange={(e) => handleFilterChange('remote', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All</option>
                    <option value="true">Remote</option>
                    <option value="false">On-site</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={filters.experience}
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Levels</option>
                    <option value="Entry-level">Entry-level</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Job Listings */}
          <main className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wazafny-blue"></div>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={resetFilters}
                  className="btn-primary"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredJobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.id}`}
                    className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 group border border-gray-100"
                  >
                    <div className="flex items-start gap-3">
                      {/* Company Logo */}
                      <div className="flex-shrink-0">
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-12 h-12 object-contain rounded-lg border border-gray-200 p-1"
                        />
                      </div>

                      {/* Job Info */}
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-wazafny-blue transition-colors mb-1">
                          {job.title}
                        </h3>
                        <p className="text-base text-gray-700 mb-2">{job.company}</p>

                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {job.type}
                          </span>
                          {job.remote && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Remote
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {job.experience}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-base font-semibold text-wazafny-blue">
                            {job.salary}
                          </p>
                          <span className="text-xs text-gray-500">
                            Posted {new Date(job.postedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default JobListings;
