import { FaTruck } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { FaClipboard } from "react-icons/fa";

export const INCIDENT_CATEGORIES = {
  entrega: {
    label: "Problemas de entrega",
    icon: FaTruck,
    subTypes: {
      pinchazo: "Pinchazo / problema vehículo",
      tienda_cerrada: "Tienda cerrada",
      retraso_preparacion: "Pedido tarda en prepararse",
      pedido_entregado_por_otro: "Otro rider llevó el pedido",
      problema_geolocalizacion: "Problema con ubicación del cliente/partner",
      accidente: "Accidente / emergencia",
    },
  },
  tecnica: {
    label: "Problemas técnicos",
    icon: FaGear,
    subTypes: {
      falla_app: "La app no funciona correctamente",
      problema_gps: "GPS no funciona",
      no_puedo_marcar_entregado: "No puedo completar el pedido en la app",
    },
  },
  gestion: {
    label: "Incidencias de gestión",
    icon: FaClipboard,
    subTypes: {
      reasignacion_pedido: "Me reasignaron un pedido",
      ausencia_turno: "Ausencia a mi turno",
      conexion_tardia: "Me conecté tarde",
      modificacion_horario: "Problema con cambio de horario",
      consulta_general: "Otra consulta",
    },
  },
};

export const INCIDENT_STATUS = {
  NUEVO: "nuevo",
  EN_REVISION: "en_revision",
  RESUELTO: "resuelto",
  DESCARTADO: "descartado",
};

export const STATUS_LABELS = {
  nuevo: "Nuevo",
  en_revision: "En revisión",
  resuelto: "Resuelto",
  descartado: "Descartado",
};

export const STATUS_COLORS = {
  nuevo: "bg-blue-100 text-blue-800 border-blue-200",
  en_revision: "bg-yellow-100 text-yellow-800 border-yellow-200",
  resuelto: "bg-green-100 text-green-800 border-green-200",
  descartado: "bg-gray-100 text-gray-800 border-gray-200",
};

export const PRIORITY_LABELS = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export const PRIORITY_COLORS = {
  alta: "bg-red-100 text-red-800 border-red-200",
  media: "bg-yellow-100 text-yellow-800 border-yellow-200",
  baja: "bg-green-100 text-green-800 border-green-200",
};
