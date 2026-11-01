import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mosswood-super-secret-jwt-key-2026";

export interface DecodedUser {
  userId: string;
  username: string;
  role: "OWNER" | "ADMIN" | "USER";
}

export function verifyToken(token: string): DecodedUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedUser;
    return decoded;
  } catch (err) {
    return null;
  }
}

