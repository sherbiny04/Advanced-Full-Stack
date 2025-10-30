import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50' 
        : 'bg-gradient-to-r from-white/90 via-blue-50/30 to-purple-50/30 backdrop-blur-md border-b border-white/20'
    }`}>
      {/* Gradient overlay for visual depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with animation */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
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
                className="relative px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 group text-gray-600 hover:text-gray-900"
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
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={user?.role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard'}
                  className="relative px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-teal-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Dashboard</span>
                </Link>
                
                {/* Enhanced User Profile */}
                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200/50 shadow-sm">
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <span className="text-gray-700 font-medium hidden lg:block">
                    {user?.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="relative px-4 py-2 text-gray-600 hover:text-red-600 font-medium transition-all duration-300 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-pink-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="relative px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 group overflow-hidden"
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
              className="relative p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 text-gray-600 hover:text-gray-900 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 transform hover:scale-105"
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
        <div className="bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 backdrop-blur-lg border-t border-gray-200/50">
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
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/70 hover:shadow-md'
                }`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: isMobileMenuOpen ? 'slideInRight 0.3s ease-out forwards' : 'none'
                }}
              >
                {item.label}
              </Link>
            ))}

            {!isAuthenticated && (
              <div className="pt-6 space-y-3 border-t border-gray-200/50 mt-6">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-3 px-4 text-blue-600 hover:text-blue-700 font-medium rounded-xl transition-all duration-300 hover:bg-blue-50"
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
