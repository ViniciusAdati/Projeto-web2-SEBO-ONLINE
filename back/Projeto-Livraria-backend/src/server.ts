// backend/src/server.ts (ou app.ts / index.ts)

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mainRouter from "./routes";
import http from "http";
import { Server, Socket } from "socket.io";
import { saveMessage, getOtherParticipantId } from "./services/chatService";
import wishlistRoutes from "./routes/wishlistRoutes";

// [1. ADICIONE A NOVA IMPORTAÇÃO AQUI]
import statsRoutes from "./routes/statsRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = ["http://localhost:5173", "http://localhost:8080"];

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

// [2. CORREÇÃO DE BUG]
// A rota estava "/wishlist" mas o frontend chama "/api/wishlist".
app.use("/api/wishlist", wishlistRoutes);

// [3. ADICIONE O NOVO USO AQUI]
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
  res.send("API do Projeto Web 2 (Troca de Livros) está funcionando!");
});

const httpServer = http.createServer(app);

// ... (O resto do seu código de Socket.io permanece 100% igual) ...
interface UserSocketMap {
  [userId: string]: string;
}
let userSockets: UserSocketMap = {};

const io = new Server(httpServer, {
  path: "/api/socket.io",
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: Socket) => {
  console.log(
    `--- [SOCKET.IO]: Um usuário se conectou. ID do Socket: ${socket.id} ---`
  );
  const userId = socket.handshake.query.userId as string;

  if (userId) {
    userSockets[userId] = socket.id;
  }

  socket.on("join_room", (negociacaoId: string) => {
    socket.join(negociacaoId);
  });

  socket.on("send_message", async (data) => {
    try {
      const messageId = await saveMessage(
        data.negociacaoId,
        data.remetenteId,
        data.conteudo
      );
      const messageWithId = { ...data, id: messageId };
      io.to(data.negociacaoId).emit("receive_message", messageWithId);
      const destinatarioId = await getOtherParticipantId(
        data.negociacaoId,
        data.remetenteId
      );
      if (destinatarioId) {
        const destinatarioSocketId = userSockets[destinatarioId.toString()];
        if (destinatarioSocketId) {
          io.to(destinatarioSocketId).emit("new_message_notification", {
            messageId,
            negociacaoId: data.negociacaoId,
            remetente_nome: data.remetente_nome,
            timestamp: data.timestamp,
          });
        }
      }
    } catch (error) {
      console.error("Erro no socket 'send_message':", error);
    }
  });

  socket.on("disconnect", () => {
    if (userId && userSockets[userId] === socket.id) {
      delete userSockets[userId];
    }
    console.log(
      `--- [SOCKET.IO]: Usuário (ID: ${userId} / Socket: ${socket.id}) desconectou. ---`
    );
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor (Express + Socket.io) rodando na porta ${PORT}`);
});
