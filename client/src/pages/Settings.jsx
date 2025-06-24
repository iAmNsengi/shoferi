import { Eye, Languages } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchUserProfile, 
  updateUserProfile,
  updateUserPreferences,
  updateNotificationSettings,
  updatePrivacySettings,
  changePassword,
  fetchUserStats
} from "../store/slices/userSlice";
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
  const { profile, loading, error, preferences, actionLoading, stats } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    location: "",
    jobTitle: "",
    about: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: true,
    push: true,
    jobAlerts: true,
    marketing: false,
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showLocation: true,
  });

  // Preferences state
  const [userPreferences, setUserPreferences] = useState({
    language: "en",
    currency: "RWF",
    theme: "light",
    timezone: "Africa/Kigali",
    notifications: notificationSettings,
    privacy: privacySettings,
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchUserStats());
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
        about: profile.about || "",
        phoneNumber: profile.phoneNumber || "",
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : "",
        gender: profile.gender || "",
      });

      if (profile.preferences) {
        setUserPreferences({
          ...userPreferences,
          ...profile.preferences,
        });
        
        if (profile.preferences.notifications) {
          setNotificationSettings({
            ...notificationSettings,
            ...profile.preferences.notifications,
          });
        }
        
        if (profile.preferences.privacy) {
          setPrivacySettings({
            ...privacySettings,
            ...profile.preferences.privacy,
          });
        }
      }
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
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

  const handlePreferenceChange = async (key, value) => {
    const updatedPreferences = {
      ...userPreferences,
      [key]: value,
    };
    setUserPreferences(updatedPreferences);
    
    try {
      await dispatch(updateUserPreferences(updatedPreferences)).unwrap();
    } catch (error) {
      console.error("Failed to update preferences:", error);
    }
  };

  const handleNotificationToggle = async (key) => {
    const updatedNotifications = {
      ...notificationSettings,
      [key]: !notificationSettings[key],
    };
    setNotificationSettings(updatedNotifications);
    
    try {
      await dispatch(updateNotificationSettings(updatedNotifications)).unwrap();
    } catch (error) {
      console.error("Failed to update notifications:", error);
    }
  };

  const handlePrivacyChange = async (key, value) => {
    const updatedPrivacy = {
      ...privacySettings,
      [key]: value,
    };
    setPrivacySettings(updatedPrivacy);
    
    try {
      await dispatch(updatePrivacySettings(updatedPrivacy)).unwrap();
    } catch (error) {
      console.error("Failed to update privacy:", error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    try {
      await dispatch(changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })).unwrap();
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to change password:", error);
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
                      name="about"
                      value={formData.about}
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
                    <select
                      value={userPreferences.language}
                      onChange={(e) => handlePreferenceChange("language", e.target.value)}
                      className="p-2 border border-gray-200 rounded-lg"
                    >
                      <option value="en">English</option>
                      <option value="rw">Kinyarwanda</option>
                      <option value="fr">French</option>
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
                    <select
                      value={userPreferences.theme}
                      onChange={(e) => handlePreferenceChange("theme", e.target.value)}
                      className="p-2 border border-gray-200 rounded-lg"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
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
                    <select
                      value={userPreferences.notifications.jobAlerts.radius}
                      onChange={(e) => handlePreferenceChange("notifications.jobAlerts.radius", e.target.value)}
                      className="p-2 border border-gray-200 rounded-lg"
                    >
                      <option value="5">5 km</option>
                      <option value="10">10 km</option>
                      <option value="25">25 km</option>
                      <option value="50">50 km</option>
                      <option value="any">Anywhere in Rwanda</option>
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
                      key: "jobAlerts",
                      title: "Job Alerts",
                      desc: "Get notified about new job opportunities",
                      enabled: notificationSettings.jobAlerts,
                    },
                    {
                      key: "email",
                      title: "Email Notifications",
                      desc: "Receive email updates and alerts",
                      enabled: notificationSettings.email,
                    },
                    {
                      key: "sms",
                      title: "SMS Notifications",
                      desc: "Receive text message updates",
                      enabled: notificationSettings.sms,
                    },
                    {
                      key: "push",
                      title: "Push Notifications",
                      desc: "Receive app notifications",
                      enabled: notificationSettings.push,
                    },
                    {
                      key: "marketing",
                      title: "Marketing",
                      desc: "Promotional offers and updates",
                      enabled: notificationSettings.marketing,
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
                      <button
                        onClick={() => handleNotificationToggle(item.key)}
                        disabled={actionLoading.notifications}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${
                          item.enabled ? "bg-purple-600" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            item.enabled ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></div>
                      </button>
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
                    <select
                      value={privacySettings.profileVisibility}
                      onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                      disabled={actionLoading.privacy}
                      className="p-2 border border-gray-200 rounded-lg"
                    >
                      <option value="public">Everyone</option>
                      <option value="limited">Employers Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BiMailSend className="text-purple-600 text-xl" />
                      <div>
                        <h4 className="font-medium text-gray-800">
                          Show Email
                        </h4>
                        <p className="text-sm text-gray-500">
                          Display email on public profile
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange("showEmail", !privacySettings.showEmail)}
                      disabled={actionLoading.privacy}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${
                        privacySettings.showEmail ? "bg-purple-600" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          privacySettings.showEmail ? "translate-x-6" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BiPhone className="text-purple-600 text-xl" />
                      <div>
                        <h4 className="font-medium text-gray-800">
                          Show Phone
                        </h4>
                        <p className="text-sm text-gray-500">
                          Display phone number on public profile
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange("showPhone", !privacySettings.showPhone)}
                      disabled={actionLoading.privacy}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${
                        privacySettings.showPhone ? "bg-purple-600" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          privacySettings.showPhone ? "translate-x-6" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BiMapPin className="text-purple-600 text-xl" />
                      <div>
                        <h4 className="font-medium text-gray-800">
                          Show Location
                        </h4>
                        <p className="text-sm text-gray-500">
                          Display location on public profile
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange("showLocation", !privacySettings.showLocation)}
                      disabled={actionLoading.privacy}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${
                        privacySettings.showLocation ? "bg-purple-600" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          privacySettings.showLocation ? "translate-x-6" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>

                  {/* Password Change Section */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      Change Password
                    </h4>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={actionLoading.password}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {actionLoading.password ? (
                          <>
                            <BiLoader className="animate-spin" />
                            Changing Password...
                          </>
                        ) : (
                          <>
                            <BiLock />
                            Change Password
                          </>
                        )}
                      </button>
                    </form>
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
