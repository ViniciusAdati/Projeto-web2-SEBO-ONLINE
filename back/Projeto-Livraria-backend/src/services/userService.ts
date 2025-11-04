import { pool } from "../config/database";
import { RowDataPacket } from "mysql2"; // Import necessário para tipagem

// Função existente - CORRIGIDA (nome da tabela)
export const getAllUsersPublic = async () => {
  try {
    const sql = `
      SELECT id, nome, data_cadastro, cidade, estado 
      FROM usuarios -- Corrigido para minúsculo
      ORDER BY data_cadastro DESC;
    `;
    const [rows] = await pool.execute(sql);
    return rows;
  } catch (error) {
    console.error(
      "[userService:getAllUsersPublic] Erro ao buscar usuários:",
      error
    );
    throw new Error("Falha ao buscar lista de usuários.");
  }
};

// Função existente - CORRIGIDA (nome da tabela)
export const getUserByIdPublic = async (userId: number) => {
  try {
    const sql = `
      SELECT id, nome, cidade, estado, data_cadastro 
      FROM usuarios -- Corrigido para minúsculo
      WHERE id = ?;
    `;
    const [rows] = await pool.execute<RowDataPacket[]>(sql, [userId]); // Tipagem adicionada
    if (rows.length === 0) {
      throw new Error("Usuário não encontrado.");
    }
    return rows[0];
  } catch (error: any) {
    console.error(
      "[userService:getUserByIdPublic] Erro ao buscar usuário por ID:",
      error
    );
    throw new Error(error.message || "Falha ao buscar dados do usuário.");
  }
};

// --- FUNÇÃO getAllCommunityUsers MODIFICADA ---
export const getAllCommunityUsers = async () => {
  try {
    // Query que busca usuários e CONTA quantos itens cada um tem no inventário
    const sql = `
      SELECT 
        u.id, 
        u.nome, 
        u.data_cadastro,
        COUNT(inv.id) as total_livros -- Conta os itens no inventário
        -- u.avatarUrl -- Descomente se tiver
      FROM usuarios u -- Tabela principal é usuarios (minúsculo)
      LEFT JOIN inventario inv ON u.id = inv.usuario_id -- Junta com inventario (minúsculo)
      GROUP BY u.id -- Agrupa por usuário para contar corretamente
      ORDER BY u.data_cadastro DESC -- Ordena pelos mais recentes
      -- LIMIT 20; -- Descomente se quiser limitar
    `;
    const [rows] = await pool.execute<RowDataPacket[]>(sql);

    // Mapeia para o formato final
    return rows.map((user) => ({
      id: user.id,
      name: user.nome, // Mapeado para 'name'
      // avatarUrl: user.avatarUrl || '/default-avatar.png', // Exemplo
      totalLivros: user.total_livros, // Passa a contagem de livros
      // membroDesde: user.data_cadastro // Pode manter se quiser
    }));
  } catch (error) {
    console.error(
      "[userService:getAllCommunityUsers] Erro ao buscar usuários:",
      error
    );
    throw new Error("Falha ao buscar usuários da comunidade.");
  }
};
// --- FIM DA FUNÇÃO MODIFICADA ---
