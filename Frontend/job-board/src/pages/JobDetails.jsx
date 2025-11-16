import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJobById, applyForJob } = useJobs();
  const { user, isAuthenticated, isSeeker } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: '',
  });
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    const jobData = await getJobById(id);
    setJob(jobData);
    setLoading(false);
  };

  const handleApply = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isSeeker()) {
      alert('Only job seekers can apply for jobs');
      return;
    }

    setApplying(true);
    const result = await applyForJob({
      jobId: job.id,
      seekerId: user.id,
      seekerName: user.name,
      seekerEmail: user.email,
      coverLetter: applicationData.coverLetter,
      resume: applicationData.resume || user.resume,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    });

    setApplying(false);

    if (result.success) {
      alert('Application submitted successfully!');
      setShowApplicationModal(false);
      setApplicationData({ coverLetter: '', resume: '' });
    } else {
      alert('Failed to submit application. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wazafny-blue"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h2>
          <button onClick={() => navigate('/jobs')} className="btn-primary">
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  const responsibilities = job.responsibilities?.length
    ? job.responsibilities
    : job.requirements || [];
  const benefits = job.benefits || [];
  const postedDate = job.postedDate
    ? new Date(job.postedDate).toLocaleDateString()
    : 'Recently posted';

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1F44] via-[#111C3A] to-[#030712]">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15), transparent 55%)',
          }}
        ></div>
        <div className="relative max-w-6xl mx-auto px-6 pt-10 pb-16">
          <button
            onClick={() => navigate('/jobs')}
            className="inline-flex items-center text-white/80 hover:text-white text-sm mb-8"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to listings
          </button>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center border border-white/40">
                  <img src={job.companyLogo} alt={job.company} className="w-14 h-14 object-contain" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-white/60 mb-2">{job.company}</p>
                  <h1 className="text-4xl font-black text-white">{job.title}</h1>
                </div>
              </div>
              <p className="text-white/80 text-lg mb-8 max-w-3xl">{job.description}</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  {job.location}
                </span>
                <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20">{job.type}</span>
                {job.remote && (
                  <span className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-100">
                    Remote-friendly
                  </span>
                )}
                <span className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-100">
                  {job.experience}
                </span>
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
                <p className="text-sm text-white/60 mb-2">Salary Range</p>
                <p className="text-3xl font-black text-white mb-6">{job.salary}</p>
                <div className="grid grid-cols-2 gap-4 text-white/80 text-sm mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">Experience</p>
                    <p className="font-semibold">{job.experience}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">Work mode</p>
                    <p className="font-semibold">{job.remote ? 'Remote' : 'On-site'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">Posted</p>
                    <p className="font-semibold">{postedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">Applicants</p>
                    <p className="font-semibold">{job.applicants || 'Fast-moving'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowApplicationModal(true)}
                  className="w-full px-6 py-4 rounded-full bg-white text-slate-900 font-semibold shadow-xl hover:-translate-y-0.5 transition"
                >
                  Apply now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-slate-100 text-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white rounded-[32px] p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
              <p className="text-sm uppercase tracking-[0.3em] text-wazafny-blue mb-4">Overview</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Role narrative</h2>
              <p className="text-slate-600 leading-relaxed">{job.longDescription || job.description}</p>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Key Responsibilities</h3>
                <span className="text-sm text-slate-400">What you’ll own</span>
              </div>
              <ul className="space-y-4">
                {responsibilities.map((item, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-wazafny-blue/10 text-wazafny-blue flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <p className="text-slate-600">{item}</p>
                  </li>
                ))}
                {responsibilities.length === 0 && (
                  <p className="text-slate-500">Detailed responsibilities will be shared during the interview process.</p>
                )}
              </ul>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Benefits & perks</h3>
                <span className="text-sm text-slate-400">Designed to support you</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 mt-2"></span>
                    <p className="text-slate-600">{benefit}</p>
                  </div>
                ))}
                {benefits.length === 0 && (
                  <p className="text-slate-500">The employer will share their benefits package during the interview process.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-[32px] p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-4">Company snapshot</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  <img src={job.companyLogo} alt={job.company} className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-slate-900">{job.company}</h4>
                  <p className="text-sm text-slate-500">{job.industry || 'Technology & Innovation'}</p>
                </div>
              </div>
              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Headquarters</span>
                  <span className="font-semibold">{job.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Team size</span>
                  <span className="font-semibold">{job.size || '200+'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Website</span>
                  <a href={job.website || '#'} target="_blank" rel="noopener noreferrer" className="font-semibold text-wazafny-blue">
                    Visit site
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-4">Role summary</p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center justify-between">
                  <span>Employment type</span>
                  <span className="font-semibold">{job.type}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Experience level</span>
                  <span className="font-semibold">{job.experience}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Compensation</span>
                  <span className="font-semibold">{job.salary}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Work arrangement</span>
                  <span className="font-semibold">{job.remote ? 'Remote' : 'On-site'}</span>
                </li>
              </ul>
              <button
                onClick={() => setShowApplicationModal(true)}
                className="w-full mt-6 px-6 py-3 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800"
              >
                Start application
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Apply for {job.title}</h2>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleApply} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                    rows="6"
                    placeholder="Tell us why you're a great fit for this role..."
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Resume/CV (Optional)
                  </label>
                  <input
                    type="text"
                    value={applicationData.resume}
                    onChange={(e) => setApplicationData({ ...applicationData, resume: e.target.value })}
                    placeholder="Link to your resume or CV"
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Provide a link to your resume (Google Drive, Dropbox, etc.)
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowApplicationModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
