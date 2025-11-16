import { useTheme } from '../hooks/useTheme';

const Services = () => {
  const { isDarkMode } = useTheme();
  const services = [
    {
      title: 'Intelligent Job Intelligence',
      description: 'AI-assisted search, personalized job matches and curated insights based on your career goals.',
      accent: 'from-blue-500/20 to-blue-500/0',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
      )
    },
    {
      title: 'Executive Resume Studio',
      description: 'Polished resumes, portfolio sites and one-click profile sharing built with recruiter feedback.',
      accent: 'from-purple-500/20 to-purple-500/0',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 16h8M8 12h8m-6-8h4l4 4v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h4z" />
        </svg>
      )
    },
    {
      title: 'Career Advisory Circle',
      description: 'Access interview coaching, salary guidance and curated masterclasses led by industry leaders.',
      accent: 'from-rose-500/20 to-rose-500/0',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z" />
        </svg>
      )
    },
    {
      title: 'Reputation & Insights Cloud',
      description: '360° employer profiles with verified employee stories, DEI stats and cultural indicators.',
      accent: 'from-amber-500/20 to-amber-500/0',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )
    },
    {
      title: 'Compensation Intelligence',
      description: 'Live salary benchmarks, equity tracking and real-time market demand indicators.',
      accent: 'from-emerald-500/20 to-emerald-500/0',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1m9-8a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Proactive Talent Alerts',
      description: 'Signal-based notifications for new roles, internal moves and curated headhunter invites.',
      accent: 'from-indigo-500/20 to-indigo-500/0',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19V6a3 3 0 016 0v13m-9 0h12" />
        </svg>
      )
    }
  ];

  const stats = [
    { value: '32k+', label: 'placements each year' },
    { value: '12 days', label: 'avg. time-to-offer' },
    { value: '94%', label: 'talent satisfaction' },
    { value: '2.1k', label: 'enterprise partners' }
  ];

  const workflow = [
    { title: 'Discover & Diagnose', copy: 'Deep-dive intake, market mapping and personalized success planning for every search.' },
    { title: 'Craft & Showcase', copy: 'Executive resume studio, bespoke portfolio builds and brand-safe company storytelling.' },
    { title: 'Match & Orchestrate', copy: 'AI-curated shortlists, structured interviews and collaborative feedback rooms.' },
    { title: 'Decide & Scale', copy: 'Offer intelligence, onboarding playbooks and post-placement success metrics.' }
  ];

  const testimonials = [
    {
      quote: 'The caliber of candidates tripled overnight. Transparent data and concierge support made every shortlist feel curated for us.',
      author: 'Layla Morgan',
      role: 'VP Talent, Sphere AI'
    },
    {
      quote: 'I closed my new role in under two weeks with salary clarity and a tailored interview masterclass. Game changer.',
      author: 'Daniel Cho',
      role: 'Director of Product'
    },
    {
      quote: 'Wazafny became an extension of our people team—workflow automation plus human expertise at every touchpoint.',
      author: 'Mina Al-Taher',
      role: 'Chief People Officer, LumenPay'
    }
  ];

  const benefits = {
    seekers: [
      'Private briefings on stealth and executive roles',
      'Portfolio-ready case studies and brand positioning',
      'Concierge interview coaching with on-demand content',
      'Offer negotiation desk with compensation strategists'
    ],
    employers: [
      'Programmatic campaigns that reach niche talent pools',
      'Structured hiring pods and decision dashboards',
      'DEI analytics baked into every slate',
      'Dedicated success partner with quarterly planning'
    ]
  };

  return (
    <div className={isDarkMode ? 'bg-slate-950 text-gray-100' : 'bg-white text-slate-900'}>
      {/* Hero */}
      <section
        className={`relative overflow-hidden ${
          isDarkMode ? 'bg-gradient-to-br from-[#0A1F44] via-[#111C3A] to-[#030712]' : 'bg-gradient-to-br from-slate-50 via-white to-blue-50/30'
        }`}
      >
        <div
          className={`absolute inset-0 ${isDarkMode ? 'opacity-40' : 'opacity-30'}`}
          style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15), transparent 55%)' }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <p
                className={`inline-flex items-center text-xs uppercase tracking-[0.3em] mb-6 ${
                  isDarkMode ? 'text-blue-200/70' : 'text-wazafny-blue/70'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-wazafny-blue to-purple-500 mr-3"></span>
                Talent Operating System
              </p>
              <h1
                className={`text-4xl md:text-5xl xl:text-6xl font-black leading-tight mb-6 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                Professional services engineered for ambitious teams & elite talent.
              </h1>
              <p
                className={`text-lg leading-relaxed mb-10 max-w-2xl ${
                  isDarkMode ? 'text-blue-100/80' : 'text-slate-600'
                }`}
              >
                From first search to final signature, Wazafny blends data, design, and human insight to choreograph unforgettable hiring and career experiences.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/register"
                  className={`px-8 py-4 rounded-full font-semibold shadow-2xl hover:-translate-y-0.5 transition-transform ${
                    isDarkMode
                      ? 'bg-white text-slate-900 shadow-blue-600/40'
                      : 'bg-slate-900 text-white shadow-slate-300/40'
                  }`}
                >
                  Speak with a strategist
                </a>
                <a
                  href="/jobs"
                  className={`px-8 py-4 rounded-full border transition ${
                    isDarkMode ? 'border-white/40 text-white/90 hover:bg-white/10' : 'border-slate-200 text-slate-900 hover:bg-white/60'
                  }`}
                >
                  Explore the platform
                </a>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div
                className={`rounded-3xl p-8 backdrop-blur relative ${
                  isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-100 shadow-2xl'
                }`}
              >
                <div className="absolute -top-10 right-10 w-24 h-24 bg-gradient-to-br from-wazafny-blue to-purple-500 rounded-3xl blur-2xl opacity-40"></div>
                <p
                  className={`text-sm uppercase tracking-[0.35em] mb-6 ${
                    isDarkMode ? 'text-white/50' : 'text-slate-500'
                  }`}
                >
                  By the numbers
                </p>
                <div className="grid grid-cols-2 gap-6 relative">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className={`rounded-2xl px-5 py-6 ${
                        isDarkMode ? 'bg-white/5' : 'bg-slate-50 border border-slate-100 shadow-inner'
                      }`}
                    >
                      <p className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                      <p className={`text-sm mt-2 ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className={`${isDarkMode ? 'bg-slate-950 border-white/5' : 'bg-white border-slate-100 border-b'}`}>
        <div
          className={`max-w-6xl mx-auto px-6 py-12 flex flex-wrap justify-center gap-10 text-xs uppercase tracking-[0.35em] ${
            isDarkMode ? 'text-white/50' : 'text-slate-500'
          }`}
        >
          {['Aurora Bank', 'Sphere AI', 'Northwind', 'Cloudly', 'LumenPay'].map((brand) => (
            <span key={brand} className="opacity-60 hover:opacity-100 transition-opacity">
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* Services grid */}
      <section className={isDarkMode ? 'bg-slate-950 text-gray-100' : 'bg-white text-slate-900'}>
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
            <div>
              <p className="text-sm font-semibold text-wazafny-blue tracking-[0.3em] uppercase mb-3">Services</p>
              <h2 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                A boutique suite for modern hiring journeys.
              </h2>
            </div>
            <p className={`max-w-2xl text-lg ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              Each service interlocks to deliver clarity, speed and confidence—whether you are shaping a leadership team or accelerating a personal pivot.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className={`relative rounded-3xl border p-8 overflow-hidden group transition ${
                  isDarkMode
                    ? 'border-slate-800 bg-slate-900/60 shadow-[0_25px_80px_rgba(2,6,23,0.55)]'
                    : 'border-slate-100 bg-gradient-to-b from-white to-slate-50 shadow-[0_20px_80px_rgba(15,23,42,0.08)]'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                      isDarkMode ? 'bg-white/10 text-white' : 'bg-slate-900 text-white'
                    }`}
                  >
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-slate-600'} leading-relaxed`}>{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual benefits */}
      <section className={isDarkMode ? 'bg-slate-900 text-gray-100' : 'bg-slate-50 text-slate-900'}>
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12">
          <div className="p-10 rounded-[36px] bg-gradient-to-br from-wazafny-blue via-indigo-500 to-purple-600 text-white shadow-2xl">
            <h3 className="text-sm uppercase tracking-[0.4em] text-white/80 mb-4">For Job Seekers</h3>
            <h4 className="text-3xl font-bold mb-8">Concierge experiences for top-tier candidates.</h4>
            <ul className="space-y-4">
              {benefits.seekers.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-lg text-white/90">
                  <span className="w-2 h-2 rounded-full bg-white mt-2"></span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div
            className={`p-10 rounded-[36px] shadow-xl border ${
              isDarkMode ? 'bg-slate-900/50 border-slate-800 text-gray-100' : 'bg-white border-slate-100 text-slate-900'
            }`}
          >
            <h3 className={`text-sm uppercase tracking-[0.4em] mb-4 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>For Employers</h3>
            <h4 className="text-3xl font-bold mb-8">An embedded talent partner for every mandate.</h4>
            <ul className="space-y-4">
              {benefits.employers.map((benefit) => (
                <li
                  key={benefit}
                  className={`flex items-start gap-3 text-lg ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}
                >
                  <span className={`w-2 h-2 rounded-full mt-2 ${isDarkMode ? 'bg-white/40' : 'bg-slate-300'}`}></span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className={isDarkMode ? 'bg-slate-950 text-gray-100' : 'bg-white text-slate-900'}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.4em] text-wazafny-blue mb-4">Signature workflow</p>
            <h2 className="text-4xl font-black">Designed for clarity at every milestone.</h2>
          </div>
          <div className="relative">
            <div
              className={`absolute left-1/2 top-0 bottom-0 w-px hidden lg:block ${
                isDarkMode ? 'bg-gradient-to-b from-transparent via-slate-800 to-transparent' : 'bg-gradient-to-b from-transparent via-slate-200 to-transparent'
              }`}
            ></div>
            <div className="space-y-12">
              {workflow.map((step, index) => (
                <div key={step.title} className={`lg:flex lg:items-center lg:gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="lg:w-1/2">
                    <div className="inline-flex items-center gap-3 text-sm font-semibold text-wazafny-blue mb-4">
                      <span
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          isDarkMode ? 'bg-white/10 text-white' : 'bg-wazafny-blue/10 text-wazafny-blue'
                        }`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {step.title}
                    </div>
                    <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>{step.copy}</p>
                  </div>
                  <div className="lg:w-1/2 lg:px-10">
                    <div
                      className={`h-full rounded-3xl border p-8 text-sm leading-relaxed ${
                        isDarkMode
                          ? 'border-slate-800 bg-slate-900/60 text-gray-300 shadow-inner shadow-black/20'
                          : 'border-slate-100 bg-slate-50 text-slate-500'
                      }`}
                    >
                      “We obsess over the signals that matter, keeping teams aligned and candidates informed.”
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <div>
              <p className={`text-sm uppercase tracking-[0.4em] mb-3 ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>Testimonials</p>
              <h2 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Proof from leaders who trust us.
              </h2>
            </div>
            <p className={`max-w-xl text-lg ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>
              Curated feedback from partners navigating high-stakes growth, transformation and career pivots.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.author}
                className={`rounded-3xl p-8 backdrop-blur border ${
                  isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-xl'
                }`}
              >
                <p className={`text-lg leading-relaxed mb-8 ${isDarkMode ? 'text-white/80' : 'text-slate-600'}`}>
                  “{testimonial.quote}”
                </p>
                <div>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{testimonial.author}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-wazafny-blue via-indigo-600 to-purple-700">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="text-sm uppercase tracking-[0.5em] text-white/70 mb-6">Next step</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Let’s architect your next hiring win.</h2>
          <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto">
            Schedule a private strategy session and see how Wazafny can elevate your employer brand and candidate experience end-to-end.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className={`px-10 py-4 rounded-full font-semibold shadow-xl hover:-translate-y-0.5 transition-transform ${
                isDarkMode ? 'bg-white text-slate-900' : 'bg-white text-slate-900'
              }`}
            >
              Book a strategy call
            </a>
            <a
              href="/jobs"
              className="px-10 py-4 rounded-full border border-white/50 text-white/90 hover:bg-white/10"
            >
              Download the services deck
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
