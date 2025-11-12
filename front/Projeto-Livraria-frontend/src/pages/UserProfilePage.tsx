import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "../services/userService";
import { getBooksForPublicProfile } from "../services/inventoryService";
import { initiateChatApi } from "../services/chatService";
import type { IUserPublic } from "../services/userService";
import type { IBookInventory } from "../services/inventoryService";
import "../styles/CommunityList.css";

export function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<IUserPublic | null>(null);
  const [books, setBooks] = useState<IBookInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID de usuário não fornecido.");
      setLoading(false);
      return;
    }
    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await getUserById(id);
        const userBooks = await getBooksForPublicProfile(id);
        setUser(userData);
        setBooks(userBooks);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, [id]);

  const handleStartChat = async () => {
    if (!id) return;
    try {
      const response = await initiateChatApi(id);
      const { negociacaoId } = response;
      navigate(`/chat/${negociacaoId}`);
    } catch (err: any) {
      alert(`Erro ao iniciar chat: ${err.message}`);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <p style={{ textAlign: "center", padding: "2rem" }}>
          Carregando perfil...
        </p>
      );
    }
    if (error || !user) {
      return (
        <p style={{ textAlign: "center", padding: "2rem", color: "red" }}>
          Erro: {error || "Usuário não encontrado."}
        </p>
      );
    }
    return (
      <>
        <h2>Livros disponíveis de {user.nome}</h2>
        {books.length === 0 ? (
          <p style={{ textAlign: "center", padding: "1rem" }}>
            Este usuário não tem nenhum livro para troca no momento.
          </p>
        ) : (
          <div
            className="user-grid"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            }}
          >
            {books.map((book) => (
              <div key={book.inventario_id} className="book-card">
                <div className="book-card-image">
                  <img src={book.url_capa} alt={book.titulo} />
                  <span className="book-card-tag promo">
                    {book.estado_conservacao}
                  </span>
                </div>
                <h3 className="book-card-title">{book.titulo}</h3>
                <div className="book-card-price">
                  <span className="new-price">
                    R${" "}
                    {parseFloat(book.valor_troca.toString())
                      .toFixed(2)
                      .replace(".", ",")}
                  </span>
                </div>
                <span className="installments">
                  Postado por: {book.nome_usuario}
                </span>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h2>Página de Perfil do Usuário</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : user ? (
          <>
            <h1>{user.nome}</h1>
            <p>
              Membro desde: {new Date(user.data_cadastro).toLocaleDateString()}
            </p>
            <button className="auth-button" onClick={handleStartChat}>
              Iniciar Chat com {user.nome}
            </button>
          </>
        ) : (
          <p style={{ color: "red" }}>{error}</p>
        )}

        <hr style={{ margin: "2rem 0" }} />
        {renderContent()}
      </main>
    </div>
  );
}
