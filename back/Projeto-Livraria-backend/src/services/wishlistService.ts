import { pool } from "../config/database";
import { RowDataPacket } from "mysql2";

interface WishlistItem extends RowDataPacket {
  id: number;
}

export const toggleWishlistItem = async (
  userId: number,
  inventarioId: number
): Promise<{ isFavorited: boolean }> => {
  const connection = await pool.getConnection();
  try {
    const checkSql =
      "SELECT id FROM lista_desejos WHERE usuario_id = ? AND inventario_id = ?";
    const [rows] = await connection.execute<WishlistItem[]>(checkSql, [
      userId,
      inventarioId,
    ]);

    if (rows.length > 0) {
      const deleteSql = "DELETE FROM lista_desejos WHERE id = ?";
      await connection.execute(deleteSql, [rows[0].id]);
      return { isFavorited: false };
    } else {
      const insertSql =
        "INSERT INTO lista_desejos (usuario_id, inventario_id) VALUES (?, ?)";
      await connection.execute(insertSql, [userId, inventarioId]);
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
