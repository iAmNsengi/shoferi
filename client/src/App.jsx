import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
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
import { useEffect } from "react";

function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

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
  const { isAuthenticated } = useSelector((state) => state.auth);
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
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <main className="bg-[#fffaf5] min-h-screen pt-10">
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
          <Route path="/jobs" element={<FindJobs />} />
          <Route path="/jobs/create" element={<CreateJob />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/feed" element={<Feeds />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </main>
  );
}

export default App;
