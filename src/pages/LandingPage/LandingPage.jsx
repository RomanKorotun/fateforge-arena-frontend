import { useNavigate } from "react-router-dom";

import { FaGoogle, FaFacebookF, FaLinkedinIn, FaDiscord } from "react-icons/fa";

import "./LandingPage.css";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const LandingPage = () => {
  const navigate = useNavigate();

  const oauthRedirect = (provider) => {
    window.location.href = `${BACKEND_URL}/${provider}`;
  };

  return (
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

      {/* GOOGLE */}
      <button
        className="auth-btn google-btn"
        onClick={() => oauthRedirect("auth/google")}
      >
        <FaGoogle />
        Continue with Google
      </button>

      {/* FACEBOOK */}
      <button
        className="auth-btn facebook-btn"
        onClick={() => oauthRedirect("auth/facebook")}
      >
        <FaFacebookF />
        Continue with Facebook
      </button>

      {/* LINKEDIN */}
      <button
        className="auth-btn linkedin-btn"
        onClick={() => oauthRedirect("auth/linkedin")}
      >
        <FaLinkedinIn />
        Continue with LinkedIn
      </button>

      {/* DISCORD */}
      <button
        className="auth-btn discord-btn"
        onClick={() => oauthRedirect("auth/discord")}
      >
        <FaDiscord />
        Continue with Discord
      </button>
    </div>
  );
};

export default LandingPage;
