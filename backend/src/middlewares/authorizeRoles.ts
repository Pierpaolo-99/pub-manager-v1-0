/// <reference path="../types/index.d.ts" />
import { Request, Response, NextFunction } from "express";
import { Role } from "../generated/prisma/enums";

/**
 * Middleware per autorizzazione basata su ruoli (RBAC)
 * @param allowedRoles - array di ruoli ammessi
 */
export function authorizeRoles(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Accesso negato: ruolo non autorizzato" });
    }
    next();
  };
}
