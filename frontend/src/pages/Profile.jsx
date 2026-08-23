import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Shield, 
  Mail, 
  Key, 
  Check, 
  Copy
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
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200 text-xs font-mono-code mb-2 font-bold">
          <Shield className="w-3.5 h-3.5 text-sky-600" />
          <span>Operator Credentials</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">Personnel Profile</h1>
        <p className="text-slate-600 text-sm mt-1">
          Identity authentication details, security clearance level, and developer API tokens.
        </p>
      </div>

      {/* Profile Badge Hero Card */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl relative overflow-hidden border border-slate-200 shadow-lg">
        
        {/* Luminous corner gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100/60 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10">
          
          {/* Avatar Badge */}
          <div className="relative">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-sky-500 to-blue-600 p-1 shadow-md">
              <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center text-4xl font-extrabold text-sky-600 font-mono-code">
                {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-mono-code font-bold border-2 border-white shadow-sm">
              ACTIVE
            </span>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left flex flex-col gap-4">
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h2 className="text-3xl font-extrabold text-slate-900 font-heading">{user?.username || 'Authenticated Operator'}</h2>
                <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200 text-xs font-mono-code font-bold uppercase tracking-wider">
                  {user?.role || 'Passenger'} Tier
                </span>
              </div>
              <p className="text-slate-500 text-xs font-mono-code mt-1 font-medium">
                Authorized Personnel • Flycast Aviation Platform
              </p>
            </div>

            {/* Quick Grid Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-left overflow-hidden">
                  <span className="text-[10px] font-mono-code text-slate-500 uppercase font-bold">Contact Link</span>
                  <p className="text-xs font-mono-code text-slate-800 truncate font-semibold">{user?.username}@flycast.aero</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-mono-code text-slate-500 uppercase font-bold">Clearance Level</span>
                  <p className="text-xs font-mono-code text-slate-800 font-semibold">
                    {user?.role === 'admin' ? 'Level 4 (System Admin)' : user?.role === 'dispatcher' ? 'Level 3 (Operations)' : 'Level 1 (Standard)'}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Developer API & Integration Credentials */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-200 bg-white shadow-md flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-sky-600" />
            <h3 className="text-lg font-bold text-slate-900 font-heading">Live API Key Token</h3>
          </div>
          <span className="text-[10px] font-mono-code text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
            VALID
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Use this token for headless programmatic inferences with the Python Flask ML microservice endpoint (`POST /predict`).
        </p>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-300 shadow-inner">
          <span className="text-xs font-mono-code text-sky-900 font-bold select-all truncate">{mockApiKey}</span>
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900 transition-colors shrink-0 ml-2 shadow-sm"
            title="Copy API Token"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

    </div>
  );
};

export default Profile;
