import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RouletteMultiPage.css";

import { rouletteSocket } from "../../socket/rouletteSocket";
import { profileStore } from "../../store/profileStore";

const RouletteMultiPage = () => {
  const navigate = useNavigate();
  const wallets = profileStore((s) => s.wallets);
  const fetchProfile = profileStore((s) => s.fetchProfile);

  // список активних кімнат
  const [rooms, setRooms] = useState([]);

  // поточна кімната юзера
  // const [currentRoom, setCurrentRoom] = useState(null);

  // =========================
  // PROFILE INIT
  // =========================
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // =========================
  // STATUS LABEL
  // =========================
  const getStatusText = (status) => {
    switch (status) {
      case "WAITING":
        return "⏳ Очікування гравців";

      case "BETTING":
        return "💰 Прийом ставок";

      case "SPINNING":
        return "🎰 Рулетка крутиться";

      case "FINISHED":
        return "🏁 Раунд завершено";

      default:
        return status;
    }
  };

  // =========================
  // SOCKET LOGIC
  // =========================
  useEffect(() => {
    // стартовий список кімнат
    const onRoomsList = (data) => {
      setRooms(data.rooms || []);
    };

    // нова кімната
    const onRoomCreated = (room) => {
      setRooms((prev) => [...prev, room]);
    };

    // оновлення кімнати
    const onRoomUpdated = (updatedRoom) => {
      setRooms((prev) =>
        prev.map((room) =>
          room.roomId === updatedRoom.roomId ? updatedRoom : room,
        ),
      );
    };

    // видалення кімнати
    const onRoomRemoved = (roomId) => {
      setRooms((prev) => prev.filter((room) => room.roomId !== roomId));
    };

    // підписки
    rouletteSocket.on("rooms:list", onRoomsList);
    rouletteSocket.on("room:created", onRoomCreated);
    rouletteSocket.on("room:updated", onRoomUpdated);
    rouletteSocket.on("room:removed", onRoomRemoved);

    // cleanup
    return () => {
      rouletteSocket.off("rooms:list", onRoomsList);
      rouletteSocket.off("room:created", onRoomCreated);
      rouletteSocket.off("room:updated", onRoomUpdated);
      rouletteSocket.off("room:removed", onRoomRemoved);
    };
  }, []);

  // =========================*
  // ACTIONS
  // =========================
  const joinRoom = (roomId) => {
    navigate(`/dashboard/roulette/game-multi/${roomId}`);
  };

  // const leaveRoom = (roomId) => {
  //   // setCurrentRoom(null);

  //   rouletteSocket.emit("room:leave", {
  //     roomId,
  //     userId: "me",
  //   });
  // };

  // =========================
  // UI
  // =========================
  return (
    <div className="roulette-multi-page">
      <div className="roulette-multi-container">
        <div className="roulette-multi-card">
          <h1 className="roulette-multi-title">🎰 Roulette Lobby</h1>

          {/* WALLETS */}
          <div className="roulette-multi-wallets">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="roulette-multi-wallet-item">
                {wallet.balance} {wallet.currency}
              </div>
            ))}
          </div>

          {/* ROOMS */}
          <h2 className="roulette-multi-subtitle">Активні кімнати</h2>

          <div className="roulette-multi-rooms">
            {rooms.length === 0 && (
              <p className="roulette-multi-empty">Немає активних кімнат</p>
            )}

            {rooms.map((room) => (
              <div key={room.roomId} className="roulette-multi-room-row">
                <div className="roulette-multi-room-info">
                  🏠 {room.name} — {room.players.length} гравців —{" "}
                  {getStatusText(room.status)}
                </div>

                <button
                  className="roulette-multi-join-btn"
                  onClick={() => joinRoom(room.roomId)}
                >
                  Приєднатися
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouletteMultiPage;
