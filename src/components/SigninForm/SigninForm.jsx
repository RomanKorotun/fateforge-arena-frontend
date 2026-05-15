import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SigninForm.css";
import AuthTabs from "../AuthTabs/AuthTabs";
import { authStore } from "../../store/authStore";
import { ROLES } from "../../constants/roles";

const SigninForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { loginUser } = authStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser({ email, password });
      console.log("SigninForm ", user);
      if (user.role === ROLES.ADMIN) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const code = err?.response?.data?.code;
      if (code === "USER_BLOCKED") {
        navigate("/blocked");
        return;
      }
      const message =
        err?.response?.data?.message || "Помилка при реєстрації ❌";
      setError(message);
    }
  };

  return (
    <div className="signup-form-wrapper">
      <form className="signup-form" onSubmit={handleSubmit}>
        <AuthTabs />
        <label className="signup-label">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Введіть email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          className="signup-input"
          required
        />

        <label className="signup-label">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Введіть пароль"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          className="signup-input"
          required
        />

        <button type="submit" className="signup-button">
          Логін
        </button>
        {error && <div className="signup-error">{error}</div>}
      </form>
    </div>
  );
};

export default SigninForm;
