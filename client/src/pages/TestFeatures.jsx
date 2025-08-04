import React, { useState } from "react";
import { BiTestTube, BiCheck, BiX, BiInfoCircle } from "react-icons/bi";
import { useAuth } from "../contexts/AuthContext";
import SubscriptionUpgrade from "../components/SubscriptionUpgrade";
import AccountDeletion from "../components/AccountDeletion";
import {
  useFeedPosts,
  useCreatePost,
  useLearningMaterials,
  useCreateLearning,
  useSubscriptionPlans,
  useCurrentSubscription,
} from "../hooks/useQueries";

const TestFeatures = () => {
  const { user, canPerformAction, getTierLimits, usageStats } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Test queries
  const { data: feedData } = useFeedPosts();
  const { data: learningData } = useLearningMaterials();
  const { data: plansData } = useSubscriptionPlans();
  const { data: subscriptionData } = useCurrentSubscription();

  const tabs = [
    { id: "overview", label: "Overview", icon: BiInfoCircle },
    { id: "subscription", label: "Subscription", icon: BiCheck },
    { id: "deletion", label: "Account Deletion", icon: BiX },
  ];

  const testActions = [
    {
      action: "post_job",
      label: "Post Job",
      description: "Create a new job posting",
    },
    {
      action: "apply_job",
      label: "Apply for Job",
      description: "Submit a job application",
    },
    {
      action: "create_post",
      label: "Create Feed Post",
      description: "Create a social feed post",
    },
    {
      action: "comment_post",
      label: "Comment on Post",
      description: "Add a comment to a feed post",
    },
    {
      action: "access_driver_profiles",
      label: "Access Driver Profiles",
      description: "View driver profiles",
    },
    {
      action: "verification_badge",
      label: "Verification Badge",
      description: "Get verified badge",
    },
  ];

  const getActionStatus = (action) => {
    if (!user) return { allowed: false, reason: "Not logged in" };

    const canPerform = canPerformAction(action);
    const limits = getTierLimits(action);
    const currentLimit = limits[user?.accountTier] || "Not available";

    return {
      allowed: canPerform,
      reason: canPerform
        ? "Allowed"
        : `Not available for ${user?.accountTier} tier`,
      limit: currentLimit,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BiTestTube className="text-3xl text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Feature Test Dashboard
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Test and explore all the new backend features including tier-based
            permissions, feed functionality, learning materials, and
            subscription management.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm p-2 mb-8">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="text-lg" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* User Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">User Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Account Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>{" "}
                      <span className="font-medium">
                        {user?.name || "Not logged in"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>{" "}
                      <span className="font-medium">
                        {user?.email || "Not logged in"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Account Type:</span>{" "}
                      <span className="font-medium">
                        {user?.accountType || "Not logged in"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Account Tier:</span>{" "}
                      <span className="font-medium">
                        {user?.accountTier || "Not logged in"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Verified:</span>{" "}
                      <span className="font-medium">
                        {user?.isVerified ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Usage Statistics
                  </h3>
                  {usageStats ? (
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Jobs Posted:</span>{" "}
                        <span className="font-medium">
                          {usageStats.jobsPosted || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Jobs Applied:</span>{" "}
                        <span className="font-medium">
                          {usageStats.jobsApplied || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Posts Created:</span>{" "}
                        <span className="font-medium">
                          {usageStats.postsCreated || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Comments Posted:</span>{" "}
                        <span className="font-medium">
                          {usageStats.commentsPosted || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Reset:</span>{" "}
                        <span className="font-medium">
                          {new Date(
                            usageStats.lastResetDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No usage data available
                    </p>
                  )}
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Subscription
                  </h3>
                  {subscriptionData?.data ? (
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Status:</span>{" "}
                        <span className="font-medium">
                          {subscriptionData.data.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Plan:</span>{" "}
                        <span className="font-medium">
                          {subscriptionData.data.planId}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Next Billing:</span>{" "}
                        <span className="font-medium">
                          {new Date(
                            subscriptionData.data.currentPeriodEnd
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No active subscription
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Permissions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">Action Permissions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testActions.map((testAction) => {
                  const status = getActionStatus(testAction.action);
                  return (
                    <div
                      key={testAction.action}
                      className={`p-4 rounded-xl border-2 ${
                        status.allowed
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">
                          {testAction.label}
                        </h3>
                        {status.allowed ? (
                          <BiCheck className="text-green-500 text-xl" />
                        ) : (
                          <BiX className="text-red-500 text-xl" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {testAction.description}
                      </p>
                      <div className="text-xs">
                        <div className="font-medium text-gray-700">
                          Status: {status.reason}
                        </div>
                        <div className="text-gray-600">
                          Limit: {status.limit}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* API Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Feed Data */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Feed Data</h2>
                {feedData ? (
                  <div className="space-y-4">
                    <div className="text-sm">
                      <span className="text-gray-600">Total Posts:</span>{" "}
                      <span className="font-medium">
                        {feedData.data?.posts?.length || 0}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Status:</span>{" "}
                      <span className="font-medium text-green-600">
                        Connected
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No feed data available
                  </p>
                )}
              </div>

              {/* Learning Data */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Learning Data</h2>
                {learningData ? (
                  <div className="space-y-4">
                    <div className="text-sm">
                      <span className="text-gray-600">Total Materials:</span>{" "}
                      <span className="font-medium">
                        {learningData.data?.materials?.length || 0}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Status:</span>{" "}
                      <span className="font-medium text-green-600">
                        Connected
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No learning data available
                  </p>
                )}
              </div>
            </div>

            {/* Subscription Plans */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
              {plansData?.data?.plans ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plansData.data.plans.map((plan) => (
                    <div
                      key={plan.id}
                      className="p-4 border border-gray-200 rounded-xl"
                    >
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {plan.name}
                      </h3>
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="text-gray-600">Price:</span>{" "}
                          <span className="font-medium">RWF {plan.price}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Interval:</span>{" "}
                          <span className="font-medium">{plan.interval}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Features:</span>{" "}
                          <span className="font-medium">
                            {plan.features?.length || 0} features
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No subscription plans available
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === "subscription" && <SubscriptionUpgrade />}

        {activeTab === "deletion" && <AccountDeletion />}
      </div>
    </div>
  );
};

export default TestFeatures;
