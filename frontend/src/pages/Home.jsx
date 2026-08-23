import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlaneTakeoff, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Radio, 
  Server, 
  Cpu, 
  Layers, 
  Compass, 
  ChevronRight,
  TrendingDown,
  Navigation
} from 'lucide-react';

const Home = () => {
  // Interactive Home Sandbox state
  const [sandboxFlight, setSandboxFlight] = useState('AA123');
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState({
    flight_id: 'AA123',
    carrier: 'American Airlines (AA)',
    route: 'JFK ➔ LAX',
    distance: '2,475 miles',
    dep_time: '08:00 AM',
    delay_prob: 0.14,
    estimated_delay: 0,
    status: 'On Time',
    confidence: '98.2%'
  });

  const handleSimulate = (flightCode) => {
    setSandboxFlight(flightCode);
    setSimulating(true);
    setTimeout(() => {
      if (flightCode === 'DL456') {
        setSimulationResult({
          flight_id: 'DL456',
          carrier: 'Delta Air Lines (DL)',
          route: 'ATL ➔ MIA',
          distance: '594 miles',
          dep_time: '02:30 PM (Peak)',
          delay_prob: 0.82,
          estimated_delay: 45,
          status: 'High Delay Risk',
          confidence: '95.6%'
        });
      } else if (flightCode === 'UA789') {
        setSimulationResult({
          flight_id: 'UA789',
          carrier: 'United Airlines (UA)',
          route: 'ORD ➔ SFO',
          distance: '1,846 miles',
          dep_time: '06:15 PM (Evening)',
          delay_prob: 0.64,
          estimated_delay: 28,
          status: 'Moderate Risk',
          confidence: '92.4%'
        });
      } else {
        setSimulationResult({
          flight_id: 'AA123',
          carrier: 'American Airlines (AA)',
          route: 'JFK ➔ LAX',
          distance: '2,475 miles',
          dep_time: '08:00 AM (Morning)',
          delay_prob: 0.14,
          estimated_delay: 0,
          status: 'On Time',
          confidence: '98.2%'
        });
      }
      setSimulating(false);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-24 md:gap-32 pt-6 pb-12">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col items-center text-center max-w-5xl mx-auto px-4">
        
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide uppercase mb-8 shadow-[0_0_20px_rgba(0,210,255,0.15)] animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Polyglot Microservices • Random Forest Ensemble</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span className="text-slate-400 font-normal">v1.9.0 ML Core</span>
        </div>

        {/* Massive Futuristic Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
          Predict Flight Delays <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,210,255,0.3)]">
            Before Wheels Up
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mb-10 leading-relaxed font-light">
          Flycast shifts aviation management from reactive tracking to proactive prediction. Powered by pre-trained Scikit-Learn models, our platform calculates delay risk probabilities and estimated hold times in under 30 milliseconds.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <Link 
            to="/predictor" 
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-2xl transition-all shadow-[0_0_30px_rgba(0,210,255,0.35)] hover:shadow-[0_0_40px_rgba(0,210,255,0.5)] flex items-center justify-center gap-2 group text-base"
          >
            <span>Launch AI Predictor</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/login" 
            className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-white rounded-2xl font-semibold transition-all border border-white/10 hover:border-cyan-500/30 flex items-center justify-center gap-2 text-base backdrop-blur-md"
          >
            <span>Operator Sign In</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>

        {/* Live Operational Metric Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-16 w-full max-w-4xl">
          <div className="glass-panel p-5 rounded-2xl text-center border-white/5">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono-code bg-gradient-to-r from-cyan-400 to-sky-300 bg-clip-text text-transparent">
              94.8%
            </span>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">Classification Accuracy</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl text-center border-white/5">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono-code text-white">
              &lt; 28ms
            </span>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">Inference Latency</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl text-center border-white/5">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono-code text-emerald-400">
              1.4M+
            </span>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">Flights Trained</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl text-center border-white/5">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono-code text-purple-400">
              3-Tier
            </span>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">RBAC Microservices</p>
          </div>
        </div>

      </section>

      {/* 2. INTERACTIVE LIVE RADAR & PREDICTOR SANDBOX */}
      <section className="max-w-6xl mx-auto w-full px-4">
        <div className="glass-hud rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          
          {/* Subtle Radar Ring Simulation in Background */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full border border-cyan-500/10 pointer-events-none">
            <div className="absolute inset-8 rounded-full border border-cyan-500/10"></div>
            <div className="absolute inset-16 rounded-full border border-cyan-500/15"></div>
            <div className="absolute inset-0 rounded-full border-t border-cyan-500/30 animate-radar-sweep"></div>
          </div>

          <div className="relative z-10 flex flex-col gap-8">
            
            {/* Header with Title & Sample Flight Switchers */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 font-mono-code text-xs uppercase tracking-widest mb-1">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Live Simulator Sandbox</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">Experience Instant Delay Inference</h3>
                <p className="text-slate-400 text-sm mt-1">Select a test flight below to simulate real-time Random Forest predictions.</p>
              </div>

              {/* Sample Preset Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                <button
                  onClick={() => handleSimulate('AA123')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono-code transition-all flex items-center gap-2 ${
                    sandboxFlight === 'AA123'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,210,255,0.2)]'
                      : 'bg-slate-900/80 text-slate-400 border border-white/10 hover:text-white'
                  }`}
                >
                  <PlaneTakeoff className="w-3.5 h-3.5" />
                  <span>AA123 (JFK ➔ LAX)</span>
                </button>

                <button
                  onClick={() => handleSimulate('DL456')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono-code transition-all flex items-center gap-2 ${
                    sandboxFlight === 'DL456'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                      : 'bg-slate-900/80 text-slate-400 border border-white/10 hover:text-white'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span>DL456 (ATL ➔ MIA)</span>
                </button>

                <button
                  onClick={() => handleSimulate('UA789')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono-code transition-all flex items-center gap-2 ${
                    sandboxFlight === 'UA789'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-slate-900/80 text-slate-400 border border-white/10 hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>UA789 (ORD ➔ SFO)</span>
                </button>
              </div>
            </div>

            {/* Sandbox Simulation Result Display */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Flight Specs Card */}
              <div className="lg:col-span-5 bg-slate-900/80 p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-code text-slate-400">FLIGHT IDENTIFIER</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono-code font-bold border border-cyan-500/20">
                    {simulationResult.flight_id}
                  </span>
                </div>
                <div className="text-xl font-bold text-white">{simulationResult.carrier}</div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-mono-code">Route</span>
                    <p className="text-sm font-bold text-white mt-0.5">{simulationResult.route}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-mono-code">Departure</span>
                    <p className="text-sm font-bold text-white mt-0.5">{simulationResult.dep_time}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-mono-code">Distance</span>
                    <p className="text-sm font-bold text-white mt-0.5">{simulationResult.distance}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-mono-code">Model Confidence</span>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5">{simulationResult.confidence}</p>
                  </div>
                </div>
              </div>

              {/* Live ML Inference Cockpit HUD */}
              <div className="lg:col-span-7 bg-slate-950/80 p-6 sm:p-8 rounded-2xl border border-cyan-500/20 relative">
                {simulating ? (
                  <div className="h-48 flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
                    <span className="text-xs font-mono-code text-cyan-400 animate-pulse">Running Random Forest Inference...</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-3 h-3 rounded-full ${simulationResult.delay_prob > 0.5 ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`}></div>
                        <span className="text-xs font-mono-code text-slate-300">PREDICTION STATUS:</span>
                        <span className={`text-xs font-bold font-mono-code uppercase px-2.5 py-0.5 rounded-full ${
                          simulationResult.delay_prob > 0.5 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {simulationResult.status}
                        </span>
                      </div>
                      <span className="text-xs font-mono-code text-slate-400">Engine: delay_classifier.pkl</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Risk Percentage Dial */}
                      <div className="p-4 rounded-xl bg-slate-900/90 border border-white/5 flex flex-col justify-between">
                        <span className="text-xs text-slate-400 uppercase font-mono-code">Delay Probability</span>
                        <div className="flex items-baseline gap-2 my-2">
                          <span className={`text-3xl font-extrabold font-mono-code ${simulationResult.delay_prob > 0.5 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {(simulationResult.delay_prob * 100).toFixed(1)}%
                          </span>
                          <span className="text-xs text-slate-400">risk index</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-700 ${simulationResult.delay_prob > 0.5 ? 'bg-red-500' : 'bg-emerald-400'}`}
                            style={{ width: `${simulationResult.delay_prob * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Regressor Estimated Duration */}
                      <div className="p-4 rounded-xl bg-slate-900/90 border border-white/5 flex flex-col justify-between">
                        <span className="text-xs text-slate-400 uppercase font-mono-code">Estimated Delay Duration</span>
                        <div className="flex items-baseline gap-2 my-2">
                          <span className={`text-3xl font-extrabold font-mono-code ${simulationResult.estimated_delay > 0 ? 'text-red-400' : 'text-slate-100'}`}>
                            +{simulationResult.estimated_delay}
                          </span>
                          <span className="text-xs text-slate-400">minutes</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {simulationResult.estimated_delay > 0 
                            ? 'Triggered Decision Tree Regressor' 
                            : 'Within normal on-time variance tolerance'}
                        </p>
                      </div>
                    </div>

                    {/* Smart Recommendation Footer */}
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-cyan-300">
                        <Navigation className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>
                          {simulationResult.delay_prob > 0.5 
                            ? 'Passenger Action: Delay flight arrival at terminal by 30 mins to avoid excess gate holding.' 
                            : 'Passenger Action: Proceed with standard 2h airport arrival schedule.'}
                        </span>
                      </div>
                      <Link to="/predictor" className="text-cyan-400 font-bold hover:underline shrink-0 ml-2">
                        Try Full Form ➔
                      </Link>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. THREE CORE MODULES SHOWCASE */}
      <section className="max-w-6xl mx-auto w-full px-4">
        <div className="text-center mb-16">
          <span className="text-xs font-mono-code text-cyan-400 uppercase tracking-widest font-semibold">Core Architecture</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-2 mb-4">Tailored for Every Aviation Stakeholder</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base">
            Role-based workflows purpose-built for passengers navigating terminals and flight dispatchers orchestrating hub schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Passenger */}
          <div className="glass-panel p-8 rounded-3xl glass-panel-hover flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,210,255,0.15)]">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Passenger Trip Intelligence</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Single-flight delay predictions with personal watchlists and smart departure time calculation to eliminate unnecessary terminal wait times.
              </p>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Interactive Route Visualizer</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Smart Leave-at Departure Planner</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Digital Boarding Pass Watchlist</span>
                </li>
              </ul>
            </div>
            <Link to="/predictor" className="mt-8 pt-4 border-t border-white/10 text-cyan-400 font-semibold text-xs flex items-center gap-1.5 hover:gap-2 transition-all">
              <span>Explore Passenger Tool</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Dispatcher */}
          <div className="glass-panel p-8 rounded-3xl glass-panel-hover flex flex-col justify-between group border-blue-500/20">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Dispatcher Bulk Triage</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                High-throughput CSV ingestion engine evaluating hundreds of scheduled flights simultaneously to pinpoint high-risk congestion nodes.
              </p>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Batch Multipart CSV Ingestion</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Recharts Risk Distribution Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>One-Click Flight Crew Notification</span>
                </li>
              </ul>
            </div>
            <Link to="/dashboard" className="mt-8 pt-4 border-t border-white/10 text-blue-400 font-semibold text-xs flex items-center gap-1.5 hover:gap-2 transition-all">
              <span>View Dispatcher Matrix</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: Admin */}
          <div className="glass-panel p-8 rounded-3xl glass-panel-hover flex flex-col justify-between group border-purple-500/20">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Governance & Telemetry</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Comprehensive oversight with live microservice heartbeat monitors, RBAC user role permissions, and ML model retraining studios.
              </p>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Live System Latency Telemetry</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Full User RBAC Management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Asynchronous Model Retraining</span>
                </li>
              </ul>
            </div>
            <Link to="/admin" className="mt-8 pt-4 border-t border-white/10 text-purple-400 font-semibold text-xs flex items-center gap-1.5 hover:gap-2 transition-all">
              <span>Open Admin Center</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. COMPARISON: REACTIVE VS PROACTIVE */}
      <section className="max-w-6xl mx-auto w-full px-4">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border-cyan-500/20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono-code text-cyan-400 uppercase tracking-widest font-semibold">The Paradigm Shift</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">Why Proactive Prediction Matters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Legacy Approach */}
            <div className="p-6 sm:p-8 rounded-2xl bg-red-500/5 border border-red-500/20 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold">✕</div>
                <h4 className="text-lg font-bold text-white">Legacy Reactive Flight Trackers</h4>
              </div>
              <ul className="flex flex-col gap-3 text-sm text-slate-400 mt-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Alerts passengers only <strong>after</strong> delays have already commenced.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Causes airport crowding, passenger frustration, and missed connections.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Forces dispatchers to resolve gate bottlenecks in real-time under pressure.</span>
                </li>
              </ul>
            </div>

            {/* Flycast Approach */}
            <div className="p-6 sm:p-8 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col gap-4 shadow-[0_0_30px_rgba(0,210,255,0.1)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">✓</div>
                <h4 className="text-lg font-bold text-white">Flycast AI Proactive Prediction</h4>
              </div>
              <ul className="flex flex-col gap-3 text-sm text-slate-300 mt-2">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Forecasts delay probabilities <strong>hours in advance</strong> before departure.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Calculates optimal home departure time and personalized airport buffers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Enables dispatchers to pre-emptively reallocate gates and notify ground crews.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="text-center max-w-4xl mx-auto px-4 py-8">
        <div className="glass-hud p-10 sm:p-14 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent pointer-events-none"></div>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 relative z-10">
            Ready to Forecast Your Next Flight?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-xl mx-auto relative z-10 font-light">
            Test single flight numbers or log in with demo credentials to explore the dispatcher and administrator command centers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              to="/predictor"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold rounded-2xl transition-all shadow-[0_0_25px_rgba(0,210,255,0.4)] text-base"
            >
              Start Free Flight Prediction
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl transition-all border border-white/10 text-base"
            >
              Sign In (Demo Logins)
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
