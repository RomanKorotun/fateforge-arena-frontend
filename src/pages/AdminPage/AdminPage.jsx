import { useEffect, useState } from "react";
import UserInfo from "../../components/UserInfo/UserInfo";
import { adminStore } from "../../store/adminStore";
import "./AdminPage.css";

const AdminPage = () => {
  const { fetchUsers, banUser, unbanUser } = adminStore();
  const users = adminStore((s) => s.users);

  const [banUserId, setBanUserId] = useState(null);
  const [banDate, setBanDate] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openBanModal = (id) => {
    setBanUserId(id);
    setBanDate("");
  };

  const closeModal = () => {
    setBanUserId(null);
    setBanDate("");
  };

  const handleBan = () => {
    if (!banDate) return;

    banUser(banUserId, new Date(banDate).toISOString());
    closeModal();
  };

  const handleDateChange = (e) => {
    setBanDate(e.target.value);
    e.target.blur();
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <UserInfo />
        </div>

        <div className="admin-content">
          <h2 className="admin-title">Users</h2>

          <div className="admin-table">
            <table className="admin-table-inner">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Ban until</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>

                    <td>
                      {u.isBanned ? (
                        <span className="bad">BANNED</span>
                      ) : (
                        <span className="good">ACTIVE</span>
                      )}
                    </td>

                    <td>
                      {u.banEndAt ? new Date(u.banEndAt).toLocaleString() : "—"}
                    </td>

                    <td>
                      {!u.isBanned ? (
                        <button
                          className="banBtn"
                          onClick={() => openBanModal(u.id)}
                        >
                          Ban
                        </button>
                      ) : (
                        <button
                          className="unbanBtn"
                          onClick={() => unbanUser(u.id)}
                        >
                          Unban
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL */}
        {banUserId && (
          <div className="modalOverlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Ban user</h3>

              <input
                type="datetime-local"
                value={banDate}
                onChange={handleDateChange}
              />

              <div className="modalActions">
                <button className="banBtn" onClick={handleBan}>
                  Confirm
                </button>

                <button onClick={closeModal}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
