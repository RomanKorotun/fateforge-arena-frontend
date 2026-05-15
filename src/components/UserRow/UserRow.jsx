import { useNavigate } from "react-router-dom";

import "./UserRow.css";
import ActionButton from "../ActionButton/ActionButton";
import { authStore } from "../../store/authStore";

const UserRow = ({ user }) => {
  const removeUser = authStore((state) => state.removeUser);
  const navigate = useNavigate();

  const handleDelete = async () => {
    await removeUser(user.id, {
      email: user.email,
      password: user.password,
    });
  };

  const handleView = () => {
    localStorage.setItem("authUser", JSON.stringify(user));
    navigate(`/users/${user.id}`);
  };

  return (
    <tr className="users-tr">
      <td className="users-td">{user.email}</td>
      <td className="users-td">{(user.quota / (1024 * 1024)).toFixed(2)} MB</td>
      <td className="users-td">{new Date(user.createdAt).toLocaleString()}</td>
      <td className="users-td users-actions">
        <ActionButton type="view" onClick={handleView}>
          Переглянути
        </ActionButton>
        <ActionButton type="delete" onClick={handleDelete}>
          Видалити
        </ActionButton>
      </td>
    </tr>
  );
};

export default UserRow;
