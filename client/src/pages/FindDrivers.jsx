import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BiSearch, BiMap, BiFilter } from "react-icons/bi";
import { BsStarFill } from "react-icons/bs";
import { apiRequest } from "../utils";
import { CustomButton } from "../components";

const FindDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [filters, setFilters] = useState({
    experience: [],
    rating: null,
    availability: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const query = params.get("q") || "";
    const loc = params.get("location") || "";
    const page = parseInt(params.get("page")) || 1;

    setSearchQuery(query);
    setLocation(loc);
    setCurrentPage(page);

    fetchDrivers(query, loc, page);
  }, [search]);

  const fetchDrivers = async (query, loc, page) => {
    try {
      setLoading(true);
      const res = await apiRequest({
        url: `/api-v1/drivers/search?q=${query}&location=${loc}&page=${page}&experience=${filters.experience.join(
          ","
        )}&rating=${filters.rating || ""}&availability=${filters.availability}`,
        method: "GET",
      });

      setDrivers(res?.data?.drivers || []);
      setTotalPages(res?.data?.totalPages || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (location) params.set("location", location);
    params.set("page", "1");
    navigate(`?${params.toString()}`);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      fetchDrivers(searchQuery, location, currentPage);
      return newFilters;
    });
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(search);
    params.set("page", page.toString());
    navigate(`?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search drivers by name or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex-1 relative">
              <BiMap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <CustomButton
              title="Search"
              type="submit"
              containerStyles="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            />
          </form>
        </motion.div>

        {/* Filters and Results */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 h-fit"
          >
            <div className="flex items-center gap-2 mb-6">
              <BiFilter className="text-xl text-blue-600" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>

            {/* Experience Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Experience</h3>
              {["0-2", "3-5", "5-10", "10+"].map((exp) => (
                <label key={exp} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={filters.experience.includes(exp)}
                    onChange={(e) => {
                      const newExp = e.target.checked
                        ? [...filters.experience, exp]
                        : filters.experience.filter((x) => x !== exp);
                      handleFilterChange("experience", newExp);
                    }}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{exp} years</span>
                </label>
              ))}
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Minimum Rating</h3>
              {[5, 4, 3].map((rating) => (
                <label key={rating} className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === rating}
                    onChange={() => handleFilterChange("rating", rating)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rating }).map((_, i) => (
                      <BsStarFill key={i} className="text-yellow-400 text-sm" />
                    ))}
                    <span className="text-sm ml-1">& up</span>
                  </div>
                </label>
              ))}
            </div>

            {/* Availability Filter */}
            <div>
              <h3 className="text-sm font-medium mb-3">Availability</h3>
              <select
                value={filters.availability}
                onChange={(e) =>
                  handleFilterChange("availability", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="all">All</option>
                <option value="available">Available Now</option>
                <option value="scheduled">Scheduled Only</option>
              </select>
            </div>
          </motion.div>

          {/* Results */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : drivers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <p className="text-gray-500">
                  No drivers found matching your criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {drivers.map((driver) => (
                  <motion.div
                    key={driver._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => navigate(`/driver/${driver._id}`)}
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden">
                        <img
                          src={driver.profileUrl || "/default-avatar.png"}
                          alt={driver.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">
                          {driver.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {driver.location}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <BsStarFill
                                key={i}
                                className={`text-sm ${
                                  i < Math.floor(driver.rating)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            ({driver.totalRatings})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {driver.experience} years exp.
                          </span>
                          <span className="text-sm text-gray-600">•</span>
                          <span
                            className={`text-sm ${
                              driver.isAvailable
                                ? "text-green-600"
                                : "text-gray-600"
                            }`}
                          >
                            {driver.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && drivers.length > 0 && (
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindDrivers;
