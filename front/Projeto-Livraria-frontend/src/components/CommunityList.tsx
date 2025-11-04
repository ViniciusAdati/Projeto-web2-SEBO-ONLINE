import React from "react";
import "../styles/CommunityList.css"; // Certifique-se que o path está correto e o arquivo existe
import { FaUserCircle } from "react-icons/fa"; // Ícone padrão

// Interface para os dados do usuário vindos do backend
interface CommunityUser {
  id: number;
  name: string;
  totalLivros: number; // Propriedade com a contagem de livros
  // avatarUrl?: string; // Descomente se o backend enviar
}

// Interface para as props do componente
interface CommunityListProps {
  users: CommunityUser[]; // Espera receber um array de usuários
}

// Componente funcional que recebe a lista de usuários via props
export const CommunityList: React.FC<CommunityListProps> = ({ users }) => {
  return (
    // Use a classe CSS apropriada (pode ser a antiga .top-traders-list)
    <div className="top-traders-list">
      <h3>Comunidade</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {/* Ícone ou Imagem de Avatar */}
            {/* Se tiver avatarUrl: <img src={user.avatarUrl || '/default-avatar.png'} alt={user.name} className="trader-avatar" /> */}
            <FaUserCircle size={30} className="trader-avatar-placeholder" />

            {/* Informações do Usuário */}
            <div className="trader-info">
              <span className="trader-name">{user.name}</span>
              {/* Exibe a contagem de livros */}
              <span className="trader-trades">
                {user.totalLivros} {user.totalLivros === 1 ? "livro" : "livros"}
              </span>
            </div>

            {/* As estrelas foram removidas */}
          </li>
        ))}
      </ul>
      {/* Mensagem caso a lista esteja vazia */}
      {users.length === 0 && (
        <p style={{ textAlign: "center", padding: "10px" }}>
          Nenhum membro na comunidade ainda.
        </p>
      )}
    </div>
  );
};

// Default export pode não ser necessário se você usa exportação nomeada
// export default CommunityList;
