import { useNavigate } from "react-router-dom";
import { useRef } from "react";

import { authStore } from "../../store/authStore";
import { profileStore } from "../../store/profileStore";

import "./UserInfo.css";

const BACKEND_URL_AVATAR = import.meta.env.VITE_API_URL_AVATAR;

const UserInfo = () => {
  const user = authStore((state) => state.user);
  const { logoutUser } = authStore();

  const profile = profileStore((state) => state.profile);

  const uploadUserAvatar = profileStore((state) => state.uploadUserAvatar);

  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const DEFAULT_AVATAR =
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  const handleSettings = () => {
    if (user?.role === "ADMIN") {
      navigate("/admin/settings");
    } else {
      navigate("/dashboard/settings");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/signin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      await uploadUserAvatar(file);

      e.target.value = "";
    } catch (err) {
      console.error(err);
    }
  };

  // avatar url
  const avatar = profile?.profile?.avatar;

  const avatarSrc = avatar?.startsWith("http")
    ? avatar
    : `${BACKEND_URL_AVATAR}/${avatar}`;

  const finalAvatar = avatar ? avatarSrc : DEFAULT_AVATAR;

  return (
    <div>
      <div className="header-wrapper">
        <h2 className="files-title">{user?.role || "Користувач"}</h2>

        <div className="avatar-wrap" onClick={handleAvatarClick}>
          <img className="header-avatar" src={finalAvatar} alt="user avatar" />

          <div className="avatar-hover">Змінити фото</div>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        />
      </div>

      <div className="user-card">
        <span className="user-value">{user?.username || "—"}</span>

        <div className="user-actions">
          <button className="settings-btn" onClick={handleSettings}>
            Налаштування
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            Вийти
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
