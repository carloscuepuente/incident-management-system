import axios from "./axios.config";

export const usersAPI = {
  getAllRiders: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.isActive !== undefined) {
      params.append("isActive", filters.isActive);
    }
    if (filters.search) {
      params.append("search", filters.search);
    }

    const response = await axios.get(`/users/riders?${params.toString()}`);
    return response.data;
  },

  getRiderById: async (id) => {
    const response = await axios.get(`/users/riders/${id}`);
    return response.data;
  },

  createRider: async (riderData) => {
    const response = await axios.post("/users/riders", riderData);
    return response.data;
  },

  updateRider: async (id, updateData) => {
    const response = await axios.put(`/users/riders/${id}`, updateData);
    return response.data;
  },

  resetPassword: async (id, newPassword) => {
    const response = await axios.post(`/users/riders/${id}/reset-password`, {
      newPassword,
    });
    return response.data;
  },

  deactivateRider: async (id) => {
    const response = await axios.post(`/users/riders/${id}/deactivate`);
    return response.data;
  },

  activateRider: async (id) => {
    const response = await axios.post(`/users/riders/${id}/activate`);
    return response.data;
  },

  getRiderStats: async () => {
    const response = await axios.get("/users/riders/stats");
    return response.data;
  },
};
