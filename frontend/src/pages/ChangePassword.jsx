import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authApi } from "../api/auth.api";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";

export const ChangePassword = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar error del campo que se está editando
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = "La contraseña actual es requerida";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "La nueva contraseña es requerida";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu nueva contraseña";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await authApi.changePassword(
        formData.oldPassword,
        formData.newPassword,
        formData.confirmPassword,
      );

      // Actualizar estado del usuario
      updateUser({ ...user, mustChangePassword: false });

      setSuccess(true);

      // Redirigir después de 2 segundos por temas de ux
      const role = user.role; // Guardar el rol antes de actualizar el usuario

      setTimeout(() => {
        if (role === "gestor") {
          navigate("/manager/dashboard");
        } else {
          navigate("/rider/dashboard");
        }
      }, 2000);
    } catch (err) {
      setErrors({
        submit: err.response?.data?.message || "Error al cambiar la contraseña",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Cambiar Contraseña
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {user?.mustChangePassword
                ? "Debes cambiar tu contraseña temporal antes de continuar"
                : "Actualiza tu contraseña de acceso"}
            </p>
          </div>

          {success ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                ✅ Contraseña cambiada exitosamente
              </p>
              <p className="text-sm text-green-700 mt-1">Redirigiendo...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <Input
                label="Contraseña Actual"
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                error={errors.oldPassword}
                required
                autoFocus
              />

              <Input
                label="Nueva Contraseña"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                error={errors.newPassword}
                placeholder="Mínimo 6 caracteres"
                required
              />

              <Input
                label="Confirmar Nueva Contraseña"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
              />

              {errors.submit && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              <Button type="submit" loading={loading} className="w-full">
                Cambiar Contraseña
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
