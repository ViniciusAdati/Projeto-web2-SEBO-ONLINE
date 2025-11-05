// src/services/wishlistService.ts

import { pool } from "../config/database";
import { RowDataPacket } from "mysql2";

interface WishlistItem extends RowDataPacket {
  id: number;
}

/**
 * Adiciona ou remove um item da lista de desejos de um usuário.
 * Retorna o novo estado (se está favoritado ou não).
 */
export const toggleWishlistItem = async (
  userId: number,
  inventarioId: number
): Promise<{ isFavorited: boolean }> => {
  const connection = await pool.getConnection();
  try {
    // 1. Verifica se o item já está na lista de desejos
    const checkSql =
      "SELECT id FROM lista_desejos WHERE usuario_id = ? AND inventario_id = ?";
    const [rows] = await connection.execute<WishlistItem[]>(checkSql, [
      userId,
      inventarioId,
    ]);

    if (rows.length > 0) {
      // 2. Se JÁ EXISTE: Remove (desfavorita)
      const deleteSql = "DELETE FROM lista_desejos WHERE id = ?";
      await connection.execute(deleteSql, [rows[0].id]);
      console.log(
        `[WishlistService] Item ${inventarioId} removido dos favoritos do usuário ${userId}`
      );
      return { isFavorited: false };
    } else {
      // 3. Se NÃO EXISTE: Adiciona (favorita)
      const insertSql =
        "INSERT INTO lista_desejos (usuario_id, inventario_id) VALUES (?, ?)";
      await connection.execute(insertSql, [userId, inventarioId]);
      console.log(
        `[WishlistService] Item ${inventarioId} ADICIONADO aos favoritos do usuário ${userId}`
      );
      return { isFavorited: true };
    }
  } catch (error) {
    console.error(
      "[WishlistService:toggle] Erro ao favoritar/desfavoritar:",
      error
    );
    throw new Error("Erro ao processar sua solicitação de favoritos.");
  } finally {
    connection.release();
  }
};
