import { useState } from "react";
import { INCIDENT_CATEGORIES } from "../../utils/constants";
import { Input } from "../common/Input";
import { Button } from "../common/Button";

export const IncidentForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    type: "",
    subType: "",
    orderId: "",
    comment: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // para resetear el subType si se cambia el type
    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        type: value,
        subType: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Limpiar error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = "Selecciona un tipo de incidencia";
    }

    if (!formData.subType) {
      newErrors.subType = "Selecciona un motivo";
    }

    if (formData.comment && formData.comment.length > 500) {
      newErrors.comment = "El comentario no puede exceder 500 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Enviar solo campos no vacíos
    const dataToSubmit = {
      type: formData.type,
      subType: formData.subType,
    };

    if (formData.orderId.trim()) {
      dataToSubmit.orderId = formData.orderId.trim();
    }

    if (formData.comment.trim()) {
      dataToSubmit.comment = formData.comment.trim();
    }
    // console.log("Datos a enviar:", dataToSubmit);

    onSubmit(dataToSubmit);
  };

  const availableSubTypes = formData.type
    ? INCIDENT_CATEGORIES[formData.type]?.subTypes || {}
    : {};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tipo de incidencia */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Qué tipo de problema tienes? *
        </label>
        <div className="grid grid-cols-1 gap-3">
          {Object.keys(INCIDENT_CATEGORIES).map((typeKey) => {
            const CategoryIcon = INCIDENT_CATEGORIES[typeKey].icon;
            return (
              <button
                key={typeKey}
                type="button"
                onClick={() =>
                  handleChange({
                    target: { name: "type", value: typeKey },
                  })
                }
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  formData.type === typeKey
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">
                    <CategoryIcon />
                  </span>
                  <span className="font-medium">
                    {INCIDENT_CATEGORIES[typeKey].label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type}</p>
        )}
      </div>

      {/* Subtipo */}
      {formData.type && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motivo específico *
          </label>
          <select
            name="subType"
            value={formData.subType}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Selecciona un motivo...</option>
            {Object.keys(availableSubTypes).map((subTypeKey) => (
              <option key={subTypeKey} value={subTypeKey}>
                {availableSubTypes[subTypeKey]}
              </option>
            ))}
          </select>
          {errors.subType && (
            <p className="mt-1 text-sm text-red-600">{errors.subType}</p>
          )}
        </div>
      )}

      {/* ID de Pedido (opcional) */}
      <Input
        label="ID de Pedido (opcional)"
        type="text"
        name="orderId"
        value={formData.orderId}
        onChange={handleChange}
        placeholder="Ej: ORD-12345"
      />

      {/* Comentario adicional */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comentario adicional (opcional)
        </label>
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Agrega más detalles si es necesario..."
          rows="3"
          maxLength="500"
          className="input-field resize-none"
        />
        <div className="flex justify-between mt-1">
          {errors.comment && (
            <p className="text-sm text-red-600">{errors.comment}</p>
          )}
          <p className="text-xs text-gray-500 ml-auto">
            {formData.comment.length}/500
          </p>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="submit" loading={loading}>
          Reportar Incidencia
        </Button>
      </div>
    </form>
  );
};
