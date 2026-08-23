import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Plane, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  Car, 
  Luggage, 
  SunMedium
} from 'lucide-react';

const PassengerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const storageKey = `flycast_watchlist_${user?.username || 'passenger'}`;

  const fetchWatchlist = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/watchlist', {
        headers: { Authorization: `Bearer ${user?.token || 'mock-token'}` }
      });
      
      const flights = res.data?.flights || (Array.isArray(res.data) ? res.data : []);
      setWatchlist(flights);
      localStorage.setItem(storageKey, JSON.stringify(flights));
    } catch (err) {
      console.warn('Backend watchlist offline, loading local user store:', err);
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setWatchlist(JSON.parse(saved));
        } catch (e) {
          setWatchlist([]);
        }
      } else {
        setWatchlist([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, [user]);

  const removeFromWatchlist = async (flightId) => {
    // 1. Update UI state immediately
    const updated = watchlist.filter(f => f.flight_id !== flightId && f._id !== flightId);
    setWatchlist(updated);
    
    // 2. Persist deletion in local storage so refresh never revives it
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // 3. Delete from backend database
    try {
      await axios.delete(`http://localhost:5000/api/watchlist/${flightId}`, {
        headers: { Authorization: `Bearer ${user?.token || 'mock-token'}` }
      });
    } catch (err) {
      console.warn('Backend delete notification:', err);
    }
  };

  const calculateOptimalDeparture = (scheduledDate, delayMins = 0) => {
    const baseDate = new Date(scheduledDate || Date.now());
    baseDate.setMinutes(baseDate.getMinutes() + (delayMins || 0));
    baseDate.setHours(baseDate.getHours() - 2);
    baseDate.setMinutes(baseDate.getMinutes() - 45);
    return baseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateHoursUntil = (scheduledDate) => {
    if (!scheduledDate) return '0h 0m';
    const diffMs = new Date(scheduledDate) - new Date();
    const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
    const diffMins = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)));
    return `${diffHours}h ${diffMins}m`;
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-mono-code text-sky-700 animate-pulse font-bold">Syncing Personal Watchlist...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-mono-code mb-2 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Passenger Travel Companion</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">Personal Flight Watchlist</h1>
          <p className="text-slate-600 text-sm mt-1">
            Real-time itinerary tracking, AI delay forecasts, and optimized airport departure countdowns.
          </p>
        </div>

        <Link
          to="/predictor"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs font-mono-code flex items-center justify-center gap-2 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Track New Flight</span>
        </Link>
      </div>

      {/* Watchlist Cards Container */}
      <div className="flex flex-col gap-8">
        {watchlist.length === 0 ? (
          <div className="glass-panel p-16 text-center rounded-3xl flex flex-col items-center border-slate-200 bg-white shadow-md">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-6">
              <Plane className="w-10 h-10 -rotate-45" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2 font-heading">Your Watchlist is Empty</h3>
            <p className="text-slate-600 text-sm max-w-md mb-8 leading-relaxed">
              You currently have no saved flights. Use our AI Flight Delay Predictor to evaluate any upcoming flight and save it to your personalized travel dashboard.
            </p>
            <Link
              to="/predictor"
              className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Search & Add a Flight</span>
            </Link>
          </div>
        ) : (
          watchlist.map((flight) => {
            const isDelayed = (flight.delay_probability || 0) > 0.5;
            const scheduledTimeStr = new Date(flight.scheduled_departure || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const leaveTimeStr = calculateOptimalDeparture(flight.scheduled_departure || Date.now(), flight.estimated_minutes || 0);

            return (
              <div 
                key={flight._id || flight.flight_id} 
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 transition-all hover:border-sky-300 shadow-md relative"
              >
                {/* Decorative Top Accent Bar */}
                <div className={`h-2 w-full ${isDelayed ? 'bg-gradient-to-r from-red-500 to-amber-500' : 'bg-gradient-to-r from-sky-400 to-emerald-400'}`}></div>

                <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8 justify-between">
                  
                  {/* Left: Boarding Pass Header & Route */}
                  <div className="flex-1 flex flex-col justify-between gap-6">
                    
                    {/* Airline & Status Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-mono-code font-bold text-sm shadow-sm">
                          {flight.carrier || 'FL'}
                        </div>
                        <div>
                          <h3 className="text-2xl font-extrabold font-mono-code text-slate-900">{flight.flight_id}</h3>
                          <span className="text-xs text-slate-500 font-mono-code">Carrier: {flight.carrier || 'Commercial'}</span>
                        </div>
                      </div>

                      <div className={`px-3 py-1 rounded-full text-xs font-mono-code font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        isDelayed ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}>
                        {isDelayed ? <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        <span>{isDelayed ? `+${flight.estimated_minutes}m Delay Projected` : 'On-Time Expected'}</span>
                      </div>
                    </div>

                    {/* Route Cities Display */}
                    <div className="flex items-center justify-between py-4 px-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
                      <div className="flex flex-col">
                        <span className="text-3xl font-extrabold font-mono-code text-slate-900">{flight.origin || 'JFK'}</span>
                        <span className="text-xs text-slate-500 font-mono-code font-bold">Origin Airport</span>
                      </div>

                      <div className="flex flex-col items-center gap-1 px-4">
                        <span className="text-[10px] font-mono-code text-sky-700 font-bold uppercase tracking-wider">
                          {((flight.delay_probability || 0) * 100).toFixed(0)}% Delay Risk
                        </span>
                        <div className="w-24 sm:w-36 h-0.5 bg-slate-300 relative flex items-center justify-center">
                          <Plane className="w-4 h-4 text-sky-600 absolute -rotate-45" />
                        </div>
                        <span className="text-[10px] font-mono-code text-slate-500 font-medium">
                          Departs in {calculateHoursUntil(flight.scheduled_departure)}
                        </span>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-3xl font-extrabold font-mono-code text-slate-900">{flight.destination || 'LAX'}</span>
                        <span className="text-xs text-slate-500 font-mono-code font-bold">Destination</span>
                      </div>
                    </div>

                    {/* Weather & Terminal Tips Bar */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code text-slate-600 pt-1">
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <SunMedium className="w-4 h-4 text-amber-500" />
                        <span>Origin Weather: Clear 72°F</span>
                      </span>
                      <span className="text-slate-400">•</span>
                      <span>Scheduled Wheels Up: <strong className="text-slate-900">{scheduledTimeStr}</strong></span>
                    </div>

                  </div>

                  {/* Right: Smart Airport Journey Planner Timeline */}
                  <div className="lg:w-96 p-6 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-col justify-between gap-6 shadow-sm">
                    
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono-code text-sky-800 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                          <Navigation className="w-3.5 h-3.5 text-sky-600" />
                          <span>Smart Journey Itinerary</span>
                        </span>
                        
                        <button
                          onClick={() => removeFromWatchlist(flight.flight_id)}
                          className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 text-xs transition-colors"
                          title="Remove flight from watchlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Timeline Steps */}
                      <div className="flex flex-col gap-4 relative pl-6 border-l border-sky-300 my-2">
                        
                        {/* Step 1: Leave Home */}
                        <div className="relative">
                          <span className="w-3 h-3 rounded-full bg-sky-500 absolute -left-[31px] top-1 shadow-sm"></span>
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <Car className="w-3.5 h-3.5 text-sky-600" /> Leave Home
                            </span>
                            <span className="text-xs font-mono-code font-bold text-sky-800">{leaveTimeStr}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5 font-medium">Optimized for 45m transit buffer.</p>
                        </div>

                        {/* Step 2: Airport Arrival */}
                        <div className="relative">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 absolute -left-[30px] top-1"></span>
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                              <Luggage className="w-3.5 h-3.5 text-slate-500" /> Terminal Arrival
                            </span>
                            <span className="text-xs font-mono-code text-slate-600">2h Prior</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">Bag drop & security line window.</p>
                        </div>

                        {/* Step 3: Boarding Gate */}
                        <div className="relative">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 absolute -left-[30px] top-1"></span>
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                              <Plane className="w-3.5 h-3.5 text-slate-500" /> Boarding Gate
                            </span>
                            <span className="text-xs font-mono-code text-slate-600">40m Prior</span>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Bottom Alert Chip */}
                    <div className="p-3 rounded-xl bg-white border border-sky-200 text-[11px] text-slate-700 leading-snug shadow-sm">
                      {isDelayed ? (
                        <span className="text-amber-800 font-bold">
                          ⚠️ Proactive Adjustment: Your flight has a +{flight.estimated_minutes}m projected delay. Take advantage of extra home buffer time.
                        </span>
                      ) : (
                        <span className="text-emerald-800 font-bold">
                          ✓ Operations Normal: Flight is on-time. Stick to standard 2-hour departure timeline.
                        </span>
                      )}
                    </div>

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default PassengerDashboard;
