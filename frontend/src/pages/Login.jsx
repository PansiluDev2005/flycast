import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PlaneTakeoff } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      const { token, role } = res.data;
      
      login({ token, role, username });
      
      if(role === 'admin') navigate('/admin');
      else if(role === 'dispatcher') navigate('/dashboard');
      else navigate('/predictor');

    } catch (err) {
      setError('Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="glass-panel p-10 rounded-2xl w-full max-w-md animate-fade-in shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 text-primary">
            <PlaneTakeoff className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-center">Welcome to Flycast</h2>
          <p className="text-text-muted mt-2">Sign in to predict flight delays</p>
        </div>
        
        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm">{error}</div>}
        
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-surface border border-surface-hover rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="e.g. jdoe123 (use 'admin' or 'dispatcher' for roles)"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-surface-hover rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white font-medium py-3 rounded-lg transition-all shadow-lg shadow-primary/20 flex justify-center items-center"
          >
            {loading ? <span className="animate-pulse">Authenticating...</span> : 'Sign In'}
          </button>
          <p className="text-center text-sm text-text-muted mt-2">
            Don't have an account? <span onClick={() => navigate('/register')} className="text-primary hover:text-primary-dark cursor-pointer font-medium">Register here</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
