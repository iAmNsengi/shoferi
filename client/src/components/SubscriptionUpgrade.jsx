import React, { useState } from "react";
import { BiCheck, BiX, BiStar } from "react-icons/bi";
import { useAuth } from "../contexts/AuthContext";
import {
  useSubscriptionPlans,
  useCreateCheckoutSession,
  useCurrentSubscription,
} from "../hooks/useQueries";
import { toast } from "react-hot-toast";

const SubscriptionUpgrade = () => {
  const { user, usageStats, canPerformAction, getTierLimits } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const { data: plansData } = useSubscriptionPlans();
  const { data: currentSubscription } = useCurrentSubscription();
  const createCheckoutMutation = useCreateCheckoutSession();

  const plans = plansData?.data?.plans || [
    {
      id: "starter",
      name: "STARTER",
      price: 0,
      features: [
        "1 job post per month",
        "1 job application per month",
        "Basic profile",
        "Community access",
      ],
      limits: {
        jobsPosted: 1,
        jobsApplied: 1,
        postsCreated: 0,
        commentsPosted: 0,
      },
    },
    {
      id: "pro",
      name: "PRO",
      price: 9900,
      features: [
        "10 job posts per month",
        "10 job applications per month",
        "Create feed posts",
        "Comment on posts",
        "Verification badge",
        "Priority support",
      ],
      limits: {
        jobsPosted: 10,
        jobsApplied: 10,
        postsCreated: -1, // unlimited
        commentsPosted: -1, // unlimited
      },
    },
    {
      id: "enterprise",
      name: "ENTERPRISE",
      price: 29900,
      features: [
        "Unlimited job posts",
        "Unlimited job applications",
        "Unlimited feed posts",
        "Advanced analytics",
        "Priority verification",
        "Dedicated support",
        "Custom branding",
      ],
      limits: {
        jobsPosted: -1, // unlimited
        jobsApplied: -1, // unlimited
        postsCreated: -1, // unlimited
        commentsPosted: -1, // unlimited
      },
    },
  ];

  const handleUpgrade = async (planId) => {
    if (!user) {
      toast.error("Please log in to upgrade your account");
      return;
    }

    try {
      await createCheckoutMutation.mutateAsync(planId);
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  const getCurrentUsage = (action) => {
    if (!usageStats) return 0;

    switch (action) {
      case "jobsPosted":
        return usageStats.jobsPosted || 0;
      case "jobsApplied":
        return usageStats.jobsApplied || 0;
      case "postsCreated":
        return usageStats.postsCreated || 0;
      case "commentsPosted":
        return usageStats.commentsPosted || 0;
      default:
        return 0;
    }
  };

  const getLimit = (plan, action) => {
    const limit = plan.limits[action];
    return limit === -1 ? "Unlimited" : limit;
  };

  const getUsagePercentage = (action) => {
    const current = getCurrentUsage(action);
    const plan = plans.find((p) => p.id === user?.accountTier?.toLowerCase());
    if (!plan) return 0;

    const limit = plan.limits[action];
    if (limit === -1) return 0; // unlimited
    return Math.min((current / limit) * 100, 100);
  };

  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Upgrade Your Account</h3>
        <p className="text-gray-600 mb-6">
          Please log in to view subscription options
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Upgrade Your Account</h3>
        <p className="text-gray-600">Choose the perfect plan for your needs</p>
      </div>

      {/* Current Usage Stats */}
      {usageStats && (
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h4 className="font-semibold mb-4">Current Usage (This Month)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Jobs Posted</span>
                <span className="text-sm font-medium">
                  {getCurrentUsage("jobsPosted")}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${getUsagePercentage("jobsPosted")}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Job Applications</span>
                <span className="text-sm font-medium">
                  {getCurrentUsage("jobsApplied")}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${getUsagePercentage("jobsApplied")}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Feed Posts</span>
                <span className="text-sm font-medium">
                  {getCurrentUsage("postsCreated")}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${getUsagePercentage("postsCreated")}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Comments</span>
                <span className="text-sm font-medium">
                  {getCurrentUsage("commentsPosted")}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${getUsagePercentage("commentsPosted")}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = user.accountTier === plan.name;
          const isSelected = selectedPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 border-2 transition-all cursor-pointer ${
                isCurrentPlan
                  ? "border-purple-500 bg-purple-50"
                  : isSelected
                  ? "border-purple-500 bg-white shadow-lg"
                  : "border-gray-200 bg-white hover:border-purple-300"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
                <div className="text-3xl font-bold mb-1">
                  {plan.price === 0
                    ? "Free"
                    : `RWF ${plan.price.toLocaleString()}`}
                </div>
                <div className="text-sm text-gray-500">per month</div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <BiCheck className="text-green-500 text-lg flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6">
                <div className="text-xs font-medium text-gray-600 mb-2">
                  Monthly Limits:
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Jobs Posted:</span>
                    <span className="font-medium">
                      {getLimit(plan, "jobsPosted")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Job Applications:</span>
                    <span className="font-medium">
                      {getLimit(plan, "jobsApplied")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Feed Posts:</span>
                    <span className="font-medium">
                      {getLimit(plan, "postsCreated")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comments:</span>
                    <span className="font-medium">
                      {getLimit(plan, "commentsPosted")}
                    </span>
                  </div>
                </div>
              </div>

              {!isCurrentPlan && (
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={createCheckoutMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {createCheckoutMutation.isPending
                    ? "Processing..."
                    : "Upgrade"}
                </button>
              )}

              {isCurrentPlan && (
                <div className="w-full bg-gray-100 text-gray-600 py-3 rounded-lg font-semibold text-center">
                  Current Plan
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current Subscription Info */}
      {currentSubscription?.data && (
        <div className="mt-8 p-6 bg-blue-50 rounded-xl">
          <h4 className="font-semibold mb-4">Current Subscription</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Status:</span>
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
              <span className="text-gray-600">Plan:</span>
              <span className="ml-2 font-medium">
                {currentSubscription.data.planId}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Next billing:</span>
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
  );
};

export default SubscriptionUpgrade;
