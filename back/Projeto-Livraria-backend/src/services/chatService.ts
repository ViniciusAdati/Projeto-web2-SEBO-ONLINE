import { pool } from "../config/database";
// Adiciona PoolConnection à importação
import { RowDataPacket, PoolConnection } from "mysql2/promise";
// ^^^ Note: usamos 'mysql2/promise' pois estamos usando await/async com o pool
// Interface para a busca de participantes
interface ParticipantRow extends RowDataPacket {
  usuario_id: number;
}

// Interface para a busca de negociação (mantida)
interface NegociacaoRow extends RowDataPacket {
  id: number;
  negociacao_id: number;
}

export const findOrCreateNegociacao = async (
  userId1: number,
  userId2: number
): Promise<number> => {
  let connection: PoolConnection | null = null; // Declare connection outside try
  let transactionStarted = false; // Flag to track transaction

  try {
    connection = await pool.getConnection(); // Get connection

    // SELECT outside transaction
    const sqlFind = `
      SELECT np1.negociacao_id 
      FROM negociacao_participantes np1 
      JOIN negociacao_participantes np2 ON np1.negociacao_id = np2.negociacao_id 
      WHERE (np1.usuario_id = ? AND np2.usuario_id = ?) 
         OR (np1.usuario_id = ? AND np2.usuario_id = ?);
    `;
    const [rows] = await connection.execute<NegociacaoRow[]>(sqlFind, [
      userId1,
      userId2,
      userId2,
      userId1,
    ]);

    if (rows.length > 0) {
      connection.release(); // Release connection
      connection = null; // Mark as released
      return rows[0].negociacao_id;
    }

    // --- Start Transaction ONLY if creating ---
    await connection.beginTransaction();
    transactionStarted = true; // Set flag

    const [negResult]: any = await connection.execute(
      "INSERT INTO negociacoes (status) VALUES (?)",
      ["Pendente"]
    );
    const negociacaoId = negResult.insertId;

    await connection.execute(
      "INSERT INTO negociacao_participantes (negociacao_id, usuario_id) VALUES (?, ?)",
      [negociacaoId, userId1]
    );
    await connection.execute(
      "INSERT INTO negociacao_participantes (negociacao_id, usuario_id) VALUES (?, ?)",
      [negociacaoId, userId2]
    );

    await connection.commit(); // Commit transaction
    transactionStarted = false; // Reset flag after commit

    console.log(
      `[ChatService] Negociação (ID: ${negociacaoId}) criada entre usuários ${userId1} e ${userId2}`
    );
    return negociacaoId;
  } catch (error) {
    // --- Rollback only if transaction was started ---
    if (connection && transactionStarted) {
      console.log("[ChatService] Rollback transaction due to error.");
      await connection.rollback();
    }
    console.error("[ChatService] Erro ao buscar/criar negociação:", error);
    throw new Error("Falha ao iniciar chat.");
  } finally {
    // --- Release connection if it still exists ---
    if (connection) {
      connection.release();
    }
  }
};

// Função saveMessage (mantida, nome da tabela corrigido)
export const saveMessage = async (
  negociacaoId: number,
  remetenteId: number,
  conteudo: string
): Promise<number> => {
  // Modificado para retornar o ID da mensagem salva
  try {
    const sql = `
      INSERT INTO mensagens (negociacao_id, remetente_id, conteudo) 
      VALUES (?, ?, ?);
    `;
    const [result]: any = await pool.execute(sql, [
      negociacaoId,
      remetenteId,
      conteudo,
    ]);
    console.log(
      `[ChatService] Mensagem salva (ID: ${result.insertId}) para negociação (ID: ${negociacaoId})`
    );
    return result.insertId; // Retorna o ID da nova mensagem
  } catch (error) {
    console.error("[ChatService] Erro ao salvar mensagem:", error);
    throw new Error("Falha ao salvar mensagem.");
  }
};

// Função getMessageHistory (mantida, nomes das tabelas corrigidos)
export const getMessageHistory = async (negociacaoId: number) => {
  try {
    const sql = `
      SELECT m.id, m.remetente_id, m.conteudo, m.timestamp, u.nome as remetente_nome
      FROM mensagens m 
      JOIN usuarios u ON m.remetente_id = u.id 
      WHERE m.negociacao_id = ?
      ORDER BY m.timestamp ASC;
    `;
    const [rows] = await pool.execute(sql, [negociacaoId]);
    return rows;
  } catch (error) {
    console.error(
      "[ChatService] Erro ao buscar histórico de mensagens:",
      error
    );
    throw new Error("Falha ao buscar histórico.");
  }
};

// --- NOVA FUNÇÃO HELPER ---
// Busca o ID do outro participante em uma negociação
export const getOtherParticipantId = async (
  negociacaoId: number,
  remetenteId: number
): Promise<number | null> => {
  try {
    const sql = `
            SELECT usuario_id 
            FROM negociacao_participantes 
            WHERE negociacao_id = ? AND usuario_id != ? 
            LIMIT 1; 
        `; // Tabelas minúsculas
    const [rows] = await pool.execute<ParticipantRow[]>(sql, [
      negociacaoId,
      remetenteId,
    ]);

    if (rows.length > 0) {
      return rows[0].usuario_id;
    }
    return null; // Não encontrou outro participante (estranho, mas possível)
  } catch (error) {
    console.error(
      "[ChatService:getOtherParticipantId] Erro ao buscar outro participante:",
      error
    );
    // Não lançar erro aqui, apenas retornar null para não quebrar o fluxo de notificação
    return null;
  }
};
// --- FIM DA NOVA FUNÇÃO ---
