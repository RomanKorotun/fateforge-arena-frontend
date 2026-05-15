import "./UserHeader.css";
import UserInfo from "../UserInfo/UserInfo";

const UserHeader = () => {
  return (
    <section className="user-files-header">
      <div className="left">
        <UserInfo />
      </div>
    </section>
  );
};

export default UserHeader;
