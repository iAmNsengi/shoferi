import API from ".";

// Fetch compaies with search,...
export const getAllCompanies = (params) => API.get("/companies", { params });

// Fetch a specific conpany by its ID
export const getCompanyById = (id) => API.get(`/companies/get-company/${id}`);

// Create a new company
export const createCompany = (jobData) => API.post("/companies", jobData);

// Update an existing comapny
export const updateCompany = (id, jobData) =>
  API.put(`/companies/${id}`, jobData);

// Delete a company by its ID
export const deleteCompany = (id) => API.delete(`/companies/${id}`);

export const uploadImage = async (image) => {
  try {
    const formData = new FormData();
    formData.append("profile", image);

    const response = await API.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.profileUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
