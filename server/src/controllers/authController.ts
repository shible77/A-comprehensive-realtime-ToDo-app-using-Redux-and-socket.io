import { Request, Response } from "express";
import argon2 from "argon2";
import { users } from "../db/schema";
import { db } from "../db/setup";
import { generateToken } from "../utils/jwt";
import { eq, or } from "drizzle-orm";
import z from "zod";
import { SessionRequest } from "../middlewares/verifySession";

const registerBodySchema = z.object({
    email: z.email(),
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(100),
})
export const register = async (req: Request, res: Response) => {
    try {
        const { email, username, password } = registerBodySchema.parse(req.body);
        const hashedPassword = await argon2.hash(password);
        const alreadyExists = await db.select().from(users).where(or(eq(users.email, email), eq(users.username, username)));
        if (alreadyExists.length > 0) {
            return res.status(204).json({ message: "User already exists" });
        }
        const user = await db.insert(users).values({ email, username, password: hashedPassword }).$returningId();
        return res.status(201).json({
            message: "User registered successfully",
            userId: user[0].id,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(501).json({ name: "Invalid data type.", message: JSON.parse(error.message) });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
} 

const loginBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(100),
})
export const login = async (req: Request, res: Response) => {
    try{
        const { email, password } = loginBodySchema.parse(req.body);
        const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (user.length === 0) {
            return res.status(204).json({ message: "User not found" });
        }
        const isPasswordValid = await argon2.verify(user[0].password, password);
        if (!isPasswordValid) {
            return res.status(204).json({ message: "Invalid password" });
        }
        const token = generateToken({userId: user[0].id});
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        return res.status(200).json({
            status: "success",
            user: {id: user[0].id, username: user[0].username, email: user[0].email},
        });

    }catch( error ){
        if (error instanceof z.ZodError) {
            return res.status(400).json({ name: "Invalid data type.", message: JSON.parse(error.message) });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = async (req: SessionRequest, res: Response) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        return res.status(200).json({ status: "success" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getUser = async (req: SessionRequest, res: Response) => {
    try {
        const userId = req.userId;
        
        const user = await db.select().from(users).where(eq(users.id, userId!)).limit(1);
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            status: "success",
            user: { id: user[0].id, username: user[0].username, email: user[0].email },
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}