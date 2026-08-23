import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Predictor from './pages/Predictor';
import Dashboard from './pages/Dashboard';
import PassengerDashboard from './pages/PassengerDashboard';
import Admin from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
          
          {/* Ambient Cosmic Background Lighting */}
          <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow"></div>
          <div className="fixed top-1/3 right-10 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[160px] pointer-events-none -z-10"></div>
          <div className="fixed bottom-10 left-1/3 w-[550px] h-[550px] bg-indigo-600/6 rounded-full blur-[150px] pointer-events-none -z-10"></div>
          
          {/* Subtle Radar Grid Background */}
          <div className="fixed inset-0 bg-radar-grid pointer-events-none opacity-40 -z-10"></div>

          <Navbar />
          
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/passenger" 
                element={
                  <ProtectedRoute allowedRoles={['passenger', 'admin']}>
                    <PassengerDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/predictor" 
                element={
                  <ProtectedRoute allowedRoles={['passenger', 'dispatcher', 'admin']}>
                    <Predictor />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['dispatcher', 'admin']}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
