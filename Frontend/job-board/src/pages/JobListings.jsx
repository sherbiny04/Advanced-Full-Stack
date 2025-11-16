import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { useTheme } from '../hooks/useTheme';

const JobListings = () => {
  const { filteredJobs, loading, filters, updateFilters, resetFilters } = useJobs();
  const [showFilters, setShowFilters] = useState(false);
  const { isDarkMode } = useTheme();

  const handleFilterChange = (filterName, value) => {
    updateFilters({ [filterName]: value });
  };

  const metaChips = [
    { label: 'Hybrid friendly', icon: '🌐' },
    { label: 'Equity available', icon: '💎' },
    { label: 'Executive track', icon: '🚀' },
    { label: 'Visa sponsorship', icon: '🛂' }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-gray-100' : 'bg-slate-100 text-slate-900'}`}>
      {/* Minimal Header */}
      <section className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/80 backdrop-blur' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-wazafny-blue mb-3">Curated opportunities</p>
              <h1 className={`text-4xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Find roles built for momentum.</h1>
              <p className={`text-lg max-w-2xl ${isDarkMode ? 'text-gray-300' : 'text-slate-500'}`}>
                {filteredJobs.length} openings live now
                {filters.search && ` for "${filters.search}"`}. Updated hourly by Wazafny strategists.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              {metaChips.map((chip) => (
                <span
                  key={chip.label}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                    isDarkMode
                      ? 'bg-slate-900/40 border border-white/10 text-gray-200'
                      : 'bg-slate-50 border border-slate-200 text-slate-600'
                  }`}
                >
                  <span>{chip.icon}</span>
                  {chip.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
  <section className={`${isDarkMode ? 'bg-slate-950 text-gray-100' : 'bg-slate-100 text-slate-900'}`}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters */}
            <aside className="lg:w-1/3">
              <div className={`rounded-[32px] shadow-2xl p-8 sticky top-8 ${
                isDarkMode
                  ? 'bg-slate-900/70 border border-slate-800 text-gray-100 backdrop-blur'
                  : 'bg-white border border-slate-100 text-slate-900'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className={`text-xs uppercase tracking-[0.35em] ${isDarkMode ? 'text-gray-400' : 'text-slate-400'}`}>Filters</p>
                    <h2 className="text-2xl font-bold">Fine-tune search</h2>
                  </div>
                  <button onClick={resetFilters} className="text-sm text-wazafny-blue font-semibold hover:underline">
                    Reset
                  </button>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>Keyword</label>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="e.g. Product Designer"
                      className={`w-full rounded-2xl border px-4 py-3 focus:ring-2 ${
                        isDarkMode
                          ? 'bg-slate-900/40 border-slate-700 text-gray-100 placeholder-gray-500 focus:border-wazafny-blue focus:ring-wazafny-blue/30'
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-wazafny-blue focus:ring-wazafny-blue/20'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>Location</label>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      placeholder="City or remote"
                      className={`w-full rounded-2xl border px-4 py-3 focus:ring-2 ${
                        isDarkMode
                          ? 'bg-slate-900/40 border-slate-700 text-gray-100 placeholder-gray-500 focus:border-wazafny-blue focus:ring-wazafny-blue/30'
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-wazafny-blue focus:ring-wazafny-blue/20'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className={`w-full rounded-2xl border px-4 py-3 ${
                        isDarkMode ? 'bg-slate-900/40 border-slate-700 text-gray-100' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="">All Categories</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Product">Product</option>
                      <option value="Data Science">Data Science</option>
                    </select>
                  </div>
                  <div>
                    <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>Job Type</label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className={`w-full rounded-2xl border px-4 py-3 ${
                        isDarkMode ? 'bg-slate-900/40 border-slate-700 text-gray-100' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="">All Types</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>Work Mode</label>
                    <select
                      value={filters.remote}
                      onChange={(e) => handleFilterChange('remote', e.target.value)}
                      className={`w-full rounded-2xl border px-4 py-3 ${
                        isDarkMode ? 'bg-slate-900/40 border-slate-700 text-gray-100' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="">All</option>
                      <option value="true">Remote</option>
                      <option value="false">On-site</option>
                    </select>
                  </div>
                  <div>
                    <label className={`text-sm font-semibold mb-2 block ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>Experience</label>
                    <select
                      value={filters.experience}
                      onChange={(e) => handleFilterChange('experience', e.target.value)}
                      className={`w-full rounded-2xl border px-4 py-3 ${
                        isDarkMode ? 'bg-slate-900/40 border-slate-700 text-gray-100' : 'bg-white border-slate-200 text-slate-900'
                      }`}
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

            {/* Jobs */}
            <main className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-12 h-12 border-t-2 border-wazafny-blue border-solid rounded-full animate-spin"></div>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div
                  className={`rounded-[32px] border shadow-2xl p-10 text-center ${
                    isDarkMode
                      ? 'bg-slate-900/60 border-slate-800 text-gray-100'
                      : 'bg-white border-slate-100 text-slate-900'
                  }`}
                >
                  <h3 className="text-2xl font-bold mb-3">No matches yet</h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-slate-500'} mb-6`}>
                    Adjust your filters or subscribe to alerts for early access.
                  </p>
                  <button onClick={resetFilters} className="px-6 py-3 rounded-full bg-wazafny-blue text-white font-semibold">
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {filteredJobs.map((job) => (
                    <Link
                      key={job.id}
                      to={`/jobs/${job.id}`}
                      className={`block rounded-[28px] border p-6 hover:-translate-y-1 transition ${
                        isDarkMode
                          ? 'bg-slate-900/60 border-slate-800 text-gray-100 shadow-[0_20px_60px_rgba(15,23,42,0.35)]'
                          : 'bg-white border-slate-100 text-slate-900 shadow-[0_15px_60px_rgba(15,23,42,0.08)]'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-16 h-16 rounded-2xl border flex items-center justify-center ${
                              isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-100'
                            }`}
                          >
                            <img src={job.companyLogo} alt={job.company} className="w-12 h-12 object-contain" />
                          </div>
                          <div>
                            <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>{job.company}</p>
                            <h3 className="text-2xl font-semibold">{job.title}</h3>
                            <div className="flex flex-wrap gap-2 mt-3 text-sm">
                              <span
                                className={`px-3 py-1 rounded-full border ${
                                  isDarkMode ? 'bg-slate-900/40 border-slate-700 text-gray-200' : 'bg-slate-100 border-slate-200 text-slate-700'
                                }`}
                              >
                                {job.location}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full border ${
                                  isDarkMode ? 'bg-blue-500/10 border-blue-500/30 text-blue-200' : 'bg-blue-50 border-blue-100 text-blue-700'
                                }`}
                              >
                                {job.type}
                              </span>
                              {job.remote && (
                                <span
                                  className={`px-3 py-1 rounded-full border ${
                                    isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                  }`}
                                >
                                  Remote
                                </span>
                              )}
                              <span
                                className={`px-3 py-1 rounded-full border ${
                                  isDarkMode ? 'bg-purple-500/10 border-purple-500/30 text-purple-200' : 'bg-purple-50 border-purple-100 text-purple-700'
                                }`}
                              >
                                {job.experience}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-wazafny-blue">{job.salary}</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                            Posted {new Date(job.postedDate).toLocaleDateString()}
                          </p>
                          <button
                            className={`mt-4 px-5 py-2 rounded-full border text-sm font-semibold transition ${
                              isDarkMode
                                ? 'border-slate-700 text-gray-200 hover:bg-slate-900'
                                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            View role
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobListings;
