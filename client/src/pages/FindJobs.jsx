import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BiBriefcase, BiSearch, BiLocationPlus } from "react-icons/bi";
import { BsStars, BsArrowRight } from "react-icons/bs";
import { apiRequest, updateURL } from "../utils";
import { useCache } from "../hooks/useCache";

const FindJobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [filterJobTypes, setFilterJobTypes] = useState([]);
  const [page, setPage] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchJobsFn = useCallback(async () => {
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
    return res?.data || [];
  }, [searchQuery, jobLocation, filterJobTypes, page]);

  const cacheKey = `jobs-${searchQuery}-${jobLocation}-${filterJobTypes.join()}-${page}`;
  const { data: jobs, loading } = useCache(cacheKey, fetchJobsFn);

  const handleSearch = (e) => {
    e.preventDefault();
    updateURL(
      { query: searchQuery, location: jobLocation, page: 1 },
      navigate,
      location
    );
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const queryParam = urlParams.get("query") || "";
    const locationParam = urlParams.get("location") || "";
    const pageParam = parseInt(urlParams.get("page")) || 1;

    setSearchQuery(queryParam);
    setJobLocation(locationParam);
    setPage(pageParam);
  }, [location.search]);

  const jobTypes = ["Full-Time", "Part-Time", "Contract", "Remote"];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Next Driving Opportunity
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Connect with top companies in Rwanda looking for skilled drivers
              like you
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6"
              >
                <div className="text-3xl mb-2">1000+</div>
                <div className="text-blue-100">Active Jobs</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6"
              >
                <div className="text-3xl mb-2">500+</div>
                <div className="text-blue-100">Companies</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6"
              >
                <div className="text-3xl mb-2">2000+</div>
                <div className="text-blue-100">Drivers Hired</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8 -mt-24"
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

        {/* Featured Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Truck Driver",
              "Delivery Driver",
              "Bus Driver",
              "Private Chauffeur",
            ].map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSearchQuery(category);
                  handleSearch({ preventDefault: () => {} });
                }}
              >
                <h3 className="font-semibold mb-2">{category}</h3>
                <div className="flex items-center text-blue-600 text-sm">
                  View Jobs <BsArrowRight className="ml-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

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
          ) : jobs?.length === 0 ? (
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
            jobs?.map((job, i) => (
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
        {jobs?.length > 0 && (
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
    </div>
  );
};

export default FindJobs;
