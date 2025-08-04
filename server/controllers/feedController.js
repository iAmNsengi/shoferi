import Feed from "../models/feedModel.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../utils/apiResponse.js";

// Create a new post
export const createPost = async (req, res) => {
  const { content, media, tags, category, isPublic } = req.body;
  const author = req.user._id;

  if (!content || content.trim().length === 0) {
    throw new BadRequestError("Post content is required");
  }

  const post = await Feed.create({
    author,
    content,
    media: media || [],
    tags: tags || [],
    category: category || "general",
    isPublic: isPublic !== undefined ? isPublic : true,
  });

  await post.populate(
    "author",
    "firstName lastName profileUrl accountTier isVerified"
  );

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Post created successfully",
    data: post,
  });
};

// Get all posts (with pagination and filters)
export const getPosts = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    author,
    search,
    sortBy = "createdAt",
  } = req.query;
  const skip = (page - 1) * limit;

  const query = { isPublic: true };

  if (category) query.category = category;
  if (author) query.author = author;
  if (search) {
    query.$or = [
      { content: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortBy === "createdAt" ? -1 : 1;

  const posts = await Feed.find(query)
    .populate("author", "firstName lastName profileUrl accountTier isVerified")
    .populate("comments.author", "firstName lastName profileUrl")
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Feed.countDocuments(query);

  res.status(StatusCodes.OK).json({
    success: true,
    data: posts,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      hasNext: skip + posts.length < total,
      hasPrev: page > 1,
    },
  });
};

// Get a single post by ID
export const getPost = async (req, res) => {
  const { id } = req.params;

  const post = await Feed.findById(id)
    .populate("author", "firstName lastName profileUrl accountTier isVerified")
    .populate("comments.author", "firstName lastName profileUrl")
    .populate("comments.replies.author", "firstName lastName profileUrl");

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  // Increment view count
  await post.incrementView();

  res.status(StatusCodes.OK).json({
    success: true,
    data: post,
  });
};

// Update a post
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { content, media, tags, category, isPublic } = req.body;

  const post = await Feed.findById(id);

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  // Check if user is the author or admin
  if (
    post.author.toString() !== req.user._id.toString() &&
    req.user.accountType !== "admin"
  ) {
    throw new BadRequestError("You can only update your own posts");
  }

  const updatedPost = await Feed.findByIdAndUpdate(
    id,
    {
      content,
      media,
      tags,
      category,
      isPublic,
    },
    { new: true, runValidators: true }
  ).populate("author", "firstName lastName profileUrl accountTier isVerified");

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Post updated successfully",
    data: updatedPost,
  });
};

// Delete a post
export const deletePost = async (req, res) => {
  const { id } = req.params;

  const post = await Feed.findById(id);

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  // Check if user is the author or admin
  if (
    post.author.toString() !== req.user._id.toString() &&
    req.user.accountType !== "admin"
  ) {
    throw new BadRequestError("You can only delete your own posts");
  }

  await Feed.findByIdAndDelete(id);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Post deleted successfully",
  });
};

// Like/Unlike a post
export const toggleLike = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const post = await Feed.findById(id);

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  const isLiked = post.likes.includes(userId);

  if (isLiked) {
    await post.removeLike(userId);
  } else {
    await post.addLike(userId);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: isLiked ? "Post unliked" : "Post liked",
    data: { isLiked: !isLiked },
  });
};

// Add a comment to a post
export const addComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const authorId = req.user._id;

  if (!content || content.trim().length === 0) {
    throw new BadRequestError("Comment content is required");
  }

  const post = await Feed.findById(id);

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  await post.addComment(authorId, content);

  // Populate the new comment
  await post.populate("comments.author", "firstName lastName profileUrl");

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Comment added successfully",
    data: post.comments[post.comments.length - 1],
  });
};

// Add a reply to a comment
export const addReply = async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;
  const authorId = req.user._id;

  if (!content || content.trim().length === 0) {
    throw new BadRequestError("Reply content is required");
  }

  const post = await Feed.findById(postId);

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  await post.addReply(commentId, authorId, content);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Reply added successfully",
  });
};

// Delete a comment
export const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.user._id;

  const post = await Feed.findById(postId);

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  const comment = post.comments.id(commentId);

  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  // Check if user is the comment author or admin
  if (
    comment.author.toString() !== userId.toString() &&
    req.user.accountType !== "admin"
  ) {
    throw new BadRequestError("You can only delete your own comments");
  }

  comment.remove();

  await post.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Comment deleted successfully",
  });
};

// Get user's posts
export const getUserPosts = async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const query = { author: userId };

  // If not viewing own posts, only show public ones
  if (userId !== req.user._id.toString()) {
    query.isPublic = true;
  }

  const posts = await Feed.find(query)
    .populate("author", "firstName lastName profileUrl accountTier isVerified")
    .populate("comments.author", "firstName lastName profileUrl")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Feed.countDocuments(query);

  res.status(StatusCodes.OK).json({
    success: true,
    data: posts,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      hasNext: skip + posts.length < total,
      hasPrev: page > 1,
    },
  });
};

// Get trending posts
export const getTrendingPosts = async (req, res) => {
  const { limit = 5 } = req.query;

  const posts = await Feed.aggregate([
    { $match: { isPublic: true } },
    {
      $addFields: {
        score: {
          $add: [
            { $multiply: ["$likeCount", 2] },
            { $multiply: ["$commentCount", 3] },
            { $multiply: ["$viewCount", 0.1] },
            { $multiply: ["$shareCount", 1.5] },
          ],
        },
      },
    },
    { $sort: { score: -1 } },
    { $limit: parseInt(limit) },
  ]);

  // Populate author information
  await Feed.populate(posts, {
    path: "author",
    select: "firstName lastName profileUrl accountTier isVerified",
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: posts,
  });
};
