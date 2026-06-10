// RestoreAccountPage.tsx
import RestoreAccountForm from "../../components/RestoreAccountForm/RestoreAccountForm";
import "./RestoreAccountPage.css";

const RestoreAccountPage = () => {
  return (
    <div className="restore-page">
      <div className="restore-card">
        <h2 className="restore-title">Ваш акаунт було видалено</h2>
        <p className="restore-subtitle">Бажаєте відновити доступ до акаунта?</p>

        <RestoreAccountForm />
      </div>
    </div>
  );
};

export default RestoreAccountPage;
