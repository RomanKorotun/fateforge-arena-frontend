import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./BattleLeaderBoardPage.css";
import { battleStore } from "../../store/battleStore";
import { authStore } from "../../store/authStore";

const BattleLeaderBoardPage = () => {
  const navigate = useNavigate();

  const user = authStore((s) => s.user);

  const leaderboard = battleStore((s) => s.leaderboard);
  const fetchLeaderboard = battleStore((s) => s.fetchLeaderboard);
  const loading = battleStore((s) => s.loading);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <div className="bl-page">
      <div className="bl-container">
        {/* BACK */}
        <div className="bl-topbar">
          <button className="bl-back" onClick={() => navigate("/dashboard")}>
            ⬅ Back to Profile
          </button>

          <button
            className="bl-back bl-battle"
            onClick={() => navigate("/dashboard/battle")}
          >
            ⬅ Back to Battle
          </button>
        </div>

        {/* CARD */}
        <div className="bl-card">
          <div className="bl-header">
            <div>
              <h1 className="bl-title">🏆 Battle Leaderboard</h1>
              <div className="bl-subtitle">Top players by rating</div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bl-table-wrap">
            {loading ? (
              <div className="bl-empty">Loading...</div>
            ) : (
              <table className="bl-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Country</th>
                    <th>Rating</th>
                  </tr>
                </thead>

                <tbody>
                  {leaderboard.length > 0 ? (
                    leaderboard.map((u, i) => (
                      <tr
                        key={u.id}
                        className={u.id === user?.id ? "bl-me" : ""}
                      >
                        <td>{i + 1}</td>
                        <td className="bl-user">👤 {u.username}</td>
                        <td>{u.address?.country || "—"}</td>
                        <td className="bl-rating">
                          ⭐ {u.profile?.rating ?? 0}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="bl-empty">
                        No data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleLeaderBoardPage;
