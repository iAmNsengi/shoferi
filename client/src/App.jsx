import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/shared/Navbar";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/shared/Footer";
import FindJobs from "./pages/jobs/FindJobs";
import CreateJob from "./pages/jobs/CreateJob";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Feeds from "./pages/Feed";
import NotFound from "./pages/404";
import JobDetails from "./pages/jobs/JobDetails";
import Learn from "./pages/Learn";
import SettingsPage from "./pages/Settings";
import DriverDashboard from "./pages/DriverDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DashboardRouter from "./components/DashboardRouter";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

function PublicRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // If user is authenticated and trying to access auth pages, redirect to intended page or home
  if (
    isAuthenticated &&
    (location.pathname === "/login" || location.pathname === "/register")
  ) {
    const intendedDestination = location.state?.from?.pathname || "/";
    return <Navigate to={intendedDestination} replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <main className="bg-gradient-to-br from-green-50 to-green-100 min-h-screen pt-10">
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Landing page - accessible to all */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/jobs" element={<FindJobs />} />
          <Route path="/jobs/create" element={<CreateJob />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/feed" element={<Feeds />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#16a34a",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: "500",
          },
          success: {
            duration: 3000,
            style: {
              background: "#22c55e",
              color: "#fff",
            },
          },
          error: {
            duration: 5000,
            style: {
              background: "#ef4444",
              color: "#fff",
            },
          },
        }}
      />
    </main>
  );
}

export default App;
