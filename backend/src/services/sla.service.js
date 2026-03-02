import { SLA_MINUTES } from "../config/constants.js";

class SLAService {
  calculateSLADeadline(priority, createdAt = new Date()) {
    const minutes = SLA_MINUTES[priority] || SLA_MINUTES.baja;
    const deadline = new Date(createdAt);
    deadline.setMinutes(deadline.getMinutes() + minutes);
    return deadline;
  }

  isSLABreached(slaDeadline, status) {
    if (status === "resuelto" || status === "descartado") {
      return false;
    }
    return new Date() > new Date(slaDeadline);
  }

  getTimeRemaining(slaDeadline) {
    const now = new Date();
    const deadline = new Date(slaDeadline);
    const diff = deadline - now;

    if (diff <= 0) {
      return { expired: true, minutes: 0 };
    }

    const minutes = Math.floor(diff / 60000);
    return { expired: false, minutes };
  }

  formatTimeRemaining(minutes) {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
}

export default new SLAService();
