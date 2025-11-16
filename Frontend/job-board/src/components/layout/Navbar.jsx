import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const dashboardPath = user?.role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard';

  const navBackgroundClasses = scrolled
    ? (isDarkMode
        ? 'bg-slate-950 border-b border-slate-800 shadow-lg shadow-slate-900/40 text-gray-100'
        : 'bg-white border-b border-gray-200 shadow-lg text-gray-900')
    : (isDarkMode
        ? 'bg-slate-950/95 border-b border-slate-800/70 text-gray-100'
        : 'bg-white border-b border-transparent text-gray-900');

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-xl ${navBackgroundClasses}`}>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with animation */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300 dark:text-transparent">
                Wazafny
              </div>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
            </div>
          </Link>

          {/* Centered Navigation Links with animations */}
          <div className="hidden md:flex items-center space-x-2 flex-1 justify-center">
            {[
              { to: '/', label: 'Home', color: 'blue' },
              { to: '/companies', label: 'Companies', color: 'green' },
              { to: '/jobs', label: 'Job Listings', color: 'purple' },
              { to: '/services', label: 'Services', color: 'orange' }
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 group ${
                  isDarkMode 
                    ? 'text-gray-200 hover:text-white' 
                    : 'text-gray-900 hover:text-black'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                {/* Show active underline for current page (except Home) */}
                {isActive(item.to) && item.to !== '/' && (
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 ${
                    item.color === 'blue' ? 'bg-blue-500' :
                    item.color === 'green' ? 'bg-green-500' :
                    item.color === 'purple' ? 'bg-purple-500' :
                    item.color === 'orange' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}></div>
                )}
                {/* Show hover underline for non-active pages or Home */}
                {(!isActive(item.to) || item.to === '/') && (
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 group-hover:w-3/4 transition-all duration-300 ${
                    item.color === 'blue' ? 'bg-blue-500' :
                    item.color === 'green' ? 'bg-green-500' :
                    item.color === 'purple' ? 'bg-purple-500' :
                    item.color === 'orange' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}></div>
                )}
              </Link>
            ))}
          </div>

          {/* Right Side - Auth Buttons with animations */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                isDarkMode
                  ? 'border-slate-700 text-gray-200 hover:bg-slate-800'
                  : 'border-gray-300 text-gray-900 hover:bg-gray-50'
              }`}
            >
              {isDarkMode ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
              <span>{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={dashboardPath}
                  className={`relative px-4 py-2 font-medium transition-all duration-300 group ${
                    isDarkMode
                      ? 'text-gray-200 hover:text-white'
                      : 'text-gray-900 hover:text-black'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-teal-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Dashboard</span>
                </Link>
                
                {/* Enhanced User Profile */}
                <div className="hidden lg:block w-10 h-10 rounded-full border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800"></div>

                <button
                  onClick={handleLogout}
                  className={`relative px-4 py-2 font-medium transition-all duration-300 group ${
                    isDarkMode
                      ? 'text-gray-300 hover:text-red-400'
                      : 'text-gray-900 hover:text-red-600'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-pink-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Logout</span>
                </button>
                {/* Theme toggle in main header */}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`relative px-6 py-2 font-medium transition-all duration-300 group overflow-hidden ${
                    isDarkMode
                      ? 'text-blue-300 hover:text-blue-200'
                      : 'text-blue-700 hover:text-blue-800'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Log in</span>
                </Link>
                
                <Link
                  to="/register"
                  className="relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`relative p-3 rounded-xl border transition-all duration-300 transform hover:scale-105 ${
                isDarkMode
                  ? 'bg-slate-900/80 text-gray-100 border-slate-700 hover:bg-slate-800'
                  : 'bg-gradient-to-r from-blue-50 to-purple-50 text-gray-600 border-white/50 hover:text-gray-900 hover:from-blue-100 hover:to-purple-100'
              }`}
            >
              <span className="sr-only">Open main menu</span>
              <div className="w-6 h-6 relative">
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : 'translate-y-0'
                  }`}
                ></span>
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out mt-1.5 ${
                    isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                  }`}
                ></span>
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out mt-3 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : 'translate-y-0'
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu with animations */}
      <div className={`md:hidden relative overflow-hidden transition-all duration-300 ease-out ${
        isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 backdrop-blur-lg border-t border-gray-200/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:border-slate-800">
          <div className="px-6 py-6 space-y-2">
            {[
              { to: '/', label: 'Home' },
              { to: '/companies', label: 'Companies' },
              { to: '/jobs', label: 'Job Listings' },
              { to: '/services', label: 'Services' }
            ].map((item, index) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block w-full text-left py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  isActive(item.to)
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/70 hover:shadow-md dark:text-gray-200 dark:hover:text-white dark:hover:bg-slate-800'
                }`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: isMobileMenuOpen ? 'slideInRight 0.3s ease-out forwards' : 'none'
                }}
              >
                {item.label}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                to={dashboardPath}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block w-full text-left py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  isActive(dashboardPath)
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white/70 hover:shadow-md dark:text-gray-200 dark:hover:text-white dark:hover:bg-slate-800'
                }`}
                style={{ animationDelay: `${4 * 100}ms`, animation: isMobileMenuOpen ? 'slideInRight 0.3s ease-out forwards' : 'none' }}
              >
                Dashboard
              </Link>
            )}

            <button
              onClick={() => {
                toggleTheme();
                setIsMobileMenuOpen(false);
              }}
              className="mt-4 w-full flex items-center justify-between py-3 px-4 rounded-xl border border-gray-200/60 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-white/70 transition-all duration-300 dark:border-slate-700 dark:text-gray-200 dark:hover:text-white dark:hover:bg-slate-800"
            >
              <span>{isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {!isAuthenticated && (
              <div className="pt-6 space-y-3 border-t border-gray-200/50 mt-6">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-3 px-4 text-blue-600 hover:text-blue-700 font-medium rounded-xl transition-all duration-300 hover:bg-blue-50 dark:text-blue-300 dark:hover:text-blue-200 dark:hover:bg-slate-800"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add custom keyframes for mobile menu animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
