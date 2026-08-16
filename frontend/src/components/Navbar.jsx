import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plane, LogOut, Bell, Check } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    if (user && (user.role === 'dispatcher' || user.role === 'admin')) {
      try {
        const res = await axios.get('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications');
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds for demo
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="glass-panel sticky top-0 z-50 py-4 px-6 mb-8 shadow-lg">
      <div className="container mx-auto flex justify-between items-center relative">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Plane className="w-8 h-8" />
          <span>Flycast</span>
        </Link>
        
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/predictor" className="hover:text-primary transition-colors">Predict Delay</Link>
              
              {(user.role === 'passenger' || user.role === 'admin') && (
                <Link to="/passenger" className="hover:text-primary transition-colors">My Watchlist</Link>
              )}

              {(user.role === 'dispatcher' || user.role === 'admin') && (
                <>
                  <Link to="/dashboard" className="hover:text-primary transition-colors">Bulk Dashboard</Link>
                  
                  {/* Notifications Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="relative p-2 hover:bg-surface-hover rounded-full transition-colors text-text-muted hover:text-primary"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-80 bg-surface border border-surface-hover shadow-2xl rounded-xl overflow-hidden z-50">
                        <div className="p-3 bg-surface-hover border-b border-surface-hover flex justify-between items-center">
                          <span className="font-bold">Notifications</span>
                          <button onClick={fetchNotifications} className="text-xs text-primary hover:underline">Refresh</button>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-text-muted text-sm">No notifications</div>
                          ) : (
                            notifications.map(notif => (
                              <div key={notif._id} className={`p-4 border-b border-surface-hover last:border-0 ${notif.read ? 'opacity-60' : 'bg-primary/5'}`}>
                                <div className="flex justify-between items-start gap-2">
                                  <p className="text-sm">{notif.message}</p>
                                  {!notif.read && (
                                    <button onClick={() => markAsRead(notif._id)} className="text-primary p-1 hover:bg-surface-hover rounded" title="Mark as read">
                                      <Check className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                                <span className="text-xs text-text-muted block mt-2">{new Date(notif.createdAt).toLocaleTimeString()}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-primary transition-colors">Admin Area</Link>
              )}
              
              <div className="flex items-center gap-4 ml-4 border-l border-surface-hover pl-4">
                <Link to="/profile" className="text-text-muted hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-primary font-bold">{user.username.charAt(0).toUpperCase()}</span>
                  <span className="hidden sm:inline">Hi, {user.username}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-surface-hover rounded-full transition-colors text-red-400"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md shadow-primary/20">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
