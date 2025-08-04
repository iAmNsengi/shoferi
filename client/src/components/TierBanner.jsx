import React, { useState } from "react";
import { BiStar, BiUpArrow, BiX } from "react-icons/bi";
import { useAuth } from "../contexts/AuthContext";
import { useCreateCheckoutSession } from "../hooks/useQueries";
import { toast } from "react-hot-toast";

const TierBanner = ({
  show = true,
  onClose,
  className = "",
  variant = "red", // red, blue, purple
}) => {
  const { user, canPerformAction } = useAuth();
  const createCheckoutMutation = useCreateCheckoutSession();
  const [isVisible, setIsVisible] = useState(show);

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
    if (onClose) onClose();
  };

  if (!isVisible || !isFreeTier) return null;

  const variants = {
    red: "bg-gradient-to-r from-red-500 to-red-600",
    blue: "bg-gradient-to-r from-blue-500 to-blue-600",
    purple: "bg-gradient-to-r from-purple-500 to-purple-600",
    green: "bg-gradient-to-r from-green-500 to-green-600",
  };

  const buttonVariants = {
    red: "bg-white text-red-600 hover:bg-gray-100",
    blue: "bg-white text-blue-600 hover:bg-gray-100",
    purple: "bg-white text-purple-600 hover:bg-gray-100",
    green: "bg-white text-green-600 hover:bg-gray-100",
  };

  return (
    <div className={`${variants[variant]} text-white px-4 py-3 ${className}`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BiStar className="text-xl" />
          <div>
            <h3 className="font-semibold">Upgrade to PRO for More Features!</h3>
            <p className="text-sm opacity-90">
              You're currently on the free tier. Upgrade to PRO for unlimited
              job posts, feed access, and more!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleUpgrade}
            disabled={createCheckoutMutation.isPending}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2 ${buttonVariants[variant]}`}
          >
            <BiUpArrow className="text-sm" />
            {createCheckoutMutation.isPending ? "Processing..." : "Upgrade Now"}
          </button>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <BiX className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TierBanner;
