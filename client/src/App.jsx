import { Outlet, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/shared/Footer";
import FindJobs from "./pages/FindJobs";
import Login from "./pages/auth/Login";

function Layout() {
  const auth = true;
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
          {/* auth */}
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
      <Footer />
    </main>
  );
}

export default App;
