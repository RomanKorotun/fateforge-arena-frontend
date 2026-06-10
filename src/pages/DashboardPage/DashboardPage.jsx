import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import UserHeader from "../../components/UserHeader/UserHeader";
import DepositModal from "../../components/DepositModal/DepositModal";

import { profileStore } from "../../store/profileStore";
import { chatSocket } from "../../socket/chatSocket";

import "./DashboardPage.css";
import { authStore } from "../../store/authStore";

const DashboardPage = () => {
  const wallets = profileStore((state) => state.wallets);
  const { fetchProfile } = profileStore();
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [provider, setProvider] = useState("LIQPAY");
  const [selectedWalletId, setSelectedWalletId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const user = authStore((s) => s.user);

  console.log(onlineUsers);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    chatSocket.emit("room:join", { room: "global" });
  }, []);

  useEffect(() => {
    const onInit = (msgs) => setMessages(msgs);
    const onMessage = (msg) => setMessages((prev) => [...prev, msg]);
    const onUsers = (users) => setOnlineUsers(users);

    chatSocket.on("chat:init", onInit);
    chatSocket.on("message:new", onMessage);
    chatSocket.on("room:users", onUsers);

    return () => {
      chatSocket.off("chat:init", onInit);
      chatSocket.off("message:new", onMessage);
      chatSocket.off("room:users", onUsers);
    };
  }, []);

  useEffect(() => {
    return () => {
      chatSocket.emit("room:leave", { room: "global" });
    };
  }, []);

  const sendMessage = () => {
    const text = message.trim();
    if (!text) return;

    chatSocket.emit("message:send", {
      room: "global",
      content: text,
    });

    setMessage("");
  };

  useEffect(() => {
    const socket = chatSocket;

    const handleLeave = () => {
      socket.emit("room:leave", { room: "global" });
    };

    const handleUnload = () => {
      handleLeave();
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const openDeposit = (p, walletId) => {
    setProvider(p);
    setSelectedWalletId(walletId);
    setIsDepositOpen(true);
  };

  useEffect(() => {
    const container = document.querySelector(".chat-messages");
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const container = document.querySelector(".chat-messages");
    if (!container) return;
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 0);
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <UserHeader />

        <div className="dashboard-grid">
          <div className="card">
            <h3>Мої ігри</h3>

            <div className="games-list">
              <div className="game-item">
                <div className="game-info">
                  <span className="game-icon">🎲</span>
                  <span className="game-name">Рулетка</span>
                </div>

                <Link to="/dashboard/roulette" className="game-btn">
                  Грати
                </Link>
              </div>

              <div className="game-item">
                <div className="game-info">
                  <span className="game-icon">🎰</span>
                  <span className="game-name">Відеослот</span>
                </div>

                <Link to="/dashboard/videoslot" className="game-btn">
                  Грати
                </Link>
              </div>

              <div className="game-item">
                <div className="game-info">
                  <span className="game-icon">⚔️</span>
                  <span className="game-name">Battle Arena</span>
                </div>

                <Link to="/dashboard/battle" className="game-btn">
                  Грати
                </Link>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Мої Гаманці</h3>

            {wallets.length === 0 ? (
              <p>Немає гаманців</p>
            ) : (
              <div className="wallets-list">
                {wallets.map((w) => (
                  <div key={w.id} className="wallet-item">
                    <div className="balance">
                      {w.balance} {w.currency}
                    </div>

                    <p className="wallet-text">Доступні способи поповнення:</p>

                    <div className="payment-buttons">
                      <button
                        className="payment-btn"
                        onClick={() => openDeposit("STRIPE", w.id)}
                      >
                        STRIPE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CHAT SECTION */}
        <div className="chat-section">
          <div className="chat-layout">
            {/* USERS */}
            <div className="chat-users">
              <div className="chat-users-title">
                Online ({onlineUsers.length})
              </div>

              {/* 🔥 wrapper для spacing */}
              <div className="chat-users-list">
                {onlineUsers.map((u, i) => (
                  <div key={i} className="chat-user-item">
                    <span className="dot" />
                    {u.username || u}
                  </div>
                ))}
              </div>
            </div>

            {/* CHAT */}
            <div className="chat-card">
              <div className="chat-messages">
                {messages.map((msg, i) => {
                  const mine = msg.senderId === user?.id;

                  const dateTime = msg.createdAt
                    ? new Date(msg.createdAt).toLocaleString("uk-UA", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "";

                  return (
                    <div
                      key={msg.id ?? i}
                      className={`msg-row ${mine ? "mine" : ""}`}
                    >
                      <div className={`msg-bubble ${mine ? "mine" : ""}`}>
                        <div className="msg-top">
                          <span className="msg-name">
                            {mine ? "You" : msg.username}
                          </span>

                          <span className="msg-spacer" />

                          <span className="msg-time">{dateTime}</span>
                        </div>

                        <div className="msg-text">{msg.content}</div>
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Message..."
                />

                <button onClick={sendMessage}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        provider={provider}
        currencies={["UAH"]}
        walletId={selectedWalletId}
      />
    </div>
  );
};

export default DashboardPage;

//=============================================
