import React, { useState } from "react";
import {
  BiBookOpen,
  BiVideo,
  BiCheckCircle,
  BiPlus,
  BiEdit,
  BiTrash,
  BiPlay,
  BiTime,
  BiStar,
  BiFilter,
  BiSearch,
  BiX,
} from "react-icons/bi";
import { useAuth } from "../contexts/AuthContext";
import {
  useLearningMaterials,
  useFeaturedLearning,
  useLearningByCategory,
  useCreateLearning,
  useDeleteLearning,
  useToggleLearningPublish,
  useToggleLearningFeatured,
} from "../hooks/useQueries";
import { toast } from "react-hot-toast";
import DownloadApp from "../components/sections/DownloadApp";

const Learn = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "beginner",
    difficulty: "easy",
    media: "",
  });

  // Queries
  const { data: learningData, isLoading } = useLearningMaterials({
    category: activeCategory === "all" ? undefined : activeCategory,
    search: searchTerm || undefined,
  });
  const { data: featuredData } = useFeaturedLearning();
  const createLearningMutation = useCreateLearning();
  const deleteLearningMutation = useDeleteLearning();
  const togglePublishMutation = useToggleLearningPublish();
  const toggleFeaturedMutation = useToggleLearningFeatured();

  const categories = [
    { id: "all", label: "All Materials", icon: BiBookOpen },
    { id: "beginner", label: "Beginner Guides", icon: BiCheckCircle },
    { id: "intermediate", label: "Intermediate", icon: BiVideo },
    { id: "advanced", label: "Advanced", icon: BiStar },
    { id: "safety", label: "Road Safety", icon: BiCheckCircle },
    { id: "traffic", label: "Traffic Rules", icon: BiBookOpen },
  ];

  const handleCreateLearning = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createLearningMutation.mutateAsync(formData);
      setFormData({
        title: "",
        description: "",
        content: "",
        category: "beginner",
        difficulty: "easy",
        media: "",
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating learning material:", error);
    }
  };

  const handleDeleteLearning = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this learning material?")
    ) {
      try {
        await deleteLearningMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting learning material:", error);
      }
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await togglePublishMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await toggleFeaturedMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error toggling featured status:", error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "beginner":
        return "from-green-500 to-emerald-600";
      case "intermediate":
        return "from-yellow-500 to-orange-600";
      case "advanced":
        return "from-red-500 to-pink-600";
      case "safety":
        return "from-blue-500 to-indigo-600";
      case "traffic":
        return "from-purple-500 to-pink-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-40 pb-10 text-black">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Start Learning Driving for Free
            </h2>
            <p className="text-primary-600 text-lg max-w-2xl mx-auto">
              Shoferi empowers everyone in Rwanda with free access to essential
              driving skills and road safety knowledge.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search learning materials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <BiFilter className="text-gray-500" />
                  <select
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {user?.accountType === "admin" && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <BiPlus className="text-lg" />
                  Add Material
                </button>
              )}
            </div>
          </div>

          {/* Create Learning Material Form */}
          {showCreateForm && (
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Create Learning Material
                </h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <BiX className="text-xl" />
                </button>
              </div>
              <form onSubmit={handleCreateLearning} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="safety">Road Safety</option>
                    <option value="traffic">Traffic Rules</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={6}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <input
                    type="url"
                    placeholder="Media URL (optional)"
                    value={formData.media}
                    onChange={(e) =>
                      setFormData({ ...formData, media: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={createLearningMutation.isPending}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {createLearningMutation.isPending
                      ? "Creating..."
                      : "Create Material"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Featured Materials */}
          {featuredData?.data?.materials?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6">Featured Materials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredData.data.materials.map((material) => (
                  <div
                    key={material._id}
                    className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(
                          material.category
                        )} text-white`}
                      >
                        {material.category}
                      </span>
                      {user?.accountType === "admin" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleFeatured(material._id)}
                            className="text-yellow-500 hover:text-yellow-600"
                          >
                            <BiStar className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteLearning(material._id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <BiTrash className="text-lg" />
                          </button>
                        </div>
                      )}
                    </div>
                    <h4 className="text-lg font-semibold mb-2">
                      {material.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {material.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
                          material.difficulty
                        )}`}
                      >
                        {material.difficulty}
                      </span>
                      <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all">
                        <BiPlay className="inline mr-1" />
                        Learn
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Learning Materials */}
          <div>
            <h3 className="text-2xl font-bold mb-6">All Learning Materials</h3>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-sm p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningData?.data?.materials?.map((material) => (
                  <div
                    key={material._id}
                    className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(
                          material.category
                        )} text-white`}
                      >
                        {material.category}
                      </span>
                      {user?.accountType === "admin" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTogglePublish(material._id)}
                            className={`${
                              material.isPublished
                                ? "text-green-500"
                                : "text-gray-400"
                            } hover:text-green-600`}
                          >
                            <BiCheckCircle className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleToggleFeatured(material._id)}
                            className={`${
                              material.isFeatured
                                ? "text-yellow-500"
                                : "text-gray-400"
                            } hover:text-yellow-600`}
                          >
                            <BiStar className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteLearning(material._id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <BiTrash className="text-lg" />
                          </button>
                        </div>
                      )}
                    </div>
                    <h4 className="text-lg font-semibold mb-2">
                      {material.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {material.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
                          material.difficulty
                        )}`}
                      >
                        {material.difficulty}
                      </span>
                      <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all">
                        <BiPlay className="inline mr-1" />
                        Learn
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {learningData?.data?.materials?.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <BiBookOpen className="text-6xl mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No learning materials found
                </h3>
                <p className="text-gray-600">
                  Check back later for new content!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <DownloadApp />
    </>
  );
};

export default Learn;
