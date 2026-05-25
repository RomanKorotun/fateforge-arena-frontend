import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateRouletteGamePage.css";
import { profileStore } from "../../store/profileStore";
import { rouletteStore } from "../../store/rouletteStore";

const numbers = Array.from({ length: 37 }, (_, i) => i);
const redNumbers = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]);

const CreateRouletteGamePage = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const wallets = profileStore((s) => s.wallets);
  const fetchProfile = profileStore((s) => s.fetchProfile);

  const placeBet = rouletteStore((s) => s.placeBet);
  const lastResult = rouletteStore((s) => s.lastResult);

  const [straightBet, setStraightBet] = useState(null);
  const [colorBet, setColorBet] = useState(null);
  const [parityBet, setParityBet] = useState(null);
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [betAmount, setBetAmount] = useState(""); // порожній рядок

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const selectedWallet =
    wallets.find((w) => w.id === selectedWalletId) || wallets[0];

  const resetBets = () => {
    setStraightBet(null);
    setColorBet(null);
    setParityBet(null);
    setBetAmount("");
  };

  const handleWalletChange = (e) => {
    setSelectedWalletId(e.target.value);
    resetBets();
  };

  const toggleStraight = (num) => {
    const numAmount = Number(betAmount);
    if (!betAmount || numAmount < 1) {
      alert("Спочатку введіть суму ставки!");
      return;
    }
    setStraightBet({ type: "STRAIGHT", value: num, amount: numAmount });
    setBetAmount("");
  };

  const toggleColor = (type) => {
    const numAmount = Number(betAmount);
    if (!betAmount || numAmount < 1) {
      alert("Спочатку введіть суму ставки!");
      return;
    }
    setColorBet({ type, amount: numAmount });
    setBetAmount("");
  };

  const toggleParity = (type) => {
    const numAmount = Number(betAmount);
    if (!betAmount || numAmount < 1) {
      alert("Спочатку введіть суму ставки!");
      return;
    }
    setParityBet({ type, amount: numAmount });
    setBetAmount("");
  };

  const handleAmountChange = (e) => {
    let newValue = e.target.value;

    // прибираємо зайві нулі спереду
    newValue = newValue.replace(/^0+/, "");

    // якщо поле стало пустим → залишаємо пустим
    if (newValue === "") {
      setBetAmount("");
      return;
    }

    let num = Number(newValue);
    if (num < 0) num = 0;

    setBetAmount(String(num));
  };

  const confirmBets = async () => {
    if (!selectedWallet) return;

    const bets = [straightBet, colorBet, parityBet].filter(Boolean);

    // якщо ставок немає → взагалі не відправляємо
    if (bets.length === 0) {
      alert("Ви не вибрали жодної ставки!");
      return;
    }

    const totalBet = bets.reduce((sum, b) => sum + b.amount, 0);

    if (bets.some((b) => b.amount < 1)) {
      alert("Ставка повинна бути більше 0!");
      return;
    }

    if (totalBet > selectedWallet.balance) {
      alert("Сума ставок перевищує баланс!");
      return;
    }

    const payload = {
      gameSessionId: sessionId,
      walletId: selectedWallet.id,
      bets,
    };
    await placeBet(payload);

    resetBets();
    await fetchProfile();
  };

  return (
    <div className="roulette-game-page">
      <div className="roulette-game-container">
        <div className="roulette-game-card">
          <div className="roulette-game-header">
            <h1 className="roulette-game-title">🎰 Roulette Room</h1>
            <div className="roulette-game-actions">
              <button
                className="roulette-game-back-btn"
                onClick={() => navigate("/dashboard/roulette")}
              >
                ⬅ Back to Roulette
              </button>

              <button
                className="roulette-game-profile-btn"
                onClick={() => navigate("/dashboard")}
              >
                ⬅ Back to Profile
              </button>
            </div>
          </div>

          <div className="roulette-wallets">
            <span className="wallets-label">Мої Гаманці:</span>
            {wallets.length === 0 ? (
              <span className="wallet-item-block">Немає гаманців</span>
            ) : (
              <select
                className="wallet-select"
                value={selectedWalletId || wallets[0].id}
                onChange={handleWalletChange}
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.balance} {w.currency}
                  </option>
                ))}
              </select>
            )}
          </div>

          <h2 className="roulette-game-subtitle">Place your bets</h2>

          <div className="roulette-game-amount-input">
            <label>Bet Amount:</label>
            <input
              type="number"
              value={betAmount}
              min={0}
              onChange={handleAmountChange}
            />
          </div>

          <div className="roulette-game-grid">
            {numbers.map((num) => {
              const isRed = redNumbers.has(num);
              const active = straightBet?.value === num;
              return (
                <button
                  key={num}
                  className={`roulette-game-cell ${num === 0 ? "green" : isRed ? "red" : "black"} ${active ? "selected" : ""}`}
                  onClick={() => toggleStraight(num)}
                >
                  {num}
                </button>
              );
            })}
          </div>

          <div className="roulette-game-extra-bets">
            <button
              className={`roulette-game-option-btn ${colorBet?.type === "RED" ? "selected" : ""}`}
              onClick={() => toggleColor("RED")}
            >
              Red
            </button>
            <button
              className={`roulette-game-option-btn ${colorBet?.type === "BLACK" ? "selected" : ""}`}
              onClick={() => toggleColor("BLACK")}
            >
              Black
            </button>
          </div>

          <div className="roulette-game-extra-bets">
            <button
              className={`roulette-game-option-btn ${parityBet?.type === "EVEN" ? "selected" : ""}`}
              onClick={() => toggleParity("EVEN")}
            >
              Even
            </button>
            <button
              className={`roulette-game-option-btn ${parityBet?.type === "ODD" ? "selected" : ""}`}
              onClick={() => toggleParity("ODD")}
            >
              Odd
            </button>
          </div>

          <div className="roulette-game-bets-list">
            <h3 className="roulette-game-section-title">Selected Bets:</h3>
            {[straightBet, colorBet, parityBet].filter(Boolean).length === 0 ? (
              <p className="roulette-game-empty">No bets selected</p>
            ) : (
              <>
                {[straightBet, colorBet, parityBet]
                  .filter(Boolean)
                  .map((b, idx) => (
                    <div key={idx} className="roulette-game-bet-item">
                      <span>
                        {b.type} {b.value !== undefined ? `(${b.value})` : ""}
                      </span>
                      <span>
                        💰 {b.amount} {selectedWallet?.currency}
                      </span>
                    </div>
                  ))}

                <div className="roulette-game-total">
                  <strong>
                    Total:{" "}
                    {[straightBet, colorBet, parityBet]
                      .filter(Boolean)
                      .reduce((sum, b) => sum + b.amount, 0)}{" "}
                    {selectedWallet?.currency}
                  </strong>
                </div>
              </>
            )}
          </div>

          <button className="roulette-game-reset-btn" onClick={resetBets}>
            🔄 Очистити всі ставки
          </button>

          <button className="roulette-game-confirm-btn" onClick={confirmBets}>
            ✅ Confirm Bets
          </button>

          {lastResult && (
            <div className="roulette-result">
              <h3>🎲 Результат раунду {lastResult.round}</h3>
              <p>Випав номер: {lastResult.winNumber}</p>

              <h4>Деталі ставок:</h4>
              <ul>
                {lastResult.bets.map((b, idx) => (
                  <li key={idx} className={b.isWin ? "win" : "lose"}>
                    <span>
                      {b.betType} {b.betValue !== null ? `(${b.betValue})` : ""}
                    </span>
                    <span>
                      Ставка: {b.amount} →{" "}
                      {b.isWin ? `Виграно ${b.payoutAmount}` : "Програш"}
                    </span>
                  </li>
                ))}
              </ul>

              <h4>Підсумок:</h4>
              <p>Сума ставок: {lastResult.summary.totalBet}</p>
              <p>Сума виграша: {lastResult.summary.totalPayout}</p>
              <p>Профіт: {lastResult.summary.profit}</p>
              {(lastResult.summary.profit < 0 ||
                lastResult.summary.profit === 0) && <p>Виплати: 0</p>}
              {lastResult.summary.profit > 0 && (
                <p>Виплати: {lastResult.summary.profit}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateRouletteGamePage;
