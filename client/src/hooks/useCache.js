import { useState, useEffect } from "react";

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useCache = (key, fetchFn) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if we have cached data and it's still valid
        const cachedData = cache.get(key);
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
          setData(cachedData.data);
          setLoading(false);
          return;
        }

        // If no valid cache, fetch new data
        const result = await fetchFn();

        // Cache the new data with timestamp
        cache.set(key, {
          data: result,
          timestamp: Date.now(),
        });

        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key, fetchFn]);

  const invalidateCache = () => {
    cache.delete(key);
  };

  return { data, loading, error, invalidateCache };
};
