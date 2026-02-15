const INCIDENT_CATEGORIES = {
  entrega: {
    label: "Problemas de entrega",
    subTypes: {
      pinchazo: { label: "Pinchazo / problema vehículo", priority: "alta" },
      tienda_cerrada: { label: "Tienda cerrada", priority: "alta" },
      retraso_preparacion: {
        label: "Pedido tarda en prepararse",
        priority: "media",
      },
      pedido_entregado_por_otro: {
        label: "Otro rider llevó el pedido",
        priority: "alta",
      },
      problema_geolocalizacion: {
        label: "Problema con ubicación",
        priority: "media",
      },
      accidente: { label: "Accidente / emergencia", priority: "alta" },
    },
  },
  tecnica: {
    label: "Problemas técnicos",
    subTypes: {
      falla_app: { label: "La app no funciona", priority: "media" },
      problema_gps: { label: "GPS no funciona", priority: "media" },
      no_puedo_marcar_entregado: {
        label: "No puedo completar pedido",
        priority: "media",
      },
    },
  },
  gestion: {
    label: "Incidencias de gestión",
    subTypes: {
      reasignacion_pedido: {
        label: "Me reasignaron un pedido",
        priority: "baja",
      },
      ausencia_turno: { label: "Ausencia a mi turno", priority: "baja" },
      conexion_tardia: { label: "Me conecté tarde", priority: "baja" },
      modificacion_horario: {
        label: "Problema con cambio de horario",
        priority: "baja",
      },
      consulta_general: { label: "Otra consulta", priority: "baja" },
    },
  },
};

const SLA_MINUTES = {
  alta: 15,
  media: 60,
  baja: 240,
};

const INCIDENT_STATUS = {
  NUEVO: "nuevo",
  EN_REVISION: "en_revision",
  RESUELTO: "resuelto",
  DESCARTADO: "descartado",
};

const USER_ROLES = {
  RIDER: "rider",
  GESTOR: "gestor",
};

export { INCIDENT_CATEGORIES, SLA_MINUTES, INCIDENT_STATUS, USER_ROLES };
