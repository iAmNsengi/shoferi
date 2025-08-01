import React, { useState } from "react";
import { useAuthStore } from "../store";
import { useAdminDashboard, useAdminStats } from "../hooks/useQueries";
import {
  BiBuilding,
  BiBriefcase,
  BiCar,
  BiTrendingUp,
  BiStats,
  BiRefresh,
  BiBarChart,
  BiPieChart,
  BiLineChart,
  BiCog,
  BiDownload,
  BiUser,
} from "react-icons/bi";
import { HiOutlineCurrencyDollar } from "react-icons/hi";

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("7d");

  // Use React Query hooks
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    refetch: refetchDashboard,
  } = useAdminDashboard();
  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useAdminStats();

  const stats = statsData?.data || {};
  const dashboard = dashboardData?.data || {};

  const tabs = [
    { id: "overview", label: "Overview", icon: BiStats },
    { id: "users", label: "Users", icon: BiUser },
    { id: "companies", label: "Companies", icon: BiBuilding },
    { id: "jobs", label: "Jobs", icon: BiBriefcase },
    { id: "bookings", label: "Bookings", icon: BiCar },
    { id: "analytics", label: "Analytics", icon: BiBarChart },
    { id: "reports", label: "Reports", icon: BiDownload },
    { id: "settings", label: "Settings", icon: BiCog },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-RW").format(num);
  };

  // Handle refresh button
  const handleRefresh = () => {
    if (activeTab === "overview") {
      refetchDashboard();
      refetchStats();
    }
  };

  const isLoading = dashboardLoading || statsLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {user?.firstName}! Monitor and manage your
                platform
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-green-200 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <BiRefresh
                  className={`text-lg ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === id
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="text-lg" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatNumber(stats?.totalUsers || 0)}
                    </p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <BiTrendingUp className="text-lg" />+
                      {stats?.newUsersThisWeek || 0} this week
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <BiUser className="text-2xl text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Companies</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatNumber(stats?.totalCompanies || 0)}
                    </p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <BiTrendingUp className="text-lg" />+
                      {stats?.newCompaniesThisWeek || 0} this week
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <BiBuilding className="text-2xl text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Jobs</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatNumber(stats?.totalJobs || 0)}
                    </p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <BiTrendingUp className="text-lg" />+
                      {stats?.newJobsThisWeek || 0} this week
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <BiBriefcase className="text-2xl text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {formatCurrency(stats?.totalRevenue || 0)}
                    </p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <BiTrendingUp className="text-lg" />+
                      {formatCurrency(stats?.revenueThisWeek || 0)} this week
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <HiOutlineCurrencyDollar className="text-2xl text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  User Growth
                </h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BiBarChart className="text-4xl mx-auto mb-2" />
                    <p>Chart will be implemented with Chart.js</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Revenue Trend
                </h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BiLineChart className="text-4xl mx-auto mb-2" />
                    <p>Chart will be implemented with Chart.js</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              User Management
            </h3>
            <div className="text-center py-12 text-gray-500">
              <BiUser className="text-4xl mx-auto mb-2" />
              <p>User management interface will be implemented</p>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  User Demographics
                </h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BiPieChart className="text-4xl mx-auto mb-2" />
                    <p>Pie chart will be implemented</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Platform Usage
                </h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BiBarChart className="text-4xl mx-auto mb-2" />
                    <p>Bar chart will be implemented</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              System Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Maintenance Mode</p>
                  <p className="text-sm text-gray-600">
                    Temporarily disable the platform
                  </p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Enable
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">
                    Email Notifications
                  </p>
                  <p className="text-sm text-gray-600">
                    System notification settings
                  </p>
                </div>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Configure
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Backup & Restore</p>
                  <p className="text-sm text-gray-600">
                    Database backup settings
                  </p>
                </div>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Manage
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
