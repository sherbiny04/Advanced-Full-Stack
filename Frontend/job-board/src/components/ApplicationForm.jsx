import { useState } from 'react';

const ApplicationForm = ({ job, onSubmit, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    fullName: '',
    email: '',
    phone: '',
    
    // Step 2: Experience & Skills
    yearsOfExperience: '',
    relevantSkills: '',
    keyAchievements: '',
    
    // Step 3: Motivation & Availability
    motivationLetter: '',
    availability: 'Immediately',
    noticePeriod: '',
    
    // Step 4: Final Review
    termsAccepted: false
  });

  const totalSteps = 4;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.email && formData.phone;
      case 2:
        return formData.yearsOfExperience && formData.relevantSkills;
      case 3:
        return formData.motivationLetter && formData.availability;
      case 4:
        return formData.termsAccepted;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Experience & Skills</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years of Relevant Experience *</label>
              <select
                value={formData.yearsOfExperience}
                onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select experience level</option>
                <option value="0-1">0-1 years</option>
                <option value="2-3">2-3 years</option>
                <option value="4-5">4-5 years</option>
                <option value="6-8">6-8 years</option>
                <option value="9+">9+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relevant Skills *</label>
              <textarea
                rows={4}
                value={formData.relevantSkills}
                onChange={(e) => handleInputChange('relevantSkills', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="List your relevant skills and technologies..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Achievements</label>
              <textarea
                rows={3}
                value={formData.keyAchievements}
                onChange={(e) => handleInputChange('keyAchievements', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your key professional achievements..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Motivation & Availability</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Why are you interested in this position? *</label>
              <textarea
                rows={4}
                value={formData.motivationLetter}
                onChange={(e) => handleInputChange('motivationLetter', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Explain your motivation for applying to this position..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability *</label>
              <select
                value={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Immediately">Immediately</option>
                <option value="1 week">Within 1 week</option>
                <option value="2 weeks">Within 2 weeks</option>
                <option value="1 month">Within 1 month</option>
                <option value="2 months">Within 2 months</option>
                <option value="3+ months">3+ months</option>
              </select>
            </div>

            {formData.availability !== 'Immediately' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notice Period Details</label>
                <input
                  type="text"
                  value={formData.noticePeriod}
                  onChange={(e) => handleInputChange('noticePeriod', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Explain your notice period or availability details..."
                />
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Review & Submit</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="border-b border-gray-200 pb-3">
                <h4 className="font-semibold text-gray-800">Personal Information</h4>
                <p className="text-sm text-gray-600">Name: {formData.fullName}</p>
                <p className="text-sm text-gray-600">Email: {formData.email}</p>
                <p className="text-sm text-gray-600">Phone: {formData.phone}</p>
              </div>
              
              <div className="border-b border-gray-200 pb-3">
                <h4 className="font-semibold text-gray-800">Experience</h4>
                <p className="text-sm text-gray-600">Years: {formData.yearsOfExperience}</p>
                <p className="text-sm text-gray-600">Skills: {formData.relevantSkills?.substring(0, 100)}...</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800">Availability</h4>
                <p className="text-sm text-gray-600">{formData.availability}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.termsAccepted}
                onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the terms and conditions and confirm that all information provided is accurate. *
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Apply for Position</h2>
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

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          
          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isStepValid()
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid()}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isStepValid()
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;