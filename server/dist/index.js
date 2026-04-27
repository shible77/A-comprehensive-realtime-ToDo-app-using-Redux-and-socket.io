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
const errorHandler_1 = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const allowedOrigins = [
    "http://localhost:5173",
    "https://a-realtime-to-do-app.onrender.com",
];
app.use(errorHandler_1.errorHandler);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
const io = new socket_io_1.Server(server, {
    cors: { origin: "https://a-realtime-to-do-app.onrender.com" }
});
(0, socketHandler_1.socketHandler)(io);
app.use(cookieParser());
app.use(express_1.default.json());
app.use((req, _, next) => { req.io = io; next(); });
app.use("/api/auth", authRoutes_1.default);
app.use("/api/todos", todoRoutes_1.default);
server.listen(process.env.PORT, () => console.log(`Server running at http://localhost:${process.env.PORT}`));
