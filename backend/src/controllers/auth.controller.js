import authServices from "../services/auth.services.js";
import responseUtils from "../utils/response.utils.js";

class AuthController {
  login = async (req, res, next) => {
    try {
      const { userId, password } = req.body;

      // Validación básica
      if (!userId || !password) {
        return responseUtils.badRequest(
          res,
          "Usuario y contraseña son requeridos",
        );
      }

      const result = await authServices.login(userId, password);

      return responseUtils.success(res, result, "Login exitoso");
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req, res, next) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;

      // Validaciones
      if (!oldPassword || !newPassword || !confirmPassword) {
        return responseUtils.badRequest(res, "Todos los campos son requeridos");
      }

      if (newPassword !== confirmPassword) {
        return responseUtils.badRequest(res, "Las contraseñas no coinciden");
      }

      if (newPassword.length < 6) {
        return responseUtils.badRequest(
          res,
          "La contraseña debe tener al menos 6 caracteres",
        );
      }

      await authServices.changePassword(req.user._id, oldPassword, newPassword);

      return responseUtils.success(
        res,
        null,
        "Contraseña actualizada exitosamente",
      );
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req, res, next) => {
    try {
      return responseUtils.success(
        res,
        req.user,
        "Perfil obtenido exitosamente",
      );
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();
