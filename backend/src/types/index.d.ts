import { Role } from "../generated/prisma/enums";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      role: Role;
      // altri campi se servono
    };
  }
}
