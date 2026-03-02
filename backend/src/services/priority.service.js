import { INCIDENT_CATEGORIES } from "../config/constants.js";

// rule engine
class PriorityService {
  calculatePriority(type, subType) {
    try {
      const category = INCIDENT_CATEGORIES[type];
      if (!category) return "baja";

      const subTypeData = category.subTypes[subType];
      if (!subTypeData) return "baja";

      return subTypeData.priority;
    } catch (error) {
      console.error("Error calculating priority:", error);
      return "baja";
    }
  }
}

export default new PriorityService();
