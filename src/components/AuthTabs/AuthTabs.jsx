import { useLocation, useNavigate } from "react-router-dom";
import "./AuthTabs.css";

const AuthTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isSignin = location.pathname === "/signin";
  const isSignup = location.pathname === "/signup";

  return (
    <div className="auth-tabs">
      <button
        type="button"
        className={`auth-tab ${isSignup ? "active" : ""}`}
        onClick={() => navigate("/signup")}
      >
        Signup
      </button>

      <button
        type="button"
        className={`auth-tab ${isSignin ? "active" : ""}`}
        onClick={() => navigate("/signin")}
      >
        Signin
      </button>
    </div>
  );
};

export default AuthTabs;
