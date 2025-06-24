import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BiUser,
  BiCar,
  BiDollarCircle,
  BiStar,
  BiMapPin,
  BiTime,
  BiCalendar,
  BiPhone,
  BiNavigation,
  BiMap,
  BiHistory,
  BiTrendingUp,
  BiCheck,
  BiX,
  BiSearch,
  BiFilter,
  BiBell,
  BiWallet,
  BiMessageSquareX,
} from "react-icons/bi";
import {
  fetchDriverProfile,
  toggleAvailability,
  updateDriverProfile,
} from "../store/slices/driverSlice";
import {
  fetchDriverBookings,
  updateBookingStatus,
} from "../store/slices/bookingSlice";
import { fetchNearbyJobs } from "../store/slices/jobSlice";
import toast from "react-hot-toast";

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile: driverProfile, loading } = useSelector(
    (state) => state.driver
  );
  const { driverBookings } = useSelector((state) => state.booking);
  const { nearbyJobs } = useSelector((state) => state.jobs);

  const [activeTab, setActiveTab] = useState("overview");
  const [showLocationUpdate, setShowLocationUpdate] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [weeklyEarnings, setWeeklyEarnings] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);

  useEffect(() => {
    dispatch(fetchDriverProfile());
    dispatch(fetchDriverBookings());
    dispatch(fetchNearbyJobs());
    getCurrentLocation();
  }, [dispatch]);

  useEffect(() => {
    if (driverBookings) {
      calculateEarnings();
    }
  }, [driverBookings]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCurrentLocation(location);
        },
        (error) => {
          console.log("Location access denied:", error);
        }
      );
    }
  };

  const calculateEarnings = () => {
    if (!driverBookings) return;

    const today = new Date();
    const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const completedBookings = driverBookings.filter(
      (booking) => booking.status === "completed"
    );

    const todayTotal = completedBookings
      .filter(
        (booking) =>
          new Date(booking.createdAt).toDateString() === today.toDateString()
      )
      .reduce((sum, booking) => sum + booking.totalPrice, 0);

    const weekTotal = completedBookings
      .filter((booking) => new Date(booking.createdAt) >= weekStart)
      .reduce((sum, booking) => sum + booking.totalPrice, 0);

    const monthTotal = completedBookings
      .filter((booking) => new Date(booking.createdAt) >= monthStart)
      .reduce((sum, booking) => sum + booking.totalPrice, 0);

    setTodayEarnings(todayTotal);
    setWeeklyEarnings(weekTotal);
    setMonthlyEarnings(monthTotal);
  };

  const handleToggleAvailability = () => {
    dispatch(toggleAvailability());
  };

  const handleAcceptBooking = (bookingId) => {
    dispatch(updateBookingStatus({ bookingId, status: "accepted" }));
  };

  const handleRejectBooking = (bookingId) => {
    dispatch(updateBookingStatus({ bookingId, status: "rejected" }));
  };

  const handleCompleteBooking = (bookingId) => {
    dispatch(updateBookingStatus({ bookingId, status: "completed" }));
  };

  const activeBookings =
    driverBookings?.filter((b) => ["pending", "accepted"].includes(b.status)) ||
    [];
  const pendingBookings =
    driverBookings?.filter((b) => b.status === "pending") || [];
  const completedBookings =
    driverBookings?.filter((b) => b.status === "completed") || [];

  const avgRating =
    driverProfile?.reviews?.length > 0
      ? (
          driverProfile.reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / driverProfile.reviews.length
        ).toFixed(1)
      : "0.0";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Driver Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {user?.firstName}! Manage your driving business
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <div
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  driverProfile?.availability?.status === "available"
                    ? "bg-green-100 text-green-800"
                    : driverProfile?.availability?.status === "busy"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {driverProfile?.availability?.status || "offline"}
              </div>
              <button
                onClick={handleToggleAvailability}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  driverProfile?.availability?.status === "available"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {driverProfile?.availability?.status === "available"
                  ? "Go Offline"
                  : "Go Online"}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Today's Earnings</p>
                <p className="text-2xl font-bold text-green-600">
                  {todayEarnings.toLocaleString()} RWF
                </p>
              </div>
              <BiDollarCircle className="text-3xl text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Weekly Earnings</p>
                <p className="text-2xl font-bold text-blue-600">
                  {weeklyEarnings.toLocaleString()} RWF
                </p>
              </div>
              <BiTrendingUp className="text-3xl text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Trips</p>
                <p className="text-2xl font-bold text-purple-600">
                  {activeBookings.length}
                </p>
              </div>
              <BiNavigation className="text-3xl text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {avgRating}
                </p>
              </div>
              <BiStar className="text-3xl text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview", icon: BiUser },
                { id: "bookings", label: "Bookings", icon: BiCalendar },
                { id: "earnings", label: "Earnings", icon: BiWallet },
                { id: "jobs", label: "Job Opportunities", icon: BiSearch },
                { id: "profile", label: "Profile", icon: BiMessageSquareX },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === id
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="text-lg" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Pending Bookings Alert */}
                {pendingBookings.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <BiBell className="text-2xl text-yellow-600" />
                      <div>
                        <h3 className="font-semibold text-yellow-800">
                          New Booking Requests
                        </h3>
                        <p className="text-yellow-700">
                          You have {pendingBookings.length} pending booking
                          request(s) waiting for your response.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Recent Activity
                    </h3>
                    <div className="space-y-4">
                      {driverBookings?.slice(0, 5).map((booking) => (
                        <div
                          key={booking._id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              Trip to {booking.dropoffLocation?.address}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">
                              {booking.totalPrice} RWF
                            </p>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                booking.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Performance This Month
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Trips</span>
                        <span className="font-semibold">
                          {completedBookings.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Earnings</span>
                        <span className="font-semibold text-green-600">
                          {monthlyEarnings.toLocaleString()} RWF
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Average Rating</span>
                        <span className="font-semibold text-yellow-600">
                          {avgRating} ★
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Completion Rate</span>
                        <span className="font-semibold text-blue-600">
                          {driverBookings?.length > 0
                            ? (
                                (completedBookings.length /
                                  driverBookings.length) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Manage Bookings
                  </h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Active ({activeBookings.length})
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                      History ({completedBookings.length})
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {activeBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="bg-white border border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {booking.user?.firstName} {booking.user?.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {booking.bookingType} booking • {booking.totalPrice}{" "}
                            RWF
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="flex items-start gap-2 mb-2">
                            <BiMapPin className="text-green-600 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                Pickup
                              </p>
                              <p className="text-sm text-gray-600">
                                {booking.pickupLocation?.address}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <BiNavigation className="text-red-600 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                Dropoff
                              </p>
                              <p className="text-sm text-gray-600">
                                {booking.dropoffLocation?.address}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <BiCalendar className="text-blue-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                Date & Time
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(booking.startDate).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Notes:</strong> {booking.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-end gap-3">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleRejectBooking(booking._id)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <BiX />
                              Reject
                            </button>
                            <button
                              onClick={() => handleAcceptBooking(booking._id)}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <BiCheck />
                              Accept
                            </button>
                          </>
                        )}
                        {booking.status === "accepted" && (
                          <button
                            onClick={() => handleCompleteBooking(booking._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <BiCheck />
                            Complete Trip
                          </button>
                        )}
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                          <BiPhone />
                          Contact
                        </button>
                      </div>
                    </div>
                  ))}

                  {activeBookings.length === 0 && (
                    <div className="text-center py-12">
                      <BiCar className="text-6xl text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-500 mb-2">
                        No Active Bookings
                      </h3>
                      <p className="text-gray-400">
                        New booking requests will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === "earnings" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Earnings Overview
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Today</p>
                        <p className="text-2xl font-bold">
                          {todayEarnings.toLocaleString()} RWF
                        </p>
                      </div>
                      <BiDollarCircle className="text-3xl text-green-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">This Week</p>
                        <p className="text-2xl font-bold">
                          {weeklyEarnings.toLocaleString()} RWF
                        </p>
                      </div>
                      <BiTrendingUp className="text-3xl text-blue-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">This Month</p>
                        <p className="text-2xl font-bold">
                          {monthlyEarnings.toLocaleString()} RWF
                        </p>
                      </div>
                      <BiWallet className="text-3xl text-purple-200" />
                    </div>
                  </div>
                </div>

                {/* Recent Earnings */}
                <div className="bg-white rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Recent Earnings
                  </h4>
                  <div className="space-y-4">
                    {completedBookings.slice(0, 10).map((booking) => (
                      <div
                        key={booking._id}
                        className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            Trip to {booking.dropoffLocation?.address}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.createdAt).toLocaleDateString()} •{" "}
                            {booking.bookingType}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            +{booking.totalPrice} RWF
                          </p>
                          <p className="text-sm text-gray-500">Completed</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Job Opportunities Tab */}
            {activeTab === "jobs" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Available Job Opportunities
                  </h3>
                  <button
                    onClick={() => dispatch(fetchNearbyJobs())}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Refresh Jobs
                  </button>
                </div>

                <div className="space-y-4">
                  {nearbyJobs?.map((job) => (
                    <div
                      key={job._id}
                      className="bg-white border border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {job.jobTitle}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {job.company?.name} • {job.location}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {job.salary?.toLocaleString()} RWF
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1">
                          <BiTime />
                          {job.jobType}
                        </span>
                        <span className="flex items-center gap-1">
                          <BiUser />
                          {job.experience} years exp.
                        </span>
                        <span className="flex items-center gap-1">
                          <BiMapPin />
                          {job.location}
                        </span>
                      </div>

                      <div className="flex justify-end">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}

                  {(!nearbyJobs || nearbyJobs.length === 0) && (
                    <div className="text-center py-12">
                      <BiSearch className="text-6xl text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-500 mb-2">
                        No Jobs Available
                      </h3>
                      <p className="text-gray-400">
                        Check back later for new opportunities
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Driver Profile Settings
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Basic Info */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      Basic Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          License Number
                        </label>
                        <input
                          type="text"
                          value={driverProfile?.licenseNumber || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          License Type
                        </label>
                        <input
                          type="text"
                          value={driverProfile?.licenseType || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Experience (Years)
                        </label>
                        <input
                          type="number"
                          value={driverProfile?.experience || 0}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      Pricing Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price per Hour (RWF)
                        </label>
                        <input
                          type="number"
                          value={driverProfile?.pricePerHour || 0}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price per Day (RWF)
                        </label>
                        <input
                          type="number"
                          value={driverProfile?.pricePerDay || 0}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vehicle Types
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {["Sedan", "SUV", "Truck", "Motorcycle", "Bus"].map(
                            (type) => (
                              <span
                                key={type}
                                className={`px-3 py-1 rounded-full text-sm ${
                                  driverProfile?.vehicleTypes?.includes(type)
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-200 text-gray-600"
                                }`}
                              >
                                {type}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Update Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
