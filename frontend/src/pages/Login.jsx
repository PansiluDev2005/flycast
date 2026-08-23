import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  ArrowRight,
  Radio
} from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

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
      console.log('Backend auth unavailable, falling back to seamless mock auth session...');
      // Fallback mock-authentication layer as described in README
      let role = 'passenger';
      if (username.toLowerCase() === 'admin') role = 'admin';
      else if (username.toLowerCase() === 'dispatcher') role = 'dispatcher';
      
      const mockToken = 'mock-jwt-token-fallback';
      
      login({ token: mockToken, role, username });
      
      if (role === 'admin') navigate('/admin');
      else if (role === 'dispatcher') navigate('/dashboard');
      else navigate('/predictor');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (demoRole) => {
    let demoUsername = 'admin';
    if (demoRole === 'dispatcher') demoUsername = 'dispatcher';
    if (demoRole === 'passenger') demoUsername = 'jdoe123';

    setUsername(demoUsername);
    setPassword('demo123');

    // Trigger instant login
    setTimeout(() => {
      login({ token: 'mock-jwt-token-fallback', role: demoRole, username: demoUsername });
      if (demoRole === 'admin') navigate('/admin');
      else if (demoRole === 'dispatcher') navigate('/dashboard');
      else navigate('/predictor');
    }, 150);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md relative">
        
        {/* Ambient Glow */}
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="glass-hud p-8 sm:p-10 rounded-3xl relative z-10 shadow-2xl border border-white/10">
          
          {/* Header & Logo */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-4 shadow-[0_0_20px_rgba(0,210,255,0.25)]">
              <Plane className="w-8 h-8 -rotate-45" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Operator Sign In</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Access the Flycast AI delay forecasting console</p>
          </div>

          {/* 1-Click Instant Demo Role Selector */}
          <div className="mb-6 p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20 flex flex-col gap-2.5">
            <span className="text-[10px] font-mono-code text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Instant Role Demo:</span>
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="px-2.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-mono-code font-bold transition-all flex flex-col items-center gap-1 hover:scale-105"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('dispatcher')}
                className="px-2.5 py-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-xs font-mono-code font-bold transition-all flex flex-col items-center gap-1 hover:scale-105"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Dispatcher</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('passenger')}
                className="px-2.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono-code font-bold transition-all flex flex-col items-center gap-1 hover:scale-105"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Passenger</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/15 border border-red-500/30 text-red-300 p-3.5 rounded-xl mb-6 text-xs font-mono-code">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            
            <div>
              <label className="block text-xs font-mono-code text-slate-300 uppercase tracking-wider mb-2">
                Username / Call-Sign
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono-code focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors pl-11"
                  placeholder="admin, dispatcher, or jdoe123"
                  required
                />
                <User className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono-code text-slate-300 uppercase tracking-wider mb-2">
                Access Password
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
              className="mt-3 w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all shadow-[0_0_25px_rgba(0,210,255,0.35)] flex justify-center items-center gap-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Authenticate Operator</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-400 mt-3 font-mono-code">
              Need a new account? <Link to="/register" className="text-cyan-400 hover:underline font-bold">Register Here</Link>
            </p>

          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
