import express from "express";
import { register, login, logout, getUser } from "../controllers/authController";
import verifySession from "../middlewares/verifySession";
import { sendOTP, verifyOTPAndChangePass } from "../controllers/PasswordRecoveryController";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", verifySession, logout)
authRoutes.get("/user", verifySession, getUser)
authRoutes.post("/sendOTP", sendOTP)
authRoutes.post("/changePass", verifyOTPAndChangePass)

export default authRoutes;

