import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaStar, FaCar, FaMoneyBillWave } from "react-icons/fa";
import { CustomButton, TextInput } from "../components";
import { apiRequest } from "../utils";
import { format } from "date-fns";

const FindDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    location: "",
    date: "",
    type: "hourly",
  });
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await apiRequest({
        url: "/drivers/available",
        method: "GET",
      });

      if (res?.success) {
        setDrivers(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await apiRequest({
        url: "/drivers/search",
        method: "POST",
        data: searchParams,
      });

      if (res?.success) {
        setDrivers(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async (driverId) => {
    const driver = drivers.find((d) => d._id === driverId);
    setSelectedDriver(driver);
    setShowBookingModal(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
      >
        <h1 className="text-3xl font-bold mb-6">Find Available Drivers</h1>
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <TextInput
            placeholder="Enter location"
            value={searchParams.location}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, location: e.target.value }))
            }
            icon={<FaSearch className="text-gray-400" />}
          />
          <input
            type="date"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchParams.date}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, date: e.target.value }))
            }
          />
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchParams.type}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, type: e.target.value }))
            }
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
          </select>
          <CustomButton
            title="Search"
            type="submit"
            isLoading={isLoading}
            containerStyles="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          />
        </form>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {drivers.map((driver) => (
          <motion.div
            key={driver._id}
            variants={itemVariants}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={driver.user.profileUrl || "/default-avatar.png"}
                alt="Driver"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  Available
                </span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">
                {driver.user.firstName} {driver.user.lastName}
              </h2>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <FaCar className="text-blue-500" />
                  <span>{driver.licenseType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  <span>
                    {driver.rating || 0} ({driver.reviews?.length || 0} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMoneyBillWave className="text-green-500" />
                  <span>
                    RWF {driver.pricePerHour}/hr | RWF {driver.pricePerDay}/day
                  </span>
                </div>
              </div>
              <CustomButton
                title="Book Now"
                onClick={() => handleBooking(driver._id)}
                containerStyles="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {showBookingModal && selectedDriver && (
        <BookingModal
          driver={selectedDriver}
          onClose={() => setShowBookingModal(false)}
          searchParams={searchParams}
        />
      )}
    </div>
  );
};

const BookingModal = ({ driver, onClose, searchParams }) => {
  const [bookingData, setBookingData] = useState({
    startDate: searchParams.date || format(new Date(), "yyyy-MM-dd"),
    endDate: searchParams.date || format(new Date(), "yyyy-MM-dd"),
    bookingType: searchParams.type,
    pickupLocation: searchParams.location,
    dropoffLocation: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await apiRequest({
        url: "/bookings/create",
        method: "POST",
        data: {
          ...bookingData,
          driver: driver._id,
        },
      });

      if (res?.success) {
        onClose();
        // Show success notification
      }
    } catch (error) {
      console.log(error);
      // Show error notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <h2 className="text-2xl font-bold mb-4">Book Driver</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg"
                value={bookingData.startDate}
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg"
                value={bookingData.endDate}
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Location
            </label>
            <TextInput
              value={bookingData.pickupLocation}
              onChange={(e) =>
                setBookingData((prev) => ({
                  ...prev,
                  pickupLocation: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dropoff Location
            </label>
            <TextInput
              value={bookingData.dropoffLocation}
              onChange={(e) =>
                setBookingData((prev) => ({
                  ...prev,
                  dropoffLocation: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg resize-none"
              rows="3"
              value={bookingData.notes}
              onChange={(e) =>
                setBookingData((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
          </div>
          <div className="flex justify-end space-x-4">
            <CustomButton
              title="Cancel"
              onClick={onClose}
              containerStyles="px-4 py-2 border rounded-lg hover:bg-gray-50"
            />
            <CustomButton
              title="Book Now"
              type="submit"
              isLoading={isLoading}
              containerStyles="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            />
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default FindDrivers;
