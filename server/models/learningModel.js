import mongoose from "mongoose";

const learningSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "driving_tips",
        "safety",
        "regulations",
        "technology",
        "business",
        "general",
      ],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    media: {
      images: [
        {
          type: String, // URLs to images
        },
      ],
      videos: [
        {
          type: String, // URLs to videos
        },
      ],
      documents: [
        {
          type: String, // URLs to PDFs or other documents
        },
      ],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        maxlength: 30,
      },
    ],
    estimatedReadTime: {
      type: Number, // in minutes
      default: 5,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    shareCount: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
    },
    seo: {
      metaTitle: {
        type: String,
        maxlength: 60,
      },
      metaDescription: {
        type: String,
        maxlength: 160,
      },
      keywords: [
        {
          type: String,
        },
      ],
    },
  },
  { timestamps: true }
);

// Index for better query performance
learningSchema.index({ category: 1, isPublished: 1, createdAt: -1 });
learningSchema.index({ tags: 1 });
learningSchema.index({ isFeatured: 1, isPublished: 1 });

// Method to publish content
learningSchema.methods.publish = function () {
  this.isPublished = true;
  this.publishedAt = new Date();
  return this.save();
};

// Method to unpublish content
learningSchema.methods.unpublish = function () {
  this.isPublished = false;
  this.publishedAt = null;
  return this.save();
};

// Method to increment view count
learningSchema.methods.incrementView = function () {
  this.viewCount += 1;
  return this.save();
};

// Method to increment like count
learningSchema.methods.incrementLike = function () {
  this.likeCount += 1;
  return this.save();
};

// Method to increment share count
learningSchema.methods.incrementShare = function () {
  this.shareCount += 1;
  return this.save();
};

const Learning = mongoose.model("Learning", learningSchema);

export default Learning;
