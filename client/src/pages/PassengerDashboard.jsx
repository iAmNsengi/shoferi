import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BiMapPin,
  BiUser,
  BiCalendar,
  BiTime,
  BiDollarCircle,
  BiStar,
  BiCar,
  BiSearch,
  BiFilter,
  BiPhone,
  BiNavigation,
  BiMap,
  BiHistory,
  BiClockOutline,
} from "react-icons/bi";
import {
  fetchAvailableDrivers,
  searchDrivers,
} from "../store/slices/driverSlice";
import { createBooking, fetchUserBookings } from "../store/slices/bookingSlice";
import { locationUtils } from "../services/api";
import toast from "react-hot-toast";

const PassengerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { availableDrivers, searchLoading } = useSelector(
    (state) => state.driver
  );
  const { userBookings, loading } = useSelector((state) => state.booking);

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    experience: "",
    rating: "",
    priceRange: "",
  });

  const [bookingData, setBookingData] = useState({
    pickupLocation: {
      address: "",
      coordinates: [0, 0],
    },
    dropoffLocation: {
      address: "",
      coordinates: [0, 0],
    },
    startDate: "",
    endDate: "",
    bookingType: "hourly",
    notes: "",
  });

  useEffect(() => {
    dispatch(fetchUserBookings());
    dispatch(fetchAvailableDrivers());
  }, [dispatch]);

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const location = await locationUtils.getCurrentPosition();
        setCurrentLocation(location);
      } catch (error) {
        console.log("Location access denied");
        toast.error("Location access required for better service");
      }
    };

    getCurrentLocation();
  }, []);

  const handleSearch = () => {
    const searchParams = {
      ...filters,
      location: currentLocation
        ? `${currentLocation.latitude},${currentLocation.longitude}`
        : "",
    };
    dispatch(searchDrivers(searchParams));
  };

  const handleBookDriver = (driver) => {
    setSelectedDriver(driver);
    setShowBookingForm(true);
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();

    if (!selectedDriver) return;

    const booking = {
      driver: selectedDriver._id,
      ...bookingData,
      pickupLocation: {
        ...bookingData.pickupLocation,
        type: "Point",
        coordinates: bookingData.pickupLocation.coordinates,
      },
      dropoffLocation: {
        ...bookingData.dropoffLocation,
        type: "Point",
        coordinates: bookingData.dropoffLocation.coordinates,
      },
    };

    dispatch(createBooking(booking));
    setShowBookingForm(false);
    setSelectedDriver(null);
    setBookingData({
      pickupLocation: { address: "", coordinates: [0, 0] },
      dropoffLocation: { address: "", coordinates: [0, 0] },
      startDate: "",
      endDate: "",
      bookingType: "hourly",
      notes: "",
    });
  };

  const activeBookings =
    userBookings?.filter((b) => ["pending", "accepted"].includes(b.status)) ||
    [];
  const pastBookings =
    userBookings?.filter((b) =>
      ["completed", "cancelled", "rejected"].includes(b.status)
    ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Hi {user?.firstName}! Where would you like to go?
          </h1>
          <p className="text-gray-600">
            Find and book reliable drivers for your transportation needs
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Trips</p>
                <p className="text-2xl font-bold text-gray-800">
                  {userBookings?.length || 0}
                </p>
              </div>
              <BiCar className="text-3xl text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Trips</p>
                <p className="text-2xl font-bold text-blue-600">
                  {activeBookings.length}
                </p>
              </div>
              <BiNavigation className="text-3xl text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Available Drivers</p>
                <p className="text-2xl font-bold text-purple-600">
                  {availableDrivers?.length || 0}
                </p>
              </div>
              <BiUser className="text-3xl text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Average Rating</p>
                <p className="text-2xl font-bold text-yellow-600">4.8</p>
              </div>
              <BiStar className="text-3xl text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Driver Search and Booking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Find Drivers
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    placeholder="Search drivers..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <select
                    value={filters.experience}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        experience: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Any Experience</option>
                    <option value="1">1+ Years</option>
                    <option value="3">3+ Years</option>
                    <option value="5">5+ Years</option>
                  </select>
                </div>

                <div>
                  <select
                    value={filters.rating}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        rating: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Any Rating</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <BiSearch />
                  {searchLoading ? "Searching..." : "Search"}
                </button>
              </div>

              {currentLocation && (
                <p className="text-sm text-gray-500 mb-4">
                  <BiMapPin className="inline mr-1" />
                  Showing drivers near your location (
                  {currentLocation.latitude.toFixed(4)},{" "}
                  {currentLocation.longitude.toFixed(4)})
                </p>
              )}
            </div>

            {/* Available Drivers */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Available Drivers
              </h3>

              {availableDrivers && availableDrivers.length > 0 ? (
                <div className="space-y-4">
                  {availableDrivers.map((driver) => (
                    <div
                      key={driver._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <BiUser className="text-2xl text-gray-600" />
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {driver.user?.firstName} {driver.user?.lastName}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <BiStar className="text-yellow-500" />
                                {driver.rating?.toFixed(1) || "0.0"}
                              </span>
                              <span>{driver.experience} years exp.</span>
                              <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs">
                                {driver.availability?.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-gray-800">
                            {driver.pricePerHour} RWF/hr
                          </p>
                          <p className="text-sm text-gray-600">
                            {driver.pricePerDay} RWF/day
                          </p>
                          <button
                            onClick={() => handleBookDriver(driver)}
                            className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BiCar className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No drivers available at the moment
                  </p>
                  <p className="text-sm text-gray-400">
                    Try searching with different filters or check back later.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Booking History and Active Trips */}
          <div className="lg:col-span-1 space-y-6">
            {/* Active Bookings */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Active Trips
              </h3>

              {activeBookings.length > 0 ? (
                <div className="space-y-3">
                  {activeBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {booking.status}
                        </span>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.startDate).toLocaleDateString()}
                        </p>
                      </div>

                      <p className="font-medium text-gray-800 text-sm">
                        {booking.driver?.user?.firstName}{" "}
                        {booking.driver?.user?.lastName}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        {booking.pickupLocation?.address}
                      </p>
                      <p className="font-semibold text-green-600 text-sm">
                        {booking.totalPrice} RWF
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <BiNavigation className="text-4xl text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No active trips</p>
                </div>
              )}
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Trips
              </h3>

              {pastBookings.length > 0 ? (
                <div className="space-y-3">
                  {pastBookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking._id}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "completed"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {booking.status}
                        </span>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.startDate).toLocaleDateString()}
                        </p>
                      </div>

                      <p className="font-medium text-gray-800 text-sm">
                        {booking.driver?.user?.firstName}{" "}
                        {booking.driver?.user?.lastName}
                      </p>

                      {booking.rating?.score && (
                        <div className="flex items-center gap-1 mt-1">
                          <BiStar className="text-yellow-500 text-sm" />
                          <span className="text-xs text-gray-600">
                            {booking.rating.score}/5
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <BiHistory className="text-4xl text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No trip history</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Book a Ride
              </h3>
              <button
                onClick={() => setShowBookingForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Driver Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <BiUser className="text-2xl text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {selectedDriver.user?.firstName}{" "}
                    {selectedDriver.user?.lastName}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BiStar className="text-yellow-500" />
                    {selectedDriver.rating?.toFixed(1)} •{" "}
                    {selectedDriver.experience} years exp.
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedDriver.pricePerHour} RWF/hr •{" "}
                    {selectedDriver.pricePerDay} RWF/day
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    value={bookingData.pickupLocation.address}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        pickupLocation: {
                          ...prev.pickupLocation,
                          address: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter pickup address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dropoff Location
                  </label>
                  <input
                    type="text"
                    value={bookingData.dropoffLocation.address}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        dropoffLocation: {
                          ...prev.dropoffLocation,
                          address: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter dropoff address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={bookingData.startDate}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={bookingData.endDate}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Booking Type
                  </label>
                  <select
                    value={bookingData.bookingType}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        bookingType: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="3"
                  placeholder="Any special instructions or requirements..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Creating Booking..." : "Book Now"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerDashboard;
