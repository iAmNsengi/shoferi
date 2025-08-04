import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    replies: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
          required: true,
        },
        content: {
          type: String,
          required: true,
          maxlength: 500,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    media: [
      {
        type: String, // URLs to images/videos
        required: false,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    comments: [commentSchema],
    tags: [
      {
        type: String,
        maxlength: 20,
      },
    ],
    category: {
      type: String,
      enum: [
        "general",
        "job_related",
        "industry_news",
        "tips",
        "success_story",
      ],
      default: "general",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    shareCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ tags: 1 });

// Virtual for comment count
postSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// Virtual for like count
postSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// Method to add like
postSchema.methods.addLike = function (userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove like
postSchema.methods.removeLike = function (userId) {
  this.likes = this.likes.filter((id) => id.toString() !== userId.toString());
  return this.save();
};

// Method to add comment
postSchema.methods.addComment = function (authorId, content) {
  const comment = {
    author: authorId,
    content: content,
    likes: [],
    replies: [],
  };
  this.comments.push(comment);
  return this.save();
};

// Method to add reply to comment
postSchema.methods.addReply = function (commentId, authorId, content) {
  const comment = this.comments.id(commentId);
  if (comment) {
    comment.replies.push({
      author: authorId,
      content: content,
    });
    return this.save();
  }
  throw new Error("Comment not found");
};

const Feed = mongoose.model("Feed", postSchema);

export default Feed;
