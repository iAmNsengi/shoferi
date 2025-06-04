import { Outlet, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/Footer";

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
        </Route>
      </Routes>
      {<Footer />}
    </main>
  );
}

export default App;
