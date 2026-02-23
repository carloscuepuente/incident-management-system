import { useState, useEffect } from "react";
import { usersAPI } from "../api/users.api";

export const useUsers = (filters = {}) => {
  const [riders, setRiders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRiders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersAPI.getAllRiders(filters);

      if (response.success) {
        setRiders(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar riders");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await usersAPI.getRiderStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };
  //   flag revisar esta parte, no se si es necesario el JSON.stringify
  // considera el useMemo investigar como usarlo bien
  useEffect(() => {
    fetchRiders();
    fetchStats();
  }, [JSON.stringify(filters)]);

  const createRider = async (riderData) => {
    const response = await usersAPI.createRider(riderData);
    if (response.success) {
      await fetchRiders();
      await fetchStats();
      return { success: true, data: response.data };
    }
  };

  const updateRider = async (id, updateData) => {
    const response = await usersAPI.updateRider(id, updateData);
    if (response.success) {
      await fetchRiders();
      return { success: true, data: response.data };
    }
  };

  const resetPassword = async (id, newPassword) => {
    const response = await usersAPI.resetPassword(id, newPassword);
    if (response.success) {
      return { success: true };
    }
  };

  const toggleRiderStatus = async (id, isActive) => {
    const response = isActive
      ? await usersAPI.deactivateRider(id)
      : await usersAPI.activateRider(id);

    if (response.success) {
      await fetchRiders();
      await fetchStats();
      return { success: true };
    }
  };

  return {
    riders,
    stats,
    loading,
    error,
    createRider,
    updateRider,
    resetPassword,
    toggleRiderStatus,
    refresh: fetchRiders,
  };
};
