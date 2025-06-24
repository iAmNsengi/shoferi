import { Eye, Languages } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserProfile } from "../store/slices/userSlice";
import toast from "react-hot-toast";
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
  BiLoader,
  BiSave,
} from "react-icons/bi";
import { BsArrowRight, BsThreeDots } from "react-icons/bs";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    location: "",
    jobTitle: "",
    aboutMe: "",
  });

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        contact: profile.contact || "",
        location: profile.location || "",
        jobTitle: profile.jobTitle || "",
        aboutMe: profile.aboutMe || "",
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

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

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BiLoader className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Cover Photo */}
      <div className="relative h-64 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute top-4 right-4">
          <button className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-opacity-30 transition-all">
            <BiCamera className="text-lg" />
          </button>
        </div>

        {/* Profile Picture */}
        <div className="absolute bottom-10 left-8">
          <div className="relative">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center text-4xl font-bold text-purple-600">
              {profile?.profileUrl ? (
                <img
                  src={profile.profileUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                `${profile?.firstName?.charAt(0) || ""}${
                  profile?.lastName?.charAt(0) || ""
                }`
              )}
            </div>
            <button className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-all shadow-lg">
              <BiCamera className="text-sm" />
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="absolute bottom-20 left-48">
          <h1 className="text-2xl font-bold text-white mb-1">
            {profile
              ? `${profile.firstName} ${profile.lastName}`
              : "Loading..."}
          </h1>
          <p className="text-purple-200 flex items-center gap-2">
            <BiMapPin className="text-sm" />
            {profile?.location || "Location not set"}
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
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-600 transition-all flex items-center gap-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <BiLoader className="animate-spin" /> : <BiSave />}
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <BiEdit className="text-sm" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Tabs */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <IconComponent className="text-lg" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Profile Information
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      About Me
                    </label>
                    <textarea
                      name="aboutMe"
                      value={formData.aboutMe}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Tell us about yourself, your experience, and what kind of opportunities you're looking for..."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {job.position}
                          </h3>
                          <p className="text-sm text-gray-600">{job.company}</p>
                          <p className="text-sm text-purple-600">
                            {job.salary}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              job.status === "interview_scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : job.status === "under_review"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {job.status.replace("_", " ")}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {job.appliedDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  App Preferences
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Languages className="text-purple-600 text-xl" />
                      <div>
                        <h4 className="font-medium text-gray-800">Language</h4>
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
