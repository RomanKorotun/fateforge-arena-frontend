import { useLocation, useNavigate } from "react-router-dom";
import "./DataDeletionPolicyPage.css";

const DataDeletionPolicyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from || "/";

  const handleBack = () => navigate(from);

  return (
    <div className="delete-page">
      <div className="delete-wrapper">
        <button className="back-btn" onClick={handleBack}>
          ⬅ Back
        </button>

        <div className="delete-card">
          <h1>🗑️ Видалення акаунта</h1>

          <p>
            Користувач може видалити свій обліковий запис у будь-який момент
            через налаштування профілю.
          </p>

          <p>
            Після видалення акаунт переходить у стан неактивного (soft delete) і
            більше не використовується в системі.
          </p>

          <p>
            Дані користувача можуть бути відновлені через процедуру відновлення
            доступу або повторну авторизацію.
          </p>

          <p>
            Якщо у вас є питання щодо процедури видалення або відновлення
            акаунта, звертайтеся на{" "}
            <a href="mailto:roman.korotun@ukr.net">roman.korotun@ukr.net</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataDeletionPolicyPage;
