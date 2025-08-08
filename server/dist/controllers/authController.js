"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.logout = exports.login = exports.register = void 0;
const argon2_1 = __importDefault(require("argon2"));
const schema_1 = require("../db/schema");
const setup_1 = require("../db/setup");
const jwt_1 = require("../utils/jwt");
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = __importDefault(require("zod"));
const registerBodySchema = zod_1.default.object({
    email: zod_1.default.email(),
    username: zod_1.default.string().min(3).max(20),
    password: zod_1.default.string().min(6).max(100),
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, password } = registerBodySchema.parse(req.body);
        const hashedPassword = yield argon2_1.default.hash(password);
        const alreadyExists = yield setup_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.users.email, email), (0, drizzle_orm_1.eq)(schema_1.users.username, username)));
        if (alreadyExists.length > 0) {
            return res.status(204).json({ message: "User already exists" });
        }
        const user = yield setup_1.db.insert(schema_1.users).values({ email, username, password: hashedPassword }).$returningId();
        return res.status(201).json({
            message: "User registered successfully",
            userId: user[0].id,
        });
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            return res.status(501).json({ name: "Invalid data type.", message: JSON.parse(error.message) });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.register = register;
const loginBodySchema = zod_1.default.object({
    email: zod_1.default.email(),
    password: zod_1.default.string().min(6).max(100),
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = loginBodySchema.parse(req.body);
        const user = yield setup_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email)).limit(1);
        if (user.length === 0) {
            return res.status(204).json({ message: "User not found" });
        }
        const isPasswordValid = yield argon2_1.default.verify(user[0].password, password);
        if (!isPasswordValid) {
            return res.status(204).json({ message: "Invalid password" });
        }
        const token = (0, jwt_1.generateToken)({ userId: user[0].id });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        return res.status(200).json({
            status: "success",
            user: { id: user[0].id, username: user[0].username, email: user[0].email },
        });
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            return res.status(400).json({ name: "Invalid data type.", message: JSON.parse(error.message) });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        return res.status(200).json({ status: "success" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.logout = logout;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield setup_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId)).limit(1);
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            status: "success",
            user: { id: user[0].id, username: user[0].username, email: user[0].email },
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUser = getUser;
