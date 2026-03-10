import { useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { UserList } from "../../components/manager/UserManagement/UserList";
import { UserForm } from "../../components/manager/UserManagement/UserForm";

export const UsersPage = () => {
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const [resetPassword, setResetPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const {
    riders,
    stats,
    loading: ridersLoading,
    error,
    createRider: createRiderAPI,
    updateRider: updateRiderAPI,
    resetPassword: resetPasswordAPI,
    toggleRiderStatus,
  } = useUsers(filters);

  // Búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm });
  };

  // Filtro por estado
  const handleFilterStatus = (isActive) => {
    if (filters.isActive === isActive) {
      // Remover filtro si se hace click en el mismo
      const { isActive, ...rest } = filters;
      setFilters(rest);
    } else {
      setFilters({ ...filters, isActive });
    }
  };

  // Crear rider
  const handleCreateRider = async (riderData) => {
    try {
      setLoading(true);
      await createRiderAPI(riderData);
      setShowCreateModal(false);
      showMessage("Rider creado exitosamente", "success");
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Error al crear rider",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // Editar rider
  const handleEditRider = async (riderData) => {
    try {
      setLoading(true);
      await updateRiderAPI(selectedRider._id, riderData);
      setShowEditModal(false);
      setSelectedRider(null);
      showMessage("Rider actualizado exitosamente", "success");
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Error al actualizar rider",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // Resetear contraseña
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!resetPassword || resetPassword.length < 6) {
      showMessage("La contraseña debe tener al menos 6 caracteres", "error");
      return;
    }

    try {
      setLoading(true);
      await resetPasswordAPI(selectedRider._id, resetPassword);
      setShowResetModal(false);
      setSelectedRider(null);
      setResetPassword("");
      showMessage("Contraseña reseteada exitosamente", "success");
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Error al resetear contraseña",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // Toggle status
  const handleToggleStatus = async (rider) => {
    const action = rider.isActive ? "desactivar" : "activar";
    if (!window.confirm(`¿Estás seguro de ${action} a ${rider.name}?`)) return;

    try {
      await toggleRiderStatus(rider._id, rider.isActive);
      showMessage(
        `Rider ${rider.isActive ? "desactivado" : "activado"} exitosamente`,
        "success",
      );
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Error al cambiar estado",
        "error",
      );
    }
  };

  // Mostrar mensaje temporal
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Riders</h1>
        <p className="mt-2 text-gray-600">
          Administra las cuentas de los repartidores
        </p>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Riders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-green-100 rounded-lg">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.active}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-red-100 rounded-lg">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Inactivos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.inactive}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de notificación */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Búsqueda */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o ID..."
                className="input-field"
              />
              <Button type="submit">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </Button>
            </div>
          </form>

          {/* Filtros de estado */}
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterStatus(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.isActive === true
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Activos
            </button>
            <button
              onClick={() => handleFilterStatus(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.isActive === false
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Inactivos
            </button>
          </div>

          {/* Botón crear */}
          <Button
            className="flex items-center"
            onClick={() => setShowCreateModal(true)}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nuevo Rider
          </Button>
        </div>
      </div>

      {/* Tabla de riders */}
      <div className="card">
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <UserList
            riders={riders}
            loading={ridersLoading}
            onEdit={(rider) => {
              setSelectedRider(rider);
              setShowEditModal(true);
            }}
            onResetPassword={(rider) => {
              setSelectedRider(rider);
              setShowResetModal(true);
            }}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      {/* Modal crear rider */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nuevo Rider"
      >
        <UserForm
          onSubmit={handleCreateRider}
          onCancel={() => setShowCreateModal(false)}
          loading={loading}
        />
      </Modal>

      {/* Modal editar rider */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedRider(null);
        }}
        title="Editar Rider"
      >
        <UserForm
          rider={selectedRider}
          onSubmit={handleEditRider}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedRider(null);
          }}
          loading={loading}
        />
      </Modal>

      {/* Modal resetear contraseña */}
      <Modal
        isOpen={showResetModal}
        onClose={() => {
          setShowResetModal(false);
          setSelectedRider(null);
          setResetPassword("");
        }}
        title={`Resetear contraseña - ${selectedRider?.name}`}
      >
        <form onSubmit={handleResetPasswordSubmit}>
          <Input
            label="Nueva Contraseña Temporal"
            type="password"
            value={resetPassword}
            onChange={(e) => setResetPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
            autoFocus
          />

          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ El rider deberá cambiar esta contraseña en su próximo inicio de
              sesión.
            </p>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowResetModal(false);
                setSelectedRider(null);
                setResetPassword("");
              }}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              Resetear Contraseña
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
