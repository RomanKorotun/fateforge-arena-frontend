import { io } from "socket.io-client";

const VITE_SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const battleSocket = io(`${VITE_SOCKET_URL}/battle`, {
  transports: ["websocket"],
  autoConnect: false,
});
