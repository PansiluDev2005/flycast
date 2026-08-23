import { Plane, Cpu, Shield, Activity, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/90 bg-white/80 backdrop-blur-xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-sky-200/30 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shadow-md">
                <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <span className="text-lg font-bold font-heading text-slate-900">Flycast Intelligence Platform</span>
            </div>
            <p className="text-slate-600 text-sm max-w-md leading-relaxed">
              Transforming aviation flight operations from reactive crisis management to predictive delay intelligence using ensemble Random Forest & Decision Tree machine learning microservices.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono-code flex items-center gap-1.5 font-medium">
                <Cpu className="w-3.5 h-3.5 text-sky-600" />
                Scikit-Learn ML
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono-code flex items-center gap-1.5 font-medium">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                Flask Python 3.14
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono-code flex items-center gap-1.5 font-medium">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                Node.js Gateway
              </span>
            </div>
          </div>

          {/* Navigation Col */}
          <div>
            <h4 className="text-xs font-bold font-mono-code uppercase tracking-wider text-slate-900 mb-4">Platform Modules</h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-600">
              <li>
                <Link to="/predictor" className="hover:text-sky-600 transition-colors">Passenger Delay Predictor</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-sky-600 transition-colors">Dispatcher Triage Matrix</Link>
              </li>
              <li>
                <Link to="/passenger" className="hover:text-sky-600 transition-colors">Personal Smart Watchlist</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-sky-600 transition-colors">Aviation Admin Console</Link>
              </li>
            </ul>
          </div>

          {/* System Status Col */}
          <div>
            <h4 className="text-xs font-bold font-mono-code uppercase tracking-wider text-slate-900 mb-4">Telemetry Health</h4>
            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>ML Microservice</span>
                </div>
                <span className="text-[10px] font-mono-code font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  OPERATIONAL
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <Radio className="w-3.5 h-3.5 text-sky-600" />
                  <span>Inference Latency</span>
                </div>
                <span className="text-[10px] font-mono-code font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded border border-sky-200">
                  &lt; 28 ms
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Flycast Aerospace Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 font-medium">
            <span className="hover:text-slate-800 cursor-pointer">Security Protocol</span>
            <span className="hover:text-slate-800 cursor-pointer">FAA & ICAO Standard</span>
            <span className="hover:text-slate-800 cursor-pointer">Model Version 1.9.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
