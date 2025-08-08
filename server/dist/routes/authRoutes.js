"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const verifySession_1 = __importDefault(require("../middlewares/verifySession"));
const PasswordRecoveryController_1 = require("../controllers/PasswordRecoveryController");
const authRoutes = express_1.default.Router();
authRoutes.post("/register", authController_1.register);
authRoutes.post("/login", authController_1.login);
authRoutes.post("/logout", verifySession_1.default, authController_1.logout);
authRoutes.get("/user", verifySession_1.default, authController_1.getUser);
authRoutes.post("/sendOTP", PasswordRecoveryController_1.sendOTP);
authRoutes.post("/changePass", PasswordRecoveryController_1.verifyOTPAndChangePass);
exports.default = authRoutes;
