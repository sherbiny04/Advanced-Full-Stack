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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center text-wazafny-blue hover:text-wazafny-darkBlue mb-6 font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </button>

        {/* Job Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="flex items-start gap-6 mb-6">
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-24 h-24 object-contain rounded-lg border border-gray-200 p-3"
            />
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-xl text-gray-700 mb-4">{job.company}</p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {job.location}
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {job.type}
                </span>
                {job.remote && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Remote
                  </span>
                )}
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  {job.experience}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Salary Range</p>
              <p className="text-2xl font-bold text-wazafny-blue">{job.salary}</p>
            </div>
            <button
              onClick={() => setShowApplicationModal(true)}
              className="btn-primary"
            >
              Apply Now
            </button>
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
          <p className="text-gray-700 leading-relaxed mb-6">{job.description}</p>

          <h3 className="text-xl font-bold text-gray-900 mb-3">Requirements</h3>
          <ul className="list-disc list-inside space-y-2 mb-6">
            {job.requirements.map((req, index) => (
              <li key={index} className="text-gray-700">{req}</li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mb-3">Benefits</h3>
          <ul className="list-disc list-inside space-y-2">
            {job.benefits.map((benefit, index) => (
              <li key={index} className="text-gray-700">{benefit}</li>
            ))}
          </ul>
        </div>

        {/* Application Modal */}
        {showApplicationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h2>
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
    </div>
  );
};

export default JobDetails;
