class ResponseUtils {
  success(res, data = {}, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  error(res, message = "Error", statusCode = 500, errors = null) {
    const response = {
      success: false,
      message,
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  unauthorized(res, message = "No autorizado") {
    return this.error(res, message, 401);
  }

  forbidden(res, message = "Acceso denegado") {
    return this.error(res, message, 403);
  }

  notFound(res, message = "Recurso no encontrado") {
    return this.error(res, message, 404);
  }

  badRequest(res, message = "Petición inválida", errors = null) {
    return this.error(res, message, 400, errors);
  }
}

export default new ResponseUtils();
