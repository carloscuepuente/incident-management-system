import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/common/Button";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { Login } from "../pages/Login";
import { ChangePassword } from "../pages/ChangePassword";
import { UsersPage } from "../pages/manager/UsersPage";
import { RiderDashboard } from "../pages/rider/RiderDashboard";
import { ReportIncident } from "../pages/rider/ReportIncident";
import { ManagerDashboard } from "../pages/manager/ManagerDashboard";
import { IncidentsPage } from "../pages/manager/IncidentsPage";

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
        <Route
          path="/rider/report-incident"
          element={
            <ProtectedRoute allowedRoles={["rider"]}>
              <ReportIncident />
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

        <Route
          path="/manager/incidents"
          element={
            <ProtectedRoute allowedRoles={["gestor"]}>
              <IncidentsPage />
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
