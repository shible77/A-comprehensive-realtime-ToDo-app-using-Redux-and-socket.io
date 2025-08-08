"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = void 0;
const nodemailer = require('nodemailer');
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendVerificationEmail = (userEmail, verificationCode) => {
    const config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    };
    const transporter = nodemailer.createTransport(config);
    const message = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: "Password Recovery",
        text: `Your OTP code is: ${verificationCode}`,
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="text-align: center; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; max-width: 400px; margin: auto;">
                <h1 style="color: #4CAF50;">Password Recovery</h1>
                <p style="font-size: 16px;">Thank you for your cooperation!</p>
                <p style="font-size: 16px; margin-bottom: 20px;">
                    Please use the OTP code below to complete your Password Recovery Process:
                </p>
                <div style="font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; background-color: #eafbe7; border-radius: 8px; display: inline-block; margin-bottom: 20px;">
                    ${verificationCode}
                </div>
                <p style="font-size: 18px; color: #555;">
                    The OTP code will expire within 5 minutes.
                </p>
                <p style="font-size: 14px; color: #555;">
                    If you didn’t request this, please ignore this email or contact support.
                </p>
                <p style="font-size: 14px; color: #999; margin-top: 20px;">
                    Best regards, <br> ToDos System Team
                </p>
            </div>
        </div>
    `
    };
    return transporter.sendMail(message);
};
exports.sendVerificationEmail = sendVerificationEmail;
