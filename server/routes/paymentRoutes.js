import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  initiatePayment,
  getPaymentHistory,
  getDriverEarnings,
  refundPayment,
  paymentWebhook,
} from "../controllers/paymentController.js";

const router = express.Router();

// Payment processing routes
router.post("/initiate", userAuth, initiatePayment);
router.get("/history", userAuth, getPaymentHistory);
router.get("/earnings", userAuth, getDriverEarnings);
router.post("/:paymentId/refund", userAuth, refundPayment);

// Webhook endpoint (no auth required for external payment providers)
router.post("/webhook", paymentWebhook);

export default router;
