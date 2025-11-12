import { pool } from "../config/database";
import { RowDataPacket, PoolConnection } from "mysql2/promise";
interface ParticipantRow extends RowDataPacket {
  usuario_id: number;
}

interface NegociacaoRow extends RowDataPacket {
  id: number;
  negociacao_id: number;
}

export const findOrCreateNegociacao = async (
  userId1: number,
  userId2: number
): Promise<number> => {
  let connection: PoolConnection | null = null;
  let transactionStarted = false;

  try {
    connection = await pool.getConnection();
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
      connection.release();
      connection = null;
      return rows[0].negociacao_id;
    }

    await connection.beginTransaction();
    transactionStarted = true;

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

    await connection.commit();
    transactionStarted = false;

    console.log(
      `[ChatService] Negociação (ID: ${negociacaoId}) criada entre usuários ${userId1} e ${userId2}`
    );
    return negociacaoId;
  } catch (error) {
    if (connection && transactionStarted) {
      console.log("[ChatService] Rollback transaction due to error.");
      await connection.rollback();
    }
    console.error("[ChatService] Erro ao buscar/criar negociação:", error);
    throw new Error("Falha ao iniciar chat.");
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const saveMessage = async (
  negociacaoId: number,
  remetenteId: number,
  conteudo: string
): Promise<number> => {
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
    return result.insertId;
  } catch (error) {
    console.error("[ChatService] Erro ao salvar mensagem:", error);
    throw new Error("Falha ao salvar mensagem.");
  }
};

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
        `;
    const [rows] = await pool.execute<ParticipantRow[]>(sql, [
      negociacaoId,
      remetenteId,
    ]);

    if (rows.length > 0) {
      return rows[0].usuario_id;
    }
    return null;
  } catch (error) {
    console.error(
      "[ChatService:getOtherParticipantId] Erro ao buscar outro participante:",
      error
    );
    return null;
  }
};
