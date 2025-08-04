import JWT from "jsonwebtoken";
import Users from "../models/userModel.js";
import { StatusCodes } from "http-status-codes";

// Middleware to check if user is authenticated
export const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authentication invalid",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET_KEY);
    const { userId } = payload;
    const user = await Users.findById(userId).select("-password");
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Authentication invalid",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authentication invalid",
    });
  }
};

// Middleware to check if user is admin
export const isAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.accountType !== "admin") {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

// Middleware to check if user can perform specific actions based on tier
export const checkPermission = (action) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Admin can perform all actions
    if (req.user.accountType === "admin") {
      return next();
    }

    // Check if user can perform the action based on their tier
    const canPerform = req.user.canPerformAction(action);

    if (!canPerform) {
      const tierLimits = {
        post_job: {
          STARTER: "1 job per month",
          PRO: "10 jobs per month",
          ENTERPRISE: "Unlimited",
        },
        apply_job: {
          STARTER: "1 application per month",
          PRO: "10 applications per month",
          ENTERPRISE: "Unlimited",
        },
        create_post: {
          STARTER: "Not available",
          PRO: "Available",
          ENTERPRISE: "Available",
        },
        comment_post: {
          STARTER: "Not available",
          PRO: "Available",
          ENTERPRISE: "Available",
        },
      };

      const currentLimit =
        tierLimits[action]?.[req.user.accountTier] || "Not available";

      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: `Action not allowed for ${req.user.accountTier} tier. Current limit: ${currentLimit}`,
        currentTier: req.user.accountTier,
        action: action,
        limit: currentLimit,
      });
    }

    next();
  };
};

// Middleware to check if user has verification badge
export const requireVerification = async (req, res, next) => {
  if (!req.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!req.user.isVerified) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "Verification badge required for this action",
    });
  }

  next();
};

// Middleware to track usage after action
export const trackUsage = (action) => {
  return async (req, res, next) => {
    try {
      // Increment usage after successful action
      await req.user.incrementUsage(action);
      next();
    } catch (error) {
      console.error("Error tracking usage:", error);
      next(); // Continue even if tracking fails
    }
  };
};
