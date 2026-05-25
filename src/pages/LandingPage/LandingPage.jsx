import { useLocation, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaLinkedinIn, FaDiscord } from "react-icons/fa";

import "./LandingPage.css";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const oauthRedirect = (provider) => {
    window.location.href = `${BACKEND_URL}/${provider}`;
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-buttons">
        <button
          className="auth-btn signup-btn"
          onClick={() => navigate("/signup")}
        >
          Signup
        </button>

        <button
          className="auth-btn signin-btn"
          onClick={() => navigate("/signin")}
        >
          Signin
        </button>

        <div className="auth-divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <button
          className="auth-btn google-btn"
          onClick={() => oauthRedirect("auth/google")}
        >
          <FaGoogle />
          Continue with Google
        </button>

        <button
          className="auth-btn facebook-btn"
          onClick={() => oauthRedirect("auth/facebook")}
        >
          <FaFacebookF />
          Continue with Facebook
        </button>

        <button
          className="auth-btn linkedin-btn"
          onClick={() => oauthRedirect("auth/linkedin")}
        >
          <FaLinkedinIn />
          Continue with LinkedIn
        </button>

        <button
          className="auth-btn discord-btn"
          onClick={() => oauthRedirect("auth/discord")}
        >
          <FaDiscord />
          Continue with Discord
        </button>
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
  );
};

export default LandingPage;
