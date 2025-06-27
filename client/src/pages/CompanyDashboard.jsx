import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  getCompanyProfile, 
  updateCompanyProfile, 
  getCompanyJobs, 
  getCompanyStats 
} from "../store/slices/companySlice";
import { 
  BiBuilding, 
  BiUser, 
  BiTrendingUp, 
  BiLoader, 
  BiEdit, 
  BiSave, 
  BiPlus,
  BiMapPin,
  BiPhone,
  BiGlobe,
  BiCalendar,
  BiMoney,
  BiGroup,
  BiEnvelope
} from "react-icons/bi";
import { HiBriefcase } from "react-icons/hi";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const CompanyDashboard = () => {
  const dispatch = useDispatch();
  const { profile, jobs, stats, loading, actionLoading } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    location: "",
    about: "",
    industry: "",
    companySize: "",
    website: "",
    foundedYear: "",
  });

  useEffect(() => {
    dispatch(getCompanyProfile());
    dispatch(getCompanyJobs());
    dispatch(getCompanyStats());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        contact: profile.contact || "",
        location: profile.location || "",
        about: profile.about || "",
        industry: profile.industry || "",
        companySize: profile.companySize || "",
        website: profile.website || "",
        foundedYear: profile.foundedYear || "",
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
      await dispatch(updateCompanyProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 pt-24 flex items-center justify-center">
        <div className="text-center">
          <BiLoader className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {profile?.profileUrl ? (
                  <img
                    src={profile.profileUrl}
                    alt="Company Logo"
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  <BiBuilding className="text-3xl" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {profile?.name || "Company Name"}
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <BiMapPin className="text-sm" />
                  {profile?.location || "Location not set"}
                </p>
                <p className="text-purple-600 font-medium mt-1">
                  {profile?.industry || "Industry not specified"}
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
                    disabled={actionLoading.profile}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading.profile ? <BiLoader className="animate-spin" /> : <BiSave />}
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
              
              <Link
                to="/jobs/create"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <BiPlus className="text-sm" />
                Post Job
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <HiBriefcase className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Jobs</p>
                    <p className="text-2xl font-bold text-gray-800">{stats?.totalJobs || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <BiTrendingUp className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Active Jobs</p>
                    <p className="text-2xl font-bold text-gray-800">{stats?.activeJobs || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BiUser className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Applications</p>
                    <p className="text-2xl font-bold text-gray-800">{stats?.totalApplications || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <BiCalendar className="text-yellow-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Recent Apps</p>
                    <p className="text-2xl font-bold text-gray-800">{stats?.recentApplications || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Profile */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Company Information</h2>
              
              <div className="space-y-6">
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
              </div>
            </div>
          </div>

          {/* Quick Actions & Profile Progress */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Completion</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-purple-600">{stats?.profileCompletion || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats?.profileCompletion || 0}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Complete your profile to attract more candidates
              </p>
            </div>

            {/* Quick Contact Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <BiEnvelope className="text-purple-600" />
                  <span className="text-sm">{profile?.email || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <BiPhone className="text-purple-600" />
                  <span className="text-sm">{profile?.contact || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <BiGlobe className="text-purple-600" />
                  <span className="text-sm">{profile?.website || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <BiGroup className="text-purple-600" />
                  <span className="text-sm">{profile?.companySize || "Not specified"}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/jobs/create"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <BiPlus />
                  Post New Job
                </Link>
                <Link
                  to="/jobs"
                  className="w-full border border-purple-600 text-purple-600 py-3 px-4 rounded-lg font-medium hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
                >
                  <HiBriefcase />
                  View All Jobs
                </Link>
                <Link
                  to="/settings"
                  className="w-full border border-gray-300 text-gray-600 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <BiEdit />
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard; 