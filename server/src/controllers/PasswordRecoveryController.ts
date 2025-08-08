import { Request, Response } from "express";
import { otp, users } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { z } from 'zod'
import { db } from "../db/setup";
import { sendVerificationEmail } from "../services/mailService";
const crypto = require('crypto')
import argon2  from 'argon2'

function generateOTP() {
    return crypto.randomInt(100000, 1000000);
}

const sendReqBody = z.object({
    email: z.email()
})
export const sendOTP = async (req: Request, res: Response) => {
    try {
        const { email } = sendReqBody.parse(req.body)
        const user = await db.select({ id: users.id }).from(users).where(eq(users.email, email))
        if (user.length === 0) {
            return res.status(201).json({ status: "failed", message: 'User not found' })
        }
        const token = JSON.stringify(generateOTP())
        const otpStore = await db.insert(otp).values({token, userId : user[0].id}).$returningId()
        await sendVerificationEmail(email, token)
        return res
            .status(200)
            .json({
                status: 'success',
                message: `Verification code sent to ${email} `,
                email,
                otpId: otpStore[0].id,
                userId: user[0].id
            });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                name: 'invalid data type',
                message: JSON.parse(error.message)
            })
        }
        return res.status(500).json({ message: 'internal server error' })
    }
}

const verifyReqBody = z.object({
    otpId: z.number(),
    token: z.string(),
    userId: z.number(),
    password: z.string().min(6).max(50),
})
export const verifyOTPAndChangePass = async (req: Request, res: Response) => {
    try{
        const { otpId, token, userId, password } = verifyReqBody.parse(req.body)
        const findOtp = await db.select().from(otp).where(and(eq(otp.id, otpId), eq(otp.token, token), eq(otp.userId, userId))).limit(1);
        if (findOtp.length === 0) {
            return res.status(200).json({ status: "failed", message: 'Invalid OTP'});
        }
        if((Date.now() - findOtp[0].createdAt.getTime() > 1000 * 60 * 5)){
            return res.status(200).json({ status: "failed", message: 'OTP expired'})
        }
        const hashedPassword = await argon2.hash(password)
        const updateStatus = await db.update(users).set({password: hashedPassword}).where(eq(users.id, userId))
        if(updateStatus[0].affectedRows === 1){
            await db.delete(otp).where(eq(otp.userId, userId))
        }
        return res.status(200).json({status : 'success', message: "Password updated successfully"})
    }catch(error){
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                name: 'invalid data type',
                message: JSON.parse(error.message)
            })
        }
        return res.status(500).json({ message: 'internal server error' })
    }
}