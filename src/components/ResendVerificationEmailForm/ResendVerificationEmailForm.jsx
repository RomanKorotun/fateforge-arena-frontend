import { useState } from "react";

import "./ResendVerificationEmailForm.css";
import AuthTabs from "../AuthTabs/AuthTabs";

import { resendVerificationEmail } from "../../api/authApi";

const ResendVerificationEmailForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successResponse, setSuccessResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await resendVerificationEmail({ email });

      setSuccessResponse(result.message);
      setError("");
      setEmail("");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Помилка при відправці ❌";

      setError(message);
      setSuccessResponse("");
    }
  };

  return (
    <div className="resend-form-wrapper">
      <form className="resend-form" onSubmit={handleSubmit}>
        <AuthTabs />

        <label className="resend-label">Email</label>

        <input
          type="email"
          placeholder="Введіть email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
            setSuccessResponse("");
          }}
          className="resend-input"
          required
        />

        <button type="submit" className="resend-button">
          Resend verification email
        </button>

        {successResponse && (
          <div className="resend-success">{successResponse}</div>
        )}

        {error && <div className="resend-error">{error}</div>}
      </form>
    </div>
  );
};

export default ResendVerificationEmailForm;
