// import { useEffect, useState } from "react";

// import UserHeader from "../../components/UserHeader/UserHeader";
// import DepositModal from "../../components/DepositModal/DepositModal";

// import { profileStore } from "../../store/profileStore";

// import "./DashboardPage.css";

// const DashboardPage = () => {
//   const { fetchProfile } = profileStore();

//   const profile = profileStore((state) => state.profile);

//   const [isDepositOpen, setIsDepositOpen] = useState(false);

//   useEffect(() => {
//     fetchProfile();
//   }, [fetchProfile]);

//   return (
//     <div className="dashboard-page">
//       <div className="dashboard-container">
//         <UserHeader />

//         <div className="dashboard-grid">
//           {/* PROFILE */}
//           <div className="card">
//             <h3>Ігровий профіль</h3>

//             <div className="row">
//               <span>Рейтинг:</span>

//               <b>{profile?.profile?.rating}</b>
//             </div>

//             <div className="row">
//               <span>Рівень:</span>

//               <b>{profile?.profile?.level}</b>
//             </div>
//           </div>

//           {/* WALLET */}
//           <div className="card">
//             <h3>Гаманець</h3>

//             <div className="balance">
//               {profile?.wallet?.balance} {profile?.wallet?.currency}
//             </div>

//             <p className="wallet-text">Доступні способи поповнення:</p>

//             <div className="payment-buttons">
//               <button
//                 className="payment-btn"
//                 onClick={() => setIsDepositOpen(true)}
//               >
//                 LiqPay
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <DepositModal
//         isOpen={isDepositOpen}
//         onClose={() => setIsDepositOpen(false)}
//         provider="LIQPAY"
//         currencies={["UAH"]}
//         walletId={profile?.wallet?.id}
//       />
//     </div>
//   );
// };

// export default DashboardPage;

import { useEffect, useState } from "react";

import UserHeader from "../../components/UserHeader/UserHeader";
import DepositModal from "../../components/DepositModal/DepositModal";

import { profileStore } from "../../store/profileStore";

import "./DashboardPage.css";

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const DashboardPage = () => {
  const profile = profileStore((state) => state.profile);
  const users = profileStore((state) => state.users);

  const fetchProfile = profileStore((state) => state.fetchProfile);
  const fetchUsers = profileStore((state) => state.fetchUsers);

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [provider, setProvider] = useState("LIQPAY");

  useEffect(() => {
    fetchProfile();
    fetchUsers();
  }, []);

  const openDeposit = (p) => {
    setProvider(p);
    setIsDepositOpen(true);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <UserHeader />

        {/* ===== ТВОЇ ІСНУЮЧІ СЕКЦІЇ (НЕ ТРОГАВ) ===== */}
        <div className="dashboard-grid">
          <div className="card">
            <h3>Ігровий профіль</h3>

            <div className="row">
              <span>Рейтинг:</span>
              <b>{profile?.profile?.rating}</b>
            </div>

            <div className="row">
              <span>Рівень:</span>
              <b>{profile?.profile?.level}</b>
            </div>
          </div>

          <div className="card">
            <h3>Гаманець</h3>

            <div className="balance">
              {profile?.wallet?.balance} {profile?.wallet?.currency}
            </div>

            <p className="wallet-text">Доступні способи поповнення:</p>

            <div className="payment-buttons">
              <button
                className="payment-btn"
                onClick={() => openDeposit("LIQPAY")}
              >
                LiqPay
              </button>

              <button
                className="payment-btn"
                onClick={() => openDeposit("WAYFORPAY")}
              >
                WayForPay
              </button>
            </div>
          </div>
        </div>

        {/* ===== НОВА СЕКЦІЯ (ДОДАНА ТІЛЬКИ ВОНА) ===== */}
        <div className="users-section">
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
        </div>
      </div>

      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        provider={provider}
        currencies={["UAH"]}
        walletId={profile?.wallet?.id}
      />
    </div>
  );
};

export default DashboardPage;
