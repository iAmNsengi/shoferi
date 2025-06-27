import React, { useState, useEffect } from "react";
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
import { getCompanyProfile, updateCompanyProfile } from "../store/slices/companySlice";
import toast from "react-hot-toast";
import {
  BiUser,
  BiCog,
  BiShield,
  BiBell,
  BiMapPin,
  BiPhone,
  BiEdit,
  BiCamera,
  BiTime,
  BiTrendingUp,
  BiLock,
  BiPalette,
  BiHelpCircle,
  BiLogOut,
  BiSave,
  BiLoader,
  BiBuilding,
  BiGlobe,
  BiStar,
  BiCheck,
  BiX,
  BiPlus,
  BiTrash,
  BiEnvelope,
} from "react-icons/bi";
import { 
  HiCurrencyDollar, 
  HiClock, 
  HiEye, 
  HiEyeOff,
  HiBell,
} from "react-icons/hi";

const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, loading, error, preferences, actionLoading, stats } = useSelector((state) => state.user);
  const { profile: companyProfile, loading: companyLoading } = useSelector((state) => state.company || {});
  
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  
  // Determine if user is a company
  const isCompany = user?.accountType === "company" || (user?.name && !user?.firstName);
  const currentProfile = isCompany ? companyProfile : profile;
  const currentLoading = isCompany ? companyLoading : loading;

  // Profile form data
  const [formData, setFormData] = useState({
    // Common fields
    email: "",
    contact: "",
    location: "",
    about: "",
    profileUrl: "",
    // User-specific fields
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    jobTitle: "",
    // Company-specific fields
    name: "",
    industry: "",
    companySize: "",
    website: "",
    foundedYear: "",
  });

  // Settings states
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: true,
    push: true,
    jobAlerts: true,
    applicationAlerts: true,
    marketing: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showLocation: true,
  });

  const [userPreferences, setUserPreferences] = useState({
    language: "en",
    currency: "RWF",
    theme: "light",
    timezone: "Africa/Kigali",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load profile data on component mount
  useEffect(() => {
    if (isCompany) {
      dispatch(getCompanyProfile());
    } else {
    dispatch(fetchUserProfile());
      dispatch(fetchUserStats());
    }
  }, [dispatch, isCompany]);

  // Update form data when profile loads
  useEffect(() => {
    if (currentProfile) {
      if (isCompany) {
      setFormData({
          name: currentProfile.name || "",
          email: currentProfile.email || "",
          contact: currentProfile.contact || "",
          location: currentProfile.location || "",
          about: currentProfile.about || "",
          profileUrl: currentProfile.profileUrl || "",
          industry: currentProfile.industry || "",
          companySize: currentProfile.companySize || "",
          website: currentProfile.website || "",
          foundedYear: currentProfile.foundedYear || "",
        });
      } else {
        setFormData({
          firstName: currentProfile.firstName || "",
          lastName: currentProfile.lastName || "",
          email: currentProfile.email || "",
          contact: currentProfile.contact || "",
          location: currentProfile.location || "",
          jobTitle: currentProfile.jobTitle || "",
          about: currentProfile.about || "",
          profileUrl: currentProfile.profileUrl || "",
          phoneNumber: currentProfile.phoneNumber || "",
          dateOfBirth: currentProfile.dateOfBirth ? currentProfile.dateOfBirth.split('T')[0] : "",
          gender: currentProfile.gender || "",
        });
      }

      // Load preferences
      if (currentProfile.preferences) {
        setUserPreferences({
          ...userPreferences,
          ...currentProfile.preferences,
        });
        
        if (currentProfile.preferences.notifications) {
          setNotificationSettings({
            ...notificationSettings,
            ...currentProfile.preferences.notifications,
          });
        }
        
        if (currentProfile.preferences.privacy) {
          setPrivacySettings({
            ...privacySettings,
            ...currentProfile.preferences.privacy,
          });
        }
      }
    }
  }, [currentProfile, isCompany]);

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
      if (isCompany) {
        await dispatch(updateCompanyProfile(formData)).unwrap();
      } else {
      await dispatch(updateUserProfile(formData)).unwrap();
      }
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
      if (!isCompany) {
        await dispatch(updateUserPreferences(updatedPreferences)).unwrap();
      }
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
      if (!isCompany) {
        await dispatch(updateNotificationSettings(updatedNotifications)).unwrap();
      }
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
      if (!isCompany) {
        await dispatch(updatePrivacySettings(updatedPrivacy)).unwrap();
      }
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
    { id: "profile", label: "Profile", icon: isCompany ? BiBuilding : BiUser },
    { id: "preferences", label: "Preferences", icon: BiCog },
    { id: "notifications", label: "Notifications", icon: BiBell },
    { id: "privacy", label: "Privacy & Security", icon: BiShield },
    ...(isCompany ? [] : [{ id: "activity", label: "Activity", icon: BiTrendingUp }]),
    { id: "help", label: "Help & Support", icon: BiHelpCircle },
  ];

  if (currentLoading && !currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 pt-24 flex items-center justify-center">
        <div className="text-center">
          <BiLoader className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  const displayName = isCompany 
    ? currentProfile?.name 
    : `${currentProfile?.firstName || ""} ${currentProfile?.lastName || ""}`.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 pt-24">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                {isCompany ? (
                  <BiBuilding className="text-2xl" />
                ) : (
                  currentProfile?.profileUrl ? (
                    <img
                      src={currentProfile.profileUrl}
                  alt="Profile"
                      className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                    `${currentProfile?.firstName?.charAt(0) || ""}${currentProfile?.lastName?.charAt(0) || ""}`
                  )
              )}
            </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {displayName || "Settings"}
          </h1>
                <p className="text-gray-600 flex items-center gap-2">
            <BiMapPin className="text-sm" />
                  {currentProfile?.location || "Location not set"}
          </p>
        </div>
      </div>

            <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                    disabled={currentLoading}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {currentLoading ? <BiLoader className="animate-spin" /> : <BiSave />}
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <BiEdit className="text-sm" />
                Edit Profile
              </button>
            )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-8">
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

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {isCompany ? "Company Information" : "Profile Information"}
                  </h2>
                </div>

                <div className="space-y-6">
                  {isCompany ? (
                    // Company Profile Fields
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Industry
                          </label>
                          <select
                            name="industry"
                            value={formData.industry}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          >
                            <option value="">Select Industry</option>
                            <option value="transportation">Transportation</option>
                            <option value="logistics">Logistics</option>
                            <option value="delivery">Delivery Services</option>
                            <option value="rideshare">Ride Sharing</option>
                            <option value="freight">Freight</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Size
                          </label>
                          <select
                            name="companySize"
                            value={formData.companySize}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          >
                            <option value="1-10">1-10 employees</option>
                            <option value="11-50">11-50 employees</option>
                            <option value="51-200">51-200 employees</option>
                            <option value="201-500">201-500 employees</option>
                            <option value="500+">500+ employees</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Founded Year
                          </label>
                          <input
                            type="number"
                            name="foundedYear"
                            value={formData.foundedYear}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            min="1900"
                            max={new Date().getFullYear()}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Website
                          </label>
                          <input
                            type="url"
                            name="website"
                            value={formData.website}
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
                            Contact Number
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
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          About Company
                        </label>
                        <textarea
                          name="about"
                          value={formData.about}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          rows={4}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="Tell us about your company, mission, and what makes you special..."
                        />
                      </div>
                    </>
                  ) : (
                    // User Profile Fields
                    <>
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
                            name="phoneNumber"
                            value={formData.phoneNumber}
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

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer_not_to_say">Prefer not to say</option>
                          </select>
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
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Preferences</h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <BiGlobe className="text-purple-600 text-xl" />
                      <div>
                        <h4 className="font-medium text-gray-800">Language</h4>
                        <p className="text-sm text-gray-500">Choose your preferred language</p>
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

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <BiPalette className="text-purple-600 text-xl" />
                      <div>
                        <h4 className="font-medium text-gray-800">Theme</h4>
                        <p className="text-sm text-gray-500">Choose your preferred theme</p>
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

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <HiCurrencyDollar className="text-purple-600 text-xl" />
                      <div>
                        <h4 className="font-medium text-gray-800">Currency</h4>
                        <p className="text-sm text-gray-500">Default currency for salary display</p>
                      </div>
                    </div>
                    <select
                      value={userPreferences.currency}
                      onChange={(e) => handlePreferenceChange("currency", e.target.value)}
                      className="p-2 border border-gray-200 rounded-lg"
                    >
                      <option value="RWF">Rwandan Franc (RWF)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <HiClock className="text-purple-600 text-xl" />
                      <div>
                        <h4 className="font-medium text-gray-800">Timezone</h4>
                        <p className="text-sm text-gray-500">Your local timezone</p>
                      </div>
                    </div>
                    <select
                      value={userPreferences.timezone}
                      onChange={(e) => handlePreferenceChange("timezone", e.target.value)}
                      className="p-2 border border-gray-200 rounded-lg"
                    >
                      <option value="Africa/Kigali">Kigali (GMT+2)</option>
                      <option value="UTC">UTC (GMT+0)</option>
                      <option value="America/New_York">New York (GMT-5)</option>
                      <option value="Europe/London">London (GMT+0)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Notification Settings</h2>

                <div className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          {key === 'email' && <BiEnvelope className="text-purple-600" />}
                          {key === 'sms' && <BiPhone className="text-purple-600" />}
                          {key === 'push' && <BiBell className="text-purple-600" />}
                          {key === 'jobAlerts' && <BiTrendingUp className="text-purple-600" />}
                          {key === 'applicationAlerts' && <BiUser className="text-purple-600" />}
                          {key === 'marketing' && <BiEnvelope className="text-purple-600" />}
                        </div>
                      <div>
                          <h4 className="font-medium text-gray-800 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                          <p className="text-sm text-gray-500">
                            {key === 'email' && 'Receive notifications via email'}
                            {key === 'sms' && 'Receive notifications via SMS'}
                            {key === 'push' && 'Receive push notifications'}
                            {key === 'jobAlerts' && 'Get notified about new job opportunities'}
                            {key === 'applicationAlerts' && 'Get notified about application updates'}
                            {key === 'marketing' && 'Receive marketing and promotional emails'}
                          </p>
                      </div>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle(key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-purple-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Privacy & Security</h2>

                <div className="space-y-8">
                  {/* Privacy Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Privacy Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                          <HiEye className="text-purple-600 text-xl" />
                      <div>
                            <h4 className="font-medium text-gray-800">Profile Visibility</h4>
                            <p className="text-sm text-gray-500">Who can see your profile</p>
                      </div>
                    </div>
                        <select
                          value={privacySettings.profileVisibility}
                          onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                          className="p-2 border border-gray-200 rounded-lg"
                        >
                          <option value="public">Public</option>
                          <option value="limited">Limited</option>
                          <option value="private">Private</option>
                    </select>
                  </div>

                      {Object.entries(privacySettings).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              {value ? <HiEye className="text-purple-600" /> : <HiEyeOff className="text-purple-600" />}
                            </div>
                      <div>
                              <h4 className="font-medium text-gray-800 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <p className="text-sm text-gray-500">
                                {key === 'showEmail' && 'Display email address on profile'}
                                {key === 'showPhone' && 'Display phone number on profile'}
                                {key === 'showLocation' && 'Display location on profile'}
                        </p>
                      </div>
                    </div>
                          <button
                            onClick={() => handlePrivacyChange(key, !value)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-purple-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                    </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Password Change */}
                      <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
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
                          minLength={6}
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
                          minLength={6}
                        />
                    </div>

                      <button
                        type="submit"
                        disabled={actionLoading.password}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {actionLoading.password ? <BiLoader className="animate-spin" /> : <BiLock />}
                        Change Password
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "activity" && !isCompany && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Activity Overview</h2>
                
                {stats ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                        <div className="flex items-center gap-3">
                        <BiTrendingUp className="text-blue-600 text-2xl" />
                          <div>
                          <p className="text-blue-600 text-sm font-medium">Jobs Applied</p>
                          <p className="text-2xl font-bold text-blue-700">{stats.jobsApplied || 0}</p>
                          </div>
                        </div>
                      </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                      <div className="flex items-center gap-3">
                        <BiCheck className="text-green-600 text-2xl" />
                        <div>
                          <p className="text-green-600 text-sm font-medium">Interviews</p>
                          <p className="text-2xl font-bold text-green-700">{stats.interviews || 0}</p>
                </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl">
                      <div className="flex items-center gap-3">
                        <BiStar className="text-yellow-600 text-2xl" />
                        <div>
                          <p className="text-yellow-600 text-sm font-medium">Rating</p>
                          <p className="text-2xl font-bold text-yellow-700">{stats.rating || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BiLoader className="animate-spin text-4xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Loading activity data...</p>
              </div>
            )}
          </div>
            )}

            {activeTab === "help" && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Help & Support</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border border-gray-200 rounded-xl hover:border-purple-300 transition-colors">
                    <BiHelpCircle className="text-purple-600 text-2xl mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">FAQ</h3>
                    <p className="text-gray-600 text-sm mb-4">Find answers to commonly asked questions</p>
                    <button className="text-purple-600 hover:text-purple-700 font-medium">
                      View FAQ →
                    </button>
        </div>

                  <div className="p-6 border border-gray-200 rounded-xl hover:border-purple-300 transition-colors">
                    <BiEnvelope className="text-purple-600 text-2xl mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">Contact Support</h3>
                    <p className="text-gray-600 text-sm mb-4">Get help from our support team</p>
                    <button className="text-purple-600 hover:text-purple-700 font-medium">
                      Contact Us →
                    </button>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-xl hover:border-purple-300 transition-colors">
                    <BiUser className="text-purple-600 text-2xl mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">User Guide</h3>
                    <p className="text-gray-600 text-sm mb-4">Learn how to use all features</p>
                    <button className="text-purple-600 hover:text-purple-700 font-medium">
                      Read Guide →
                    </button>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-xl hover:border-purple-300 transition-colors">
                    <BiGlobe className="text-purple-600 text-2xl mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">Community</h3>
                    <p className="text-gray-600 text-sm mb-4">Join our community forum</p>
                    <button className="text-purple-600 hover:text-purple-700 font-medium">
                      Join Community →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
