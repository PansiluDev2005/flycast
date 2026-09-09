import { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  Plane, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Shield, 
  BarChart3, 
  Compass, 
  ArrowRight
} from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const authMessage = location.state?.message;

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      const { token, role } = res.data;
      
      login({ token, role, username });
      
      if (role === 'admin') navigate('/admin');
      else if (role === 'dispatcher') navigate('/dashboard');
      else navigate('/predictor');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-8 relative">
      
      {/* Background Airport Accent Overlay */}
      <div 
        className="absolute inset-0 max-w-4xl mx-auto rounded-3xl bg-cover bg-center opacity-10 pointer-events-none"
        style={{ backgroundImage: "url('/images/airport-terminal.jpg')" }}
      ></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Soft Ambient Glow */}
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-sky-200/50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-blue-200/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="bg-white/95 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl relative z-10 shadow-2xl border border-slate-200">
          
          {/* Header & Logo */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white mb-4 shadow-[0_6px_20px_rgba(14,165,233,0.35)]">
              <Plane className="w-8 h-8 -rotate-45" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">Operator Sign In</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Access the Flycast AI delay forecasting console</p>
          </div>

          {authMessage && (
            <div className="bg-red-500 text-white font-bold p-4 rounded-xl mb-6 text-sm text-center shadow-[0_4px_14px_rgba(239,68,68,0.3)] border border-red-400">
              {authMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl mb-6 text-xs font-mono-code font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4" autoComplete="off">
            
            <div>
              <label className="block text-xs font-mono-code text-slate-700 uppercase tracking-wider mb-2 font-bold">
                Username / Call-Sign
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm font-mono-code focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors pl-11"
                  autoComplete="off"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono-code text-slate-700 uppercase tracking-wider mb-2 font-bold">
                Access Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm font-mono-code focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors pl-11 pr-11"
                  autoComplete="new-password"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-2 w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(14,165,233,0.3)] flex justify-center items-center gap-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Authenticate Operator</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-500 mt-3 font-mono-code">
              Need a new account? <Link to="/register" className="text-sky-600 hover:underline font-bold">Register Here</Link>
            </p>

          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
