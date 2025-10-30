import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    setLoading(false);

    if (result.success) {
      // Redirect based on user role
      if (result.user.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/seeker/dashboard');
      }
    } else {
      setError(result.error || 'Invalid email or password');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-6">
      {/* Main Container Card */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full flex gap-8 p-8">
        {/* Left Side - Visual/Branding Container */}
        <div className="w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-xl flex flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* AI Generated Background Images */}
        <div className="absolute inset-0">
          {/* Main hero image - AI generated style professional/tech scene */}
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=800&fit=crop&crop=center" 
              alt="AI Generated Tech Professional" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          
          {/* Overlay gradient to maintain readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 via-purple-700/70 to-indigo-800/80"></div>
          
          {/* Floating AI-style geometric elements */}
          <div className="absolute top-16 right-16 w-20 h-20 border border-white/20 rounded-lg rotate-12 backdrop-blur-sm bg-white/5"></div>
          <div className="absolute bottom-24 left-16 w-16 h-16 border border-white/30 rounded-full backdrop-blur-sm bg-white/10"></div>
          <div className="absolute top-1/3 left-8 w-12 h-12 border border-white/25 rounded-md rotate-45 backdrop-blur-sm bg-white/5"></div>
          
          {/* Subtle glow effects */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-400/15 rounded-full blur-xl"></div>
        </div>
        
        {/* Logo/Brand */}
        <div className="text-white text-center z-10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">WAZAFNY</h1>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
            <p className="text-purple-200 text-lg leading-relaxed">
              Continue your career journey with us.<br />
              Find your perfect opportunity today.
            </p>
            
            {/* AI-generated style career icons */}
            <div className="flex justify-center space-x-4 mt-6">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                <svg className="w-5 h-5 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v6l-3 1 3 1v6M8 6v6l3 1-3 1v6" />
                </svg>
              </div>
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                <svg className="w-5 h-5 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                <svg className="w-5 h-5 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Navigation dots */}
          <div className="flex space-x-2 justify-center">
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-8 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full">
          {/* Back button */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to website
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-400 hover:text-purple-300 underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Demo Credentials */}
          <div className="mb-6 bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4">
            <p className="text-sm font-semibold text-purple-300 mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-sm text-gray-300">
              <p><span className="font-semibold">Employer:</span> employer@google.com / password123</p>
              <p><span className="font-semibold">Job Seeker:</span> seeker@example.com / password123</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-white/30 transition-all duration-200"
                  placeholder="Email"
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-white/30 transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-300">
                I agree to the{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300 underline">
                  Terms & Conditions
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <p className="text-center text-gray-400 text-sm mb-4">Or sign in with</p>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-gray-300 hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-gray-300 hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;
