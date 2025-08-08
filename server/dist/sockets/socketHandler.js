"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHandler = void 0;
const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
exports.socketHandler = socketHandler;
