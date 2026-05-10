import "./DataDeletionPolicyPage.css";

const DataDeletionPolicyPage = () => {
  return (
    <div className="delete-page">
      <div className="delete-card">
        <h1>🗑️ Видалення акаунта</h1>

        <p>
          Ви можете повністю видалити свій акаунт та всі пов’язані дані з нашої
          системи.
        </p>

        <p>Щоб видалити акаунт, натисніть кнопку нижче у вашому профілі:</p>

        <div className="warning-box">Delete account</div>

        <p className="contact">
          Якщо у вас є питання — напишіть нам:&nbsp;
          <a href="mailto:roman.korotun@ukr.net">roman.korotun@ukr.net</a>
        </p>
      </div>
    </div>
  );
};

export default DataDeletionPolicyPage;
