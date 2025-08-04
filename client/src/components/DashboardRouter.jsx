import { useAuth } from "../contexts/AuthContext";
import DriverDashboard from "../pages/DriverDashboard";
import CompanyDashboard from "../pages/CompanyDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import PassengerDashboard from "../pages/PassengerDashboard";

const DashboardRouter = () => {
  const { user } = useAuth();

  // Route to appropriate dashboard based on user type
  switch (user?.accountType) {
    case "driver":
      return <DriverDashboard />;
    case "company":
      return <CompanyDashboard />;
    case "admin":
      return <AdminDashboard />;
    case "passenger":
      return <PassengerDashboard />;
    default:
      return <DriverDashboard />; // Default fallback
  }
};

export default DashboardRouter;
