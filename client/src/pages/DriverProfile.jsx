import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCar, FaStar, FaClock, FaMoneyBillWave } from "react-icons/fa";
import { CustomButton } from "../components";
import { apiRequest } from "../utils";
import { useSelector } from "react-redux";
import { format } from "date-fns";

const DriverProfile = () => {
  const [driver, setDriver] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchDriverProfile = async () => {
      try {
        const res = await apiRequest({
          url: "/drivers/profile",
          method: "GET",
        });

        if (res?.success) {
          setDriver(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await apiRequest({
          url: "/bookings/driver",
          method: "GET",
        });

        if (res?.success) {
          setBookings(res.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDriverProfile();
    fetchBookings();
  }, []);

  const toggleAvailability = async () => {
    try {
      const res = await apiRequest({
        url: "/drivers/toggle-availability",
        method: "PUT",
      });

      if (res?.success) {
        setDriver((prev) => ({
          ...prev,
          availability: {
            ...prev.availability,
            status:
              prev.availability.status === "available"
                ? "offline"
                : "available",
          },
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
            <img
              src={user?.profileUrl || "/default-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {user?.firstName} {user?.lastName}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <FaCar className="text-blue-500" />
                <span>{driver?.licenseType}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                <span>{driver?.rating || 0} Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-green-500" />
                <span>{driver?.experience} Years Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMoneyBillWave className="text-green-500" />
                <span>
                  RWF {driver?.pricePerHour}/hr | RWF {driver?.pricePerDay}/day
                </span>
              </div>
            </div>
          </div>

          <div>
            <CustomButton
              onClick={toggleAvailability}
              title={
                driver?.availability?.status === "available"
                  ? "Go Offline"
                  : "Go Online"
              }
              containerStyles={`px-6 py-2 rounded-full ${
                driver?.availability?.status === "available"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white`}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-6">Recent Bookings</h2>
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <p className="text-gray-500 text-center">No bookings yet</p>
          ) : (
            bookings.map((booking) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">
                      {booking.user.firstName} {booking.user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(booking.startDate), "PPP")} -{" "}
                      {format(new Date(booking.endDate), "PPP")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.bookingType}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">RWF {booking.totalPrice}</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                        booking.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DriverProfile;
