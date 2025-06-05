import { Eye, Languages } from "lucide-react";
import { useState } from "react";
import {
  BiUser,
  BiCog,
  BiShield,
  BiBell,
  BiCar,
  BiMapPin,
  BiPhone,
  BiEdit,
  BiCamera,
  BiDollarCircle,
  BiTime,
  BiTrendingUp,
  BiBookmark,
  BiHeart,
  BiLock,
  BiPalette,
  BiHelpCircle,
  BiLogOut,
  BiCheck,
  BiStar,
  BiMailSend,
  BiBullseye,
} from "react-icons/bi";
import { BsArrowRight, BsThreeDots } from "react-icons/bs";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: "profile", label: "Profile", icon: BiUser },
    { id: "activity", label: "Activity", icon: BiTrendingUp },
    { id: "preferences", label: "Preferences", icon: BiCog },
    { id: "notifications", label: "Notifications", icon: BiBell },
    { id: "privacy", label: "Privacy", icon: BiShield },
    { id: "help", label: "Help", icon: BiHelpCircle },
  ];

  const recentJobs = [
    {
      id: 1,
      company: "Transport Solutions Ltd",
      position: "Delivery Driver",
      status: "interview_scheduled",
      appliedDate: "2 days ago",
      salary: "150,000 RWF",
    },
    {
      id: 2,
      company: "Safari Car Rental",
      position: "VIP Chauffeur",
      status: "under_review",
      appliedDate: "1 week ago",
      salary: "200,000 RWF",
    },
    {
      id: 3,
      company: "City Bus Service",
      position: "Bus Driver",
      status: "rejected",
      appliedDate: "2 weeks ago",
      salary: "180,000 RWF",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "interview_scheduled":
        return "bg-blue-100 text-blue-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "interview_scheduled":
        return "Interview Scheduled";
      case "under_review":
        return "Under Review";
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected";
      default:
        return "Applied";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ">
      {/* Cover Photo Section */}
      <div className="relative h-60 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 overflow-hidden ">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          <div className="absolute top-20 right-16 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-white rounded-full blur-xl"></div>
        </div>

        {/* Cover Photo Actions */}
        <div className="absolute top-4 right-4 flex gap-2 pt-14">
          <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all">
            <BiCamera className="text-lg" />
          </button>
          <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all">
            <BiEdit className="text-lg" />
          </button>
        </div>

        {/* Profile Picture */}
        <div className="absolute bottom-10 left-8">
          <div className="relative">
            <div className="w-32 h-32   bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center text-4xl font-bold text-purple-600">
              EN
            </div>
            <button className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-all shadow-lg">
              <BiCamera className="text-sm" />
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="absolute bottom-20 left-48">
          <h1 className="text-2xl font-bold text-white mb-1">Eliezer Nsengi</h1>
          <p className="text-purple-200 flex items-center gap-2">
            <BiMapPin className="text-sm" />
            Kigali, Rwanda
          </p>
        </div>
      </div>

      {/* Profile Stats Bar */}
      <div className="bg-white shadow-sm border-b px-8 pt-10 pb-4 z-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">24</div>
              <div className="text-sm text-gray-500">Jobs Applied</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">3</div>
              <div className="text-sm text-gray-500">Interviews</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">4.8</div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <BiStar className="text-yellow-500" />
                Rating
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">2</div>
              <div className="text-sm text-gray-500">Years Experience</div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2"
          >
            <BiEdit className="text-sm" />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-gray-800 mb-4">Settings</h3>
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <IconComponent className="text-lg" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all text-left">
                    <BiBookmark className="text-sm" />
                    <span className="text-sm">Saved Jobs</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all text-left">
                    <BiDollarCircle className="text-sm" />
                    <span className="text-sm">Payment History</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all text-left">
                    <BiLogOut className="text-sm" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Personal Information
                    </h3>
                    <button className="text-purple-600 hover:text-purple-700 transition-colors">
                      <BiEdit className="text-lg" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value="Eliezer Nsengi"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value="+250 788 123 456"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value="iamnsengi@gmail.com"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value="Kigali, Rwanda"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* Driver Information */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Driver Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        License Number
                      </label>
                      <input
                        type="text"
                        value="DL123456789"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience
                      </label>
                      <select
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={!isEditing}
                      >
                        <option>2 Years</option>
                        <option>1 Year</option>
                        <option>3-5 Years</option>
                        <option>5+ Years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Types
                      </label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                          Cars
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                          Vans
                        </span>
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                          + Add More
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability
                      </label>
                      <select
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={!isEditing}
                      >
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Weekends Only</option>
                        <option>Flexible</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="space-y-6">
                {/* Activity Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <BiCar className="text-white text-xl" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      24
                    </div>
                    <div className="text-sm text-gray-500">
                      Total Applications
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <BiCheck className="text-white text-xl" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      3
                    </div>
                    <div className="text-sm text-gray-500">Interviews</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <BiHeart className="text-white text-xl" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      12
                    </div>
                    <div className="text-sm text-gray-500">Saved Jobs</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Eye className="text-white text-xl" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      156
                    </div>
                    <div className="text-sm text-gray-500">Profile Views</div>
                  </div>
                </div>

                {/* Recent Job Applications */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Recent Job Applications
                  </h3>

                  <div className="space-y-4">
                    {recentJobs.map((job) => (
                      <div
                        key={job.id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-800">
                                {job.position}
                              </h4>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  job.status
                                )}`}
                              >
                                {getStatusLabel(job.status)}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">{job.company}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <BiTime className="text-xs" />
                                Applied {job.appliedDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <BiDollarCircle className="text-xs" />
                                {job.salary}
                              </span>
                            </div>
                          </div>
                          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <BsThreeDots className="text-gray-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center mt-6">
                    <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 mx-auto">
                      View All Applications
                      <BsArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    App Preferences
                  </h3>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Languages className="text-purple-600 text-xl" />
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Language
                          </h4>
                          <p className="text-sm text-gray-500">
                            Choose your preferred language
                          </p>
                        </div>
                      </div>
                      <select className="p-2 border border-gray-200 rounded-lg">
                        <option>English</option>
                        <option>Kinyarwanda</option>
                        <option>French</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BiPalette className="text-purple-600 text-xl" />
                        <div>
                          <h4 className="font-medium text-gray-800">Theme</h4>
                          <p className="text-sm text-gray-500">
                            Customize your app appearance
                          </p>
                        </div>
                      </div>
                      <select className="p-2 border border-gray-200 rounded-lg">
                        <option>Light</option>
                        <option>Dark</option>
                        <option>Auto</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BiMapPin className="text-purple-600 text-xl" />
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Job Search Radius
                          </h4>
                          <p className="text-sm text-gray-500">
                            Maximum distance for job recommendations
                          </p>
                        </div>
                      </div>
                      <select className="p-2 border border-gray-200 rounded-lg">
                        <option>5 km</option>
                        <option>10 km</option>
                        <option>25 km</option>
                        <option>50 km</option>
                        <option>Anywhere in Rwanda</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Notification Settings
                </h3>

                <div className="space-y-6">
                  {[
                    {
                      title: "Job Alerts",
                      desc: "Get notified about new job opportunities",
                      enabled: true,
                    },
                    {
                      title: "Application Updates",
                      desc: "Updates on your job applications",
                      enabled: true,
                    },
                    {
                      title: "Messages",
                      desc: "New messages from employers",
                      enabled: true,
                    },
                    {
                      title: "Community Posts",
                      desc: "New posts in your feed",
                      enabled: false,
                    },
                    {
                      title: "Marketing",
                      desc: "Promotional offers and updates",
                      enabled: false,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <div
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${
                          item.enabled ? "bg-purple-600" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            item.enabled ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Privacy & Security
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BiBullseye className="text-purple-600 text-xl" />
                      <div>
                        <h4 className="font-medium text-gray-800">
                          Profile Visibility
                        </h4>
                        <p className="text-sm text-gray-500">
                          Who can see your profile
                        </p>
                      </div>
                    </div>
                    <select className="p-2 border border-gray-200 rounded-lg">
                      <option>Everyone</option>
                      <option>Employers Only</option>
                      <option>Private</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BiLock className="text-purple-600 text-xl" />
                      <div>
                        <h4 className="font-medium text-gray-800">
                          Two-Factor Authentication
                        </h4>
                        <p className="text-sm text-gray-500">
                          Add extra security to your account
                        </p>
                      </div>
                    </div>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                      Enable
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BiPhone className="text-purple-600 text-xl" />
                      <div>
                        <h4 className="font-medium text-gray-800">
                          Phone Number Visibility
                        </h4>
                        <p className="text-sm text-gray-500">
                          Show phone number to employers
                        </p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-purple-600 rounded-full p-1">
                      <div className="w-4 h-4 bg-white rounded-full translate-x-6"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "help" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Help & Support
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "FAQ",
                      desc: "Frequently asked questions",
                      icon: BiHelpCircle,
                    },
                    {
                      title: "Contact Support",
                      desc: "Get help from our team",
                      icon: BiMailSend,
                    },
                    {
                      title: "Report Issue",
                      desc: "Report a bug or problem",
                      icon: BiShield,
                    },
                    {
                      title: "Terms of Service",
                      desc: "Read our terms and conditions",
                      icon: BiUser,
                    },
                  ].map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="text-purple-600 text-xl" />
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
