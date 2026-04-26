import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SOCKET_URL || "https://a-realtime-to-do-app.onrender.com");
