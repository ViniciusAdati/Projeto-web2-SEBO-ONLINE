// backend/src/controllers/statsController.ts

import { Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware";
// Importa a função que criamos no Passo 1 (que colocamos no wishlistService)
import { getDashboardStats } from "../services/wishlistService";

export const getDashboardStatsController = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id; // Pega o ID do usuário logado

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    // Chama a função do serviço que faz todo o trabalho
    const stats = await getDashboardStats(userId);

    // Retorna o objeto completo com os 4 números
    // ex: { myCollectionCount: 156, otherBooksCount: 24, ... }
    return res.status(200).json(stats);
  } catch (error: any) {
    console.error("[statsController:get] Erro:", error);
    return res.status(500).json({
      message: error.message || "Erro interno ao buscar estatísticas.",
    });
  }
};
