import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, password, role: 'passenger' });
      
      // Auto-login after register
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      const { token, role } = res.data;
      
      login({ token, role, username });
      navigate('/predictor');

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="glass-panel p-10 rounded-2xl w-full max-w-md animate-fade-in shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 text-emerald-400">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-center">Create Account</h2>
          <p className="text-text-muted mt-2">Join Flycast to predict your delays</p>
        </div>
        
        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm">{error}</div>}
        
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-surface border border-surface-hover rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="e.g. jdoe123"
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
            className="mt-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-medium py-3 rounded-lg transition-all shadow-lg flex justify-center items-center"
          >
            {loading ? <span className="animate-pulse">Creating Account...</span> : 'Register'}
          </button>
          <p className="text-center text-sm text-text-muted mt-2">
            Already have an account? <span onClick={() => navigate('/login')} className="text-emerald-400 hover:text-emerald-300 cursor-pointer font-medium">Log in here</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
