import { PrismaClient, Role } from "../../../generated/prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN) || 86400; // default 1 giorno in secondi

export class AuthService {
  static async register(data: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: Role;
    active?: boolean;
  }) {
    const { username, email, password, firstName, lastName, phone, role, active } = data;

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) throw new Error("Email already registered");
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) throw new Error("Username already registered");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        phone: phone ?? null,
        role: role || Role.WAITER,
        active: active !== undefined ? active : true
      },
    });

    const token = jwt.sign({ userId: user.id, role: user.role, username: user.username }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return { user, token };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid credentials");

    // Aggiorna lastLogin
    await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

    const token = jwt.sign({ userId: user.id, role: user.role, username: user.username }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return { user, token };
  }
}






