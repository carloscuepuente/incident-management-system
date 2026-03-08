import axios from "./axios.config";

export const incidentsApi = {
  createIncident: async (incidentData) => {
    const response = await axios.post(`/incidents`, incidentData);
    return response.data;
  },

  getAllIncidents: async (filters = {}) => {
    const params = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== "") {
        params.append(key, filters[key]);
      }
    });

    const response = await axios.get(`/incidents?${params.toString()}`);
    return response.data;
  },

  getMyIncidents: async () => {
    const response = await axios.get(`/incidents/mis-incidencias`);
    return response.data;
  },

  getIncidentsById: async (id) => {
    const response = await axios.get(`/incidents/${id}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await axios.patch(`/incidents/${id}/status`, { status });
    return response.data;
  },

  updatePriority: async (id, priority) => {
    const response = await axios.patch(`/incidents/${id}/priority`, {
      priority,
    });
    return response.data;
  },

  getStatistics: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters?.startDate) {
      params.append("startDate", filters.startDate);
    }
    if (filters?.endDate) {
      params.append("endDate", filters.endDate);
    }

    const response = await axios.get(`/incidents/stats?${params.toString()}`);
    return response.data;
  },
};
