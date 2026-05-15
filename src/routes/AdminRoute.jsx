import { Navigate, Outlet } from "react-router-dom";
import { authStore } from "../store/authStore";

const AdminRoute = () => {
  const user = authStore((s) => s.user);
  const loading = authStore((s) => s.loading);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/signin" replace />;

  if (user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
