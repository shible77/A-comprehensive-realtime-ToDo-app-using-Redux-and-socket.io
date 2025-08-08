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
exports.verifyOTPAndChangePass = exports.sendOTP = void 0;
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
const setup_1 = require("../db/setup");
const mailService_1 = require("../services/mailService");
const crypto = require('crypto');
const argon2_1 = __importDefault(require("argon2"));
function generateOTP() {
    return crypto.randomInt(100000, 1000000);
}
const sendReqBody = zod_1.z.object({
    email: zod_1.z.email()
});
const sendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = sendReqBody.parse(req.body);
        const user = yield setup_1.db.select({ id: schema_1.users.id }).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (user.length === 0) {
            return res.status(201).json({ status: "failed", message: 'User not found' });
        }
        const token = JSON.stringify(generateOTP());
        const otpStore = yield setup_1.db.insert(schema_1.otp).values({ token, userId: user[0].id }).$returningId();
        yield (0, mailService_1.sendVerificationEmail)(email, token);
        return res
            .status(200)
            .json({
            status: 'success',
            message: `Verification code sent to ${email} `,
            email,
            otpId: otpStore[0].id,
            userId: user[0].id
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                name: 'invalid data type',
                message: JSON.parse(error.message)
            });
        }
        return res.status(500).json({ message: 'internal server error' });
    }
});
exports.sendOTP = sendOTP;
const verifyReqBody = zod_1.z.object({
    otpId: zod_1.z.number(),
    token: zod_1.z.string(),
    userId: zod_1.z.number(),
    password: zod_1.z.string().min(6).max(50),
});
const verifyOTPAndChangePass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otpId, token, userId, password } = verifyReqBody.parse(req.body);
        const findOtp = yield setup_1.db.select().from(schema_1.otp).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.otp.id, otpId), (0, drizzle_orm_1.eq)(schema_1.otp.token, token), (0, drizzle_orm_1.eq)(schema_1.otp.userId, userId))).limit(1);
        if (findOtp.length === 0) {
            return res.status(200).json({ status: "failed", message: 'Invalid OTP' });
        }
        if ((Date.now() - findOtp[0].createdAt.getTime() > 1000 * 60 * 5)) {
            return res.status(200).json({ status: "failed", message: 'OTP expired' });
        }
        const hashedPassword = yield argon2_1.default.hash(password);
        const updateStatus = yield setup_1.db.update(schema_1.users).set({ password: hashedPassword }).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
        if (updateStatus[0].affectedRows === 1) {
            yield setup_1.db.delete(schema_1.otp).where((0, drizzle_orm_1.eq)(schema_1.otp.userId, userId));
        }
        return res.status(200).json({ status: 'success', message: "Password updated successfully" });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                name: 'invalid data type',
                message: JSON.parse(error.message)
            });
        }
        return res.status(500).json({ message: 'internal server error' });
    }
});
exports.verifyOTPAndChangePass = verifyOTPAndChangePass;
