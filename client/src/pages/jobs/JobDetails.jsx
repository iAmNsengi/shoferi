import { useState } from "react";
import {
  BiArrowBack,
  BiBookmark,
  BiDollar,
  BiTime,
  BiLocationPlus,
  BiShare,
  BiBuilding,
  BiUser,
  BiCalendar,
  BiCheck,
} from "react-icons/bi";
import { BsStarFill, BsClock, BsGeoAlt, BsPeople } from "react-icons/bs";
import { HiOutlineOfficeBuilding, HiOutlineBadgeCheck } from "react-icons/hi";

const JobDetails = ({ jobId, onBack }) => {
  const [isApplying, setIsApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Sample job data - in real app, this would come from props or API
  const jobData = {
    id: 1,
    title: "Professional Taxi Driver",
    company: "Kigali Transport Co.",
    location: "Kigali, Rwanda",
    salary: "150,000 - 200,000 RWF",
    type: "Full-time",
    posted: "2 days ago",
    applicants: 45,
    description: `We are looking for a professional taxi driver with clean driving record and excellent customer service skills. This is an excellent opportunity to join Rwanda's leading transportation company with competitive benefits and growth opportunities.

As a professional taxi driver, you will be responsible for providing safe, reliable, and courteous transportation services to our valued customers. You will operate company vehicles in accordance with all traffic laws and company policies while maintaining the highest standards of customer service.`,
    requirements: [
      "Valid driving license (minimum 2 years)",
      "2+ years of professional driving experience",
      "Clean driving record with no major violations",
      "Excellent customer service and communication skills",
      "Knowledge of Kigali roads and traffic patterns",
      "Ability to work flexible hours including weekends",
      "Basic English and Kinyarwanda proficiency",
      "Physical fitness and good health",
    ],
    responsibilities: [
      "Safely transport passengers to their destinations",
      "Maintain cleanliness and condition of assigned vehicle",
      "Follow all traffic laws and company safety protocols",
      "Provide excellent customer service at all times",
      "Handle cash transactions and maintain accurate records",
      "Report any vehicle issues or incidents immediately",
      "Assist passengers with luggage when needed",
      "Maintain professional appearance and demeanor",
    ],
    benefits: [
      "Competitive salary with performance bonuses",
      "Comprehensive health insurance coverage",
      "Fuel allowance and vehicle maintenance covered",
      "Paid vacation and sick leave",
      "Professional development opportunities",
      "Employee recognition programs",
      "Flexible scheduling options",
      "Company uniform provided",
    ],
    companyInfo: {
      name: "Kigali Transport Co.",
      logo: "KT",
      rating: 4.8,
      reviews: 124,
      employees: "200-500",
      founded: "2015",
      industry: "Transportation & Logistics",
      website: "www.kigalitransport.rw",
      description:
        "Leading transportation company in Rwanda providing reliable taxi and logistics services across the country.",
    },
    applicationDeadline: "June 30, 2025",
    startDate: "July 15, 2025",
  };

  const handleApply = () => {
    setIsApplying(true);
    // Simulate application process
    setTimeout(() => {
      setIsApplying(false);
      alert("Application submitted successfully!");
    }, 2000);
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: `${jobData.title} at ${jobData.company}`,
        text: `Check out this job opportunity: ${jobData.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Job link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <BiArrowBack className="text-xl" />
              <span className="font-medium">Back to Jobs</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={shareJob}
                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <BiShare className="text-xl" />
              </button>
              <button
                onClick={toggleSave}
                className={`p-2 rounded-lg transition-colors ${
                  isSaved
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
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
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                  {jobData.companyInfo.logo}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {jobData.title}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-xl text-purple-600 font-semibold">
                      {jobData.company}
                    </h2>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <BsStarFill
                          key={i}
                          className={
                            i < Math.floor(jobData.companyInfo.rating)
                              ? "text-yellow-400"
                              : "text-gray-200"
                          }
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        {jobData.companyInfo.rating} (
                        {jobData.companyInfo.reviews} reviews)
                      </span>
                    </div>
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
                        {jobData.salary}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BsClock className="text-gray-400" />
                      <span className="text-gray-600 text-sm">
                        {jobData.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BsPeople className="text-gray-400" />
                      <span className="text-gray-600 text-sm">
                        {jobData.applicants} applicants
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleApply}
                  disabled={isApplying}
                  className="flex-1 min-w-[200px] bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50"
                >
                  {isApplying ? "Applying..." : "Apply Now"}
                </button>
                <button className="bg-purple-50 text-purple-600 py-3 px-6 rounded-xl hover:bg-purple-100 transition-colors font-semibold">
                  Save for Later
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "requirements", label: "Requirements" },
                    { id: "company", label: "Company" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "text-purple-600 border-b-2 border-purple-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Job Description
                      </h3>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {jobData.description}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Key Responsibilities
                      </h3>
                      <ul className="space-y-3">
                        {jobData.responsibilities.map(
                          (responsibility, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <BiCheck className="text-green-500 text-xl mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">
                                {responsibility}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Benefits & Perks
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {jobData.benefits.map((benefit, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 bg-green-50 p-3 rounded-lg"
                          >
                            <BiCheck className="text-green-500 text-xl" />
                            <span className="text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Requirements Tab */}
                {activeTab === "requirements" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Required Qualifications
                      </h3>
                      <ul className="space-y-3">
                        {jobData.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <HiOutlineBadgeCheck className="text-purple-500 text-xl mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-xl">
                      <h4 className="font-semibold text-purple-900 mb-2">
                        Application Tips
                      </h4>
                      <ul className="text-purple-700 text-sm space-y-1">
                        <li>
                          • Ensure your driving license is valid and up to date
                        </li>
                        <li>• Highlight your customer service experience</li>
                        <li>• Include references from previous employers</li>
                        <li>
                          • Mention your knowledge of local roads and areas
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Company Tab */}
                {activeTab === "company" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                        {jobData.companyInfo.logo}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {jobData.companyInfo.name}
                        </h3>
                        <p className="text-gray-600">
                          {jobData.companyInfo.industry}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed">
                      {jobData.companyInfo.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <BiUser className="text-3xl text-purple-500 mx-auto mb-2" />
                        <div className="font-semibold text-gray-900">
                          {jobData.companyInfo.employees}
                        </div>
                        <div className="text-sm text-gray-600">Employees</div>
                      </div>
                      <div className="text-center">
                        <BiCalendar className="text-3xl text-purple-500 mx-auto mb-2" />
                        <div className="font-semibold text-gray-900">
                          {jobData.companyInfo.founded}
                        </div>
                        <div className="text-sm text-gray-600">Founded</div>
                      </div>
                      <div className="text-center">
                        <BsStarFill className="text-3xl text-yellow-400 mx-auto mb-2" />
                        <div className="font-semibold text-gray-900">
                          {jobData.companyInfo.rating}
                        </div>
                        <div className="text-sm text-gray-600">Rating</div>
                      </div>
                      <div className="text-center">
                        <HiOutlineOfficeBuilding className="text-3xl text-purple-500 mx-auto mb-2" />
                        <div className="font-semibold text-gray-900">
                          Transport
                        </div>
                        <div className="text-sm text-gray-600">Industry</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Apply Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Apply
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Application Deadline</span>
                  <span className="font-semibold text-gray-900">
                    {jobData.applicationDeadline}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Start Date</span>
                  <span className="font-semibold text-gray-900">
                    {jobData.startDate}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Applicants</span>
                  <span className="font-semibold text-gray-900">
                    {jobData.applicants}
                  </span>
                </div>
              </div>
              <button
                onClick={handleApply}
                disabled={isApplying}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all font-semibold mt-6 disabled:opacity-50"
              >
                {isApplying ? "Applying..." : "Apply Now"}
              </button>
            </div>

            {/* Similar Jobs */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Similar Jobs
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Delivery Driver",
                    company: "Rwanda Express",
                    salary: "120K - 180K RWF",
                  },
                  {
                    title: "Corporate Chauffeur",
                    company: "Executive Transport",
                    salary: "200K - 280K RWF",
                  },
                  {
                    title: "School Bus Driver",
                    company: "Safe Schools",
                    salary: "140K - 170K RWF",
                  },
                ].map((job, index) => (
                  <div
                    key={index}
                    className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {job.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">{job.company}</p>
                    <p className="text-purple-600 text-sm font-medium">
                      {job.salary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
