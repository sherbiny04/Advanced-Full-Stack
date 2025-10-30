import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import JobListings from './pages/JobListings';
import JobDetails from './pages/JobDetails';
import EmployerDashboard from './pages/EmployerDashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Companies from './pages/Companies';
import Services from './pages/Services';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen">
      {!isAuthPage && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/services" element={<Services />} />
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/jobseeker/dashboard" element={<JobSeekerDashboard />} />
          <Route path="/seeker/dashboard" element={<JobSeekerDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      {!isDashboard && !isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <JobProvider>
          <AppContent />
        </JobProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
