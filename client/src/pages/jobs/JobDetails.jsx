import { useState, useEffect } from "react";
import {
  BiArrowBack,
  BiBookmark,
  BiDollar,
  BiShare,
  BiUser,
  BiCalendar,
  BiCheck,
  BiLoader,
} from "react-icons/bi";
import { BsStarFill, BsClock, BsGeoAlt, BsPeople } from "react-icons/bs";
import { HiOutlineOfficeBuilding, HiOutlineBadgeCheck } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useJob, useApplyJob } from "../../hooks/useQueries";
import toast from "react-hot-toast";

const JobDetails = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { id: jobId } = useParams();
  const { isAuthenticated, user } = useAuth();

  // Use React Query hooks
  const { data: jobData, isLoading, error } = useJob(jobId);
  const applyJobMutation = useApplyJob();

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to apply for jobs");
      navigate("/login");
      return;
    }

    try {
      await applyJobMutation.mutateAsync({ id: jobId, data: {} });
    } catch (error) {
      console.error("Application failed:", error);
    }
  };

  const toggleSave = () => {
    if (!isAuthenticated) {
      toast.error("Please login to save jobs");
      navigate("/login");
      return;
    }
    setIsSaved(!isSaved);
    toast.success(
      isSaved ? "Job removed from saved" : "Job saved successfully"
    );
  };

  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: `${jobData?.jobTitle} at ${jobData?.company?.name}`,
        text: `Check out this job opportunity: ${jobData?.jobTitle}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Job link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-14 flex items-center justify-center">
        <div className="text-center">
          <BiLoader className="animate-spin text-4xl text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-14 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Job Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The job you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/jobs")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const formatSalary = (salary, salaryType) => {
    if (!salary) return "Salary not specified";
    const formattedAmount = salary.toLocaleString();
    const typeMap = {
      hourly: "per hour",
      daily: "per day",
      weekly: "per week",
      monthly: "per month",
      per_trip: "per trip",
      commission: "commission-based",
    };
    return `${formattedAmount} RWF ${typeMap[salaryType] || ""}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isJobExpired =
    jobData.expiresAt && new Date(jobData.expiresAt) < new Date();
  const hasApplied =
    jobData.hasApplied ||
    jobData.applications?.some((app) => app.user === user?._id);

  return (
    <div className="min-h-screen bg-gray-50 pt-14">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/jobs")}
              className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <BiArrowBack className="text-xl" />
              <span className="font-medium">Back to Jobs</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={shareJob}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <BiShare className="text-xl" />
              </button>
              <button
                onClick={toggleSave}
                className={`p-2 rounded-lg transition-colors ${
                  isSaved
                    ? "bg-green-100 text-green-600"
                    : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                <BiBookmark className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                  {jobData.company?.profileUrl ? (
                    <img
                      src={jobData.company.profileUrl}
                      alt={jobData.company.name}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    jobData.company?.name?.charAt(0) || "C"
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {jobData.jobTitle}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-xl text-green-600 font-semibold">
                      {jobData.company?.name || "Company"}
                    </h2>
                    {jobData.company?.rating && (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <BsStarFill
                            key={i}
                            className={
                              i < Math.floor(jobData.company.rating)
                                ? "text-yellow-400"
                                : "text-gray-200"
                            }
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">
                          {jobData.company.rating} (
                          {jobData.company.reviews || 0} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <BsGeoAlt className="text-gray-400" />
                      <span className="text-gray-600 text-sm">
                        {jobData.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BiDollar className="text-gray-400" />
                      <span className="text-gray-600 text-sm">
                        {formatSalary(jobData.salary, jobData.salaryType)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BsClock className="text-gray-400" />
                      <span className="text-gray-600 text-sm capitalize">
                        {jobData.jobType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BsPeople className="text-gray-400" />
                      <span className="text-gray-600 text-sm">
                        {jobData.applicationCount ||
                          jobData.applications?.length ||
                          0}{" "}
                        applicants
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Apply Now Button for Mobile */}
              <div className="lg:hidden mb-6">
                {isJobExpired ? (
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-red-800 font-medium">Job Expired</p>
                  </div>
                ) : hasApplied ? (
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <BiCheck className="text-2xl text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-medium">Applied</p>
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applyJobMutation.isPending}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
                  >
                    {applyJobMutation.isPending ? "Applying..." : "Apply Now"}
                  </button>
                )}
              </div>

              {/* Job Description */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Job Description</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {jobData.details?.[0]?.desc ||
                    "Join our team and be part of Rwanda's growing transportation industry. We offer competitive compensation and excellent growth opportunities for professional drivers."}
                </div>

                {jobData.details?.[0]?.requirements && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-2">Requirements</h4>
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {jobData.details[0].requirements}
                    </div>
                  </div>
                )}

                {/* Vehicle Requirements */}
                {jobData.vehicleRequirements?.vehicleType?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-2">
                      Vehicle Requirements
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {jobData.vehicleRequirements.vehicleType.map(
                        (type, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm capitalize"
                          >
                            {type}
                          </span>
                        )
                      )}
                    </div>
                    {jobData.vehicleRequirements.minYear && (
                      <p className="text-sm text-gray-600 mt-2">
                        Minimum vehicle year:{" "}
                        {jobData.vehicleRequirements.minYear}
                      </p>
                    )}
                  </div>
                )}

                {/* Schedule Information */}
                {jobData.schedule && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-2">
                      Work Schedule
                    </h4>
                    <p className="text-gray-700 capitalize">
                      {jobData.schedule}
                    </p>
                    {jobData.workingHours && (
                      <div className="text-sm text-gray-600 mt-1">
                        {jobData.workingHours.startTime &&
                          jobData.workingHours.endTime && (
                            <p>
                              Hours: {jobData.workingHours.startTime} -{" "}
                              {jobData.workingHours.endTime}
                            </p>
                          )}
                        {jobData.workingHours.daysOfWeek?.length > 0 && (
                          <p>
                            Days: {jobData.workingHours.daysOfWeek.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Apply Card */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-lg p-6 mb-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {formatSalary(jobData.salary, jobData.salaryType)}
                </div>
                <div className="text-gray-600 text-sm capitalize">
                  {jobData.jobType} • {jobData.category?.replace("_", " ")}
                </div>
                {jobData.commission?.percentage && (
                  <div className="text-sm text-green-600 mt-1">
                    + {jobData.commission.percentage}% Commission
                  </div>
                )}
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {jobData.featured && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    ⭐ Featured
                  </span>
                )}
                {jobData.urgent && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    🔥 Urgent
                  </span>
                )}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    jobData.priority === "high"
                      ? "bg-orange-100 text-orange-800"
                      : jobData.priority === "urgent"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {jobData.priority} Priority
                </span>
              </div>

              {isJobExpired ? (
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-red-800 font-medium">Job Expired</p>
                  <p className="text-red-600 text-sm">
                    Expired on {formatDate(jobData.expiresAt)}
                  </p>
                </div>
              ) : hasApplied ? (
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <BiCheck className="text-2xl text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 font-medium">
                    Application Submitted
                  </p>
                  <p className="text-green-600 text-sm">
                    You have already applied for this position
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applyJobMutation.isPending}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {applyJobMutation.isPending ? (
                    <>
                      <BiLoader className="animate-spin" />
                      Applying...
                    </>
                  ) : (
                    "Apply Now"
                  )}
                </button>
              )}

              <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    {jobData.applicationCount ||
                      jobData.applications?.length ||
                      0}
                  </div>
                  <div className="text-gray-600">Applicants</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    {jobData.analytics?.views || 0}
                  </div>
                  <div className="text-gray-600">Views</div>
                </div>
              </div>
            </div>

            {/* Job Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Job Information</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-medium">
                    {formatDate(jobData.createdAt)}
                  </span>
                </div>
                {jobData.expiresAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expires</span>
                    <span className="font-medium">
                      {formatDate(jobData.expiresAt)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium">
                    {jobData.experience > 0
                      ? `${jobData.experience} years`
                      : "Entry level"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vacancies</span>
                  <span className="font-medium">{jobData.vacancies || 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium capitalize">
                    {jobData.category?.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`font-medium capitalize ${
                      jobData.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {jobData.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
