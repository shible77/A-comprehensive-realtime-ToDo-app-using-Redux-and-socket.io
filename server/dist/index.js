"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const todoRoutes_1 = __importDefault(require("./routes/todoRoutes"));
const socketHandler_1 = require("./sockets/socketHandler");
const cookieParser = require("cookie-parser");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: { origin: process.env.CLIENT_URL }
});
(0, socketHandler_1.socketHandler)(io);
app.use(cookieParser());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express_1.default.json());
app.use((req, _, next) => { req.io = io; next(); });
app.use("/api/auth", authRoutes_1.default);
app.use("/api/todos", todoRoutes_1.default);
server.listen(process.env.PORT, () => console.log(`Server running at http://localhost:${process.env.PORT}`));
