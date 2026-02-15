import { User } from "../models/index.js";
import jwtUtils from "../utils/jwt.utils.js";

class AuthService {
  async login(userId, password) {
    const user = await User.findOne({ userId });
    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    if (!user.isActive) {
      throw new Error("El Usuario está inactivo");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Credenciales inválidas");
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwtUtils.generateToken({ userId: user._id, role: user.role });

    return {
      token,
      user: {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
    };
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswwordValid) {
      throw new Error("Contraseña incorrecta");
    }

    if (newPassword.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();

    return true;
  }

  async createDefaultAdmin() {
    try {
      const adminExists = await User.findOne({
        role: "gestor",
      });

      if (adminExists) {
        console.log("Admin ya existe");
        return;
      }

      const admin = await User.create({
        userId: process.env.DEFAULT_ADMIN_USERNAME || "admin",
        name: "Administrador",
        password: process.env.DEFAULT_ADMIN_PASSWORD || "admin123",
        role: "gestor",
        isActive: true,
        mustChangePassword: true,
      });

      console.log("Admin creado:", admin.userId);
    } catch (error) {
      console.error("Error al crear admin:", error.message);
    }
  }
}

export default new AuthService();
