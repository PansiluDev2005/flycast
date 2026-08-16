import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, Activity, Settings, RefreshCw, Shield, Server, UserPlus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const [retrainMsg, setRetrainMsg] = useState('');
  
  // New User Form State
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('dispatcher');
  const [createMsg, setCreateMsg] = useState('');

  // View filter state
  const [viewFilter, setViewFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, metricsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/users', { headers: { Authorization: `Bearer ${user.token}` } }),
        axios.get('http://localhost:5000/api/admin/metrics', { headers: { Authorization: `Bearer ${user.token}` } })
      ]);
      setUsers(usersRes.data);
      setMetrics(metricsRes.data);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${userId}/role`, { role }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setUsers(users.map(u => u._id === userId ? { ...u, role } : u));
    } catch (err) {
      alert('Error updating role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert('Error deleting user');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateMsg('');
    try {
      // Use auth register route since it creates users
      await axios.post('http://localhost:5000/api/auth/register', { 
        username: newUsername, 
        password: newPassword, 
        role: newRole 
      });
      setCreateMsg('User created successfully!');
      setNewUsername('');
      setNewPassword('');
      fetchData(); // Refresh list
    } catch (err) {
      setCreateMsg(err.response?.data?.message || 'Error creating user');
    }
    setTimeout(() => setCreateMsg(''), 5000);
  };

  const handleRetrain = async () => {
    setRetraining(true);
    setRetrainMsg('');
    try {
      const res = await axios.post('http://localhost:5000/api/admin/retrain', {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setRetrainMsg(res.data.message);
    } catch (err) {
      setRetrainMsg('Failed to trigger retraining.');
    } finally {
      setRetraining(false);
      setTimeout(() => setRetrainMsg(''), 5000);
    }
  };

  if (loading) return <div className="flex justify-center h-64 items-center">Loading Admin Panel...</div>;

  const filteredUsers = users.filter(u => viewFilter === 'all' || u.role === viewFilter);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-text-muted">System-wide analytics, ML management, and CRUD for Users.</p>
        </div>
        
        <div className="flex flex-col items-end">
          <button 
            onClick={handleRetrain}
            disabled={retraining}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${retraining ? 'animate-spin' : ''}`} />
            {retraining ? 'Retraining...' : 'Trigger ML Retrain'}
          </button>
          {retrainMsg && <p className="text-emerald-400 text-xs mt-2">{retrainMsg}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-text-muted text-sm mb-1">Registered Users</p>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-text-muted text-sm mb-1">Total Predictions</p>
            <p className="text-3xl font-bold">{metrics?.total_predictions.toLocaleString() || '12,450'}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between group">
          <div>
            <p className="text-text-muted text-sm mb-1">ML API Latency</p>
            <p className="text-3xl font-bold text-sky-400">{metrics?.latency_ms || '24'} ms</p>
          </div>
          <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center text-sky-400">
            <Server className="w-6 h-6 group-hover:animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* User CRUD Panel */}
        <div className="lg:col-span-8 glass-panel p-8 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              User Role Management
            </h2>
            <select 
              value={viewFilter} 
              onChange={(e) => setViewFilter(e.target.value)}
              className="bg-surface border border-surface-hover rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary cursor-pointer text-text-muted hover:text-white transition-colors"
            >
              <option value="all">View All Users</option>
              <option value="dispatcher">Dispatchers Only</option>
              <option value="passenger">Passengers Only</option>
              <option value="admin">Admins Only</option>
            </select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-surface-hover text-text-muted text-sm">
                  <th className="pb-3 font-medium px-4">Username</th>
                  <th className="pb-3 font-medium px-4">Current Role</th>
                  <th className="pb-3 font-medium px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="border-b border-surface-hover/50 last:border-0 hover:bg-surface-hover/30 transition-colors">
                    <td className="py-4 font-medium px-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-xs font-bold text-primary">
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      {u.username}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 
                        u.role === 'dispatcher' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-surface text-text-muted border border-surface-hover'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 text-right px-4 flex items-center justify-end gap-2">
                      <select 
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={u.username === user.username}
                        className="bg-surface border border-surface-hover rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-primary cursor-pointer disabled:opacity-50"
                      >
                        <option value="passenger">Passenger</option>
                        <option value="dispatcher">Dispatcher</option>
                        <option value="admin">Admin</option>
                      </select>
                      
                      <button 
                        onClick={() => handleDeleteUser(u._id)}
                        disabled={u.username === user.username}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors disabled:opacity-50"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <p className="text-center text-text-muted py-8">No users found for this filter.</p>
            )}
          </div>
        </div>

        {/* Create User Panel */}
        <div className="lg:col-span-4 glass-panel p-8 rounded-2xl h-fit sticky top-24">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Create Account
          </h2>
          
          <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Username</label>
              <input 
                type="text" 
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full bg-surface border border-surface-hover rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="new_user"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-surface border border-surface-hover rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Role</label>
              <select 
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full bg-surface border border-surface-hover rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="dispatcher">Dispatcher</option>
                <option value="admin">Admin</option>
                <option value="passenger">Passenger</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="mt-2 w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              Create User
            </button>
            
            {createMsg && (
              <div className={`mt-2 p-2 rounded text-xs flex items-center gap-1 ${createMsg.includes('success') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {createMsg.includes('success') ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {createMsg}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
