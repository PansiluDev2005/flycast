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
  // Interactive Home Sandbox state (featuring SriLankan Airlines UL503 Colombo to London)
  const [sandboxFlight, setSandboxFlight] = useState('UL503');
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState({
    flight_id: 'UL503',
    carrier: 'SriLankan Airlines (UL)',
    route: 'CMB (Colombo) ➔ LHR (London)',
    distance: '5,410 miles',
    dep_time: '01:00 PM (Afternoon)',
    delay_prob: 0.38,
    estimated_delay: 0,
    status: 'On Time',
    confidence: '97.8%'
  });

  const handleSimulate = (flightCode) => {
    setSandboxFlight(flightCode);
    setSimulating(true);
    setTimeout(() => {
      if (flightCode === 'UL225') {
        setSimulationResult({
          flight_id: 'UL225',
          carrier: 'SriLankan Airlines (UL)',
          route: 'CMB (Colombo) ➔ DXB (Dubai)',
          distance: '2,045 miles',
          dep_time: '06:45 PM (Evening Peak)',
          delay_prob: 0.74,
          estimated_delay: 35,
          status: 'High Delay Risk',
          confidence: '95.4%'
        });
      } else if (flightCode === 'UL101') {
        setSimulationResult({
          flight_id: 'UL101',
          carrier: 'SriLankan Airlines (UL)',
          route: 'CMB (Colombo) ➔ MLE (Male)',
          distance: '483 miles',
          dep_time: '07:20 AM (Morning)',
          delay_prob: 0.18,
          estimated_delay: 0,
          status: 'On Time',
          confidence: '98.6%'
        });
      } else if (flightCode === 'DL456') {
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
      } else {
        setSimulationResult({
          flight_id: 'UL503',
          carrier: 'SriLankan Airlines (UL)',
          route: 'CMB (Colombo) ➔ LHR (London)',
          distance: '5,410 miles',
          dep_time: '01:00 PM (Afternoon)',
          delay_prob: 0.38,
          estimated_delay: 0,
          status: 'On Time',
          confidence: '97.8%'
        });
      }
      setSimulating(false);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-20 md:gap-28 pt-2 pb-12">
      
      {/* 1. HERO SECTION WITH AIRCRAFT BACKGROUND IMAGE */}
      <section className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-white">
        
        {/* Background Aviation Image with Luminous Light Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105"
          style={{ backgroundImage: "url('/images/hero-flight.jpg')" }}
        ></div>
        
        {/* Soft Radial & Linear Light Overlay for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/95"></div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto px-6 py-16 sm:py-24">
          
          {/* Top Feature Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100/90 border border-sky-300 text-sky-800 text-xs font-bold tracking-wide uppercase mb-6 shadow-sm animate-in fade-in slide-in-from-top-4">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
            <span>Polyglot Microservices • Random Forest Ensemble</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            <span className="text-slate-600 font-medium">v1.9.0 Core</span>
          </div>

          {/* Massive Futuristic Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-slate-900 font-heading">
            Predict Flight Delays <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Before Wheels Up
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 max-w-3xl mb-10 leading-relaxed font-normal">
            Flycast shifts aviation management from reactive tracking to proactive prediction. Powered by pre-trained Scikit-Learn models, our platform calculates delay risk probabilities and estimated hold times in under 30 milliseconds.
          </p>

          {/* CTA Button Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <Link 
              to="/predictor" 
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-2xl transition-all shadow-[0_6px_20px_rgba(14,165,233,0.35)] hover:shadow-[0_8px_25px_rgba(14,165,233,0.5)] flex items-center justify-center gap-2 group text-base"
            >
              <span>Launch AI Predictor</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-white/90 hover:bg-slate-50 text-slate-800 rounded-2xl font-bold transition-all border border-slate-300 shadow-sm flex items-center justify-center gap-2 text-base backdrop-blur-md"
            >
              <span>Operator Sign In</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>

          {/* Live Operational Metric Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-14 w-full max-w-4xl">
            <div className="glass-panel p-5 rounded-2xl text-center border-slate-200 shadow-sm bg-white/85">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono-code text-sky-600">
                94.8%
              </span>
              <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">Classification Accuracy</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl text-center border-slate-200 shadow-sm bg-white/85">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono-code text-slate-900">
                &lt; 28ms
              </span>
              <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">Inference Latency</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl text-center border-slate-200 shadow-sm bg-white/85">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono-code text-emerald-600">
                1.4M+
              </span>
              <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">Flights Trained</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl text-center border-slate-200 shadow-sm bg-white/85">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono-code text-purple-600">
                3-Tier
              </span>
              <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">RBAC Microservices</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. INTERACTIVE LIVE RADAR & PREDICTOR SANDBOX */}
      <section className="max-w-6xl mx-auto w-full">
        <div className="glass-hud rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-lg border-slate-200">
          
          <div className="relative z-10 flex flex-col gap-8">
            
            {/* Header with Title & Sample Flight Switchers */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 text-sky-600 font-mono-code text-xs uppercase tracking-widest mb-1 font-bold">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Live Simulator Sandbox</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">Experience Instant Delay Inference</h3>
                <p className="text-slate-600 text-sm mt-1">Select a test flight below to simulate real-time Random Forest predictions.</p>
              </div>

              {/* Sample Preset Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                <button
                  onClick={() => handleSimulate('UL503')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono-code transition-all flex items-center gap-2 ${
                    sandboxFlight === 'UL503'
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <PlaneTakeoff className="w-3.5 h-3.5" />
                  <span>🇱🇰 UL503 (CMB ➔ LHR)</span>
                </button>

                <button
                  onClick={() => handleSimulate('UL101')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono-code transition-all flex items-center gap-2 ${
                    sandboxFlight === 'UL101'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <PlaneTakeoff className="w-3.5 h-3.5" />
                  <span>🇱🇰 UL101 (CMB ➔ MLE)</span>
                </button>

                <button
                  onClick={() => handleSimulate('UL225')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono-code transition-all flex items-center gap-2 ${
                    sandboxFlight === 'UL225'
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>🇱🇰 UL225 (CMB ➔ DXB)</span>
                </button>

                <button
                  onClick={() => handleSimulate('DL456')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono-code transition-all flex items-center gap-2 ${
                    sandboxFlight === 'DL456'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>DL456 (ATL ➔ MIA)</span>
                </button>
              </div>
            </div>

            {/* Sandbox Simulation Result Display */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Flight Specs Card */}
              <div className="lg:col-span-5 bg-slate-50/90 p-6 rounded-2xl border border-slate-200 flex flex-col gap-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-code text-slate-500 font-bold uppercase">FLIGHT IDENTIFIER</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-mono-code font-bold border border-sky-200">
                    {simulationResult.flight_id}
                  </span>
                </div>
                <div className="text-xl font-bold text-slate-900">{simulationResult.carrier}</div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-[10px] text-slate-500 uppercase font-mono-code font-bold">Route</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{simulationResult.route}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-[10px] text-slate-500 uppercase font-mono-code font-bold">Departure</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{simulationResult.dep_time}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-[10px] text-slate-500 uppercase font-mono-code font-bold">Distance</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{simulationResult.distance}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-[10px] text-slate-500 uppercase font-mono-code font-bold">Model Confidence</span>
                    <p className="text-sm font-bold text-emerald-600 mt-0.5">{simulationResult.confidence}</p>
                  </div>
                </div>
              </div>

              {/* Live ML Inference Cockpit HUD */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-sky-200 shadow-md relative">
                {simulating ? (
                  <div className="h-48 flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full border-3 border-sky-500 border-t-transparent animate-spin"></div>
                    <span className="text-xs font-mono-code text-sky-700 animate-pulse font-bold">Running Random Forest Inference...</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-3 h-3 rounded-full ${simulationResult.delay_prob > 0.5 ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></div>
                        <span className="text-xs font-mono-code text-slate-500 font-bold">STATUS:</span>
                        <span className={`text-xs font-bold font-mono-code uppercase px-2.5 py-0.5 rounded-full ${
                          simulationResult.delay_prob > 0.5 
                            ? 'bg-red-100 text-red-700 border border-red-200' 
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}>
                          {simulationResult.status}
                        </span>
                      </div>
                      <span className="text-xs font-mono-code text-slate-500 font-medium">Engine: delay_classifier.pkl</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Risk Percentage Dial */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                        <span className="text-xs text-slate-500 uppercase font-mono-code font-bold">Delay Probability</span>
                        <div className="flex items-baseline gap-2 my-2">
                          <span className={`text-3xl font-extrabold font-mono-code ${simulationResult.delay_prob > 0.5 ? 'text-red-600' : 'text-emerald-600'}`}>
                            {(simulationResult.delay_prob * 100).toFixed(1)}%
                          </span>
                          <span className="text-xs text-slate-500">risk index</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-700 ${simulationResult.delay_prob > 0.5 ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${simulationResult.delay_prob * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Regressor Estimated Duration */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                        <span className="text-xs text-slate-500 uppercase font-mono-code font-bold">Estimated Hold Duration</span>
                        <div className="flex items-baseline gap-2 my-2">
                          <span className={`text-3xl font-extrabold font-mono-code ${simulationResult.estimated_delay > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                            +{simulationResult.estimated_delay}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">minutes</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {simulationResult.estimated_delay > 0 
                            ? 'Triggered Decision Tree Regressor' 
                            : 'Within normal on-time variance tolerance'}
                        </p>
                      </div>
                    </div>

                    {/* Smart Recommendation Footer */}
                    <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-sky-900 font-medium">
                        <Navigation className="w-4 h-4 text-sky-600 shrink-0" />
                        <span>
                          {simulationResult.delay_prob > 0.5 
                            ? 'Passenger Action: Delay flight arrival at terminal by 30 mins to avoid excess gate holding.' 
                            : 'Passenger Action: Proceed with standard 2h airport arrival schedule.'}
                        </span>
                      </div>
                      <Link to="/predictor" className="text-sky-600 font-bold hover:underline shrink-0 ml-2">
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

      {/* 3. THREE CORE MODULES SHOWCASE WITH AIRPORT IMAGE BACKGROUND ACCENT */}
      <section className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-14">
          <span className="text-xs font-mono-code text-sky-600 uppercase tracking-widest font-bold">Core Architecture</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 font-heading mt-2 mb-4">Tailored for Every Aviation Stakeholder</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base">
            Role-based workflows purpose-built for passengers navigating terminals and flight dispatchers orchestrating hub schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Passenger */}
          <div className="glass-panel p-8 rounded-3xl glass-panel-hover flex flex-col justify-between group bg-white">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-600 mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading">Passenger Trip Intelligence</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Single-flight delay predictions with personal watchlists and smart departure time calculation to eliminate unnecessary terminal wait times.
              </p>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Interactive Route Visualizer</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Smart Leave-at Departure Planner</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Digital Boarding Pass Watchlist</span>
                </li>
              </ul>
            </div>
            <Link to="/predictor" className="mt-8 pt-4 border-t border-slate-100 text-sky-600 font-bold text-xs flex items-center gap-1.5 hover:gap-2 transition-all">
              <span>Explore Passenger Tool</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Dispatcher */}
          <div className="glass-panel p-8 rounded-3xl glass-panel-hover flex flex-col justify-between group border-blue-200 bg-white">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading">Dispatcher Bulk Triage</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                High-throughput CSV ingestion engine evaluating hundreds of scheduled flights simultaneously to pinpoint high-risk congestion nodes.
              </p>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Batch Multipart CSV Ingestion</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Recharts Risk Distribution Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>One-Click Flight Crew Notification</span>
                </li>
              </ul>
            </div>
            <Link to="/dashboard" className="mt-8 pt-4 border-t border-slate-100 text-blue-600 font-bold text-xs flex items-center gap-1.5 hover:gap-2 transition-all">
              <span>View Dispatcher Matrix</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: Admin */}
          <div className="glass-panel p-8 rounded-3xl glass-panel-hover flex flex-col justify-between group border-purple-200 bg-white">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading">Governance & Telemetry</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Comprehensive oversight with live microservice heartbeat monitors, RBAC user role permissions, and ML model retraining studios.
              </p>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Live System Latency Telemetry</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Full User RBAC Management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Asynchronous Model Retraining</span>
                </li>
              </ul>
            </div>
            <Link to="/admin" className="mt-8 pt-4 border-t border-slate-100 text-purple-600 font-bold text-xs flex items-center gap-1.5 hover:gap-2 transition-all">
              <span>Open Admin Center</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. COMPARISON: REACTIVE VS PROACTIVE */}
      <section className="max-w-6xl mx-auto w-full">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border-slate-200 bg-white shadow-md">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono-code text-sky-600 uppercase tracking-widest font-bold">The Paradigm Shift</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-heading mt-2">Why Proactive Prediction Matters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Legacy Approach */}
            <div className="p-6 sm:p-8 rounded-2xl bg-red-50/70 border border-red-200 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">✕</div>
                <h4 className="text-lg font-bold text-slate-900">Legacy Reactive Flight Trackers</h4>
              </div>
              <ul className="flex flex-col gap-3 text-sm text-slate-600 mt-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Alerts passengers only <strong>after</strong> delays have already commenced.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Causes airport crowding, passenger frustration, and missed connections.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Forces dispatchers to resolve gate bottlenecks in real-time under pressure.</span>
                </li>
              </ul>
            </div>

            {/* Flycast Approach */}
            <div className="p-6 sm:p-8 rounded-2xl bg-sky-50/80 border border-sky-200 flex flex-col gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold">✓</div>
                <h4 className="text-lg font-bold text-slate-900">Flycast AI Proactive Prediction</h4>
              </div>
              <ul className="flex flex-col gap-3 text-sm text-slate-700 mt-2">
                <li className="flex items-start gap-2">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Forecasts delay probabilities <strong>hours in advance</strong> before departure.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Calculates optimal home departure time and personalized airport buffers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>Enables dispatchers to pre-emptively reallocate gates and notify ground crews.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION WITH AIRPORT TERMINAL BACKGROUND */}
      <section className="max-w-5xl mx-auto w-full">
        <div className="rounded-3xl overflow-hidden shadow-xl relative border border-slate-200">
          
          {/* Airport Terminal Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35"
            style={{ backgroundImage: "url('/images/airport-terminal.jpg')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-sky-900/90 via-blue-900/85 to-indigo-900/90"></div>
          
          <div className="relative z-10 p-10 sm:p-16 text-center text-white">
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 font-heading">
              Ready to Forecast Your Next Flight?
            </h2>
            <p className="text-sky-100 text-base sm:text-lg mb-8 max-w-xl mx-auto font-normal">
              Test single flight numbers or log in with demo credentials to explore the dispatcher and administrator command centers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/predictor"
                className="w-full sm:w-auto px-8 py-4 bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold rounded-2xl transition-all shadow-lg text-base"
              >
                Start Free Flight Prediction
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-2xl transition-all border border-white/30 text-base backdrop-blur-md"
              >
                Sign In (Demo Logins)
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
