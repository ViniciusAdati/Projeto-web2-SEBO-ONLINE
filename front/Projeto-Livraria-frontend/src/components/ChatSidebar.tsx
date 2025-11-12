import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { FaTimes, FaSearch, FaUserCircle } from "react-icons/fa";
import "../styles/ChatSidebar.css";
import { useAuth } from "../hooks/useAuth";

interface CommunityUser {
  id: number;
  name: string;
  totalLivros: number;
}

interface ChatSidebarProps {
  onClose: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ onClose }) => {
  const [users, setUsers] = useState<CommunityUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<CommunityUser[]>("/users/community");
        setUsers(response.data.filter((u) => u.id !== currentUser?.id));
      } catch (err) {
        console.error("Erro ao buscar usuários para chat:", err);
        setError("Não foi possível carregar usuários.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchUsers();
    } else {
      setLoading(false);
      setUsers([]);
    }
  }, [currentUser]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartChat = async (otherUserId: number) => {
    if (!currentUser?.id) {
      alert("Você precisa estar logado para iniciar um chat.");
      return;
    }
    try {
      console.log(`Iniciando chat entre ${currentUser.id} e ${otherUserId}`);
      const response = await api.post<{ negociacaoId: number }>(
        "/chat/initiate",
        {
          otherUserId: otherUserId,
        }
      );
      const { negociacaoId } = response.data;
      onClose();
      navigate(`/chat/${negociacaoId}`);
    } catch (error: any) {
      console.error("Erro ao iniciar chat:", error);
      alert(
        `Não foi possível iniciar o chat: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="chat-sidebar-overlay" onClick={onClose}>
      <div className="chat-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="chat-sidebar-header">
          <h2>Iniciar Conversa</h2>
          <button onClick={onClose} className="close-button">
            {" "}
            <FaTimes />{" "}
          </button>
        </div>
        <div className="chat-sidebar-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar usuário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="chat-user-list">
          {loading && <p>Carregando usuários...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && filteredUsers.length === 0 && (
            <p>Nenhum usuário encontrado.</p>
          )}
          {!loading &&
            !error &&
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="chat-user-item"
                onClick={() => handleStartChat(user.id)}
              >
                <FaUserCircle size={35} className="user-avatar-placeholder" />
                <span className="user-name">{user.name}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
