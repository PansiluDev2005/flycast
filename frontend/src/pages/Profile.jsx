import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User, Shield, Calendar, Mail } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app we might fetch more details from /api/users/profile
    // For now we can just use the context and maybe format it nicely.
    // If we had a specific endpoint we'd call it here.
    setTimeout(() => {
      setProfileData({
        username: user?.username || 'Unknown',
        role: user?.role || 'passenger',
        joined: new Date().toLocaleDateString() // mock join date for demo
      });
      setLoading(false);
    }, 500);
  }, [user]);

  if (loading) {
    return <div className="flex justify-center mt-20"><span className="animate-pulse text-primary">Loading Profile...</span></div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="glass-panel p-10 rounded-2xl relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <div className="w-32 h-32 bg-surface-hover rounded-full border-4 border-surface flex items-center justify-center shadow-xl">
            <User className="w-16 h-16 text-primary" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2 capitalize">{profileData.username}</h1>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              <span className="capitalize">{profileData.role}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface p-4 rounded-xl border border-surface-hover flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-text-muted">Member Since</p>
                  <p className="font-medium">{profileData.joined}</p>
                </div>
              </div>
              
              <div className="bg-surface p-4 rounded-xl border border-surface-hover flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-text-muted">Contact</p>
                  <p className="font-medium">{profileData.username}@flycast.com</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
