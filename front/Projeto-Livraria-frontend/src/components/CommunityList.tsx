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

export const CommunityList: React.FC<CommunityListProps> = ({ users }) => {
  return (
    <div className="top-traders-list">
      <h3>Comunidade</h3>
      <ul>
        {users.map((user) => (
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

      {users.length === 0 && (
        <p className="community-list-empty">
          Nenhum membro na comunidade ainda.
        </p>
      )}
    </div>
  );
};
