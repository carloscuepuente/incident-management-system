import { useState, useEffect } from "react";
import { Input } from "../../common/Input";
import { Button } from "../../common/Button";

export const UserForm = ({ rider = null, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  //  todo flag revisar el error de setState en useEffect, se puede hidratar el al iniciar el formData?
  useEffect(() => {
    if (rider) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        userId: rider.userId,
        name: rider.name,
        password: "", // No mostrar password en edición
      });
    }
  }, [rider]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar error del campo
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.userId.trim()) {
      newErrors.userId = "El ID de usuario es requerido";
    }

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    // Solo validar password en creación
    if (!rider) {
      if (!formData.password) {
        newErrors.password = "La contraseña es requerida";
      } else if (formData.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Si es edición, no enviar password vacío
    const dataToSubmit = { ...formData };
    if (rider && !dataToSubmit.password) {
      delete dataToSubmit.password;
    }

    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="ID de Usuario"
        type="text"
        name="userId"
        value={formData.userId}
        onChange={handleChange}
        error={errors.userId}
        placeholder="Ej: R001"
        disabled={!!rider} // No permitir cambiar userId en edición
        required
      />

      <Input
        label="Nombre Completo"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Ej: Juan Pérez"
        required
      />

      {!rider && (
        <Input
          label="Contraseña Temporal"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Mínimo 6 caracteres"
          required
        />
      )}

      {!rider && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            ℹ️ El rider deberá cambiar esta contraseña en su primer inicio de
            sesión.
          </p>
        </div>
      )}

      <div className="flex justify-end space-x-3 mt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {rider ? "Actualizar" : "Crear"} Rider
        </Button>
      </div>
    </form>
  );
};
