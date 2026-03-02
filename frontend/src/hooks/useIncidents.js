import { useState, useEffect } from "react";
import { incidentsApi } from "../api/incidents.api";

export const useIncidents = (filters = {}, isManager = false) => {
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = isManager
        ? await incidentsApi.getAllIncidents(filters)
        : await incidentsApi.getMyIncidents();

      if (response.success) {
        setIncidents(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar incidencias");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!isManager) return;

    try {
      const response = await incidentsApi.getStatistics(filters);
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchIncidents();
    if (isManager) {
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters), isManager]);

  const createIncident = async (incidentData) => {
    const response = await incidentsApi.createIncident(incidentData);
    if (response.success) {
      await fetchIncidents();
      return { success: true, data: response.data };
    }
  };

  const updateStatus = async (id, status) => {
    const response = await incidentsApi.updateStatus(id, status);
    if (response.success) {
      await fetchIncidents();
      if (isManager) await fetchStats();
      return { success: true };
    }
  };

  const updatePriority = async (id, priority) => {
    const response = await incidentsApi.updatePriority(id, priority);
    if (response.success) {
      await fetchIncidents();
      if (isManager) await fetchStats();
      return { success: true };
    }
  };

  return {
    incidents,
    stats,
    loading,
    error,
    createIncident,
    updateStatus,
    updatePriority,
    refresh: fetchIncidents,
  };
};
