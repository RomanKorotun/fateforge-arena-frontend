import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { authStore } from "../../store/authStore";
import "./SettingsPage.css";
import { formatGeo } from "../../helpers/format-geo.helper";

const SettingsPage = () => {
  const navigate = useNavigate();

  const { fetchSessions, revokeSession, clearAllSessions, logoutUser } =
    authStore();

  const sessions = authStore((s) => s.sessions);
  const user = authStore((s) => s.user);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleRevoke = async (sessionId, isCurrent) => {
    try {
      if (isCurrent) {
        await logoutUser();
        navigate("/signin");
      } else {
        await revokeSession(sessionId);
      }
    } catch (err) {
      console.error("Failed to revoke session:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllSessions();
      navigate("/signin");
    } catch (err) {
      console.error("Failed to clear sessions:", err);
    }
  };

  const handleBack = () => {
    if (user?.role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="sessions-page">
      <div className="sessions-container">
        <div className="top-bar">
          <button className="back-btn" onClick={handleBack}>
            ⬅ Back to profile
          </button>
        </div>

        <h2 className="page-title">Sessions</h2>

        <div className="table-card">
          <table className="table">
            <colgroup>
              <col style={{ width: "28%" }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>Device</th>
                <th>Location</th>
                <th>IP</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {sessions.map((s) => (
                <tr
                  key={s.sessionId}
                  className={s.isCurrent ? "current-session" : ""}
                >
                  <td>
                    {s.device.browser} • {s.device.os} • {s.device.type}
                    {s.isCurrent && (
                      <span className="current-badge">(Current)</span>
                    )}
                  </td>

                  <td>{formatGeo(s.geo) || "Unknown"}</td>

                  <td>{s.ip}</td>

                  <td>{new Date(s.createdAt).toLocaleString()}</td>

                  <td>
                    <div className="action-cell">
                      <button
                        className="btn-danger"
                        onClick={() => handleRevoke(s.sessionId, s.isCurrent)}
                      >
                        End session
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Footer row з унікальним key */}
              <tr key="footer-row" className="table-footer-row">
                <td colSpan="4"></td>
                <td>
                  <div className="action-cell">
                    <button className="btn-clear-all" onClick={handleClearAll}>
                      Clear all sessions
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
