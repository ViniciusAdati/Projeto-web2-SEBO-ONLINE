import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mainRouter from "./routes";
import http from "http";
import { Server, Socket } from "socket.io"; // Importa Socket também
// Importa a nova função do chatService
import { saveMessage, getOtherParticipantId } from "./services/chatService";

const app = express();
const PORT = process.env.PORT || 3000; // Usa a porta 3000 definida no docker-compose

const allowedOrigins = [
  "http://localhost:5173", // Dev server
  "http://localhost:8080", // Contêiner frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Origem não permitida pelo CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());
app.use("/api", mainRouter);

app.get("/", (req, res) => {
  res.send("API do Projeto Web 2 (Troca de Livros) está funcionando!");
});

const httpServer = http.createServer(app);

// --- NOVO: Mapeamento de userId para socketId ---
interface UserSocketMap {
  [userId: string]: string; // Chave é userId (string), Valor é socket.id (string)
}
let userSockets: UserSocketMap = {};
// --- FIM NOVO ---

const io = new Server(httpServer, {
  // Configuração do Socket.io (path e cors)
  path: "/api/socket.io",
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: Socket) => {
  // Tipagem do socket
  console.log(
    `--- [SOCKET.IO]: Um usuário se conectou. ID do Socket: ${socket.id} ---`
  );

  // Pega o userId passado pelo frontend na conexão
  const userId = socket.handshake.query.userId as string; // Pega como string

  // --- NOVO: Armazena a associação userId -> socketId ---
  if (userId) {
    console.log(
      `--- [SOCKET.IO]: Associando Usuário (ID: ${userId}) ao Socket (ID: ${socket.id}).`
    );
    userSockets[userId] = socket.id;
  } else {
    console.warn(
      `--- [SOCKET.IO]: Conexão sem userId recebida. Socket ID: ${socket.id}`
    );
  }
  // --- FIM NOVO ---

  socket.on("join_room", (negociacaoId: string) => {
    socket.join(negociacaoId);
    console.log(
      `--- [SOCKET.IO]: Usuário (ID: ${userId} / Socket: ${socket.id}) entrou na sala: ${negociacaoId} ---`
    );
  });

  // --- LÓGICA DE NOTIFICAÇÃO ADICIONADA AQUI ---
  socket.on("send_message", async (data) => {
    // 'data' deve conter: { negociacaoId, remetenteId, remetente_nome, conteudo, timestamp }
    try {
      // 1. Salva a mensagem no banco e pega o ID dela
      const messageId = await saveMessage(
        data.negociacaoId,
        data.remetenteId,
        data.conteudo
      );

      // 2. Emite a mensagem para todos na sala (incluindo o remetente, para UI)
      // Criamos um objeto com o ID da mensagem para o frontend
      const messageWithId = { ...data, id: messageId };
      io.to(data.negociacaoId).emit("receive_message", messageWithId); // Envia com ID

      console.log(
        `--- [SOCKET.IO]: Mensagem (ID: ${messageId}) retransmitida para a sala: ${data.negociacaoId} ---`
      );

      // --- LÓGICA DE NOTIFICAÇÃO ---
      // 3. Descobre quem é o OUTRO participante da conversa
      const destinatarioId = await getOtherParticipantId(
        data.negociacaoId,
        data.remetenteId
      );

      if (destinatarioId) {
        // 4. Verifica se o destinatário está online (no nosso mapeamento)
        const destinatarioSocketId = userSockets[destinatarioId.toString()]; // Converte ID para string

        if (destinatarioSocketId) {
          // 5. Envia a notificação DIRETAMENTE para o socket do destinatário
          console.log(
            `--- [SOCKET.IO]: Enviando notificação para Usuário (ID: ${destinatarioId} / Socket: ${destinatarioSocketId}) ---`
          );
          io.to(destinatarioSocketId).emit("new_message_notification", {
            messageId: messageId, // ID da mensagem salva
            negociacaoId: data.negociacaoId,
            remetente_nome: data.remetente_nome,
            timestamp: data.timestamp, // Usa o timestamp enviado pelo remetente
            // snippet: data.conteudo.substring(0, 30) + "..." // Opcional: Trecho da msg
          });
        } else {
          console.log(
            `--- [SOCKET.IO]: Destinatário (ID: ${destinatarioId}) não está online. Notificação não enviada em tempo real.`
          );
          // Aqui você poderia adicionar lógica para notificações push ou email no futuro
        }
      } else {
        console.warn(
          `--- [SOCKET.IO]: Não foi possível encontrar o destinatário para a negociação ${data.negociacaoId}.`
        );
      }
      // --- FIM LÓGICA DE NOTIFICAÇÃO ---
    } catch (error) {
      console.error("Erro no socket 'send_message':", error);
      // Opcional: Emitir um erro de volta para o remetente
      // socket.emit('send_message_error', { message: "Não foi possível enviar a mensagem." });
    }
  });
  // --- FIM DAS ALTERAÇÕES no send_message ---

  socket.on("disconnect", () => {
    // --- NOVO: Remove a associação ao desconectar ---
    if (userId && userSockets[userId] === socket.id) {
      // Verifica se era este socket mesmo
      console.log(
        `--- [SOCKET.IO]: Desassociando Usuário (ID: ${userId}) do Socket (ID: ${socket.id}).`
      );
      delete userSockets[userId];
    }
    // --- FIM NOVO ---
    console.log(
      `--- [SOCKET.IO]: Usuário (ID: ${userId} / Socket: ${socket.id}) desconectou. ---`
    );
  });
});

httpServer.listen(PORT, () => {
  console.log(
    `🚀 Servidor (Express + Socket.io) rodando com sucesso na porta ${PORT}`
  );
  console.log("Banco de dados conectado (via pool).");
});
