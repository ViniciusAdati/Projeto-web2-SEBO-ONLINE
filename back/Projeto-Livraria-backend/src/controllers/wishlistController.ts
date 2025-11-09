// src/controllers/wishlistController.ts (Backend)

import { Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware";
import * as wishlistService from "../services/wishlistService";

/**
 * [Função 1 - MODIFICADA]
 * Busca AMBAS as wishlists (Inventário e Google) e as junta.
 */
export const getWishlist = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // 1. Chama as duas funções do serviço em paralelo
    const [inventoryList, googleList] = await Promise.all([
      wishlistService.getWishlistByUserId(userId),
      wishlistService.getGoogleWishlistByUserId(userId), // A nova função que criamos no Passo 1
    ]);

    // 2. Junta os dois arrays em uma lista só
    // (Usamos 'as any[]' para o TypeScript não reclamar dos tipos diferentes)
    const combinedList = [
      ...(inventoryList as any[]),
      ...(googleList as any[]),
    ];

    // 3. Retorna a lista combinada
    return res.status(200).json(combinedList);
  } catch (error: any) {
    console.error(
      "[wishlistController:getWishlist] Erro ao buscar wishlists:",
      error
    );
    return res
      .status(500)
      .json({ message: error.message || "Erro ao buscar lista de desejos." });
  }
};

/**
 * [Função 2 - Mantida]
 * Favorita itens do INVENTÁRIO. (Chamada por /toggle)
 */
export const toggleFavorite = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { bookId } = req.body; // Este é o inventarioId

    if (!bookId) {
      return res
        .status(400)
        .json({ message: "ID do item de inventário (bookId) é obrigatório." });
    }

    const result = await wishlistService.toggleWishlistItem(
      userId,
      Number(bookId)
    );
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("[wishlistController:toggle] Erro:", error);
    return res.status(500).json({
      message: error.message || "Erro interno ao processar favorito.",
    });
  }
};

/**
 * [Função 3 - Mantida]
 * Favorita LIVROS DO GOOGLE. (Chamada por /google-toggle)
 */
export const toggleGoogleFavorite = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const { bookId, title, author, imageUrl } = req.body; // Este é o google_book_id

    if (!bookId) {
      return res
        .status(400)
        .json({ message: "ID do livro (bookId) é obrigatório." });
    }

    const bookDetails = { title, author, imageUrl };

    const result = await wishlistService.toggleGoogleBook(
      userId,
      bookId,
      bookDetails
    );

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("[wishlistController:toggleGoogleFavorite] Erro:", error);
    return res.status(500).json({
      message: error.message || "Erro interno ao processar favorito.",
    });
  }
};
