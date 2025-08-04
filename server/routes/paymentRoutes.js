import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  initiatePayment,
  getPaymentHistory,
  getDriverEarnings,
  refundPayment,
  paymentWebhook,
} from "../controllers/paymentController.js";

const router = express.Router();

// Payment processing routes
router.post("/initiate", isAuthenticated, initiatePayment);
router.get("/history", isAuthenticated, getPaymentHistory);
router.get("/earnings", isAuthenticated, getDriverEarnings);
router.post("/:paymentId/refund", isAuthenticated, refundPayment);

// Webhook endpoint (no auth required for external payment providers)
router.post("/webhook", paymentWebhook);

export default router;
