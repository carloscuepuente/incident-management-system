import { useState } from "react";
import { useIncidents } from "../../hooks/useIncidents";
import { IncidentDetail } from "../../components/manager/IncidentManagement/IncidentDetail";
import { IncidentsList } from "../../components/manager/IncidentManagement/IncidentsList";
import { IncidentFilters } from "../../components/manager/IncidentManagement/IncidentFilters";

export const IncidentsPage = () => {
  const [filters, setFilters] = useState({});
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [message, setMessage] = useState(null);
  const { incidents, stats, loading, error, updateStatus, updatePriority } =
    useIncidents(filters, true);

  const handleSelectIncident = (incident) => {
    setSelectedIncident(incident);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setSelectedIncident(null);
    setShowDetailModal(false);
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const result = await updateStatus(id, status);
      if (result.success) {
        showMessage("Estado actualizado exitosamente", "success");
      }
      const updated = incidents.find((inc) => inc._id === id);
      setSelectedIncident({ ...updated, status });
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Error actualizando el estado del incidente",
        "error",
      );
      throw error;
    }
  };

  const handleUpdatePriority = async (id, priority) => {
    try {
      const result = await updatePriority(id, priority);
      console.log(result);
      if (result.success) {
        showMessage("Prioridad actualizada exitosamente", "success");
      }
      const updated = incidents.find((inc) => inc._id === id);
      setSelectedIncident([...updated, priority]);
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Error actualizando la prioridad del incidente",
        "error",
      );
      throw error;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Incidencias
        </h1>
        <p className="mt-2 text-gray-600">
          Monitorea y resuelve las incidencias reportadas por los riders
        </p>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Incidencias"
            value={stats.total}
            icon="📊"
            color="blue"
          />
          <StatsCard
            title="Activas"
            value={stats.activeIncidents}
            icon="⏳"
            color="yellow"
          />
          <StatsCard
            title="Resueltas"
            value={stats.byStatus?.resuelto || 0}
            icon="✅"
            color="green"
          />
          <StatsCard
            title="SLA Vencidos"
            value={stats.slaBreached}
            icon="⚠️"
            color="red"
          />
        </div>
      )}

      {/* Mensaje de notificación */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Filtros */}
      <IncidentFilters
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Lista de incidencias */}
      <div className="card">
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <IncidentsList
            incidents={incidents}
            loading={loading}
            onSelectIncident={handleSelectIncident}
          />
        )}
      </div>

      {/* Modal de detalle */}
      <IncidentDetail
        incident={selectedIncident}
        isOpen={showDetailModal}
        onClose={handleCloseDetail}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePriority={handleUpdatePriority}
      />
    </div>
  );
};

// todo llevarme esto a otro lado
const StatsCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="card">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 ${colorClasses[color]} rounded-lg`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};
