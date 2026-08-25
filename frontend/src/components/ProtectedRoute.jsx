import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-bg-dark text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ message: 'Unauthorized Access - Please Log In' }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-7xl font-extrabold text-slate-800 tracking-tight mb-4">403</h1>
        <h2 className="text-3xl font-bold text-slate-700 mb-4">Access Forbidden</h2>
        <p className="text-lg text-slate-500 mb-8 max-w-md">
          You do not have the required permissions to view this page. If you believe this is an error, please contact your administrator.
        </p>
        <button 
          onClick={() => window.history.back()} 
          className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-sky-500/30"
        >
          Go Back
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
