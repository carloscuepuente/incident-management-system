import responseUtils from "../utils/response.utils.js";

const requireRole = (...requireRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return responseUtils.unauthorized(res, "El Usuarion np está autenticado");
    }
    if (!requireRoles.includes(req.user.role)) {
      return responseUtils.forbidden(
        res,
        "El usuario no tiene permisos para acceder a este recurso",
      );
    }
    next();
  };
};

export default requireRole;
