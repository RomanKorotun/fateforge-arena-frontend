import { useLocation, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaLinkedinIn, FaDiscord } from "react-icons/fa";

import SignupForm from "../../components/SignupForm/SignupForm";

import "./SignupPage.css";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const oauthRedirect = (provider) => {
    window.location.href = `${BACKEND_URL}/${provider}`;
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <SignupForm />

        <div className="social-auth">
          <p className="social-text">Or continue with social accounts</p>

          <div className="social-grid">
            <button
              className="social-btn google-btn"
              onClick={() => oauthRedirect("auth/google")}
            >
              <FaGoogle />
              Google
            </button>

            <button
              className="social-btn facebook-btn"
              onClick={() => oauthRedirect("auth/facebook")}
            >
              <FaFacebookF />
              Facebook
            </button>

            <button
              className="social-btn linkedin-btn"
              onClick={() => oauthRedirect("auth/linkedin")}
            >
              <FaLinkedinIn />
              LinkedIn
            </button>

            <button
              className="social-btn discord-btn"
              onClick={() => oauthRedirect("auth/discord")}
            >
              <FaDiscord />
              Discord
            </button>
          </div>
        </div>
        <div className="auth-legal">
          <p>By continuing, you agree to our policies.</p>
          <div>
            <button
              onClick={() =>
                navigate("/privacy-policy", {
                  state: { from: location.pathname },
                })
              }
            >
              Privacy Policy
            </button>
            <span>|</span>
            <button
              onClick={() =>
                navigate("/deletion-policy", {
                  state: { from: location.pathname },
                })
              }
            >
              Account Deletion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
