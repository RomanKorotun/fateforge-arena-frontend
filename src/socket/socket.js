import { io } from "socket.io-client";

const VITE_SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const chatSocket = io(`${VITE_SOCKET_URL}/chat`, {
  transports: ["websocket"],
  autoConnect: false,
});
