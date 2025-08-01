import JWT from "jsonwebtoken";
import Users from "../models/userModel.js";
import Companies from "../models/companiesModel.js";

const userAuth = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    return res.status(401).json({
      success: false,
      message: "No token provided or invalid format",
    });
  }

  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);

    req.user = {
      userId: userToken.userId,
    };

    next();
  } catch (error) {
    console.log("JWT verification error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const { userId } = req.user;

    // Check if user exists and is admin
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.accountType !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error checking admin privileges",
    });
  }
};

// Check if user is authenticated (alias for userAuth)
const isAuthenticated = userAuth;

export { userAuth as default, isAuthenticated, isAdmin };
