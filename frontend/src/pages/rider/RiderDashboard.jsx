import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useIncidents } from "../../hooks/useIncidents";
import { StatusBadge } from "../../components/manager/StatusBadge";
import { PriorityBadge } from "../../components/manager/PriorityBadge";
import { formatTimeAgo } from "../../utils/formatters";
import { INCIDENT_CATEGORIES } from "../../utils/constants";
import { Button } from "../../components/common/Button";

export const RiderDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { incidents, loading } = useIncidents();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (location.state?.message) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessage({ text: location.state.message, type: "success" });
      // Limpiar el state
      window.history.replaceState({}, document.title);
      setTimeout(() => setMessage(null), 5000);
    }
  }, [location]);

  const activeIncidents = incidents.filter(
    (i) => i.status === "nuevo" || i.status === "en_revision",
  );
  const resolvedIncidents = incidents.filter(
    (i) => i.status === "resuelto" || i.status === "descartado",
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bienvenido, {user?.name}
              </h1>
              <p className="text-sm text-gray-600">ID: {user?.userId}</p>
            </div>
            <button
              onClick={logout}
              className="text-gray-600 hover:text-gray-900"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Botón reportar */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/rider/report-incident")}
            className="w-full sm:w-auto"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Reportar Nueva Incidencia
          </Button>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                <p className="text-sm font-medium text-gray-500">
                  Total Reportadas
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {incidents.length}
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
                <p className="text-sm font-medium text-gray-500">En Proceso</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeIncidents.length}
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
                  {resolvedIncidents.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Incidencias activas */}
        {activeIncidents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Incidencias en Proceso
            </h2>
            <div className="space-y-4">
              {activeIncidents.map((incident) => (
                <IncidentCard key={incident._id} incident={incident} />
              ))}
            </div>
          </div>
        )}

        {/* Incidencias resueltas */}
        {resolvedIncidents.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Historial</h2>
            <div className="space-y-4">
              {resolvedIncidents.slice(0, 5).map((incident) => (
                <IncidentCard key={incident._id} incident={incident} />
              ))}
            </div>
          </div>
        )}

        {/* Sin incidencias */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        )}

        {!loading && incidents.length === 0 && (
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
              No tienes incidencias reportadas
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Reporta una incidencia cuando encuentres un problema
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente auxiliar para tarjeta de incidencia
const IncidentCard = ({ incident }) => {
  const category = INCIDENT_CATEGORIES[incident.type];
  const subTypeLabel = category?.subTypes[incident.subType];

  return (
    <div className="card hover:shadow-lg transition-shadow">
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              {incident.ticketId}
            </div>

            {incident.orderId && (
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Pedido: {incident.orderId}
              </div>
            )}

            {incident.comment && (
              <p className="text-sm text-gray-700 italic">
                "{incident.comment}"
              </p>
            )}

            <div className="text-xs text-gray-500">
              {formatTimeAgo(incident.createdAt)}
            </div>
          </div>
        </div>

        <div className="ml-4 flex flex-col items-end space-y-2">
          <StatusBadge status={incident.status} />
          <PriorityBadge priority={incident.priority} />
        </div>
      </div>
    </div>
  );
};
