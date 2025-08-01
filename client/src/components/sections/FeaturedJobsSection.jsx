import { useState, useEffect } from "react";
import { BiDollar, BiTime, BiLoader } from "react-icons/bi";
import { BsGeoAlt, BsClock, BsStarFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useJobs } from "../../hooks/useQueries";
import { ArrowBigRightIcon } from "lucide-react";

const FeaturedJobsSection = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);

  // Use React Query to fetch jobs
  const { data: jobsData, isLoading } = useJobs({
    limit: 6,
    sort: "newest",
  });

  useEffect(() => {
    // Filter and set featured jobs from the fetched jobs
    if (jobsData?.data?.jobs) {
      setFeaturedJobs(jobsData.data.jobs.slice(0, 6));
    }
  }, [jobsData]);

  const formatSalary = (salary, salaryType) => {
    if (!salary) return "Competitive salary";
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

  if (isLoading && featuredJobs.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <BiLoader className="animate-spin text-4xl text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading featured jobs...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Featured
            <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              {" "}
              Job Opportunities
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the latest driving opportunities from top-rated companies
            across Rwanda. Start your career journey today.
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 group"
            >
              {/* Company Logo and Info */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {job.company?.profileUrl ? (
                    <img
                      src={job.company.profileUrl}
                      alt={job.company.name}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    job.company?.name?.charAt(0) || job.jobTitle.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {job.jobTitle}
                  </h3>
                  <p className="text-gray-600 text-sm truncate">
                    {job.company?.name || "Company"}
                  </p>
                  {job.company?.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <BsStarFill className="text-yellow-400 text-xs" />
                      <span className="text-xs text-gray-600">
                        {job.company.rating}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BsGeoAlt className="text-gray-400 flex-shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BiDollar className="text-gray-400 flex-shrink-0" />
                  <span className="truncate font-medium text-green-600">
                    {formatSalary(job.salary, job.salaryType)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BsClock className="text-gray-400 flex-shrink-0" />
                  <span className="capitalize">{job.jobType}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BiTime className="text-gray-400 flex-shrink-0" />
                  <span>{formatDate(job.createdAt)}</span>
                </div>
              </div>

              {/* Job Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
                  {job.category?.replace("_", " ")}
                </span>
                {job.featured && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    ⭐ Featured
                  </span>
                )}
                {job.urgent && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    🔥 Urgent
                  </span>
                )}
              </div>

              {/* Description Preview */}
              <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                {job.details?.[0]?.desc ||
                  "Join our team and be part of Rwanda's growing transportation industry."}
              </p>

              {/* Action Button */}
              <Link
                to={`/jobs/${job._id}`}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 group"
              >
                View Details
                <ArrowBigRightIcon className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* View All Jobs Button */}
        <div className="text-center">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-3 bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all border-2 border-green-600 hover:bg-green-50"
          >
            View All Job Opportunities
            <ArrowBigRightIcon className="text-xl" />
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {featuredJobs.length}+
            </div>
            <div className="text-gray-600">Active Jobs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
            <div className="text-gray-600">Partner Companies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
            <div className="text-gray-600">Drivers Hired</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobsSection;
