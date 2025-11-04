import { Request, Response } from "express";
import * as userService from "../services/userService";

// Função existente
export const getPublicUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsersPublic();
    res.status(200).json(users);
  } catch (error: any) {
    console.error("[userController:getPublicUsers] Erro:", error); // Adicionado console.error
    res.status(500).json({ message: error.message });
  }
};

// Função existente
export const getPublicUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "ID de usuário inválido." });
    }
    const user = await userService.getUserByIdPublic(userId);
    res.status(200).json(user);
  } catch (error: any) {
    console.error("[userController:getPublicUserById] Erro:", error); // Adicionado console.error
    if (error.message === "Usuário não encontrado.") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// --- NOVA FUNÇÃO CONTROLLER ---
export const getCommunityUsers = async (req: Request, res: Response) => {
  try {
    // Chama a nova função do service
    const users = await userService.getAllCommunityUsers();
    res.status(200).json(users);
  } catch (error: any) {
    console.error(
      "[userController:getCommunityUsers] Erro ao buscar usuários da comunidade:",
      error
    ); // Log do erro
    res
      .status(500)
      .json({ message: error.message || "Erro interno ao buscar usuários." });
  }
};
// --- FIM DA NOVA FUNÇÃO ---
