import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/shared/Footer";
import FindJobs from "./pages/jobs/FindJobs";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Feeds from "./pages/Feed";
import NotFound from "./pages/404";
import JobDetails from "./pages/jobs/JobDetails";
import Learn from "./pages/Learn";
import { useEffect } from "react";
import SettingsPage from "./pages/Settings";

function Layout() {
  const location = useLocation();
  const auth = true;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);
  return auth ? <Outlet /> : <Navigate to="/auth" />;
}

function App() {
  return (
    <main className="bg-[#fffaf5] min-h-screen pt-10">
      <Navbar />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />

          <Route path="/jobs" element={<FindJobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          <Route path="/feed" element={<Feeds />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 404 */}
          <Route path="/*" element={<NotFound />} />
        </Route>
      </Routes>
      <Footer />
    </main>
  );
}

export default App;
