import React, { useState } from "react";
import {
  BiCar,
  BiWallet,
  BiCalendar,
  BiMap,
  BiTime,
  BiStar,
  BiCheckCircle,
  BiUser,
  BiCog,
  BiLogOut,
  BiSearch,
  BiFilter,
  BiRefresh,
  BiCheck,
  BiX,
  BiNavigation,
  BiPhone,
  BiEnvelope,
} from "react-icons/bi";
import { useAuth } from "../contexts/AuthContext";
import {
  useDriverProfile,
  useDriverStats,
  useUserApplications,
  useJobs,
  useApplyJob,
  useTrackJobView,
  useTrackProfileView,
} from "../hooks/useQueries";

const DriverDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // React Query hooks
  const { data: driverProfile, isLoading: profileLoading } = useDriverProfile();
  const { data: driverStats, isLoading: statsLoading } = useDriverStats();
  const { data: userApplications, isLoading: applicationsLoading } =
    useUserApplications({ status: statusFilter });
  const { data: availableJobs, isLoading: jobsLoading } = useJobs({
    status: "active",
    limit: 20,
  });

  // Mutations
  const applyJobMutation = useApplyJob();
  const trackJobViewMutation = useTrackJobView();
  const trackProfileViewMutation = useTrackProfileView();

  // Calculate stats from driver stats
  const driverStatsData = driverStats?.stats || {
    totalApplications: 0,
    pendingApplications: 0,
    reviewedApplications: 0,
    shortlistedApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    interviewsScheduled: 0,
    profileViews: 0,
  };

  const stats = [
    {
      title: "Applications",
      value: driverStatsData.totalApplications,
      icon: BiCalendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Interviews",
      value: driverStatsData.interviewsScheduled,
      icon: BiCheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Hired",
      value: driverStatsData.acceptedApplications,
      icon: BiStar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Profile Views",
      value: driverStatsData.profileViews,
      icon: BiUser,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: BiCar },
    { id: "applications", label: "My Applications", icon: BiCalendar },
    { id: "jobs", label: "Available Jobs", icon: BiSearch },
    { id: "profile", label: "Profile", icon: BiUser },
  ];

  const handleLogout = () => {
    logout();
  };

  const handleApplyJob = (jobId) => {
    applyJobMutation.mutate({
      jobId,
      applicationData: {
        coverLetter:
          "I am interested in this position and believe my skills would be a great fit for your company.",
      },
    });
  };

  const handleJobView = (jobId) => {
    trackJobViewMutation.mutate(jobId);
  };

  const handleProfileView = () => {
    if (driverProfile?._id) {
      trackProfileViewMutation.mutate({
        driverId: driverProfile._id,
        source: "driver_dashboard",
      });
    }
  };

  // Track profile view when component mounts
  React.useEffect(() => {
    if (driverProfile?._id) {
      handleProfileView();
    }
  }, [driverProfile?._id]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <BiCar className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Driver Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome back, {user?.firstName || "Driver"}!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <BiCog className="text-xl" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <BiLogOut className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`text-2xl ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="text-lg" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Application Summary */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Application Summary
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Pending Applications
                          </span>
                        </div>
                        <span className="text-sm font-medium text-blue-600">
                          {driverStatsData.pendingApplications}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Under Review
                          </span>
                        </div>
                        <span className="text-sm font-medium text-yellow-600">
                          {driverStatsData.reviewedApplications}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Interview Scheduled
                          </span>
                        </div>
                        <span className="text-sm font-medium text-green-600">
                          {driverStatsData.interviewsScheduled}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-purple-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Hired
                          </span>
                        </div>
                        <span className="text-sm font-medium text-purple-600">
                          {driverStatsData.acceptedApplications}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Applications */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Recent Applications
                    </h3>
                    <div className="space-y-3">
                      {applicationsLoading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
                          <p className="text-gray-500 mt-2 text-sm">
                            Loading applications...
                          </p>
                        </div>
                      ) : (
                        userApplications?.applications
                          ?.slice(0, 3)
                          .map((application, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  application.status === "accepted"
                                    ? "bg-green-500"
                                    : application.status === "shortlisted"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                                }`}
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">
                                  {application.job?.title || "Job Title"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {application.job?.company?.name || "Company"}{" "}
                                  •{" "}
                                  {new Date(
                                    application.appliedAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  application.status === "accepted"
                                    ? "bg-green-100 text-green-800"
                                    : application.status === "shortlisted"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {application.status === "accepted"
                                  ? "Hired"
                                  : application.status === "shortlisted"
                                  ? "Shortlisted"
                                  : application.status === "reviewed"
                                  ? "Under Review"
                                  : "Pending"}
                              </span>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === "applications" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    My Job Applications
                  </h3>
                  <div className="flex gap-2">
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="reviewed">Under Review</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="accepted">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {applicationsLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                      <p className="text-gray-500 mt-2">
                        Loading applications...
                      </p>
                    </div>
                  ) : (
                    userApplications?.applications?.map((application) => (
                      <div
                        key={application._id}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {application.job?.title || "Job Title"}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {application.job?.company?.name || "Company"} •{" "}
                              {application.job?.location || "Location"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {application.job?.description ||
                                "Job description not available"}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              application.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : application.status === "shortlisted"
                                ? "bg-blue-100 text-blue-800"
                                : application.status === "reviewed"
                                ? "bg-yellow-100 text-yellow-800"
                                : application.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {application.status === "accepted"
                              ? "Hired"
                              : application.status === "shortlisted"
                              ? "Shortlisted"
                              : application.status === "reviewed"
                              ? "Under Review"
                              : application.status === "rejected"
                              ? "Rejected"
                              : "Pending"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-gray-500">Salary</p>
                            <p className="font-semibold text-gray-800">
                              {application.job?.salary || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Applied</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(
                                application.appliedAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Location</p>
                            <p className="font-semibold text-gray-800">
                              {application.job?.location || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Company</p>
                            <p className="font-semibold text-gray-800">
                              {application.job?.company?.name ||
                                "Not specified"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            View Details
                          </button>
                          {application.status === "shortlisted" &&
                            application.interview?.scheduled && (
                              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Schedule Interview
                              </button>
                            )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === "jobs" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <BiFilter className="text-xl" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <BiRefresh className="text-xl" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobsLoading ? (
                    <div className="col-span-full text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading jobs...</p>
                    </div>
                  ) : (
                    availableJobs?.jobs?.map((job) => (
                      <div
                        key={job._id}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {job.title}
                          </h3>
                          <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            {job.salary}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                          {job.company?.name} • {job.location}
                        </p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <BiMap className="text-gray-400" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <BiTime className="text-gray-400" />
                            {job.jobType} • Posted{" "}
                            {new Date(job.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                          onClick={() => {
                            handleJobView(job._id);
                            handleApplyJob(job._id);
                          }}
                          disabled={applyJobMutation.isPending}
                        >
                          {applyJobMutation.isPending
                            ? "Applying..."
                            : "Apply Now"}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                      <BiUser className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {driverProfile?.user?.firstName}{" "}
                        {driverProfile?.user?.lastName}
                      </h3>
                      <p className="text-gray-500">
                        {driverProfile?.user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          License Number
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span>
                            {driverProfile?.licenseNumber || "Not provided"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          License Type
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span>
                            {driverProfile?.licenseType || "Not specified"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Experience
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span>
                            {driverProfile?.experience || "Not specified"} years
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price Per Hour
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span>${driverProfile?.pricePerHour || "0"}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price Per Day
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span>${driverProfile?.pricePerDay || "0"}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Verification Status
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              driverProfile?.verified
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {driverProfile?.verified ? "Verified" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
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
