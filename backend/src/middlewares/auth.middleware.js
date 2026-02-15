import jwtUtils from "../utils/jwt.utils.js";
import responseUtils from "../utils/response.utils.js";
import { User } from "../models/index.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return responseUtils.unauthorized(
        res,
        "Token de autenticación no proporcionado",
      );
    }

    const token = authHeader.substring(7);

    const decoded = jwtUtils.verifyToken(token);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return responseUtils.unauthorized(res, "Usuario no encontrado");
    }

    if (!user.isActive) {
      return responseUtils.forbidden(res, "El Usuario está incativo");
    }

    req.user = {
      _id: user._id,
      userId: user.userId,
      name: user.name,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    };

    next();
  } catch (error) {
    return responseUtils.unauthorized(res, error.message);
  }
};

export default authMiddleware;
