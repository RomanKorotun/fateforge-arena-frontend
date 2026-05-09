import "./PrivacyPolicyPage.css";

const PrivacyPolicyPage = () => {
  return (
    <div className="privacy-page">
      <div className="privacy-card">
        <h1>🔒 Політика конфіденційності</h1>

        <p>
          Ми використовуємо соціальні сервіси лише для автентифікації
          користувачів. Жодні персональні дані не передаються третім сторонам.
        </p>

        <p>
          Під час входу ми можемо отримати базову інформацію вашого профілю, щоб
          створити обліковий запис у нашій системі.
        </p>

        <p>
          Якщо у вас є питання, звертайтеся на&nbsp;
          <a href="mailto:roman.korotun@ukr.net">roman.korotun@ukr.net</a>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
