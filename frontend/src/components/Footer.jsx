import { Plane, Cpu, Shield, Activity, Radio, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/5 bg-[#050810]/80 backdrop-blur-xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-cyan-500/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <span className="text-lg font-bold font-heading text-white">Flycast Intelligence Platform</span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Transforming aviation flight operations from reactive crisis management to predictive delay intelligence using ensemble Random Forest & Decision Tree machine learning microservices.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-300 text-xs font-mono-code flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Scikit-Learn ML
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-300 text-xs font-mono-code flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Flask Python 3.14
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-300 text-xs font-mono-code flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                Node.js Gateway
              </span>
            </div>
          </div>

          {/* Navigation Col */}
          <div>
            <h4 className="text-xs font-bold font-mono-code uppercase tracking-wider text-slate-300 mb-4">Platform Modules</h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              <li>
                <Link to="/predictor" className="hover:text-cyan-400 transition-colors">Passenger Delay Predictor</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">Dispatcher Triage Matrix</Link>
              </li>
              <li>
                <Link to="/passenger" className="hover:text-cyan-400 transition-colors">Personal Smart Watchlist</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-cyan-400 transition-colors">Aviation Admin Console</Link>
              </li>
            </ul>
          </div>

          {/* System Status Col */}
          <div>
            <h4 className="text-xs font-bold font-mono-code uppercase tracking-wider text-slate-300 mb-4">Telemetry Health</h4>
            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>ML Microservice</span>
                </div>
                <span className="text-[10px] font-mono-code font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  OPERATIONAL
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Inference Latency</span>
                </div>
                <span className="text-[10px] font-mono-code font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  &lt; 28 ms
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Flycast Aerospace Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Security Protocol</span>
            <span className="hover:text-slate-300 cursor-pointer">FAA & ICAO Standard</span>
            <span className="hover:text-slate-300 cursor-pointer">Model Version 1.9.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
