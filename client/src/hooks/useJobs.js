import { useState, useEffect } from 'react';
import axios from 'axios';

const useJobs = (page = 1, sort = 'Newest', filters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8800/api-v1/jobs`,, {
          params: { page, sort, ...filters },
        });
        setData(response.data);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    fetchJobs();
  }, [page, sort, filters]);

  return { data, loading, error };
};

export default useJobs;

