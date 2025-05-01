import axios from "axios";
import baseURL from "./baseUrl";

export const apiRequest = async ({
  url,
  method = "GET",
  data = null,
  params = null,
}) => {
  try {
    const token = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo")).token
      : null;

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await axios({
      method,
      url: `${baseURL}${url}`,
      data,
      params,
      headers,
    });

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
};

export const updateURL = (
  { query, location, page },
  navigate,
  currentLocation
) => {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (location) params.set("location", location);
  if (page) params.set("page", page.toString());
  navigate(`${currentLocation.pathname}?${params.toString()}`);
};
