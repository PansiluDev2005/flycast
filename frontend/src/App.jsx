import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
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
        <div className="min-h-screen flex flex-col bg-bg-dark text-text-main font-sans selection:bg-primary/30">
          <Navbar />
          
          <main className="flex-1 container mx-auto px-6 pb-20">
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
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
