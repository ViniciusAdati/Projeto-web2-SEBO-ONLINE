// back/Projeto-Livraria-backend/src/services/inventoryService.ts

import { pool } from "../config/database";
import { RowDataPacket, PoolConnection } from "mysql2/promise"; // Importa PoolConnection

interface BookInputData {
  googleBookId: string;
  title: string;
  author: string;
  imageUrl: string;
  condition: string;
  tradeValue: number;
  description: string;
}

export const addBookToInventory = async (
  userId: number,
  bookData: BookInputData
) => {
  const connection: PoolConnection = await pool.getConnection(); // Tipagem explícita

  try {
    await connection.beginTransaction();

    const bookSql = `
      INSERT INTO livros (google_book_id, titulo, autor, url_capa, descricao_geral)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        titulo = VALUES(titulo), autor = VALUES(autor), url_capa = VALUES(url_capa), id = LAST_INSERT_ID(id);
    `; // 'livros' minúsculo
    
    const [bookResult]: any = await connection.execute(bookSql, [
      bookData.googleBookId,
      bookData.title,
      bookData.author,
      bookData.imageUrl,
      bookData.description || null,
    ]);

    let livroId = bookResult.insertId;
    if (livroId === 0 && bookData.googleBookId) { 
        const [rows] = await connection.execute<RowDataPacket[]>(
            "SELECT id FROM livros WHERE google_book_id = ?",
            [bookData.googleBookId]
        );
        if (rows.length > 0) {
            livroId = rows[0].id;
        } else {
             throw new Error("Não foi possível encontrar o livro na tabela 'livros'.");
        }
    }
     if (!livroId) {
        throw new Error("ID do livro inválido.");
     }

    const inventorySql = `
      INSERT INTO inventario (usuario_id, livro_id, estado_conservacao, valor_troca, descricao_usuario)
      VALUES (?, ?, ?, ?, ?)
    `; // 'inventario' minúsculo
    await connection.execute(inventorySql, [
      userId,
      livroId,
      bookData.condition,
      bookData.tradeValue,
      bookData.description,
    ]);

    await connection.commit();
    console.log(`[InventoryService] Livro (ID: ${livroId}) adicionado ao inventário do usuário (ID: ${userId})`);
    return { success: true, message: "Livro adicionado ao inventário." };
  } catch (error: any) { 
    await connection.rollback();
    console.error("[InventoryService] Erro ao adicionar livro:", error);
    throw new Error(`Falha ao salvar o livro: ${error.message || error}`);
  } finally {
    connection.release();
  }
};

export const deleteBookFromInventory = async (
  userId: number,
  inventoryId: number
) => {
  try {
    const sql = `
      DELETE FROM inventario 
      WHERE id = ? AND usuario_id = ?;
    `; // 'inventario' minúsculo

    const [result]: any = await pool.execute(sql, [inventoryId, userId]);

    if (result.affectedRows > 0) {
      return { success: true, message: "Item removido com sucesso." };
    } else {
      throw new Error(
        "Item não encontrado ou usuário não autorizado para deletar este item."
      );
    }
  } catch (error: any) {
    console.error("[InventoryService] Erro ao deletar item:", error);
    throw new Error(error.message || "Falha ao deletar o item.");
  }
};

export const getRecentBooks = async () => {
  try {
    // --- CORREÇÃO AQUI ---
    const sql = `
      SELECT
        inv.id as inventario_id,
        inv.valor_troca,
        inv.estado_conservacao,
        inv.descricao_usuario,
        l.titulo,
        l.autor,
        l.url_capa,
        u.nome as nome_usuario,
        u.id as usuario_id 
      FROM inventario AS inv
      JOIN livros AS l ON inv.livro_id = l.id
      JOIN usuarios AS u ON inv.usuario_id = u.id
      WHERE inv.disponivel_para_troca = true
      ORDER BY inv.data_adicao DESC
      LIMIT 10;
    `; // Nomes de tabelas em minúsculo e 'u.id as usuario_id' adicionado
    // --- FIM DA CORREÇÃO ---

    const [rows] = await pool.execute(sql);
    return rows;
  } catch (error) {
    console.error("[InventoryService] Erro ao buscar recentes:", error);
    throw new Error("Falha ao buscar livros recentes.");
  }
};

export const getBooksByUserId = async (userId: number) => {
  try {
    // --- CORREÇÃO AQUI ---
    const sql = `
      SELECT
        inv.id as inventario_id,
        inv.valor_troca,
        inv.estado_conservacao,
        inv.descricao_usuario,
        l.titulo,
        l.autor,
        l.url_capa,
        u.nome as nome_usuario,
        u.id as usuario_id
      FROM inventario AS inv
      JOIN livros AS l ON inv.livro_id = l.id
      JOIN usuarios AS u ON inv.usuario_id = u.id
      WHERE inv.usuario_id = ?
      ORDER BY inv.data_adicao DESC;
    `; // Nomes de tabelas em minúsculo e 'u.id as usuario_id' adicionado
    // --- FIM DA CORREÇÃO ---

    const [rows] = await pool.execute(sql, [userId]);
    return rows;
  } catch (error) {
    console.error("[InventoryService] Erro ao buscar livros do usuário:", error);
    throw new Error("Falha ao buscar livros deste usuário.");
  }
};