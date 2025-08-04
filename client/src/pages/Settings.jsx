import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  BiUser,
  BiCog,
  BiShield,
  BiBell,
  BiHelpCircle,
  BiEdit,
  BiCamera,
  BiDownload,
  BiTrash,
  BiPlus,
  BiX,
  BiCheck,
  BiLock,
  BiEnvelope,
  BiPhone,
  BiMap,
  BiBookOpen,
  BiAward,
  BiBriefcase,
  BiGlobe,
} from "react-icons/bi";
import {
  useUserProfile,
  useUpdateUserProfile,
  useUpdateUserPreferences,
  useUpdateNotificationSettings,
  useUpdatePrivacySettings,
  useChangePassword,
  useDeactivateAccount,
  useUserStats,
  useUploadProfileImage,
  useUploadCV,
} from "../hooks/useQueries";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // React Query hooks
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: userStats } = useUserStats();

  // Mutations
  const updateProfileMutation = useUpdateUserProfile();
  const updatePreferencesMutation = useUpdateUserPreferences();
  const updateNotificationSettingsMutation = useUpdateNotificationSettings();
  const updatePrivacySettingsMutation = useUpdatePrivacySettings();
  const changePasswordMutation = useChangePassword();
  const deactivateAccountMutation = useDeactivateAccount();
  const uploadProfileImageMutation = useUploadProfileImage();
  const uploadCVMutation = useUploadCV();

  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    jobTitle: "",
    about: "",
    location: "",
    dateOfBirth: "",
    gender: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phoneNumber: "",
    },
    socialLinks: {
      linkedin: "",
      twitter: "",
      facebook: "",
      website: "",
    },
  });

  const [preferencesForm, setPreferencesForm] = useState({
    language: "en",
    currency: "RWF",
    theme: "light",
    timezone: "Africa/Kigali",
  });

  const [notificationForm, setNotificationForm] = useState({
    email: true,
    sms: true,
    push: true,
    jobAlerts: true,
    marketing: false,
  });

  const [privacyForm, setPrivacyForm] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showLocation: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Initialize forms when profile data loads
  React.useEffect(() => {
    if (userProfile?.user) {
      const profile = userProfile.user;
      setProfileForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        jobTitle: profile.jobTitle || "",
        about: profile.about || "",
        location: profile.location || "",
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: profile.gender || "",
        address: {
          street: profile.address?.street || "",
          city: profile.address?.city || "",
          state: profile.address?.state || "",
          country: profile.address?.country || "",
          postalCode: profile.address?.postalCode || "",
        },
        emergencyContact: {
          name: profile.emergencyContact?.name || "",
          relationship: profile.emergencyContact?.relationship || "",
          phoneNumber: profile.emergencyContact?.phoneNumber || "",
        },
        socialLinks: {
          linkedin: profile.socialLinks?.linkedin || "",
          twitter: profile.socialLinks?.twitter || "",
          facebook: profile.socialLinks?.facebook || "",
          website: profile.socialLinks?.website || "",
        },
      });

      if (profile.preferences) {
        setPreferencesForm({
          language: profile.preferences.language || "en",
          currency: profile.preferences.currency || "RWF",
          theme: profile.preferences.theme || "light",
          timezone: profile.preferences.timezone || "Africa/Kigali",
        });

        setNotificationForm({
          email: profile.preferences.notifications?.email ?? true,
          sms: profile.preferences.notifications?.sms ?? true,
          push: profile.preferences.notifications?.push ?? true,
          jobAlerts: profile.preferences.notifications?.jobAlerts ?? true,
          marketing: profile.preferences.notifications?.marketing ?? false,
        });

        setPrivacyForm({
          profileVisibility:
            profile.preferences.privacy?.profileVisibility || "public",
          showEmail: profile.preferences.privacy?.showEmail ?? false,
          showPhone: profile.preferences.privacy?.showPhone ?? false,
          showLocation: profile.preferences.privacy?.showLocation ?? true,
        });
      }
    }
  }, [userProfile]);

  const tabs = [
    { id: "profile", label: "Profile", icon: BiUser },
    { id: "preferences", label: "Preferences", icon: BiCog },
    { id: "notifications", label: "Notifications", icon: BiBell },
    { id: "privacy", label: "Privacy & Security", icon: BiShield },
    { id: "help", label: "Help & Support", icon: BiHelpCircle },
  ];

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm);
    setIsEditing(false);
  };

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    updatePreferencesMutation.mutate(preferencesForm);
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    updateNotificationSettingsMutation.mutate(notificationForm);
  };

  const handlePrivacySubmit = (e) => {
    e.preventDefault();
    updatePrivacySettingsMutation.mutate(privacyForm);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
    setShowPasswordModal(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleDeactivateAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to deactivate your account? This action cannot be undone."
      )
    ) {
      deactivateAccountMutation.mutate({
        reason: "User requested deactivation",
      });
    }
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profileImage", file);
      uploadProfileImageMutation.mutate(formData);
    }
  };

  const handleCVUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("cv", file);
      uploadCVMutation.mutate(formData);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                  {userProfile?.user?.profileUrl ? (
                    <img
                      src={userProfile.user.profileUrl}
                      alt="Profile"
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                  ) : (
                    userProfile?.user?.firstName?.charAt(0) || "U"
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full cursor-pointer hover:bg-green-600 transition-colors">
                  <BiCamera className="text-xs" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Profile Settings
                </h1>
                <p className="text-gray-600">
                  Manage your account and preferences
                </p>
              </div>
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
                          ? "bg-green-500 text-white shadow-lg"
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
            <div className="bg-white rounded-2xl shadow-sm p-8">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Profile Information
                    </h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <BiEdit />
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={profileForm.firstName}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              firstName: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={profileForm.lastName}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              lastName: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              email: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profileForm.phoneNumber}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              phoneNumber: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Job Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Title
                        </label>
                        <input
                          type="text"
                          value={profileForm.jobTitle}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              jobTitle: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={profileForm.location}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              location: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* About */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        About
                      </label>
                      <textarea
                        value={profileForm.about}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            about: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={profileForm.dateOfBirth}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              dateOfBirth: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          value={profileForm.gender}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              gender: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer_not_to_say">
                            Prefer not to say
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* CV Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CV/Resume
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleCVUpload}
                          className="hidden"
                          id="cv-upload"
                        />
                        <label
                          htmlFor="cv-upload"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                        >
                          <BiDownload />
                          Upload CV
                        </label>
                        {userProfile?.user?.cvUrl && (
                          <a
                            href={userProfile.user.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <BiDownload />
                            View CV
                          </a>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-4">
                        <button
                          type="submit"
                          disabled={updateProfileMutation.isPending}
                          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          {updateProfileMutation.isPending
                            ? "Saving..."
                            : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Preferences
                  </h2>
                  <form
                    onSubmit={handlePreferencesSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select
                          value={preferencesForm.language}
                          onChange={(e) =>
                            setPreferencesForm({
                              ...preferencesForm,
                              language: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="en">English</option>
                          <option value="fr">French</option>
                          <option value="rw">Kinyarwanda</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency
                        </label>
                        <select
                          value={preferencesForm.currency}
                          onChange={(e) =>
                            setPreferencesForm({
                              ...preferencesForm,
                              currency: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="RWF">Rwandan Franc (RWF)</option>
                          <option value="USD">US Dollar (USD)</option>
                          <option value="EUR">Euro (EUR)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Theme
                        </label>
                        <select
                          value={preferencesForm.theme}
                          onChange={(e) =>
                            setPreferencesForm({
                              ...preferencesForm,
                              theme: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="auto">Auto</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select
                          value={preferencesForm.timezone}
                          onChange={(e) =>
                            setPreferencesForm({
                              ...preferencesForm,
                              timezone: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="Africa/Kigali">Africa/Kigali</option>
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">
                            America/New_York
                          </option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={updatePreferencesMutation.isPending}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {updatePreferencesMutation.isPending
                        ? "Saving..."
                        : "Save Preferences"}
                    </button>
                  </form>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Notification Settings
                  </h2>
                  <form
                    onSubmit={handleNotificationSubmit}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <BiEnvelope className="text-xl text-gray-600" />
                          <div>
                            <h3 className="font-medium text-gray-800">
                              Email Notifications
                            </h3>
                            <p className="text-sm text-gray-500">
                              Receive notifications via email
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationForm.email}
                            onChange={(e) =>
                              setNotificationForm({
                                ...notificationForm,
                                email: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <BiPhone className="text-xl text-gray-600" />
                          <div>
                            <h3 className="font-medium text-gray-800">
                              SMS Notifications
                            </h3>
                            <p className="text-sm text-gray-500">
                              Receive notifications via SMS
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationForm.sms}
                            onChange={(e) =>
                              setNotificationForm({
                                ...notificationForm,
                                sms: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <BiBell className="text-xl text-gray-600" />
                          <div>
                            <h3 className="font-medium text-gray-800">
                              Push Notifications
                            </h3>
                            <p className="text-sm text-gray-500">
                              Receive push notifications
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationForm.push}
                            onChange={(e) =>
                              setNotificationForm({
                                ...notificationForm,
                                push: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <BiBriefcase className="text-xl text-gray-600" />
                          <div>
                            <h3 className="font-medium text-gray-800">
                              Job Alerts
                            </h3>
                            <p className="text-sm text-gray-500">
                              Get notified about new job opportunities
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationForm.jobAlerts}
                            onChange={(e) =>
                              setNotificationForm({
                                ...notificationForm,
                                jobAlerts: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <BiGlobe className="text-xl text-gray-600" />
                          <div>
                            <h3 className="font-medium text-gray-800">
                              Marketing Communications
                            </h3>
                            <p className="text-sm text-gray-500">
                              Receive marketing and promotional emails
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationForm.marketing}
                            onChange={(e) =>
                              setNotificationForm({
                                ...notificationForm,
                                marketing: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={updateNotificationSettingsMutation.isPending}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {updateNotificationSettingsMutation.isPending
                        ? "Saving..."
                        : "Save Notification Settings"}
                    </button>
                  </form>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Privacy & Security
                  </h2>

                  <form onSubmit={handlePrivacySubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Profile Visibility
                        </label>
                        <select
                          value={privacyForm.profileVisibility}
                          onChange={(e) =>
                            setPrivacyForm({
                              ...privacyForm,
                              profileVisibility: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                          <option value="limited">Limited</option>
                        </select>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <BiEnvelope className="text-xl text-gray-600" />
                            <div>
                              <h3 className="font-medium text-gray-800">
                                Show Email
                              </h3>
                              <p className="text-sm text-gray-500">
                                Allow others to see your email address
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacyForm.showEmail}
                              onChange={(e) =>
                                setPrivacyForm({
                                  ...privacyForm,
                                  showEmail: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <BiPhone className="text-xl text-gray-600" />
                            <div>
                              <h3 className="font-medium text-gray-800">
                                Show Phone
                              </h3>
                              <p className="text-sm text-gray-500">
                                Allow others to see your phone number
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacyForm.showPhone}
                              onChange={(e) =>
                                setPrivacyForm({
                                  ...privacyForm,
                                  showPhone: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <BiMap className="text-xl text-gray-600" />
                            <div>
                              <h3 className="font-medium text-gray-800">
                                Show Location
                              </h3>
                              <p className="text-sm text-gray-500">
                                Allow others to see your location
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacyForm.showLocation}
                              onChange={(e) =>
                                setPrivacyForm({
                                  ...privacyForm,
                                  showLocation: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={updatePrivacySettingsMutation.isPending}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {updatePrivacySettingsMutation.isPending
                        ? "Saving..."
                        : "Save Privacy Settings"}
                    </button>
                  </form>

                  {/* Security Section */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Security
                    </h3>
                    <div className="space-y-4">
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <BiLock />
                        Change Password
                      </button>
                      <button
                        onClick={handleDeactivateAccount}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <BiTrash />
                        Deactivate Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Help Tab */}
              {activeTab === "help" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Help & Support
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Contact Support
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Need help? Contact our support team.
                      </p>
                      <div className="space-y-2">
                        <p className="flex items-center gap-2">
                          <BiEnvelope className="text-gray-500" />
                          support@shoferi.com
                        </p>
                        <p className="flex items-center gap-2">
                          <BiPhone className="text-gray-500" />
                          +250 788 123 456
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        FAQ
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            How do I update my profile?
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Go to the Profile tab and click "Edit Profile" to
                            make changes.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            How do I change my password?
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Go to Privacy & Security tab and click "Change
                            Password".
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            How do I manage notifications?
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Go to the Notifications tab to customize your
                            notification preferences.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Change Password
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {changePasswordMutation.isPending
                    ? "Changing..."
                    : "Change Password"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
