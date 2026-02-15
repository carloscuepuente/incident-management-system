import responseUtils from "../utils/response.utils.js";

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return responseUtils.badRequest(res, "Error de validación", errors);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return responseUtils.badRequest(
      res,
      `El valor para el campo ${field} ya existe`,
    );
  }

  if (err.name === "JsonWebTokenError") {
    return responseUtils.unauthorized(res, "Token de autenticación inválido");
  }

  if (err.name === "TokenExpiredError") {
    return responseUtils.unauthorized(res, "Token de autenticación expirado");
  }

  return responseUtils.error(
    res,
    err.message || "Error interno del servidor",
    err.statusCode || 500,
  );
};

export default errorHandler;
