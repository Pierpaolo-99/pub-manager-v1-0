import { Request, Response } from "express";
import { UserService } from "../services/usersService";

export class UserController {
  // Creazione utente
  static async createUser(req: Request, res: Response) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  // Recupera tutti gli utenti
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  // Recupera utente per ID
  static async getUserById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = await UserService.getUserById(id);
      res.json(user);
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  }

  // Aggiorna utente
  static async updateUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updatedUser = await UserService.updateUser(id, req.body);
      res.json(updatedUser);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  // Elimina utente
  static async deleteUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const result = await UserService.deleteUser(id);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
