import { pool } from "../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";

export const register = async (
  nome: string,
  email: string,
  senhaPlana: string
) => {
  const salt = await bcrypt.genSalt(10);
  const senhaHash = await bcrypt.hash(senhaPlana, salt);

  try {
    // --- CORREÇÃO AQUI ---
    const [result] = await pool.execute(
      "INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)", // Mudado para minúsculo
      [nome, email, senhaHash]
    );
    // --- FIM DA CORREÇÃO ---
    return { success: true, userId: (result as any).insertId };
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Este email já está cadastrado.");
    }
    throw new Error("Erro ao registrar usuário: " + error.message);
  }
};

export const login = async (email: string, senhaPlana: string) => {
  // --- CORREÇÃO AQUI ---
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM usuarios WHERE email = ?", // Mudado para minúsculo
    [email]
  );
  // --- FIM DA CORREÇÃO ---

  if (rows.length === 0) {
    throw new Error("Email ou senha inválidos.");
  }

  const usuario = rows[0];

  const senhaCorreta = await bcrypt.compare(senhaPlana, usuario.senha_hash);

  if (!senhaCorreta) {
    throw new Error("Email ou senha inválidos.");
  }

  // IMPORTANTE: Mova sua chave secreta para variáveis de ambiente (.env)!
  const secretKey =
    process.env.JWT_SECRET ||
    "MINHA_CHAVE_SECRETA_SUPER_LONGA_E_ALEATORIA_PARA_O_PROJETO_WEB2";

  if (!secretKey) {
    throw new Error("Chave JWT não configurada.");
  }

  const token = jwt.sign({ id: usuario.id, email: usuario.email }, secretKey, {
    expiresIn: "8h",
  });

  // Remova a senha hash antes de retornar o usuário
  delete usuario.senha_hash;

  return { usuario, token };
};
