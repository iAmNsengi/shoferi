import API from ".";

// Fetch users with filters, pagination, etc.
export const getUsers = (params) => API.get("/users", { params });

// Fetch a specific user by their ID
export const getUserById = (id) => API.get(`/users/${id}`);

// Create a new user
export const createUser = (userData) => API.post("/users", userData);

// Update an existing user
export const updateUser = (id, userData) => API.put(`/users/${id}`, userData);

// Delete a user by their ID
export const deleteUser = (id) => API.delete(`/users/${id}`);

// Upload user profile image
export const uploadUserImage = (formData) =>
  API.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Get user stats (if you have this functionality)
export const getUserStats = () => API.get("/users/stats");
