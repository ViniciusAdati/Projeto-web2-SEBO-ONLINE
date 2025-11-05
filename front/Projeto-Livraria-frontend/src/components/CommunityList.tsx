import React from "react";
// Importa o CSS para este componente
import "../styles/CommunityList.css";
import { FaUserCircle } from "react-icons/fa"; // Ícone de usuário padrão

// Interface para os dados do usuário vindos do backend (via HomePage)
// Corresponde ao que o 'userService.ts' (backend) agora retorna
interface CommunityUser {
  id: number;
  name: string;
  totalLivros: number;
  avatarUrl?: string; // Opcional: se você decidir adicionar avatares
}

// Interface para as props que este componente recebe da HomePage
interface CommunityListProps {
  users: CommunityUser[];
}

export const CommunityList: React.FC<CommunityListProps> = ({ users }) => {
  return (
    // Esta classe .top-traders-list é usada para reutilizar o estilo
    <div className="top-traders-list">
      <h3>Comunidade</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {/* Lógica para mostrar avatar ou ícone padrão */}
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="trader-avatar"
              />
            ) : (
              <FaUserCircle size={35} className="trader-avatar-placeholder" />
            )}

            {/* Informações do usuário (Nome e Livros) */}
            <div className="trader-info">
              <span className="trader-name">{user.name}</span>
              <span className="trader-trades">
                {/* Lógica para "1 livro" ou "X livros" */}
                {user.totalLivros} {user.totalLivros === 1 ? "livro" : "livros"}
              </span>
            </div>

            {/* As estrelas de rating foram removidas, como solicitado */}
          </li>
        ))}
      </ul>

      {/* Mensagem caso a lista de usuários esteja vazia */}
      {users.length === 0 && (
        <p className="community-list-empty">
          Nenhum membro na comunidade ainda.
        </p>
      )}
    </div>
  );
};
