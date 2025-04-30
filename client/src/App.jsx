import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";

import { Footer, Navbar } from "./components";
import {
  About,
  AuthPage,
  Companies,
  CompanyProfile,
  FindJobs,
  JobDetail,
  UploadJob,
  UserProfile,
  DriverRegistration,
  DriverProfile,
  FindDrivers,
} from "./pages";
import { useSelector } from "react-redux";

function Layout() {
  const auth = useSelector((store) => store.user);
  return auth ? <Outlet /> : <Navigate to="/user-auth" />;
}

function App() {
  const { auth: user } = useSelector((state) => state.user);
  const isDriver = user?.user?.accountType === "driver";

  return (
    <main className="bg-[#f7fdfd] min-h-screen">
      <Navbar />

      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <Navigate
                to={isDriver ? "/driver-profile" : "/find-jobs"}
                replace={true}
              />
            }
          />
          <Route path="/find-jobs" element={<FindJobs />} />
          <Route path="/find-drivers" element={<FindDrivers />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/driver-registration" element={<DriverRegistration />} />
          <Route path="/driver-profile" element={<DriverProfile />} />
          <Route path={"/company-profile"} element={<CompanyProfile />} />
          <Route path={"/company-profile/:id"} element={<CompanyProfile />} />
          <Route path={"/upload-job"} element={<UploadJob />} />
          <Route path={"/job-detail/:id"} element={<JobDetail />} />
        </Route>

        <Route path="/about-us" element={<About />} />
        <Route path="/user-auth" element={<AuthPage />} />
      </Routes>
      {user && <Footer />}
    </main>
  );
}

export default App;
