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
  BiCrown,
  BiStar,
  BiUpArrow,
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
  useSubscriptionPlans,
  useCurrentSubscription,
  useCreateCheckoutSession,
} from "../hooks/useQueries";
import { toast } from "react-hot-toast";

const Settings = () => {
  const { user, canPerformAction, getTierLimits, usageStats } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // React Query hooks
  const { data, isLoading: profileLoading } = useUserProfile();
  const userProfile = data?.data;
  const { data: userStats } = useUserStats();
  const { data: plansData } = useSubscriptionPlans();
  const { data: currentSubscription } = useCurrentSubscription();

  // Mutations
  const updateProfileMutation = useUpdateUserProfile();
  const updatePreferencesMutation = useUpdateUserPreferences();
  const updateNotificationSettingsMutation = useUpdateNotificationSettings();
  const updatePrivacySettingsMutation = useUpdatePrivacySettings();
  const changePasswordMutation = useChangePassword();
  const deactivateAccountMutation = useDeactivateAccount();
  const uploadProfileImageMutation = useUploadProfileImage();
  const uploadCVMutation = useUploadCV();
  const createCheckoutMutation = useCreateCheckoutSession();

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

  // Handle profile image upload with better UX
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      toast.loading("Uploading profile image...");
      const response = await uploadProfileImageMutation.mutateAsync(formData);

      if (response.data.success) {
        toast.success("Profile image updated successfully!");
        // Refresh user profile data
        // You might want to update the user context here
      } else {
        toast.error("Failed to upload profile image");
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to upload profile image. Please try again.");
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: BiUser },
    { id: "preferences", label: "Preferences", icon: BiCog },
    { id: "notifications", label: "Notifications", icon: BiBell },
    { id: "privacy", label: "Privacy & Security", icon: BiShield },
    { id: "account", label: "Account & Billing", icon: BiCrown },
    { id: "help", label: "Help & Support", icon: BiHelpCircle },
  ];

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfileMutation.mutateAsync(profileForm);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePreferencesMutation.mutateAsync(preferencesForm);
      toast.success("Preferences updated successfully!");
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("Failed to update preferences. Please try again.");
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateNotificationSettingsMutation.mutateAsync(notificationForm);
      toast.success("Notification settings updated successfully!");
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast.error("Failed to update notification settings. Please try again.");
    }
  };

  const handlePrivacySubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePrivacySettingsMutation.mutateAsync(privacyForm);
      toast.success("Privacy settings updated successfully!");
    } catch (error) {
      console.error("Error updating privacy settings:", error);
      toast.error("Failed to update privacy settings. Please try again.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(
        "Failed to change password. Please check your current password."
      );
    }
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

  const handleUpgradeAccount = async (planId) => {
    if (!user) {
      toast.error("Please log in to upgrade your account");
      return;
    }

    try {
      await createCheckoutMutation.mutateAsync(planId);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to initiate upgrade. Please try again.");
    }
  };

  const isFreeTier = user?.accountTier === "STARTER" || !user?.accountTier;
  const plans = plansData?.data?.plans || [
    {
      id: "pro",
      name: "PRO",
      price: 3000,
      features: [
        "10 job posts per month",
        "10 job applications per month",
        "Create feed posts",
        "Comment on posts",
        "Verification badge",
        "Priority support",
      ],
    },
  ];

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid file (PDF, DOC, or DOCX)");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("cv", file);

      toast.loading("Uploading CV...");
      const response = await uploadCVMutation.mutateAsync(formData);

      if (response.data.success) {
        toast.success("CV uploaded successfully!");
        // Refresh user profile data
      } else {
        toast.error("Failed to upload CV");
      }
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast.error("Failed to upload CV. Please try again.");
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
    <div className="min-h-screen bg-gray-50 pt-10">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                  {userProfile?.user?.profileUrl ? (
                    <img
                      src={userProfile.user.profileUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    userProfile?.user?.firstName?.charAt(0) || "U"
                  )}
                </div>
                <label className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <BiCamera className="text-white text-xl" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                </label>
                {uploadProfileImageMutation.isPending && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Profile Settings
                </h1>
                <p className="text-gray-600">
                  Manage your account and preferences
                </p>
                {userProfile?.user && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">
                      {userProfile.user.firstName} {userProfile.user.lastName}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {userProfile.user.accountTier || "STARTER"}
                    </span>
                  </div>
                )}
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
                          value={userProfile?.user?.firstName}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              firstName: e.target.value,
                            })
                          }
                          disabled={
                            !isEditing || updateProfileMutation.isPending
                          }
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
                          value={userProfile?.user?.lastName}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              lastName: e.target.value,
                            })
                          }
                          disabled={
                            !isEditing || updateProfileMutation.isPending
                          }
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
                          value={userProfile?.user?.email}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              email: e.target.value,
                            })
                          }
                          disabled={
                            !isEditing || updateProfileMutation.isPending
                          }
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
                          value={userProfile?.user?.phoneNumber}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              phoneNumber: e.target.value,
                            })
                          }
                          disabled={
                            !isEditing || updateProfileMutation.isPending
                          }
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
                          value={userProfile?.user?.jobTitle}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              jobTitle: e.target.value,
                            })
                          }
                          disabled={
                            !isEditing || updateProfileMutation.isPending
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={userProfile?.user?.location}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              location: e.target.value,
                            })
                          }
                          disabled={
                            !isEditing || updateProfileMutation.isPending
                          }
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
                        value={userProfile?.user?.about}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            about: e.target.value,
                          })
                        }
                        disabled={!isEditing || updateProfileMutation.isPending}
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
                          value={userProfile?.user?.dateOfBirth}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              dateOfBirth: e.target.value,
                            })
                          }
                          disabled={
                            !isEditing || updateProfileMutation.isPending
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          value={userProfile?.user?.gender}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              gender: e.target.value,
                            })
                          }
                          disabled={
                            !isEditing || updateProfileMutation.isPending
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        >
                          <option value="">Select Gender</option>
                          <option
                            value="male"
                            selected={userProfile?.user?.gender === "male"}
                          >
                            Male
                          </option>
                          <option
                            value="female"
                            selected={userProfile?.user?.gender === "female"}
                          >
                            Female
                          </option>
                          <option
                            value="other"
                            selected={userProfile?.user?.gender === "other"}
                          >
                            Other
                          </option>
                          <option
                            value="prefer_not_to_say"
                            selected={
                              userProfile?.user?.gender === "prefer_not_to_say"
                            }
                          >
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
                          disabled={uploadCVMutation.isPending}
                        />
                        <label
                          htmlFor="cv-upload"
                          className={`flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer ${
                            uploadCVMutation.isPending
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {uploadCVMutation.isPending ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <BiDownload />
                              Upload CV
                            </>
                          )}
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
                          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          {updateProfileMutation.isPending ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <BiCheck />
                              Save Changes
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          disabled={updateProfileMutation.isPending}
                          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
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
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {updatePreferencesMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <BiCheck />
                          Save Preferences
                        </>
                      )}
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
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {updateNotificationSettingsMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <BiCheck />
                          Save Notification Settings
                        </>
                      )}
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
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {updatePrivacySettingsMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <BiCheck />
                          Save Privacy Settings
                        </>
                      )}
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

              {/* Account & Billing Tab */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Account & Billing
                  </h2>

                  {/* Current Account Status */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Current Account Status
                      </h3>
                      <div className="flex items-center gap-2">
                        <BiCrown className="text-yellow-500 text-xl" />
                        <span className="font-medium text-gray-700">
                          {user?.accountTier || "STARTER"}
                        </span>
                      </div>
                    </div>

                    {/* Usage Statistics */}
                    {usageStats && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-800">
                            {usageStats.jobsPosted || 0}
                          </div>
                          <div className="text-sm text-gray-600">
                            Jobs Posted
                          </div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-800">
                            {usageStats.jobsApplied || 0}
                          </div>
                          <div className="text-sm text-gray-600">
                            Jobs Applied
                          </div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-800">
                            {usageStats.postsCreated || 0}
                          </div>
                          <div className="text-sm text-gray-600">
                            Feed Posts
                          </div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-800">
                            {usageStats.commentsPosted || 0}
                          </div>
                          <div className="text-sm text-gray-600">Comments</div>
                        </div>
                      </div>
                    )}

                    {/* Current Subscription */}
                    {currentSubscription?.data && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-blue-800 mb-2">
                          Current Subscription
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-blue-600">Status:</span>
                            <span
                              className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                                currentSubscription.data.status === "active"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {currentSubscription.data.status}
                            </span>
                          </div>
                          <div>
                            <span className="text-blue-600">Plan:</span>
                            <span className="ml-2 font-medium">
                              {currentSubscription.data.planId}
                            </span>
                          </div>
                          <div>
                            <span className="text-blue-600">Next billing:</span>
                            <span className="ml-2 font-medium">
                              {new Date(
                                currentSubscription.data.currentPeriodEnd
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upgrade Options */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Upgrade Your Account
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Unlock more features and increase your limits with our PRO
                      plan.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {plans.map((plan) => (
                        <div
                          key={plan.id}
                          className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors"
                        >
                          <div className="text-center mb-4">
                            <h4 className="text-xl font-bold text-gray-800 mb-2">
                              {plan.name}
                            </h4>
                            <div className="text-3xl font-bold text-purple-600 mb-1">
                              RWF {plan.price?.toLocaleString() || "Free"}
                            </div>
                            <div className="text-sm text-gray-500">
                              per month
                            </div>
                          </div>

                          <div className="space-y-3 mb-6">
                            {plan.features?.map((feature, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3"
                              >
                                <BiCheck className="text-green-500 text-lg flex-shrink-0" />
                                <span className="text-sm text-gray-700">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => handleUpgradeAccount(plan.id)}
                            disabled={createCheckoutMutation.isPending}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {createCheckoutMutation.isPending ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                <BiUpArrow className="text-sm" />
                                Upgrade to {plan.name}
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Account Actions
                    </h3>
                    <div className="space-y-4">
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
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {changePasswordMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Changing...
                    </>
                  ) : (
                    <>
                      <BiCheck />
                      Change Password
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={changePasswordMutation.isPending}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
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
