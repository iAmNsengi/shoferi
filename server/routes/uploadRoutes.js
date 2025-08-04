import express from "express";
import multer from "multer";
import userAuth from "../middlewares/authMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Configure multer for memory storage (for Cloudinary)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only images and PDFs are allowed."),
        false
      );
    }
  },
});

// Profile image upload route
router.post(
  "/profile-image",
  userAuth,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // Convert buffer to base64 for Cloudinary
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "shoferi/profile-images",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto" },
        ],
      });

      res.status(200).json({
        success: true,
        message: "Profile image uploaded successfully",
        profileUrl: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error("Profile image upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload profile image",
      });
    }
  }
);

// CV upload route
router.post("/cv", userAuth, upload.single("cv"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No CV file uploaded",
      });
    }

    // Convert buffer to base64 for Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "shoferi/cv",
      resource_type: "auto",
    });

    res.status(200).json({
      success: true,
      message: "CV uploaded successfully",
      cvUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("CV upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload CV",
    });
  }
});

// Generic file upload route
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Convert buffer to base64 for Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "shoferi/general",
      resource_type: "auto",
    });

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      fileUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload file",
    });
  }
});

export default router;
