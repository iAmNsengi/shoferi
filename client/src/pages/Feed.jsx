import React, { useState, useEffect } from "react";
import {
  BiHeart,
  BiComment,
  BiShare,
  BiBookmark,
  BiCar,
  BiMapPin,
  BiTime,
  BiTrendingUp,
  BiPlus,
  BiSearch,
  BiFilter,
  BiDollarCircle,
  BiUser,
  BiPhone,
  BiShield,
  BiEdit,
  BiTrash,
  BiSend,
  BiX,
} from "react-icons/bi";
import { BsArrowRight, BsThreeDots } from "react-icons/bs";
import { useAuth } from "../contexts/AuthContext";
import {
  useFeedPosts,
  useCreatePost,
  useTogglePostLike,
  useAddComment,
  useDeletePost,
  useUpdatePost,
} from "../hooks/useQueries";
import { toast } from "react-hot-toast";

const Feeds = () => {
  const { user, canPerformAction, getTierLimits } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [postForm, setPostForm] = useState({
    content: "",
    category: "general",
    tags: [],
  });

  // Queries
  const {
    data: feedData,
    isLoading,
    error,
  } = useFeedPosts({
    category: activeFilter === "all" ? undefined : activeFilter,
  });
  const createPostMutation = useCreatePost();
  const toggleLikeMutation = useTogglePostLike();
  const addCommentMutation = useAddComment();
  const deletePostMutation = useDeletePost();
  const updatePostMutation = useUpdatePost();

  const filters = [
    { id: "all", label: "All Posts", icon: BiTrendingUp },
    { id: "jobs", label: "Job Opportunities", icon: BiDollarCircle },
    { id: "roads", label: "Road Updates", icon: BiMapPin },
    { id: "tips", label: "Driving Tips", icon: BiShield },
    { id: "community", label: "Community", icon: BiUser },
  ];

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!canPerformAction("create_post")) {
      const limits = getTierLimits("create_post");
      toast.error(
        `Creating posts is not available for your current tier. Upgrade to PRO or ENTERPRISE to create posts.`
      );
      return;
    }

    if (!postForm.content.trim()) {
      toast.error("Please enter some content for your post");
      return;
    }

    try {
      await createPostMutation.mutateAsync({
        content: postForm.content,
        category: postForm.category,
        tags: postForm.tags,
      });

      setPostForm({ content: "", category: "general", tags: [] });
      setShowCreatePost(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      await toggleLikeMutation.mutateAsync(postId);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      await addCommentMutation.mutateAsync({
        postId,
        commentData: { content: commentText },
      });
      setCommentText("");
      setShowCommentForm(null);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePostMutation.mutateAsync(postId);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const getPostTypeColor = (type) => {
    switch (type) {
      case "jobs":
        return "from-green-500 to-emerald-600";
      case "roads":
        return "from-orange-500 to-red-500";
      case "tips":
        return "from-blue-500 to-indigo-600";
      case "community":
        return "from-purple-500 to-pink-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getPostTypeLabel = (type) => {
    switch (type) {
      case "jobs":
        return "Job Opportunity";
      case "roads":
        return "Road Update";
      case "tips":
        return "Driving Tip";
      case "community":
        return "Community";
      default:
        return "Post";
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-14 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Error Loading Feed
          </h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-14">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Shoferi Feeds
              </h1>
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
                <BiSearch className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search posts, jobs, updates..."
                  className="bg-transparent outline-none text-gray-700 w-64"
                />
              </div>
            </div>
            {user && (
              <button
                onClick={() => setShowCreatePost(!showCreatePost)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <BiPlus className="text-lg" />
                Create Post
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BiFilter />
                Filter Posts
              </h3>
              <div className="space-y-2">
                {filters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeFilter === filter.id
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="text-lg" />
                      <span className="font-medium">{filter.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-3">
            {/* Create Post Form */}
            {showCreatePost && (
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">
                    Create New Post
                  </h3>
                  <button
                    onClick={() => setShowCreatePost(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <BiX className="text-xl" />
                  </button>
                </div>
                <form onSubmit={handleCreatePost}>
                  <textarea
                    value={postForm.content}
                    onChange={(e) =>
                      setPostForm({ ...postForm, content: e.target.value })
                    }
                    placeholder="What's on your mind? Share job opportunities, road updates, driving tips, or community news..."
                    className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={4}
                  />
                  <div className="flex items-center justify-between mt-4">
                    <select
                      value={postForm.category}
                      onChange={(e) =>
                        setPostForm({ ...postForm, category: e.target.value })
                      }
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="general">General</option>
                      <option value="jobs">Job Opportunities</option>
                      <option value="roads">Road Updates</option>
                      <option value="tips">Driving Tips</option>
                      <option value="community">Community</option>
                    </select>
                    <button
                      type="submit"
                      disabled={createPostMutation.isPending}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {createPostMutation.isPending ? "Posting..." : "Post"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Posts */}
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-sm p-6 animate-pulse"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {feedData?.data?.posts?.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white rounded-2xl shadow-sm p-6"
                  >
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {post.author?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-800">
                              {post.author?.name || "Anonymous"}
                            </h4>
                            {post.author?.isVerified && (
                              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <BiTime className="text-xs" />
                            {formatTimeAgo(post.createdAt)}
                            {post.category && (
                              <>
                                <span>•</span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getPostTypeColor(
                                    post.category
                                  )} text-white`}
                                >
                                  {getPostTypeLabel(post.category)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Post Actions Menu */}
                      {user &&
                        (user._id === post.author?._id ||
                          user.accountType === "admin") && (
                          <div className="relative">
                            <button className="text-gray-500 hover:text-gray-700 p-2">
                              <BsThreeDots />
                            </button>
                            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                              <button
                                onClick={() => handleDeletePost(post._id)}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                              >
                                <BiTrash className="text-sm" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <p className="text-gray-800 leading-relaxed">
                        {post.content}
                      </p>
                      {post.media && post.media.length > 0 && (
                        <div className="mt-4">
                          <img
                            src={post.media[0]}
                            alt="Post media"
                            className="rounded-lg max-w-full h-auto"
                          />
                        </div>
                      )}
                    </div>

                    {/* Post Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <span>{post.likes?.length || 0} likes</span>
                        <span>{post.comments?.length || 0} comments</span>
                      </div>
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleToggleLike(post._id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                          post.likes?.includes(user?._id)
                            ? "text-red-500 bg-red-50"
                            : "text-gray-500 hover:text-red-500 hover:bg-red-50"
                        }`}
                      >
                        <BiHeart
                          className={`text-lg ${
                            post.likes?.includes(user?._id)
                              ? "fill-current"
                              : ""
                          }`}
                        />
                        Like
                      </button>

                      <button
                        onClick={() =>
                          setShowCommentForm(
                            showCommentForm === post._id ? null : post._id
                          )
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all"
                      >
                        <BiComment className="text-lg" />
                        Comment
                      </button>

                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-500 hover:text-green-500 hover:bg-green-50 transition-all">
                        <BiShare className="text-lg" />
                        Share
                      </button>
                    </div>

                    {/* Comment Form */}
                    {showCommentForm === post._id && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => handleAddComment(post._id)}
                            disabled={addCommentMutation.isPending}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                          >
                            <BiSend className="text-lg" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Comments */}
                    {post.comments && post.comments.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="space-y-3">
                          {post.comments.slice(0, 3).map((comment) => (
                            <div key={comment._id} className="flex gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {comment.author?.name?.charAt(0) || "U"}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm text-gray-800">
                                    {comment.author?.name || "Anonymous"}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatTimeAgo(comment.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          ))}
                          {post.comments.length > 3 && (
                            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                              View all {post.comments.length} comments
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {feedData?.data?.posts?.length === 0 && (
                  <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <BiTrendingUp className="text-6xl mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      No posts yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Be the first to share something with the community!
                    </p>
                    {user && canPerformAction("create_post") && (
                      <button
                        onClick={() => setShowCreatePost(true)}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        Create Your First Post
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feeds;
