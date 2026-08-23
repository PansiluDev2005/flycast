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
      // 1. Read existing local storage notifications
      let localNotifs = [];
      try {
        const saved = localStorage.getItem('flycast_realtime_notifications');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Purge stale mock notifications from previous builds
          localNotifs = parsed.filter(n => n._id !== 'notif-1' && n._id !== 'notif-2' && n._id !== 'notif-3');
        }
      } catch (e) {
        localNotifs = [];
      }

      // 2. Fetch server notifications and merge
      try {
        const res = await axios.get('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${user.token || 'mock-token'}` }
        });
        const serverNotifs = Array.isArray(res.data) ? res.data.filter(n => n._id !== 'notif-1' && n._id !== 'notif-2' && n._id !== 'notif-3') : [];
        
        const map = new Map();
        localNotifs.forEach(n => map.set(n._id || `${n.flightId}-${n.createdAt}`, n));
        serverNotifs.forEach(n => map.set(n._id || `${n.flightId}-${n.createdAt}`, n));
        
        const merged = Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(merged);
        localStorage.setItem('flycast_realtime_notifications', JSON.stringify(merged));
      } catch (err) {
        setNotifications(localNotifs);
        localStorage.setItem('flycast_realtime_notifications', JSON.stringify(localNotifs));
      }
    } else {
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAsRead = async (id) => {
    const updated = notifications.map(n => n._id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem('flycast_realtime_notifications', JSON.stringify(updated));

    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${user.token || 'mock-token'}` }
      });
    } catch (err) {
      console.warn('Mark as read synced locally:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-sky-500/10 text-sky-700 border border-sky-500/30 shadow-[0_2px_10px_rgba(14,165,233,0.1)] font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
    }`;

  return (
    <header className="sticky top-0 z-50 px-4 lg:px-8 pt-3 pb-2 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto">
        <nav className="glass-hud rounded-2xl px-5 py-3 flex items-center justify-between transition-all duration-300 border border-slate-200/90 shadow-sm">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-[0_4px_14px_rgba(14,165,233,0.35)] group-hover:scale-105 transition-transform">
              <Plane className="w-5 h-5 -rotate-45" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-sky-900 to-blue-700 bg-clip-text text-transparent font-heading">
                  Flycast
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono-code font-bold rounded bg-sky-100 text-sky-700 border border-sky-200">
                  AI 2.0
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
                Aviation Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            {user ? (
              <>
                <NavLink to="/predictor" className={navLinkClass}>
                  <Compass className="w-4 h-4 text-sky-600" />
                  <span>AI Predictor</span>
                </NavLink>

                {(user.role === 'passenger' || user.role === 'admin') && (
                  <NavLink to="/passenger" className={navLinkClass}>
                    <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                    <span>My Watchlist</span>
                  </NavLink>
                )}

                {(user.role === 'dispatcher' || user.role === 'admin') && (
                  <NavLink to="/dashboard" className={navLinkClass}>
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span>Dispatcher Triage</span>
                  </NavLink>
                )}

                {user.role === 'admin' && (
                  <NavLink to="/admin" className={navLinkClass}>
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>Admin Console</span>
                  </NavLink>
                )}
              </>
            ) : (
              <NavLink to="/" className={navLinkClass}>
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Overview</span>
              </NavLink>
            )}
          </div>

          {/* Right Action / Profile Area */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* Live Microservice Telemetry Tag */}
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 border border-emerald-500/30 text-xs font-mono-code text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>ML Engine</span>
                  <span className="text-emerald-700 font-bold">24ms</span>
                </div>

                {/* Notifications Drawer Toggle */}
                {(user.role === 'dispatcher' || user.role === 'admin') && (
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all text-slate-700 hover:text-slate-900 shadow-sm"
                      title="Operational Alerts"
                    >
                      <Bell className="w-4 h-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold font-mono-code flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 mt-3 w-84 bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-sky-600" />
                            <span className="font-bold text-sm text-slate-900">Operational Alerts</span>
                          </div>
                          <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-sky-100 text-sky-700 border border-sky-200 font-semibold">
                            {unreadCount} Unread
                          </span>
                        </div>
                        
                        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center text-slate-400 text-xs">
                              No active operational alerts.
                            </div>
                          ) : (
                            notifications.map(notif => {
                              const isAdminDirective = notif.senderRole === 'admin' || (notif.message && notif.message.includes('ADMIN'));
                              const isCritical = notif.priority === 'critical' || notif.type === 'critical';

                              return (
                                <div
                                  key={notif._id}
                                  className={`p-4 transition-colors ${
                                    notif.read ? 'opacity-60 hover:opacity-100 bg-white' : 
                                    isAdminDirective ? 'bg-purple-50/70 border-l-4 border-purple-600' :
                                    isCritical ? 'bg-red-50/70 border-l-4 border-red-500' :
                                    'bg-sky-50/60 hover:bg-sky-50'
                                  }`}
                                >
                                  {isAdminDirective && (
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                      <span className="px-2 py-0.5 rounded-md bg-purple-200 text-purple-900 text-[9px] font-mono-code font-extrabold uppercase tracking-wider">
                                        ⚡ ADMIN EXECUTIVE DIRECTIVE
                                      </span>
                                    </div>
                                  )}

                                  <div className="flex justify-between items-start gap-3">
                                    <div className="flex items-start gap-2.5">
                                      {isAdminDirective ? (
                                        <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                                      ) : isCritical || notif.type === 'alert' ? (
                                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                      ) : notif.type === 'system' ? (
                                        <Sparkles className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                                      ) : (
                                        <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                                      )}
                                      <p className={`text-xs leading-snug ${isAdminDirective ? 'text-slate-900 font-bold' : 'text-slate-800 font-medium'}`}>
                                        {notif.message}
                                      </p>
                                    </div>
                                    {!notif.read && (
                                      <button
                                        onClick={() => markAsRead(notif._id)}
                                        className="text-sky-600 p-1 hover:bg-sky-100 rounded-md transition-colors shrink-0"
                                        title="Mark as read"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-400 mt-2">
                                    <span>{new Date(notif.createdAt).toLocaleTimeString()}</span>
                                    {notif.flightId && (
                                      <span className="text-slate-500 font-bold">FLIGHT: {notif.flightId}</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* User Profile Pill */}
                <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 transition-all group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white group-hover:scale-105 transition-transform shadow-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
                        {user.username}
                      </span>
                      <span className="text-[10px] font-mono-code uppercase tracking-wider text-sky-600 font-bold">
                        {user.role}
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 hover:text-red-700 transition-all shadow-sm"
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
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-xl transition-all shadow-[0_4px_14px_rgba(14,165,233,0.3)] hover:shadow-[0_6px_20px_rgba(14,165,233,0.4)] flex items-center gap-1.5"
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
              <Link to="/profile" className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-xs font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-4 glass-hud rounded-2xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 border border-slate-200 shadow-xl">
            {user ? (
              <>
                <NavLink to="/predictor" className={navLinkClass}>
                  <Compass className="w-4 h-4 text-sky-600" />
                  <span>AI Predictor</span>
                </NavLink>

                {(user.role === 'passenger' || user.role === 'admin') && (
                  <NavLink to="/passenger" className={navLinkClass}>
                    <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                    <span>My Watchlist</span>
                  </NavLink>
                )}

                {(user.role === 'dispatcher' || user.role === 'admin') && (
                  <NavLink to="/dashboard" className={navLinkClass}>
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span>Dispatcher Triage</span>
                  </NavLink>
                )}

                {user.role === 'admin' && (
                  <NavLink to="/admin" className={navLinkClass}>
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>Admin Console</span>
                  </NavLink>
                )}

                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-900">{user.username}</span>
                    <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-700 font-mono-code text-[10px] font-bold">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold"
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
                  className="w-full text-center py-2.5 rounded-xl bg-slate-100 text-slate-900 font-semibold text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm shadow-md"
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
