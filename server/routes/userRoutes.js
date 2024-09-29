import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import { getUser, updateUser } from "../controllers/userController.js";

const router = express.Router();

// GET user
router.get("/:id", getUser);

// UPDATE USER || PUT
router.put("/:id", userAuth, updateUser);

export default router;
