import { User } from "../models/index.js";
import { USER_ROLES } from "../config/constants.js";

class UserServices {
  async getAllRiders(filters = {}) {
    const query = { role: USER_ROLES.RIDER };

    // Filtro por estado activo/inactivo
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    // Búsqueda por nombre o userId
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { userId: { $regex: filters.search, $options: "i" } },
      ];
    }

    const riders = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    return riders;
  }

  async getRiderById(id) {
    const rider = await User.findOne({
      _id: id,
      role: USER_ROLES.RIDER,
    }).select("-password");

    if (!rider) {
      throw new Error("Rider no encontrado");
    }

    return rider;
  }

  async createRider(riderData, createdById) {
    const { userId, name, password } = riderData;

    // Verificar si el userId ya existe
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      throw new Error("El ID de usuario ya está en uso");
    }

    // Validar contraseña temporal
    if (!password || password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    // Crear rider
    const rider = await User.create({
      userId,
      name,
      password,
      role: USER_ROLES.RIDER,
      mustChangePassword: true,
      isActive: true,
      createdBy: createdById,
    });

    // Retornar sin password
    const riderObj = rider.toObject();
    delete riderObj.password;

    return riderObj;
  }

  async updateRider(id, updateData) {
    const rider = await User.findOne({
      _id: id,
      role: USER_ROLES.RIDER,
    });

    if (!rider) {
      throw new Error("Rider no encontrado");
    }

    // Validar que no se cambie el userId a uno existente
    if (updateData.userId && updateData.userId !== rider.userId) {
      const existingUser = await User.findOne({ userId: updateData.userId });
      if (existingUser) {
        throw new Error("El ID de usuario ya está en uso");
      }
    }

    // Actualizar solo campos permitidos
    const allowedUpdates = ["name", "userId", "isActive"];
    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        rider[field] = updateData[field];
      }
    });

    await rider.save();

    const riderObj = rider.toObject();
    delete riderObj.password;

    return riderObj;
  }

  async resetPassword(id, newPassword) {
    const rider = await User.findOne({
      _id: id,
      role: USER_ROLES.RIDER,
    });

    if (!rider) {
      throw new Error("Rider no encontrado");
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    rider.password = newPassword;
    rider.mustChangePassword = true;
    await rider.save();

    return true;
  }

  //(soft delete)

  async deactivateRider(id) {
    const rider = await User.findOne({
      _id: id,
      role: USER_ROLES.RIDER,
    });

    if (!rider) {
      throw new Error("Rider no encontrado");
    }

    rider.isActive = false;
    await rider.save();

    return true;
  }

  async activateRider(id) {
    const rider = await User.findOne({
      _id: id,
      role: USER_ROLES.RIDER,
    });

    if (!rider) {
      throw new Error("Rider no encontrado");
    }

    rider.isActive = true;
    await rider.save();

    return true;
  }

  async getRiderStats() {
    const total = await User.countDocuments({ role: USER_ROLES.RIDER });
    const active = await User.countDocuments({
      role: USER_ROLES.RIDER,
      isActive: true,
    });
    const inactive = total - active;

    return {
      total,
      active,
      inactive,
    };
  }
}

export default new UserServices();
