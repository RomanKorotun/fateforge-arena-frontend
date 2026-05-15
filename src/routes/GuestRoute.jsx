import { Navigate, Outlet } from "react-router-dom";
import { authStore } from "../store/authStore";

const GuestRoute = () => {
  const user = authStore((s) => s.user);

  if (user) {
    // redirect по ролі
    return user.role === "ADMIN" ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/dashboard" replace />
    );
  }

  return <Outlet />;
};

export default GuestRoute;
