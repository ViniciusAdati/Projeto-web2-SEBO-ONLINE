// src/controllers/wishlistController.ts

import { Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware"; // Importa o tipo de Request com 'user'
import * as wishlistService from "../services/wishlistService";

export const toggleFavorite = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.id; // Pega o ID do usuário logado (pelo token)
    const { inventarioId } = req.body; // Pega o ID do item do corpo da requisição

    if (!inventarioId) {
      return res
        .status(400)
        .json({ message: "ID do item de inventário é obrigatório." });
    }

    const result = await wishlistService.toggleWishlistItem(
      userId,
      Number(inventarioId)
    );
    return res.status(200).json(result); // Retorna { isFavorited: true } ou { isFavorited: false }
  } catch (error: any) {
    console.error("[wishlistController:toggle] Erro:", error);
    return res
      .status(500)
      .json({
        message: error.message || "Erro interno ao processar favorito.",
      });
  }
};
