import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BiBriefcase, BiSearch, BiLocationPlus } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { apiRequest, updateURL } from "../utils";

const FindJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [filterJobTypes, setFilterJobTypes] = useState([]);
  const [page, setPage] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await apiRequest({
        url: "/jobs",
        method: "GET",
        params: {
          search: searchQuery,
          location: jobLocation,
          jtype: filterJobTypes.join(","),
          page,
        },
      });

      setJobs(res?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateURL(
      { query: searchQuery, location: jobLocation, page: 1 },
      navigate,
      location
    );
    fetchJobs();
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const queryParam = urlParams.get("query") || "";
    const locationParam = urlParams.get("location") || "";
    const pageParam = parseInt(urlParams.get("page")) || 1;

    setSearchQuery(queryParam);
    setJobLocation(locationParam);
    setPage(pageParam);

    fetchJobs();
  }, [location.search]);

  const jobTypes = ["Full-Time", "Part-Time", "Contract", "Remote"];

  return (
    <div className="container mx-auto px-4 py-20">
      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <BiSearch className="absolute left-3 top-3 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <BiLocationPlus className="absolute left-3 top-3 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Location..."
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <BiSearch className="text-xl" />
              <span>Search</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {jobTypes.map((type) => (
              <label
                key={type}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filterJobTypes.includes(type)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilterJobTypes([...filterJobTypes, type]);
                    } else {
                      setFilterJobTypes(
                        filterJobTypes.filter((t) => t !== type)
                      );
                    }
                  }}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </form>
      </motion.div>

      {/* Jobs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6)
            .fill(0)
            .map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </motion.div>
            ))
        ) : jobs.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500"
            >
              No jobs found. Try adjusting your search.
            </motion.div>
          </div>
        ) : (
          jobs.map((job, i) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 cursor-pointer"
              onClick={() => navigate(`/job-detail/${job._id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BiBriefcase className="text-2xl text-blue-600" />
                </div>
                {job.jobType === "Remote" && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <BsStars className="mr-1" />
                    Remote
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {job.jobTitle}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {job.location || "Location not specified"}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                  {job.jobType}
                </span>
                <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
                  ${job.salary}/year
                </span>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2">
                {job.detail?.[0]?.desc || "No description available"}
              </p>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {jobs.length > 0 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={jobs.length < 10}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FindJobs;
