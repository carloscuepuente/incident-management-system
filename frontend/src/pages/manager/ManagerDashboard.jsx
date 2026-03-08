import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useIncidents } from "../../hooks/useIncidents";
import { Button } from "../../components/common/Button";
import { StatusBadge } from "../../components/manager/StatusBadge";
import { PriorityBadge } from "../../components/manager/PriorityBadge";
import { formatTimeAgo } from "../../utils/formatters";
import { INCIDENT_CATEGORIES } from "../../utils/constants";

export const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { incidents, stats, loading } = useIncidents({}, true);

  // Obtener incidencias recientes (últimas 5)
  const recentIncidents = incidents.slice(0, 5);

  // Obtener incidencias urgentes (alta prioridad + nuevas/en revisión)
  const urgentIncidents = incidents.filter(
    (i) =>
      i.priority === "alta" &&
      (i.status === "nuevo" || i.status === "en_revision"),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Panel de Gestión
              </h1>
              <p className="text-sm text-gray-600">{user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/manager/users")}
                className="text-gray-600 hover:text-gray-900"
                title="Gestión de Usuarios"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </button>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-900"
                title="Cerrar Sesión"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Accesos rápidos de navegacion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button
            onClick={() => navigate("/manager/incidents")}
            className="w-full py-4"
          >
            <div className="flex items-center justify-center">
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-lg">Ver Todas las Incidencias</span>
            </div>
          </Button>

          <Button
            onClick={() => navigate("/manager/users")}
            variant="secondary"
            className="w-full py-4"
          >
            <div className="flex items-center justify-center">
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="text-lg">Gestionar Riders</span>
            </div>
          </Button>
        </div>

        {/* Estadísticas principales */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-yellow-100 rounded-lg">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Activas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeIncidents}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-green-100 rounded-lg">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Resueltas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.byStatus?.resuelto || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-red-100 rounded-lg">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    SLA Vencidos
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.slaBreached}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Incidencias urgentes */}
        {urgentIncidents.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <svg
                  className="w-6 h-6 text-red-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Incidencias Urgentes ({urgentIncidents.length})
              </h2>
              <button
                onClick={() => navigate("/manager/incidents?priority=alta")}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Ver todas →
              </button>
            </div>
            <div className="space-y-3">
              {urgentIncidents.slice(0, 3).map((incident) => (
                <IncidentCard
                  key={incident._id}
                  incident={incident}
                  onClick={() => navigate("/manager/incidents")}
                />
              ))}
            </div>
          </div>
        )}

        {/* Incidencias recientes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Incidencias Recientes
            </h2>
            <button
              onClick={() => navigate("/manager/incidents")}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Ver todas →
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando...</p>
            </div>
          ) : recentIncidents.length > 0 ? (
            <div className="space-y-3">
              {recentIncidents.map((incident) => (
                <IncidentCard
                  key={incident._id}
                  incident={incident}
                  onClick={() => navigate("/manager/incidents")}
                />
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-4 text-gray-600">
                No hay incidencias reportadas
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const IncidentCard = ({ incident, onClick }) => {
  const category = INCIDENT_CATEGORIES[incident.type];
  const subTypeLabel = category?.subTypes[incident.subType];

  return (
    <div
      className="card hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">{category?.icon}</span>
            <h3 className="font-semibold text-gray-900">{subTypeLabel}</h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {incident.riderName}
            </div>

            <div className="text-xs text-gray-500">
              {incident.ticketId} • {formatTimeAgo(incident.createdAt)}
            </div>
          </div>
        </div>

        <div className="ml-4 flex flex-col items-end space-y-2">
          <PriorityBadge priority={incident.priority} />
          <StatusBadge status={incident.status} />
        </div>
      </div>
    </div>
  );
};
