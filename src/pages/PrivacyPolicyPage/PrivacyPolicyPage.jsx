import { useLocation, useNavigate } from "react-router-dom";
import "./PrivacyPolicyPage.css";

const PrivacyPolicyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from || "/";

  const handleBack = () => navigate(from);

  return (
    <div className="privacy-page">
      <div className="privacy-wrapper">
        <button className="back-btn" onClick={handleBack}>
          ⬅ Back
        </button>

        <div className="privacy-card">
          <h1>🔒 Політика конфіденційності</h1>

          <p>
            Користувач може створити обліковий запис або увійти в систему двома
            способами: через email і пароль або через сторонні сервіси.
          </p>

          <p>
            Ми використовуємо сторонні сервіси (Google, Discord, Facebook,
            LinkedIn) виключно для автентифікації користувачів.
          </p>

          <p>
            Під час автентифікації ми можемо отримати базову інформацію профілю
            користувача (ім’я, email та аватар), якщо вона доступна через
            відповідний сервіс. Ця інформація використовується лише для
            створення або входу в обліковий запис.
          </p>

          <p>
            Ми не передаємо персональні дані третім сторонам і використовуємо їх
            виключно для роботи сервісу.
          </p>

          <p>
            Якщо у вас є питання щодо конфіденційності, звертайтеся на{" "}
            <a href="mailto:roman.korotun@ukr.net">roman.korotun@ukr.net</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
