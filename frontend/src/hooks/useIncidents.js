import { useState, useEffect, useCallback } from "react";
import { incidentsApi } from "../api/incidents.api";
import { useDebounce } from "./useDebounce";

export const useIncidents = (filters = {}, isManager = false) => {
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(filters.search, 1000);

  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const effectiveFilters = {
        ...filters,
        search: debouncedSearch,
      };

      const response = isManager
        ? await incidentsApi.getAllIncidents(effectiveFilters)
        : await incidentsApi.getMyIncidents();

      if (response.success) {
        setIncidents(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar incidencias");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isManager,
    filters.status,
    filters.priority,
    filters.type,
    debouncedSearch,
  ]);

  const fetchStats = useCallback(async () => {
    if (!isManager) return;

    const effectiveFilters = {
      ...filters,
      search: debouncedSearch,
    };

    try {
      const response = await incidentsApi.getStatistics(effectiveFilters);
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isManager,
    filters.status,
    filters.priority,
    filters.type,
    debouncedSearch,
  ]);

  useEffect(() => {
    fetchIncidents();
    if (isManager) {
      fetchStats();
    }
  }, [fetchIncidents, fetchStats, isManager]);

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
