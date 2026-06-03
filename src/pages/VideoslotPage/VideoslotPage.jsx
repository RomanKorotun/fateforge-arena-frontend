// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import "./VideoslotPage.css";

// import { profileStore } from "../../store/profileStore";
// import { videoslotStore } from "../../store/videoslotStore.js";

// const VideoslotPage = () => {
//   const navigate = useNavigate();

//   const { fetchWallets } = profileStore();
//   const wallets = profileStore((s) => s.wallets);
//   const { fetchCurrentSession, createGame, endGame } = videoslotStore();
//   const currentGameSession = videoslotStore((s) => s.currentGameSession);

//   useEffect(() => {
//     fetchWallets();
//     fetchCurrentSession();
//   }, [fetchWallets, fetchCurrentSession]);

//   const handleBack = () => {
//     navigate("/dashboard");
//   };

//   const handleJoinSession = (session) => {
//     navigate(`/dashboard/videoslot/game/${session.gameId}`);
//   };

//   const handleCreateGame = async () => {
//     if (currentGameSession) {
//       toast.warning(
//         "У вас уже є активна ігрова сесія. Завершіть її перед створенням нової.",
//         { duration: 5000 },
//       );
//       return;
//     }
//     try {
//       const session = await createGame();
//       navigate(`/dashboard/videoslot/game/${session.gameId}`);
//     } catch (e) {
//       console.error("Create session error:", e);
//     }
//   };

//   const handleEndGame = async () => {
//     if (!currentGameSession) return;

//     try {
//       await endGame(currentGameSession.gameId);

//       toast.success("Сесію успішно завершено");
//     } catch (err) {
//       console.error(err);

//       toast.error("Не вдалося завершити сесію");
//     }
//   };

//   const handleAllSessions = () => {
//     navigate(`/dashboard/videoslot/history`);
//   };

//   return (
//     <div className="vs-page">
//       <div className="vs-container">
//         <div className="vs-back-row">
//           <button className="vs-back-btn" onClick={handleBack}>
//             ⬅ Back to profile
//           </button>
//         </div>

//         <div className="vs-card">
//           {/* HEADER */}
//           <div className="vs-header">
//             <h1 className="vs-title">🎰 Video Slot Game</h1>

//             <div className="vs-actions">
//               <button className="vs-create-btn" onClick={handleCreateGame}>
//                 + Create Game
//               </button>

//               <button className="vs-all-btn" onClick={handleAllSessions}>
//                 View All Sessions
//               </button>
//             </div>
//           </div>

//           <div className="vs-wallets-row">
//             {wallets.length === 0 ? (
//               <span className="vs-wallets-empty">
//                 Мої Гаманці: Немає гаманців
//               </span>
//             ) : (
//               <span className="vs-wallets-text">
//                 Мої Гаманці:
//                 {wallets.map((w) => (
//                   <span key={w.id} className="vs-wallet-item">
//                     {w.balance} {w.currency}
//                   </span>
//                 ))}
//               </span>
//             )}
//           </div>

//           <h2>📌 Active Session</h2>

//           <div className="vs-sessions-list">
//             {!currentGameSession ? (
//               <p className="vs-empty">No active session</p>
//             ) : (
//               <div key={currentGameSession.gameId} className="vs-session-row">
//                 <button
//                   className="vs-session-btn"
//                   onClick={() => handleJoinSession(currentGameSession)}
//                 >
//                   {currentGameSession.gameId} → Enter Game
//                 </button>
//                 <button className="vs-end-btn" onClick={handleEndGame}>
//                   ✖ End Game
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoslotPage;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./VideoslotPage.css";

import { profileStore } from "../../store/profileStore";
import { videoslotStore } from "../../store/videoslotStore.js";

const VideoslotPage = () => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState(null);

  const navigate = useNavigate();
  const { fetchWallets } = profileStore();
  const wallets = profileStore((s) => s.wallets);
  const { fetchCurrentSession, createGame, endGame } = videoslotStore();
  const currentGameSession = videoslotStore((s) => s.currentGameSession);

  useEffect(() => {
    fetchWallets();
    fetchCurrentSession();
  }, [fetchWallets, fetchCurrentSession]);

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleJoinSession = (session) => {
    navigate(`/dashboard/videoslot/game/${session.gameId}`);
  };

  // const handleCreateGame = async () => {
  //   if (currentGameSession) {
  //     toast.warning(
  //       "У вас уже є активна ігрова сесія. Завершіть її перед створенням нової.",
  //       { duration: 5000 },
  //     );
  //     return;
  //   }
  //   try {
  //     const session = await createGame();
  //     navigate(`/dashboard/videoslot/game/${session.gameId}`);
  //   } catch (e) {
  //     console.error("Create session error:", e);
  //   }
  // };
  const handleCreateGame = () => {
    if (currentGameSession) {
      toast.warning(
        "У вас уже є активна ігрова сесія. Завершіть її перед створенням нової.",
        { duration: 5000 },
      );
      return;
    }

    setShowWalletModal(true);
  };

  const handleConfirmCreateGame = async () => {
    if (!selectedWalletId) {
      toast.error("Оберіть гаманець");
      return;
    }

    try {
      const session = await createGame(selectedWalletId);

      setShowWalletModal(false);

      navigate(`/dashboard/videoslot/game/${session.gameId}`);
    } catch (e) {
      console.error("Create session error:", e);
    }
  };

  const handleEndGame = async () => {
    if (!currentGameSession) return;

    try {
      await endGame(currentGameSession.gameId);

      toast.success("Сесію успішно завершено");
    } catch (err) {
      console.error(err);

      toast.error("Не вдалося завершити сесію");
    }
  };

  const handleAllSessions = () => {
    navigate(`/dashboard/videoslot/history`);
  };

  return (
    <div className="vs-page">
      <div className="vs-container">
        <div className="vs-back-row">
          <button className="vs-back-btn" onClick={handleBack}>
            ⬅ Back to profile
          </button>
        </div>

        <div className="vs-card">
          {/* HEADER */}
          <div className="vs-header">
            <h1 className="vs-title">🎰 Video Slot Game</h1>

            <div className="vs-actions">
              <button className="vs-create-btn" onClick={handleCreateGame}>
                + Create Game
              </button>

              <button className="vs-all-btn" onClick={handleAllSessions}>
                View All Sessions
              </button>
            </div>
          </div>

          <div className="vs-wallets-row">
            {wallets.length === 0 ? (
              <span className="vs-wallets-empty">
                Мої Гаманці: Немає гаманців
              </span>
            ) : (
              <span className="vs-wallets-text">
                Мої Гаманці:
                {wallets.map((w) => (
                  <span key={w.id} className="vs-wallet-item">
                    {w.balance} {w.currency}
                  </span>
                ))}
              </span>
            )}
          </div>

          <h2>📌 Active Session</h2>

          <div className="vs-sessions-list">
            {!currentGameSession ? (
              <p className="vs-empty">No active session</p>
            ) : (
              <div key={currentGameSession.gameId} className="vs-session-row">
                <button
                  className="vs-session-btn"
                  onClick={() => handleJoinSession(currentGameSession)}
                >
                  {currentGameSession.gameId} → Enter Game
                </button>
                <button className="vs-end-btn" onClick={handleEndGame}>
                  ✖ End Game
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showWalletModal && (
        <div className="vs-modal-overlay">
          <div className="vs-modal">
            <h3>Оберіть гаманець</h3>

            <div className="vs-wallet-list">
              {wallets.map((wallet) => (
                <label key={wallet.id} className="vs-wallet-option">
                  <input
                    type="radio"
                    name="wallet"
                    value={wallet.id}
                    checked={selectedWalletId === wallet.id}
                    onChange={() => setSelectedWalletId(wallet.id)}
                  />
                  {wallet.balance} {wallet.currency}
                </label>
              ))}
            </div>

            <div className="vs-modal-actions">
              <button
                onClick={() => {
                  setShowWalletModal(false);
                  setSelectedWalletId(null);
                }}
              >
                Cancel
              </button>

              <button onClick={handleConfirmCreateGame}>Create Session</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoslotPage;
