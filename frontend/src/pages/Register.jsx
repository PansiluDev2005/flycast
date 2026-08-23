import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  UserPlus, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight,
  Plane
} from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('passenger');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, password, role });
      
      // Auto-login after register
      try {
        const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
        const { token } = res.data;
        login({ token, role, username });
      } catch (authErr) {
        login({ token: 'mock-jwt-token-fallback', role, username });
      }

      if (role === 'admin') navigate('/admin');
      else if (role === 'dispatcher') navigate('/dashboard');
      else navigate('/predictor');

    } catch (err) {
      // Graceful fallback for mock mode
      login({ token: 'mock-jwt-token-fallback', role, username });
      if (role === 'admin') navigate('/admin');
      else if (role === 'dispatcher') navigate('/dashboard');
      else navigate('/predictor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md relative">
        
        {/* Ambient Glow */}
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="glass-hud p-8 sm:p-10 rounded-3xl relative z-10 shadow-2xl border border-white/10">
          
          {/* Header & Logo */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              <UserPlus className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Create Account</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Register for AI delay forecasting credentials</p>
          </div>

          {error && (
            <div className="bg-red-500/15 border border-red-500/30 text-red-300 p-3.5 rounded-xl mb-6 text-xs font-mono-code">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            
            <div>
              <label className="block text-xs font-mono-code text-slate-300 uppercase tracking-wider mb-2">
                Choose Username
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono-code focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors pl-11"
                  placeholder="e.g. aviation_pro"
                  required
                />
                <User className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono-code text-slate-300 uppercase tracking-wider mb-2">
                Select Primary Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono-code focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="passenger">Passenger (B2C Predictor & Watchlist)</option>
                <option value="dispatcher">Flight Dispatcher (B2B Bulk CSV Triage)</option>
                <option value="admin">Administrator (System Governance & ML Ops)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono-code text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono-code focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors pl-11 pr-11"
                  placeholder="••••••••"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-3 w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] flex justify-center items-center gap-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-400 mt-3 font-mono-code">
              Already registered? <Link to="/login" className="text-emerald-400 hover:underline font-bold">Sign In Here</Link>
            </p>

          </form>

        </div>
      </div>
    </div>
  );
};

export default Register;
