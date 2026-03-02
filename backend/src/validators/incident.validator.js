import { INCIDENT_CATEGORIES, INCIDENT_STATUS } from "../config/constants.js";

const validateCreateIncident = (req, res, next) => {
  const { type, subType } = req.body;
  const errors = [];

  if (!type) {
    errors.push("El tipo de incidencia es requerido");
  } else if (!INCIDENT_CATEGORIES[type]) {
    errors.push("Tipo de incidencia inválido");
  }

  if (!subType) {
    errors.push("El subtipo de incidencia es requerido");
  } else if (
    type &&
    INCIDENT_CATEGORIES[type] &&
    !INCIDENT_CATEGORIES[type].subTypes[subType]
  ) {
    errors.push("Subtipo de incidencia inválido para el tipo seleccionado");
  }

  if (req.body.comment && req.body.comment.length > 500) {
    errors.push("El comentario no puede exceder 500 caracteres");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors,
    });
  }

  next();
};

const validateUpdateStatus = (req, res, next) => {
  const { status } = req.body;
  const errors = [];

  if (!status) {
    errors.push("El estado es requerido");
  } else if (!Object.values(INCIDENT_STATUS).includes(status)) {
    errors.push("Estado inválido");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors,
    });
  }

  next();
};

const validateUpdatePriority = (req, res, next) => {
  const { priority } = req.body;
  const errors = [];

  if (!priority) {
    errors.push("La prioridad es requerida");
  } else if (!["alta", "media", "baja"].includes(priority)) {
    errors.push("Prioridad inválida");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors,
    });
  }

  next();
};

export { validateCreateIncident, validateUpdateStatus, validateUpdatePriority };
