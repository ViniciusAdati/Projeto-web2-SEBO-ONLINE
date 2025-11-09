// src/services/wishlistService.ts (Backend)

import { pool } from "../config/database";
import { RowDataPacket } from "mysql2";

// Interface para o item retornado pelo toggle do inventário
interface WishlistItem extends RowDataPacket {
  id: number;
}
interface GoogleWishlistItem extends RowDataPacket {
  id: number;
}

/**
 * [Função 1 - Mantida]
 * Busca a lista de desejos (do Inventário) e padroniza os campos.
 */
export const getWishlistByUserId = async (userId: number) => {
  const sql = `
    SELECT
      w.id as id,
      i.id as inventario_id,
      i.estado_conservacao,
      l.titulo as title,
      l.autor as author,
      l.url_capa as imageUrl,
      'inventory' as type
    FROM
      wishlist AS w
    JOIN
      inventario AS i ON w.inventario_id = i.id
    JOIN
      livros AS l ON i.livro_id = l.id
    WHERE
      w.user_id = ?;
  `;

  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(sql, [userId]);
    return rows;
  } catch (error) {
    console.error(
      "[WishlistService:getWishlistByUserId] Erro ao buscar wishlist:",
      error
    );
    throw new Error("Erro ao buscar sua lista de desejos.");
  } finally {
    connection.release();
  }
};

/**
 * [Função 2 - Mantida]
 * Busca a lista de desejos (do Google) e padroniza os campos.
 */
export const getGoogleWishlistByUserId = async (userId: number) => {
  const sql = `
    SELECT
      id,
      google_book_id,
      title,
      author,
      image_url as imageUrl,
      'google' as type
    FROM
      wishlist_books
    WHERE
      user_id = ?;
  `;

  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(sql, [userId]);
    return rows;
  } catch (error) {
    console.error(
      "[WishlistService:getGoogleWishlistByUserId] Erro ao buscar wishlist do Google:",
      error
    );
    throw new Error("Erro ao buscar sua lista de desejos do Google.");
  } finally {
    connection.release();
  }
};

/**
 * [Função 3 - CORRIGIDA COM TRANSAÇÃO]
 * Adiciona ou remove um item do INVENTÁRIO ('wishlist').
 */
export const toggleWishlistItem = async (
  userId: number,
  inventarioId: number
): Promise<{ isFavorited: boolean }> => {
  const connection = await pool.getConnection();
  try {
    // Inicia a transação
    await connection.beginTransaction();

    const checkSql =
      "SELECT id FROM wishlist WHERE user_id = ? AND inventario_id = ?";
    const [rows] = await connection.execute<WishlistItem[]>(checkSql, [
      userId,
      inventarioId,
    ]);

    if (rows.length > 0) {
      const deleteSql = "DELETE FROM wishlist WHERE id = ?";
      await connection.execute(deleteSql, [rows[0].id]);
      await connection.commit(); // Salva as mudanças
      return { isFavorited: false };
    } else {
      const insertSql =
        "INSERT INTO wishlist (user_id, inventario_id) VALUES (?, ?)";
      await connection.execute(insertSql, [userId, inventarioId]);
      await connection.commit(); // Salva as mudanças
      return { isFavorited: true };
    }
  } catch (error) {
    await connection.rollback(); // Desfaz em caso de erro
    console.error(
      "[WishlistService:toggle] Erro ao favoritar/desfavoritar:",
      error
    );
    throw new Error("Erro ao processar sua solicitação de favoritos.");
  } finally {
    connection.release();
  }
};

/**
 * [Função 4 - CORRIGIDA COM TRANSAÇÃO]
 * Adiciona ou remove um LIVRO DO GOOGLE da 'wishlist_books'.
 */
export const toggleGoogleBook = async (
  userId: number,
  googleBookId: string,
  bookDetails: { title: string; author: string; imageUrl: string }
) => {
  const connection = await pool.getConnection();
  try {
    // Inicia a transação
    await connection.beginTransaction();

    const checkSql =
      "SELECT id FROM wishlist_books WHERE user_id = ? AND google_book_id = ?";

    const [rows] = await connection.execute<GoogleWishlistItem[]>(checkSql, [
      userId,
      googleBookId,
    ]);

    if (rows.length > 0) {
      // Já existe, vamos remover
      const deleteSql = "DELETE FROM wishlist_books WHERE id = ?";
      await connection.execute(deleteSql, [rows[0].id]);
      await connection.commit(); // Salva as mudanças
      return { isFavorited: false };
    } else {
      // Não existe, vamos adicionar
      const insertSql =
        "INSERT INTO wishlist_books (user_id, google_book_id, title, author, image_url) VALUES (?, ?, ?, ?, ?)";
      await connection.execute(insertSql, [
        userId,
        googleBookId,
        bookDetails.title,
        bookDetails.author,
        bookDetails.imageUrl,
      ]);
      await connection.commit(); // Salva as mudanças
      return { isFavorited: true };
    }
  } catch (error) {
    await connection.rollback(); // Desfaz em caso de erro
    console.error(
      "[WishlistService:toggleGoogleBook] Erro ao favoritar livro do Google:",
      error
    );
    throw new Error("Erro ao processar sua solicitação de favoritos.");
  } finally {
    connection.release();
  }
};
