// validacion basica para crear y actualizar riders
// todo cambiar a Zodo Joi para validaciones mas pro

const validateCreateRider = (req, res, next) => {
  const { userId, name, password } = req.body;
  const errors = [];

  if (!userId || userId.trim() === "") {
    errors.push("El ID de usuario es requerido");
  }

  if (!name || name.trim() === "") {
    errors.push("El nombre es requerido");
  }

  if (!password) {
    errors.push("La contraseña es requerida");
  } else if (password.length < 6) {
    errors.push("La contraseña debe tener al menos 6 caracteres");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors,
    });
  }

  next();
};

const validateUpdateRider = (req, res, next) => {
  const { name, userId } = req.body;
  const errors = [];

  if (name !== undefined && name.trim() === "") {
    errors.push("El nombre no puede estar vacío");
  }

  if (userId !== undefined && userId.trim() === "") {
    errors.push("El ID de usuario no puede estar vacío");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors,
    });
  }

  next();
};

const validateResetPassword = (req, res, next) => {
  const { newPassword } = req.body;
  const errors = [];

  if (!newPassword) {
    errors.push("La nueva contraseña es requerida");
  } else if (newPassword.length < 6) {
    errors.push("La contraseña debe tener al menos 6 caracteres");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors,
    });
  }

  next();
};

export { validateCreateRider, validateUpdateRider, validateResetPassword };
