import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Configure Cloudinary storage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "shoferi",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  },
});

// Configure multer
const upload = multer({
  storage: cloudinaryStorage,
  fileFilter: function (req, file, cb) {
    // Check file type
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif" ||
      file.mimetype === "application/pdf" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "application/msword"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const router = express.Router();

// Upload profile picture
router.post(
  "/profile-picture",
  isAuthenticated,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      res.status(200).json({
        success: true,
        message: "Profile picture uploaded successfully",
        data: {
          url: req.file.path,
          filename: req.file.filename,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message: "Error uploading file",
        error: error.message,
      });
    }
  }
);

// Upload CV
router.post("/cv", isAuthenticated, upload.single("cv"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    res.status(200).json({
      success: true,
      message: "CV uploaded successfully",
      data: {
        url: req.file.path,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message,
    });
  }
});

// Upload multiple images
router.post(
  "/images",
  isAuthenticated,
  upload.array("images", 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const uploadedFiles = req.files.map((file) => ({
        url: file.path,
        filename: file.filename,
      }));

      res.status(200).json({
        success: true,
        message: "Images uploaded successfully",
        data: uploadedFiles,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message: "Error uploading files",
        error: error.message,
      });
    }
  }
);

// Delete uploaded file
router.delete("/:filename", isAuthenticated, async (req, res) => {
  try {
    const { filename } = req.params;

    // Delete from Cloudinary
    const publicId = filename.split(".")[0];
    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting file",
      error: error.message,
    });
  }
});

export default router;
