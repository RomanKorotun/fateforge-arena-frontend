import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./RestoreAccountForm.css";
import AuthTabs from "../AuthTabs/AuthTabs";
import { authStore } from "../../store/authStore";
import { ROLES } from "../../constants/roles";
import { restoreAccount } from "../../api/authApi";

const RestoreAccountForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { loginUser } = authStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await restoreAccount({ email, password });

      const user = await loginUser({ email, password });

      if (user.role === ROLES.ADMIN) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Помилка при відновленні ❌";

      if (message === "USER_BLOCKED") {
        navigate("/blocked");
        return;
      }

      setError(message);
    }
  };

  return (
    <div className="restore-form-wrapper">
      <form className="restore-form" onSubmit={handleSubmit}>
        <AuthTabs />

        <label className="restore-label">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Введіть email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          className="restore-input"
          required
        />

        <label className="restore-label">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Введіть пароль"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          className="restore-input"
          required
        />

        <button type="submit" className="restore-button">
          Відновити акаунт
        </button>

        {error && <div className="restore-error">{error}</div>}
      </form>
    </div>
  );
};

export default RestoreAccountForm;
