import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RoulettePage.css";

import { rouletteStore } from "../../store/rouletteStore";
import { profileStore } from "../../store/profileStore";

const RoulettePage = () => {
  const navigate = useNavigate();

  // roulette
  const activeSessions = rouletteStore((s) => s.activeSessions);
  const fetchSessions = rouletteStore((s) => s.fetchSessions);
  const createSession = rouletteStore((s) => s.createSession);
  const setSession = rouletteStore((s) => s.setSession);
  const leaveGame = rouletteStore((s) => s.leaveGame);

  // profile store
  const wallets = profileStore((s) => s.wallets);
  const fetchProfile = profileStore((s) => s.fetchProfile);

  // 🔥 GLOBAL SEED (з zustand)
  const storeSeed = profileStore((s) => s.clientSeed);
  const updateSeed = profileStore((s) => s.updateSeed);
  const createSeed = profileStore((s) => s.createSeed);
  const fetchClientSeed = profileStore((s) => s.fetchClientSeed);

  // 🔥 LOCAL INPUT STATE
  const [inputSeed, setInputSeed] = useState("");

  useEffect(() => {
    fetchSessions();
    fetchProfile();
    fetchClientSeed(); // ⬅ важливо
  }, [fetchSessions, fetchProfile, fetchClientSeed]);

  // ===== GAME =====
  const handleCreateGame = async () => {
    try {
      const session = await createSession();
      setSession(session);
      navigate(`/dashboard/roulette/game/${session.sessionId}`);
    } catch (e) {
      console.error("Create session error:", e);
    }
  };

  const handleJoinSession = (session) => {
    setSession(session);
    navigate(`/dashboard/roulette/game/${session.id}`);
  };

  const handleLeaveSession = async (sessionId) => {
    try {
      await leaveGame(sessionId);
      fetchSessions();
    } catch (e) {
      console.error("Leave session error:", e);
    }
  };

  // ===== SEED LOGIC =====
  const handleChangeSeed = async () => {
    try {
      if (!inputSeed.trim()) return;

      if (storeSeed) {
        await updateSeed(inputSeed);
      } else {
        await createSeed(inputSeed);
      }

      setInputSeed("");
    } catch (e) {
      console.error("Seed error:", e);
    }
  };

  const filteredSessions = activeSessions.filter(
    (s) => s.isActive || s.status === "active",
  );

  const handleBack = () => {
    navigate("/dashboard");
  };

  console.log(storeSeed);

  return (
    <div className="roulette-page">
      <div className="roulette-container">
        <div className="roulette-back-row">
          <button className="back-btn" onClick={handleBack}>
            ⬅ Back to profile
          </button>
        </div>

        <div className="roulette-card">
          {/* HEADER */}
          <div className="roulette-header">
            <h1 className="roulette-title">🎰 Roulette Game</h1>

            <div className="roulette-actions">
              <button
                className="roulette-create-btn"
                onClick={handleCreateGame}
              >
                + Create Game
              </button>

              <button
                className="roulette-all-btn"
                onClick={() => navigate("/sessions")}
              >
                View All Sessions
              </button>
            </div>
          </div>

          {/* WALLET */}
          <div className="wallets-row">
            {wallets.length === 0 ? (
              <span className="wallets-empty">Мої Гаманці: Немає гаманців</span>
            ) : (
              <span className="wallets-text">
                Мої Гаманці:
                {wallets.map((w) => (
                  <span key={w.id} className="wallet-item-block">
                    {w.balance} {w.currency}
                  </span>
                ))}
              </span>
            )}
          </div>

          {/* CLIENT SEED */}
          <div className="seed-box">
            <h3 className="seed-title">🎲 Client Seed</h3>

            <div className="seed-row">
              <input
                className="seed-input"
                value={inputSeed}
                onChange={(e) => setInputSeed(e.target.value)}
                placeholder="Enter client seed"
              />

              <button className="seed-btn" onClick={handleChangeSeed}>
                {storeSeed ? "Update seed" : "Create seed"}
              </button>
            </div>

            {storeSeed && (
              <div className="seed-current">
                Current seed: <span>{storeSeed}</span>
              </div>
            )}
          </div>

          {/* SESSIONS */}
          <h2>📌 Active Sessions ({filteredSessions.length})</h2>

          <div className="roulette-sessions-list">
            {filteredSessions.length === 0 ? (
              <p className="roulette-empty">No active sessions</p>
            ) : (
              filteredSessions.map((session) => (
                <div key={session.id} className="roulette-session-row">
                  <button
                    className="roulette-session-btn active"
                    onClick={() => handleJoinSession(session)}
                  >
                    {session.id} → Enter Game
                  </button>

                  <button
                    className="roulette-leave-btn"
                    onClick={() => handleLeaveSession(session.id)}
                  >
                    ✖ End Game
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoulettePage;
