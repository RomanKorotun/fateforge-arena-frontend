import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import UserHeader from "../../components/UserHeader/UserHeader";
import DepositModal from "../../components/DepositModal/DepositModal";
import { profileStore } from "../../store/profileStore";

import "./DashboardPage.css";

const DashboardPage = () => {
  const wallets = profileStore((state) => state.wallets);
  const { fetchProfile } = profileStore();

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [provider, setProvider] = useState("LIQPAY");
  const [selectedWalletId, setSelectedWalletId] = useState(null);

  useEffect(() => {
    fetchProfile();
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

        <div className="dashboard-grid">
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
      </div>

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
