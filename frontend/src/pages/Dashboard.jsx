import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Zap, BarChart3, PlaneTakeoff, Clock, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const token = user?.token || 'dummy';

      const res = await axios.post('http://localhost:5000/api/ml/predict/bulk', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      setResults(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Error processing bulk prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleNotify = async (flightId, action) => {
    try {
      const token = user?.token || 'dummy';
      await axios.post('http://localhost:5000/api/notifications', { flightId, action }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Notification sent: ${action} for ${flightId}`);
    } catch (err) {
      console.error(err);
      alert('Failed to send notification');
    }
  };

  const filteredResults = results ? results.filter(f => {
    if (filter === 'All') return true;
    if (filter === 'High Risk') return f.delay_probability > 0.5;
    if (filter === 'On Time') return f.delay_probability <= 0.5;
    return true;
  }) : [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Dispatcher Triage Dashboard</h1>
        <p className="text-text-muted">Upload bulk flight schedules for batch AI predictions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 glass-panel p-8 rounded-2xl h-fit sticky top-24">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-primary" />
            Bulk CSV Upload
          </h2>
          
          <div className="border-2 border-dashed border-surface-hover hover:border-primary/50 transition-colors rounded-xl p-10 flex flex-col items-center justify-center text-center mb-6 relative">
            <FileText className="w-12 h-12 text-text-muted mb-4" />
            <p className="text-lg font-medium mb-1">Drag & drop your CSV file</p>
            <p className="text-text-muted text-sm mb-4">Expected Columns: FLIGHT_ID, DATE, CARRIER, ORIGIN, DEST, CRS_DEP_TIME, DISTANCE</p>
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button className="px-6 py-2 bg-surface hover:bg-surface-hover rounded-lg transition-colors text-sm font-medium border border-white/5 pointer-events-none">
              Browse Files
            </button>
          </div>
          
          {file && (
            <div className="flex items-center justify-between bg-surface p-4 rounded-lg border border-surface-hover mb-6">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium truncate">{file.name}</span>
              </div>
              <span className="text-xs text-text-muted flex-shrink-0 ml-2">{(file.size / 1024).toFixed(1)} KB</span>
            </div>
          )}
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}
          
          <button 
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full bg-primary hover:bg-primary-dark disabled:bg-surface disabled:text-text-muted text-white font-medium py-3 rounded-lg transition-all flex justify-center items-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse flex items-center gap-2"><Zap className="w-4 h-4" /> Processing Batch...</span>
            ) : (
              <>
                <Zap className="w-4 h-4" /> Run Predictions
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-8 glass-panel p-8 rounded-2xl flex flex-col min-h-[500px]">
          <h2 className="text-xl font-semibold mb-6 flex items-center justify-between">
            <span>Flights Triage</span>
            
            {results && (
              <div className="flex items-center gap-4">
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-surface border border-surface-hover rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary cursor-pointer text-text-muted hover:text-white transition-colors"
                >
                  <option value="All">All Flights</option>
                  <option value="High Risk">High Risk Only</option>
                  <option value="On Time">On Time Only</option>
                </select>
                <span className="text-sm font-normal px-3 py-1 bg-surface-hover text-text-main rounded-full">
                  {filteredResults.length} Flights
                </span>
              </div>
            )}
          </h2>
          
          {results ? (
            <div className="flex-1 animate-fade-in overflow-auto pr-2">
               {filteredResults.length > 0 ? (
                 <div className="flex flex-col gap-4">
                   {filteredResults.map((flight, idx) => {
                     const isDelayed = flight.delay_probability > 0.5;
                     return (
                       <div key={idx} className={`bg-surface p-5 rounded-xl border ${isDelayed ? 'border-red-500/30 hover:border-red-500/60' : 'border-emerald-500/30 hover:border-emerald-500/60'} transition-colors flex items-center justify-between group`}>
                         <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-full ${isDelayed ? 'bg-red-500/20 border-red-500/30' : 'bg-emerald-500/20 border-emerald-500/30'} flex items-center justify-center border group-hover:scale-110 transition-transform`}>
                              <PlaneTakeoff className={`w-6 h-6 ${isDelayed ? 'text-red-400' : 'text-emerald-400'}`} />
                            </div>
                            <div>
                              <p className="text-xl font-bold">{flight.flight_id}</p>
                              <div className="flex items-center gap-3 text-sm mt-1 text-text-muted">
                                <span className={`flex items-center gap-1 ${isDelayed ? 'text-red-400' : 'text-emerald-400'}`}>
                                  {isDelayed ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />} 
                                  {(flight.delay_probability * 100).toFixed(1)}% Risk
                                </span>
                              </div>
                            </div>
                         </div>
                         
                         <div className="flex flex-col items-end text-right">
                            <p className="text-text-muted text-sm mb-1">Est. Delay</p>
                            <div className={`flex items-center gap-2 text-2xl font-bold ${isDelayed ? 'text-red-400' : 'text-emerald-400'} mb-3`}>
                              <Clock className="w-5 h-5" />
                              {flight.estimated_minutes} min
                            </div>
                            
                            {isDelayed && (
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleNotify(flight.flight_id, 'Notify Crew')}
                                  className="px-3 py-1 bg-surface hover:bg-surface-hover text-xs font-medium text-text-muted hover:text-white rounded border border-surface-hover transition-colors"
                                >
                                  Notify Crew
                                </button>
                                <button 
                                  onClick={() => handleNotify(flight.flight_id, 'Reallocate Gate')}
                                  className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-400 rounded border border-red-500/20 transition-colors"
                                >
                                  Reallocate Gate
                                </button>
                              </div>
                            )}
                         </div>
                       </div>
                     );
                   })}
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-center py-20">
                    <div className="w-20 h-20 bg-surface-hover rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10 text-text-muted" />
                    </div>
                    <h3 className="text-2xl font-bold text-text-main mb-2">No Flights Found</h3>
                    <p className="text-text-muted">No flights match the current filter.</p>
                 </div>
               )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
              <BarChart3 className="w-16 h-16 text-text-muted mb-4 opacity-50" />
              <p className="text-text-muted">Upload a schedule to run the triage analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
