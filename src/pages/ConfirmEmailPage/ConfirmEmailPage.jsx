import { useSearchParams, useNavigate } from "react-router-dom";

import "./ConfirmEmailPage.css";

const ConfirmEmailPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const status = params.get("status");

  return (
    <div className="confirm-email-page">
      <div className="confirm-email-card">
        {status === "success" && (
          <>
            <div className="confirm-email-icon success">✅</div>

            <h1 className="confirm-email-title">Email confirmed</h1>

            <p className="confirm-email-text">
              Your email has been successfully verified.
            </p>

            <button
              className="confirm-email-button"
              onClick={() => navigate("/signin")}
            >
              Go to Sign In
            </button>
          </>
        )}

        {status === "already_verified" && (
          <>
            <div className="confirm-email-icon info">ℹ️</div>

            <h1 className="confirm-email-title">Email already verified</h1>

            <p className="confirm-email-text">
              Your email address is already confirmed.
            </p>

            <button
              className="confirm-email-button"
              onClick={() => navigate("/signin")}
            >
              Go to Sign In
            </button>
          </>
        )}

        {status === "expired" && (
          <>
            <div className="confirm-email-icon warning">⏳</div>

            <h1 className="confirm-email-title">Link expired</h1>

            <p className="confirm-email-text">
              This confirmation link has expired.
            </p>

            <button
              className="confirm-email-button"
              onClick={() => navigate("/signup")}
            >
              Go to Sign Up
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="confirm-email-icon error">❌</div>

            <h1 className="confirm-email-title">Invalid link</h1>

            <p className="confirm-email-text">
              This confirmation link is invalid.
            </p>

            <button
              className="confirm-email-button"
              onClick={() => navigate("/signup")}
            >
              Go to Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
