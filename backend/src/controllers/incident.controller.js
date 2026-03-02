import incidentService from "../services/incident.service.js";
import responseUtils from "../utils/response.utils.js";

class IncidentController {
  createIncident = async (req, res, next) => {
    try {
      const incidentData = req.body;
      const riderId = req.user._id;
      const incident = await incidentService.createIncident(
        incidentData,
        riderId,
      );

      return responseUtils.success(res, incident, "Incidencia creada", 200);
    } catch (error) {
      next(error);
    }
  };

  getAllIncidents = async (req, res, next) => {
    try {
      const filters = {
        status: req.query.status,
        priority: req.query.priority,
        type: req.query.type,
        search: req.query.search,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      };

      const incidents = await incidentService.getAllIncidents(filters);

      return responseUtils.success(
        res,
        incidents,
        "Incidencias obtenidas exitosamente",
      );
    } catch (error) {
      next(error);
    }
  };

  getIncidentById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const incident = await incidentService.getIncidentById(id);

      return responseUtils.success(
        res,
        incident,
        "Incidencia obtenida exitosamente",
      );
    } catch (error) {
      next(error);
    }
  };

  getRiderIncidents = async (req, res, next) => {
    try {
      const riderId = req.user._id;
      const incidents = await incidentService.getRiderIncidents(riderId);

      return responseUtils.success(
        res,
        incidents,
        "Incidencias obtenidas exitosamente",
      );
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user._id;

      const incident = await incidentService.updateStatus(id, status, userId);

      return responseUtils.success(
        res,
        incident,
        "Estado actualizado exitosamente",
      );
    } catch (error) {
      next(error);
    }
  };

  updatePriority = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { priority } = req.body;
      const userId = req.user._id;

      const incident = await incidentService.updatePriority(
        id,
        priority,
        userId,
      );

      return responseUtils.success(
        res,
        incident,
        "Prioridad actualizada exitosamente",
      );
    } catch (error) {
      next(error);
    }
  };

  getStatistics = async (req, res, next) => {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      };

      const stats = await incidentService.getStatistics(filters);

      return responseUtils.success(
        res,
        stats,
        "Estadísticas obtenidas exitosamente",
      );
    } catch (error) {
      next(error);
    }
  };
}

export default new IncidentController();
