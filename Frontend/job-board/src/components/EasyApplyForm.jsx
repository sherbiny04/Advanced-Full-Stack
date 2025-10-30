import { useState, useEffect } from 'react';

const EasyApplyForm = ({ job, user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    cv: null
  });

  const [uploading, setUploading] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    
    // Validate file type (PDF, DOC, DOCX)
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid CV file (PDF, DOC, or DOCX)');
      e.target.value = '';
      return;
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert('CV file size must be less than 5MB');
      e.target.value = '';
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      cv: file
    }));
  };

  const isFormValid = () => {
    return formData.email && formData.phone && formData.cv;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!isFormValid()) return;
    
    setUploading(true);
    
    // Submit the form data including user profile info
    onSubmit({
      ...formData,
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      profession: user?.jobTitle || '',
      applicationType: 'easy_apply'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Easy Apply</h2>
              <p className="text-sm opacity-90">{job?.title} at {job?.company}</p>
            </div>
            <button
              onClick={onCancel}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                user?.firstName?.charAt(0)?.toUpperCase() || 'U'
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-sm text-gray-600">
                {user?.jobTitle || 'Professional'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email address"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* CV Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload CV *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="easy-cv-upload"
                required
              />
              <label htmlFor="easy-cv-upload" className="cursor-pointer">
                {formData.cv ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-600 font-medium text-sm">{formData.cv.name}</span>
                  </div>
                ) : (
                  <div>
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-600 font-medium text-sm">Click to upload your CV</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX (Max 5MB)</p>
                  </div>
                )}
              </label>
            </div>
          </div>

        </form>

        {/* Submit Buttons - Outside form to prevent overlap */}
        <div className="px-6 py-4 bg-gray-50 border-t flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid() || uploading}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
              isFormValid() && !uploading
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {uploading ? 'Applying...' : 'Easy Apply'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EasyApplyForm;