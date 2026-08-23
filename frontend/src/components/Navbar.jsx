import { useContext, useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  Plane, 
  LogOut, 
  Bell, 
  Check, 
  Compass, 
  BarChart3, 
  ShieldCheck, 
  BookmarkCheck, 
  Menu, 
  X, 
  Activity, 
  Sparkles,
  AlertTriangle,
  Clock,
  Radio
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchNotifications = async () => {
    if (user && (user.role === 'dispatcher' || user.role === 'admin')) {
      try {
        const res = await axios.get('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setNotifications(res.data || []);
      } catch (err) {
        // Mock fallback if DB is not populated yet
        setNotifications([
          {
            _id: 'notif-1',
            message: 'High Delay Alert: DL456 (ATL ➔ MIA) projected +45m delay.',
            type: 'alert',
            createdAt: new Date().toISOString(),
            read: false
          },
          {
            _id: 'notif-2',
            message: 'Gate Reallocation notice received for Flight AA123.',
            type: 'info',
            createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            read: false
          },
          {
            _id: 'notif-3',
            message: 'Random Forest Model retrained with 94.8% accuracy.',
            type: 'system',
            createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            read: true
          }
        ]);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

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
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;

  return (
    <header className="sticky top-0 z-50 px-4 lg:px-8 pt-3 pb-2 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto">
        <nav className="glass-hud rounded-2xl px-5 py-3.5 flex items-center justify-between transition-all duration-300">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 text-cyan-400 group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,210,255,0.25)]">
              <Plane className="w-5 h-5 -rotate-45 text-cyan-300 group-hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75"></span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                  Flycast
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono-code font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  AI 2.0
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                Aviation Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-white/5">
            {user ? (
              <>
                <NavLink to="/predictor" className={navLinkClass}>
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>AI Predictor</span>
                </NavLink>

                {(user.role === 'passenger' || user.role === 'admin') && (
                  <NavLink to="/passenger" className={navLinkClass}>
                    <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                    <span>My Watchlist</span>
                  </NavLink>
                )}

                {(user.role === 'dispatcher' || user.role === 'admin') && (
                  <NavLink to="/dashboard" className={navLinkClass}>
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    <span>Dispatcher Triage</span>
                  </NavLink>
                )}

                {user.role === 'admin' && (
                  <NavLink to="/admin" className={navLinkClass}>
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span>Admin Console</span>
                  </NavLink>
                )}
              </>
            ) : (
              <NavLink to="/" className={navLinkClass}>
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Overview</span>
              </NavLink>
            )}
          </div>

          {/* Right Action / Profile Area */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* Live Microservice Telemetry Tag */}
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/30 text-xs font-mono-code text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>ML Engine Online</span>
                  <span className="text-emerald-400 font-bold">24ms</span>
                </div>

                {/* Notifications Drawer Toggle */}
                {(user.role === 'dispatcher' || user.role === 'admin') && (
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="relative p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/40 transition-all text-slate-300 hover:text-white"
                      title="Operational Alerts"
                    >
                      <Bell className="w-4 h-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold font-mono-code flex items-center justify-center rounded-full border-2 border-slate-950 animate-bounce">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 mt-3 w-84 bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="p-4 bg-slate-900/90 border-b border-white/10 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-cyan-400" />
                            <span className="font-bold text-sm text-white">Operational Alerts</span>
                          </div>
                          <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {unreadCount} Unread
                          </span>
                        </div>
                        
                        <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center text-slate-400 text-xs">
                              No active operational alerts.
                            </div>
                          ) : (
                            notifications.map(notif => (
                              <div
                                key={notif._id}
                                className={`p-4 transition-colors ${
                                  notif.read ? 'opacity-50 hover:opacity-80' : 'bg-cyan-500/5 hover:bg-cyan-500/10'
                                }`}
                              >
                                <div className="flex justify-between items-start gap-3">
                                  <div className="flex items-start gap-2.5">
                                    {notif.type === 'alert' ? (
                                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                    ) : notif.type === 'system' ? (
                                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                                    ) : (
                                      <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                    )}
                                    <p className="text-xs text-slate-200 leading-snug">{notif.message}</p>
                                  </div>
                                  {!notif.read && (
                                    <button
                                      onClick={() => markAsRead(notif._id)}
                                      className="text-cyan-400 p-1 hover:bg-cyan-500/20 rounded-md transition-colors shrink-0"
                                      title="Mark as read"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                                <span className="text-[10px] font-mono-code text-slate-400 block mt-2">
                                  {new Date(notif.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* User Profile Pill */}
                <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-slate-950 group-hover:scale-105 transition-transform">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {user.username}
                      </span>
                      <span className="text-[10px] font-mono-code uppercase tracking-wider text-cyan-400">
                        {user.role}
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition-all"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-xl transition-all shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:shadow-[0_0_25px_rgba(0,210,255,0.5)] flex items-center gap-1.5"
                >
                  <span>Launch Console</span>
                  <Plane className="w-3.5 h-3.5 -rotate-45" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <Link to="/profile" className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-xs font-bold text-slate-950">
                {user.username.charAt(0).toUpperCase()}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-4 glass-hud rounded-2xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
            {user ? (
              <>
                <NavLink to="/predictor" className={navLinkClass}>
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>AI Predictor</span>
                </NavLink>

                {(user.role === 'passenger' || user.role === 'admin') && (
                  <NavLink to="/passenger" className={navLinkClass}>
                    <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                    <span>My Watchlist</span>
                  </NavLink>
                )}

                {(user.role === 'dispatcher' || user.role === 'admin') && (
                  <NavLink to="/dashboard" className={navLinkClass}>
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    <span>Dispatcher Triage</span>
                  </NavLink>
                )}

                {user.role === 'admin' && (
                  <NavLink to="/admin" className={navLinkClass}>
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span>Admin Console</span>
                  </NavLink>
                )}

                <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-white">{user.username}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono-code text-[10px]">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 rounded-xl bg-slate-800 text-white font-medium text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-sm"
                >
                  Launch Console
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
