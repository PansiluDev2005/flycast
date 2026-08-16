import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plane, Clock, AlertTriangle, CheckCircle2, Navigation, Trash2 } from 'lucide-react';

const PassengerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/watchlist', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setWatchlist(res.data.flights || []);
    } catch (err) {
      console.error('Failed to fetch watchlist', err);
      // Mock data fallback if database not seeded
      setWatchlist([
        {
          _id: 'mock1',
          flight_id: 'AA123',
          origin: 'JFK',
          destination: 'LAX',
          scheduled_departure: new Date(new Date().getTime() + 1000 * 60 * 60 * 4).toISOString(), // 4 hours from now
          delay_probability: 0.15,
          estimated_minutes: 0,
          carrier: 'AA'
        },
        {
          _id: 'mock2',
          flight_id: 'DL456',
          origin: 'ATL',
          destination: 'MIA',
          scheduled_departure: new Date(new Date().getTime() + 1000 * 60 * 60 * 8).toISOString(), // 8 hours from now
          delay_probability: 0.85,
          estimated_minutes: 45,
          carrier: 'DL'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (flightId) => {
    try {
      await axios.delete(`http://localhost:5000/api/watchlist/${flightId}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setWatchlist(watchlist.filter(f => f.flight_id !== flightId));
    } catch (err) {
      console.error('Error removing flight', err);
      // Fallback for mock
      setWatchlist(watchlist.filter(f => f.flight_id !== flightId));
    }
  };

  const calculateOptimalDeparture = (scheduledDate, delayMins) => {
    const baseDate = new Date(scheduledDate);
    // Add delay
    baseDate.setMinutes(baseDate.getMinutes() + delayMins);
    // Subtract 2 hours for standard airport arrival
    baseDate.setHours(baseDate.getHours() - 2);
    // Subtract 45 minutes for average drive time
    baseDate.setMinutes(baseDate.getMinutes() - 45);
    
    return baseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading Watchlist...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Personal Watchlist & Planner</h1>
        <p className="text-text-muted">Monitor your saved flights and optimize your journey to the airport.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {watchlist.length === 0 ? (
          <div className="glass-panel p-10 text-center rounded-2xl flex flex-col items-center">
            <Plane className="w-16 h-16 text-surface-hover mb-4" />
            <h2 className="text-2xl font-bold text-text-muted mb-2">Your Watchlist is Empty</h2>
            <p className="text-text-muted">Head over to the Predictor to check flights and save them here.</p>
          </div>
        ) : (
          watchlist.map((flight) => (
            <div key={flight._id || flight.flight_id} className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-primary/30 transition-colors">
              
              {/* Flight Info */}
              <div className="flex items-center gap-6 md:w-1/3">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border ${flight.delay_probability > 0.5 ? 'bg-red-500/20 border-red-500/30' : 'bg-emerald-500/20 border-emerald-500/30'}`}>
                  {flight.delay_probability > 0.5 ? <AlertTriangle className="w-7 h-7 text-red-400" /> : <CheckCircle2 className="w-7 h-7 text-emerald-400" />}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{flight.flight_id}</h3>
                  <p className="text-text-muted flex items-center gap-2 font-medium">
                    {flight.origin} <Plane className="w-4 h-4" /> {flight.destination}
                  </p>
                </div>
              </div>

              {/* Status & Journey Planner */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-2/3">
                <div className="bg-surface p-4 rounded-xl border border-surface-hover">
                  <p className="text-xs text-text-muted mb-1">Scheduled Dep.</p>
                  <p className="text-lg font-bold">{new Date(flight.scheduled_departure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                
                <div className="bg-surface p-4 rounded-xl border border-surface-hover">
                  <p className="text-xs text-text-muted mb-1">Delay Prediction</p>
                  <p className={`text-lg font-bold ${flight.delay_probability > 0.5 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {flight.delay_probability > 0.5 ? `+${flight.estimated_minutes} min` : 'On Time'}
                  </p>
                </div>

                <div className="bg-primary/10 p-4 rounded-xl border border-primary/30 col-span-2 flex items-center justify-between group cursor-help relative">
                  <div>
                    <p className="text-xs text-primary mb-1 flex items-center gap-1"><Navigation className="w-3 h-3" /> Smart Planner</p>
                    <p className="text-xl font-bold text-white">Leave at {calculateOptimalDeparture(flight.scheduled_departure, flight.estimated_minutes)}</p>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute opacity-0 group-hover:opacity-100 bg-bg-dark border border-surface-hover p-3 rounded-lg text-xs w-48 -top-20 left-1/2 transform -translate-x-1/2 pointer-events-none transition-opacity z-10 shadow-xl">
                    Factoring in {flight.estimated_minutes}m delay, 2h terminal wait, and 45m drive time.
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => removeFromWatchlist(flight.flight_id)}
                className="p-3 bg-surface hover:bg-red-500/20 hover:text-red-400 text-text-muted rounded-xl transition-colors border border-surface-hover hover:border-red-500/30"
                title="Remove from Watchlist"
              >
                <Trash2 className="w-5 h-5" />
              </button>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PassengerDashboard;
