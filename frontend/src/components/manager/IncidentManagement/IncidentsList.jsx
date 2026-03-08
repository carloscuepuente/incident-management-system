import { formatTimeAgo } from "../../../utils/formatters";
import { INCIDENT_CATEGORIES } from "../../../utils/constants";
import { PriorityBadge } from "../PriorityBadge";
import { StatusBadge } from "../StatusBadge";
import { SLAIndicator } from "../SLAIndicator";
export const IncidentsList = ({ incidents, loading, onSelectIncident }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando incidencias...</p>
      </div>
    );
  }

  if (incidents.length === 0) {
    return (
      <div className="text-center py-12">
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
        <p className="mt-4 text-gray-600">No hay incidencias</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ticket
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo / Motivo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rider
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prioridad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SLA
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Creado
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {incidents.map((incident) => (
            <IncidentRow
              key={incident._id}
              incident={incident}
              onSelect={onSelectIncident}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const IncidentRow = ({ incident, onSelect }) => {
  const category = INCIDENT_CATEGORIES[incident.type];
  const subTypeLabel = category?.subTypes[incident.subType];

  return (
    <tr
      className="hover:bg-gray-50 cursor-pointer"
      onClick={() => onSelect(incident)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className="text-xl mr-2">{category?.icon}</span>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {incident.ticketId}
            </div>
            {incident.orderId && (
              <div className="text-xs text-gray-500">
                Pedido: {incident.orderId}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{category?.label}</div>
        <div className="text-xs text-gray-500">{subTypeLabel}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{incident.riderName}</div>
        <div className="text-xs text-gray-500">{incident.riderId}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <PriorityBadge priority={incident.priority} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={incident.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <SLAIndicator
          timeRemaining={incident.timeRemaining}
          slaBreached={incident.slaBreached}
          status={incident.status}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatTimeAgo(incident.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(incident);
          }}
          className="text-blue-600 hover:text-blue-900"
        >
          Ver detalles
        </button>
      </td>
    </tr>
  );
};
