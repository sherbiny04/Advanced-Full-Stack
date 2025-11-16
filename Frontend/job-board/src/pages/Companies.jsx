import { useState, useEffect } from 'react';
import { companiesAPI } from '../services/api';
import { useTheme } from '../hooks/useTheme';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await companiesAPI.getAll();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const spotlight = companies.slice(0, 3);

  const containerClasses = isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900';
  const heroClasses = isDarkMode
    ? 'bg-gradient-to-br from-[#030712] via-[#111C3A] to-[#0A1F44] text-white'
    : 'bg-gradient-to-br from-blue-50 via-white to-white text-slate-900';
  const gridSectionClasses = isDarkMode
    ? 'bg-slate-900 text-white'
    : 'bg-slate-100 text-slate-900';
  const ctaClasses = isDarkMode
    ? 'bg-gradient-to-br from-[#101C3D] via-[#131A3A] to-[#05090F]'
    : 'bg-gradient-to-br from-wazafny-blue via-indigo-600 to-purple-700';

  const stats = [
    { value: '2.1K', label: 'active partners' },
    { value: '64%', label: 'series B & beyond' },
    { value: '38%', label: 'remote-first teams' }
  ];

  return (
    <div className={`${containerClasses}`}>
      {/* Hero */}
      <section className={`relative overflow-hidden ${heroClasses}`}>
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: isDarkMode
              ? 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15), transparent 55%)'
              : 'radial-gradient(circle at 15% 25%, rgba(37,99,235,0.12), transparent 55%)'
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs uppercase tracking-[0.4em] text-blue-100/70 mb-4">Partner ecosystem</p>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6">
                Meet the brands shaping tomorrow’s talent experience.
              </h1>
              <p className="text-lg text-blue-100/80 max-w-2xl mb-10">
                From stealth startups to Fortune 500 innovators, Wazafny partners showcase transparent culture, growth tracks and bold missions.
              </p>
              <div className="flex flex-wrap gap-5">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-2xl px-6 py-4 border ${
                      isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow'
                    }`}
                  >
                    <p className="text-3xl font-black">{stat.value}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-500'}`}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className={`rounded-[32px] p-6 backdrop-blur border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl'}`}>
                <p className={`text-sm uppercase tracking-[0.4em] mb-4 ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>Spotlight</p>
                <div className="space-y-4">
                  {spotlight.map((company) => (
                    <div
                      key={company.id}
                      className={`rounded-2xl border p-4 ${
                        isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-white' : 'bg-slate-50 border border-slate-200'}`}>
                          <img src={company.logo} alt={company.name} className="w-10 h-10 object-contain" />
                        </div>
                        <div>
                          <p className={`text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-500'}`}>{company.industry}</p>
                          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{company.name}</h3>
                        </div>
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-500'}`}>{company.location} • {company.size}</p>
                    </div>
                  ))}
                  {spotlight.length === 0 && (
                    <p className={`text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-500'}`}>
                      No companies yet—check back soon.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className={gridSectionClasses}>
        <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <p className={`text-sm uppercase tracking-[0.4em] mb-3 ${isDarkMode ? 'text-blue-200' : 'text-wazafny-blue'}`}>Featured partners</p>
              <h2 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Culture-forward teams with transparent playbooks.
              </h2>
            </div>
            <p className={`max-w-xl text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Every profile includes deep dives on mission, rituals, interview flow and compensation philosophy—no more guesswork.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className={`w-12 h-12 border-t-2 border-solid rounded-full animate-spin ${isDarkMode ? 'border-white/40' : 'border-wazafny-blue'}`}></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className={`rounded-[32px] p-8 flex flex-col h-full border ${
                    isDarkMode
                      ? 'bg-slate-800/60 border-slate-700 shadow-[0_20px_70px_rgba(15,23,42,0.45)]'
                      : 'bg-white border-slate-100 shadow-[0_25px_80px_rgba(15,23,42,0.08)]'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${
                        isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'
                      }`}
                    >
                      <img src={company.logo} alt={company.name} className="w-12 h-12 object-contain" />
                    </div>
                    <div>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>{company.industry}</p>
                      <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{company.name}</h3>
                    </div>
                  </div>
                  <p className={`leading-relaxed flex-1 mb-6 ${isDarkMode ? 'text-slate-200' : 'text-slate-600'}`}>{company.description}</p>
                  <div className={`space-y-3 text-sm mb-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-wazafny-blue"></span>
                      {company.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      {company.size}
                    </div>
                    {company.perks && (
                      <div className="flex flex-wrap gap-2">
                        {company.perks.split(',').slice(0, 3).map((perk) => (
                          <span
                            key={perk}
                            className={`px-3 py-1 rounded-full text-xs border ${
                              isDarkMode
                                ? 'bg-slate-900 text-slate-200 border-slate-700'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {perk.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition ${
                      isDarkMode ? 'bg-white text-slate-900 hover:bg-blue-100' : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    Visit profile
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 7l-10 10m0-6v6h6" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className={ctaClasses}>
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <p className={`text-sm uppercase tracking-[0.4em] mb-4 ${isDarkMode ? 'text-white/60' : 'text-white/70'}`}>Partner with us</p>
          <h2 className="text-4xl font-black text-white mb-6">Showcase your brand to a community of ready talent.</h2>
          <p className={`text-lg mb-8 ${isDarkMode ? 'text-white/80' : 'text-white/80'}`}>
            Request a concierge onboarding session and receive a bespoke company profile, recruitment marketing kit and candidate insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className={`px-8 py-4 rounded-full font-semibold ${isDarkMode ? 'bg-white text-slate-900' : 'bg-white text-slate-900'}`}
            >
              Book a showcase
            </a>
            <a href="mailto:partners@wazafny.com" className="px-8 py-4 rounded-full border border-white/60 text-white/90">
              Talk to partnerships
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Companies;
