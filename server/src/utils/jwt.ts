import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  userId: number;
}

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
