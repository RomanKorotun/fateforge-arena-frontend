import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { authStore } from "../../../store/authStore";
import { ROLES } from "../../../constants/roles";

import "./OAuthSuccessPage.css";

const OAuthSuccessPage = () => {
  const navigate = useNavigate();
  const fetchMe = authStore((s) => s.fetchMe);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const user = await fetchMe();
        console.log(user);

        if (!user) {
          navigate("/signin");
          return;
        }

        if (user.role === ROLES.ADMIN) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } catch {
        navigate("/signin");
      }
    };

    handleAuth();
  }, [navigate, fetchMe]);

  return (
    <div className="oauth-success">
      <div className="loader" />
      <p>Signing you in...</p>
    </div>
  );
};

export default OAuthSuccessPage;
