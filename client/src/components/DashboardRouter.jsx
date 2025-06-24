import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const DashboardRouter = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Small delay to ensure user data is loaded
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Route based on account type
  switch (user?.accountType) {
    case "driver":
    case "admin":
      return <Navigate to="/driver-dashboard" replace />;
    case "company":
      return <Navigate to="/company-dashboard" replace />;
    default:
      // If account type is unclear, check if user has company properties
      if (user?.name && !user?.firstName && !user?.lastName) {
        return <Navigate to="/company-dashboard" replace />;
      }
      // Default to driver dashboard for backward compatibility
      return <Navigate to="/driver-dashboard" replace />;
  }
};

export default DashboardRouter; 