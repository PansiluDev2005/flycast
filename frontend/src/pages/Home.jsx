import { Link } from 'react-router-dom';
import { PlaneTakeoff, Shield, Zap, BarChart3 } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-20">
      <div className="text-center max-w-3xl animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">Powered by Next-Gen AI</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Proactive Flight Delay <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
            Predictions
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-text-muted mb-10 leading-relaxed">
          Flycast utilizes advanced Machine Learning models to shift aviation management from reactive tracking to proactive prediction, ensuring smoother operations for passengers and dispatchers alike.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
            Get Started
            <PlaneTakeoff className="w-5 h-5" />
          </Link>
          <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-surface hover:bg-surface-hover text-white rounded-xl font-medium transition-colors border border-white/5">
            Learn More
          </a>
        </div>
      </div>

      <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-6xl w-full px-6 pb-20">
        <FeatureCard 
          icon={<PlaneTakeoff className="w-8 h-8 text-sky-400" />}
          title="Passenger Insights"
          description="Check individual flight delay probabilities and estimated delay durations before you head to the airport."
        />
        <FeatureCard 
          icon={<BarChart3 className="w-8 h-8 text-indigo-400" />}
          title="Dispatcher Triage"
          description="Upload bulk flight schedules for batch AI predictions and operational triage dashboard analytics."
        />
        <FeatureCard 
          icon={<Shield className="w-8 h-8 text-emerald-400" />}
          title="Enterprise Security"
          description="Robust RBAC and secure APIs ensuring that only authorized personnel can access sensitive operational data."
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
    <div className="w-14 h-14 bg-surface rounded-xl flex items-center justify-center mb-6 border border-white/5 shadow-inner">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-text-muted leading-relaxed">{description}</p>
  </div>
);

export default Home;
