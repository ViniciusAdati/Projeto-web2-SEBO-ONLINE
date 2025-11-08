import { Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware";
import * as wishlistService from "../services/wishlistService";
import { pool } from "../config/database";

export const toggleFavorite = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { inventarioId } = req.body;

    if (!inventarioId) {
      return res
        .status(400)
        .json({ message: "ID do item de inventário é obrigatório." });
    }

    const result = await wishlistService.toggleWishlistItem(
      userId,
      Number(inventarioId)
    );
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("[wishlistController:toggle] Erro:", error);
    return res
      .status(500)
      .json({
        message: error.message || "Erro interno ao processar favorito.",
      });
  }
};

export const getWishlist = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT inventario_id FROM lista_desejos WHERE usuario_id = ?",
      [userId]
    );
    connection.release();
    const wishlistIds = (rows as any[]).map((row) => row.inventario_id);
    return res.status(200).json({ wishlist: wishlistIds });
  } catch (error: any) {
    console.error("[wishlistController:getWishlist] Erro:", error);
    return res
      .status(500)
      .json({ message: error.message || "Erro ao buscar lista de desejos." });
  }
};
