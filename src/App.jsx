import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

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
import RouletteSoloPage from "./pages/RouletteSoloPage/RouletteSoloPage";
import CreateRouletteGamePage from "./pages/CreateRouletteGamePage/CreateRouletteGamePage";
import ConfirmEmailPage from "./pages/ConfirmEmailPage/ConfirmEmailPage";
// import RouletteMultiPage from "./pages/RouletteMultiPage/RouletteMultiPage";
// import JoinRouletteGamePage from "./pages/JoinRouletteGamePage/JoinRouletteGamePage";
import VideoslotPage from "./pages/VideoslotPage/VideoslotPage";
import CreateVideoslotGamePage from "./pages/CreateVideoslotGamePage/CreateVideoslotGamePage";
import GetHistoryVideoslotGamePage from "./pages/GetHistoryVideoslotGamePage/GetHistoryVideoslotGamePage";

import { authStore } from "./store/authStore";

import UserRoute from "./routes/UserRoute";
import AdminRoute from "./routes/AdminRoute";
import GuestRoute from "./routes/GuestRoute";
import { chatSocket } from "./socket/socket";

const App = () => {
  const fetchMe = authStore((s) => s.fetchMe);
  const loading = authStore((s) => s.loading);
  const user = authStore((s) => s.user);

  useEffect(() => {
    chatSocket.connect();

    return () => {
      chatSocket.disconnect();
    };
  }, []);

  // useEffect(() => {
  //   const onConnect = () => {
  //     console.log("🟢 socket connected:", chatSocket.id);
  //   };

  //   const onDisconnect = () => {
  //     console.log("🔴 socket disconnected");
  //   };

  //   chatSocket.on("connect", onConnect);
  //   chatSocket.on("disconnect", onDisconnect);

  //   chatSocket.connect();

  //   return () => {
  //     chatSocket.off("connect", onConnect);
  //     chatSocket.off("disconnect", onDisconnect);
  //     chatSocket.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        {/* <Route path=""/> */}
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
            <Route
              path="dashboard/transactions"
              element={<TransactionsPage />}
            />
            <Route path="dashboard/roulette" element={<RouletteSoloPage />} />
            <Route
              path="dashboard/roulette/game/:sessionId"
              element={<CreateRouletteGamePage />}
            />
            <Route path="dashboard/videoslot" element={<VideoslotPage />} />
            <Route
              path="dashboard/videoslot/game/:gameId"
              element={<CreateVideoslotGamePage />}
            />
            <Route
              path="dashboard/videoslot/history"
              element={<GetHistoryVideoslotGamePage />}
            />
            {/* <Route
              path="dashboard/roulette-multi"
              element={<RouletteMultiPage />}
            />
            <Route
              path="dashboard/roulette/game-multi/:roomId"
              element={<JoinRouletteGamePage />}
            /> */}
          </Route>

          {/* ADMIN */}
          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminPage />} />
            <Route path="admin/settings" element={<SettingsPage />} />
          </Route>

          {/* BLOCKED */}
          <Route path="blocked" element={<BlockedPage />} />
        </Route>
        <Route path="/confirm-email" element={<ConfirmEmailPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/deletion-policy" element={<DataDeletionPolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
