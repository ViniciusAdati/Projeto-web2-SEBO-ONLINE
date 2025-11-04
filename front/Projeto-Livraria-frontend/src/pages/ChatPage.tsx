import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getChatHistoryApi } from "../services/chatService";
import type { IChatMessage } from "../services/chatService";
// import { Navbar } from "../components/Navbar"; // <-- LINHA REMOVIDA
import "../styles/ChatPage.css";

export function ChatPage() {
  const { negociacaoId } = useParams<{ negociacaoId: string }>();
  const { user, socket } = useAuth();

  const [messagesList, setMessagesList] = useState<IChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!negociacaoId) return;
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const history = await getChatHistoryApi(negociacaoId);
        setMessagesList(history);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [negociacaoId]);

  useEffect(() => {
    if (!socket || !negociacaoId) return;
    socket.emit("join_room", negociacaoId);
    const messageListener = (data: IChatMessage) => {
      setMessagesList((prevList) => [...prevList, data]);
    };
    socket.on("receive_message", messageListener);
    return () => {
      socket.off("receive_message", messageListener);
    };
  }, [socket, negociacaoId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesList]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newMessage.trim() ||
      !socket ||
      !user?.id ||
      !user?.nome ||
      !negociacaoId
    )
      return;

    const messageDataSocket = {
      negociacaoId: Number(negociacaoId),
      remetenteId: user.id,
      remetente_nome: user.nome,
      conteudo: newMessage,
      timestamp: new Date().toISOString(),
    };
    socket.emit("send_message", messageDataSocket);

    const messageDataLocal: IChatMessage = {
      id: Math.random(),
      remetente_id: user.id,
      negociacaoId: negociacaoId, // Usa a string
      remetente_nome: user.nome,
      conteudo: newMessage,
      timestamp: messageDataSocket.timestamp,
    };

    setMessagesList((prevList) => [...prevList, messageDataLocal]);
    setNewMessage("");
  };

  if (loading) {
    return (
      <div>
        {/* <Navbar onChatIconClick={() => {}}/> */} {/* <-- LINHA REMOVIDA */}
        <p>Carregando histórico de chat...</p>
      </div>
    );
  }

  return (
    <div className="chat-page-container">
      {/* <Navbar onChatIconClick={() => {}}/> */} {/* <-- LINHA REMOVIDA */}
      <div className="chat-window">
        <div className="chat-header">
          {" "}
          <h3>Sala de Negociação</h3>{" "}
        </div>
        <div className="chat-body">
          {messagesList.map((msg) => (
            <div
              key={msg.id || Math.random()}
              className={`message-bubble ${
                msg.remetente_id === user?.id ? "sent" : "received"
              }`}
            >
              <strong>{msg.remetente_nome}:</strong>
              <p>{msg.conteudo}</p>
              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-footer" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage; // Adiciona export default
