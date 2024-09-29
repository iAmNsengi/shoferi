import { useState } from "react";
import { getUsers, getUserById, updateUser } from "../api/users";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all users
  const getUsers = async (params = {}) => {
    setLoading(true);
    try {
      const response = await getUsers(params);
      setUsers(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Get user details
  const getUser = async (id) => {
    setLoading(true);
    try {
      const response = await getUserById(id);
      setUser(response.data.user);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Update user
  const updateUserInfo = async (id, userData) => {
    setLoading(true);
    try {
      const response = await updateUser(id, userData);
      setUser(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return {
    users,
    user,
    loading,
    error,
    getUsers,
    getUser,
    updateUserInfo,
  };
};
