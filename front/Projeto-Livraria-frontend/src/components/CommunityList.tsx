import React from "react";
import "../styles/CommunityList.css";
import { FaUserCircle } from "react-icons/fa";

interface CommunityUser {
  id: number;
  name: string;
  totalLivros: number;
  avatarUrl?: string;
}

interface CommunityListProps {
  users: CommunityUser[];
}

// 1. Alteração aqui: definimos um valor padrão 'users = []'
export const CommunityList: React.FC<CommunityListProps> = ({ users = [] }) => {
  // Verificação de segurança: Se users não for um array (por causa do erro da API), forçamos ser vazio
  const safeUsers = Array.isArray(users) ? users : [];

  return (
    <div className="top-traders-list">
      <h3>Comunidade</h3>
      <ul>
        {/* 2. Alteração: Usamos 'safeUsers' em vez de 'users' */}
        {safeUsers.map((user) => (
          <li key={user.id}>
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="trader-avatar"
              />
            ) : (
              <FaUserCircle size={35} className="trader-avatar-placeholder" />
            )}

            <div className="trader-info">
              <span className="trader-name">{user.name}</span>
              <span className="trader-trades">
                {user.totalLivros} {user.totalLivros === 1 ? "livro" : "livros"}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Exibe mensagem se a lista estiver vazia OU se deu erro na API */}
      {safeUsers.length === 0 && (
        <p className="community-list-empty">
          Nenhum membro na comunidade ainda (ou erro de conexão).
        </p>
      )}
    </div>
  );
};
