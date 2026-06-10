import "./ResendVerificationEmailPage.css";
import ResendVerificationEmailForm from "../../components/ResendVerificationEmailForm/ResendVerificationEmailForm";

const ResendVerificationEmailPage = () => {
  return (
    <div className="resend-page">
      <div className="resend-card">
        <ResendVerificationEmailForm />
      </div>
    </div>
  );
};

export default ResendVerificationEmailPage;
