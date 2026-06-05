import { io } from "socket.io-client";

export const chatSocket = io("http://localhost:3799/chat", {
  transports: ["websocket"],
  autoConnect: false,
});
