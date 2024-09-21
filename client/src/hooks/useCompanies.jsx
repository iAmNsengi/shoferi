import { useState } from "react";
import axios from "axios";
import { getAllCompanies } from "../api/companies";

export const useCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState(null);
  const [jobListing, setJobListing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all companies
  const getCompanies = async (params = {}) => {
    setLoading(true);
    try {
      const response = await getAllCompanies(params);
      setCompanies(response.data.data); // Assuming the response data is in `data.data`
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return {
    companies,
    loading,
    getCompanies,
  };
};
