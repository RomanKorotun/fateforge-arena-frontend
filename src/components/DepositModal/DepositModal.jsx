import { useState } from "react";
import { createDeposit } from "../../api/paymentApi";
import "./DepositModal.css";

const MIN = 1;

const DepositModal = ({ isOpen, onClose, provider, currencies, walletId }) => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(currencies?.[0] || "UAH");
  const [error, setError] = useState("");

  const [idempotencyKey] = useState(() => crypto.randomUUID());

  if (!isOpen) return null;

  const handleAmountChange = (e) => {
    let value = e.target.value;

    value = value.replace(/[^0-9.]/g, "");

    const parts = value.split(".");
    if (parts.length > 2) return;
    if (parts[1]?.length > 2) return;

    setAmount(value);
    setError("");
  };

  const validate = () => {
    if (!amount) return "Введіть суму";

    const num = Number(amount);

    if (Number.isNaN(num)) return "Некоректна сума";
    if (num < MIN) return `Мінімум ${MIN}`;

    return "";
  };

  const handleDeposit = async () => {
    const err = validate();

    if (err) {
      setError(err);
      return;
    }

    try {
      const res = await createDeposit(
        {
          amount: parseFloat(amount),
          currency,
          provider,
          walletId,
        },
        idempotencyKey,
      );

      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
        return;
      }

      setError("Не отримано checkoutUrl");
    } catch (e) {
      console.error(e);
      setError("Помилка створення платежу");
    }
  };

  const handleClose = () => {
    setAmount("");
    setCurrency(currencies?.[0] || "UAH");
    setError("");
    onClose();
  };

  return (
    <div className="deposit-overlay">
      <div className="deposit-modal">
        <h2>Поповнення балансу</h2>

        <div className="deposit-group">
          <label>Платіжна система</label>
          <div className="provider-box">{provider}</div>
        </div>

        <div className="deposit-group">
          <label>Валюта</label>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="deposit-select"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="deposit-group">
          <label>Сума</label>

          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={handleAmountChange}
            className="deposit-input"
            placeholder="100.00"
          />

          {error && <p className="error">{error}</p>}
        </div>

        <div className="deposit-actions">
          <button className="deposit-btn" onClick={handleDeposit}>
            Створити платіж
          </button>

          <button className="close-btn" onClick={handleClose}>
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
