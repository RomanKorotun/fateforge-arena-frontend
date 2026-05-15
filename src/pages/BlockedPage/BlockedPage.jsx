import { useNavigate } from "react-router-dom";

import "./BlockedPage.css";

const BlockedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="blocked-page">
      <div className="blocked-card">
        <h1>🚫 Ваш акаунт заблоковано</h1>

        <p>Зверніться до служби підтримки.</p>

        <button onClick={() => navigate("/")}>Повернутися на головну</button>
      </div>
    </div>
  );
};

export default BlockedPage;
