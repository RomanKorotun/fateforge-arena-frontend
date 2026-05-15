import "./UsersList.css";

import UserRow from "../UserRow/UserRow";
import { authStore } from "../../store/authStore";

const columns = ["Електронна пошта", "Ліміт сховища", "Дата створення", "Дії"];

const UsersList = () => {
  const users = authStore((state) => state.users);

  return (
    <section className="users-list">
      <h2 className="users-title">Список користувачів</h2>
      <table className="users-table">
        <thead className="users-thead">
          <tr className="users-tr">
            {columns.map((col) => (
              <th key={col} className="users-th">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="users-tbody">
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => <UserRow key={user.id} user={user} />)
          ) : (
            <tr className="users-tr">
              <td className="users-td" colSpan="4">
                Користувачів немає
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default UsersList;
