import Payments from "../models/paymentModel.js";
import Bookings from "../models/bookingModel.js";
import { StatusCodes } from "http-status-codes";

export const initiatePayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, paymentProvider, paymentDetails } =
      req.body;

    // Verify booking exists and belongs to user
    const booking = await Bookings.findById(bookingId).populate("driver");
    if (!booking) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user.userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized to pay for this booking",
      });
    }

    if (booking.paymentStatus === "completed") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Payment already completed for this booking",
      });
    }

    // Calculate fees
    const amount = booking.totalPrice;
    const platformFee = Math.round(amount * 0.05); // 5% platform fee
    const paymentProcessingFee = Math.round(amount * 0.02); // 2% processing fee
    const driverCommission = amount - platformFee - paymentProcessingFee;

    // Create payment record
    const payment = await Payments.create({
      booking: bookingId,
      user: req.user.userId,
      driver: booking.driver._id,
      amount,
      paymentMethod,
      paymentProvider,
      paymentDetails,
      fees: {
        platformFee,
        paymentProcessingFee,
        driverCommission,
      },
    });

    // Process payment based on method
    let paymentResult;
    switch (paymentMethod) {
      case "mobile_money":
        paymentResult = await processMobileMoneyPayment(
          payment,
          paymentDetails
        );
        break;
      case "credit_card":
        paymentResult = await processCreditCardPayment(payment, paymentDetails);
        break;
      case "cash":
        paymentResult = await processCashPayment(payment);
        break;
      default:
        throw new Error("Unsupported payment method");
    }

    // Update payment status
    payment.status = paymentResult.status;
    payment.externalTransactionId = paymentResult.externalTransactionId;
    if (paymentResult.status === "completed") {
      payment.metadata.completedAt = new Date();
      // Update booking payment status
      booking.paymentStatus = "completed";
      await booking.save();
    }
    await payment.save();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Payment initiated successfully",
      payment: {
        transactionId: payment.transactionId,
        status: payment.status,
        amount: payment.amount,
        fees: payment.fees,
      },
      paymentResult,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error initiating payment",
      error: error.message,
    });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const query = { user: req.user.userId };
    if (status) {
      query.status = status;
    }

    const payments = await Payments.find(query)
      .populate("booking", "pickupLocation dropoffLocation startDate endDate")
      .populate("driver", "user")
      .populate({
        path: "driver",
        populate: {
          path: "user",
          select: "firstName lastName",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payments.countDocuments(query);

    res.status(StatusCodes.OK).json({
      success: true,
      count: payments.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      payments,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching payment history",
      error: error.message,
    });
  }
};

export const getDriverEarnings = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Find driver profile
    const Drivers = (await import("../models/driverModel.js")).default;
    const driver = await Drivers.findOne({ user: req.user.userId });
    if (!driver) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Driver profile not found",
      });
    }

    const query = {
      driver: driver._id,
      status: "completed",
    };

    // Add date range filter if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const earnings = await Payments.find(query)
      .populate("booking", "pickupLocation dropoffLocation startDate endDate")
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payments.countDocuments(query);

    // Calculate summary statistics
    const summary = await Payments.aggregate([
      { $match: { ...query } },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$fees.driverCommission" },
          totalTrips: { $sum: 1 },
          totalGrossAmount: { $sum: "$amount" },
          totalPlatformFees: { $sum: "$fees.platformFee" },
          totalProcessingFees: { $sum: "$fees.paymentProcessingFee" },
        },
      },
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      count: earnings.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      summary: summary[0] || {
        totalEarnings: 0,
        totalTrips: 0,
        totalGrossAmount: 0,
        totalPlatformFees: 0,
        totalProcessingFees: 0,
      },
      earnings,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error fetching driver earnings",
      error: error.message,
    });
  }
};

export const refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { reason } = req.body;

    const payment = await Payments.findById(paymentId).populate("booking");
    if (!payment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.status !== "completed") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Only completed payments can be refunded",
      });
    }

    // Process refund based on original payment method
    let refundResult;
    switch (payment.paymentMethod) {
      case "mobile_money":
        refundResult = await processMobileMoneyRefund(payment);
        break;
      case "credit_card":
        refundResult = await processCreditCardRefund(payment);
        break;
      case "cash":
        refundResult = {
          status: "refunded",
          message: "Cash refund processed manually",
        };
        break;
      default:
        throw new Error("Unsupported payment method for refund");
    }

    // Update payment status
    payment.status = "refunded";
    payment.metadata.refundedAt = new Date();
    payment.metadata.refundReason = reason;
    await payment.save();

    // Update booking payment status
    const booking = await Bookings.findById(payment.booking);
    booking.paymentStatus = "refunded";
    await booking.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Payment refunded successfully",
      refundResult,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error processing refund",
      error: error.message,
    });
  }
};

export const paymentWebhook = async (req, res) => {
  try {
    const { event, data, transactionId } = req.body;

    // Find payment by transaction ID
    const payment = await Payments.findOne({
      $or: [{ transactionId }, { externalTransactionId: transactionId }],
    });

    if (!payment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Add webhook event to payment record
    payment.webhookEvents.push({
      event,
      data,
      receivedAt: new Date(),
    });

    // Update payment status based on webhook
    switch (event) {
      case "payment.completed":
        payment.status = "completed";
        payment.metadata.completedAt = new Date();

        // Update booking payment status
        const booking = await Bookings.findById(payment.booking);
        booking.paymentStatus = "completed";
        await booking.save();
        break;

      case "payment.failed":
        payment.status = "failed";
        payment.metadata.failureReason = data.reason || "Payment failed";
        break;

      case "payment.cancelled":
        payment.status = "cancelled";
        break;
    }

    await payment.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error processing webhook",
      error: error.message,
    });
  }
};

// Helper functions for payment processing
async function processMobileMoneyPayment(payment, paymentDetails) {
  // This would integrate with MTN MoMo, Airtel Money, etc.
  // For demo purposes, we'll simulate the process

  const { phoneNumber } = paymentDetails;

  // Simulate API call to mobile money provider
  const isValidPhoneNumber = /^(\+?25)?(078|079|072|073)\d{7}$/.test(
    phoneNumber
  );

  if (!isValidPhoneNumber) {
    throw new Error("Invalid phone number format");
  }

  // Simulate processing delay and result
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      resolve({
        status: success ? "completed" : "failed",
        externalTransactionId: `MOMO_${Date.now()}`,
        message: success ? "Payment completed successfully" : "Payment failed",
      });
    }, 2000);
  });
}

async function processCreditCardPayment(payment, paymentDetails) {
  // This would integrate with Stripe, PayPal, etc.
  // For demo purposes, we'll simulate the process

  return {
    status: "processing",
    externalTransactionId: `CARD_${Date.now()}`,
    message: "Payment is being processed",
  };
}

async function processCashPayment(payment) {
  // Cash payments are marked as pending until driver confirms receipt
  return {
    status: "pending",
    externalTransactionId: `CASH_${Date.now()}`,
    message: "Cash payment pending driver confirmation",
  };
}

async function processMobileMoneyRefund(payment) {
  // Simulate refund process
  return {
    status: "refunded",
    message: "Mobile money refund processed",
  };
}

async function processCreditCardRefund(payment) {
  // Simulate refund process
  return {
    status: "refunded",
    message: "Credit card refund processed",
  };
}
