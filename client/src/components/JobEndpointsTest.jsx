import React from "react";
import {
  useJobs,
  useNearbyJobs,
  useJobsByCategory,
  useJobCategories,
  useSmartJobMatch,
} from "../hooks/useQueries";

const JobEndpointsTest = () => {
  // Test all job endpoints
  const { data: allJobs, isLoading: allJobsLoading } = useJobs({ limit: 5 });
  const { data: nearbyJobs, isLoading: nearbyLoading } = useNearbyJobs({
    limit: 5,
  });
  const { data: categoryJobs, isLoading: categoryLoading } = useJobsByCategory(
    "transportation",
    { limit: 5 }
  );
  const { data: categories, isLoading: categoriesLoading } = useJobCategories();
  const smartMatchMutation = useSmartJobMatch();

  const handleSmartMatch = () => {
    smartMatchMutation.mutate({
      location: "Kigali",
      skills: ["driving", "logistics"],
      experience: "2-5 years",
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Job Endpoints Test</h2>

      {/* All Jobs */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">All Jobs</h3>
        {allJobsLoading ? (
          <p>Loading...</p>
        ) : (
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify(allJobs?.data?.jobs?.slice(0, 2), null, 2)}
          </pre>
        )}
      </div>

      {/* Nearby Jobs */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Nearby Jobs</h3>
        {nearbyLoading ? (
          <p>Loading...</p>
        ) : (
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify(nearbyJobs?.data?.jobs?.slice(0, 2), null, 2)}
          </pre>
        )}
      </div>

      {/* Jobs by Category */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Jobs by Category (Transportation)
        </h3>
        {categoryLoading ? (
          <p>Loading...</p>
        ) : (
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify(categoryJobs?.data?.jobs?.slice(0, 2), null, 2)}
          </pre>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Job Categories</h3>
        {categoriesLoading ? (
          <p>Loading...</p>
        ) : (
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify(categories?.data?.categories?.slice(0, 5), null, 2)}
          </pre>
        )}
      </div>

      {/* Smart Match */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Smart Job Match</h3>
        <button
          onClick={handleSmartMatch}
          disabled={smartMatchMutation.isPending}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {smartMatchMutation.isPending ? "Matching..." : "Test Smart Match"}
        </button>
      </div>
    </div>
  );
};

export default JobEndpointsTest;
