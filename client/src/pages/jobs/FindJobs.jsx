import { useState } from "react";
import {
  BiSearch,
  BiBookmark,
  BiDollar,
  BiTime,
  BiLocationPlus,
} from "react-icons/bi";
import { BsStarFill, BsClock, BsGeoAlt } from "react-icons/bs";
import { HiOutlineAdjustments } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

const FindJobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);

  const navigate = useNavigate();

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const jobListings = [
    {
      id: 1,
      title: "Professional Taxi Driver",
      company: "Kigali Transport Co.",
      location: "Kigali, Rwanda",
      salary: "150,000 - 200,000 RWF",
      type: "Full-time",
      posted: "2 days ago",
      description:
        "We are looking for a professional taxi driver with clean driving record and excellent customer service skills.",
      requirements: [
        "Valid driving license",
        "2+ years experience",
        "Clean driving record",
        "Customer service skills",
      ],
      benefits: ["Health insurance", "Fuel allowance", "Performance bonus"],
      logo: "KT",
      rating: 4.8,
      reviews: 24,
    },
    {
      id: 2,
      title: "Delivery Driver",
      company: "Rwanda Express Delivery",
      location: "Kigali, Rwanda",
      salary: "120,000 - 180,000 RWF",
      type: "Full-time",
      posted: "1 day ago",
      description:
        "Join our growing delivery team. Experience with motorcycle or car delivery preferred.",
      requirements: [
        "Valid license",
        "Own vehicle preferred",
        "GPS navigation skills",
        "Time management",
      ],
      benefits: ["Flexible hours", "Fuel compensation", "Equipment provided"],
      logo: "RE",
      rating: 4.5,
      reviews: 18,
    },
    {
      id: 3,
      title: "Corporate Chauffeur",
      company: "Executive Transport Ltd",
      location: "Kigali, Rwanda",
      salary: "200,000 - 280,000 RWF",
      type: "Full-time",
      posted: "3 days ago",
      description:
        "Premium chauffeur service for executive clients. Must maintain highest standards of professionalism.",
      requirements: [
        "5+ years experience",
        "Professional appearance",
        "English fluency",
        "Discretion",
      ],
      benefits: [
        "Premium salary",
        "Uniform provided",
        "Tips allowed",
        "Training provided",
      ],
      logo: "ET",
      rating: 4.9,
      reviews: 12,
    },
    {
      id: 4,
      title: "School Bus Driver",
      company: "Safe Schools Transport",
      location: "Gasabo, Rwanda",
      salary: "140,000 - 170,000 RWF",
      type: "Part-time",
      posted: "1 week ago",
      description:
        "Responsible for safe transportation of students. Background check required.",
      requirements: [
        "Clean driving record",
        "Background check",
        "Patience with children",
        "Punctuality",
      ],
      benefits: ["Flexible schedule", "School holidays off", "Safety training"],
      logo: "SS",
      rating: 4.7,
      reviews: 31,
    },
    {
      id: 5,
      title: "Truck Driver (Long Distance)",
      company: "Rwanda Logistics Hub",
      location: "Nationwide",
      salary: "180,000 - 250,000 RWF",
      type: "Full-time",
      posted: "4 days ago",
      description:
        "Long distance truck driver for regional routes. Travel allowance provided.",
      requirements: [
        "Heavy vehicle license",
        "3+ years experience",
        "Physical fitness",
        "Navigation skills",
      ],
      benefits: ["Travel allowance", "Accommodation provided", "Overtime pay"],
      logo: "RL",
      rating: 4.6,
      reviews: 15,
    },
    {
      id: 6,
      title: "Uber/Bolt Driver",
      company: "Independent Contractor",
      location: "Kigali, Rwanda",
      salary: "100,000 - 300,000 RWF",
      type: "Flexible",
      posted: "5 days ago",
      description:
        "Drive on your own schedule with ride-sharing platforms. Car rental options available.",
      requirements: [
        "Valid license",
        "Smartphone",
        "Customer service",
        "Own car or rental",
      ],
      benefits: ["Flexible hours", "Weekly payments", "Car rental support"],
      logo: "IC",
      rating: 4.3,
      reviews: 89,
    },
  ];

  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      location === "" ||
      job.location.toLowerCase().includes(location.toLowerCase());
    const matchesType =
      jobType === "all" || job.type.toLowerCase() === jobType.toLowerCase();

    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20 -mt-[100px]">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 py-16 pt-60">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find Your Perfect Driving Job
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Discover opportunities from verified companies across Rwanda
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <BiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Job title, company, or keywords"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="relative">
                <BiLocationPlus className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold">
                <h2>Search Jobs</h2>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <HiOutlineAdjustments />
                <h3>Filters</h3>
              </button>
              <button
                onClick={() =>
                  setJobType(jobType === "all" ? "full-time" : "all")
                }
                className={`px-4 py-2 rounded-full transition-colors ${
                  jobType === "full-time"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <h3>Full-time</h3>
              </button>
              <button
                onClick={() =>
                  setJobType(jobType === "all" ? "part-time" : "all")
                }
                className={`px-4 py-2 rounded-full transition-colors ${
                  jobType === "part-time"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <h3>Part-time</h3>
              </button>
              <button
                onClick={() =>
                  setJobType(jobType === "all" ? "flexible" : "all")
                }
                className={`px-4 py-2 rounded-full transition-colors ${
                  jobType === "flexible"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <h3>Flexible</h3>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredJobs.length} Jobs Found
          </h2>
          <select className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none">
            <option>Sort by: Most Recent</option>
            <option>Sort by: Salary (High to Low)</option>
            <option>Sort by: Salary (Low to High)</option>
            <option>Sort by: Company Rating</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
            >
              {/* Job Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {job.logo}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 font-medium">{job.company}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSaveJob(job.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    savedJobs.includes(job.id)
                      ? "bg-purple-100 text-purple-600"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  <BiBookmark className="text-xl" />
                </button>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <BsGeoAlt className="text-gray-400" />
                  <span className="text-gray-600 text-sm">{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BiDollar className="text-gray-400" />
                  <span className="text-gray-600 text-sm">{job.salary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BsClock className="text-gray-400" />
                  <span className="text-gray-600 text-sm">{job.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BiTime className="text-gray-400" />
                  <span className="text-gray-600 text-sm">{job.posted}</span>
                </div>
              </div>

              {/* Company Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <BsStarFill
                      key={i}
                      className={
                        i < Math.floor(job.rating)
                          ? "text-yellow-400"
                          : "text-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {job.rating} ({job.reviews} reviews)
                </span>
              </div>

              {/* Job Description */}
              <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                {job.description}
              </p>

              {/* Requirements Preview */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {job.requirements.slice(0, 3).map((req, index) => (
                    <span
                      key={index}
                      className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs"
                    >
                      {req}
                    </span>
                  ))}
                  {job.requirements.length > 3 && (
                    <span className="text-purple-600 text-xs">
                      +{job.requirements.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/jobs/1")}
                  to={"/jobs/1"}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 px-4 rounded-xl hover:shadow-lg transition-all font-semibold"
                >
                  Apply Now
                </button>
                <button
                  onClick={() => navigate("/jobs/1")}
                  className="bg-gray-100 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-semibold">
            Load More Jobs
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-purple-200">Active Job Listings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-purple-200">Verified Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">2000+</div>
              <div className="text-purple-200">Successful Hires</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindJobs;
