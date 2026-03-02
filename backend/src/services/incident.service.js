import { User, Incident } from "../models/index.js";
import { INCIDENT_STATUS } from "../config/constants.js";
import priorityService from "./priority.service.js";
import slaService from "./sla.service.js";

class IncidentService {
  async createIncident(incidentData, riderId) {
    const { type, subType, orderId, comment } = incidentData;

    const rider = await User.findById(riderId);
    if (!rider) {
      throw new Error("Rider no encontrado");
    }

    const priority = priorityService.calculatePriority(type, subType);

    const slaDeadline = slaService.calculateSLADeadline(priority);

    const incident = await Incident.create({
      rider: riderId,
      riderName: rider.name,
      riderId: rider.userId,
      type,
      subType,
      priority,
      orderId: orderId || undefined,
      comment: comment || undefined,
      status: INCIDENT_STATUS.NUEVO,
      slaDeadline,
      history: [
        {
          action: "created",
          user: riderId,
          userName: rider.name,
          newValue: INCIDENT_STATUS.NUEVO,
        },
      ],
    });

    return incident;
  }

  // busca todos los incidentes si no hay filtros
  // tambien actualiza el SLA en cada llamada
  // todo flag si hay muchos incidentes, hay que pensar en paginacion
  async getAllIncidents(filters = {}) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.priority) {
      query.priority = filters.priority;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.riderId) {
      query.rider = filters.riderId;
    }

    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.createdAt.$lte = new Date(filters.endDate);
      }
    }

    if (filters.search) {
      query.$or = [
        { ticketId: { $regex: filters.search, $options: "i" } },
        { orderId: { $regex: filters.search, $options: "i" } },
        { riderName: { $regex: filters.search, $options: "i" } },
      ];
    }

    const incidents = await Incident.find(query)
      .populate("rider", "userId name")
      .sort({ createdAt: -1 })
      .lean();

    // Actualizar estado de SLA breach
    const incidentsWithSLA = incidents.map((incident) => ({
      ...incident,
      slaBreached: slaService.isSLABreached(
        incident.slaDeadline,
        incident.status,
      ),
      timeRemaining: slaService.getTimeRemaining(incident.slaDeadline),
    }));

    return incidentsWithSLA;
  }

  async getRiderIncidents(riderId) {
    const incidents = await Incident.find({ rider: riderId })
      .sort({ createdAt: -1 })
      .lean();

    return incidents.map((incident) => ({
      ...incident,
      slaBreached: slaService.isSLABreached(
        incident.slaDeadline,
        incident.status,
      ),
      timeRemaining: slaService.getTimeRemaining(incident.slaDeadline),
    }));
  }

  async getIncidentById(id) {
    const incident = await Incident.findById(id)
      .populate("rider", "userId name")
      .populate("history.user", "name")
      .lean();

    if (!incident) {
      throw new Error("Incidencia no encontrada");
    }

    return {
      ...incident,
      slaBreached: slaService.isSLABreached(
        incident.slaDeadline,
        incident.status,
      ),
      timeRemaining: slaService.getTimeRemaining(incident.slaDeadline),
    };
  }

  async updateStatus(id, newStatus, userId) {
    const incident = await Incident.findById(id);
    if (!incident) {
      throw new Error("Incidencia no encontrada");
    }

    const user = await User.findById(userId);
    const previousStatus = incident.status;

    incident.status = newStatus;

    // Si se marca como resuelto o descartado, guardar fecha
    if (
      newStatus === INCIDENT_STATUS.RESUELTO ||
      newStatus === INCIDENT_STATUS.DESCARTADO
    ) {
      incident.resolvedAt = new Date();
    }

    incident.history.push({
      action: "status_changed",
      user: userId,
      userName: user.name,
      previousValue: previousStatus,
      newValue: newStatus,
    });

    await incident.save();

    return incident;
  }

  async updatePriority(id, newPriority, userId) {
    const incident = await Incident.findById(id);
    if (!incident) {
      throw new Error("Incidencia no encontada");
    }
    const user = await User.findById(userId);
    const previusPriority = incident.priority;
    incident.priority = newPriority;
    // como cambio la prioridad hay que actualizar el SLA
    incident.slaDeadline = slaService.calculateSLADeadline(
      newPriority,
      incident.createdAt,
    );

    incident.history.push({
      action: "priority_changed",
      user: userId,
      userName: user.name,
      previousValue: previusPriority,
      newValue: newPriority,
    });
    await incident.save();

    return incident;
  }

  async getStatistics(filters = {}) {
    const query = {};

    // Aplicar filtros de fecha si existen
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.createdAt.$lte = new Date(filters.endDate);
      }
    }

    const [total, byStatus, byPriority, byType, slaBreached] =
      await Promise.all([
        Incident.countDocuments(query),

        Incident.aggregate([
          { $match: query },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),

        Incident.aggregate([
          { $match: query },
          { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]),

        Incident.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),

        Incident.countDocuments({
          ...query,
          status: { $in: [INCIDENT_STATUS.NUEVO, INCIDENT_STATUS.EN_REVISION] },
          slaDeadline: { $lt: new Date() },
        }),
      ]);

    const statusStats = {};
    byStatus.forEach((item) => {
      statusStats[item._id] = item.count;
    });

    const priorityStats = {};
    byPriority.forEach((item) => {
      priorityStats[item._id] = item.count;
    });

    const typeStats = {};
    byType.forEach((item) => {
      typeStats[item._id] = item.count;
    });

    return {
      total,
      byStatus: statusStats,
      byPriority: priorityStats,
      byType: typeStats,
      slaBreached,
      activeIncidents:
        (statusStats[INCIDENT_STATUS.NUEVO] || 0) +
        (statusStats[INCIDENT_STATUS.EN_REVISION] || 0),
    };
  }

  async updateSLABreaches() {
    const activeIncidents = await Incident.find({
      status: { $in: [INCIDENT_STATUS.NUEVO, INCIDENT_STATUS.EN_REVISION] },
      slaBreached: false,
      slaDeadline: { $lt: new Date() },
    });

    const updates = activeIncidents.map((incident) => {
      incident.slaBreached = true;
      return incident.save();
    });

    await Promise.all(updates);

    return activeIncidents.length;
  }
}

export default new IncidentService();
