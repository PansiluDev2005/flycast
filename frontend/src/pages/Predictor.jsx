import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Predictor = () => {
  const { user } = useContext(AuthContext);
  const [flightId, setFlightId] = useState('');
  const [carrier, setCarrier] = useState('');
  const [origin, setOrigin] = useState('');
  const [dest, setDest] = useState('');
  const [date, setDate] = useState('');
  const [crsDepTime, setCrsDepTime] = useState('');
  const [distance, setDistance] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = user?.token || 'dummy';
      const payload = { 
        flight_id: flightId, 
        carrier,
        origin, 
        dest,
        date,
        crs_dep_time: parseInt(crsDepTime, 10),
        distance: parseInt(distance, 10)
      };
      
      const res = await axios.post('http://localhost:5000/api/ml/predict', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setResult(res.data[0]);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to fetch prediction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Flight Delay Predictor</h1>
        <p className="text-text-muted">Enter flight details to get AI-powered delay probability and estimated time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 glass-panel p-8 rounded-2xl h-fit">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Flight Details
          </h2>
          <form onSubmit={handlePredict} className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-text-muted mb-1">Flight ID</label>
              <input 
                type="text" 
                value={flightId}
                onChange={(e) => setFlightId(e.target.value)}
                className="w-full bg-surface border border-surface-hover rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="e.g. AA123"
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-text-muted mb-1">Airline Carrier Code</label>
              <input 
                type="text" 
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full bg-surface border border-surface-hover rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="e.g. AA, DL"
                required
              />
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-text-muted mb-1">Origin (Code)</label>
              <input 
                type="text" 
                value={origin}
                onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                className="w-full bg-surface border border-surface-hover rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary transition-colors uppercase"
                placeholder="e.g. JFK"
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-text-muted mb-1">Dest (Code)</label>
              <input 
                type="text" 
                value={dest}
                onChange={(e) => setDest(e.target.value.toUpperCase())}
                className="w-full bg-surface border border-surface-hover rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary transition-colors uppercase"
                placeholder="e.g. LAX"
                required
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-text-muted mb-1">Date</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-surface border border-surface-hover rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-text-muted mb-1">Dep Time (HHMM)</label>
              <input 
                type="number" 
                value={crsDepTime}
                onChange={(e) => setCrsDepTime(e.target.value)}
                className="w-full bg-surface border border-surface-hover rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="e.g. 1530"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-text-muted mb-1">Distance (Miles)</label>
              <input 
                type="number" 
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full bg-surface border border-surface-hover rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="e.g. 2475"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="col-span-2 mt-4 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white font-medium py-3 rounded-lg transition-all"
            >
              {loading ? 'Analyzing...' : 'Predict Delay'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          {result ? (
            <div className="glass-panel p-8 rounded-2xl animate-fade-in flex flex-col items-center text-center h-full justify-center">
              <div className="mb-6">
                {result.status === 'Delayed' ? (
                  <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mx-auto border border-red-500/30">
                    <AlertTriangle className="w-12 h-12 text-red-400" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                  </div>
                )}
              </div>
              
              <h2 className="text-3xl font-bold mb-2">{result.flight_id}</h2>
              <div className={`inline-flex px-4 py-1 rounded-full text-sm font-bold mb-8 ${result.status === 'Delayed' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {result.status}
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-surface p-4 rounded-xl border border-surface-hover">
                  <p className="text-text-muted text-sm mb-1">Delay Probability</p>
                  <p className="text-2xl font-bold">{(result.delay_probability * 100).toFixed(1)}%</p>
                  <div className="w-full bg-surface-hover h-2 rounded-full mt-3 overflow-hidden">
                    <div 
                      className={`h-full ${result.delay_probability > 0.5 ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${result.delay_probability * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-surface-hover">
                  <p className="text-text-muted text-sm mb-1">Est. Delay Time</p>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <p className="text-2xl font-bold">{result.estimated_delay_minutes} min</p>
                  </div>
                </div>
              </div>

              {(user?.role === 'passenger' || user?.role === 'admin') && (
                <button 
                  onClick={async () => {
                    try {
                      await axios.post('http://localhost:5000/api/watchlist', {
                        flight_id: result.flight_id,
                        carrier,
                        origin,
                        destination: dest,
                        date,
                        delay_probability: result.delay_probability,
                        estimated_minutes: result.estimated_delay_minutes
                      }, { headers: { Authorization: `Bearer ${user.token}` } });
                      alert('Added to Watchlist!');
                    } catch(err) {
                      alert('Failed to add or already in watchlist.');
                    }
                  }}
                  className="mt-6 px-6 py-2 bg-surface hover:bg-surface-hover border border-surface-hover rounded-lg transition-colors font-medium text-sm text-primary"
                >
                  + Save to Watchlist
                </button>
              )}
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl h-full flex flex-col items-center justify-center text-center opacity-50">
              <Search className="w-16 h-16 text-text-muted mb-4 opacity-50" />
              <p className="text-text-muted">Enter flight details on the left to see prediction results here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predictor;
