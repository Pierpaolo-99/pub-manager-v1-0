// Interfaccia per i filtri di getAllUsers
interface UserFilters {
  search?: string | undefined;
  role?: Role | string | undefined;
  active?: boolean | undefined;
  page?: number | undefined;
  pageSize?: number | undefined;
}
import { PrismaClient, Role } from "../../../generated/prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export class UserService {
    // Statistiche utenti
    static async getStats() {
      const total = await prisma.user.count();
      const active = await prisma.user.count({ where: { active: true } });
      const inactive = await prisma.user.count({ where: { active: false } });
      // Conteggio per ruolo
      const roles = await prisma.user.groupBy({
        by: ['role'],
        _count: { role: true }
      });
      return { total, active, inactive, roles };
    }
  // Creazione utente
  static async createUser(data: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: Role;
    active?: boolean;
  }) {
    // Controllo duplicati
    const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingEmail) throw new Error("Email already registered");
    const existingUsername = await prisma.user.findUnique({ where: { username: data.username } });
    if (existingUsername) throw new Error("Username already registered");

    // Hash della password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName ?? null,
        lastName: data.lastName ?? null,
        phone: data.phone ?? null,
        role: data.role || "WAITER",
        active: data.active !== undefined ? data.active : true
      },
    });

    return user;
  }

  // Recupero tutti gli utenti
  // Recupero utenti con filtri e paginazione
  static async getAllUsers({ search, role, active, page = 1, pageSize = 20 }: UserFilters = {}) {
    const where: any = {};
    if (search) {
      where.OR = [
        { username: { contains: search } },
        { email: { contains: search } },
        { firstName: { contains: search } },
        { lastName: { contains: search } }
      ];
    }
    if (role) where.role = role;
    if (active !== undefined) where.active = active;
    const skip = (page - 1) * pageSize;
    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, orderBy: { username: "asc" }, skip, take: pageSize }),
      prisma.user.count({ where })
    ]);
    return { users, total, page, pageSize, filters: { search, role, active } };
  }

  // Recupero singolo utente per ID
  static async getUserById(id: number) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error("User not found");
    return user;
  }

  // Aggiornamento utente
  static async updateUser(id: number, data: Partial<{
    username?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: Role;
    active?: boolean;
  }>) {
    // Gestione duplicati
    if (data.email) {
      const existingEmail = await prisma.user.findFirst({ where: { email: data.email, NOT: { id } } });
      if (existingEmail) throw new Error("Email already registered");
    }
    if (data.username) {
      const existingUsername = await prisma.user.findFirst({ where: { username: data.username, NOT: { id } } });
      if (existingUsername) throw new Error("Username already registered");
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    // Conversione campi opzionali
    // Conversione campi opzionali (solo se il tipo Prisma è string | null)
    if (data.firstName === undefined) delete data.firstName;
    if (data.lastName === undefined) delete data.lastName;
    if (data.phone === undefined) delete data.phone;

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });
    return updatedUser;
  }

  // Cancellazione utente
  static async deleteUser(id: number) {
    await prisma.user.delete({ where: { id } });
    return { message: "User deleted successfully" };
  }
}
