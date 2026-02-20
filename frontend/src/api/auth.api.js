import axiosInstance from "./axios.config";

export const authApi = {
  login: async (userId, password) => {
    const response = await axiosInstance.post("/auth/login", {
      userId,
      password,
    });

    return response.data;
  },
  getProfile: async () => {
    const response = await axiosInstance.get("/auth/profile");
    return response.data;
  },
  changePassword: async (oldPassword, newPassword, confirmPassword) => {
    const response = await axiosInstance.post("/auth/change-password", {
      oldPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },
};
