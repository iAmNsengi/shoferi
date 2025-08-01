import express from "express";

import authRoute from "./authRoutes.js";
import userRoute from "./userRoutes.js";
import companyRoute from "./companiesRoutes.js";
import jobRoute from "./jobsRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import driverRoutes from "./driverRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import adminRoutes from "./adminRoutes.js";
import messageRoutes from "./messageRoutes.js";
import notificationRoutes from "./notificationRoutes.js";

const router = express.Router();

const path = "/api-v1/";

router.use(`${path}auth`, authRoute); //api-v1/auth/
router.use(`${path}users`, userRoute);
router.use(`${path}companies`, companyRoute);

router.use(`${path}jobs`, jobRoute);
router.use(`${path}upload`, uploadRoutes);
router.use(`${path}drivers`, driverRoutes);
router.use(`${path}bookings`, bookingRoutes);
router.use(`${path}payments`, paymentRoutes);
router.use(`${path}admin`, adminRoutes);
router.use(`${path}messages`, messageRoutes);
router.use(`${path}notifications`, notificationRoutes);

export default router;
