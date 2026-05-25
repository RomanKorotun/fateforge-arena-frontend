import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { authStore } from "../../store/authStore";
import { profileStore } from "../../store/profileStore";

import "./SettingsPage.css";
import { formatGeo } from "../../helpers/format-geo.helper";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  postalCode: "",
  address: "",
  city: "",
  country: "",
};

const SettingsPage = () => {
  const navigate = useNavigate();

  const {
    fetchSessions,
    revokeSession,
    clearAllSessions,
    logoutUser,
    deleteAccount,
  } = authStore();

  const sessions = authStore((s) => s.sessions);
  const user = authStore((s) => s.user);

  const { fetchAddress, createAddress, updateAddress } = profileStore();
  const address = profileStore((s) => s.address);

  const [form, setForm] = useState(EMPTY_FORM);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const load = async () => {
      await fetchSessions();
      const data = await fetchAddress();

      if (data) setForm(data);
      else setForm(EMPTY_FORM);
    };

    load();
  }, [fetchAddress, fetchSessions]);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm(address || EMPTY_FORM);
    setIsEditing(false);
  };

  const handleSaveOrUpdate = async () => {
    const hasEmptyField = Object.values(form).some(
      (value) => value.trim() === "",
    );

    if (hasEmptyField) {
      alert("Поля для оновлення не можуть бути пустими");
      return;
    }

    if (!address) {
      await createAddress(form);
    } else {
      const changedFields = Object.keys(form).reduce((acc, key) => {
        if (form[key] !== address[key]) {
          acc[key] = form[key];
        }

        return acc;
      }, {});

      if (Object.keys(changedFields).length === 0) {
        setIsEditing(false);
        return;
      }

      await updateAddress(changedFields);
    }

    setForm(form);

    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?",
    );

    if (!confirmed) return;

    try {
      await deleteAccount();
      navigate("/signin");
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  };

  const handleRevoke = async (sessionId, isCurrent) => {
    if (isCurrent) {
      await logoutUser();
      navigate("/signin");
      return;
    }

    await revokeSession(sessionId);
  };

  const handleClearAll = async () => {
    await clearAllSessions();
    navigate("/signin");
  };

  const handleBack = () => {
    navigate(user?.role === "ADMIN" ? "/admin" : "/dashboard");
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <button className="back-btn" onClick={handleBack}>
          ⬅ Back to profile
        </button>

        {/* SESSIONS */}
        <h2 className="page-title">Sessions</h2>

        <div className="table-card">
          <table className="table">
            <colgroup>
              <col style={{ width: "32%" }} />
              <col style={{ width: "28%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>

            <thead>
              <tr>
                <th>Device</th>
                <th>Location</th>
                <th>IP</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {sessions?.map((s) => (
                <tr key={s.sessionId}>
                  <td>
                    {s.device.browser} • {s.device.os} • {s.device.type}
                    {s.isCurrent && (
                      <span className="current-badge"> (Current)</span>
                    )}
                  </td>

                  <td>{formatGeo(s.geo) || "Unknown"}</td>
                  <td>{s.ip}</td>
                  <td>{new Date(s.createdAt).toLocaleString()}</td>

                  <td>
                    <button
                      className="btn-danger"
                      onClick={() => handleRevoke(s.sessionId, s.isCurrent)}
                    >
                      End session
                    </button>
                  </td>
                </tr>
              ))}

              <tr className="table-footer-row">
                <td colSpan="4"></td>
                <td>
                  <button className="btn-clear-all" onClick={handleClearAll}>
                    Clear all sessions
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PERSONAL DETAILS */}
        <h2 className="page-title">Personal details</h2>

        <div className="form-card">
          <div className="form-grid">
            <input
              value={form.firstName}
              disabled={!isEditing}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="First name"
            />

            <input
              value={form.lastName}
              disabled={!isEditing}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Last name"
            />

            <input
              value={form.phoneNumber}
              disabled={!isEditing}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              placeholder="Phone number"
            />

            <input
              value={form.postalCode}
              disabled={!isEditing}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              placeholder="Postal code"
            />

            <input
              value={form.address}
              disabled={!isEditing}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Address"
            />

            <input
              value={form.city}
              disabled={!isEditing}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="City"
            />

            <input
              value={form.country}
              disabled={!isEditing}
              onChange={(e) => handleChange("country", e.target.value)}
              placeholder="Country"
            />
          </div>

          <div className="form-actions">
            {!address && !isEditing ? (
              <button className="btn-save" onClick={() => setIsEditing(true)}>
                Edit
              </button>
            ) : isEditing ? (
              <>
                <button className="btn-save" onClick={handleSaveOrUpdate}>
                  {address ? "Update" : "Save"}
                </button>

                <button className="btn-cancel" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn-save" onClick={handleEdit}>
                Edit
              </button>
            )}
          </div>
        </div>

        {/* DANGER ZONE */}
        <h2 className="page-title danger-title">Danger Zone</h2>

        <div className="danger-card">
          <div className="danger-content">
            <div>
              <h3 className="danger-heading">Delete account</h3>

              <p className="danger-text">
                Permanently deactivate your account and remove access to the
                platform.
              </p>
            </div>

            <button
              className="btn-delete-account"
              onClick={handleDeleteAccount}
            >
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
