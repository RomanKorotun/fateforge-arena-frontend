import SigninForm from "../../components/SigninForm/SigninForm";

import { FaGoogle, FaFacebookF, FaLinkedinIn, FaDiscord } from "react-icons/fa";

import "./SigninPage.css";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const SigninPage = () => {
  const oauthRedirect = (provider) => {
    window.location.href = `${BACKEND_URL}/${provider}`;
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <SigninForm />

        <div className="social-auth">
          <div className="divider">
            <span>Or continue with</span>
          </div>

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
      </div>
    </div>
  );
};

export default SigninPage;
