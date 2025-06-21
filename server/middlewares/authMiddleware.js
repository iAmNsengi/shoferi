import JWT from "jsonwebtoken";

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

export default userAuth;
