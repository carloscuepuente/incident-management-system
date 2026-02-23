import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { Login } from "../pages/Login";
import { ChangePassword } from "../pages/ChangePassword";
import { UsersPage } from "../pages/manager/UsersPage";
import { Button } from "../components/common/Button";

const RiderDashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl">este es el Rider Dashboard placeholder</h1>
    <Button onClick={() => localStorage.clear()}>borrar localStorage</Button>
  </div>
);
const ManagerDashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl">este es el Manager Dashboard placeholder</h1>
    <Button onClick={() => localStorage.clear()}>borrar localStorage</Button>
  </div>
);

export const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />

        {/* Cambio de contraseña */}
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* Rutas de Rider */}
        <Route
          path="/rider/dashboard"
          element={
            <ProtectedRoute allowedRoles={["rider"]}>
              <RiderDashboard />
            </ProtectedRoute>
          }
        />

        {/* Rutas de Gestor */}
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute allowedRoles={["gestor"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/users"
          element={
            <ProtectedRoute allowedRoles={["gestor"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        {/* Redirección raíz */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              user?.role === "gestor" ? (
                <Navigate to="/manager/dashboard" replace />
              ) : (
                <Navigate to="/rider/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
