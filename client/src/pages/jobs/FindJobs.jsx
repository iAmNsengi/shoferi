import { useState, useEffect } from "react";
import {
  BiSearch,
  BiBookmark,
  BiDollar,
  BiTime,
  BiLocationPlus,
  BiLoader,
  BiPlus,
} from "react-icons/bi";
import { BsStarFill, BsClock, BsGeoAlt } from "react-icons/bs";
import { HiOutlineAdjustments } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useJobs } from "../../hooks/useQueries";
import DownloadApp from "../../components/sections/DownloadApp";
import toast from "react-hot-toast";

const FindJobs = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [localLocation, setLocalLocation] = useState("");
  const [localJobType, setLocalJobType] = useState("all");
  const [localCategory, setLocalCategory] = useState("");
  const [localSalaryMin, setLocalSalaryMin] = useState("");
  const [localExperience, setLocalExperience] = useState("");
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Use React Query to fetch jobs
  const {
    data: jobsData,
    isLoading,
    error,
  } = useJobs({
    search: searchQuery,
    ...filters,
  });

  const jobs = jobsData?.data?.jobs || [];
  const pagination = jobsData?.data?.pagination || {};
  const categories = jobsData?.data?.categories || [];

  const handleSearch = () => {
    setSearchQuery(localSearchTerm);
    setFilters({
      location: localLocation,
      jtype: localJobType === "all" ? "" : localJobType,
      category: localCategory,
      salaryMin: localSalaryMin,
      experience: localExperience,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleSaveJob = (jobId) => {
    if (!isAuthenticated) {
      toast.error("Please login to save jobs");
      navigate("/login");
      return;
    }

    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );

    const action = savedJobs.includes(jobId) ? "removed from" : "added to";
    toast.success(`Job ${action} saved jobs`);
  };

  const formatSalary = (salary, salaryType) => {
    if (!salary) return "Salary not specified";
    const formattedAmount = salary.toLocaleString();
    const typeMap = {
      hourly: "/hr",
      daily: "/day",
      weekly: "/week",
      monthly: "/month",
      per_trip: "/trip",
      commission: "commission",
    };
    return `${formattedAmount} RWF${typeMap[salaryType] || ""}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const loadMoreJobs = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setFilters((prev) => ({
        ...prev,
        page: pagination.currentPage + 1,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 -mt-[100px]">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-br from-green-50 via-green-100 to-green-200 py-16 pt-60">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  Find Your Perfect Driving Job
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Discover opportunities from verified companies across Rwanda
                </p>
              </div>

              {/* Create Job Button - Only for companies */}
              {isAuthenticated && user?.accountType === "company" && (
                <div className="hidden md:block">
                  <Link
                    to="/jobs/create"
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2 shadow-lg"
                  >
                    <BiPlus className="text-lg" />
                    Post a Job
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <BiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Job title, company, or keywords"
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <BiLocationPlus className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Location"
                  value={localLocation}
                  onChange={(e) => setLocalLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <BiLoader className="animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <BiSearch />
                    Search Jobs
                  </>
                )}
              </button>
            </div>

            {/* Mobile Create Job Button */}
            {isAuthenticated && user?.accountType === "company" && (
              <div className="md:hidden mt-4">
                <Link
                  to="/jobs/create"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
                >
                  <BiPlus className="text-lg" />
                  Post a Job
                </Link>
              </div>
            )}

            {/* Advanced Filters */}
            <div className="mt-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
              >
                <HiOutlineAdjustments />
                Advanced Filters
              </button>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Type
                    </label>
                    <select
                      value={localJobType}
                      onChange={(e) => setLocalJobType(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="all">All Types</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="temporary">Temporary</option>
                      <option value="one-time">One-time</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={localCategory}
                      onChange={(e) => setLocalCategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.title || category._id.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Salary (RWF)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 100000"
                      value={localSalaryMin}
                      onChange={(e) => setLocalSalaryMin(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience (Years)
                    </label>
                    <select
                      value={localExperience}
                      onChange={(e) => setLocalExperience(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Any Experience</option>
                      <option value="0-1">Entry Level (0-1 years)</option>
                      <option value="2-5">Experienced (2-5 years)</option>
                      <option value="5-10">Senior (5-10 years)</option>
                      <option value="10+">Expert (10+ years)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Job Categories
              </h3>
              <div className="space-y-2">
                {categories.slice(0, 8).map((category) => (
                  <button
                    key={category._id}
                    onClick={() => {
                      setLocalCategory(category._id);
                      setFilters((prev) => ({
                        ...prev,
                        category: category._id,
                      }));
                    }}
                    className={`block w-full text-left p-3 rounded-lg transition-colors ${
                      localCategory === category._id
                        ? "bg-green-100 text-green-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="capitalize">
                        {category.title || category._id.replace("_", " ")}
                      </span>
                      <span className="text-sm text-gray-500">
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {searchQuery
                    ? `Search Results for "${searchQuery}"`
                    : "All Jobs"}
                </h2>
                <p className="text-gray-600">
                  {pagination.total || 0} jobs found
                </p>
              </div>

              <div className="flex items-center gap-4">
                <select
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, sort: e.target.value }));
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="salary_high">Highest Salary</option>
                  <option value="salary_low">Lowest Salary</option>
                  <option value="a-z">A-Z</option>
                  <option value="z-a">Z-A</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && jobs.length === 0 && (
              <div className="text-center py-12">
                <BiLoader className="animate-spin text-4xl text-green-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading jobs...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="text-6xl text-red-300 mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Error loading jobs
                </h3>
                <p className="text-gray-600 mb-4">
                  {error.response?.data?.message || "Something went wrong"}
                </p>
              </div>
            )}

            {/* No Results */}
            {!isLoading && !error && jobs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl text-gray-300 mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={() => {
                    setLocalSearchTerm("");
                    setLocalLocation("");
                    setLocalJobType("all");
                    setLocalCategory("");
                    setLocalSalaryMin("");
                    setLocalExperience("");
                    setSearchQuery("");
                    setFilters({});
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Job Listings */}
            <div className="space-y-6">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                        {job.company?.profileUrl ? (
                          <img
                            src={job.company.profileUrl}
                            alt={job.company.name}
                            className="w-full h-full rounded-2xl object-cover"
                          />
                        ) : (
                          job.company?.name?.charAt(0) || job.jobTitle.charAt(0)
                        )}
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {job.jobTitle}
                          </h3>
                          <div className="flex items-center gap-4 mb-2">
                            <span className="text-green-600 font-semibold">
                              {job.company?.name || "Company"}
                            </span>
                            {job.company?.rating && (
                              <div className="flex items-center gap-1">
                                <BsStarFill className="text-yellow-400 text-sm" />
                                <span className="text-sm text-gray-600">
                                  {job.company.rating}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <BsGeoAlt className="text-gray-400" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <BiDollar className="text-gray-400" />
                              {formatSalary(job.salary, job.salaryType)}
                            </div>
                            <div className="flex items-center gap-1">
                              <BsClock className="text-gray-400" />
                              <span className="capitalize">{job.jobType}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BiTime className="text-gray-400" />
                              {formatDate(job.createdAt)}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleSaveJob(job._id)}
                          className={`mt-2 md:mt-0 p-2 rounded-lg transition-colors ${
                            savedJobs.includes(job._id)
                              ? "bg-green-100 text-green-600"
                              : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                          }`}
                        >
                          <BiBookmark className="text-xl" />
                        </button>
                      </div>

                      {/* Job Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm capitalize">
                          {job.category?.replace("_", " ")}
                        </span>
                        {job.featured && (
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                            ⭐ Featured
                          </span>
                        )}
                        {job.urgent && (
                          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                            🔥 Urgent
                          </span>
                        )}
                        <span
                          className={`px-3 py-1 rounded-full text-sm capitalize ${
                            job.priority === "high"
                              ? "bg-orange-100 text-orange-800"
                              : job.priority === "urgent"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {job.priority} Priority
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {job.details?.[0]?.desc ||
                          "Join our team and be part of Rwanda's growing transportation industry."}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
                        >
                          View Details
                        </Link>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>
                            {job.applicationCount ||
                              job.applications?.length ||
                              0}{" "}
                            applicants
                          </span>
                          <span>{job.analytics?.views || 0} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {pagination.currentPage < pagination.totalPages && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMoreJobs}
                  disabled={isLoading}
                  className="px-8 py-3 bg-white border border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-all disabled:opacity-50"
                >
                  {isLoading ? "Loading..." : "Load More Jobs"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <DownloadApp />
    </div>
  );
};

export default FindJobs;
