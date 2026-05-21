import { useEffect, useState } from "react";

import UserInfo from "../../components/UserInfo/UserInfo";
import { adminStore } from "../../store/adminStore";
import "./AdminPage.css";

const AdminPage = () => {
  const { fetchUsers, updateStatus } = adminStore();
  const users = adminStore((s) => s.users);

  const [editId, setEditId] = useState(null);

  const [draft, setDraft] = useState({
    status: "",
    quota: "",
  });

  const [original, setOriginal] = useState({
    status: "",
    quota: "",
  });

  // 📦 load users
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ✏️ start edit
  const startEdit = (user) => {
    setEditId(user.id);

    setDraft({
      status: user.status,
    });

    setOriginal({
      status: user.status,
    });
  };

  // ❌ cancel
  const cancelEdit = () => {
    setEditId(null);
    setDraft({ status: "" });
    setOriginal({ status: "" });
  };

  // 💾 save (ПОСЛІДОВНО!)
  const saveEdit = async (user) => {
    try {
      let hasChanges = false;

      // 🔵 STATUS
      if (draft.status !== original.status) {
        const payload = {
          userId: user.id,
          status: draft.status,
        };

        console.log("🟦 STATUS REQUEST:", payload);

        await updateStatus(user.id, draft.status); // ⬅️ перший запит
        hasChanges = true;
      }

      if (!hasChanges) {
        console.log("⚪ Нема змін — запит не відправляється");
        cancelEdit();
        return;
      }

      console.log("✅ Успішно оновлено");
      cancelEdit();
    } catch (err) {
      console.error("❌ Save error:", err);
    }
  };

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <UserInfo />
      </div>

      {/* CONTENT */}
      <div className="admin-content">
        <h2 className="admin-title">Users</h2>

        <div className="admin-table">
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => {
                const isEditing = editId === u.id;

                return (
                  <tr key={u.id}>
                    {/* EMAIL */}
                    <td>{u.email}</td>

                    {/* ROLE */}
                    <td>{u.role}</td>

                    {/* STATUS */}
                    <td>
                      {isEditing ? (
                        <select
                          value={draft.status}
                          onChange={(e) =>
                            setDraft((prev) => ({
                              ...prev,
                              status: e.target.value,
                            }))
                          }
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="BLOCKED">BLOCKED</option>
                        </select>
                      ) : (
                        u.status
                      )}
                    </td>

                    {/* ACTION */}
                    <td>
                      {isEditing ? (
                        <>
                          <button onClick={() => saveEdit(u)}>Save</button>
                          <button onClick={cancelEdit}>Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => startEdit(u)}>Edit</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
