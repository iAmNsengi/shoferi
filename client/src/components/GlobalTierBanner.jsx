import React, { useState } from "react";
import { BiStar, BiUpArrow, BiX } from "react-icons/bi";
import { useAuth } from "../contexts/AuthContext";
import { useCreateCheckoutSession } from "../hooks/useQueries";
import { toast } from "react-hot-toast";

const GlobalTierBanner = () => {
  const { user, isAuthenticated } = useAuth();
  const createCheckoutMutation = useCreateCheckoutSession();
  const [isVisible, setIsVisible] = useState(true);

  const isFreeTier = user?.accountTier === "STARTER" || !user?.accountTier;

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Please log in to upgrade your account");
      return;
    }

    try {
      await createCheckoutMutation.mutateAsync("pro");
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to initiate upgrade. Please try again.");
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  // Only show for free tier users who are authenticated
  if (!isVisible || !isAuthenticated || !isFreeTier) return null;

  return (
    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 w-screen ">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BiStar className="text-lg" />
          <div>
            <h3 className="font-semibold text-sm">
              Upgrade to PRO for More Features!
            </h3>
            <p className="text-xs opacity-90">
              Unlock unlimited job posts, feed access, and more for just RWF
              3,000/month
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleUpgrade}
            disabled={createCheckoutMutation.isPending}
            className="bg-white text-red-600 px-3 py-1 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center gap-1 text-sm"
          >
            <BiUpArrow className="text-xs" />
            {createCheckoutMutation.isPending ? "Processing..." : "Upgrade Now"}
          </button>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <BiX className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalTierBanner;
