import { useState } from "react";
import { Modal } from "../../common/Modal";
import { Button } from "../../common/Button";
import { StatusBadge } from "../StatusBadge";
import { PriorityBadge } from "../PriorityBadge";
import { SLAIndicator } from "../SLAIndicator";
import { formatDateTime } from "../../../utils/formatters";
import {
  INCIDENT_CATEGORIES,
  INCIDENT_STATUS,
  STATUS_LABELS,
  PRIORITY_LABELS,
} from "../../../utils/constants";

export const IncidentDetail = ({
  incident,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdatePriority,
}) => {
  const [newStatus, setNewStatus] = useState("");
  const [newPriority, setNewPriority] = useState("");
  const [loading, setLoading] = useState(false);

  if (!incident) return null;

  const category = INCIDENT_CATEGORIES[incident.type];
  const subTypeLabel = category?.subTypes[incident.subType];

  const handleUpdateStatus = async () => {
    if (!newStatus) return;

    try {
      setLoading(true);
      await onUpdateStatus(incident._id, newStatus);
      setNewStatus("");
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePriority = async () => {
    if (!newPriority) return;

    try {
      setLoading(true);
      await onUpdatePriority(incident._id, newPriority);
      setNewPriority("");
    } catch (error) {
      console.error("Error updating priority:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle de Incidencia">
      <div className="space-y-6">
        {/* Header con info principal */}
        <div className="border-b pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <span className="text-3xl mr-3">{category?.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {subTypeLabel}
                </h3>
                <p className="text-sm text-gray-500">{incident.ticketId}</p>
              </div>
            </div>
            <div className="text-right space-y-2">
              <StatusBadge status={incident.status} />
              <PriorityBadge priority={incident.priority} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Rider:</span>
              <p className="font-medium">
                {incident.riderName} ({incident.riderId})
              </p>
            </div>
            <div>
              <span className="text-gray-500">Fecha:</span>
              <p className="font-medium">
                {formatDateTime(incident.createdAt)}
              </p>
            </div>
            {incident.orderId && (
              <div>
                <span className="text-gray-500">Pedido:</span>
                <p className="font-medium">{incident.orderId}</p>
              </div>
            )}
            <div>
              <span className="text-gray-500">SLA:</span>
              <div className="mt-1">
                <SLAIndicator
                  timeRemaining={incident.timeRemaining}
                  slaBreached={incident.slaBreached}
                  status={incident.status}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Comentario */}
        {incident.comment && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Comentario del Rider:
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 italic">
                "{incident.comment}"
              </p>
            </div>
          </div>
        )}

        {/* Acciones - Cambiar Estado */}
        {incident.status !== INCIDENT_STATUS.RESUELTO &&
          incident.status !== INCIDENT_STATUS.DESCARTADO && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Actualizar Estado:
              </h4>
              <div className="flex gap-2">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="input-field flex-1"
                >
                  <option value="">Seleccionar nuevo estado...</option>
                  {Object.entries(STATUS_LABELS)
                    .filter(([key]) => key !== incident.status)
                    .map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                </select>
                <Button
                  onClick={handleUpdateStatus}
                  disabled={!newStatus}
                  loading={loading}
                >
                  Actualizar
                </Button>
              </div>
            </div>
          )}

        {/* Acciones - Cambiar Prioridad */}
        {incident.status !== INCIDENT_STATUS.RESUELTO &&
          incident.status !== INCIDENT_STATUS.DESCARTADO && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Ajustar Prioridad:
              </h4>
              <div className="flex gap-2">
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="input-field flex-1"
                >
                  <option value="">Seleccionar nueva prioridad...</option>
                  {Object.entries(PRIORITY_LABELS)
                    .filter(([key]) => key !== incident.priority)
                    .map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                </select>
                <Button
                  onClick={handleUpdatePriority}
                  disabled={!newPriority}
                  loading={loading}
                >
                  Actualizar
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                ⚠️ Cambiar la prioridad recalculará el SLA deadline
              </p>
            </div>
          )}

        {/* Historial */}
        {incident.history && incident.history.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Historial de Cambios:
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
              <div className="space-y-3">
                {incident.history.map((entry, index) => (
                  <HistoryEntry key={index} entry={entry} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Info de resolución */}
        {incident.resolvedAt && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-green-800">
                  Incidencia cerrada
                </p>
                <p className="text-xs text-green-700">
                  {formatDateTime(incident.resolvedAt)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

const HistoryEntry = ({ entry }) => {
  const getActionLabel = (action) => {
    switch (action) {
      case "created":
        return "Incidencia creada";
      case "status_changed":
        return "Estado actualizado";
      case "priority_changed":
        return "Prioridad actualizada";
      default:
        return action;
    }
  };

  const getValueLabel = (value) => {
    return STATUS_LABELS[value] || PRIORITY_LABELS[value] || value;
  };

  return (
    <div className="flex items-start text-sm">
      <div className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-blue-600 mr-3"></div>
      <div className="flex-1">
        <p className="text-gray-900">
          <span className="font-medium">{entry.userName}</span> -{" "}
          {getActionLabel(entry.action)}
        </p>
        {entry.previousValue && entry.newValue && (
          <p className="text-gray-600 text-xs">
            De "{getValueLabel(entry.previousValue)}" a "
            {getValueLabel(entry.newValue)}"
          </p>
        )}
        <p className="text-gray-500 text-xs">
          {formatDateTime(entry.timestamp)}
        </p>
      </div>
    </div>
  );
};
