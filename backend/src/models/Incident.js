import mongoose from "mongoose";
import {
  INCIDENT_CATEGORIES,
  SLA_MINUTES,
  INCIDENT_STATUS,
  USER_ROLES,
} from "../config/constants.js";

const historySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: String,
  previousValue: String,
  newValue: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const incidentSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    riderName: String,
    riderId: String,

    type: {
      type: String,
      enum: Object.keys(INCIDENT_CATEGORIES),
      required: true,
    },
    subType: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["alta", "media", "baja"],
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(INCIDENT_STATUS),
      default: INCIDENT_STATUS.NUEVO,
    },

    orderId: {
      type: String,
      trim: true,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    slaDeadline: {
      type: Date,
      required: true,
    },

    slaBreached: {
      type: Boolean,
      default: false,
    },

    resolvedAt: Date,

    history: [historySchema],
  },
  {
    timestamps: true,
  },
);

// incidentSchema.index({ ticketId: 1 });
incidentSchema.index({ rider: 1 });
incidentSchema.index({ status: 1 });
incidentSchema.index({ priority: 1 });
incidentSchema.index({ createdAt: -1 });
incidentSchema.index({ slaDeadline: 1 });

// Método para verificar si se superó el SLA
//
incidentSchema.methods.checkSLABreach = function () {
  if (
    this.status === INCIDENT_STATUS.RESUELTO ||
    this.status === INCIDENT_STATUS.DESCARTADO
  ) {
    return false;
  }
  return new Date() > this.slaDeadline;
};

// Hook pre-save para generar ticketId
// todo flag si hay varios riders reportando incidentes al mismo tiempo se van a genererar tickets duplicados aqui hay race condition.
incidentSchema.pre("save", async function (next) {
  if (this.isNew) {
    const year = new Date().getFullYear();
    const count = await mongoose.model("Incident").countDocuments();
    this.ticketId = `INC-${year}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

export default mongoose.model("Incident", incidentSchema);
