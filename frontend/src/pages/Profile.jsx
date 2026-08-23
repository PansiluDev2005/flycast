import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  User, 
  Shield, 
  Calendar, 
  Mail, 
  Key, 
  Radio, 
  Check, 
  Copy, 
  Activity, 
  Plane, 
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [copied, setCopied] = useState(false);
  const mockApiKey = 'flycast_live_sec_89dfa71b3e804f98a3b8c';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mockApiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10">
      
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono-code mb-2">
          <Shield className="w-3.5 h-3.5" />
          <span>Operator Credentials</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Personnel Profile</h1>
        <p className="text-slate-400 text-sm mt-1">
          Identity authentication details, security clearance level, and developer API tokens.
        </p>
      </div>

      {/* Profile Badge Hero Card */}
      <div className="glass-hud p-8 sm:p-10 rounded-3xl relative overflow-hidden border border-white/10 shadow-2xl">
        
        {/* Holographic corner gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10">
          
          {/* Avatar Badge */}
          <div className="relative">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 p-1 shadow-[0_0_30px_rgba(0,210,255,0.3)]">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-4xl font-extrabold text-cyan-400 font-mono-code">
                {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-mono-code font-bold border-2 border-slate-950">
              ACTIVE
            </span>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left flex flex-col gap-4">
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h2 className="text-3xl font-extrabold text-white">{user?.username || 'Authenticated Operator'}</h2>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono-code font-bold uppercase tracking-wider">
                  {user?.role || 'Passenger'} Tier
                </span>
              </div>
              <p className="text-slate-400 text-xs font-mono-code mt-1">
                Authorized Personnel • Flycast Aviation Platform
              </p>
            </div>

            {/* Quick Grid Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-left overflow-hidden">
                  <span className="text-[10px] font-mono-code text-slate-400 uppercase">Contact Link</span>
                  <p className="text-xs font-mono-code text-white truncate">{user?.username}@flycast.aero</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-mono-code text-slate-400 uppercase">Clearance Level</span>
                  <p className="text-xs font-mono-code text-white">
                    {user?.role === 'admin' ? 'Level 4 (System Admin)' : user?.role === 'dispatcher' ? 'Level 3 (Operations)' : 'Level 1 (Standard)'}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Developer API & Integration Credentials */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Live API Key Token</h3>
          </div>
          <span className="text-[10px] font-mono-code text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            VALID
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Use this token for headless programmatic inferences with the Python Flask ML microservice endpoint (`POST /predict`).
        </p>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30">
          <span className="text-xs font-mono-code text-cyan-300 select-all truncate">{mockApiKey}</span>
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0 ml-2"
            title="Copy API Token"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

    </div>
  );
};

export default Profile;
