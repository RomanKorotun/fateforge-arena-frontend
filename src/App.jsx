import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./Layout";

import LandingPage from "./pages/LandingPage/LandingPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import SigninPage from "./pages/SigninPage/SigninPage";

import DashboardPage from "./pages/DashboardPage/DashboardPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import TransactionsPage from "./pages/TransactionsPage/TransactionsPage";

import NotFoundPage from "./pages/NotFoundPage";
import BlockedPage from "./pages/BlockedPage/BlockedPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage/PrivacyPolicyPage";
import DataDeletionPolicyPage from "./pages/DataDeletionPolicyPage/DataDeletionPolicyPage";
import RoulettePage from "./pages/RoulettePage/RoulettePage";
import CreateRouletteGamePage from "./pages/CreateRouletteGamePage/CreateRouletteGamePage";

import { authStore } from "./store/authStore";

import UserRoute from "./routes/UserRoute";
import AdminRoute from "./routes/AdminRoute";
import GuestRoute from "./routes/GuestRoute";

const App = () => {
  const fetchMe = authStore((s) => s.fetchMe);
  const loading = authStore((s) => s.loading);
  const user = authStore((s) => s.user);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* LANDING */}
        <Route
          index
          element={
            !user ? (
              <LandingPage />
            ) : user.role === "ADMIN" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* GUEST */}
        <Route element={<GuestRoute />}>
          <Route path="signin" element={<SigninPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>

        {/* USER */}
        <Route element={<UserRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="dashboard/settings" element={<SettingsPage />} />
          <Route path="dashboard/transactions" element={<TransactionsPage />} />
          <Route path="dashboard/roulette" element={<RoulettePage />} />
          <Route
            path="dashboard/roulette/game/:sessionId"
            element={<CreateRouletteGamePage />}
          />
        </Route>

        {/* ADMIN */}
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminPage />} />
          <Route path="admin/settings" element={<SettingsPage />} />
        </Route>

        {/* BLOCKED */}
        <Route path="blocked" element={<BlockedPage />} />
      </Route>
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/deletion-policy" element={<DataDeletionPolicyPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
