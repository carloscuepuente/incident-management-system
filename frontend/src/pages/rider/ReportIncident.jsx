import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIncidents } from "../../hooks/useIncidents";
import { IncidentForm } from "../../components/rider/IncidentForm";

export const ReportIncident = () => {
  const navigate = useNavigate();
  const { createIncident } = useIncidents();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (incidentData) => {
    try {
      setLoading(true);
      setError(null);

      await createIncident(incidentData);

      // Redirigir al dashboard con mensaje de éxito
      navigate("/rider/dashboard", {
        state: { message: "Incidencia reportada exitosamente" },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al reportar la incidencia",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/rider/dashboard")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Reportar Incidencia
          </h1>
          <p className="mt-2 text-gray-600">
            Cuéntanos qué problema estás teniendo para que podamos ayudarte
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="card">
          <IncidentForm onSubmit={handleSubmit} loading={loading} />
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex">
            <svg
              className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">
                Tu reporte será atendido pronto
              </p>
              {/* <p>
                El gestor recibirá una notificación inmediata y podrá ayudarte a
                resolver el problema.
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
