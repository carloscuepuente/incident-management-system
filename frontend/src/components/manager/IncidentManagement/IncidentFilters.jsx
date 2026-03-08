import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  INCIDENT_CATEGORIES,
} from "../../../utils/constants";

export const IncidentFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== "" && v !== undefined && v !== null,
  ).length;

  //todo flag hay que hacer lo del debounce del search imput

  return (
    <div className="card mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={filters.status || ""}
            onChange={(e) => handleChange("status", e.target.value)}
            className="input-field"
          >
            <option value="">Todos</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Prioridad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prioridad
          </label>
          <select
            value={filters.priority || ""}
            onChange={(e) => handleChange("priority", e.target.value)}
            className="input-field"
          >
            <option value="">Todas</option>
            {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            value={filters.type || ""}
            onChange={(e) => handleChange("type", e.target.value)}
            className="input-field"
          >
            <option value="">Todos</option>
            {Object.entries(INCIDENT_CATEGORIES).map(([key, category]) => (
              <option key={key} value={key}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Búsqueda hay que poner el debounce */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) => handleChange("search", e.target.value)}
            placeholder="Ticket, pedido, rider..."
            className="input-field"
          />
        </div>
      </div>

      {/* Botón limpiar filtros */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Limpiar filtros ({activeFiltersCount})
          </button>
        </div>
      )}
    </div>
  );
};
