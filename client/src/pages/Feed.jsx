import React, { useState } from "react";
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
} from "react-icons/bi";
import { BsArrowRight, BsThreeDots } from "react-icons/bs";

const Feeds = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showCreatePost, setShowCreatePost] = useState(false);

  const filters = [
    { id: "all", label: "All Posts", icon: BiTrendingUp },
    { id: "jobs", label: "Job Opportunities", icon: BiDollarCircle },
    { id: "roads", label: "Road Updates", icon: BiMapPin },
    { id: "tips", label: "Driving Tips", icon: BiShield },
    { id: "community", label: "Community", icon: BiUser },
  ];

  const feedPosts = [
    {
      id: 1,
      type: "job",
      author: {
        name: "Transport Solutions Ltd",
        avatar: "🏢",
        verified: true,
        location: "Kigali",
      },
      timestamp: "2 hours ago",
      content:
        "We are looking for experienced drivers for our delivery fleet. Requirements: Clean driving record, 3+ years experience, knowledge of Kigali routes.",
      jobDetails: {
        salary: "150,000 - 200,000 RWF",
        type: "Full-time",
        vehicles: "Trucks & Vans",
      },
      likes: 24,
      comments: 8,
      shares: 3,
      trending: true,
    },
    {
      id: 2,
      type: "road",
      author: {
        name: "Jean Claude Uwimana",
        avatar: "👨‍💼",
        verified: false,
        location: "Nyamirambo",
      },
      timestamp: "4 hours ago",
      content:
        "Road construction on KG 15 Ave near Nyamirambo. Expect delays between 8-10 AM. Alternative route: Use KG 7 Ave for faster transit.",
      image: "🚧",
      likes: 18,
      comments: 12,
      shares: 15,
      urgent: true,
    },
    {
      id: 3,
      type: "tip",
      author: {
        name: "Marie Mukandayisenga",
        avatar: "👩‍🏫",
        verified: true,
        location: "Gasabo",
      },
      timestamp: "6 hours ago",
      content:
        'Safety tip: Always maintain 3-second following distance in city traffic. Count "one-thousand-one, one-thousand-two, one-thousand-three" after the car ahead passes a landmark.',
      likes: 45,
      comments: 6,
      shares: 22,
      helpful: true,
    },
    {
      id: 4,
      type: "community",
      author: {
        name: "Drivers Union Rwanda",
        avatar: "🤝",
        verified: true,
        location: "Rwanda",
      },
      timestamp: "8 hours ago",
      content:
        "Monthly meeting this Saturday at 2 PM, Kigali Convention Center. Topics: New traffic regulations, insurance updates, and professional development opportunities.",
      likes: 67,
      comments: 23,
      shares: 34,
    },
    {
      id: 5,
      type: "job",
      author: {
        name: "Safari Car Rental",
        avatar: "🚗",
        verified: true,
        location: "Airport",
      },
      timestamp: "1 day ago",
      content:
        "Seeking professional chauffeurs for VIP airport transfers. Must speak English/French, excellent customer service skills required.",
      jobDetails: {
        salary: "200,000+ RWF",
        type: "Part-time",
        vehicles: "Luxury Cars",
      },
      likes: 31,
      comments: 14,
      shares: 7,
    },
  ];

  const getPostTypeColor = (type) => {
    switch (type) {
      case "job":
        return "from-green-500 to-emerald-600";
      case "road":
        return "from-orange-500 to-red-500";
      case "tip":
        return "from-blue-500 to-indigo-600";
      case "community":
        return "from-purple-500 to-pink-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getPostTypeLabel = (type) => {
    switch (type) {
      case "job":
        return "Job Opportunity";
      case "road":
        return "Road Update";
      case "tip":
        return "Driving Tip";
      case "community":
        return "Community";
      default:
        return "Post";
    }
  };

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
            <button
              onClick={() => setShowCreatePost(!showCreatePost)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
            >
              <BiPlus className="text-lg" />
              Create Post
            </button>
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
                  const IconComponent = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                        activeFilter === filter.id
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <IconComponent className="text-lg" />
                      <span className="font-medium">{filter.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Today's Activity
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Jobs</span>
                    <span className="font-semibold text-green-600">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Road Updates</span>
                    <span className="font-semibold text-orange-600">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Drivers</span>
                    <span className="font-semibold text-blue-600">248</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-3">
            {showCreatePost && (
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Create New Post
                </h3>
                <textarea
                  className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="4"
                  placeholder="Share a job opportunity, road update, driving tip, or community news..."
                ></textarea>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                    <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                      <option>Job Opportunity</option>
                      <option>Road Update</option>
                      <option>Driving Tip</option>
                      <option>Community</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowCreatePost(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-md transition-all">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {feedPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all"
                >
                  {/* Post Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center text-xl">
                          {post.author.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-800">
                              {post.author.name}
                            </h4>
                            {post.author.verified && (
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <BiMapPin className="text-xs" />
                            <span>{post.author.location}</span>
                            <span>•</span>
                            <BiTime className="text-xs" />
                            <span>{post.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getPostTypeColor(
                            post.type
                          )}`}
                        >
                          {getPostTypeLabel(post.type)}
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <BsThreeDots className="text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {/* Special Badges */}
                    <div className="flex gap-2 mt-2">
                      {post.trending && (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full font-medium">
                          <BiTrendingUp className="text-xs" />
                          Trending
                        </span>
                      )}
                      {post.urgent && (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          ⚡ Urgent
                        </span>
                      )}
                      {post.helpful && (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          💡 Helpful
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {post.content}
                    </p>

                    {/* Job Details */}
                    {post.jobDetails && (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="flex items-center gap-2">
                            <BiDollarCircle className="text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500">Salary</p>
                              <p className="font-semibold text-gray-800">
                                {post.jobDetails.salary}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <BiTime className="text-blue-600" />
                            <div>
                              <p className="text-xs text-gray-500">Type</p>
                              <p className="font-semibold text-gray-800">
                                {post.jobDetails.type}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <BiCar className="text-purple-600" />
                            <div>
                              <p className="text-xs text-gray-500">Vehicles</p>
                              <p className="font-semibold text-gray-800">
                                {post.jobDetails.vehicles}
                              </p>
                            </div>
                          </div>
                        </div>
                        <button className="mt-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all flex items-center gap-2">
                          <BiPhone className="text-sm" />
                          Contact Now
                        </button>
                      </div>
                    )}

                    {/* Road Update Image */}
                    {post.image && (
                      <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-8 mb-4 text-center">
                        <div className="text-6xl mb-2">{post.image}</div>
                        <p className="text-orange-700 font-medium">
                          Road Construction Zone
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                          <BiHeart className="text-lg" />
                          <span className="font-medium">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                          <BiComment className="text-lg" />
                          <span className="font-medium">{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors">
                          <BiShare className="text-lg" />
                          <span className="font-medium">{post.shares}</span>
                        </button>
                      </div>
                      <button className="text-gray-600 hover:text-purple-500 transition-colors">
                        <BiBookmark className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="bg-white text-gray-600 px-8 py-3 rounded-full font-medium hover:shadow-md transition-all border border-gray-200 flex items-center gap-2 mx-auto">
                Load More Posts
                <BsArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feeds;
