import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BiSearch, BiBuildings } from "react-icons/bi";
import { BsStarFill, BsPeople } from "react-icons/bs";
import { apiRequest } from "../utils";
import { CustomButton } from "../components";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const query = params.get("q") || "";
    const loc = params.get("location") || "";
    const page = parseInt(params.get("page")) || 1;
    const sortParam = params.get("sort") || "Newest";

    setSearchQuery(query);
    setLocation(loc);
    setCurrentPage(page);
    setSort(sortParam);

    fetchCompanies(query, loc, page, sortParam);
  }, [search]);

  const fetchCompanies = async (query, loc, page, sortParam) => {
    try {
      setLoading(true);
      const res = await apiRequest({
        url: "/companies",
        method: "GET",
        params: {
          search: query,
          location: loc,
          page,
          sort: sortParam,
        },
      });

      setCompanies(res?.data?.companies || []);
      setTotalPages(res?.data?.numOfPage || 1);
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
    if (sort) params.set("sort", sort);
    params.set("page", "1");
    navigate(`?${params.toString()}`);
  };

  const handleSort = (value) => {
    setSort(value);
    const params = new URLSearchParams(search);
    params.set("sort", value);
    navigate(`?${params.toString()}`);
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
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex-1 relative">
              <BiBuildings className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <select
                value={sort}
                onChange={(e) => handleSort(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none"
              >
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
                <option value="A-Z">Name (A-Z)</option>
                <option value="Z-A">Name (Z-A)</option>
              </select>
            </div>
            <CustomButton
              title="Search"
              type="submit"
              containerStyles="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            />
          </form>
        </motion.div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : companies.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-500">
                No companies found matching your criteria
              </p>
            </div>
          ) : (
            companies.map((company) => (
              <motion.div
                key={company._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/company-profile/${company._id}`)}
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden">
                    <img
                      src={company.profileUrl || "/company-placeholder.png"}
                      alt={company.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">
                      {company.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {company.location}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <BsPeople className="text-blue-600" />
                        <span className="text-sm text-gray-600">
                          {company.employees || "Not specified"} employees
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {company.jobPosts?.length || 0} active jobs
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && companies.length > 0 && (
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
  );
};

export default Companies;
