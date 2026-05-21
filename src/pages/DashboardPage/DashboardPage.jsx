import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import UserHeader from "../../components/UserHeader/UserHeader";
import DepositModal from "../../components/DepositModal/DepositModal";

import { profileStore } from "../../store/profileStore";

import "./DashboardPage.css";

// const formatDate = (date) => {
//   if (!date) return "—";
//   return new Date(date).toLocaleDateString("uk-UA", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });
// };

const DashboardPage = () => {
  // const profile = profileStore((state) => state.profile);
  // const users = profileStore((state) => state.users);
  const wallets = profileStore((state) => state.wallets);

  const fetchProfile = profileStore((state) => state.fetchProfile);
  const fetchUsers = profileStore((state) => state.fetchUsers);

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [provider, setProvider] = useState("LIQPAY");
  const [selectedWalletId, setSelectedWalletId] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchUsers();
  }, []);

  const openDeposit = (p, walletId) => {
    setProvider(p);
    setSelectedWalletId(walletId);
    setIsDepositOpen(true);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <UserHeader />

        {/* ===== ІГРОВИЙ ПРОФІЛЬ ===== */}
        <div className="dashboard-grid">
          {/* <div className="card">
            <h3>Ігровий профіль</h3>

            <div className="row">
              <span>Рейтинг:</span>
              <b>{profile?.rating}</b>
            </div>

            <div className="row">
              <span>Рівень:</span>
              <b>{profile?.level}</b>
            </div>
          </div> */}
          <div className="card">
            <h3>Мої ігри</h3>

            <div className="games-list">
              <div className="game-item">
                <div className="game-info">
                  <span className="game-icon">🎲</span>
                  <span className="game-name">Рулетка</span>
                </div>
                <Link to="/dashboard/roulette" className="game-btn">
                  Грати
                </Link>
              </div>
            </div>
          </div>

          {/* ===== ГАМАНЦІ ===== */}
          <div className="card">
            <h3>Мої Гаманці</h3>

            {wallets.length === 0 ? (
              <p>Немає гаманців</p>
            ) : (
              <div className="wallets-list">
                {wallets.map((w) => (
                  <div key={w.id} className="wallet-item">
                    <div className="balance">
                      {w.balance} {w.currency}
                    </div>

                    <p className="wallet-text">Доступні способи поповнення:</p>

                    <div className="payment-buttons">
                      <button
                        className="payment-btn"
                        onClick={() => openDeposit("STRIPE", w.id)}
                      >
                        STRIPE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===== РЕЙТИНГ КОРИСТУВАЧІВ ===== */}
        {/* <div className="users-section">
          <div className="users-header">
            <h3>Рейтинг користувачів</h3>
            <span>{users?.length || 0} users</span>
          </div>

          <div className="users-list">
            {users?.map((user, index) => (
              <div className="user-item" key={index}>
                <div className="user-left">
                  <div className="user-pos">#{index + 1}</div>

                  <div className="user-info">
                    <div className="user-name">{user.username}</div>

                    <div className="user-meta">
                      🌍 {user.country || "Unknown country"} · 📅{" "}
                      {formatDate(user.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="user-right">
                  <div>⭐ {user.profile?.rating ?? 0}</div>
                  <div>LVL {user.profile?.level ?? 0}</div>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>

      {/* ===== МОДАЛКА ПОПОВНЕННЯ ===== */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        provider={provider}
        currencies={["UAH"]}
        walletId={selectedWalletId}
      />
    </div>
  );
};

export default DashboardPage;
