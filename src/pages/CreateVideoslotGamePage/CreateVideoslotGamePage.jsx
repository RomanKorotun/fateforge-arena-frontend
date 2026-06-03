//==================================================================================================

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import "./CreateVideoslotGamePage.css";

// import { profileStore } from "../../store/profileStore";
// import { videoslotStore } from "../../store/videoslotStore";

// /* ================= PAYLINES ================= */
// const PAYLINES_CONFIG = {
//   1: [1, 1, 1, 1, 1],
//   2: [0, 0, 0, 0, 0],
//   3: [2, 2, 2, 2, 2],
//   4: [0, 1, 2, 1, 0],
//   5: [2, 1, 0, 1, 2],
//   6: [0, 0, 1, 2, 2],
//   7: [2, 2, 1, 0, 0],
//   8: [1, 0, 0, 0, 1],
//   9: [1, 2, 2, 2, 1],
//   10: [0, 1, 1, 1, 0],
//   11: [2, 1, 1, 1, 2],
//   12: [0, 2, 0, 2, 0],
//   13: [2, 0, 2, 0, 2],
//   14: [1, 0, 1, 2, 1],
//   15: [1, 2, 1, 0, 1],
// };

// const SYMBOLS = {
//   1: "🍒",
//   2: "🍋",
//   3: "🔔",
//   4: "💎",
//   5: "7️⃣",
//   99: "⭐",
// };

// const LINE_SHOW_TIME = 3000;
// const ROWS = 3;

// const fakeColumn = () =>
//   Array.from({ length: ROWS }, () => Math.floor(Math.random() * 5) + 1);

// export default function CreateVideoslotGamePage() {
//   const { fetchWallets } = profileStore();
//   const wallets = profileStore((s) => s.wallets);
//   const { playSpin } = videoslotStore();

//   const navigate = useNavigate();

//   const [showingLines, setShowingLines] = useState(false);
//   const [walletId, setWalletId] = useState("");
//   const [bet, setBet] = useState("");
//   const [lines, setLines] = useState([]);

//   const [grid, setGrid] = useState(
//     Array.from({ length: 5 }, () => fakeColumn()),
//   );

//   const [spinning, setSpinning] = useState(false);
//   const [win, setWin] = useState(null);
//   const [activeLine, setActiveLine] = useState(null);

//   useEffect(() => {
//     fetchWallets();
//   }, [fetchWallets]);

//   useEffect(() => {
//     if (wallets?.length && !walletId) {
//       // eslint-disable-next-line react-hooks/set-state-in-effect
//       setWalletId(wallets[0].id);
//     }
//   }, [wallets, walletId]);

//   const toggleLine = (id) => {
//     setLines((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
//   };

//   const selectAll = () => setLines(Array.from({ length: 15 }, (_, i) => i + 1));

//   const clearAll = () => setLines([]);

//   const isWinningCell = (c, r) => {
//     if (!activeLine) return false;
//     return PAYLINES_CONFIG[activeLine.lineId][c] === r;
//   };

//   /* ================= INPUT ================= */
//   const handleBetChange = (e) => {
//     let value = e.target.value;

//     // тільки цифри
//     value = value.replace(/\D/g, "");

//     // прибрати нулі на старті
//     value = value.replace(/^0+/, "");

//     setBet(value);
//   };

//   /* ================= SPIN ================= */
//   const spin = async () => {
//     if (spinning) return;

//     const betNumber = Number(bet);

//     if (!bet || betNumber <= 0) {
//       toast.error("Введіть коректну суму ставки");
//       return;
//     }

//     if (!lines.length) {
//       toast.error("Оберіть хоча б одну лінію");
//       return;
//     }

//     setSpinning(true);
//     setWin(null);
//     setActiveLine(null);

//     const interval = setInterval(() => {
//       setGrid((prev) => prev.map(() => fakeColumn()));
//     }, 100);

//     const result = await playSpin({
//       walletId,
//       bet: betNumber,
//       lines,
//     });

//     setTimeout(() => {
//       clearInterval(interval);

//       const fixedGrid = result.grid[0].map((_, colIndex) =>
//         result.grid.map((row) => row[colIndex]),
//       );

//       setGrid(fixedGrid);
//       setWin(result);
//       setSpinning(false);
//       fetchWallets();

//       if (result.winningLines?.length) {
//         setShowingLines(true);
//       } else {
//         setShowingLines(false);
//       }

//       let i = 0;
//       const intervalLines = setInterval(() => {
//         if (!result.winningLines?.length || i >= result.winningLines.length) {
//           clearInterval(intervalLines);
//           setActiveLine(null);
//           setShowingLines(false);
//           return;
//         }

//         setActiveLine(result.winningLines[i]);
//         i++;
//       }, LINE_SHOW_TIME);
//     }, 2000);
//   };

//   const betAmount = Number(win?.betAmount || bet || 0);
//   const totalWin = Number(win?.totalWin || 0);
//   const profit = totalWin - betAmount;

//   return (
//     <div className="page">
//       <div className="game-nav">
//         <button
//           className="game-nav-btn"
//           onClick={() => navigate("/dashboard/videoslot")}
//         >
//           ⬅ Back to Videoslot
//         </button>

//         <button className="game-nav-btn" onClick={() => navigate("/dashboard")}>
//           ⬅ Back to Profile
//         </button>
//       </div>

//       <div className="slot">
//         <div className="topbar">🎰 Videoslot room</div>

//         <div className="controlRow">
//           <div className="walletBox">
//             <div className="label">Wallet</div>
//             <select
//               className="input"
//               value={walletId}
//               onChange={(e) => setWalletId(e.target.value)}
//             >
//               {wallets?.map((w) => (
//                 <option key={w.id} value={w.id}>
//                   {w.currency} | {Number(w.balance).toFixed(2)}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="betBox">
//             <div className="label">Bet</div>
//             <input
//               className="input"
//               value={bet}
//               onChange={handleBetChange}
//               inputMode="numeric"
//             />
//           </div>
//         </div>

//         {/* MACHINE */}
//         <div className="machineWrapper">
//           <div className="machine">
//             {grid.map((col, i) => (
//               <div className="viewport" key={i}>
//                 <div className="strip">
//                   {col.map((s, j) => (
//                     <div
//                       key={j}
//                       className={`cell ${isWinningCell(i, j) ? "winCell" : ""}`}
//                     >
//                       {SYMBOLS[s]}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {activeLine && (
//             <svg className="paylineOverlay" viewBox="0 0 550 180">
//               {(() => {
//                 const path = PAYLINES_CONFIG[activeLine.lineId]
//                   .map((row, x) => {
//                     const px = x * 110 + 50;
//                     const py = row * 60 + 30;
//                     return `${x === 0 ? "M" : "L"} ${px} ${py}`;
//                   })
//                   .join(" ");

//                 return (
//                   <path d={path} stroke="gold" strokeWidth="4" fill="none" />
//                 );
//               })()}
//             </svg>
//           )}
//         </div>

//         {/* RESULT */}
//         <div className="resultBox">
//           <div className={`resultInner ${activeLine ? "show" : ""}`}>
//             <div className="lineInfo">
//               {activeLine
//                 ? `LINE ${activeLine.lineId} • WIN ${activeLine.winAmount}`
//                 : ""}
//             </div>

//             <div className="lineHint">
//               {activeLine
//                 ? `Path: ${PAYLINES_CONFIG[activeLine.lineId].join(" → ")}`
//                 : ""}
//             </div>
//           </div>
//         </div>

//         {/* PAYLINES */}
//         <div className="paylinesPanel">
//           <div className="paylinesTitle">PAYLINES</div>

//           <div className="paylinesGrid">
//             {Array.from({ length: 15 }, (_, i) => i + 1).map((l) => (
//               <div
//                 key={l}
//                 className={`paylineBox ${lines.includes(l) ? "active" : ""}`}
//                 onClick={() => toggleLine(l)}
//               >
//                 {l}
//               </div>
//             ))}
//           </div>

//           <div className="paylinesActions">
//             <button className="btn" onClick={selectAll}>
//               ALL
//             </button>
//             <button className="btn" onClick={clearAll}>
//               CLEAR
//             </button>
//           </div>
//         </div>

//         <button
//           className="spin"
//           onClick={spin}
//           disabled={spinning || showingLines}
//         >
//           {spinning ? "SPINNING..." : "PLAY"}
//         </button>

//         <div className="winUnderButton">
//           {win ? (
//             <>
//               <div>💥 WIN: {totalWin.toFixed(2)}</div>
//               <div>💰 BET: {betAmount.toFixed(2)}</div>
//               <div style={{ color: profit >= 0 ? "#00ff88" : "#ff4d4d" }}>
//                 📈 PROFIT: {profit.toFixed(2)}
//               </div>
//             </>
//           ) : (
//             " "
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

//==================================================================================================

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./CreateVideoslotGamePage.css";

import { profileStore } from "../../store/profileStore";
import { videoslotStore } from "../../store/videoslotStore";

/* ================= PAYLINES ================= */
const PAYLINES_CONFIG = {
  1: [1, 1, 1, 1, 1],
  2: [0, 0, 0, 0, 0],
  3: [2, 2, 2, 2, 2],
  4: [0, 1, 2, 1, 0],
  5: [2, 1, 0, 1, 2],
  6: [0, 0, 1, 2, 2],
  7: [2, 2, 1, 0, 0],
  8: [1, 0, 0, 0, 1],
  9: [1, 2, 2, 2, 1],
  10: [0, 1, 1, 1, 0],
  11: [2, 1, 1, 1, 2],
  12: [0, 2, 0, 2, 0],
  13: [2, 0, 2, 0, 2],
  14: [1, 0, 1, 2, 1],
  15: [1, 2, 1, 0, 1],
};

const SYMBOLS = {
  1: "🍒",
  2: "🍋",
  3: "🔔",
  4: "💎",
  5: "7️⃣",
  99: "⭐",
};

const LINE_SHOW_TIME = 3000;
const ROWS = 3;

const fakeColumn = () =>
  Array.from({ length: ROWS }, () => Math.floor(Math.random() * 5) + 1);

export default function CreateVideoslotGamePage() {
  const { fetchWallets } = profileStore();
  const wallets = profileStore((s) => s.wallets);
  const { playSpin, fetchCurrentSession } = videoslotStore();
  const currentGameSession = videoslotStore((s) => s.currentGameSession);
  // const sessionWallet = wallets?.find(
  //   (w) => w.id === currentGameSession?.walletId,
  // );
  const sessionWallet = useMemo(() => {
    return wallets?.find((w) => w.id === currentGameSession?.walletId);
  }, [wallets, currentGameSession]);

  const navigate = useNavigate();

  const [showingLines, setShowingLines] = useState(false);
  const [walletId, setWalletId] = useState("");
  const [bet, setBet] = useState("");
  const [lines, setLines] = useState([]);

  const [grid, setGrid] = useState(
    Array.from({ length: 5 }, () => fakeColumn()),
  );

  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(null);
  const [activeLine, setActiveLine] = useState(null);

  useEffect(() => {
    fetchWallets();
    fetchCurrentSession();
  }, [fetchWallets, fetchCurrentSession]);

  // useEffect(() => {
  //   if (wallets?.length && !walletId) {
  //     // eslint-disable-next-line react-hooks/set-state-in-effect
  //     setWalletId(wallets[0].id);
  //   }
  // }, [wallets, walletId]);
  useEffect(() => {
    if (
      currentGameSession?.walletId &&
      currentGameSession.walletId !== walletId
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWalletId(currentGameSession.walletId);
    }
  }, [currentGameSession, walletId]);

  const toggleLine = (id) => {
    setLines((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const selectAll = () => setLines(Array.from({ length: 15 }, (_, i) => i + 1));

  const clearAll = () => setLines([]);

  const isWinningCell = (c, r) => {
    if (!activeLine) return false;
    return PAYLINES_CONFIG[activeLine.lineId][c] === r;
  };

  /* ================= INPUT ================= */
  const handleBetChange = (e) => {
    let value = e.target.value;

    // тільки цифри
    value = value.replace(/\D/g, "");

    // прибрати нулі на старті
    value = value.replace(/^0+/, "");

    setBet(value);
  };

  /* ================= SPIN ================= */
  const spin = async () => {
    if (spinning) return;

    const betNumber = Number(bet);

    if (!bet || betNumber <= 0) {
      toast.error("Введіть коректну суму ставки");
      return;
    }

    if (!lines.length) {
      toast.error("Оберіть хоча б одну лінію");
      return;
    }

    setSpinning(true);
    setWin(null);
    setActiveLine(null);

    const interval = setInterval(() => {
      setGrid((prev) => prev.map(() => fakeColumn()));
    }, 100);

    const result = await playSpin({
      walletId,
      bet: betNumber,
      lines,
    });

    setTimeout(() => {
      clearInterval(interval);

      const fixedGrid = result.grid[0].map((_, colIndex) =>
        result.grid.map((row) => row[colIndex]),
      );

      setGrid(fixedGrid);
      setWin(result);
      setSpinning(false);
      fetchWallets();

      if (result.winningLines?.length) {
        setShowingLines(true);
      } else {
        setShowingLines(false);
      }

      let i = 0;
      const intervalLines = setInterval(() => {
        if (!result.winningLines?.length || i >= result.winningLines.length) {
          clearInterval(intervalLines);
          setActiveLine(null);
          setShowingLines(false);
          return;
        }

        setActiveLine(result.winningLines[i]);
        i++;
      }, LINE_SHOW_TIME);
    }, 2000);
  };

  const betAmount = Number(win?.betAmount || bet || 0);
  const totalWin = Number(win?.totalWin || 0);
  const profit = totalWin - betAmount;

  return (
    <div className="page">
      <div className="game-nav">
        <button
          className="game-nav-btn"
          onClick={() => navigate("/dashboard/videoslot")}
        >
          ⬅ Back to Videoslot
        </button>

        <button className="game-nav-btn" onClick={() => navigate("/dashboard")}>
          ⬅ Back to Profile
        </button>
      </div>

      <div className="slot">
        <div className="topbar">🎰 Videoslot room</div>

        <div className="controlRow">
          <div className="walletBox">
            <div className="label">Wallet</div>
            {/* <select
              className="input"
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
            >
              {wallets?.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.currency} | {Number(w.balance).toFixed(2)}
                </option>
              ))}
            </select> */}
            <select className="input" value={walletId} disabled>
              {sessionWallet && (
                <option value={sessionWallet.id}>
                  {sessionWallet.currency} |{" "}
                  {Number(sessionWallet.balance).toFixed(2)}
                </option>
              )}
            </select>
          </div>

          <div className="betBox">
            <div className="label">Bet</div>
            <input
              className="input"
              value={bet}
              onChange={handleBetChange}
              inputMode="numeric"
            />
          </div>
        </div>

        {/* MACHINE */}
        <div className="machineWrapper">
          <div className="machine">
            {grid.map((col, i) => (
              <div className="viewport" key={i}>
                <div className="strip">
                  {col.map((s, j) => (
                    <div
                      key={j}
                      className={`cell ${isWinningCell(i, j) ? "winCell" : ""}`}
                    >
                      {SYMBOLS[s]}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {activeLine && (
            <svg className="paylineOverlay" viewBox="0 0 550 180">
              {(() => {
                const path = PAYLINES_CONFIG[activeLine.lineId]
                  .map((row, x) => {
                    const px = x * 110 + 50;
                    const py = row * 60 + 30;
                    return `${x === 0 ? "M" : "L"} ${px} ${py}`;
                  })
                  .join(" ");

                return (
                  <path d={path} stroke="gold" strokeWidth="4" fill="none" />
                );
              })()}
            </svg>
          )}
        </div>

        {/* RESULT */}
        <div className="resultBox">
          <div className={`resultInner ${activeLine ? "show" : ""}`}>
            <div className="lineInfo">
              {activeLine
                ? `LINE ${activeLine.lineId} • WIN ${activeLine.winAmount}`
                : ""}
            </div>

            <div className="lineHint">
              {activeLine
                ? `Path: ${PAYLINES_CONFIG[activeLine.lineId].join(" → ")}`
                : ""}
            </div>
          </div>
        </div>

        {/* PAYLINES */}
        <div className="paylinesPanel">
          <div className="paylinesTitle">PAYLINES</div>

          <div className="paylinesGrid">
            {Array.from({ length: 15 }, (_, i) => i + 1).map((l) => (
              <div
                key={l}
                className={`paylineBox ${lines.includes(l) ? "active" : ""}`}
                onClick={() => toggleLine(l)}
              >
                {l}
              </div>
            ))}
          </div>

          <div className="paylinesActions">
            <button className="btn" onClick={selectAll}>
              ALL
            </button>
            <button className="btn" onClick={clearAll}>
              CLEAR
            </button>
          </div>
        </div>

        <button
          className="spin"
          onClick={spin}
          disabled={spinning || showingLines}
        >
          {spinning ? "SPINNING..." : "PLAY"}
        </button>

        <div className="winUnderButton">
          {win ? (
            <>
              <div>💥 WIN: {totalWin.toFixed(2)}</div>
              <div>💰 BET: {betAmount.toFixed(2)}</div>
              <div style={{ color: profit >= 0 ? "#00ff88" : "#ff4d4d" }}>
                📈 PROFIT: {profit.toFixed(2)}
              </div>
            </>
          ) : (
            " "
          )}
        </div>
      </div>
    </div>
  );
}

//==================================================================================================
