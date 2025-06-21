import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  getUser,
  updateUser,
  getUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

// GET current user profile (authenticated)
router.get("/get-user", userAuth, getUserProfile);

// GET user by ID
router.get("/:id", getUser);

// UPDATE USER || PUT
router.put("/update-user", userAuth, updateUser);

export default router;
