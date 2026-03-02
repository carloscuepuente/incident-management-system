import express from "express";
import incidentController from "../controllers/incident.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import requireRole from "../middlewares/role.middleware.js";
import {
  validateCreateIncident,
  validateUpdateStatus,
  validateUpdatePriority,
} from "../validators/incident.validator.js";

const router = express.Router();

// todas las rutas requieren que el usuario este autenticado
router.use(authMiddleware);

// ruta completa /api/incidents/stats
router.get("/stats", requireRole("gestor"), incidentController.getStatistics);

// ruta completa /api/incidents/mis-incidencias
router.get(
  "/mis-incidencias",
  requireRole("rider"),
  incidentController.getRiderIncidents,
);

// ruta completa /api/incidents
router.post(
  "/",
  requireRole("rider"),
  validateCreateIncident,
  incidentController.createIncident,
);
router.get("/", requireRole("gestor"), incidentController.getAllIncidents);

// ruta completa /api/incidents/:id
router.get("/:id", incidentController.getIncidentById);

// ruta completa /api/incidents/:id/status
router.patch(
  "/:id/status",
  requireRole("gestor"),
  validateUpdateStatus,
  incidentController.updateStatus,
);

// ruta completa /api/incidents/:id/priority
router.patch(
  "/:id/priority",
  requireRole("gestor"),
  validateUpdatePriority,
  incidentController.updatePriority,
);

export default router;
