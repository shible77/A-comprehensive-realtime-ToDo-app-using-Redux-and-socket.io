import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes";
import todoRoutes from "./routes/todoRoutes";
import { socketHandler } from "./sockets/socketHandler";
import { errorHandler } from "./middlewares/errorHandler";
const cookieParser = require("cookie-parser");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.CLIENT_URL_DEV!,
  process.env.CLIENT_URL_PROD!,
];
app.use(errorHandler);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL_DEV!} 
});

socketHandler(io);

app.use(cookieParser());

app.use(express.json());
app.use((req: any, _, next) => { req.io = io; next(); });

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);


server.listen(process.env.PORT!, () =>
  console.log(`Server running at http://localhost:${process.env.PORT}`)
);
